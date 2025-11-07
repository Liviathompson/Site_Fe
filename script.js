/**
 * Documentação do Script
 * Este script controla 3 funcionalidades:
 * 1. Animação "Fade-in" ao rolar (IntersectionObserver)
 * 2. Mudança de estilo do menu (navbar) ao rolar (Scroll Event)
 * 3. Menu mobile "hamburguer" (Click Event)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =============================================
    // 1. ANIMAÇÃO FADE-IN (IntersectionObserver)
    // =============================================
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    
    if (sectionsToAnimate.length > 0) {
        const options = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };
        
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(callback, options);
        sectionsToAnimate.forEach(section => {
            observer.observe(section);
        });
    }

    // =============================================
    // 2. NOVO: MUDANÇA DO MENU AO ROLAR
    // =============================================
    const navbar = document.getElementById('navbar');
    
    // Verifica se o navbar existe antes de adicionar o evento
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Se o scroll for maior que 50px
            if (window.scrollY > 50) { 
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // =============================================
    // 3. NOVO: CONTROLO DO MENU MOBILE (HAMBURGUER)
    // =============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Verifica se os elementos existem
    if (navToggle && navMenu) {
        
        // Abre/Fecha o menu ao clicar no hamburguer
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            navToggle.classList.toggle('is-active');

            // Acessibilidade: Atualiza o 'aria-expanded'
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Fecha o menu ao clicar num link (UX)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    navMenu.classList.remove('is-active');
                    navToggle.classList.remove('is-active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

});