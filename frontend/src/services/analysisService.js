import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const FINDINGS_COLLECTION = 'findings';
const ACTION_PLANS_COLLECTION = 'action_plans';

export const analysisService = {
  // ==========================
  // FINDINGS (HIPÓTESES, EVIDÊNCIAS, GAPS)
  // ==========================

  /**
   * Salva um novo achado (Finding) gerado pelo sistema (IA) ou pelo Consultor
   */
  async createFinding(findingData) {
    try {
      const docRef = await addDoc(collection(db, FINDINGS_COLLECTION), {
        ...findingData,
        approvalStatus: findingData.approvalStatus || 'SUGERIDO_IA',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar achado (finding):", error);
      throw error;
    }
  },

  /**
   * Lista todos os achados de um determinado mapa 360
   */
  async getFindingsByDiagnostic(diagnosticId) {
    try {
      const q = query(
        collection(db, FINDINGS_COLLECTION),
        where("diagnosticId", "==", diagnosticId)
      );
      const querySnapshot = await getDocs(q);
      const findings = [];
      querySnapshot.forEach((doc) => {
        findings.push({ id: doc.id, ...doc.data() });
      });
      return findings;
    } catch (error) {
      console.error("Erro ao listar achados:", error);
      throw error;
    }
  },

  /**
   * Atualiza um achado (Aprovação do consultor, edição de texto)
   */
  async updateFinding(id, data) {
    try {
      const docRef = doc(db, FINDINGS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar achado:", error);
      throw error;
    }
  },

  // ==========================
  // PLANOS DE AÇÃO / ROADMAP
  // ==========================

  /**
   * Cria uma iniciativa no plano de 90 dias ou Roadmap
   */
  async createActionPlanInitiative(diagnosticId, planData) {
    try {
      const docRef = await addDoc(collection(db, ACTION_PLANS_COLLECTION), {
        diagnosticId,
        ...planData, // { phase: '0_30_DIAS', title: '', responsible: '' }
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar iniciativa no plano de ação:", error);
      throw error;
    }
  },

  /**
   * Lista as iniciativas agrupadas por um mapa 360
   */
  async getActionPlansByDiagnostic(diagnosticId) {
    try {
      const q = query(
        collection(db, ACTION_PLANS_COLLECTION),
        where("diagnosticId", "==", diagnosticId)
      );
      const querySnapshot = await getDocs(q);
      const plans = [];
      querySnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() });
      });
      return plans;
    } catch (error) {
      console.error("Erro ao listar plano de ação:", error);
      throw error;
    }
  }
};
