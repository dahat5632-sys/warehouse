/* BIO: Pro Mode integration note. */

const W = 640;
const H = 360;
const PADDLE_W = 11;
const PADDLE_H = 76;
const BALL_R = 7;
const WIN_SCORE = 3;
const BASE_SPEED = 290;
const PLAYER_SPEED = 460;
/* BIO: Implementation note for this section. */
const BALL_SPEED_RAMP = 0.055;
const BALL_MATCH_TIME_COEFF = 0.012;
const BALL_RAMP_RATE_MAX = 0.2;
const BALL_V_MAX_X = 620;
const BALL_V_MAX_Y = 460;
/* BIO: Implementation note for this section. */
/* BIO: Implementation note for this section. */
const PONG_CLOSE_ANIM_MS = 420;

/* BIO: Cockpit layout, rendering, and interaction note. */
function pongPlaySfx(apiProp) {
  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api[apiProp] === 'function') api[apiProp]();
  } catch (_) {}
}

let _pongCloseTimer = null;

let overlay;
let canvas;
let ctx;
let closeBtn;
let hudYou;
let hudAi;
let hudMsg;
let readyEl;
let gameHintEl;
let startBtn;
let rafId = null;
/* BIO: @type {'idle' | 'ready' | 'playing' | 'ended' | 'mirror-prep'} */
let phase = 'idle';
/* BIO: Implementation note for this section. */
let matchMode = 'alien';

let ball = { x: W * 0.5, y: H * 0.5, vx: BASE_SPEED, vy: 60 };
let leftY = H * 0.5 - PADDLE_H * 0.5;
let rightY = H * 0.5 - PADDLE_H * 0.5;
let scoreYou = 0;
let scoreAi = 0;
let lastT = 0;
/* BIO: Implementation note for this section. */
let pongMatchElapsed = 0;

/* BIO: Implementation note for this section. */
const keys = { up: false, down: false };
/* BIO: Implementation note for this section. */
const keysMirLeft = { up: false, down: false };
const keysMirRight = { up: false, down: false };

/* BIO: Language control and localization note. */
let pongCopy = {
  pongWin:
    'Congratulations — you win! Press Play again to restart.',
  pongLose: 'Alien wins. Press Play again to restart.',
  pongGateHint: 'Beat the alien — unlock the final duel.',
  pongMirrorIntro: 'The hardest duel is against yourself.',
  pongMirrorPrepBody:
    'You face yourself: move the left paddle with W and S, the right paddle with the Up and Down arrows. First to 3 points wins.',
  pongMirrorPrepReadyQ: 'Ready?',
  pongMirrorReadyBtn: "I'm ready",
  pongMirrorTitle: 'Final duel — Yourself',
  pongMirrorGameHint: 'Left: W / S · Right: ↑ / ↓ · First to 3 points wins · ESC to close',
  pongMirrorLabelLeft: 'Left',
  pongMirrorLabelRight: 'Right',
  pongMirrorWinLeft:
    'Left wins! Press Play again for another duel with yourself.',
  pongMirrorWinRight:
    'Right wins! Press Play again for another duel with yourself.',
  pongTitleAlien: 'Pong vs Alien',
  pongYouLbl: 'You',
  pongAlienLbl: 'Alien',
  pongGameHintAlien:
    'W / S · ↑ / ↓ · First to 3 points wins · ESC to close'
};

let elTitle;
let elReadyQ;
let elGateHint;
let elReadyControls;
let elLabelYou;
let elLabelAlien;
let playAgainBtn;
let mirrorPrepRoot;
let mirrorPrepTitle;
let mirrorPrepBody;
let mirrorPrepQ;
let mirrorPrepBtn;
let scoresWrap;
let stageWrap;

