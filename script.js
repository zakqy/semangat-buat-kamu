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
const btnAmin = document.getElementById('btn-amin');
const aminCountElem = document.getElementById('amin-count');
let aminCount = 0;
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

  // Preload and buffer audio data immediately in the background
  try {
    bgAudio.load();
  } catch (e) {
    console.log(e);
  }

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

  // Bunyikan nada lonceng halus hanya untuk pergantian slide berikutnya
  // agar alunan piano lagu Beautiful in White di awal terdengar murni tanpa tertimpa suara chime
  if (targetIndex > 1) {
    playChimeTone(440 + targetIndex * 50, 0.12);
  }

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

    // Perbarui pesan motivasi kucing peneman sesuai slide aktif
    updateCatSceneSpeech(targetIndex);

    // Scroll halus ke tengah
    nextSceneElem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Grand Finale Trigger
    if (targetIndex === 5) {
      triggerCelebration();
    }
  }, 250);
}

// Fungsi memulai pesan dan musik secara instan tanpa jeda
function startExperience(e) {
  if (e) {
    e.stopPropagation();
  }

  if (bgAudio) {
    if (bgAudio.paused) {
      bgAudio.currentTime = 0;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isAudioPlaying = true;
          musicToggle.classList.add('playing');
          audioIcon.textContent = '🎵';
          audioLabel.textContent = 'Beautiful in White';
        }).catch(err => console.log('Audio play error:', err));
      }
    }
  }

  goToScene(1);
}

// Respon instan pada klik tombol maupun amplop
btnStart.addEventListener('click', startExperience);
envelopeElem.addEventListener('click', startExperience);

// ===================================================================
// CUTE CAT COMPANION & PEEKING CAT SYSTEM
// ===================================================================
const catCompanion = document.getElementById('cat-companion');
const catAvatar = document.getElementById('cat-avatar');
const catSpeech = document.getElementById('cat-speech');
const catBubbleText = document.getElementById('cat-bubble-text');
const peekingCatCover = document.getElementById('peeking-cat-cover');

const CAT_SCENE_QUOTES = [
  "Hai! Ada pesan khusus buatmu, sentuh amplopnya yaa~ 💌",
  "Kuliah memang menantang, tapi kamu pasti bisa melaluinya! 🎓",
  "Skripsinya dicicil pelan-pelan ya, pasti kelar kok! 📑",
  "Yuk lawan rasa malas bareng aku! Kamu luar biasa! 🔥",
  "Sebentar lagi kamu pakai toga impian! Bangga banget! 🎓✨",
  "Yayy! Kamu hebat banget! Peluk hangat dariku~ 🎉💖"
];

const CAT_CLICK_QUOTES = [
  "Meoww~ Semangat terus yaa, aku selalu ada dukung kamu! 🐾",
  "Purrrr~ Jangan lupa istirahat & minum air putih yaa! 💖",
  "Nyaa~ Senyummu manis banget kalau lagi semangat! ✨",
  "Meow! Kalau kamu sukses nanti, jangan lupa traktirin ya! 😸",
  "Peluk hangat dari aku! Kamu pasti bisa melewati semuanya! 🐾🌸",
  "Purrr~ Tetap percaya diri ya, kamu lebih hebat dari dugaanmu! 💫"
];

function updateCatSceneSpeech(sceneIndex) {
  if (!catBubbleText || !catSpeech) return;
  const quote = CAT_SCENE_QUOTES[sceneIndex] || CAT_SCENE_QUOTES[0];
  catSpeech.style.animation = 'none';
  void catSpeech.offsetWidth;
  catSpeech.style.animation = 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  catBubbleText.textContent = quote;
}

// Suara Meow sintetis imut menggunakan Web Audio API
function playMeowSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Frekuensi khas suara meow kucing (nada naik lalu turun lembut)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    // Ignore audio limitation
  }
}

// Efek partikel jejak kaki kucing & hati saat kucing diklik
function spawnCatPawParticles(x, y) {
  const icons = ['🐾', '💖', '✨', '🌸', '🐾', '🐱'];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'cat-paw-particle';
    p.textContent = icons[Math.floor(Math.random() * icons.length)];
    
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const tx = (Math.random() - 0.5) * 140;
    const ty = - (60 + Math.random() * 80);
    const tr = (Math.random() - 0.5) * 60;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--tr', `${tr}deg`);

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1400);
  }
}

