// Configurações da aplicação
const CONFIG = {
    SPOTIFY_ACCOUNT_URL: 'https://checkouttestste12.github.io/spotify6',
    SPOTIFY_SUPPORT_URL: 'https://checkouttestste12.github.io/spotify6',
    REDIRECT_DELAY: 2000 // 2 segundos
};

// Estado da aplicação
let isRedirecting = false;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função de inicialização
function initializeApp() {
    setupEventListeners();
    setupScrollAnimations();
    setupHeaderScroll();
}

// Configurar event listeners
function setupEventListeners() {
    // Botão principal de cancelamento
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancelClick);
    }

    // Modal de confirmação
    const modal = document.getElementById('cancel-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }

    if (modalConfirm) {
        modalConfirm.addEventListener('click', handleConfirmRedirect);
    }

    // Fechar modal clicando fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Navegação suave
    setupSmoothScrolling();

    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Configurar navegação suave
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar efeito do header no scroll
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });
}

// Configurar animações de scroll
function setupScrollAnimations() {
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.plan-card, .faq-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Manipular clique no botão de cancelamento
function handleCancelClick(e) {
    e.preventDefault();
    
    if (isRedirecting) {
        return;
    }

    // Adicionar feedback visual
    const button = e.target.closest('.btn');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
        showModal();
    }, 150);
}

// Mostrar modal de confirmação
function showModal() {
    const modal = document.getElementById('cancel-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no botão de confirmação
        setTimeout(() => {
            const confirmBtn = document.getElementById('modal-confirm');
            if (confirmBtn) {
                confirmBtn.focus();
            }
        }, 100);
    }
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('cancel-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Manipular confirmação de redirecionamento
function handleConfirmRedirect() {
    if (isRedirecting) {
        return;
    }

    isRedirecting = true;
    
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    // Desabilitar botões
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `
            <svg class="btn-icon loading-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Aguarde...
        `;
    }
    
    if (cancelBtn) {
        cancelBtn.disabled = true;
    }

    // Adicionar animação de loading
    const loadingIcon = document.querySelector('.loading-icon');
    if (loadingIcon) {
        loadingIcon.style.animation = 'spin 1s linear infinite';
    }

    // Mostrar mensagem de redirecionamento
    showRedirectMessage();

    // Redirecionar após delay
    setTimeout(() => {
        redirectToSpotify();
    }, CONFIG.REDIRECT_DELAY);
}

// Mostrar mensagem de redirecionamento
function showRedirectMessage() {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="modal-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <p>
                <strong>Redirecionando para o Spotify...</strong><br>
                Você será levado para a página oficial da sua conta onde poderá cancelar sua assinatura com segurança.
            </p>
            <div class="redirect-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p class="progress-text">Aguarde alguns segundos...</p>
            </div>
        `;

        // Adicionar estilos para a barra de progresso
        const style = document.createElement('style');
        style.textContent = `
            .redirect-progress {
                margin-top: 20px;
            }
            .progress-bar {
                width: 100%;
                height: 4px;
                background-color: #404040;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #1ED760, #1DB954);
                border-radius: 2px;
                animation: progressFill ${CONFIG.REDIRECT_DELAY}ms linear forwards;
            }
            .progress-text {
                font-size: 14px;
                color: #b3b3b3;
                margin: 0;
            }
            @keyframes progressFill {
                from { width: 0%; }
                to { width: 100%; }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Redirecionar para o Spotify
function redirectToSpotify() {
    try {
        // Log para debug (pode ser removido em produção)
        console.log('Redirecionando para:', CONFIG.SPOTIFY_ACCOUNT_URL);
        
        // Abrir em nova aba para melhor experiência do usuário
        window.open(CONFIG.SPOTIFY_ACCOUNT_URL, '_blank', 'noopener,noreferrer');
        
        // Fechar modal após redirecionamento
        setTimeout(() => {
            closeModal();
            isRedirecting = false;
            showSuccessMessage();
        }, 500);
        
    } catch (error) {
        console.error('Erro ao redirecionar:', error);
        showErrorMessage();
        isRedirecting = false;
    }
}

// Mostrar mensagem de sucesso
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-notification';
    message.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div class="notification-text">
                <strong>Redirecionamento realizado!</strong>
                <p>A página do Spotify foi aberta em uma nova aba.</p>
            </div>
        </div>
    `;

    // Adicionar estilos para a notificação
    const style = document.createElement('style');
    style.textContent = `
        .success-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1ED760, #1DB954);
            color: #000000;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(30, 215, 96, 0.3);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        }
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        .notification-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .notification-text strong {
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .notification-text p {
            font-size: 14px;
            margin: 0;
            opacity: 0.8;
        }
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(message);

    // Remover notificação após 5 segundos
    setTimeout(() => {
        message.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 5000);
}

// Mostrar mensagem de erro
function showErrorMessage() {
    alert('Erro ao redirecionar. Por favor, acesse manualmente: ' + CONFIG.SPOTIFY_ACCOUNT_URL);
    closeModal();
}

// Função para debug (pode ser removida em produção)
function debugInfo() {
    console.log('Spotify Landing Page - Debug Info:');
    console.log('- Spotify Account URL:', CONFIG.SPOTIFY_ACCOUNT_URL);
    console.log('- Spotify Support URL:', CONFIG.SPOTIFY_SUPPORT_URL);
    console.log('- Redirect Delay:', CONFIG.REDIRECT_DELAY + 'ms');
    console.log('- Is Redirecting:', isRedirecting);
}

// Adicionar função de debug ao objeto global (apenas para desenvolvimento)
if (typeof window !== 'undefined') {
    window.spotifyLandingDebug = debugInfo;
}

// Prevenção de ataques XSS básicos
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Verificação de integridade da página
function checkPageIntegrity() {
    const requiredElements = [
        'cancel-btn',
        'cancel-modal',
        'modal-confirm'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Elementos obrigatórios não encontrados:', missingElements);
    }

    return missingElements.length === 0;
}

// Verificar integridade na inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (!checkPageIntegrity()) {
        console.error('Falha na verificação de integridade da página');
    }
});

// Adicionar meta informações para SEO e segurança
function addMetaTags() {
    const metaTags = [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'referrer', content: 'no-referrer' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-Frame-Options', content: 'DENY' }
    ];

    metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        Object.keys(tag).forEach(key => {
            meta.setAttribute(key, tag[key]);
        });
        document.head.appendChild(meta);
    });
}

// Adicionar meta tags na inicialização
document.addEventListener('DOMContentLoaded', addMetaTags);