function applyPongStrings(d) {
  if (!d) return;
  const pick = (k, fallback) =>
    d[k] != null && String(d[k]).length ? String(d[k]) : fallback;

  if (d.pongWin != null) pongCopy.pongWin = String(d.pongWin);
  if (d.pongLose != null) pongCopy.pongLose = String(d.pongLose);
  if (d.pongGateHint != null) pongCopy.pongGateHint = String(d.pongGateHint);
  if (d.pongMirrorIntro != null) pongCopy.pongMirrorIntro = String(d.pongMirrorIntro);
  if (d.pongMirrorPrepBody != null) pongCopy.pongMirrorPrepBody = String(d.pongMirrorPrepBody);
  if (d.pongMirrorPrepReadyQ != null) pongCopy.pongMirrorPrepReadyQ = String(d.pongMirrorPrepReadyQ);
  if (d.pongMirrorReadyBtn != null) pongCopy.pongMirrorReadyBtn = String(d.pongMirrorReadyBtn);
  if (d.pongMirrorTitle != null) pongCopy.pongMirrorTitle = String(d.pongMirrorTitle);
  if (d.pongMirrorGameHint != null) pongCopy.pongMirrorGameHint = String(d.pongMirrorGameHint);
  if (d.pongMirrorLabelLeft != null) pongCopy.pongMirrorLabelLeft = String(d.pongMirrorLabelLeft);
  if (d.pongMirrorLabelRight != null) pongCopy.pongMirrorLabelRight = String(d.pongMirrorLabelRight);
  if (d.pongMirrorWinLeft != null) pongCopy.pongMirrorWinLeft = String(d.pongMirrorWinLeft);
  if (d.pongMirrorWinRight != null) pongCopy.pongMirrorWinRight = String(d.pongMirrorWinRight);

  if (d.pongTitle != null) {
    const v = pick('pongTitle', elTitle ? elTitle.textContent : pongCopy.pongTitleAlien);
    pongCopy.pongTitleAlien = v;
    if (elTitle) elTitle.textContent = v;
  }
  if (elReadyQ && d.pongReadyQ != null) elReadyQ.textContent = pick('pongReadyQ', elReadyQ.textContent);
  if (elReadyControls && d.pongReadyControls != null) {
    elReadyControls.textContent = pick('pongReadyControls', elReadyControls.textContent);
  }
  if (startBtn && d.pongStart != null) startBtn.textContent = pick('pongStart', startBtn.textContent);
  if (d.pongGameHint != null) {
    const gh = pick('pongGameHint', gameHintEl ? gameHintEl.textContent : pongCopy.pongGameHintAlien);
    pongCopy.pongGameHintAlien = gh;
    if (gameHintEl) gameHintEl.textContent = gh;
  }
  if (d.pongYou != null) {
    const v = pick('pongYou', elLabelYou ? elLabelYou.textContent : pongCopy.pongYouLbl);
    pongCopy.pongYouLbl = v;
    if (elLabelYou) elLabelYou.textContent = v;
  }
  if (d.pongAlien != null) {
    const v = pick('pongAlien', elLabelAlien ? elLabelAlien.textContent : pongCopy.pongAlienLbl);
    pongCopy.pongAlienLbl = v;
    if (elLabelAlien) elLabelAlien.textContent = v;
  }
  if (playAgainBtn && d.pongPlayAgain != null) {
    playAgainBtn.textContent = pick('pongPlayAgain', playAgainBtn.textContent);
  }
  if (closeBtn && d.pongCloseAria != null) {
    closeBtn.setAttribute('aria-label', pick('pongCloseAria', closeBtn.getAttribute('aria-label') || ''));
  }
  syncGateHintVisibility();
  syncMirrorPrepTexts();
}

function syncMirrorPrepTexts() {
  if (mirrorPrepTitle) mirrorPrepTitle.textContent = pongCopy.pongMirrorIntro || '';
  if (mirrorPrepBody) mirrorPrepBody.textContent = pongCopy.pongMirrorPrepBody || '';
  if (mirrorPrepQ) mirrorPrepQ.textContent = pongCopy.pongMirrorPrepReadyQ || '';
  if (mirrorPrepBtn) mirrorPrepBtn.textContent = pongCopy.pongMirrorReadyBtn || '';
}

function syncGateHintVisibility() {
  if (!elGateHint) return;
  const show = phase === 'ready' && matchMode === 'alien';
  elGateHint.hidden = !show;
  if (show) elGateHint.textContent = pongCopy.pongGateHint || '';
}

function applyAlienHudCopy() {
  if (elTitle) elTitle.textContent = pongCopy.pongTitleAlien;
  if (elLabelYou) elLabelYou.textContent = pongCopy.pongYouLbl;
  if (elLabelAlien) elLabelAlien.textContent = pongCopy.pongAlienLbl;
}