function handleCatClick(e) {
  if (e) e.stopPropagation();

  // 1. Suara meow imut
  playMeowSound();

  // 2. Animasi loncat ceria
  if (catAvatar) {
    catAvatar.classList.remove('bounce');
    void catAvatar.offsetWidth;
    catAvatar.classList.add('bounce');
  }

  // 3. Partikel kaki kucing & hati
  const rect = (catAvatar || catCompanion).getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;
  spawnCatPawParticles(centerX, centerY);

  // 4. Perbarui ucapan acak kucing
  if (catBubbleText && catSpeech) {
    const randomQuote = CAT_CLICK_QUOTES[Math.floor(Math.random() * CAT_CLICK_QUOTES.length)];
    catSpeech.style.animation = 'none';
    void catSpeech.offsetWidth;
    catSpeech.style.animation = 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    catBubbleText.textContent = randomQuote;
  }
}

if (catCompanion) {
  catCompanion.addEventListener('click', handleCatClick);
}

if (peekingCatCover) {
  peekingCatCover.addEventListener('click', (e) => {
    playMeowSound();
    startExperience(e);
  });
}

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
// 9. INTERACTIVE ENERGY METER ("BERAPA PERSEN HARI INI KAMU BERSEMANGAT")
// ===================================================================
let energyPercent = 0;
const energySlider = document.getElementById('energy-slider');
const sliderValBadge = document.getElementById('slider-val-badge');
const energyStatusText = document.getElementById('energy-status-text');
const energyQuoteCard = document.getElementById('energy-quote-card');
const energyTierIcon = document.getElementById('energy-tier-icon');
const energyTierTitle = document.getElementById('energy-tier-title');
const energyBtnText = document.getElementById('energy-btn-text');

const ENERGY_EMOJIS = ['🔥', '⚡', '💖', '💯%', '✨', '🚀', '💪', '🌟', '🐾', '🌸'];

const ENERGY_TIERS = [
  {
    max: 0,
    icon: "🤍",
    title: "0% • Istirahat Dulu",
    quote: "Tidak apa-apa kalau hari ini terasa berat. Menarik napas dan bertahan sampai detik ini pun sudah perjuangan hebat. Peluk hangat untuk jiwamu yang sedang lelah.",
    catSpeech: "Istirahat dulu yaa, jangan dipaksakan... Aku temenin di sini 🤍🐾"
  },
  {
    max: 10,
    icon: "🌱",
    title: "10% • Percikan Awal",
    quote: "Bahkan pohon rindang bermula dari benih kecil. 10% semangat ini adalah awal yang berharga. Jangan remehkan langkah kecilmu hari ini.",
    catSpeech: "Langkah kecil adalah awal hal besar! Pelan-pelan yaa~ 🐾🌱"
  },
  {
    max: 20,
    icon: "🌸",
    title: "20% • Mulai Bersemi",
    quote: "Jangan bandingkan prosesmu dengan orang lain. Setiap bunga mekar pada waktunya. 20% ini membuktikan kamu tidak menyerah!",
    catSpeech: "Tuh kan, energimu mulai bertambah! Semangattt~ 🌸✨"
  },
  {
    max: 30,
    icon: "☕",
    title: "30% • Mengumpulkan Tenaga",
    quote: "Tarik napas panjang, minum air hangat, dan nikmati prosesnya. 30% tenagamu mulai terkumpul. Kamu jauh lebih kuat dari rasa lelahmu.",
    catSpeech: "Sambil seruput teh atau kopi hangat yuk, biar makin bertenaga! ☕🐾"
  },
  {
    max: 40,
    icon: "⛅",
    title: "40% • Awan Mulai Terbuka",
    quote: "Ingat sudah seberapa jauh kamu melangkah sampai di titik ini. 40% energi positifmu mulai bersinar mengusir keraguan di dalam hati.",
    catSpeech: "Mendung di pikiranmu mulai hilang! Kamu pasti bisa! ⛅💫"
  },
  {
    max: 50,
    icon: "💪",
    title: "50% • Setengah Jalan",
    quote: "Hebat! Kamu sudah mencapai setengah jalan! Bukti nyata bahwa tekadmu lebih besar daripada rasa takutmu. Teruslah melangkah!",
    catSpeech: "Sudah 50%! Separuh jalan lagi menuju puncak keberhasilan! 💪🔥"
  },
  {
    max: 60,
    icon: "🚀",
    title: "60% • Melaju Mantap",
    quote: "Langkahmu makin mantap dan ritmemu makin stabil. 60% energi ini siap membantumu menuntaskan setiap target hari ini dengan lancar.",
    catSpeech: "Gas terusss! Kecepatan dan fokusmu makin mantap nih! 🚀✨"
  },
  {
    max: 70,
    icon: "🌟",
    title: "70% • Cahaya Keyakinan",
    quote: "Aura percaya dirimu makin bersinar terang! 70% semangat ini akan mengubah hal-hal yang tadinya sulit menjadi jauh lebih mudah.",
    catSpeech: "Aura positifmu kerasa banget sampai sini! Hebat banget! 🌟🐱"
  },
  {
    max: 80,
    icon: "🔥",
    title: "80% • Semangat Membara",
    quote: "Sedikit lagi menuju puncak! 80% energi membakar semua keraguan. Singkirkan rasa cemas, bayangkan hasil indah yang menantimu!",
    catSpeech: "Tinggal 20% lagi! Semangatmu bener-bener berkobar hebat! 🔥🐾"
  },
  {
    max: 90,
    icon: "⚡",
    title: "90% • Kekuatan Maksimal",
    quote: "Tinggal selangkah lagi menuju 100%! 90% kekuatan penuh. Kamu membuktikan bahwa dirimu adalah seorang pejuang sejati yang pantang mundur!",
    catSpeech: "Dikit lagiii! Sentuh sekali lagi sampai 100%! ⚡😻"
  },
  {
    max: 100,
    icon: "👑",
    title: "100% • Sempurna & Tak Terhentikan!",
    quote: "LUAR BIASA! 100% Semangat Penuh! Tak ada rintangan yang tak bisa kamu lalui hari ini. Percayalah pada dirimu, kamu siap menaklukkan dunia!",
    catSpeech: "HOREEE 100%! Kamu hebat banget, bangga banget sama kamu! 🎉💖🐾"
  }
];

