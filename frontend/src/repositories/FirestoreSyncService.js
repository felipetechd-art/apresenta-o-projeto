import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { StorageHelper } from './StorageHelper';
import { PresentationGovernanceDraftRepository } from './PresentationGovernanceDraftRepository';

export class FirestoreSyncService {
  /**
   * Remove campos undefined recursivamente para que o Firestore nunca rejeite a gravação
   */
  static sanitizeForFirestore(obj) {
    if (obj === undefined) return null;
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value === undefined) return null;
      return value;
    }));
  }

  /**
   * Sincroniza um draft/proposta individual para o Firestore
   */
  static async syncDraftToCloud(sessionId, draft) {
    if (!sessionId) return;
    try {
      const docId = sessionId;
      const docRef = doc(db, 'clients', docId);

      const payload = this.sanitizeForFirestore({
        presentationSessionId: sessionId,
        companyId: draft?.companyId || null,
        name: draft?.clientInfo?.name || draft?.name || 'Cliente',
        company: draft?.clientInfo?.company || draft?.company || '',
        clientEmail: draft?.clientInfo?.email || draft?.clientEmail || null,
        status: draft?.status || 'draft',
        updatedAt: draft?.updatedAt || new Date().toISOString(),
        fullData: draft,
        monthly_snapshots: StorageHelper.getItem('monthly_snapshots', [], draft?.companyId || `draft-${sessionId}`) || [],
        roadmap_tasks: StorageHelper.getItem('roadmap_tasks', [], draft?.companyId || `draft-${sessionId}`) || []
      });

      await setDoc(docRef, payload, { merge: true });
      console.log(`[CloudSync] Sincronizado para Firestore: ${sessionId}`);
    } catch (error) {
      console.error(`[CloudSync] Erro ao sincronizar draft para a nuvem:`, error);
    }
  }

  /**
   * Sincroniza TODOS os registros locais para a nuvem (para que o que foi feito na web vá para o mobile)
   */
  static async syncAllLocalDraftsToCloud() {
    try {
      const list = PresentationGovernanceDraftRepository.list();
      const items = Object.values(list);
      if (items.length === 0) return;

      for (const item of items) {
        if (!item.presentationSessionId || item.status === 'archived') continue;
        const fullData = PresentationGovernanceDraftRepository.findBySessionId(item.presentationSessionId);
        const draft = fullData || {
          clientInfo: { name: item.name, company: item.company },
          name: item.name,
          company: item.company,
          status: item.status,
          companyId: item.companyId,
          updatedAt: item.updatedAt
        };
        await this.syncDraftToCloud(item.presentationSessionId, draft);
      }
      console.log(`[CloudSync] ${items.length} itens locais sincronizados para a nuvem.`);
    } catch (error) {
      console.error(`[CloudSync] Erro ao sincronizar todos os registros:`, error);
    }
  }

  /**
   * Lê todos os dados locais associados a uma empresa/sessão e salva no Firestore
   * (Mantido para compatibilidade com ativação de cliente)
   */
  static async syncToCloud(companyId) {
    if (!companyId || companyId === 'demo-company') return;

    try {
      const draftList = PresentationGovernanceDraftRepository.list();
      const clientDraft = Object.values(draftList).find(
        (draft) => draft.companyId === companyId || draft.presentationSessionId === companyId
      );

      const fullData = clientDraft ? PresentationGovernanceDraftRepository.findBySessionId(clientDraft.presentationSessionId) : null;

      const payload = this.sanitizeForFirestore({
        companyId,
        presentationSessionId: clientDraft?.presentationSessionId || null,
        name: fullData?.clientInfo?.name || clientDraft?.name || 'Cliente',
        company: fullData?.clientInfo?.company || clientDraft?.company || '',
        clientEmail: clientDraft?.clientEmail || fullData?.clientInfo?.email || null,
        status: clientDraft?.status || 'active',
        updatedAt: new Date().toISOString(),
        fullData: fullData || null,
        monthly_snapshots: StorageHelper.getItem('monthly_snapshots', [], companyId) || [],
        roadmap_tasks: StorageHelper.getItem('roadmap_tasks', [], companyId) || [],
      });

      // Salva tanto com ID da company quanto da session se disponível
      const docRef = doc(db, 'clients', companyId);
      await setDoc(docRef, payload, { merge: true });

      if (clientDraft?.presentationSessionId && clientDraft.presentationSessionId !== companyId) {
        const sessionDocRef = doc(db, 'clients', clientDraft.presentationSessionId);
        await setDoc(sessionDocRef, payload, { merge: true });
      }

      console.log(`[CloudSync] Sincronizado para a nuvem: ${companyId}`);
    } catch (error) {
      console.error(`[CloudSync] Erro ao sincronizar para a nuvem:`, error);
    }
  }

  /**
   * Baixa os dados da nuvem (Firestore) e joga para o localStorage
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
        if (data.fullData && data.presentationSessionId) {
          PresentationGovernanceDraftRepository.saveFromCloud(data.presentationSessionId, data.fullData, data);
        }
        
        console.log(`[CloudSync] Baixado da nuvem: ${companyId}`);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error(`[CloudSync] Erro ao baixar da nuvem:`, error);
      return null;
    }
  }

  /**
   * Busca as informações da empresa no Firestore baseando-se no sessionId da apresentação
   */
  static async getCompanyBySessionId(sessionId) {
    if (!sessionId) return null;

    try {
      const directSnap = await getDoc(doc(db, 'clients', sessionId));
      if (directSnap.exists()) {
        return directSnap.data();
      }

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

  /**
   * Busca todas as empresas e propostas salvas na nuvem e atualiza o repositório local
   */
  static async getAllClientsFromCloud() {
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const clients = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === 'archived') return;

        const sessionId = data.presentationSessionId || docSnap.id;
        const normalizedItem = {
          ...data,
          presentationSessionId: sessionId
        };
        clients.push(normalizedItem);

        // Atualiza localStorage localmente
        if (data.fullData) {
          PresentationGovernanceDraftRepository.saveFromCloud(sessionId, data.fullData, data);
        }
      });
      return clients;
    } catch (error) {
      console.error(`[CloudSync] Erro ao buscar todos os clientes:`, error);
      return [];
    }
  }

  /**
   * Listener em tempo real para sincronização bidirecional instantânea entre Web e Mobile
   */
  static subscribeToAllClients(onUpdate) {
    try {
      return onSnapshot(collection(db, 'clients'), (snapshot) => {
        const clients = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === 'archived') return;

          const sessionId = data.presentationSessionId || docSnap.id;
          const normalizedItem = {
            ...data,
            presentationSessionId: sessionId
          };
          clients.push(normalizedItem);

          if (data.fullData) {
            PresentationGovernanceDraftRepository.saveFromCloud(sessionId, data.fullData, data);
          }
        });

        if (onUpdate) {
          onUpdate(clients);
        }
      }, (error) => {
        console.error('[CloudSync] Erro no listener realtime:', error);
      });
    } catch (error) {
      console.error('[CloudSync] Falha ao registrar realtime listener:', error);
      return () => {};
    }
  }
}

// Configura o hook no repositório para salvar automaticamente no Firestore em qualquer create/update
PresentationGovernanceDraftRepository.setSyncHandler((sessionId, draft) => {
  FirestoreSyncService.syncDraftToCloud(sessionId, draft).catch(console.error);
});