function applyMirrorHudCopy() {
  if (elTitle) elTitle.textContent = pongCopy.pongMirrorTitle || elTitle.textContent;
  if (elLabelYou) elLabelYou.textContent = pongCopy.pongMirrorLabelLeft || elLabelYou.textContent;
  if (elLabelAlien) elLabelAlien.textContent = pongCopy.pongMirrorLabelRight || elLabelAlien.textContent;
}

function hookPongI18n() {
  window.addEventListener('bgs-pro-ui-strings', e => applyPongStrings(e.detail));
  /* BIO: Pro Mode integration note. */
  try {
    window.dispatchEvent(new Event('bgs-pro-apply-lang'));
  } catch (_) {}
}

function aiSpeedForScore() {
  return 210 + Math.min(130, (scoreYou + scoreAi) * 14);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function resetBall(serveRight) {
  ball.x = W * 0.5;
  ball.y = H * 0.45 + (Math.random() - 0.45) * (H * 0.12);
  const dir = serveRight ? 1 : -1;
  const sp = BASE_SPEED * (0.92 + Math.random() * 0.14);
  ball.vx = dir * sp;
  ball.vy = (Math.random() - 0.5) * 240;
}

function drawField() {
  ctx.fillStyle = '#04080f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 14]);
  ctx.beginPath();
  ctx.moveTo(W * 0.5, 4);
  ctx.lineTo(W * 0.5, H - 4);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(0, 200, 230, 0.5)';
  ctx.strokeRect(PADDLE_W * 0.5, PADDLE_W * 0.5, W - PADDLE_W, H - PADDLE_W);
}

function drawPaddle(x, y, rgb) {
  ctx.fillStyle = rgb;
  ctx.shadowColor = rgb;
  ctx.shadowBlur = 12;
  ctx.fillRect(x, y, PADDLE_W, PADDLE_H);
  ctx.shadowBlur = 0;
}

function syncHud() {
  if (hudYou) hudYou.textContent = String(scoreYou);
  if (hudAi) hudAi.textContent = String(scoreAi);
}

/* BIO: Implementation note for this section. */
function drawIdleField() {
  if (!ctx) return;
  const lx = PADDLE_W + 2;
  const rx = W - PADDLE_W - 2;
  const ly = H * 0.5 - PADDLE_H * 0.5;
  const ry = H * 0.5 - PADDLE_H * 0.5;
  drawField();
  /* BIO: Implementation note for this section. */
  drawPaddle(lx - PADDLE_W, ly, 'rgba(90, 200, 255, 0.55)');
  drawPaddle(rx, ry, 'rgba(100, 255, 160, 0.55)');
}

function tick(now) {
  if (phase !== 'playing' || !ctx) return;
  const dt = Math.min(0.045, lastT ? (now - lastT) / 1000 : 1 / 60);
  lastT = now;
  pongMatchElapsed += dt;

  if (matchMode === 'mirror') {
    let ml = 0;
    if (keysMirLeft.up) ml -= 1;
    if (keysMirLeft.down) ml += 1;
    leftY += ml * PLAYER_SPEED * dt;
    leftY = clamp(leftY, 4, H - PADDLE_H - 4);

    let mr = 0;
    if (keysMirRight.up) mr -= 1;
    if (keysMirRight.down) mr += 1;
    rightY += mr * PLAYER_SPEED * dt;
    rightY = clamp(rightY, 4, H - PADDLE_H - 4);
  } else {
    let move = 0;
    if (keys.up) move -= 1;
    if (keys.down) move += 1;
    leftY += move * PLAYER_SPEED * dt;
    leftY = clamp(leftY, 4, H - PADDLE_H - 4);

    let aim = ball.x > W * 0.45 ? ball.y - PADDLE_H * 0.5 : H * 0.5 - PADDLE_H * 0.5;
    aim += Math.sin(now * 0.0022) * 6;
    const step = aiSpeedForScore() * dt;
    rightY += clamp(aim - rightY, -step, step);
    rightY = clamp(rightY, 4, H - PADDLE_H - 4);
  }

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.y < BALL_R + 2) {
    ball.y = BALL_R + 2;
    ball.vy *= -1;
    pongPlaySfx('playPongBallHitsWallSfx');
  } else if (ball.y > H - BALL_R - 2) {
    ball.y = H - BALL_R - 2;
    ball.vy *= -1;
    pongPlaySfx('playPongBallHitsWallSfx');
  }

  const lx = PADDLE_W + 2;
  if (
    ball.vx < 0 &&
    ball.x - BALL_R <= lx &&
    ball.x > PADDLE_W &&
    ball.y >= leftY &&
    ball.y <= leftY + PADDLE_H
  ) {
    ball.x = lx + BALL_R;
    ball.vx *= -1.04;
    const off = (ball.y - (leftY + PADDLE_H * 0.5)) / (PADDLE_H * 0.5);
    ball.vy += off * 180;
    ball.vx = clamp(ball.vx, -BALL_V_MAX_X, BALL_V_MAX_X);
    ball.vy = clamp(ball.vy, -BALL_V_MAX_Y, BALL_V_MAX_Y);
    pongPlaySfx('playPongBallHitsUserSfx');
  }

  const rx = W - PADDLE_W - 2;
  if (
    ball.vx > 0 &&
    ball.x + BALL_R >= rx &&
    ball.x < W - PADDLE_W &&
    ball.y >= rightY &&
    ball.y <= rightY + PADDLE_H
  ) {
    ball.x = rx - BALL_R;
    ball.vx *= -1.04;
    const off = (ball.y - (rightY + PADDLE_H * 0.5)) / (PADDLE_H * 0.5);
    ball.vy += off * 180;
    ball.vx = clamp(ball.vx, -BALL_V_MAX_X, BALL_V_MAX_X);
    ball.vy = clamp(ball.vy, -BALL_V_MAX_Y, BALL_V_MAX_Y);
    pongPlaySfx('playPongBallHitsUserSfx');
  }

  const rampRate = Math.min(
    BALL_RAMP_RATE_MAX,
    BALL_SPEED_RAMP + BALL_MATCH_TIME_COEFF * pongMatchElapsed
  );
  ball.vx *= 1 + rampRate * dt;
  ball.vy *= 1 + rampRate * dt;
  ball.vx = clamp(ball.vx, -BALL_V_MAX_X, BALL_V_MAX_X);
  ball.vy = clamp(ball.vy, -BALL_V_MAX_Y, BALL_V_MAX_Y);

  if (ball.x < -20) {
    scoreAi += 1;
    pongPlaySfx('playPongGamewinloseSfx');
    syncHud();
    if (scoreAi >= WIN_SCORE) {
      endGame(false);
      return;
    }
    resetBall(false);
  } else if (ball.x > W + 20) {
    scoreYou += 1;
    pongPlaySfx('playPongGamewinloseSfx');
    syncHud();
    if (scoreYou >= WIN_SCORE) {
      if (matchMode === 'alien') {
        showMirrorPrepScreen();
      } else {
        endGame(true);
      }
      return;
    }
    resetBall(true);
  }

  drawField();
  if (matchMode === 'mirror') {
    drawPaddle(lx - PADDLE_W, leftY, 'rgba(90, 200, 255, 0.95)');
    drawPaddle(rx, rightY, 'rgba(140, 220, 255, 0.95)');
  } else {
    drawPaddle(lx - PADDLE_W, leftY, 'rgba(90, 200, 255, 0.95)');
    drawPaddle(rx, rightY, 'rgba(100, 255, 160, 0.95)');
  }
  ctx.fillStyle = '#e8ffff';
  ctx.shadowColor = 'rgba(0, 245, 255, 0.7)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  rafId = requestAnimationFrame(tick);
}

