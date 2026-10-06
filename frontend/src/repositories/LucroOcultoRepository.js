import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const LOCAL_STORAGE_KEY = 'lucro_oculto_diagnostics';

export class LucroOcultoRepository {
  /**
   * Sanitiza objetos para o Firestore (remove undefined)
   */
  static sanitize(obj) {
    if (obj === undefined) return null;
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value === undefined) return null;
      return value;
    }));
  }

  /**
   * Salva um diagnóstico localmente e no Firestore
   */
  static async save(diagnostic) {
    if (!diagnostic) return null;
    const id = diagnostic.id || `lo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const record = {
      ...diagnostic,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: diagnostic.createdAt || new Date().toISOString()
    };

    // 1. Salvar no LocalStorage
    try {
      const list = this.listLocal();
      const index = list.findIndex(item => item.id === id);
      if (index >= 0) {
        list[index] = record;
      } else {
        list.unshift(record);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }

    // 2. Salvar no Firestore
    try {
      if (db) {
        const docRef = doc(db, 'lucro_oculto_diagnostics', id);
        await setDoc(docRef, this.sanitize(record), { merge: true });
      }
    } catch (e) {
      console.error('Erro ao salvar no Firestore:', e);
    }

    return record;
  }

  /**
   * Retorna lista de diagnósticos locais
   */
  static listLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
      return [];
    }
  }

  /**
   * Retorna todos os diagnósticos (mescla nuvem + local)
   */
  static async listAll() {
    const localList = this.listLocal();
    const map = new Map();

    localList.forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });

    try {
      if (db) {
        const colRef = collection(db, 'lucro_oculto_diagnostics');
        const q = query(colRef);
        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => {
          const cloudData = docSnap.data();
          if (cloudData && cloudData.id) {
            map.set(cloudData.id, cloudData);
          }
        });
      }
    } catch (e) {
      console.warn('Não foi possível carregar do Firestore, usando dados locais:', e);
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    
    // Atualiza localmente com a lista mesclada
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch (err) {}

    return merged;
  }

  /**
   * Busca um diagnóstico por ID
   */
  static async getById(id) {
    if (!id) return null;
    
    // Tenta primeiro no local
    const local = this.listLocal().find(item => item.id === id);
    if (local) return local;

    // Tenta no Firestore
    try {
      if (db) {
        const docRef = doc(db, 'lucro_oculto_diagnostics', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data();
        }
      }
    } catch (e) {
      console.error('Erro ao buscar no Firestore:', e);
    }

    return null;
  }

  /**
   * Remove um diagnóstico
   */
  static async delete(id) {
    if (!id) return;
    try {
      const list = this.listLocal().filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}

    try {
      if (db) {
        const docRef = doc(db, 'lucro_oculto_diagnostics', id);
        await deleteDoc(docRef);
      }
    } catch (e) {
      console.error('Erro ao deletar do Firestore:', e);
    }
  }

  /**
   * Salva a resposta de um colaborador da equipe
   */
  static async saveTeamResponse(sessionId, data) {
    if (!sessionId || !data) return null;
    const responseId = `resp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const record = {
      ...data,
      id: responseId,
      sessionId,
      createdAt: new Date().toISOString()
    };

    // 1. LocalStorage
    try {
      const storageKey = `lucro_oculto_team_${sessionId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push(record);
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {
      console.warn('Erro ao salvar resposta da equipe localmente:', e);
    }

    // 2. Firestore
    try {
      if (db) {
        const docRef = doc(db, 'lucro_oculto_team_responses', responseId);
        await setDoc(docRef, this.sanitize(record));
      }
    } catch (e) {
      console.error('Erro ao salvar resposta no Firestore:', e);
    }

    return record;
  }

  /**
   * Obtém respostas da equipe para uma sessão
   */
  static async getTeamResponses(sessionId) {
    if (!sessionId) return [];
    const storageKey = `lucro_oculto_team_${sessionId}`;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {}

    const map = new Map();
    list.forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });

    try {
      if (db) {
        const colRef = collection(db, 'lucro_oculto_team_responses');
        const q = query(colRef, where('sessionId', '==', sessionId));
        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => {
          const cloudData = docSnap.data();
          if (cloudData && cloudData.id) {
            map.set(cloudData.id, cloudData);
          }
        });
      }
    } catch (e) {
      console.warn('Erro ao buscar respostas da nuvem:', e);
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    try {
      localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch (e) {}

    return merged;
  }

  /**
   * Assina em tempo real respostas da equipe para a sessão
   */
  static subscribeTeamResponses(sessionId, callback) {
    if (!sessionId) return () => {};
    const storageKey = `lucro_oculto_team_${sessionId}`;
    
    // Dispara com dados locais imediatamente
    try {
      const local = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (local.length > 0) callback(local);
    } catch (e) {}

    // Escuta na nuvem se db existir
    try {
      if (db) {
        const colRef = collection(db, 'lucro_oculto_team_responses');
        const q = query(colRef, where('sessionId', '==', sessionId));
        return onSnapshot(q, (snapshot) => {
          const cloudList = [];
          snapshot.forEach(docSnap => {
            cloudList.push(docSnap.data());
          });
          cloudList.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
          try {
            localStorage.setItem(storageKey, JSON.stringify(cloudList));
          } catch (e) {}
          callback(cloudList);
        }, (err) => {
          console.warn('Erro no listener de respostas da equipe:', err);
        });
      }
    } catch (e) {
      console.warn('Firestore indisponível para subscription:', e);
    }

    return () => {};
  }
}
