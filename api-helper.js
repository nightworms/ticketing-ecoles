/**
 * API Helper - Gère les appels API de manière sécurisée
 * ✅ Utilise config.js pour les URLs
 * ✅ Gère les erreurs uniformément
 * ✅ Pas de clés en dur
 */

class APIHelper {
  constructor() {
    // Charger depuis config.js
    if (typeof CONFIG === 'undefined') {
      console.error('⚠️ config.js non chargé. Assurez-vous que config.js est inclus avant api-helper.js');
      this.apiUrl = 'http://localhost:3000/api'; // Fallback
    } else {
      this.apiUrl = CONFIG.API_URL || CONFIG.SUPABASE_URL;
    }
  }

  /**
   * Appel API générique
   */
  async request(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // Ajouter le token JWT si présent en sessionStorage
      const auth = sessionStorage.getItem('auth');
      if (auth) {
        try {
          const authData = JSON.parse(auth);
          if (authData.token) {
            options.headers['Authorization'] = `Bearer ${authData.token}`;
          }
        } catch (e) {
          console.warn('Token invalide');
        }
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.apiUrl}${endpoint}`, options);

      // Gestion des erreurs
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Erreur API (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // ===== TICKETS =====

  async createTicket(data) {
    return this.request('POST', '/tickets', data);
  }

  async getTickets(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request('GET', `/tickets${query ? '?' + query : ''}`);
  }

  async getTicket(id) {
    return this.request('GET', `/tickets/${id}`);
  }

  async updateTicket(id, data) {
    return this.request('PATCH', `/tickets/${id}`, data);
  }

  async deleteTicket(id) {
    return this.request('DELETE', `/tickets/${id}`);
  }

  async archiveTicket(id) {
    return this.request('PATCH', `/tickets/${id}`, { statut: 'archive' });
  }

  // ===== NOTES DE SUIVI =====

  async addNote(ticketId, contenu) {
    return this.request('POST', `/tickets/${ticketId}/notes`, {
      contenu,
      created_by: this.getCurrentUser()?.id || 'anonyme'
    });
  }

  async getNotes(ticketId) {
    return this.request('GET', `/tickets/${ticketId}/notes`);
  }

  // ===== CLÔTURE =====

  async closeTicketWithToken(token) {
    return this.request('POST', `/tickets/close/${token}`);
  }

  // ===== RÉFÉRENTS =====

  async getReferents() {
    return this.request('GET', '/referents');
  }

  async getReferent(cellule) {
    return this.request('GET', `/referents/${cellule}`);
  }

  async updateReferent(cellule, data) {
    return this.request('PATCH', `/referents/${cellule}`, data);
  }

  // ===== STATISTIQUES =====

  async getStats() {
    return this.request('GET', '/stats');
  }

  async getStatsByMonth() {
    return this.request('GET', '/stats/monthly');
  }

  // ===== AUTHENTIFICATION =====

  async login(username, password) {
    const response = await this.request('POST', '/auth/login', {
      username,
      password
    });
    if (response.token) {
      sessionStorage.setItem('auth', JSON.stringify(response));
    }
    return response;
  }

  async logout() {
    sessionStorage.removeItem('auth');
    return true;
  }

  getCurrentUser() {
    const auth = sessionStorage.getItem('auth');
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  // ===== UTILITAIRES =====

  /**
   * Afficher un message toast (dans le contexte de la page)
   */
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast') || this.createToast();
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  createToast() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
  }

  /**
   * Calculer délai en jours
   */
  calcDelaiJours(dateCreation) {
    return Math.floor((Date.now() - new Date(dateCreation).getTime()) / 86400000);
  }

  /**
   * Formater date pour affichage
   */
  formatDate(date, format = 'fr-FR') {
    return new Date(date).toLocaleDateString(format, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

// Créer une instance globale
const api = new APIHelper();
