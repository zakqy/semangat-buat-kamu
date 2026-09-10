/**
 * Pesan Semangat & Motivasi Interaktif
 * Dengan Musik "Beautiful in White" & Lirik Tersinkronisasi Akurat
 */

// ===================================================================
// 1. DATA LIRIK "BEAUTIFUL IN WHITE" (TIMESTAMPS TERKALIBRASI PRESISI)
// ===================================================================
const LYRICS = [
  { time: 0.0,   text: "♪ (Intro - Piano Canon in D) ♪" },
  { time: 13.5,  text: "Not sure if you know this" },
  { time: 17.5,  text: "But when we first met" },
  { time: 21.2,  text: "I got so nervous I couldn't speak" },
  { time: 25.2,  text: "In that very moment" },
  { time: 28.8,  text: "I found the one and" },
  { time: 32.2,  text: "My life had found its missing piece" },
  { time: 36.5,  text: "So as long as I live I'll love you" },
  { time: 41.0,  text: "Will have and hold you" },
  { time: 44.2,  text: "You look so beautiful in white" },
  { time: 49.0,  text: "And from now to my very last breath" },
  { time: 53.2,  text: "This day I'll cherish" },
  { time: 56.5,  text: "You look so beautiful in white" },
  { time: 61.2,  text: "Tonight... ✨" },
  { time: 70.5,  text: "What we have is timeless" },
  { time: 74.2,  text: "My love is endless" },
  { time: 78.0,  text: "And with this ring I say to the world" },
  { time: 83.5,  text: "You're my every reason" },
  { time: 87.2,  text: "You're all that I believe in" },
  { time: 91.0,  text: "With all my heart I mean every word" },
  { time: 98.0,  text: "So as long as I live I'll love you" },
  { time: 102.5, text: "Will have and hold you" },
  { time: 106.0, text: "You look so beautiful in white" },
  { time: 110.5, text: "And from now to my very last breath" },
  { time: 115.0, text: "This day I'll cherish" },
  { time: 118.5, text: "You look so beautiful in white" },
  { time: 123.5, text: "Tonight... 💖" },
  { time: 128.0, text: "(You look so beautiful in white)" },
  { time: 133.0, text: "(So beautiful in white)" },
  { time: 138.5, text: "Tonight... 🌟" },
  { time: 143.5, text: "And if a daughter's what our future holds" },
  { time: 149.5, text: "I hope she has your eyes" },
  { time: 154.5, text: "Finds love like you and I did, yeah" },
  { time: 159.8, text: "But when she falls in love we'll let her go" },
  { time: 165.5, text: "I'll walk her down the aisle" },
  { time: 171.0, text: "She'll look so beautiful in white... 👰" },
  { time: 178.0, text: "You look so beautiful in white... ✨" },
  { time: 185.0, text: "So as long as I live I'll love you" },
  { time: 189.5, text: "Will have and hold you" },
  { time: 193.0, text: "You look so beautiful in white" },
  { time: 198.0, text: "And from now to my very last breath" },
  { time: 202.5, text: "This day I'll cherish" },
  { time: 206.0, text: "You look so beautiful in white" },
  { time: 211.0, text: "Tonight... ✨" },
  { time: 217.5, text: "You look so beautiful in white" },
  { time: 224.0, text: "Tonight... 💫" }
];

// ===================================================================
// 2. STATE & DOM REFERENCES
// ===================================================================
let currentScene = 0;
let isAudioPlaying = false;
let loveCount = 0;
let activeLyricIndex = -1;
let lyricOffset = 0; // offset waktu lirik dalam detik
let audioCtx = null;

// DOM Elements
const bgAudio = document.getElementById('bg-audio');
const cardStage = document.getElementById('card-stage');
const scenes = document.querySelectorAll('.card-scene');
const btnStart = document.getElementById('btn-start');
const musicToggle = document.getElementById('music-toggle');
const audioIcon = document.getElementById('audio-icon');
const audioLabel = document.getElementById('audio-label');
const btnSendLove = document.getElementById('btn-send-love');
const loveCountElem = document.getElementById('love-count');
const btnCopyQuote = document.getElementById('btn-copy-quote');
const toastMsg = document.getElementById('toast-msg');
const heartsContainer = document.getElementById('hearts-container');
const envelopeElem = document.getElementById('envelope-elem');