function getEnergyTier(val) {
  for (const tier of ENERGY_TIERS) {
    if (val <= tier.max) return tier;
  }
  return ENERGY_TIERS[ENERGY_TIERS.length - 1];
}

function updateEnergyUI(val, notifyCat = false) {
  // Batas kaku maksimal 100%
  val = Math.max(0, Math.min(100, val));
  energyPercent = val;

  // Update slider
  if (energySlider) {
    energySlider.value = val;
  }

  // Update badges & button counter
  if (sliderValBadge) {
    sliderValBadge.textContent = `${val}%`;
  }
  if (loveCountElem) {
    loveCountElem.textContent = `${val}%`;
  }

  // Ambil kata-kata dan info tier khusus persentase ini
  const tier = getEnergyTier(val);

  if (energyTierIcon) {
    energyTierIcon.textContent = tier.icon;
  }
  if (energyTierTitle) {
    const titleSuffix = tier.title.includes('• ') ? tier.title.split('• ')[1] : tier.title;
    energyTierTitle.textContent = `${val}% • ${titleSuffix}`;
  }
  if (energyStatusText) {
    energyStatusText.textContent = `"${tier.quote}"`;
  }

  // Efek visual kartu kata-kata motivasi
  if (energyQuoteCard) {
    energyQuoteCard.classList.remove('pop-anim');
    void energyQuoteCard.offsetWidth;
    energyQuoteCard.classList.add('pop-anim');

    if (val === 100) {
      energyQuoteCard.classList.add('max-power');
      if (energyBtnText) energyBtnText.textContent = 'Semangat 100% Sempurna! 👑';
    } else {
      energyQuoteCard.classList.remove('max-power');
      if (energyBtnText) energyBtnText.textContent = 'Berapa persen hari ini kamu bersemangat? 🔥';
    }
  }

  // Respon kata-kata kucing mascot
  if (notifyCat && catBubbleText && catSpeech) {
    catSpeech.style.animation = 'none';
    void catSpeech.offsetWidth;
    catSpeech.style.animation = 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    catBubbleText.textContent = tier.catSpeech;
  }
}

// Inisialisasi awal persentase semangat pada 0%
updateEnergyUI(0, false);

// Event listener slider: kata-kata langsung berubah mengikuti persentase
if (energySlider) {
  energySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    updateEnergyUI(val, false);
    playChimeTone(400 + val * 3, 0.05);
  });

  energySlider.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    updateEnergyUI(val, true);
    if (val === 100) {
      fireConfetti(60, window.innerWidth / 2, window.innerHeight * 0.7);
    }
  });
}

// Fungsi partikel melayang saat tombol diklik
function spawnEnergyBurst() {
  playChimeTone(550 + Math.random() * 250, 0.12);

  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = ENERGY_EMOJIS[Math.floor(Math.random() * ENERGY_EMOJIS.length)];

  const rect = btnSendLove.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 + (Math.random() * 60 - 30);
  const startY = rect.top;

  heart.style.left = `${startX}px`;
  heart.style.top = `${startY}px`;
  heart.style.setProperty('--rot-angle', `${(Math.random() - 0.5) * 40}deg`);

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2800);
}

