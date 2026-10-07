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

const TEMPLATES_COLLECTION = 'questionnaire_templates';
const ANSWERS_COLLECTION = 'answers';

export const questionnaireService = {
  // ==========================
  // TEMPLATES
  // ==========================

  /**
   * Cria um novo template de questionário (Ação do Admin/Felipe)
   */
  async createTemplate(templateData) {
    try {
      const docRef = await addDoc(collection(db, TEMPLATES_COLLECTION), {
        ...templateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar template de questionário:", error);
      throw error;
    }
  },

  /**
   * Retorna os templates de questionário ativos
   */
  async getTemplates(targetRole = null) {
    try {
      let q = collection(db, TEMPLATES_COLLECTION);
      if (targetRole) {
        q = query(q, where("targetRole", "==", targetRole));
      }
      const querySnapshot = await getDocs(q);
      const templates = [];
      querySnapshot.forEach((doc) => {
        templates.push({ id: doc.id, ...doc.data() });
      });
      return templates;
    } catch (error) {
      console.error("Erro ao listar templates:", error);
      throw error;
    }
  },

  /**
   * Atualiza um template de questionário (alterar perguntas ou pesos)
   */
  async updateTemplate(id, data) {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
      throw error;
    }
  },

  // ==========================
  // RESPOSTAS (ANSWERS)
  // ==========================

  /**
   * Salva as respostas de um usuário específico para um mapa 360
   */
  async saveAnswers(diagnosticId, userId, roleId, responses) {
    try {
      // Usar combinação para garantir que o usuário não responda duas vezes sem atualizar a primeira
      let q = query(
        collection(db, ANSWERS_COLLECTION),
        where("diagnosticId", "==", diagnosticId),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Atualiza resposta existente
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, ANSWERS_COLLECTION, docId), {
          responses,
          updatedAt: serverTimestamp()
        });
        return docId;
      } else {
        // Cria nova entrada
        const docRef = await addDoc(collection(db, ANSWERS_COLLECTION), {
          diagnosticId,
          userId,
          roleId,
          responses,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      throw error;
    }
  },

  /**
   * Busca todas as respostas de um determinado mapa 360
   */
  async getAnswersByDiagnostic(diagnosticId) {
    try {
      const q = query(
        collection(db, ANSWERS_COLLECTION),
        where("diagnosticId", "==", diagnosticId)
      );
      const querySnapshot = await getDocs(q);
      const answers = [];
      querySnapshot.forEach((doc) => {
        answers.push({ id: doc.id, ...doc.data() });
      });
      return answers;
    } catch (error) {
      console.error("Erro ao listar respostas do mapa 360:", error);
      throw error;
    }
  }
};