/* BIO: Implementation note for this section. */
function endGame(leftWon) {
  phase = 'ended';
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (gameHintEl) gameHintEl.hidden = true;
  if (hudMsg) {
    if (matchMode === 'alien') {
      hudMsg.textContent = pongCopy.pongLose;
    } else {
      hudMsg.textContent = leftWon ? pongCopy.pongMirrorWinLeft : pongCopy.pongMirrorWinRight;
    }
    hudMsg.hidden = false;
  }
  if (playAgainBtn) playAgainBtn.hidden = false;
}

function showMirrorPrepScreen() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  phase = 'mirror-prep';
  keys.up = keys.down = false;
  keysMirLeft.up = keysMirLeft.down = false;
  keysMirRight.up = keysMirRight.down = false;
  if (overlay) overlay.classList.add('pro-pong-overlay--mirror-prep');
  if (gameHintEl) gameHintEl.hidden = true;
  if (readyEl) readyEl.hidden = true;
  if (playAgainBtn) playAgainBtn.hidden = true;
  if (hudMsg) hudMsg.hidden = true;
  syncMirrorPrepTexts();
  if (mirrorPrepRoot) {
    mirrorPrepRoot.hidden = false;
    mirrorPrepRoot.setAttribute('aria-hidden', 'false');
  }
  if (scoresWrap) scoresWrap.hidden = true;
  if (stageWrap) stageWrap.hidden = true;
  requestAnimationFrame(() => {
    try {
      if (mirrorPrepBtn && phase === 'mirror-prep') mirrorPrepBtn.focus();
    } catch (_) {}
  });
}

