// ========================================
// DATA MANAGER - GERENCIAMENTO DE DADOS
// ========================================

class TBSDataManager {
    constructor() {
        this.currentUser = null;
        this.currentScenario = null;
        this.timelineData = null;
        this.isLoading = false;
        this.error = null;
        
        // Event listeners
        this.listeners = {
            'userLoaded': [],
            'scenarioChanged': [],
            'dataUpdated': [],
            'error': []
        };
    }

    // ========================================
    // MÉTODOS DE EVENTOS
    // ========================================
    
    /**
     * Adiciona listener para eventos
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * Remove listener
     */
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emite evento para todos os listeners
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // ========================================
    // MÉTODOS DE CARREGAMENTO DE DADOS
    // ========================================
    
    /**
     * Carrega dados iniciais do usuário
     */
    async loadUserData() {
        this.setLoading(true);
        this.clearError();

        try {
            // Verifica se usuário está autenticado
            if (!window.tbsApi.isAuthenticated()) {
                throw new Error('Usuário não autenticado');
            }

            // Carrega dados em paralelo
            const [userProfile, userStatus, timelineData] = await Promise.all([
                window.tbsApi.getUserProfile(),
                window.tbsApi.getUserStatus(),
                window.tbsApi.getUserTimeline()
            ]);

            // Atualiza dados locais
            this.currentUser = userProfile;
            this.timelineData = timelineData;
            this.currentScenario = this.mapStatusToScenario(userStatus);

            // Emite eventos
            this.emit('userLoaded', {
                user: this.currentUser,
                status: userStatus,
                timeline: this.timelineData
            });

            this.emit('scenarioChanged', this.currentScenario);

        } catch (error) {
            this.setError(error);
            throw error;
        } finally {
            this.setLoading(false);
        }
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
     * Atualiza cenário atual
     */
    async updateScenario(newScenario) {
        if (this.currentScenario !== newScenario) {
            this.currentScenario = newScenario;
            this.emit('scenarioChanged', newScenario);
        }
    }

    // ========================================
    // MÉTODOS DE FORMULÁRIOS
    // ========================================
    
    /**
     * Processa opt-in para TBS 2026
     */
    async submitTBS2026OptIn(optInValue) {
        this.setLoading(true);
        this.clearError();

        try {
            const response = await window.tbsApi.submitTBS2026OptIn({
                user_id: this.currentUser?.id,
                opt_in: optInValue,
                timestamp: new Date().toISOString()
            });

            this.emit('dataUpdated', { type: 'tbs2026_optin', data: response });
            return response;

        } catch (error) {
            this.setError(error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Processa submissão de desafio
     */
    async submitChallenge(challengeData) {
        this.setLoading(true);
        this.clearError();

        try {
            const response = await window.tbsApi.submitChallenge({
                user_id: this.currentUser?.id,
                challenge_data: challengeData,
                timestamp: new Date().toISOString()
            });

            this.emit('dataUpdated', { type: 'challenge_submission', data: response });
            return response;

        } catch (error) {
            this.setError(error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    // ========================================
    // MÉTODOS DE ESTADO
    // ========================================
    
    /**
     * Define estado de loading
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.emit('dataUpdated', { type: 'loading', data: loading });
    }

    /**
     * Define erro
     */
    setError(error) {
        this.error = error;
        this.emit('error', error);
    }

    /**
     * Limpa erro
     */
    clearError() {
        this.error = null;
    }

    // ========================================
    // MÉTODOS DE GETTERS
    // ========================================
    
    /**
     * Obtém dados do usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Obtém cenário atual
     */
    getCurrentScenario() {
        return this.currentScenario;
    }

    /**
     * Obtém dados da timeline
     */
    getTimelineData() {
        return this.timelineData;
    }

    /**
     * Obtém estado de loading
     */
    isLoading() {
        return this.isLoading;
    }

    /**
     * Obtém erro atual
     */
    getError() {
        return this.error;
    }

    // ========================================
    // MÉTODOS DE UTILIDADE
    // ========================================
    
    /**
     * Verifica se dados foram carregados
     */
    hasData() {
        return !!(this.currentUser && this.currentScenario);
    }

    /**
     * Reseta todos os dados
     */
    reset() {
        this.currentUser = null;
        this.currentScenario = null;
        this.timelineData = null;
        this.isLoading = false;
        this.error = null;
    }
}

// ========================================
// INSTÂNCIA GLOBAL DO DATA MANAGER
// ========================================

// Cria instância global
window.tbsData = new TBSDataManager();

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TBSDataManager;
}
