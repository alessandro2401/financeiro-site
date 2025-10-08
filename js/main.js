// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de entrada dos elementos ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar cards e elementos
document.querySelectorAll('.kpi-card, .alcada-card, .sistema-card, .doc-card, .checklist-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animação das barras de progresso
const progressBars = document.querySelectorAll('.progress-fill');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Highlight do menu ativo baseado na seção visível
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.opacity = '0.7';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.opacity = '1';
            link.style.borderBottom = '2px solid white';
        } else {
            link.style.borderBottom = 'none';
        }
    });
});

// Criar diagrama de fluxo placeholder se a imagem não existir
window.addEventListener('load', () => {
    const flowDiagram = document.getElementById('flowDiagram');
    if (flowDiagram) {
        flowDiagram.onerror = function() {
            const parent = this.parentElement;
            parent.innerHTML = `
                <div style="padding: 3rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📊</div>
                    <h3 style="margin-bottom: 1rem; color: #1e40af;">Fluxograma Financeiro</h3>
                    <div style="max-width: 600px; margin: 0 auto; text-align: left; color: #6b7280; line-height: 1.8;">
                        <p style="margin-bottom: 1rem;"><strong>1. Solicitante:</strong> Submete demanda com documento hábil via Discord Financeiro</p>
                        <p style="margin-bottom: 1rem;"><strong>2. Analista:</strong> Confere documento e cadastra no sistema</p>
                        <p style="margin-bottom: 1rem;"><strong>3. Aprovador:</strong> Aprova conforme alçada (Supervisor até R$ 5k, Coordenação até R$ 20k, Diretoria acima)</p>
                        <p style="margin-bottom: 1rem;"><strong>4. Programação:</strong> Analista programa pagamento em até 24h após aprovação</p>
                        <p style="margin-bottom: 1rem;"><strong>5. Tesouraria:</strong> Executa liquidação no vencimento</p>
                        <p><strong>6. Conciliação:</strong> Fecha o dia com conciliação bancária</p>
                    </div>
                </div>
            `;
        };
    }
});

// Contador animado para os KPIs
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = value.toFixed(1) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animar valores dos KPIs quando visíveis
const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueElement = entry.target.querySelector('.kpi-main-value');
            if (valueElement && !valueElement.dataset.animated) {
                const text = valueElement.textContent;
                const match = text.match(/([\d.]+)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const suffix = text.includes('%') ? '%' : text.includes('horas') ? ' horas' : text.includes('dias') ? ' dias' : '';
                    valueElement.textContent = '0' + suffix;
                    setTimeout(() => {
                        animateValue(valueElement, 0, value, 1500, suffix);
                    }, 200);
                    valueElement.dataset.animated = 'true';
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.kpi-card').forEach(card => {
    kpiObserver.observe(card);
});

console.log('POP Financeiro - Sistema carregado com sucesso!');
