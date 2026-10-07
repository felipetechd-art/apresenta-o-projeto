let _syncHandler = null;

export class PresentationGovernanceDraftRepository {
  static get indexKey() { return '@PGE:presentations:index'; }
  static draftKey(sessionId) { return `@PGE:presentations:${sessionId}:governanceDraft`; }

  static setSyncHandler(handler) {
    _syncHandler = handler;
  }

  static save(sessionId, draft) {
    const payload = { ...draft, updatedAt: draft?.updatedAt || new Date().toISOString() };
    localStorage.setItem(this.draftKey(sessionId), JSON.stringify(payload));
    this._updateIndex(sessionId, payload);

    if (_syncHandler) {
      try {
        _syncHandler(sessionId, payload);
      } catch (err) {
        console.error('[Repository] Error calling sync handler in save:', err);
      }
    }
  }

  static saveFromCloud(sessionId, draft, cloudMeta = {}) {
    if (!sessionId) return;
    const payload = { 
      ...draft, 
      updatedAt: draft?.updatedAt || cloudMeta?.updatedAt || new Date().toISOString(),
      status: draft?.status || cloudMeta?.status || 'draft',
      companyId: draft?.companyId || cloudMeta?.companyId || null,
      presentationSessionId: sessionId
    };
    try {
      localStorage.setItem(this.draftKey(sessionId), JSON.stringify(payload));
      
      const indexStr = localStorage.getItem(this.indexKey);
      let index = indexStr ? JSON.parse(indexStr) : {};
      index[sessionId] = {
        presentationSessionId: sessionId,
        name: draft?.clientInfo?.name || cloudMeta?.name || index[sessionId]?.name || 'Cliente',
        company: draft?.clientInfo?.company || cloudMeta?.company || index[sessionId]?.company || '',
        updatedAt: payload.updatedAt,
        status: payload.status,
        companyId: payload.companyId
      };
      localStorage.setItem(this.indexKey, JSON.stringify(index));
    } catch (e) {
      console.warn('[Repository] Failed to write cloud draft to localStorage:', e);
    }
  }

  static findBySessionId(sessionId) {
    const data = localStorage.getItem(this.draftKey(sessionId));
    return data ? JSON.parse(data) : null;
  }

  static update(sessionId, updates) {
    const existing = this.findBySessionId(sessionId) || {};
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.save(sessionId, merged);
    return merged;
  }

  static remove(sessionId) {
    localStorage.removeItem(this.draftKey(sessionId));
    const indexStr = localStorage.getItem(this.indexKey);
    let index = indexStr ? JSON.parse(indexStr) : {};
    delete index[sessionId];
    localStorage.setItem(this.indexKey, JSON.stringify(index));
  }

  static list() {
    const data = localStorage.getItem(this.indexKey);
    return data ? JSON.parse(data) : {};
  }

  static _updateIndex(sessionId, draft) {
    const indexStr = localStorage.getItem(this.indexKey);
    let index = indexStr ? JSON.parse(indexStr) : {};
    index[sessionId] = {
      presentationSessionId: sessionId,
      name: draft.clientInfo?.name || draft.name || index[sessionId]?.name || 'Cliente',
      company: draft.clientInfo?.company || draft.company || index[sessionId]?.company || '',
      updatedAt: draft.updatedAt || new Date().toISOString(),
      status: draft.status || index[sessionId]?.status || 'draft',
      companyId: draft.companyId || index[sessionId]?.companyId || null
    };
    localStorage.setItem(this.indexKey, JSON.stringify(index));
  }
}
