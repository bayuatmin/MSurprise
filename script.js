const introScreen = document.getElementById('introScreen');
const enterExperienceButton = document.getElementById('enterExperience');
const candleButton = document.getElementById('candleButton');
const interactionMessage = document.getElementById('interactionMessage');
const wishCard = document.getElementById('wishCard');
const confettiLayer = document.getElementById('confettiLayer');
const birthdayAudio = document.getElementById('birthdayAudio');
const birthdayAudioSource = birthdayAudio.querySelector('source');
const toast = document.getElementById('toast');
const cakeScene = document.querySelector('.celebration-scene');
const backToTopButton = document.getElementById('backToTop');

let toastTimeout;
let confettiTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 3200);
}

function celebrate(amount = 72) {
    const colors = ['#f48eaa', '#f3c763', '#9273d2', '#fffaf3', '#87c5dc', '#9acdb5'];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < amount; index += 1) {
        const piece = document.createElement('span');

        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[index % colors.length];
        piece.style.setProperty('--fall-duration', `${2 + Math.random() * 1.8}s`);
        piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
        piece.style.animationDelay = `${Math.random() * 0.7}s`;
        piece.style.transform = `rotate(${Math.random() * 180}deg)`;
        fragment.append(piece);
    }

    confettiLayer.append(fragment);
    window.clearTimeout(confettiTimeout);
    confettiTimeout = window.setTimeout(() => {
        confettiLayer.replaceChildren();
    }, 5000);
}

enterExperienceButton.addEventListener('click', () => {
    document.body.classList.add('has-entered');
    introScreen.classList.add('is-opening');
    celebrate(90);

    const musicPath = birthdayAudioSource.getAttribute('src').trim();
    if (musicPath) {
        birthdayAudio.play().catch((error) => {
            showToast('Kejutan terbuka, tetapi musik tidak bisa diputar. Periksa file MP3-nya.');
            console.error('Gagal memutar musik ulang tahun:', error);
        });
    }

    window.setTimeout(() => {
        introScreen.hidden = true;
        document.getElementById('birthdayTitle').focus({ preventScroll: true });
        if (!musicPath) {
            showToast('Kejutan terbuka! Isi slot MP3 di surprise.html untuk menambahkan musik.');
        } else {
            showToast('Kejutanmu sudah terbuka. Selamat ulang tahun! ✨');
        }
    }, 700);
});

candleButton.addEventListener('click', () => {
    const candlesAreOut = cakeScene.classList.toggle('candles-out');
    candleButton.setAttribute('aria-pressed', String(candlesAreOut));

    if (candlesAreOut) {
        cakeScene.querySelectorAll('.candle').forEach((candle) => {
            const smoke = document.createElement('span');
            smoke.className = 'smoke-puff';
            smoke.setAttribute('aria-hidden', 'true');
            candle.append(smoke);
            window.setTimeout(() => smoke.remove(), 1100);
        });
        interactionMessage.textContent = 'Harapanmu sudah terbang ke langit. Semoga segera terwujud! ✨';
        candleButton.innerHTML = '<span aria-hidden="true">✦</span> Nyalakan lilin lagi';
        celebrate(48);
        return;
    }

    const flames = cakeScene.querySelectorAll('.flame');
    flames.forEach((flame) => flame.classList.add('is-lighting'));
    window.setTimeout(() => {
        flames.forEach((flame) => flame.classList.remove('is-lighting'));
    }, 700);
    interactionMessage.textContent = 'Lilin menyala lagi! Buat satu harapan dan tiup sekali lagi.';
    candleButton.innerHTML = '<span aria-hidden="true">✧</span> Tiup lilinnya';
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.stage-nav a, .stage-button, .closing-button').forEach((link) => {
    link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const stageObserver = new IntersectionObserver((entries) => {
    const visibleStage = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleStage) {
        return;
    }

    document.querySelectorAll('.stage-nav a').forEach((link) => {
        if (link.getAttribute('href') === `#${visibleStage.target.id}`) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}, { threshold: [0.2, 0.45, 0.7] });

document.querySelectorAll('#home, #wish, #little-things').forEach((stage) => {
    stageObserver.observe(stage);
});

document.querySelectorAll('button, .stage-button, .closing-button').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
        const bounds = button.getBoundingClientRect();
        button.style.setProperty('--ripple-x', `${event.clientX - bounds.left}px`);
        button.style.setProperty('--ripple-y', `${event.clientY - bounds.top}px`);
    });
});
