/**
 * FOR YOU — MASTERPIECE REALISTIC & VIBRANT ASCII ROSE & ENVELOPE
 * Features:
 * - Delicate, compact heart seal (NO black box background, natural envelope line transition)
 * - Ethereal white pulsing light wave (poslash kabi oq nur to'lqini) gliding across heart and petals
 * - Proper anatomical leaf placement with connecting stalks, lime veins, and serrations
 * - Unbroken, lush, multi-tiered organic rose blossom
 * - Realistic stem with calyx sepals and thorns
 * - Strict audio control: restarts from 0:00 every time opened, stops and resets to 0:00 when closed
 * - Manual click-only opening (no auto-click/auto-play)
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('stageCanvas');
  const ctx = canvas.getContext('2d');
  const clickPrompt = document.getElementById('clickPrompt');
  const audioBtn = document.getElementById('audioBtn');
  const audioIcon = document.getElementById('audioIcon');
  const starsLayer = document.getElementById('starsLayer');

  const soundCtrl = window.soundController;

  // Ultra High-Density Grid (104 cols x 72 rows)
  const cols = 104;
  const rows = 72;
  let cellW = 7.5;
  let cellH = 11.0;
  let fontSize = 8.5;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const maxW = Math.min(window.innerWidth * 0.96, 920);
    const maxH = Math.min(window.innerHeight * 0.92, 720);

    let w = maxW;
    let h = (w * rows * 1.42) / (cols * 1.0);
    if (h > maxH) {
      h = maxH;
      w = (h * cols * 1.0) / (rows * 1.42);
    }

    canvas.style.width = `${Math.floor(w)}px`;
    canvas.style.height = `${Math.floor(h)}px`;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    cellW = w / cols;
    cellH = h / rows;
    fontSize = Math.max(7.0, Math.floor(cellH * 0.82));
  }

  resize();
  window.addEventListener('resize', resize);

  // Background stars
  const starSymbols = ['·', '•', '+', '*', '✦', '°'];
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty('--d', `${2 + Math.random() * 3.5}s`);
    starsLayer.appendChild(s);
  }

  // Animation State (Strictly waits for user click)
  let state = 'closed'; // 'closed' | 'opening' | 'bloomed'
  let stateTime = 0;
  let animTime = 0;
  let flapProgress = 0;
  let bloomProgress = 0;

  const floatingHearts = [];
  const sparkleParticles = [];

  // Audio button toggle
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (soundCtrl) {
      const active = soundCtrl.toggle();
      audioIcon.textContent = active ? '🎵' : '🔇';
    }
  });

  // Strictly user-click driven: restarts audio on open, stops & resets on close
  function handleUserClick() {
    if (state === 'closed') {
      state = 'opening';
      stateTime = 0;
      clickPrompt.classList.add('hidden');
      if (soundCtrl) {
        soundCtrl.play(); // Restarts strictly from 0:00
        soundCtrl.playPaperSound();
      }
      spawnBurst(cols / 2, 48);
    } else if (state === 'bloomed') {
      // Replay: close back to envelope
      state = 'closed';
      stateTime = 0;
      flapProgress = 0;
      bloomProgress = 0;
      floatingHearts.length = 0;
      clickPrompt.classList.remove('hidden');
      if (soundCtrl) {
        soundCtrl.stop(); // Stops AND resets strictly to 0:00
      }
    }
  }

  document.getElementById('stage').addEventListener('click', handleUserClick);
  document.getElementById('stage').addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleUserClick();
  }, { passive: false });

  function spawnBurst(cx, cy) {
    const chars = ['♥', '♡', '✦', '✧', '*', '+', '•'];
    const colors = ['#ff007f', '#ff1744', '#ffd700', '#00f0ff', '#ffffff'];
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4.2;
      sparkleParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed * 1.4,
        vy: Math.sin(angle) * speed * 0.8,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.014 + Math.random() * 0.016
      });
    }
  }

  // =========================================================================
  // MULTI-STAGE BOTANICAL ROSE BLOOMING MODELS (Bud -> Opening -> Full Bloom)
  // Matching the user's authentic velvety rose bud photo
  // =========================================================================

  // Stage 0: Slender, tightly closed Rosebud (G'uncha)
  const roseBudLines = [
    "              (~'-.)            ",
    "          .-'~  @   ~'-.        ",
    "        .'   .(@@@).    '.      ",
    "       /    (%@@@@@%)     \\     ",
    "      /    (%%@@@@@%%)     \\    ",
    "     (    (%%%@@@@@%%%)     )   ",
    "     (   (%%%%@@@@@@%%%)    )   ",
    "     (   (%%%%@@@@@@%%%)    )   ",
    "     (   (%%%%%@@@@%%%%)    )   ",
    "     (   (%%%%%%%%%%%%%)    )   ",
    "      \\   (%%%%%%%%%%%)    /    ",
    "       \\   (%%%%%%%%%)    /     ",
    "        '.  (%%%%%%%)   .'      ",
    "          '-. (%%%)  .-'        ",
    "             '-(%)--'           ",
    "                '-'             "
  ];

  // Upright sepals embracing the bud base closely
  const budCalyxLines = [
    "             \\         /        ",
    "              \\   |   /         ",
    "               \\ / \\ /          ",
    "                \\###/           ",
    "                 ###            "
  ];

  // Stage 1: Half-opened Rose (G'uncha ochilmoqda, barglar qatlamlari yoyilmoqda)
  const roseOpeningLines = [
    "                 (~'-.)               ",
    "            ~'----------.)            ",
    "        -.)oo000000OOooo****°oo0~     ",
    "      '`-~~oo000°0OOo**++++***oo00'   ",
    "     '`---oO0000000O%&$§SSSS$$0OO0.)  ",
    "    (~~++*ooO00%%%%&$§SSS#@@@@%%%%%&° ",
    "    ^'++++**oO%%%%%&$§BB8@@@#888#$$&&%",
    "    -.++++++**&%%%%%&BBBBB###BBBBBS§$$",
    "    (0*+++++++°$&%%%%%#888#@@@8BB§§§§$",
    "     'oooOOooo****SSSS§§§§§$$$&&&&$$$$",
    "      '`~~~~~000OOOOOOOS§§§§$$$$&&&&&*",
    "       '~~~~~~~~~0000000000OOOoo**++++",
    "         ~'-~~~~ooooo0OOOooo**+++++++*",
    "                       -.0oooo~~---~'-"
  ];

  // Sepals peeling outward as flower opens
  const halfCalyxLines = [
    "           \\   /  \\ | /  \\   /        ",
    "            \\ # \\ ### / # /           ",
    "             \\  ######  /             ",
    "                ######                ",
    "                 ####                 "
  ];

  // =========================================================================
  // Stage 2: MASTER FULL OPEN ROSE BLOSSOM MODEL
  // =========================================================================
  const masterRoseLines = [
    "                                      (~'-.)                    ",
    "                                 ~'----------.)                 ",
    "                  ~'-.)^\"`(~'-.~--------------~-                ",
    "              -.)oo000000OOooo********°oo~~oooo0~               ",
    "            \"`-~~oo000°0OOo**++++***ooooOOOOOO00\"               ",
    "          '----~O000000OOo*++++**ooOOOOOOOOOOOOO0)^             ",
    "         \"`---oO0000000O%&$§SSSSSS§§§§$$0OOOOOOOOO0.)           ",
    "        -.~~**oO00000%%%&§SSSSS$$&%%%%%%&&&OOOOooooooo.)        ",
    "        (~~++*ooO00%%%%&$§SSS#@@@@%%%%%%%%%&°ooooooo-~~~o.      ",
    "        ^\"++++**oO%%%%%&$§BB8@@@#888#$$&&&%&&oooooooo----~'     ",
    "        -.++++++**&%%%%%&BBBBB###BBBBBS§$$&&&ooooooo*----\"`     ",
    "        (0*+++++++°$&%%%%%#888#@@@8BB§§§§$$&&OOOooooo----.      ",
    "       )^oo**++++++S§$$$&&&$$@@@@#&&$$$$$$$$OOOOOOOo---`(       ",
    "       'oooOOooo****SSSS§§§§§$$$&&&&$$$$$$OOOOOOOOOo~-.         ",
    "      \"`~~~~~000OOOOOOOS§§§§$$$$&&&&&&&*ooOOO000000\"`           ",
    "      .)~~~~~~~000000000000000OOoo******ooOOO0000'-             ",
    "       '~~~~~~~~~0000000000OOOoo**++++**oOOO00)^                ",
    "         ~'-~~~~ooooo0OOOooo**+++++++*oo~~o`(                   ",
    "                       -.0oooo~~-------~'-                      ",
    "                          -.~~~~------^\"                        ",
    "                              .)^\"`(                            "
  ];

  // Calyx Sepals (green leaflets cupping flower base)
  const calyxLines = [
    "             \\   /  \\ | /  \\   /             ",
    "              \\ # \\/ ### \\/ # /              ",
    "               \\  ######  /                  ",
    "                \\  ####  /                   ",
    "                   ####                      "
  ];

  // Realistic Serrated Left Leaf (Tilted up-left)
  const leftLeafArt = [
    "            .---.          ",
    "        _.-'  /  '-._      ",
    "      .'    / /  /   '.    ",
    "     /  /  / /  /  /   \\   ",
    "    |  /  / /  /  /     |  ",
    "    ( X  $  %  &  *  +  )  ",
    "     \\   / /  /  /     /   ",
    "      '.    / /  /   .'    ",
    "        '-._  /  _.-'      ",
    "            '-'            "
  ];

  // Realistic Sweeping Right Leaf (Tilted up-right)
  const rightLeafArt = [
    "          .---.            ",
    "      _.-'  \\  '-._        ",
    "    .'   \\  \\ \\    '.      ",
    "   /   \\  \\  \\ \\  \\  \\     ",
    "  |     \\  \\  \\ \\  \\  |    ",
    "  (  +  *  &  %  $  X )    ",
    "   \\     \\  \\  \\ \\   /     ",
    "    '.    \\  \\ \\   .'      ",
    "      '-._  \\  _.-'        ",
    "          '-'              "
  ];

  // Delicate, compact authentic wax seal Heart model (16 cols x 8 rows)
  const sealHeartArt = [
    "    ++    ++    ",
    "   %@@%  %@@%   ",
    " %@0000%%0000@% ",
    " %000000000000% ",
    "  *%00000000%*  ",
    "    *%0000%*    ",
    "      *%%*      ",
    "       **       "
  ];

  // Main Animation Loop
  let lastTime = performance.now();

  function animate(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;
    animTime += dt;
    stateTime += dt;

    if (state === 'opening') {
      flapProgress = Math.min(1.0, stateTime / 1.3);
      if (flapProgress > 0.22) {
        bloomProgress = Math.min(1.0, (stateTime - 0.30) / 2.6);
      }
      if (flapProgress >= 1.0 && bloomProgress >= 1.0) {
        state = 'bloomed';
      }
    } else if (state === 'bloomed') {
      flapProgress = 1.0;
      bloomProgress = 1.0;

      // Spawn floating hearts
      if (Math.random() < 0.09 && floatingHearts.length < 26) {
        const heartColors = ['#ff007f', '#ff2a6d', '#ff7597', '#ff6584'];
        floatingHearts.push({
          x: cols / 2 + (Math.random() - 0.5) * 36,
          y: 54 + Math.random() * 4,
          vy: -(0.35 + Math.random() * 0.45),
          sway: 1.5 + Math.random() * 2,
          char: Math.random() > 0.4 ? '♥' : '♡',
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          alpha: 1.0
        });
      }
    }

    // Update floating hearts
    for (let i = floatingHearts.length - 1; i >= 0; i--) {
      const h = floatingHearts[i];
      h.y += h.vy;
      h.x += Math.sin(animTime * h.sway) * 0.045;
      h.alpha -= 0.005;
      if (h.y < 2 || h.alpha <= 0) {
        floatingHearts.splice(i, 1);
      }
    }

    // Update sparkles
    for (let i = sparkleParticles.length - 1; i >= 0; i--) {
      const sp = sparkleParticles[i];
      sp.x += sp.vx * dt * 8;
      sp.y += sp.vy * dt * 8;
      sp.life -= sp.decay;
      if (sp.life <= 0) {
        sparkleParticles.splice(i, 1);
      }
    }

    renderGrid();
    requestAnimationFrame(animate);
  }

  function renderGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mathematical positive modulo helper for continuous, infinite wave loops
    const posMod = (n, m) => ((n % m) + m) % m;

    let flowerBaseY = 46;
    let swayOffset = 0;

    // Initialize character matrix
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = { char: ' ', color: '#fff', glow: 0, alpha: 0 };
      }
    }

    const cx = Math.floor(cols / 2);

    // =========================================================================
    // 1. HIGH-DENSITY TEXTURED ENVELOPE (76 cols wide x 28 rows high)
    // Sits at rows 42 to 68 so flower and leaves bloom cleanly ABOVE it!
    // =========================================================================
    const envW = 76;
    const x0 = cx - Math.floor(envW / 2);
    const x1 = cx + Math.floor(envW / 2);
    const y0 = 42;
    const y1 = 68;
    const yc = 53;

    // Flap apex moves up as envelope opens
    const yApexClosed = yc;
    const yApexOpen = y0 - (yc - y0) - 3;
    const apexY = Math.round(yApexClosed + (yApexOpen - yApexClosed) * flapProgress);

    // Scanline patterns
    const lineStyles = [
      "+===+===+===+===+===+===+===+===+===+===+===+===+===+===+===+===+===+",
      "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ",
      "---------------------------------------------------------------------",
      "~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~="
    ];

    const rightEndings = ["~~::,XX", "~XO", "XO", "XX", "XX", "XO", "XX", "OX", "XX", "XO", "XX", "OX"];
    const leftEndings = ["\\XX", "\\%XO", "~XO", "\\XX", "\\XX", "XO", "XX", "OX", "XX", "XO", "XX", "OX"];

    // Draw Envelope lines completely across (NO black box cutout!)
    for (let r = y0; r <= y1; r++) {
      const isTop = (r === y0);
      const isBottom = (r === y1);
      const pattern = lineStyles[(r - y0) % lineStyles.length];

      for (let c = x0; c <= x1; c++) {
        const isLeft = (c === x0);
        const isRight = (c === x1);

        if (isTop || isBottom) {
          const ch = (c === x0 || c === x1) ? '+' : '=';
          grid[r][c] = { char: ch, color: '#f1f5f9', glow: 5, alpha: 0.98 };
        } else if (isLeft) {
          const endStr = leftEndings[(r - y0) % leftEndings.length];
          grid[r][c] = { char: endStr[0] || '|', color: '#e2e8f0', glow: 4, alpha: 0.95 };
        } else if (isRight) {
          const endStr = rightEndings[(r - y0) % rightEndings.length];
          grid[r][c] = { char: endStr[endStr.length - 1] || '|', color: '#e2e8f0', glow: 4, alpha: 0.95 };
        } else {
          // Inside envelope scanline
          const pIdx = (c - x0) % pattern.length;
          const ch = pattern[pIdx];
          if (ch !== ' ') {
            const innerAlpha = flapProgress > 0.4 ? 0.14 : 0.42;
            grid[r][c] = { char: ch, color: '#cbd5e1', glow: 0, alpha: innerAlpha };
          }
        }
      }
    }

    // Top Flap Fold Lines
    const steps = Math.max(Math.abs(cx - x0), Math.abs(apexY - y0));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Left fold
      const lx = Math.round(x0 + (cx - x0) * t);
      const ly = Math.round(y0 + (apexY - y0) * t);
      if (ly >= 0 && ly < rows && lx >= 0 && lx < cols) {
        const ch = flapProgress > 0.4 ? (apexY < y0 ? '/' : '\\') : '\\';
        grid[ly][lx] = { char: ch, color: flapProgress > 0.5 ? '#ff4d6d' : '#e2e8f0', glow: 6, alpha: 0.95 };

        if (flapProgress > 0.5 && i % 5 === 3) {
          grid[ly][lx] = { char: '♥', color: '#ff2a6d', glow: 8, alpha: 0.95 };
        }
      }

      // Right fold
      const rx = Math.round(x1 + (cx - x1) * t);
      const ry = Math.round(y0 + (apexY - y0) * t);
      if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
        const ch = flapProgress > 0.4 ? (apexY < y0 ? '\\' : '/') : '/';
        grid[ry][rx] = { char: ch, color: flapProgress > 0.5 ? '#ff4d6d' : '#e2e8f0', glow: 6, alpha: 0.95 };

        if (flapProgress > 0.5 && i % 5 === 3) {
          grid[ry][rx] = { char: '♥', color: '#ff2a6d', glow: 8, alpha: 0.95 };
        }
      }
    }

    // "for you" Label on the envelope (crisp glowing pink)
    const tag = "˗ ˏ ˋ   f o r   y o u   ˎ ˊ ˗";
    const tagX = cx - Math.floor(tag.length / 2);
    const tagY = 64;
    for (let i = 0; i < tag.length; i++) {
      const tx = tagX + i;
      if (tx >= 0 && tx < cols && tag[i] !== ' ') {
        grid[tagY][tx] = { char: tag[i], color: '#ffb3c6', glow: 10, alpha: 1.0 };
      }
    }

    // =========================================================================
    // 2. CLOSED STATE: DELICATE, AUTHENTIC WAX SEAL HEART
    // (NO BLACK BOX BACKGROUND! Envelope texture touches the heart boundary directly)
    // =========================================================================
    if (flapProgress < 0.35) {
      const heartAlpha = Math.max(0, 1.0 - flapProgress / 0.35);
      const hH = sealHeartArt.length;
      const hW = sealHeartArt[0].length;
      const startY = Math.round(yc - hH / 2);
      const startX = Math.round(cx - hW / 2);

      for (let r = 0; r < hH; r++) {
        for (let c = 0; c < hW; c++) {
          const ch = sealHeartArt[r][c];
          if (ch !== ' ') {
            const rx = startX + c;
            const ry = startY + r;
            if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
              let col = '#ff1744';
              let glow = 15;

              if (ch === '+') {
                col = '#ff7597'; // Cute pink top tips
                glow = 12;
              } else if (ch === '@') {
                col = '#d00036'; // Deep velvet ruby
                glow = 16;
              } else if (ch === '%') {
                col = '#ff0055'; // Radiant crimson
                glow = 18;
              } else if (ch === '*') {
                col = '#ff2a6d'; // Sparkly edges
                glow = 14;
              } else if (ch === '0') {
                col = '#ff1744'; // Glowing heart face
                glow = 16;
              }

              // Ethereal White Light Pulse on Heart (poslash kabi oq nur to'lqini)
              const heartWaveCoord = rx * 0.85 + ry * 0.65;
              const heartWave = posMod(heartWaveCoord - animTime * 14, 24);
              const isCenterPulse = Math.abs(heartWave - 12) < 1.6;
              const isNearPulse = Math.abs(heartWave - 12) < 2.8;

              if (isCenterPulse) {
                col = '#ffffff';
                glow = 24; // Pure radiant white shimmer
              } else if (isNearPulse) {
                col = '#ffe4e6'; // Soft pearlescent halo
                glow = 20;
              }

              // Overwrite ONLY the exact non-space character cell!
              // Outside cells retain their envelope pattern seamlessly: NO BLACK BOX!
              grid[ry][rx] = {
                char: ch,
                color: col,
                glow: glow,
                alpha: heartAlpha
              };
            }
          }
        }
      }
    }

    // =========================================================================
    // 3. BLOOMING STATE: MAGNIFICENT ROSE, CALYX, STEM & PROPER LEAVES
    // =========================================================================
    if (bloomProgress > 0) {
      const p = bloomProgress;
      const easeGrowth = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

      // Rose base ascends smoothly
      const startBaseY = 46;
      const targetBaseY = 25;
      flowerBaseY = Math.round(startBaseY + (targetBaseY - startBaseY) * easeGrowth);
      swayOffset = Math.sin(animTime * 2.2) * 0.8;

      // Stem coordinate formula
      const stemXAt = (y) => Math.round(cx + Math.sin((y - 25) * 0.14) * 4.2 - 1.2 + swayOffset * ((y - 25) / 25));

      // Dynamic Model Selection based on growth progress:
      // Stage 0: Slender tight Bud (p < 0.36)
      // Stage 1: Half-opened Rose (0.36 <= p < 0.72)
      // Stage 2: Master Full Bloom (p >= 0.72)
      let curModel = masterRoseLines;
      let curCalyx = calyxLines;

      if (p < 0.36) {
        curModel = roseBudLines;
        curCalyx = budCalyxLines;
      } else if (p < 0.72) {
        curModel = roseOpeningLines;
        curCalyx = halfCalyxLines;
      }

      // Draw Calyx Sepals (green leaflets hugging/cupping flower base)
      const calyxH = curCalyx.length;
      const calyxW = curCalyx[0].length;
      const calyxY = flowerBaseY - 2;
      const calyxStartX = cx - Math.floor(calyxW / 2) + Math.round(swayOffset);

      for (let r = 0; r < calyxH; r++) {
        const line = curCalyx[r];
        const ly = calyxY + r;
        for (let c = 0; c < line.length; c++) {
          const ch = line[c];
          if (ch && ch !== ' ') {
            const lx = calyxStartX + c;
            if (ly >= 0 && ly < rows && lx >= 0 && lx < cols) {
              const col = (r <= 1) ? '#39ff14' : '#00ff88';
              grid[ly][lx] = { char: ch, color: col, glow: 11, alpha: 0.98 };
            }
          }
        }
      }

      // Draw Stem (with highlights, shadows, and golden thorns)
      for (let y = flowerBaseY + 3; y <= 56; y++) {
        const sx = stemXAt(y);
        if (y >= 0 && y < rows) {
          // Left highlight (sunlit lime)
          if (sx - 1 >= 0 && sx - 1 < cols) {
            grid[y][sx - 1] = { char: '|', color: '#76ff03', glow: 9, alpha: 0.95 };
          }
          // Center core (emerald)
          if (sx >= 0 && sx < cols) {
            grid[y][sx] = { char: '#', color: '#00ff88', glow: 10, alpha: 0.98 };
          }
          // Right shadow (deep botanical green)
          if (sx + 1 < cols) {
            grid[y][sx + 1] = { char: '%', color: '#059669', glow: 8, alpha: 0.92 };
          }

          // Golden Thorns protruding naturally
          if (y === flowerBaseY + 10 && sx - 2 >= 0) {
            grid[y][sx - 2] = { char: '<', color: '#ffd166', glow: 10, alpha: 0.98 };
          }
          if (y === flowerBaseY + 18 && sx + 2 < cols) {
            grid[y][sx + 2] = { char: '>', color: '#ffd166', glow: 10, alpha: 0.98 };
          }
        }
      }

      // =======================================================================
      // PROPER LEAF PLACEMENT WITH CONNECTING STALKS (PETIOLES)
      // =======================================================================
      if (bloomProgress > 0.22) {
        const leafP = Math.min(1.0, (bloomProgress - 0.22) / 0.78);

        // --- LEFT LEAF & STALK ---
        const leftAttachY = flowerBaseY + 8;
        const leftAttachX = stemXAt(leftAttachY);

        // Connecting stalk from stem outwards to left leaf
        const leftStalkPoints = [
          { x: leftAttachX - 1, y: leftAttachY, ch: '\\' },
          { x: leftAttachX - 3, y: leftAttachY, ch: '_' },
          { x: leftAttachX - 5, y: leftAttachY - 1, ch: '\\' },
          { x: leftAttachX - 7, y: leftAttachY - 1, ch: '\\' },
          { x: leftAttachX - 9, y: leftAttachY - 2, ch: '_' }
        ];

        for (const pt of leftStalkPoints) {
          if (pt.y >= 0 && pt.y < rows && pt.x >= 0 && pt.x < cols) {
            grid[pt.y][pt.x] = { char: pt.ch, color: '#39ff14', glow: 9, alpha: 0.95 };
          }
        }

        // Draw Left Leaf Blade
        const leftBladeOriginX = leftAttachX - 25;
        const leftBladeOriginY = leftAttachY - 6;
        const lRows = Math.floor(leftLeafArt.length * leafP);

        for (let r = 0; r < lRows; r++) {
          const line = leftLeafArt[r];
          const ly = leftBladeOriginY + r;
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch && ch !== ' ') {
              const lx = leftBladeOriginX + c;
              if (ly >= 0 && ly < rows && lx >= 0 && lx < cols) {
                let col = '#10b981';
                let glow = 8;
                if (ch === '/' || ch === '\\') {
                  col = '#76ff03'; // Veins
                  glow = 10;
                } else if (ch === 'X' || ch === '$' || ch === '%') {
                  col = '#00ff88'; // Body
                  glow = 9;
                } else {
                  col = '#059669'; // Edge
                  glow = 7;
                }
                grid[ly][lx] = { char: ch, color: col, glow: glow, alpha: 0.98 };
              }
            }
          }
        }

        // --- RIGHT LEAF & STALK ---
        const rightAttachY = flowerBaseY + 15;
        const rightAttachX = stemXAt(rightAttachY);

        // Connecting stalk from stem outwards to right leaf
        const rightStalkPoints = [
          { x: rightAttachX + 1, y: rightAttachY, ch: '/' },
          { x: rightAttachX + 3, y: rightAttachY, ch: '_' },
          { x: rightAttachX + 5, y: rightAttachY - 1, ch: '/' },
          { x: rightAttachX + 7, y: rightAttachY - 1, ch: '/' },
          { x: rightAttachX + 9, y: rightAttachY - 2, ch: '_' }
        ];

        for (const pt of rightStalkPoints) {
          if (pt.y >= 0 && pt.y < rows && pt.x >= 0 && pt.x < cols) {
            grid[pt.y][pt.x] = { char: pt.ch, color: '#39ff14', glow: 9, alpha: 0.95 };
          }
        }

        // Draw Right Leaf Blade
        const rightBladeOriginX = rightAttachX + 10;
        const rightBladeOriginY = rightAttachY - 6;
        const rRows = Math.floor(rightLeafArt.length * leafP);

        for (let r = 0; r < rRows; r++) {
          const line = rightLeafArt[r];
          const ry = rightBladeOriginY + r;
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch && ch !== ' ') {
              const rx = rightBladeOriginX + c;
              if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
                let col = '#10b981';
                let glow = 8;
                if (ch === '/' || ch === '\\') {
                  col = '#76ff03'; // Veins
                  glow = 10;
                } else if (ch === 'X' || ch === '$' || ch === '%') {
                  col = '#00ff88'; // Body
                  glow = 9;
                } else {
                  col = '#059669'; // Edge
                  glow = 7;
                }
                grid[ry][rx] = { char: ch, color: col, glow: glow, alpha: 0.98 };
              }
            }
          }
        }
      }

      // =======================================================================
      // 3D VOLUMETRIC LIGHTING & MOTION PARALLAX SHADER
      // Realistic diffuse, specular highlights, and ambient occlusion
      // =======================================================================
      const breathGlow = 1.0 + 0.16 * Math.sin(animTime * 2.8);

      const mapH = curModel.length;
      const mapW = curModel[0].length;
      const startY = flowerBaseY - mapH - 1;
      const startX = Math.round(cx - mapW / 2);

      // Key light vector from top-left toward viewer
      const lx = -0.55;
      const ly = -0.65;
      const lz = 0.52;

      for (let r = 0; r < mapH; r++) {
        for (let c = 0; c < mapW; c++) {
          const ch = curModel[r][c];
          if (!ch || ch === ' ') continue;

          // 3D Motion Parallax: Front petals shift with depth perspective
          const dx = (c - mapW / 2) / (mapW / 2);
          const dy = (r - mapH / 2) / (mapH / 2);
          const radSq = dx * dx + dy * dy;
          const zDepth = Math.sqrt(Math.max(0.06, 1.0 - radSq * 0.72));
          const parallaxShift = Math.round(swayOffset * (0.65 + 0.7 * zDepth));

          const rx = startX + c + parallaxShift;
          const ry = startY + r;

          if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
            // 3D Curved Surface Normal & Spiral Petal Ridge computation
            const angle = Math.atan2(dy, dx);
            const dist = Math.sqrt(radSq);
            const petalWave = Math.sin(dist * 7.5 - angle * 2.5);

            let nx = dx * 0.7 + Math.cos(angle) * petalWave * 0.35;
            let ny = dy * 0.7 + Math.sin(angle) * petalWave * 0.35;
            let nz = Math.max(0.12, zDepth + petalWave * 0.25);
            const norm = Math.hypot(nx, ny, nz);
            nx /= norm;
            ny /= norm;
            nz /= norm;

            // Diffuse Lambertian & Specular Blinn-Phong
            const diffuse = Math.max(0.0, nx * lx + ny * ly + nz * lz);
            const halfLen = Math.hypot(lx, ly, lz + 1.0);
            const specular = Math.pow(Math.max(0.0, (nx * lx + ny * ly + nz * (lz + 1.0)) / halfLen), 14);

            // Ambient Occlusion in deep creases and cavity
            let ao = 0.45 + 0.55 * Math.pow(Math.sin(dist * 7.5 - angle * 2.5 + 1.57), 2);
            if (ch === '@' || ch === '#' || ch === '8' || ch === 'B') {
              ao *= 0.62;
            }

            const intensity = (0.28 + 0.68 * diffuse * ao + 0.5 * specular) * breathGlow;

            let col = '#ff1744';
            let glow = Math.round(14 * intensity + 4);

            if (ch === '°') {
              // 3D Crystalline Dewdrop with diamond glint
              col = '#e0f7fa';
              glow = 22;
            } else if (ch === '@' || ch === '#' || ch === '8' || ch === 'B') {
              // Deep Velvet Wine Core with ambient occlusion cavity
              const red = Math.min(255, Math.round(180 * intensity));
              const grn = Math.min(255, Math.round(8 * intensity));
              const blu = Math.min(255, Math.round(45 * intensity));
              col = `rgb(${red},${grn},${blu})`;
            } else if (ch === '%' || ch === '&' || ch === '$') {
              // Radiant Crimson Petal Folds
              const red = Math.min(255, Math.round(255 * intensity));
              const grn = Math.min(255, Math.round(16 * intensity));
              const blu = Math.min(255, Math.round(82 * intensity));
              col = `rgb(${red},${grn},${blu})`;
            } else if (ch === '§' || ch === 'S') {
              // Vivid Ruby Mid-tones
              const red = Math.min(255, Math.round(255 * intensity));
              const grn = Math.min(255, Math.round(28 * intensity));
              const blu = Math.min(255, Math.round(68 * intensity));
              col = `rgb(${red},${grn},${blu})`;
            } else if (ch === '0' || ch === 'O' || ch === 'o') {
              // Glowing Magenta-Red Petal Faces
              const red = Math.min(255, Math.round(255 * intensity));
              const grn = Math.min(255, Math.round(14 * intensity));
              const blu = Math.min(255, Math.round(130 * intensity));
              col = `rgb(${red},${grn},${blu})`;
            } else if (ch === '*' || ch === '+') {
              // Specular Petal Crest Highlights
              const red = Math.min(255, Math.round(255 * (intensity * 0.8 + 0.3)));
              const grn = Math.min(255, Math.round(95 * intensity));
              const blu = Math.min(255, Math.round(138 * intensity));
              col = `rgb(${red},${grn},${blu})`;
              glow = Math.round(16 * intensity + 5);
            } else {
              // Petal Rims & Curling Lips catching rim lighting
              const rim = Math.max(0.0, -ny) * 0.5 + 0.5;
              const red = Math.min(255, Math.round(255 * (0.8 + 0.2 * rim)));
              const grn = Math.min(255, Math.round(175 * rim));
              const blu = Math.min(255, Math.round(195 * rim));
              col = `rgb(${red},${grn},${blu})`;
              glow = Math.round(13 * intensity + 3);
            }

            // Ethereal White Light Wave on Rose Blossom
            const flowerWaveCoord = rx * 0.75 + ry * 0.65;
            const flowerPeriod = 42;
            const flowerWave = posMod(flowerWaveCoord - animTime * 16, flowerPeriod);
            const distFromCrest = Math.abs(flowerWave - flowerPeriod / 2);

            if (distFromCrest < 1.8 && ch !== '°') {
              col = '#ffffff';
              glow = 26; // Brilliant pure diamond white shimmer
            } else if (distFromCrest < 3.6 && ch !== '°') {
              col = '#ffe4e6'; // Pearlescent soft blush halo
              glow = 22;
            } else if (distFromCrest < 5.2 && ch !== '°') {
              col = '#ff8fa3'; // Luminous coral highlight
              glow = 18;
            }

            grid[ry][rx] = { char: ch, color: col, glow: glow, alpha: 1.0 };
          }
        }
      }

      // =======================================================================
      // RADIATING CELESTIAL SPARKLE CROSSES (Drawn ONLY when fully open!)
      // =======================================================================
      if (bloomProgress > 0.82) {
        const flowerCenterY = flowerBaseY - 12;
        const crAlpha = Math.min(1.0, (bloomProgress - 0.82) / 0.18);
        const crosses = [
          { x: cx - 34, y: flowerCenterY - 10, phase: 0, col: '#00f0ff' }, // Cyan
          { x: cx + 34, y: flowerCenterY - 8, phase: 1.5, col: '#ffd700' }, // Gold
          { x: cx + 36, y: flowerCenterY + 12, phase: 3.0, col: '#00f0ff' }, // Cyan
          { x: cx - 36, y: flowerCenterY + 14, phase: 4.5, col: '#ffd700' }  // Gold
        ];

        for (const cr of crosses) {
          const pulse = 0.5 + 0.5 * Math.sin(animTime * 3.5 + cr.phase);
          const a = crAlpha * (0.4 + 0.6 * pulse);

          if (cr.y >= 0 && cr.y < rows && cr.x >= 0 && cr.x < cols) {
            if (grid[cr.y][cr.x].char === ' ') {
              grid[cr.y][cr.x] = { char: '+', color: '#ffffff', glow: 16, alpha: a };
            }
          }

          // Horizontal ray arms (NEVER overwrite flower or leaf cells!)
          for (let dx = -7; dx <= 7; dx++) {
            if (dx === 0) continue;
            const rx = cr.x + dx;
            if (rx >= 0 && rx < cols && cr.y >= 0 && cr.y < rows) {
              if (grid[cr.y][rx].char === ' ') {
                const rayCh = Math.abs(dx) === 7 ? '·' : '-';
                grid[cr.y][rx] = { char: rayCh, color: cr.col, glow: 8, alpha: a * 0.8 };
              }
            }
          }

          // Vertical ray arms (NEVER overwrite flower or leaf cells!)
          for (let dy = -6; dy <= 6; dy++) {
            if (dy === 0) continue;
            const ry = cr.y + dy;
            if (ry >= 0 && ry < rows && cr.x >= 0 && cr.x < cols) {
              if (grid[ry][cr.x].char === ' ') {
                const rayCh = Math.abs(dy) === 6 ? '·' : '|';
                grid[ry][cr.x] = { char: rayCh, color: cr.col, glow: 8, alpha: a * 0.8 };
              }
            }
          }
        }
      }
    }

    // =========================================================================
    // 4. FLOATING PARTICLES & HEARTS
    // =========================================================================
    for (const h of floatingHearts) {
      const rx = Math.round(h.x);
      const ry = Math.round(h.y);
      if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
        if (grid[ry][rx].char === ' ') {
          grid[ry][rx] = { char: h.char, color: h.color, glow: 12, alpha: h.alpha };
        }
      }
    }

    for (const sp of sparkleParticles) {
      const rx = Math.round(sp.x);
      const ry = Math.round(sp.y);
      if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
        if (grid[ry][rx].char === ' ') {
          grid[ry][rx] = { char: sp.char, color: sp.color, glow: 14, alpha: sp.life };
        }
      }
    }

    // =========================================================================
    // 5. DRAW MATRIX TO CANVAS WITH 3D VOLUMETRIC AURA & PRECISION BLOOM
    // =========================================================================

    // 3D Volumetric Velvet Ambient Under-Glow behind the flower
    if (bloomProgress > 0.05) {
      const flowerCenterY = flowerBaseY - 12;
      const fX = (cx + swayOffset * 0.5) * cellW + cellW / 2;
      const fY = flowerCenterY * cellH + cellH / 2;
      const glowRad = Math.min(cols * cellW, rows * cellH) * 0.22;
      const glowGrad = ctx.createRadialGradient(fX, fY, 6, fX, fY, glowRad);
      glowGrad.addColorStop(0, 'rgba(255, 23, 68, 0.22)');
      glowGrad.addColorStop(0.45, 'rgba(194, 0, 47, 0.09)');
      glowGrad.addColorStop(0.8, 'rgba(89, 0, 22, 0.03)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(fX, fY, glowRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.font = `600 ${fontSize}px 'Fira Code', Consolas, monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (!cell || !cell.char || cell.char === ' ' || cell.alpha <= 0.01) continue;

        const posX = c * cellW + cellW / 2;
        const posY = r * cellH + cellH / 2;

        ctx.save();
        ctx.globalAlpha = Math.min(1.0, Math.max(0, cell.alpha));

        if (cell.glow > 0) {
          ctx.shadowColor = cell.color;
          ctx.shadowBlur = cell.glow;
        }

        ctx.fillStyle = cell.color;
        ctx.fillText(cell.char, posX, posY);
        ctx.restore();
      }
    }
  }

  requestAnimationFrame(animate);
});
