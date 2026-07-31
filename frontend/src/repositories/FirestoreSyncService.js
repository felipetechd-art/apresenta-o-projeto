import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { StorageHelper } from './StorageHelper';
import { PresentationGovernanceDraftRepository } from './PresentationGovernanceDraftRepository';

export class FirestoreSyncService {
  /**
   * Lê todos os dados locais associados a uma empresa/sessão e salva no Firestore
   * @param {string} companyId - ID do cliente ativo ou sessão do draft
   */
  static async syncToCloud(companyId) {
    if (!companyId || companyId === 'demo-company') return;

    try {
      const draftList = PresentationGovernanceDraftRepository.list();
      const clientDraft = Object.values(draftList).find(
        (draft) => draft.companyId === companyId || draft.presentationSessionId === companyId
      );

      const payload = {
        companyId,
        updatedAt: new Date().toISOString(),
        clientEmail: clientDraft?.clientEmail || null,
        status: clientDraft?.status || 'draft',
        presentationSessionId: clientDraft?.presentationSessionId || null,
        
        // Dados do LocalStorage que pertencem a esse client
        monthly_snapshots: StorageHelper.getItem('monthly_snapshots', [], companyId),
        roadmap_tasks: StorageHelper.getItem('roadmap_tasks', [], companyId),
      };

      const docRef = doc(db, 'clients', companyId);
      await setDoc(docRef, payload, { merge: true });
      
      console.log(`[CloudSync] Sincronizado para a nuvem: ${companyId}`);
    } catch (error) {
      console.error(`[CloudSync] Erro ao sincronizar para a nuvem:`, error);
    }
  }

  /**
   * Baixa os dados da nuvem (Firestore) e joga para o localStorage
   * @param {string} companyId - ID do cliente
   */
  static async syncFromCloud(companyId) {
    if (!companyId || companyId === 'demo-company') return null;

    try {
      const docRef = doc(db, 'clients', companyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.monthly_snapshots) {
          StorageHelper.setItem('monthly_snapshots', data.monthly_snapshots, companyId, false);
        }
        if (data.roadmap_tasks) {
          StorageHelper.setItem('roadmap_tasks', data.roadmap_tasks, companyId, false);
        }
        
        console.log(`[CloudSync] Baixado da nuvem: ${companyId}`);
        return data; // Retorna os dados completos (incluindo clientEmail)
      }
      
      return null;
    } catch (error) {
      console.error(`[CloudSync] Erro ao baixar da nuvem:`, error);
      return null;
    }
  }

  /**
   * Busca as informações da empresa no Firestore baseando-se no sessionId da apresentação
   * @param {string} sessionId
   */
  static async getCompanyBySessionId(sessionId) {
    if (!sessionId) return null;

    try {
      const q = query(
        collection(db, 'clients'),
        where('presentationSessionId', '==', sessionId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      
      return null;
    } catch (error) {
      console.error(`[CloudSync] Erro ao buscar empresa pelo sessionId:`, error);
      return null;
    }
  }
}
