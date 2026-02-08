// Configurações globais
const BIRTHDAY_DATE = new Date('2026-05-01T00:00:00');
let candlesLit = false;
let celebrationActive = false;

// Detectar mobile para animações mais leves
function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    startCountdown();
    // Partículas e estrelas só no desktop (no celular pulsam e atrapalham o layout)
    if (!isMobileView()) {
        createParticles();
        createStars();
    }
    setupEventListeners();
    setupSimpleLoveAnimation();
    setupMobileNavOnScroll();
});

// Garante que a animação seja configurada após tudo (incluindo scripts externos) ser carregado
window.onload = function() {
    setupLoveAnimation();
};

// Inicializar página
function initializePage() {
    // Adicionar efeito de entrada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    // Configurar data do aniversário
    updateBirthdayDate();
}

// Atualizar data do aniversário
function updateBirthdayDate() {
    const currentYear = new Date().getFullYear();
    const birthday = new Date(`2026-05-01T00:00:00`);
    
    // Se já passou este ano, usar próximo ano
    if (birthday < new Date()) {
        birthday.setFullYear(currentYear + 1);
    }
    
    BIRTHDAY_DATE.setTime(birthday.getTime());
}

// Contador regressivo
function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = BIRTHDAY_DATE.getTime() - now;
        
        if (distance < 0) {
            // Aniversário chegou!
            showBirthdayMessage();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Atualizar elementos
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Atualizar barra de progresso
        updateProgressBar(distance);
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Atualizar barra de progresso
function updateProgressBar(distance) {
    const totalDays = 365;
    const daysPassed = totalDays - Math.floor(distance / (1000 * 60 * 60 * 24));
    const progress = (daysPassed / totalDays) * 100;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = Math.max(0, Math.min(100, progress)) + '%';
    }
}

// Mostrar mensagem de aniversário
function showBirthdayMessage() {
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
        countdownContainer.innerHTML = `
            <div class="birthday-message">
                <h2>🎉 HOJE É O GRANDE DIA! 🎉</h2>
                <p>Feliz Aniversário, Neneim Vittorya!</p>
                <button onclick="bigCelebration()" class="celebration-btn">
                    🎂 Celebrar Agora! 🎂
                </button>
            </div>
        `;
    }
}

// Criar partículas de fundo (mais leves no celular)
function createParticles() {
    const particlesBg = document.getElementById('particlesBg');
    if (!particlesBg) return;
    
    const mobile = isMobileView();
    const maxParticles = mobile ? 10 : 999;
    const interval = mobile ? 1200 : 300;
    
    function createParticle() {
        const count = particlesBg.querySelectorAll('.particle').length;
        if (count >= maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        const size = mobile ? 3 : (Math.random() * 4 + 2);
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const colors = ['#ffeb3b', '#ffc107', '#e8eaf6', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        if (!mobile) particle.style.boxShadow = '0 0 8px ' + colors[Math.floor(Math.random() * colors.length)];
        
        const duration = mobile ? 4 : (Math.random() * 3 + 3);
        particle.style.animationDuration = duration + 's';
        
        particlesBg.appendChild(particle);
        
        setTimeout(() => particle.remove(), duration * 1000);
    }
    
    setInterval(createParticle, interval);
}

// Criar estrelas (menos e mais lentas no celular)
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const mobile = isMobileView();
    const maxStars = mobile ? 12 : 999;
    const interval = mobile ? 1500 : 500;
    
    function createStar() {
        const count = starsContainer.querySelectorAll('.star').length;
        if (count >= maxStars) return;
        
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const size = mobile ? 0.8 : (Math.random() * 1 + 0.5);
        star.style.fontSize = size + 'rem';
        
        const duration = mobile ? 3 : (Math.random() * 2 + 2);
        star.style.animationDuration = duration + 's';
        
        starsContainer.appendChild(star);
        
        setTimeout(() => star.remove(), duration * 1000);
    }
    
    setInterval(createStar, interval);
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação suave
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
    
    // Parallax só em desktop (no celular causa travamentos)
    if (!isMobileView()) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }
    
    // Hover nos cards só em dispositivos com mouse (evita bug no touch)
    setupCardEffects();
}

// No celular: mostrar barra de navegação só depois de rolar para baixo da página principal
function setupMobileNavOnScroll() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    function updateNavVisibility() {
        const isMobile = window.innerWidth <= 480;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const vh = window.innerHeight;
        const showAt = vh * 0.55;  // mostra ao sair da página principal
        const hideAt = vh * 0.35;  // esconde ao voltar pra página principal (histerese evita pular)

        if (isMobile) {
            if (scrollY > showAt) {
                document.body.classList.add('show-bottom-nav');
            } else if (scrollY < hideAt) {
                document.body.classList.remove('show-bottom-nav');
            }
        } else {
            document.body.classList.add('show-bottom-nav');
        }
    }

    updateNavVisibility();
    window.addEventListener('scroll', function() {
        updateNavVisibility();
        updateActiveNavOnScroll();
    }, { passive: true });
    window.addEventListener('resize', updateNavVisibility);
    updateActiveNavOnScroll();
}

