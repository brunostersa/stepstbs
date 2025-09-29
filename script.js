// Função para alternar entre cenários
function showScenario(scenarioId) {
    // Remove a classe active de todos os cenários
    const scenarios = document.querySelectorAll('.scenario');
    scenarios.forEach(scenario => {
        scenario.classList.remove('active');
    });
    
    // Remove a classe active de todos os botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.remove('btn--active');
    });
    
    // Adiciona a classe active ao cenário selecionado
    const selectedScenario = document.getElementById(scenarioId);
    if (selectedScenario) {
        selectedScenario.classList.add('active');
    }
    
    // Inicia confetes se for o cenário Reality
    if (scenarioId === 'passed-20') {
        startConfetti();
    } else {
        stopConfetti();
    }
    
    // Adiciona a classe active ao botão correspondente
    const selectedButton = document.querySelector(`[onclick="showScenario('${scenarioId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('btn--active');
    }
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mapeamento dos cenários para facilitar navegação
const scenarioMapping = {
    'rejected-initial': 'Reprovado na Seletiva Inicial',
    'passed-270': 'Passou para Top 270',
    'passed-100': 'Passou para Top 100', 
    'passed-20': 'Selecionado para Reality (Top 20)',
    'rejected-p1': 'Reprovado na Etapa 2',
    'rejected-p2': 'Reprovado na Etapa 3'
};

// Adiciona efeitos de hover nos botões CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Adiciona animação de entrada para os elementos da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Adiciona efeito de confete para etapas de sucesso
                if (entry.target.classList.contains('completed')) {
                    setTimeout(() => {
                        createConfettiEffect(entry.target);
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Adiciona funcionalidade de clique nos links do menu (simulação)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simula navegação
            const linkText = this.textContent;
            alert(`Navegando para: ${linkText}`);
        });
    });
});

// Adiciona funcionalidade aos CTAs (simulação)
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const buttonText = this.textContent;
            alert(`Ação: ${buttonText}`);
        });
    });
    
    // Funcionalidade para os formulários de radio
    const radioForms = document.querySelectorAll('.tbs-form');
    
    radioForms.forEach(form => {
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const value = this.value;
                    const scenario = form.closest('.scenario').id;
                    console.log(`Cenário: ${scenarioMapping[scenario]}, Resposta: ${value}`);
                    
                    // Simula envio do formulário
                    setTimeout(() => {
                        alert(`Obrigado! Sua resposta "${value === 'sim' ? 'Sim' : 'Não'}" foi registrada.`);
                    }, 500);
                }
            });
        });
    });
});

// Função para criar efeito de confete
function createConfettiEffect(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#10b981', '#fbbf24', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b'];
    const confettiEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐'];
    
    // Cria partículas de confete
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = rect.left + (rect.width / 2) + 'px';
            confetti.style.top = rect.top + (rect.height / 2) + 'px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.fontSize = '12px';
            
            // Alterna entre círculos coloridos e emojis
            if (Math.random() > 0.5) {
                confetti.style.backgroundColor = 'transparent';
                confetti.style.fontSize = '16px';
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            }
            
            document.body.appendChild(confetti);
            
            // Animação de queda
            const angle = (Math.random() - 0.5) * 2 * Math.PI;
            const velocity = 2 + Math.random() * 3;
            const gravity = 0.1;
            const rotation = Math.random() * 360;
            
            let x = 0;
            let y = 0;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let currentRotation = rotation;
            
            const animate = () => {
                x += vx;
                y += vy;
                vy += gravity;
                currentRotation += 5;
                
                confetti.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;
                confetti.style.opacity = 1 - (y / 200);
                
                if (y < 200 && confetti.style.opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            animate();
        }, i * 50);
    }
}

// Funções para o popup de desafios
function openChallengesPopup() {
    const popup = document.getElementById('challengesPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
    }
}

function closeChallengesPopup() {
    const popup = document.getElementById('challengesPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura scroll da página
    }
}

// Fecha popup ao clicar fora dele
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('challengesPopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeChallengesPopup();
            }
        });
    }
    
    // Fecha popup com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeChallengesPopup();
        }
    });
});

// Variáveis para controle dos confetes
let confettiInterval = null;

// Função para criar confetes (usando o mesmo efeito dos cards)
function createConfetti() {
    const heroContainer = document.querySelector('.passed-20-hero');
    if (!heroContainer) return;
    
    // Atraso de 5 segundos para não conflitar com outros confetes
    setTimeout(() => {
        createConfettiEffect(heroContainer);
    }, 5000);
}

// Função para iniciar confetes
function startConfetti() {
    // Limpa intervalo anterior se existir
    if (confettiInterval) {
        clearInterval(confettiInterval);
    }
    
    // Cria confetes imediatamente
    createConfetti();
    
    // Cria confetes a cada 5 segundos
    confettiInterval = setInterval(createConfetti, 5000);
}

// Função para parar confetes
function stopConfetti() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    
    // Remove todos os confetes existentes
    const existingConfetti = document.querySelectorAll('.confetti');
    existingConfetti.forEach(confetti => {
        if (confetti.parentElement) {
            confetti.parentElement.removeChild(confetti);
        }
    });
}

// ========================================
// INTEGRAÇÃO COM BACKEND - FUNÇÕES PRINCIPAIS
// ========================================

/**
 * Inicializa a aplicação com dados do backend
 */
async function initializeApp() {
    try {
        showLoading();
        
        // Verifica se as APIs estão disponíveis
        if (!window.tbsApi || !window.tbsData) {
            throw new Error('APIs não disponíveis');
        }
        
        // Carrega dados do usuário
        await window.tbsData.loadUserData();
        
        // Obtém cenário baseado no status do usuário
        const userScenario = window.tbsData.getCurrentScenario();
        
        // Mostra o cenário correto
        showScenario(userScenario);
        
        // Esconde seletor de cenários (modo produção)
        hideScenarioSelector();
        
    } catch (error) {
        console.error('Erro ao inicializar app:', error);
        
        // Em caso de erro, volta para modo desenvolvimento
        console.log('Voltando para modo desenvolvimento devido ao erro');
        showScenario('waiting-270-100');
        
        // Só mostra erro se não for erro de API não disponível
        if (!error.message.includes('APIs não disponíveis')) {
            showError('Não foi possível carregar seus dados. Usando modo de demonstração.');
        }
    } finally {
        hideLoading();
    }
}

/**
 * Esconde o seletor de cenários (modo produção)
 */
function hideScenarioSelector() {
    const headerNav = document.querySelector('.header__nav');
    if (headerNav) {
        headerNav.style.display = 'none';
    }
}

/**
 * Mostra loading
 */
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

/**
 * Esconde loading
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Mostra erro
 */
function showError(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorModal && errorMessage) {
        errorMessage.textContent = message;
        errorModal.style.display = 'flex';
        
        // Fecha automaticamente após 5 segundos
        autoCloseError();
    }
}

/**
 * Esconde erro
 */
function hideError() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.style.display = 'none';
        // Volta para modo desenvolvimento
        showScenario('waiting-270-100');
    }
}

/**
 * Fecha modal de erro automaticamente após 5 segundos
 */
function autoCloseError() {
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Processa formulário de opt-in TBS 2026
 */
async function handleTBS2026OptIn(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const optInValue = formData.get('tbs2026');
    
    if (!optInValue) {
        alert('Por favor, selecione uma opção.');
        return;
    }
    
    try {
        showLoading();
        await window.tbsData.submitTBS2026OptIn(optInValue);
        
        // Mostra feedback de sucesso
        alert(`Obrigado! Sua resposta "${optInValue === 'sim' ? 'Sim' : 'Não'}" foi registrada.`);
        
    } catch (error) {
        console.error('Erro ao enviar opt-in:', error);
        showError('Não foi possível registrar sua resposta. Tente novamente.');
    } finally {
        hideLoading();
    }
}

/**
 * Processa submissão de desafio
 */
async function handleChallengeSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const challengeData = {
        video_file: formData.get('video_file'),
        description: formData.get('description')
    };
    
    try {
        showLoading();
        await window.tbsData.submitChallenge(challengeData);
        
        // Mostra feedback de sucesso
        alert('Desafio enviado com sucesso!');
        
        // Fecha popup
        closeChallengesPopup();
        
    } catch (error) {
        console.error('Erro ao enviar desafio:', error);
        showError('Não foi possível enviar o desafio. Tente novamente.');
    } finally {
        hideLoading();
    }
}

// ========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ========================================

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está em modo de desenvolvimento ou produção
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.hostname === 'file' ||
                         window.location.protocol === 'file:';
    
    if (isDevelopment) {
        // Modo desenvolvimento - mantém seletor de cenários
        console.log('Modo desenvolvimento ativo - Seletor de cenários disponível');
        
        // Garante que o cenário padrão está ativo
        showScenario('waiting-270-100');
    } else {
        // Modo produção - carrega dados do backend
        // Só executa se as APIs estiverem disponíveis
        if (window.tbsApi && window.tbsData) {
            initializeApp();
        } else {
            console.warn('APIs não disponíveis - usando modo desenvolvimento');
            showScenario('waiting-270-100');
        }
    }
});

// ========================================
// FUNCIONALIDADES DE VÍDEO
// ========================================

// Função para expandir vídeo
function expandVideo(videoContainer) {
    const iframe = videoContainer.querySelector('iframe');
    if (!iframe) return;
    
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoModalPlayer');
    
    if (videoModal && videoPlayer) {
        // Copiar o iframe para o modal
        const clonedIframe = iframe.cloneNode(true);
        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(clonedIframe);
        
        // Mostrar o modal
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar o modal de vídeo
function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Limpar o player
        const videoPlayer = document.getElementById('videoModalPlayer');
        if (videoPlayer) {
            videoPlayer.innerHTML = '';
        }
    }
}