// Lyrics DOM Elements
const lyricsTicker = document.getElementById('lyrics-ticker');
const tickerCurrent = document.getElementById('ticker-current');
const lyricsModal = document.getElementById('lyrics-modal');
const lyricsToggleBtn = document.getElementById('lyrics-toggle-btn');
const closeLyricsBtn = document.getElementById('close-lyrics-btn');
const lyricsListContainer = document.getElementById('lyrics-list-container');

// ===================================================================
// 3. AUDIO ENGINE (AUTOPLAY LANGSUNG & KONTROL)
// ===================================================================
function initAudio() {
  if (!bgAudio) return;
  bgAudio.volume = 0.85;

  bgAudio.addEventListener('play', () => {
    isAudioPlaying = true;
    musicToggle.classList.add('playing');
    audioIcon.textContent = '🎵';
    audioLabel.textContent = 'Beautiful in White';
  });

  bgAudio.addEventListener('pause', () => {
    isAudioPlaying = false;
    musicToggle.classList.remove('playing');
    audioIcon.textContent = '⏸️';
    audioLabel.textContent = 'Musik Dijeda';
  });

  bgAudio.addEventListener('ended', () => {
    isAudioPlaying = false;
    musicToggle.classList.remove('playing');
    audioIcon.textContent = '🔁';
    audioLabel.textContent = 'Putar Ulang';
  });

  bgAudio.addEventListener('timeupdate', handleTimeUpdate);

  // Jalankan pemutaran langsung saat halaman dimuat
  attemptDirectPlay();
}

function attemptDirectPlay() {
  if (!bgAudio) return;
  const playPromise = bgAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      musicToggle.classList.add('playing');
      audioIcon.textContent = '🎵';
    }).catch(() => {
      // Jika browser memblokir autoplay tanpa gesture pengguna,
      // kita dengarkan klik/sentuhan pertama di mana saja di layar
      const onUserFirstInteraction = () => {
        bgAudio.play().then(() => {
          isAudioPlaying = true;
          musicToggle.classList.add('playing');
          audioIcon.textContent = '🎵';
        }).catch(e => console.log(e));
        
        window.removeEventListener('click', onUserFirstInteraction);
        window.removeEventListener('touchstart', onUserFirstInteraction);
        window.removeEventListener('keydown', onUserFirstInteraction);
      };

      window.addEventListener('click', onUserFirstInteraction, { once: true });
      window.addEventListener('touchstart', onUserFirstInteraction, { once: true });
      window.addEventListener('keydown', onUserFirstInteraction, { once: true });
    });
  }
}

function toggleAudio() {
  if (!bgAudio) return;
  if (bgAudio.paused) {
    bgAudio.play().catch(err => {
      console.log('Perlu interaksi pengguna:', err);
    });
  } else {
    bgAudio.pause();
  }
}

musicToggle.addEventListener('click', toggleAudio);

// ===================================================================
// 4. SINKRONISASI LIRIK REALTIME & AUTO-SCROLL
// ===================================================================
function handleTimeUpdate() {
  const curTime = bgAudio.currentTime + lyricOffset;
  let foundIndex = -1;

  for (let i = 0; i < LYRICS.length; i++) {
    if (curTime >= LYRICS[i].time) {
      foundIndex = i;
    } else {
      break;
    }
  }

  if (foundIndex !== -1 && foundIndex !== activeLyricIndex) {
    activeLyricIndex = foundIndex;
    updateLyricsDisplay(foundIndex);
  }
}

