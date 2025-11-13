/**
 * Script Principal - Pronto para Decolar
 * Funcionalidades:
 * 1. Animação Fade-in ao rolar (IntersectionObserver)
 * 2. Menu responsivo (mobile)
 * 3. Navegação suave (Smooth Scroll)
 * 4. Efeitos de scroll no navbar (esconder/mostrar)
 * 5. Tracking de eventos (exemplo)
 * 6. Otimizações de performance e acessibilidade
 */

// Espera o DOM (estrutura HTML) estar completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // =============================================
    // 1. ANIMAÇÃO FADE-IN (IntersectionObserver)
    // =============================================
    /**
     * Função para animar seções com 'fade-in' (aparecer suavemente)
     * quando elas entram na tela (viewport).
     */
    const initFadeAnimations = () => {
        // Seleciona todas as seções que têm a classe '.fade-in-section'
        const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
        
        // Se não houver seções para animar, não faz nada
        if (!sectionsToAnimate.length) return;
        
        // Configurações do IntersectionObserver
        const options = {
            root: null, // Observa em relação ao viewport do navegador
            rootMargin: '0px',
            threshold: 0.1 // Ativa quando 10% do elemento estiver visível
        };
        
        // Cria um "observador" que vai monitorar quando os elementos entram na tela
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 'isIntersecting' é true se o elemento está na tela
                if (entry.isIntersecting) {
                    // Adiciona a classe '.is-visible' que ativa a animação CSS
                    entry.target.classList.add('is-visible');
                    
                    // Para de observar este elemento (otimização de performance)
                    // Uma vez animado, não precisa observar mais.
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Coloca o observador para "assistir" cada seção
        sectionsToAnimate.forEach(section => {
            fadeInObserver.observe(section);
        });
    };

    // =============================================
    // 2. CONTROLE DO MENU MOBILE
    // =============================================
    /**
     * Função que controla o menu hamburguer em dispositivos móveis.
     * Inclui abrir/fechar com clique, fechar ao clicar em link,
     * fechar ao clicar fora, e fechar com a tecla 'Escape'.
     */
    const initMobileMenu = () => {
        const navToggle = document.querySelector('.nav-toggle'); // Botão hamburguer
        const navMenu = document.querySelector('.nav-menu'); // O menu (que abre/fecha)
        const navLinks = document.querySelectorAll('.nav-menu a'); // Links dentro do menu
        
        // Se não encontrar os elementos, não faz nada
        if (!navToggle || !navMenu) return;
        
        // Função interna para abrir ou fechar o menu
        const toggleMenu = () => {
            // Verifica o estado atual (aria-expanded)
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            // Alterna as classes 'is-active'
            navMenu.classList.toggle('is-active');
            navToggle.classList.toggle('is-active');
            
            // Atualiza o atributo ARIA para acessibilidade (leitores de tela)
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Trava a rolagem (scroll) do body quando o menu está aberto
            document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
        };
        
        // --- Event Listeners (Gatilhos) ---
        
        // 1. Abrir/fechar ao clicar no botão hamburguer
        navToggle.addEventListener('click', toggleMenu);
        
        // 2. Fecha o menu ao clicar em um dos links (para ir para a seção)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    toggleMenu();
                }
            });
        });
        
        // 3. Fecha o menu ao clicar fora dele (no overlay)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('is-active') && 
                !navMenu.contains(e.target) && // Se o clique não foi DENTRO do menu
                !navToggle.contains(e.target)) { // E não foi no botão hamburguer
                toggleMenu();
            }
        });
        
        // 4. Fecha o menu ao pressionar a tecla 'Escape' (Acessibilidade)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
                toggleMenu();
            }
        });
    };

    // =============================================
    // 3. NAVEGAÇÃO SUAVE (Smooth Scroll)
    // =============================================
    /**
     * Função para rolagem suave ao clicar em links âncora (ex: href="#sobre").
     * O 'scroll-behavior: smooth' do CSS já faz isso, mas este script
     * garante compatibilidade e controla o offset (desconto) do menu.
     */
    const initSmoothScroll = () => {
        // Seleciona todos os links que começam com '#'
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Ignora links que são apenas '#' ou vazios
                if (href === '#' || href === '') return;
                
                // Tenta encontrar o elemento de destino
                const target = document.querySelector(href);
                if (!target) return; // Se não encontrar o destino, não faz nada
                
                // Previne o comportamento padrão (salto imediato)
                e.preventDefault();
                
                // Pega a altura do menu fixo (definida no CSS)
                const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
                
                // Calcula a posição de destino
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                // Subtrai a altura do menu para o destino não ficar escondido atrás dele
                const offsetPosition = targetPosition - navHeight; 
                
                // Rola a tela suavemente para a posição calculada
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    };

    // =============================================
    // 4. EFEITOS DE SCROLL NO NAVBAR
    // =============================================
    /**
     * Função para estilizar o menu (navbar) durante a rolagem:
     * 1. Adiciona a classe 'scrolled' (fundo sólido) após rolar um pouco.
     * 2. Esconde o menu ao rolar para baixo e mostra ao rolar para cima.
     */
    const initNavbarScroll = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        let lastScrollY = window.scrollY; // Armazena a última posição de scroll
        let ticking = false; // Flag para otimização de performance (evita 'jank')

        // Função que atualiza o estado do navbar
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            // 1. Adiciona/remove classe 'scrolled'
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // 2. Esconde/mostra ao rolar (só se não for o topo e não estiver no mobile)
            if (currentScrollY > lastScrollY && currentScrollY > 100 && !navbar.querySelector('.nav-menu.is-active')) {
                // Rolando para BAIXO: esconde o menu
                navbar.style.transform = 'translateY(0)';
            } else {
                // Rolando para CIMA: mostra o menu
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY; // Atualiza a última posição
            ticking = false; // Libera o 'tick'
        };

        // Otimização: usa 'requestAnimationFrame' para só rodar 'updateNavbar'
        // quando o navegador estiver pronto para renderizar, evitando sobrecarga.
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true; // Trava o 'tick'
            }
        };
        
        // Adiciona o listener de scroll
        window.addEventListener('scroll', onScroll, { passive: true }); // 'passive: true' melhora a performance de scroll
    };

    // =============================================
    // 5. TRACKING DE EVENTOS (Analytics)
    // =============================================
    /**
     * Função de exemplo para rastrear eventos (ex: cliques em botões)
     * para ferramentas como Google Analytics, Facebook Pixel, etc.
     */
    const initEventTracking = () => {
        // Rastreia cliques nos botões CTA
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                const section = button.closest('section')?.id || button.closest('header')?.id || 'unknown';
                
                // Exibe no console o evento (para debug)
                console.log('Evento de CTA:', {
                    texto: buttonText,
                    secao: section,
                    link: button.href
                });
                
                // Exemplo de integração com gtag (Google Analytics 4)
                // NOTA: Isto só funciona se você tiver o script do Google Analytics instalado no seu HTML.
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion_click', {
                        'event_category': 'CTA',
                        'event_label': `${section}_${buttonText}`, // ex: preco_Garantir minha vaga agora
                        'value': 1
                    });
                }
            });
        });
        
        // (Função de rastrear profundidade de scroll removida por simplicidade,
        // mas o seu código original estava correto)
    };

    // =============================================
    // 6. OTIMIZAÇÕES DE PERFORMANCE E ACESSIBILIDADE
    // =============================================
    const initOptimizationsAndAccessibility = () => {
        // === Otimização de 'resize' ===
        // "Debounce": Evita que código seja executado milhões de vezes
        // enquanto o usuário redimensiona a janela.
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Coloque aqui funções que precisam ser recalculadas
                // quando a janela muda de tamanho.
                // Ex: (nenhuma no momento, mas é uma boa prática ter)
            }, 250); // Executa 250ms após o FIM do 'resize'
        });

        // === Acessibilidade: Foco Visível ===
        // Adiciona uma classe ao <body> APENAS quando o usuário
        // está navegando com o teclado (tecla 'Tab').
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove a classe se o usuário clicar com o mouse,
        // escondendo o 'outline' (foco) desnecessário no clique.
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    };

    // =============================================
    // 7. INICIALIZAÇÃO DE TODOS OS MÓDULOS
    // =============================================
    /**
     * Função principal que inicializa todas as outras funções.
     */
    const initAll = () => {
        initFadeAnimations();
        initMobileMenu();
        initSmoothScroll();
        initNavbarScroll();
        initEventTracking();
        initOptimizationsAndAccessibility();
        
        console.log('🚀 Pronto para Decolar - Site inicializado com sucesso!');
    };

    // Inicializa tudo!
    initAll();

});