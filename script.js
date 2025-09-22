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
    'rejected-p1': 'Reprovado na P1',
    'rejected-p2': 'Reprovado na P2'
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
