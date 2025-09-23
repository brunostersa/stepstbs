// ========================================
// CONFIGURAÇÃO DA API - INTEGRAÇÃO BACKEND
// ========================================

// Configurações da API
const API_CONFIG = {
    // URLs base - ajustar conforme ambiente
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://api.tbs.com.br' 
        : 'http://localhost:3000/api',
    
    // Endpoints específicos
    ENDPOINTS: {
        // Autenticação
        AUTH: {
            LOGIN: '/auth/login',
            REFRESH: '/auth/refresh',
            LOGOUT: '/auth/logout',
            VERIFY: '/auth/verify'
        },
        
        // Dados do usuário
        USER: {
            PROFILE: '/user/profile',
            STATUS: '/user/status',
            TIMELINE: '/user/timeline'
        },
        
        // Cenários e resultados
        SCENARIOS: {
            GET_STATUS: '/scenarios/status',
            UPDATE_STATUS: '/scenarios/update',
            GET_CHALLENGES: '/scenarios/challenges'
        },
        
        // Formulários e conversões
        FORMS: {
            TBS_2026_OPTIN: '/forms/tbs2026-optin',
            CHALLENGE_SUBMISSION: '/forms/challenge-submission'
        }
    },
    
    // Headers padrão
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Timeouts
    TIMEOUTS: {
        REQUEST: 10000, // 10 segundos
        UPLOAD: 30000   // 30 segundos para uploads
    }
};

// ========================================
// CLASSE PRINCIPAL DA API
// ========================================

class TBSApiClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
        this.timeouts = API_CONFIG.TIMEOUTS;
        this.authToken = this.getStoredToken();
    }

    // ========================================
    // MÉTODOS DE AUTENTICAÇÃO
    // ========================================
    
    /**
     * Obtém token armazenado no localStorage
     */
    getStoredToken() {
        return localStorage.getItem('tbs_auth_token');
    }

    /**
     * Armazena token no localStorage
     */
    setStoredToken(token) {
        localStorage.setItem('tbs_auth_token', token);
        this.authToken = token;
    }

    /**
     * Remove token do localStorage
     */
    clearStoredToken() {
        localStorage.removeItem('tbs_auth_token');
        this.authToken = null;
    }

    /**
     * Verifica se usuário está autenticado
     */
    isAuthenticated() {
        return !!this.authToken;
    }

    // ========================================
    // MÉTODOS DE REQUISIÇÃO
    // ========================================
    
    /**
     * Faz requisição HTTP genérica
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                ...this.defaultHeaders,
                ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeouts.REQUEST);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ========================================
    // MÉTODOS ESPECÍFICOS DA API
    // ========================================
    
    /**
     * Obtém status atual do usuário no TBS
     */
    async getUserStatus() {
        return await this.request(API_CONFIG.ENDPOINTS.USER.STATUS);
    }

    /**
     * Obtém timeline do usuário
     */
    async getUserTimeline() {
        return await this.request(API_CONFIG.ENDPOINTS.USER.TIMELINE);
    }

    /**
     * Obtém perfil do usuário
     */
    async getUserProfile() {
        return await this.request(API_CONFIG.ENDPOINTS.USER.PROFILE);
    }

    /**
     * Obtém cenário baseado no status do usuário
     */
    async getScenarioByStatus() {
        const status = await this.getUserStatus();
        return this.mapStatusToScenario(status);
    }

    /**
     * Mapeia status do backend para cenário do frontend
     */
    mapStatusToScenario(status) {
        const scenarioMapping = {
            'rejected_initial': 'rejected-initial',
            'waiting_270_100': 'waiting-270-100',
            'passed_270': 'passed-270',
            'passed_100': 'passed-100',
            'passed_20': 'passed-20',
            'rejected_etapa2': 'rejected-p1',  // Mapeia para o ID existente
            'rejected_etapa3': 'rejected-p2'   // Mapeia para o ID existente
        };

        return scenarioMapping[status.stage] || 'rejected-initial';
    }

    /**
     * Envia opt-in para TBS 2026
     */
    async submitTBS2026OptIn(optInData) {
        return await this.request(API_CONFIG.ENDPOINTS.FORMS.TBS_2026_OPTIN, {
            method: 'POST',
            body: JSON.stringify(optInData)
        });
    }

    /**
     * Envia submissão de desafio
     */
    async submitChallenge(challengeData) {
        return await this.request(API_CONFIG.ENDPOINTS.FORMS.CHALLENGE_SUBMISSION, {
            method: 'POST',
            body: JSON.stringify(challengeData)
        });
    }

    /**
     * Obtém desafios da etapa atual
     */
    async getCurrentChallenges() {
        return await this.request(API_CONFIG.ENDPOINTS.SCENARIOS.GET_CHALLENGES);
    }

    // ========================================
    // MÉTODOS DE AUTENTICAÇÃO
    // ========================================
    
    /**
     * Faz login do usuário
     */
    async login(credentials) {
        const response = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.token) {
            this.setStoredToken(response.token);
        }

        return response;
    }

    /**
     * Faz logout do usuário
     */
    async logout() {
        try {
            await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST'
            });
        } finally {
            this.clearStoredToken();
        }
    }

    /**
     * Verifica se token ainda é válido
     */
    async verifyToken() {
        try {
            await this.request(API_CONFIG.ENDPOINTS.AUTH.VERIFY);
            return true;
        } catch (error) {
            this.clearStoredToken();
            return false;
        }
    }
}

// ========================================
// INSTÂNCIA GLOBAL DA API
// ========================================

// Cria instância global da API
window.tbsApi = new TBSApiClient();

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TBSApiClient, API_CONFIG };
}