// Navegação suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        setActiveNav(sectionId);
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setActiveNav(sectionId) {
    document.querySelectorAll('.nav-item').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
    });
}

function updateActiveNavOnScroll() {
    const sectionIds = ['header', 'cake', 'countdown', 'gallery', 'message'];
    const threshold = window.innerHeight * 0.35;
    var current = 'header';
    for (var i = 0; i < sectionIds.length; i++) {
        var el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        var rect = el.getBoundingClientRect();
        if (rect.top <= threshold) current = sectionIds[i];
    }
    setActiveNav(current);
}

// Efeito parallax
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.particles-bg, .stars-container');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Efeitos de hover nos cards (apenas em desktop; no celular evita estado “grudado”)
function setupCardEffects() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    
    const cards = document.querySelectorAll('.memory-card, .message-card, .countdown-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Funções do bolo
function lightCandles() {
    if (candlesLit) {
        showMessage('🕯️ As velas já estão acesas! ❤️');
        return;
    }
    
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.display = 'block';
            flame.style.opacity = '1';
            flame.style.animation = 'flameFlicker 0.3s ease-in-out infinite alternate';
            
            // Efeito de faíscas
            createSparkles(flame);
        }, index * 200);
    });
    
    candlesLit = true;
    
    // Efeito sonoro (simulado)
    playSound('light');
    
    // Mostrar mensagem
    setTimeout(() => {
        showMessage('🕯️ Velas acesas! Que a luz ilumine seu caminho! ✨');
    }, 1000);
}

function blowCandles() {
    if (!candlesLit) {
        showMessage('💨 Acenda as velas primeiro! 🕯️');
        return;
    }
    
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.animation = 'none';
            flame.style.transform = 'translateX(-50%) scale(0)';
            flame.style.opacity = '0';
            
            // Efeito de fumaça
            createSmoke(flame);
        }, index * 100);
    });
    
    candlesLit = false;
    
    // Efeito sonoro (simulado)
    playSound('blow');
    
    // Mostrar mensagem
    setTimeout(() => {
        showMessage('💨 Velas apagadas! Seus desejos foram enviados ao universo! 🌟');
    }, 500);
    
    // Criar confetes
    setTimeout(() => {
        createConfetti();
    }, 1000);
}

function celebrateCake() {
    showMessage('🎉 Iniciando celebração do bolo! 🎂');
    
    // Acender velas se não estiverem acesas
    if (!candlesLit) {
        lightCandles();
        setTimeout(() => {
            blowCandles();
        }, 3000);
    } else {
        blowCandles();
    }
    
    // Efeito sonoro
    playSound('celebrate');
    
    // Mostrar modal
    setTimeout(() => {
        showCelebrationModal();
    }, 2000);
}

// Criar faíscas
function createSparkles(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * 20 - 10) + 'px';
            sparkle.style.top = (rect.top + Math.random() * 20 - 10) + 'px';
            
            sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, i * 100);
    }
}

// Criar fumaça
function createSmoke(element) {
    const smoke = document.createElement('div');
    smoke.style.position = 'absolute';
    smoke.style.width = '20px';
    smoke.style.height = '20px';
    smoke.style.background = 'rgba(200, 200, 200, 0.6)';
    smoke.style.borderRadius = '50%';
    smoke.style.pointerEvents = 'none';
    smoke.style.zIndex = '999';
    
    const rect = element.getBoundingClientRect();
    smoke.style.left = rect.left + 'px';
    smoke.style.top = rect.top + 'px';
    
    smoke.style.animation = 'smokeRise 3s ease-out forwards';
    
    document.body.appendChild(smoke);
    
    setTimeout(() => {
        smoke.remove();
    }, 3000);
}

