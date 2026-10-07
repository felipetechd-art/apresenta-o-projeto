import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';

const LOCAL_STORAGE_KEY = 'pge_entrevistas';
const COLLECTION = 'interviews';

function sanitize(obj) {
  if (obj === undefined) return null;
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === undefined ? null : value))
  );
}

/**
 * Persistência das Entrevistas Iniciais — Governo Empresarial.
 *
 * Escrita em dois níveis:
 *  1. Firestore (fonte protegida no servidor pelas regras de segurança:
 *     apenas administradores ativos podem ler/escrever);
 *  2. espelho local no navegador, apenas como apoio offline/primeira carga.
 *
 * O armazenamento local nunca é a única fonte de dados.
 */
export class InterviewRepository {
  static listLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.warn('Erro ao ler entrevistas locais:', e);
      return [];
    }
  }

  static writeLocalList(list) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Erro ao gravar entrevistas locais:', e);
    }
  }

  static async save(interview) {
    if (!interview) return null;
    const id =
      interview.id ||
      `ent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const record = {
      ...interview,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: interview.createdAt || new Date().toISOString(),
      companyKey: (interview.answers?.q1_empresaNome || interview.companyKey || '')
        .trim()
        .toLowerCase(),
    };

    const list = this.listLocal();
    const index = list.findIndex((item) => item.id === id);
    if (index >= 0) list[index] = record;
    else list.unshift(record);
    this.writeLocalList(list);

    try {
      if (db) {
        await setDoc(doc(db, COLLECTION, id), sanitize(record), { merge: true });
      }
    } catch (e) {
      console.error('Erro ao salvar entrevista no Firestore:', e);
      record.syncError = true;
    }

    return record;
  }

  static async listAll() {
    const map = new Map();
    this.listLocal().forEach((item) => {
      if (item && item.id) map.set(item.id, item);
    });

    try {
      if (db) {
        const snapshot = await getDocs(query(collection(db, COLLECTION)));
        snapshot.forEach((snap) => {
          const data = snap.data();
          if (data && data.id) {
            const local = map.get(data.id);
            if (!local || new Date(data.updatedAt || 0) >= new Date(local.updatedAt || 0)) {
              map.set(data.id, data);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Não foi possível carregar entrevistas do Firestore, usando espelho local:', e);
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
    );
    this.writeLocalList(merged);
    return merged;
  }

  static async getById(id) {
    if (!id) return null;

    const local = this.listLocal().find((item) => item.id === id);
    if (local) return local;

    try {
      if (db) {
        const snap = await getDoc(doc(db, COLLECTION, id));
        if (snap.exists()) return snap.data();
      }
    } catch (e) {
      console.error('Erro ao buscar entrevista no Firestore:', e);
    }

    return null;
  }

  static async delete(id) {
    if (!id) return;
    this.writeLocalList(this.listLocal().filter((item) => item.id !== id));
    try {
      if (db) {
        await deleteDoc(doc(db, COLLECTION, id));
      }
    } catch (e) {
      console.error('Erro ao excluir entrevista no Firestore:', e);
    }
  }
}