// Klik tombol: Menambah persen semangat (+10% per klik) hingga maksimal 100%
btnSendLove.addEventListener('click', () => {
  let nextVal;
  if (energyPercent >= 100) {
    nextVal = 100; // tetap 100%
  } else {
    nextVal = Math.min(100, energyPercent + 10);
  }

  updateEnergyUI(nextVal, true);

  for (let i = 0; i < 3; i++) {
    setTimeout(spawnEnergyBurst, i * 80);
  }

  if (nextVal === 100) {
    const rect = btnSendLove.getBoundingClientRect();
    fireConfetti(70, rect.left + rect.width / 2, rect.top);
  }
});

// ===================================================================
// 10. UNTAIAN DOA BAIK & INTERAKSI AAMIIN
// ===================================================================
const PRAYER_EMOJIS = ['🤲', '🤍', '🕊️', '✨', '🌟', '🌸', '💚'];

function playPrayerChord() {
  playChimeTone(528, 0.35); // Solfeggio 528Hz (Harmoni damai)
  setTimeout(() => playChimeTone(660, 0.4), 90);
  setTimeout(() => playChimeTone(792, 0.45), 180);
}

function spawnPrayerParticle() {
  if (!btnAmin) return;
  const rect = btnAmin.getBoundingClientRect();
  const particle = document.createElement('div');
  particle.className = 'prayer-particle';
  particle.textContent = PRAYER_EMOJIS[Math.floor(Math.random() * PRAYER_EMOJIS.length)];

  const startX = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
  const startY = rect.top;

  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 90}px`);
  particle.style.setProperty('--tr', `${(Math.random() - 0.5) * 60}deg`);

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 2200);
}

if (btnAmin) {
  btnAmin.addEventListener('click', () => {
    aminCount++;
    if (aminCountElem) {
      aminCountElem.textContent = aminCount;
    }

    playPrayerChord();

    for (let i = 0; i < 5; i++) {
      setTimeout(spawnPrayerParticle, i * 75);
    }

    showToast('Doa tulusmu telah diaminkan! Semoga diijabah Tuhan Yang Maha Esa 🤲✨');

    // Respon ucapan dari maskot kucing
    if (catBubbleText && catSpeech) {
      catSpeech.style.animation = 'none';
      void catSpeech.offsetWidth;
      catSpeech.style.animation = 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      const catPrayerMessages = [
        "Aamiin ya Rabbal 'Alamin... Doa terbaik selalu menyertaimu! 🤲🤍🐾",
        "Semoga setiap langkah dan ikhtiarmu dimudahkan Tuhan yaa! 🕊️✨",
        "Aku ikut mengaminkan dari sini! Semangat skripsi dan kuliahnya! 🤲🎓",
        "Doa yang tulus akan sampai ke langit. Semangat terus pejuang tangguh! 🌟💖"
      ];
      catBubbleText.textContent = catPrayerMessages[(aminCount - 1) % catPrayerMessages.length];
    }
  });
}

// ===================================================================
// 11. COPY QUOTE TO CLIPBOARD & TOAST
// ===================================================================
function showToast(text) {
  toastMsg.textContent = text;
  toastMsg.classList.add('show');
  setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3200);
}

btnCopyQuote.addEventListener('click', () => {
  const fullMessage = `✨ KATA SEMANGAT & DOA TULUS UNTUKMU ✨\n\n` +
    `🎓 Semangat Kuliahnya!\n` +
    `📑 Semangat Nyusun Skripsinya!\n` +
    `🔥 Semangat, Jangan Malas!\n` +
    `🎓✨ Semangat Cepat Lulus!\n\n` +
    `🤲 UNTAIAN DOA BAIK:\n` +
    `• Semoga setiap langkah dan ikhtiarmu senantiasa dimudahkan dan diberkahi oleh Tuhan.\n` +
    `• Semoga hatimu selalu tenang, dijauhkan dari rasa cemas, dan didekatkan dengan kebahagiaan.\n` +
    `• Semoga skripsi dan kuliahmu tuntas dengan hasil terbaik yang membanggakan orang tua.\n` +
    `• Semoga masa depanmu dipenuhi keberkahan, kesehatan, dan pintu rezeki yang terbuka lebar.\n\n` +
    `"Masa lalu tidak bisa diubah, tapi masa depan mungkin masih bisa diubah. Buanglah masa lalu, dan hidup dimasa depan." 🌟\n\n` +
    `"Semangat buat kamu yang tidak pernah menyerah, gagal? Coba lagi... okeyy, semangatttt!" 💪🔥\n\n` +
    `🎵 Lagu pengiring: Shane Filan - Beautiful in White\n` +
    `Semoga setiap doa dan harapan baikmu segera diijabah! Aamiin 🤲✨`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullMessage)
      .then(() => {
        showToast('Ucapan & doa indah berhasil disalin! 📋✨');
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
    showToast('Ucapan & doa indah berhasil disalin! 📋✨');
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
