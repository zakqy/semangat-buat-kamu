/**
 * PERSONA 5 - SEMPRO CELEBRATION ENGINE
 * Interactive Audio, Metaverse Canvas, Calling Card, Confidant & All-Out Attack Finisher
 */

(function () {
  'use strict';

  // ==============================================================
  // 1. STATE & TARGET CONFIGURATION
  // ==============================================================
  const DEFAULT_TARGET = 'MUTHIA AFIFAH';
  const DEFAULT_DEGREE = 'S.S (Soon)';

  let currentTarget = {
    name: DEFAULT_TARGET,
    degree: DEFAULT_DEGREE
  };

  let sfxEnabled = true;
  let bgmPlaying = false;
  let audioCtx = null;

  // Initialize target from URL query params or localStorage
  function initTargetData() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryName = urlParams.get('name');
    const queryDegree = urlParams.get('degree') || urlParams.get('title');

    if (queryName) {
      currentTarget.name = queryName.trim().toUpperCase();
      if (queryDegree) currentTarget.degree = queryDegree.trim();
    } else {
      const storedName = localStorage.getItem('p5_sempro_target_name');
      const storedDegree = localStorage.getItem('p5_sempro_target_degree');
      if (storedName && !storedName.includes('SOBAT')) {
        currentTarget.name = storedName.toUpperCase();
      } else {
        currentTarget.name = DEFAULT_TARGET;
        localStorage.setItem('p5_sempro_target_name', DEFAULT_TARGET);
      }
      if (storedDegree && !storedDegree.includes('S.Kom')) {
        currentTarget.degree = storedDegree;
      } else {
        currentTarget.degree = DEFAULT_DEGREE;
        localStorage.setItem('p5_sempro_target_degree', DEFAULT_DEGREE);
      }
    }

    updateDOMTargetNames();
  }

  function saveTargetData(name, degree) {
    if (!name || !name.trim()) return;
    currentTarget.name = name.trim().toUpperCase();
    currentTarget.degree = degree ? degree.trim() : DEFAULT_DEGREE;

    localStorage.setItem('p5_sempro_target_name', currentTarget.name);
    localStorage.setItem('p5_sempro_target_degree', currentTarget.degree);

    updateDOMTargetNames();
  }

  function updateDOMTargetNames() {
    const name = currentTarget.name;
    const degree = currentTarget.degree;

    // Update Elements
    const elNavTarget = document.getElementById('nav-target-name');
    const elTargetNameVal = document.getElementById('target-name-val');
    const elTargetDegreeVal = document.getElementById('target-degree-val');
    const elCardTargetBox = document.getElementById('card-target-box');
    const elConfidantTarget = document.getElementById('confidant-target-name');
    const elFooterTarget = document.getElementById('footer-target-name');
    const elAoaTargetName = document.getElementById('aoa-target-name');
    const elAoaTargetDegree = document.getElementById('aoa-target-degree');

    if (elNavTarget) elNavTarget.textContent = name;
    if (elTargetNameVal) elTargetNameVal.textContent = name;
    if (elTargetDegreeVal) elTargetDegreeVal.textContent = degree;
    if (elCardTargetBox) elCardTargetBox.textContent = name;
    if (elConfidantTarget) elConfidantTarget.textContent = name;
    if (elFooterTarget) elFooterTarget.textContent = name;
    if (elAoaTargetName) elAoaTargetName.textContent = name;
    if (elAoaTargetDegree) elAoaTargetDegree.textContent = degree;

    // Update any dynamic in-text tags
    document.querySelectorAll('.d-target').forEach(el => {
      el.textContent = name;
    });
  }

  // ==============================================================
  // 2. SYNTHESIZED WEB AUDIO API SOUND EFFECTS (P5 VIBE)
  // ==============================================================
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSfx(type) {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'click') {
        // High pitched snappy square blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'slash') {
        // White noise whoosh + metallic high tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'aoa') {
        // Sub-bass thump + fanfare chime
        const oscBass = ctx.createOscillator();
        const gainBass = ctx.createGain();
        oscBass.type = 'sine';
        oscBass.frequency.setValueAtTime(160, now);
        oscBass.frequency.exponentialRampToValueAtTime(35, now + 0.5);
        gainBass.gain.setValueAtTime(0.6, now);
        gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        oscBass.connect(gainBass);
        gainBass.connect(ctx.destination);
        oscBass.start(now);
        oscBass.stop(now + 0.5);

        // Fanfare chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + 0.05 * idx);
          gain.gain.setValueAtTime(0.15, now + 0.05 * idx);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.05 * idx);
          osc.stop(now + 0.6);
        });
      } else if (type === 'confidant') {
        // Harp like chime
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.4);
        });
      }
    } catch (e) {
      console.warn('Web Audio SFX error:', e);
    }
  }

  // ==============================================================
  // 3. BACKGROUND MUSIC (BGM) & AUDIO CONTROLLER
  // ==============================================================
  const bgmAudio = document.getElementById('bgm-audio');
  const btnToggleBgm = document.getElementById('btn-toggle-bgm');
  const bgmLabel = document.getElementById('bgm-label');
  const bgmIcon = document.getElementById('bgm-icon');
  const audioUnlockBanner = document.getElementById('audio-unlock-banner');

  let unlockListenersBound = false;

  function updateBgmUI(isPlaying) {
    if (audioUnlockBanner) {
      if (isPlaying) {
        audioUnlockBanner.classList.add('hidden-banner');
      } else if (!btnToggleBgm?.dataset.userPaused) {
        audioUnlockBanner.classList.remove('hidden-banner');
      }
    }
    if (!btnToggleBgm) return;
    if (isPlaying) {
      btnToggleBgm.classList.remove('paused');
      if (bgmLabel) bgmLabel.textContent = 'BGM: ON';
      if (bgmIcon) bgmIcon.textContent = '🎵';
      btnToggleBgm.setAttribute('title', 'Pause Music (School Days)');
    } else {
      btnToggleBgm.classList.add('paused');
      if (bgmLabel) bgmLabel.textContent = 'BGM: PAUSED';
      if (bgmIcon) bgmIcon.textContent = '🔇';
      btnToggleBgm.setAttribute('title', 'Play Music (School Days)');
    }
  }

  function removeUnlockListeners() {
    if (!unlockListenersBound) return;
    unlockListenersBound = false;
    ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, handleAnyUserClickToPlay, true);
    });
  }

  function handleAnyUserClickToPlay() {
    if (btnToggleBgm?.dataset.userPaused) {
      removeUnlockListeners();
      return;
    }
    getAudioContext();
    if (bgmAudio && bgmAudio.paused) {
      playBgm();
    }
  }

  function playBgm() {
    if (!bgmAudio) return;
    bgmAudio.volume = 0.65;
    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          bgmPlaying = true;
          updateBgmUI(true);
          // Only remove listeners after playback has genuinely started!
          removeUnlockListeners();
        })
        .catch(() => {
          // Autoplay blocked by browser policy before direct user click,
          // KEEP listeners active so clicking ANYWHERE on the screen triggers audio!
          bgmPlaying = false;
          updateBgmUI(false);
        });
    }
  }

  function pauseBgm() {
    if (!bgmAudio) return;
    bgmAudio.pause();
    bgmPlaying = false;
    updateBgmUI(false);
  }

  function setupAudioControls() {
    // 1. Attempt immediate autoplay when page loads
    playBgm();

    // 2. Global capture listener: Clicking or tapping ANYWHERE on the screen
    // (background, buttons, text, cards) will trigger playback immediately!
    unlockListenersBound = true;
    ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      document.addEventListener(evt, handleAnyUserClickToPlay, { capture: true, passive: true });
    });

    // 3. Audio unlock floating prompt click
    if (audioUnlockBanner) {
      audioUnlockBanner.addEventListener('click', () => {
        delete btnToggleBgm?.dataset.userPaused;
        playBgm();
      });
    }

    // 4. Toggle button listener
    if (btnToggleBgm) {
      btnToggleBgm.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgmAudio) {
          if (bgmAudio.paused) {
            delete btnToggleBgm.dataset.userPaused;
            playBgm();
          } else {
            btnToggleBgm.dataset.userPaused = 'true';
            pauseBgm();
            removeUnlockListeners();
          }
          playSfx('click');
        }
      });
    }

    // 5. Ensure continuous loop
    if (bgmAudio) {
      bgmAudio.addEventListener('ended', () => {
        bgmAudio.currentTime = 0;
        playBgm();
      });
    }
  }

  // ==============================================================
  // 4. METAVERSE CANVAS PARTICLES & GEOMETRY
  // ==============================================================
  function setupMetaverseCanvas() {
    const canvas = document.getElementById('p5-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particles: Persona 5 floating 4-pointed stars and sharp shards
    const particles = [];
    const count = Math.min(35, Math.floor(width / 30));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -Math.random() * 0.8 - 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: Math.random() > 0.4 ? '#e60012' : (Math.random() > 0.5 ? '#ffe600' : '#ffffff'),
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    function drawP5Star(ctx, x, y, size, rotation, color, opacity) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      // 4-pointed sharp star
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.25, -size * 0.25);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.25, size * 0.25);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.25, size * 0.25);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.25, -size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    let frame = 0;
    function animate() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle diagonal red slash bands moving slowly in background
      const bandOffset = (frame * 0.3) % 200;
      ctx.fillStyle = 'rgba(230, 0, 18, 0.025)';
      for (let x = -width; x < width * 2; x += 160) {
        ctx.beginPath();
        ctx.moveTo(x + bandOffset, 0);
        ctx.lineTo(x + bandOffset + 50, 0);
        ctx.lineTo(x + bandOffset - 100, height);
        ctx.lineTo(x + bandOffset - 150, height);
        ctx.closePath();
        ctx.fill();
      }

      // Draw and update stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawP5Star(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ==============================================================
  // 5. ALL-OUT ATTACK (AOA) CELEBRATION FINISHER
  // ==============================================================
  const aoaModal = document.getElementById('aoa-modal');
  const btnTriggerAoa = document.getElementById('btn-trigger-aoa');
  const btnCloseAoa = document.getElementById('btn-close-aoa');
  const btnCornerCloseAoa = document.getElementById('btn-corner-close-aoa');
  const btnReplayAoa = document.getElementById('btn-replay-aoa');
  const aoaCanvas = document.getElementById('aoa-confetti-canvas');
  const aoaStage = document.querySelector('.aoa-stage');

  let aoaConfettiAnimId = null;

  function triggerAllOutAttack() {
    if (!aoaModal) return;
    playSfx('slash');
    setTimeout(() => playSfx('aoa'), 200);

    // Remove any inline transform on body that breaks position: fixed
    document.body.style.transform = '';
    document.body.classList.add('aoa-open');

    aoaModal.classList.add('active');
    aoaModal.setAttribute('aria-hidden', 'false');

    // Trigger Screen Shake on stage element without breaking layout
    if (aoaStage) {
      aoaStage.classList.remove('shake');
      void aoaStage.offsetWidth; // force reflow
      aoaStage.classList.add('shake');
    }

    // Launch Confetti Starburst
    launchAoaConfetti();
  }

  function closeAllOutAttack() {
    if (!aoaModal) return;
    aoaModal.classList.remove('active');
    aoaModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('aoa-open');
    document.body.style.transform = '';

    if (aoaStage) {
      aoaStage.classList.remove('shake');
    }

    if (aoaConfettiAnimId) {
      cancelAnimationFrame(aoaConfettiAnimId);
      aoaConfettiAnimId = null;
    }
    playSfx('click');
  }

  function launchAoaConfetti() {
    if (!aoaCanvas) return;
    const ctx = aoaCanvas.getContext('2d');
    let width = (aoaCanvas.width = window.innerWidth);
    let height = (aoaCanvas.height = window.innerHeight);

    const particles = [];
    const colors = ['#e60012', '#ffffff', '#ffe600', '#000000', '#b8000e'];

    // Spawn 120 confetti pieces radiating outwards
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        alpha: 1,
        isStar: Math.random() > 0.4
      });
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.005;

        if (p.alpha > 0.05 && p.y < height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.isStar) {
            // Star
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.3, -p.size * 0.3);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(p.size * 0.3, p.size * 0.3);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size * 0.3, p.size * 0.3);
            ctx.lineTo(-p.size, 0);
            ctx.lineTo(-p.size * 0.3, -p.size * 0.3);
            ctx.closePath();
            ctx.fill();
          } else {
            // Slanted comic ribbon
            ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
          }
          ctx.restore();
        }
      }

      if (alive && aoaModal.classList.contains('active')) {
        aoaConfettiAnimId = requestAnimationFrame(renderConfetti);
      }
    }

    if (aoaConfettiAnimId) cancelAnimationFrame(aoaConfettiAnimId);
    renderConfetti();
  }

  // ==============================================================
  // 6. PHANTOM DIALOGUE / CHAT SYSTEM
  // ==============================================================
  const THIEVES_DATA = [
    {
      name: 'MORGANA',
      emoji: '🐱',
      image: 'morgana.jpg',
      color: '#e60012',
      lines: [
        'Looking cool, {name}! The examination committee was completely captivated by your presentation today!',
        'You have successfully cleared the toughest hurdle of this semester. Now it is time for some well-deserved rest!'
      ]
    },
    {
      name: 'RYUJI',
      emoji: '⚡',
      image: 'ryuji.jpg',
      color: '#ffe600',
      lines: [
        'FOR REAL?! You were totally awesome! I know you pulled countless all-nighters grinding that proposal!',
        'Proposal defense is in the bag, now let us celebrate! Good food, binge watching, and forget about revisions for today!'
      ]
    },
    {
      name: 'MAKOTO',
      emoji: '🏍️',
      image: 'makoto.jpg',
      color: '#1a1a24',
      lines: [
        'Congratulations on passing your Thesis Proposal Defense, {name}. Your academic arguments were logical and airtight.',
        'My advice: gather the examiners notes today, tackle revisions step-by-step, and chapters 4 & 5 will be yours to conquer!'
      ]
    },
    {
      name: 'FUTABA',
      emoji: '👾',
      image: 'futaba.jpg',
      color: '#10b981',
      lines: [
        'BEEP BOOP! Target Proposal Defense Palace: TOTAL ANNIHILATION! EXP +9999!',
        'Your intellectual stats skyrocketed today! Only one final boss fight remains until your degree: THE FINAL THESIS! You got this!'
      ]
    },
    {
      name: 'JOKER',
      emoji: '🃏',
      image: 'joker.jpg',
      color: '#e60012',
      lines: [
        'Show them what you are made of, {name}. This victory is living proof of your relentless dedication.',
        'The road to graduation is wide open. We will back you up all the way until that graduation cap is firmly on your head!'
      ]
    }
  ];

  let currentThiefIndex = 0;
  let currentLineIndex = 0;
  let isTyping = false;
  let typewriterTimeout = null;

  const elSpeakerEmoji = document.getElementById('speaker-emoji');
  const elAvatarArt = document.getElementById('avatar-art');
  const elSpeakerTag = document.getElementById('speaker-tag');
  const elDialogueText = document.getElementById('dialogue-text');
  const elMsgCounter = document.getElementById('msg-counter');
  const btnPrevDialogue = document.getElementById('btn-prev-dialogue');
  const btnNextDialogue = document.getElementById('btn-next-dialogue');
  const thiefButtons = document.querySelectorAll('.thief-btn');

  function renderThiefDialogue(instant = false) {
    const thief = THIEVES_DATA[currentThiefIndex];
    if (!thief) return;

    if (elAvatarArt) {
      if (thief.image) {
        elAvatarArt.innerHTML = `<img src="${thief.image}" alt="${thief.name}" class="speaker-portrait-img" />`;
      } else {
        elAvatarArt.innerHTML = `<span class="avatar-emoji" id="speaker-emoji">${thief.emoji}</span>`;
      }
    } else if (elSpeakerEmoji) {
      elSpeakerEmoji.textContent = thief.emoji;
    }

    if (elSpeakerTag) elSpeakerTag.textContent = thief.name;
    if (elMsgCounter) elMsgCounter.textContent = `${currentThiefIndex + 1} / ${THIEVES_DATA.length}`;

    // Update active tab button
    thiefButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentThiefIndex);
    });

    const rawLine = thief.lines[currentLineIndex] || thief.lines[0];
    const parsedLine = rawLine.replace(/\{name\}/g, currentTarget.name);

    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    if (instant) {
      elDialogueText.innerHTML = `"${parsedLine}"`;
      isTyping = false;
    } else {
      typeWriterEffect(parsedLine);
    }

    if (btnPrevDialogue) btnPrevDialogue.disabled = (currentThiefIndex === 0 && currentLineIndex === 0);
  }

  function typeWriterEffect(text) {
    isTyping = true;
    elDialogueText.innerHTML = '"';
    let charIndex = 0;

    function step() {
      if (charIndex < text.length) {
        elDialogueText.innerHTML = `"${text.substring(0, charIndex + 1)}"`;
        charIndex++;
        typewriterTimeout = setTimeout(step, 20);
      } else {
        isTyping = false;
      }
    }

    step();
  }

  function setupDialogueControls() {
    thiefButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (!isNaN(idx) && idx !== currentThiefIndex) {
          currentThiefIndex = idx;
          currentLineIndex = 0;
          playSfx('click');
          renderThiefDialogue();
        }
      });
    });

    if (btnNextDialogue) {
      btnNextDialogue.addEventListener('click', () => {
        playSfx('click');
        const thief = THIEVES_DATA[currentThiefIndex];
        if (currentLineIndex < thief.lines.length - 1) {
          currentLineIndex++;
          renderThiefDialogue();
        } else if (currentThiefIndex < THIEVES_DATA.length - 1) {
          currentThiefIndex++;
          currentLineIndex = 0;
          renderThiefDialogue();
        } else {
          // Loop back
          currentThiefIndex = 0;
          currentLineIndex = 0;
          renderThiefDialogue();
        }
      });
    }

    if (btnPrevDialogue) {
      btnPrevDialogue.addEventListener('click', () => {
        playSfx('click');
        if (currentLineIndex > 0) {
          currentLineIndex--;
          renderThiefDialogue();
        } else if (currentThiefIndex > 0) {
          currentThiefIndex--;
          currentLineIndex = THIEVES_DATA[currentThiefIndex].lines.length - 1;
          renderThiefDialogue();
        }
      });
    }

    // Clicking the dialogue box completes typing instantly
    if (elDialogueText) {
      elDialogueText.parentElement.addEventListener('click', () => {
        if (isTyping) {
          if (typewriterTimeout) clearTimeout(typewriterTimeout);
          const rawLine = THIEVES_DATA[currentThiefIndex].lines[currentLineIndex];
          elDialogueText.innerHTML = `"${rawLine.replace(/\{name\}/g, currentTarget.name)}"`;
          isTyping = false;
        }
      });
    }
  }

  // ==============================================================
  // 7. SLIDE DECK SYSTEM (PERSONA 5 PRESENTATION MODE)
  // ==============================================================
  let currentSlide = 0;
  let slides = [];
  let dockPills = [];
  let dockBtnPrev = null;
  let dockBtnNext = null;
  let dockCurrIdx = null;

  function goToSlide(index, playSound = true) {
    if (!slides.length) slides = Array.from(document.querySelectorAll('.p5-slide'));
    if (index < 0 || index >= slides.length) return;
    if (index === currentSlide && slides[index].classList.contains('active')) return;

    const prevIndex = currentSlide;
    currentSlide = index;

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'slide-from-left', 'slide-from-right');
      if (idx === currentSlide) {
        slide.classList.add('active');
        if (index > prevIndex) {
          slide.classList.add('slide-from-right');
        } else if (index < prevIndex) {
          slide.classList.add('slide-from-left');
        }
      }
    });

    if (!dockPills.length) dockPills = Array.from(document.querySelectorAll('.dock-pill'));
    dockPills.forEach((pill, idx) => {
      const isActive = idx === currentSlide;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (!dockCurrIdx) dockCurrIdx = document.getElementById('dock-curr-idx');
    if (dockCurrIdx) {
      dockCurrIdx.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    if (!dockBtnPrev) dockBtnPrev = document.getElementById('dock-btn-prev');
    if (!dockBtnNext) dockBtnNext = document.getElementById('dock-btn-next');

    if (dockBtnPrev) {
      dockBtnPrev.disabled = currentSlide === 0;
      dockBtnPrev.classList.toggle('disabled', currentSlide === 0);
    }

    if (dockBtnNext) {
      const isLast = currentSlide === slides.length - 1;
      const inner = dockBtnNext.querySelector('.dock-btn-inner');
      if (inner) {
        inner.textContent = isLast ? 'REPLAY ↺' : 'NEXT ▶';
      }
    }

    // Scroll smoothly to top of the slide
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger contextual Joker cheer without blocking view
    if (typeof triggerJokerSlideReaction === 'function') {
      triggerJokerSlideReaction(currentSlide);
    }

    if (playSound) {
      if (currentSlide === 2) {
        playSfx('confidant');
      } else {
        playSfx('click');
      }
    }
  }

  function nextSlide() {
    if (!slides.length) slides = Array.from(document.querySelectorAll('.p5-slide'));
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // loop back to first slide
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  function setupNavigationButtons() {
    slides = Array.from(document.querySelectorAll('.p5-slide'));
    dockPills = Array.from(document.querySelectorAll('.dock-pill'));
    dockBtnPrev = document.getElementById('dock-btn-prev');
    dockBtnNext = document.getElementById('dock-btn-next');
    dockCurrIdx = document.getElementById('dock-curr-idx');

    const btnOpenCard = document.getElementById('btn-open-card');
    const btnOpenConfidant = document.getElementById('btn-open-confidant');
    const btnOpenChat = document.getElementById('btn-open-chat');
    const btnSlideTriggerAoa = document.getElementById('btn-slide-trigger-aoa');

    // Slide 1 Hero Action Menu buttons
    if (btnOpenCard) {
      btnOpenCard.addEventListener('click', () => goToSlide(1));
    }
    if (btnOpenConfidant) {
      btnOpenConfidant.addEventListener('click', () => goToSlide(2));
    }
    if (btnOpenChat) {
      btnOpenChat.addEventListener('click', () => goToSlide(3));
    }

    // Slide Contextual Advance Buttons
    document.querySelectorAll('.btn-slide-advance[data-next-slide]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.dataset.nextSlide, 10);
        if (!isNaN(target)) goToSlide(target);
      });
    });

    if (btnSlideTriggerAoa) {
      btnSlideTriggerAoa.addEventListener('click', triggerAllOutAttack);
    }

    // Bottom Slide Dock Controls
    if (dockBtnPrev) {
      dockBtnPrev.addEventListener('click', prevSlide);
    }
    if (dockBtnNext) {
      dockBtnNext.addEventListener('click', nextSlide);
    }
    dockPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const target = parseInt(pill.dataset.goto, 10);
        if (!isNaN(target)) goToSlide(target);
      });
    });

    // Touch Swipe Navigation for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const slidesContainer = document.getElementById('p5-slides-container') || document.body;

    slidesContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
      if (aoaModal && aoaModal.classList.contains('active')) return;
      if (e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        // Require horizontal distance > 50px and mostly horizontal
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }
    }, { passive: true });

    // Keyboard Shortcuts: ESC for AOA, Arrow keys / Q / E / 1-5 for slides
    window.addEventListener('keydown', (e) => {
      if (aoaModal && aoaModal.classList.contains('active')) {
        if (e.key === 'Escape') closeAllOutAttack();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key.toLowerCase() === 'e') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key.toLowerCase() === 'q') {
        prevSlide();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        goToSlide(parseInt(e.key, 10) - 1);
      }
    });

    // All-Out Attack Triggers
    if (btnTriggerAoa) {
      btnTriggerAoa.addEventListener('click', triggerAllOutAttack);
    }
    if (btnCloseAoa) {
      btnCloseAoa.addEventListener('click', closeAllOutAttack);
    }
    if (btnCornerCloseAoa) {
      btnCornerCloseAoa.addEventListener('click', closeAllOutAttack);
    }
    if (btnReplayAoa) {
      btnReplayAoa.addEventListener('click', () => {
        triggerAllOutAttack();
      });
    }

    // Click outside stage on modal backdrop to close
    if (aoaModal) {
      aoaModal.addEventListener('click', (e) => {
        if (e.target === aoaModal) {
          closeAllOutAttack();
        }
      });
    }

    // Button generic SFX hover and click sounds
    document.querySelectorAll('[data-sfx]').forEach(btn => {
      btn.addEventListener('mouseenter', () => playSfx('click'));
    });
  }

  // ==============================================================
  // 8. FLOATING JOKER COMPANION INTERACTION
  // ==============================================================
  const JOKER_COMPANION_QUOTES = [
    'Hey Muthia! Tap me or open the calling card~ 🃏✨',
    'Looking cool, Muthia! You totally stunned the examination committee! 🎓',
    'Exhausted from chapters 1 through 3? Today is time for a tasty self-reward meal! 🍕',
    'Do not fear revisions Muthia, they are just exp boosts to make your thesis overpowered! ⚡',
    'One step closer to your Bachelor of Literature (S.S) degree! Incredibly proud of you! 🌸',
    'Press "ALL-OUT ATTACK!" above to witness your special victory finisher! ⚔️',
    'Take your time, but remember to graduate on schedule, Muthia! You got this! 🎩'
  ];

  const JOKER_SLIDE_REACTIONS = [
    'Palace Infiltration: SUCCESS! You conquered the proposal! 🏆',
    'Official Calling Card delivered from the Phantom Thieves! 💌',
    'The Scholar Arcana: Confidant Rank MAX established! 🃏',
    'Incoming Metaverse Transmission from the crew! 🐱💬',
    'Strategy guide: 4 tips to defeat every revision remark! ⚡'
  ];

  let currentCompanionQuoteIndex = 0;
  let companionBubbleTimer = null;
  let triggerJokerSlideReaction = null;

  function setupJokerCompanion() {
    const speechEl = document.getElementById('joker-speech');
    const speechTextEl = document.getElementById('joker-speech-text');
    const avatarBtn = document.getElementById('joker-avatar-btn');

    if (!speechEl || !speechTextEl || !avatarBtn) return;

    function showBubble(text, duration = 3800) {
      if (companionBubbleTimer) clearTimeout(companionBubbleTimer);
      if (text) speechTextEl.textContent = text;
      speechEl.classList.remove('hidden-bubble');

      companionBubbleTimer = setTimeout(() => {
        speechEl.classList.add('hidden-bubble');
      }, duration);
    }

    function nextJokerQuote() {
      playSfx('confidant');
      currentCompanionQuoteIndex = (currentCompanionQuoteIndex + 1) % JOKER_COMPANION_QUOTES.length;

      speechEl.style.transform = 'scale(0.85)';
      setTimeout(() => {
        showBubble(JOKER_COMPANION_QUOTES[currentCompanionQuoteIndex], 4000);
        speechEl.style.transform = 'scale(1.06)';
        setTimeout(() => {
          speechEl.style.transform = '';
        }, 150);
      }, 80);

      avatarBtn.style.transform = 'scale(1.18) rotate(10deg)';
      setTimeout(() => {
        avatarBtn.style.transform = '';
      }, 250);
    }

    // Expose contextual slide cheer
    triggerJokerSlideReaction = function(slideIdx) {
      if (JOKER_SLIDE_REACTIONS[slideIdx]) {
        showBubble(JOKER_SLIDE_REACTIONS[slideIdx], 3200);
      }
    };

    // Auto-hide initial welcome bubble after 3.2s so it never blocks cards
    companionBubbleTimer = setTimeout(() => {
      speechEl.classList.add('hidden-bubble');
    }, 3200);

    // Hover shows bubble, mouseleave starts hide countdown
    avatarBtn.addEventListener('mouseenter', () => {
      showBubble(null, 3500);
    });

    speechEl.addEventListener('click', nextJokerQuote);
    avatarBtn.addEventListener('click', nextJokerQuote);
  }

  // ==============================================================
  // 9. INITIALIZATION
  // ==============================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTargetData();
    setupAudioControls();
    setupMetaverseCanvas();
    setupDialogueControls();
    setupNavigationButtons();
    setupJokerCompanion();
    renderThiefDialogue(true);
  });

})();
