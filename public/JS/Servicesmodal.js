/**
 * ServicesModal.js
 * Opens / closes the service detail modal.
 * Triggered by clicking .svc-card[data-service="..."]
 */

(function () {
    'use strict';

    /* ─── service data ────────────────────────────────────── */
    const lang = document.documentElement.lang || 'pt';
    const isPT = lang === 'pt';

    const services = {
        cyber: {
            number:  isPT ? 'Serviço 01' : 'Service 01',
            title:   isPT ? 'Cibersegurança' : 'Cybersecurity',
            lead:    isPT
                ? 'Proteger um sistema é tão importante como construí-lo. Identifico falhas antes que alguém as explore — com rigor técnico e sem alarmes desnecessários.'
                : 'Protecting a system is as important as building it. I identify flaws before someone exploits them — with technical rigour and without unnecessary alarm.',
            items: isPT ? [
                'Testes de intrusão (pentesting) a aplicações web e APIs',
                'Auditoria de autenticação, sessões e gestão de permissões',
                'Análise de dependências e CVEs em projetos Node.js e Python',
                'Configuração de cabeçalhos HTTP de segurança e CSP',
                'Relatório detalhado com prioridades e passos de remediação',
            ] : [
                'Penetration testing on web applications and APIs',
                'Authentication, session and permission management auditing',
                'Dependency and CVE analysis in Node.js and Python projects',
                'HTTP security headers and CSP configuration',
                'Detailed report with priorities and remediation steps',
            ],
            tags: ['OWASP Top 10', 'Burp Suite', 'Auth / JWT', 'PenTesting', 'CSP', 'Node.js', 'Python'],
            icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        },
        design: {
            number:  isPT ? 'Serviço 02' : 'Service 02',
            title:   isPT ? 'Design Moderno' : 'Modern Design',
            lead:    isPT
                ? 'Um bom design não se nota — sente-se. Crio interfaces que reduzem fricção, guiam o utilizador sem esforço e ficam na memória pelo motivo certo.'
                : 'Good design goes unnoticed — it\'s felt. I create interfaces that reduce friction, guide users effortlessly and are remembered for the right reasons.',
            items: isPT ? [
                'Design de interfaces web e mobile do zero (Figma)',
                'Sistemas de design com componentes reutilizáveis e documentação',
                'Prototipagem interativa e testes de usabilidade',
                'Implementação em HTML/CSS ou React com atenção ao detalhe',
                'Animações e micro-interações que respondem ao utilizador',
            ] : [
                'Web and mobile interface design from scratch (Figma)',
                'Design systems with reusable components and documentation',
                'Interactive prototyping and usability testing',
                'HTML/CSS or React implementation with attention to detail',
                'Animations and micro-interactions that respond to the user',
            ],
            tags: ['Figma', 'HTML / CSS', 'React', 'UI / UX', 'Design System', 'Framer Motion', 'A11y'],
            icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
        },
        ai: {
            number:  isPT ? 'Serviço 03' : 'Service 03',
            title:   isPT ? 'Inteligência Artificial' : 'Artificial Intelligence',
            lead:    isPT
                ? 'A IA só tem valor quando resolve um problema concreto. Integro LLMs e modelos preditivos no seu produto de forma pragmática — sem overpromise, com resultados mensuráveis.'
                : 'AI only has value when it solves a concrete problem. I integrate LLMs and predictive models into your product pragmatically — no overpromise, measurable results.',
            items: isPT ? [
                'Integração de APIs da OpenAI, Anthropic e modelos open-source',
                'Construção de pipelines RAG (Retrieval-Augmented Generation)',
                'Chatbots e assistentes contextuais para produtos SaaS',
                'Fine-tuning e prompt engineering para casos de uso específicos',
                'Automação de processos com agentes e ferramentas LLM',
            ] : [
                'Integration of OpenAI, Anthropic and open-source model APIs',
                'Building RAG (Retrieval-Augmented Generation) pipelines',
                'Chatbots and contextual assistants for SaaS products',
                'Fine-tuning and prompt engineering for specific use cases',
                'Process automation with LLM agents and tools',
            ],
            tags: ['OpenAI', 'Anthropic', 'LangChain', 'RAG', 'Python', 'Embeddings', 'Automation'],
            icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4"/><path d="M12 14c-4.97 0-9 2.02-9 4.5V20h18v-1.5c0-2.48-4.03-4.5-9-4.5z"/></svg>`,
        },
        api: {
            number:  isPT ? 'Serviço 04' : 'Service 04',
            title:   isPT ? 'APIs Escaláveis' : 'Scalable APIs',
            lead:    isPT
                ? 'Um backend bem construído é invisível — só se nota quando está mal feito. Desenvolvo APIs que aguentam crescimento, são fáceis de manter e dormem tranquilas em produção.'
                : 'A well-built backend is invisible — you only notice it when it\'s done poorly. I build APIs that handle growth, are easy to maintain and sleep soundly in production.',
            items: isPT ? [
                'Arquitetura e desenvolvimento de REST APIs com Node.js / Express',
                'Modelação e otimização de bases de dados PostgreSQL',
                'Autenticação segura com JWT, OAuth 2.0 e refresh tokens',
                'Documentação automática com Swagger / OpenAPI',
                'Testes automatizados, CI/CD e deploy em ambientes cloud',
            ] : [
                'REST API architecture and development with Node.js / Express',
                'PostgreSQL database modelling and optimisation',
                'Secure authentication with JWT, OAuth 2.0 and refresh tokens',
                'Automatic documentation with Swagger / OpenAPI',
                'Automated tests, CI/CD and deployment in cloud environments',
            ],
            tags: ['Node.js', 'Express', 'PostgreSQL', 'JWT / OAuth', 'Swagger', 'Docker', 'CI/CD'],
            icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="2" y="15" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><path d="M8 6h8M8 18h8M5 9v6M19 9v6"/></svg>`,
        },
    };

    /* ─── elements ────────────────────────────────────────── */
    const overlay   = document.getElementById('svcModalOverlay');
    const modal     = document.getElementById('svcModal');
    const closeBtn  = document.getElementById('svcModalClose');
    const elIcon    = document.getElementById('svcModalIcon');
    const elNumber  = document.getElementById('svcModalNumber');
    const elTitle   = document.getElementById('svcModalTitle');
    const elLead    = document.getElementById('svcModalLead');
    const elList    = document.getElementById('svcModalList');
    const elTags    = document.getElementById('svcModalTags');

    if (!overlay || !modal) return;

    /* ─── populate + open ─────────────────────────────────── */
    function openModal(key) {
        const svc = services[key];
        if (!svc) return;

        elIcon.innerHTML   = svc.icon;
        elNumber.textContent = svc.number;
        elTitle.textContent  = svc.title;
        elLead.textContent   = svc.lead;

        elList.innerHTML = svc.items
            .map(item => `<li>${item}</li>`)
            .join('');

        elTags.innerHTML = svc.tags
            .map(t => `<span class="svc-tag">${t}</span>`)
            .join('');

        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-open');
        modal.scrollTop = 0;

        /* trap focus */
        setTimeout(() => closeBtn.focus(), 50);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        /* return focus to the card that triggered the modal */
        if (lastFocused) lastFocused.focus();
    }

    /* ─── events ──────────────────────────────────────────── */
    let lastFocused = null;

    document.querySelectorAll('.svc-card[data-service]').forEach(card => {
        card.addEventListener('click', () => {
            lastFocused = card;
            openModal(card.dataset.service);
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                lastFocused = card;
                openModal(card.dataset.service);
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    /* ─── focus trap inside modal ─────────────────────────── */
    modal.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll(
            'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

}());