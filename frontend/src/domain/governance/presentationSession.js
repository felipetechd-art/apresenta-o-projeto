export class PresentationSessionService {
  static get activeKey() { return '@PGE:activePresentationSessionId'; }

  static getOrCreateSession() {
    let sessionId = localStorage.getItem(this.activeKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(this.activeKey, sessionId);
    }
    return sessionId;
  }

  static getActiveSession() {
    return localStorage.getItem(this.activeKey);
  }

  static endSession() {
    localStorage.removeItem(this.activeKey);
  }
}