function updateLyricsDisplay(index) {
  const lyric = LYRICS[index];
  if (!lyric) return;

  // 1. Perbarui Ticker Lirik Mengambang
  tickerCurrent.textContent = lyric.text;
  tickerCurrent.classList.remove('pulse-update');
  void tickerCurrent.offsetWidth; // trigger reflow
  tickerCurrent.classList.add('pulse-update');

  // 2. Perbarui Highlight Lirik di Modal & Auto-scroll ke tengah
  const allLines = lyricsListContainer.querySelectorAll('.lyric-line-item');
  allLines.forEach((lineElem, i) => {
    if (i === index) {
      lineElem.classList.add('active');
      lineElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      lineElem.classList.remove('active');
    }
  });
}

// Bangun daftar lirik lengkap untuk modal karaoke
function buildLyricsList() {
  lyricsListContainer.innerHTML = '';
  LYRICS.forEach((item, index) => {
    const lineElem = document.createElement('div');
    lineElem.className = 'lyric-line-item';
    lineElem.dataset.index = index;
    lineElem.dataset.time = item.time;
    lineElem.textContent = item.text;

    lineElem.addEventListener('click', () => {
      if (bgAudio) {
        bgAudio.currentTime = item.time;
        if (bgAudio.paused) {
          bgAudio.play();
        }
        playChimeTone(650, 0.15);
      }
    });

    lyricsListContainer.appendChild(lineElem);
  });
}