function startMirrorMatch() {
  if (!ctx) return;
  if (overlay) overlay.classList.remove('pro-pong-overlay--mirror-prep');
  if (mirrorPrepRoot) {
    mirrorPrepRoot.hidden = true;
    mirrorPrepRoot.setAttribute('aria-hidden', 'true');
  }
  if (scoresWrap) scoresWrap.hidden = false;
  if (stageWrap) stageWrap.hidden = false;
  matchMode = 'mirror';
  phase = 'playing';
  keys.up = keys.down = false;
  keysMirLeft.up = keysMirLeft.down = false;
  keysMirRight.up = keysMirRight.down = false;
  scoreYou = 0;
  scoreAi = 0;
  pongMatchElapsed = 0;
  syncHud();
  applyMirrorHudCopy();
  if (hudMsg) hudMsg.hidden = true;
  if (readyEl) readyEl.hidden = true;
  if (gameHintEl) {
    gameHintEl.textContent = pongCopy.pongMirrorGameHint || '';
    gameHintEl.hidden = false;
  }
  if (playAgainBtn) playAgainBtn.hidden = true;
  leftY = H * 0.5 - PADDLE_H * 0.5;
  rightY = H * 0.5 - PADDLE_H * 0.5;
  resetBall(Math.random() < 0.5);
  lastT = 0;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

function beginAlienMatch() {
  if (!ctx) return;
  if (overlay) overlay.classList.remove('pro-pong-overlay--mirror-prep');
  if (mirrorPrepRoot) {
    mirrorPrepRoot.hidden = true;
    mirrorPrepRoot.setAttribute('aria-hidden', 'true');
  }
  if (scoresWrap) scoresWrap.hidden = false;
  if (stageWrap) stageWrap.hidden = false;
  matchMode = 'alien';
  keys.up = keys.down = false;
  keysMirLeft.up = keysMirLeft.down = false;
  keysMirRight.up = keysMirRight.down = false;
  scoreYou = 0;
  scoreAi = 0;
  pongMatchElapsed = 0;
  syncHud();
  applyAlienHudCopy();
  if (hudMsg) hudMsg.hidden = true;
  if (readyEl) readyEl.hidden = true;
  if (gameHintEl) {
    gameHintEl.textContent = pongCopy.pongGameHintAlien || '';
    gameHintEl.hidden = false;
  }
  if (playAgainBtn) playAgainBtn.hidden = true;
  leftY = H * 0.5 - PADDLE_H * 0.5;
  rightY = H * 0.5 - PADDLE_H * 0.5;
  resetBall(Math.random() < 0.5);
  phase = 'playing';
  lastT = 0;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

function startMatch() {
  beginAlienMatch();
}

function showReadyPhase() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (overlay) overlay.classList.remove('pro-pong-overlay--mirror-prep');
  if (mirrorPrepRoot) {
    mirrorPrepRoot.hidden = true;
    mirrorPrepRoot.setAttribute('aria-hidden', 'true');
  }
  if (scoresWrap) scoresWrap.hidden = false;
  if (stageWrap) stageWrap.hidden = false;
  matchMode = 'alien';
  phase = 'ready';
  keys.up = keys.down = false;
  keysMirLeft.up = keysMirLeft.down = false;
  keysMirRight.up = keysMirRight.down = false;
  scoreYou = 0;
  scoreAi = 0;
  syncHud();
  applyAlienHudCopy();
  if (hudMsg) hudMsg.hidden = true;
  if (readyEl) readyEl.hidden = false;
  if (gameHintEl) gameHintEl.hidden = true;
  if (playAgainBtn) playAgainBtn.hidden = true;
  syncGateHintVisibility();
  drawIdleField();
}

function resizeCanvasCss() {
  if (!canvas) return;
  const maxW = Math.min(window.innerWidth - 48, 720);
  const aspect = H / W;
  const cw = maxW;
  const ch = cw * aspect;
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;
}

function pongCloseAnimMs() {
  try {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 40;
    }
  } catch (_) {}
  return PONG_CLOSE_ANIM_MS;
}