// Criar confetes
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#ffeb3b', '#ffc107', '#e8eaf6', '#ffffff', '#b0bec5'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Posição aleatória
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            
            // Cor aleatória
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Forma aleatória
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.borderLeft = '5px solid transparent';
                confetti.style.borderRight = '5px solid transparent';
                confetti.style.borderBottom = `10px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
                confetti.style.backgroundColor = 'transparent';
            }
            
            // Tamanho aleatório
            const size = Math.random() * 10 + 5;
            if (shape !== 'triangle') {
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
            }
            
            // Rotação aleatória
            const rotation = Math.random() * 720 - 360;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // Duração aleatória
            const duration = Math.random() * 3 + 2;
            confetti.style.animationDuration = duration + 's';
            
            container.appendChild(confetti);
            
            // Remover após animação
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 20);
    }
}

// Funções de mensagem
function sendLove() {
    showMessage('❤️ Amor enviado com sucesso! Neneim sentiu todo o carinho! ❤️');
    createHearts();
    playSound('love');
}

function playMusic() {
    showMessage('🎵 Música tocando! Que a melodia alegre seu coração! 🎶');
    // Simular música
    createMusicNotes();
    playSound('music');
}

function bigCelebration() {
    celebrationActive = true;
    
    // Múltiplos efeitos
    createConfetti();
    createHearts();
    createMusicNotes();
    createSparkles(document.body);
    
    // Mostrar modal
    showCelebrationModal();
    
    // Efeito sonoro
    playSound('celebrate');
    
    // Mensagem especial
    setTimeout(() => {
        showMessage('🎉 GRANDE CELEBRAÇÃO! Que este seja o melhor aniversário da sua vida! 🎂');
    }, 1000);
}

// Criar corações
function createHearts() {
    const hearts = ['❤️'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.fontSize = '2rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            
            heart.style.animation = 'heartFloat 3s ease-out forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 100);
    }
}

// Criar notas musicais
function createMusicNotes() {
    const notes = ['🎵', '🎶', '♪', '♫', '♬'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const note = document.createElement('div');
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.position = 'fixed';
            note.style.fontSize = '1.5rem';
            note.style.pointerEvents = 'none';
            note.style.zIndex = '1000';
            note.style.left = Math.random() * window.innerWidth + 'px';
            note.style.top = window.innerHeight + 'px';
            
            note.style.animation = 'musicFloat 4s ease-out forwards';
            
            document.body.appendChild(note);
            
            setTimeout(() => {
                note.remove();
            }, 4000);
        }, i * 150);
    }
}

// Mostrar mensagem
function showMessage(text) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.floating-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'floating-message';
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'linear-gradient(135deg, #ffeb3b, #ffc107)';
    message.style.color = '#0c1445';
    message.style.color = 'white';
    message.style.padding = '15px 30px';
    message.style.borderRadius = '25px';
    message.style.fontSize = '1.1rem';
    message.style.fontWeight = '600';
    message.style.zIndex = '2000';
    message.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    message.style.animation = 'messageSlide 0.5s ease-out';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'messageSlideOut 0.5s ease-out forwards';
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 3000);
}

// Mostrar modal de celebração (evita tremor: trava scroll e reserva espaço da scrollbar)
function showCelebrationModal() {
    const modal = document.getElementById('celebrationModal');
    if (modal) {
        document.body.classList.add('modal-open');
        modal.style.display = 'flex';
        modal.style.animation = 'modalAppear 0.5s ease-out';
    }
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('celebrationModal');
    if (modal) {
        modal.style.animation = 'modalDisappear 0.5s ease-out forwards';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 500);
    }
}

// Simular sons
function playSound(type) {
    // Simular diferentes tipos de som
    const sounds = {
        light: '🔊 Som de acender vela',
        blow: '🔊 Som de soprar',
        celebrate: '🔊 Som de celebração',
        love: '🔊 Som de amor',
        music: '🔊 Som de música'
    };
    
    console.log(sounds[type] || '🔊 Som reproduzido');
    
    // Efeito visual de som
    createSoundWave();
}

// Criar onda sonora
function createSoundWave() {
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.top = '50%';
    wave.style.left = '50%';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.width = '100px';
    wave.style.height = '100px';
    wave.style.border = '3px solid rgba(255, 107, 157, 0.6)';
    wave.style.borderRadius = '50%';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '1000';
    wave.style.animation = 'soundWave 1s ease-out forwards';
    
    document.body.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 1000);
}

// Adicionar estilos dinâmicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        animation: confettiFall 3s linear forwards;
        will-change: transform;
        backface-visibility: hidden;
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) translateZ(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) translateZ(0) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
        }
    }
    
    @keyframes musicFloat {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(50px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes smokeRise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
        }
        100% {
            transform: translateY(-200px) scale(3);
            opacity: 0;
        }
    }
    
    @keyframes soundWave {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    @keyframes messageSlide {
        0% {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes messageSlideOut {
        0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
    
    @keyframes modalAppear {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes modalDisappear {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }
    
    .birthday-message {
        text-align: center;
        padding: 40px;
        background: linear-gradient(135deg, #ff6b9d, #ff8fab);
        color: white;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .birthday-message h2 {
        font-family: 'Dancing Script', cursive;
        font-size: 2.5rem;
        margin-bottom: 20px;
    }
    
    .birthday-message p {
        font-size: 1.3rem;
        margin-bottom: 30px;
    }
    
    .celebration-btn {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #2c3e50;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .celebration-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
`;

document.head.appendChild(dynamicStyles);

// Função de depuração
function debugInfo() {
    console.log({
        candlesLit,
        countdownInterval,
    });
}

window.debugInfo = debugInfo;

// --- Animação de Amor com CSS ---
function setupSimpleLoveAnimation() {
    const playBtn = document.getElementById('play-love-animation');
    const letters = document.querySelectorAll('.love-letter');

    if (!playBtn || letters.length === 0) {
        console.error('Elementos da animação de amor não foram encontrados.');
        if(playBtn) playBtn.style.display = 'none';
        return;
    }

    playBtn.addEventListener('click', () => {
        console.log('Botão "Mostrar Amor" clicado.');
        letters.forEach((letter, index) => {
            // Adiciona a classe com um pequeno atraso para cada letra
            setTimeout(() => {
                letter.classList.add('animate');
            }, index * 150);
        });
        // Desativa o botão após o primeiro clique para evitar repetições
        playBtn.disabled = true;
        playBtn.textContent = '❤️ Amor Enviado ❤️';
    });

    console.log('Animação de amor (CSS) configurada com sucesso.');
}