// Kontrol Modal Karaoke
function openLyricsModal() {
  lyricsModal.classList.add('open');
  const activeLine = lyricsListContainer.querySelector('.lyric-line-item.active');
  if (activeLine) {
    setTimeout(() => {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }
}

function closeLyricsModal() {
  lyricsModal.classList.remove('open');
}

lyricsToggleBtn.addEventListener('click', openLyricsModal);
lyricsTicker.addEventListener('click', openLyricsModal);
closeLyricsBtn.addEventListener('click', closeLyricsModal);

lyricsModal.addEventListener('click', (e) => {
  if (e.target === lyricsModal) {
    closeLyricsModal();
  }
});

// Penyesuaian Sinkronisasi Lirik (Fine-tuning)
const btnSyncEarlier = document.getElementById('btn-sync-earlier');
const btnSyncLater = document.getElementById('btn-sync-later');
const btnSyncReset = document.getElementById('btn-sync-reset');

if (btnSyncEarlier) {
  btnSyncEarlier.addEventListener('click', () => {
    lyricOffset += 0.5;
    showToast(`Lirik dipercepat (+0.5s) • Offset: +${lyricOffset.toFixed(1)}s ⏩`);
    handleTimeUpdate();
  });
}

if (btnSyncLater) {
  btnSyncLater.addEventListener('click', () => {
    lyricOffset -= 0.5;
    showToast(`Lirik diperlambat (-0.5s) • Offset: ${lyricOffset.toFixed(1)}s ⏪`);
    handleTimeUpdate();
  });
}

if (btnSyncReset) {
  btnSyncReset.addEventListener('click', () => {
    lyricOffset = 0;
    showToast('Tempo lirik dikembalikan ke standar 🔄');
    handleTimeUpdate();
  });
}


// ===================================================================
// 6. NAVIGASI KARTU & SELEBRASI
// ===================================================================
function goToScene(targetIndex) {
  if (targetIndex === currentScene) return;

  playChimeTone(440 + targetIndex * 50, 0.12);

  const prevSceneElem = document.getElementById(`scene-${currentScene}`);
  const nextSceneElem = document.getElementById(`scene-${targetIndex}`);

  if (!nextSceneElem) return;

  if (prevSceneElem) {
    prevSceneElem.classList.add('fade-out');
  }

  setTimeout(() => {
    scenes.forEach(s => {
      s.classList.remove('active', 'fade-out');
    });

    nextSceneElem.classList.add('active');
    currentScene = targetIndex;

    // Scroll halus ke tengah
    nextSceneElem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Grand Finale Trigger
    if (targetIndex === 5) {
      triggerCelebration();
    }
  }, 250);
}

// Tombol mulai pada cover
btnStart.addEventListener('click', () => {
  if (bgAudio && bgAudio.paused) {
    bgAudio.play().catch(e => console.log(e));
  }
  goToScene(1);
});

envelopeElem.addEventListener('click', () => {
  if (bgAudio && bgAudio.paused) {
    bgAudio.play().catch(e => console.log(e));
  }
  goToScene(1);
});

// Web Audio API nada lonceng feedback
function playChimeTone(freq = 523.25, duration = 0.2) {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio restriction
  }
}

// ===================================================================
// 7. KANVAS BINTANG & METEOR JATUH
// ===================================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let stars = [];
let shootingStars = [];
let cursorParticles = [];

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const starCount = Math.floor((bgCanvas.width * bgCanvas.height) / 7500);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseDir: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function spawnShootingStar() {
  if (Math.random() < 0.015 && shootingStars.length < 2) {
    shootingStars.push({
      x: Math.random() * bgCanvas.width * 0.8,
      y: Math.random() * (bgCanvas.height * 0.4),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 12,
      angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
      opacity: 1,
      life: 0
    });
  }
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // Bintang berkerlip
  stars.forEach(star => {
    star.alpha += star.pulseSpeed * star.pulseDir;
    if (star.alpha > 0.95) {
      star.alpha = 0.95;
      star.pulseDir = -1;
    } else if (star.alpha < 0.2) {
      star.alpha = 0.2;
      star.pulseDir = 1;
    }

    bgCtx.beginPath();
    bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    bgCtx.shadowBlur = star.radius > 1 ? 6 : 0;
    bgCtx.shadowColor = '#a5b4fc';
    bgCtx.fill();
  });
  bgCtx.shadowBlur = 0;

  // Bintang jatuh / meteor
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.life++;
    ss.opacity -= 0.02;

    if (ss.opacity <= 0 || ss.x > bgCanvas.width || ss.y > bgCanvas.height) {
      shootingStars.splice(i, 1);
      continue;
    }

    const tailX = ss.x - Math.cos(ss.angle) * ss.length;
    const tailY = ss.y - Math.sin(ss.angle) * ss.length;

    const grad = bgCtx.createLinearGradient(ss.x, ss.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
    grad.addColorStop(1, `rgba(99, 102, 241, 0)`);

    bgCtx.beginPath();
    bgCtx.moveTo(ss.x, ss.y);
    bgCtx.lineTo(tailX, tailY);
    bgCtx.strokeStyle = grad;
    bgCtx.lineWidth = 2;
    bgCtx.stroke();
  }

  // Partikel kursor mouse
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const p = cursorParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;
    p.radius *= 0.96;

    if (p.alpha <= 0 || p.radius <= 0.2) {
      cursorParticles.splice(i, 1);
      continue;
    }

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(165, 180, 252, ${p.alpha})`;
    bgCtx.fill();
  }

  requestAnimationFrame(animateBg);
}

window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();
animateBg();

// Efek jejak kursor
window.addEventListener('mousemove', (e) => {
  if (cursorParticles.length < 35 && Math.random() > 0.4) {
    cursorParticles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      radius: Math.random() * 2.5 + 1.2,
      alpha: 0.8
    });
  }
});

// ===================================================================
// 8. KONFETI SELEBRASI
// ===================================================================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

const CONFETTI_COLORS = [
  '#f59e0b', '#fbbf24', '#f43f5e', '#ec4899', '#6366f1', '#06b6d4', '#10b981', '#ffffff'
];

function fireConfetti(count = 100, originX = window.innerWidth / 2, originY = window.innerHeight * 0.6) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    confettiPieces.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: Math.random() * 8 + 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      wobble: 0,
      wobbleSpeed: Math.random() * 0.1 + 0.05,
      opacity: 1,
      gravity: 0.35,
      friction: 0.96
    });
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= p.friction;
    p.rotation += p.rotSpeed;
    p.wobble += p.wobbleSpeed;
    p.opacity -= 0.007;

    if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
      confettiPieces.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.scale(Math.sin(p.wobble), 1);

    confettiCtx.fillStyle = p.color;
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    confettiCtx.restore();
  }

  requestAnimationFrame(animateConfetti);
}
animateConfetti();

function triggerCelebration() {
  fireConfetti(80, window.innerWidth * 0.3, window.innerHeight * 0.7);
  setTimeout(() => {
    fireConfetti(80, window.innerWidth * 0.7, window.innerHeight * 0.7);
  }, 250);
  setTimeout(() => {
    fireConfetti(130, window.innerWidth * 0.5, window.innerHeight * 0.5);
  }, 600);
}

// ===================================================================
// 9. INTERACTIVE HEART BURST ("KIRIM SEMANGAT")
// ===================================================================
const EMOJIS = ['💖', '✨', '🔥', '🎓', '🌟', '💪', '🌸', '🤍', '👰'];

function spawnHeart() {
  loveCount++;
  loveCountElem.textContent = loveCount;
  playChimeTone(620 + Math.random() * 200, 0.12);

  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const rect = btnSendLove.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 + (Math.random() * 60 - 30);
  const startY = rect.top;

  heart.style.left = `${startX}px`;
  heart.style.top = `${startY}px`;
  heart.style.setProperty('--rot-angle', `${(Math.random() - 0.5) * 40}deg`);

  heartsContainer.appendChild(heart);

  if (loveCount % 5 === 0) {
    fireConfetti(35, startX, startY);
  }

  setTimeout(() => {
    heart.remove();
  }, 2800);
}

btnSendLove.addEventListener('click', () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(spawnHeart, i * 100);
  }
});

// ===================================================================
// 10. COPY QUOTE TO CLIPBOARD & TOAST
// ===================================================================
function showToast(text) {
  toastMsg.textContent = text;
  toastMsg.classList.add('show');
  setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3000);
}

btnCopyQuote.addEventListener('click', () => {
  const fullMessage = `✨ KATA SEMANGAT UNTUKMU ✨\n\n` +
    `🎓 Semangat Kuliahnya!\n` +
    `📑 Semangat Nyusun Skripsinya!\n` +
    `🔥 Semangat, Jangan Malas!\n` +
    `🎓✨ Semangat Cepat Lulus!\n\n` +
    `"Masa lalu tidak bisa diubah, tapi masa depan mungkin masih bisa diubah. Buanglah masa lalu, dan hidup dimasa depan." 🌟\n\n` +
    `"Semangat buat kamu yang tidak pernah menyerah, gagal? Coba lagi... okeyy, semangatttt!" 💪🔥\n\n` +
    `🎵 Lagu pengiring: Shane Filan - Beautiful in White\n` +
    `Semoga setiap langkahmu dipenuhi keberkahan dan keberhasilan! ✨`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullMessage)
      .then(() => {
        showToast('Ucapan indah berhasil disalin! 📋✨');
        playChimeTone(880, 0.15);
      })
      .catch(() => fallbackCopy(fullMessage));
  } else {
    fallbackCopy(fullMessage);
  }
});

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Ucapan indah berhasil disalin! 📋✨');
    playChimeTone(880, 0.15);
  } catch (err) {
    showToast('Gagal menyalin otomatis, silakan salin manual.');
  }
  document.body.removeChild(textArea);
}

// ===================================================================
// 11. INITIALIZATION & AUTOPLAY TRIGGER
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  buildLyricsList();

  // Gentle 3D Tilt effect on active card
  cardStage.addEventListener('mousemove', (e) => {
    const activeCard = document.querySelector('.card-scene.active .glass-card');
    if (!activeCard) return;

    const rect = activeCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 10;
    const rotY = (x / rect.width) * 10;

    activeCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  cardStage.addEventListener('mouseleave', () => {
    const activeCard = document.querySelector('.card-scene.active .glass-card');
    if (activeCard) {
      activeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  });
});