function finishPongOverlayClose() {
  if (!overlay) return;
  overlay.setAttribute('hidden', '');
  overlay.classList.remove('pro-pong-overlay--closing');
  overlay.classList.remove('pro-pong-overlay--mirror-prep');
  document.body.classList.remove('pro-pong-open');
  _pongCloseTimer = null;
}

function openOverlay() {
  if (!overlay) return;
  if (_pongCloseTimer) {
    clearTimeout(_pongCloseTimer);
    _pongCloseTimer = null;
  }
  overlay.classList.remove('pro-pong-overlay--closing');
  overlay.removeAttribute('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  /* BIO: Map overlay behavior and interaction note. */
  overlay.style.animation = 'none';
  const panel = overlay.querySelector('.pro-pong-panel');
  if (panel) panel.style.animation = 'none';
  void overlay.offsetHeight;
  overlay.style.animation = '';
  if (panel) panel.style.animation = '';
  resizeCanvasCss();
  showReadyPhase();
  document.body.classList.add('pro-pong-open');
}

function closeOverlay() {
  if (!overlay || overlay.hasAttribute('hidden')) return;
  if (overlay.classList.contains('pro-pong-overlay--closing')) return;

  overlay.classList.remove('pro-pong-overlay--mirror-prep');
  if (mirrorPrepRoot) {
    mirrorPrepRoot.hidden = true;
    mirrorPrepRoot.setAttribute('aria-hidden', 'true');
  }
  if (scoresWrap) scoresWrap.hidden = false;
  if (stageWrap) stageWrap.hidden = false;
  phase = 'idle';
  pongMatchElapsed = 0;
  keys.up = keys.down = false;
  keysMirLeft.up = keysMirLeft.down = false;
  keysMirRight.up = keysMirRight.down = false;
  matchMode = 'alien';
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  overlay.classList.add('pro-pong-overlay--closing');
  overlay.setAttribute('aria-hidden', 'true');

  const ms = pongCloseAnimMs();
  if (_pongCloseTimer) clearTimeout(_pongCloseTimer);
  _pongCloseTimer = setTimeout(() => {
    finishPongOverlayClose();
  }, ms);
}

function isTypingTarget(el) {
  if (!el || !el.tagName) return false;
  const t = el.tagName.toLowerCase();
  return t === 'input' || t === 'textarea' || el.isContentEditable;
}

function onKeyDown(e) {
  if (!overlay || overlay.hasAttribute('hidden')) return;
  if (overlay.classList.contains('pro-pong-overlay--closing')) return;
  if (isTypingTarget(e.target)) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeOverlay();
    return;
  }

  if (phase === 'mirror-prep') {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      startMirrorMatch();
    }
    return;
  }

  if (phase === 'ended' && (e.code === 'Enter' || e.code === 'Space')) {
    e.preventDefault();
    if (matchMode === 'mirror') startMirrorMatch();
    else beginAlienMatch();
    return;
  }

  if (phase === 'ready' && (e.code === 'Enter' || e.code === 'Space')) {
    e.preventDefault();
    startMatch();
    return;
  }

  if (phase !== 'playing') return;

  if (matchMode === 'mirror') {
    if (e.code === 'KeyW') {
      keysMirLeft.up = true;
      e.preventDefault();
    }
    if (e.code === 'KeyS') {
      keysMirLeft.down = true;
      e.preventDefault();
    }
    if (e.code === 'ArrowUp') {
      keysMirRight.up = true;
      e.preventDefault();
    }
    if (e.code === 'ArrowDown') {
      keysMirRight.down = true;
      e.preventDefault();
    }
    return;
  }

  if (e.code === 'KeyW' || e.code === 'ArrowUp') {
    keys.up = true;
    e.preventDefault();
  }
  if (e.code === 'KeyS' || e.code === 'ArrowDown') {
    keys.down = true;
    e.preventDefault();
  }
}

