import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'diagnostics';

export const diagnosticService = {
  /**
   * Cria um novo mapa 360 na fase de ONBOARDING
   */
  async createDiagnostic(companyId, kickoffData = {}) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        companyId,
        status: 'ONBOARDING',
        kickoffData,
        schedule: {},
        scores: {},
        weights_snapshot: null, // Será preenchido com as configurações ativas
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar mapa 360:", error);
      throw error;
    }
  },

  /**
   * Busca um mapa 360 pelo ID
   */
  async getDiagnosticById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar mapa 360:", error);
      throw error;
    }
  },

  /**
   * Lista todos os mapas 360 (opcional: por empresa)
   */
  async listDiagnostics(companyId = null) {
    try {
      let q = collection(db, COLLECTION_NAME);
      if (companyId) {
        q = query(q, where("companyId", "==", companyId));
      }
      const querySnapshot = await getDocs(q);
      const diagnostics = [];
      querySnapshot.forEach((doc) => {
        diagnostics.push({ id: doc.id, ...doc.data() });
      });
      return diagnostics;
    } catch (error) {
      console.error("Erro ao listar mapas 360:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um mapa 360 (ex: status, scores, schedule)
   */
  async updateDiagnostic(id, data) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar mapa 360:", error);
      throw error;
    }
  },

  /**
   * Avança o status do mapa 360 no pipeline
   */
  async updateStatus(id, newStatus) {
    return this.updateDiagnostic(id, { status: newStatus });
  }
};
