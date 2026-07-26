export class PresentationGovernanceDraftRepository {
  static get indexKey() { return '@PGE:presentations:index'; }
  static draftKey(sessionId) { return `@PGE:presentations:${sessionId}:governanceDraft`; }

  static save(sessionId, draft) {
    const payload = { ...draft, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.draftKey(sessionId), JSON.stringify(payload));
    this._updateIndex(sessionId, draft);
  }

  static findBySessionId(sessionId) {
    const data = localStorage.getItem(this.draftKey(sessionId));
    return data ? JSON.parse(data) : null;
  }

  static update(sessionId, updates) {
    const existing = this.findBySessionId(sessionId) || {};
    this.save(sessionId, { ...existing, ...updates });
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
      name: draft.clientInfo?.name || 'Cliente',
      company: draft.clientInfo?.company || '',
      updatedAt: new Date().toISOString(),
      status: 'draft',
      companyId: null
    };
    localStorage.setItem(this.indexKey, JSON.stringify(index));
  }
}