function onKeyUp(e) {
  if (!overlay || overlay.hasAttribute('hidden')) return;
  if (overlay.classList.contains('pro-pong-overlay--closing')) return;

  if (matchMode === 'mirror' && phase === 'playing') {
    if (e.code === 'KeyW') keysMirLeft.up = false;
    if (e.code === 'KeyS') keysMirLeft.down = false;
    if (e.code === 'ArrowUp') keysMirRight.up = false;
    if (e.code === 'ArrowDown') keysMirRight.down = false;
    return;
  }

  if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = false;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = false;
}

function boot() {
  overlay = document.getElementById('pro-pong-overlay');
  canvas = document.getElementById('pro-pong-canvas');
  closeBtn = document.getElementById('pro-pong-close');
  hudYou = document.getElementById('pro-pong-score-you');
  hudAi = document.getElementById('pro-pong-score-ai');
  hudMsg = document.getElementById('pro-pong-end-msg');
  readyEl = document.getElementById('pro-pong-ready');
  gameHintEl = document.getElementById('pro-pong-game-hint');
  startBtn = document.getElementById('pro-pong-start');
  elTitle = document.getElementById('pro-pong-title');
  elReadyQ = document.getElementById('pro-pong-ready-q');
  elGateHint = document.getElementById('pro-pong-gate-hint');
  elReadyControls = document.getElementById('pro-pong-ready-controls');
  elLabelYou = document.getElementById('pro-pong-label-you');
  elLabelAlien = document.getElementById('pro-pong-label-alien');
  playAgainBtn = document.getElementById('pro-pong-play-again');
  mirrorPrepRoot = document.getElementById('pro-pong-mirror-prep');
  mirrorPrepTitle = document.getElementById('pro-pong-mirror-prep-title');
  mirrorPrepBody = document.getElementById('pro-pong-mirror-prep-body');
  mirrorPrepQ = document.getElementById('pro-pong-mirror-prep-q');
  mirrorPrepBtn = document.getElementById('pro-pong-mirror-prep-btn');
  if (!overlay || !canvas) return;
  scoresWrap = overlay.querySelector('.pro-pong-scores');
  stageWrap = overlay.querySelector('.pro-pong-stage');
  ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  canvas.width = W;
  canvas.height = H;

  hookPongI18n();

  window.addEventListener('bgs-pro-pong-open', () => {
    openOverlay();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeOverlay());
  }
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (phase === 'ready') startMatch();
    });
  }
  if (mirrorPrepBtn) {
    mirrorPrepBtn.addEventListener('click', () => {
      if (phase === 'mirror-prep') startMirrorMatch();
    });
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('keyup', onKeyUp, true);

  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      if (phase !== 'ended') return;
      if (matchMode === 'mirror') startMirrorMatch();
      else beginAlienMatch();
    });
  }

  /* BIO: Cockpit layout, rendering, and interaction note. */
  function shouldBlockScrollBehindPong(e) {
    if (!document.body.classList.contains('pro-pong-open')) return false;
    const po = document.getElementById('pro-pong-overlay');
    if (!po || po.hasAttribute('hidden') || po.classList.contains('pro-pong-overlay--closing')) {
      return false;
    }
    const t = e.target;
    if (t && t.closest && t.closest('#main-vol')) return false;
    return true;
  }
  function onBlockScrollBehindPong(e) {
    if (!shouldBlockScrollBehindPong(e)) return;
    e.preventDefault();
    e.stopPropagation();
  }
  window.addEventListener('wheel', onBlockScrollBehindPong, { passive: false, capture: true });
  window.addEventListener('touchmove', onBlockScrollBehindPong, { passive: false, capture: true });

  window.addEventListener('blur', () => {
    keys.up = keys.down = false;
    keysMirLeft.up = keysMirLeft.down = false;
    keysMirRight.up = keysMirRight.down = false;
  });

  window.addEventListener('resize', () => {
    if (!overlay || overlay.hasAttribute('hidden')) return;
    resizeCanvasCss();
    if (phase === 'ready') drawIdleField();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
