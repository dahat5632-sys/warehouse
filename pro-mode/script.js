/* BIO: Cockpit layout, rendering, and interaction note. */
(() => {
  'use strict';

  /* BIO: cockpit-3d.js detectProMobileViewport ile uyumlu — mobil mini player + müzik yüklemez. */
  function detectProMusicSkipMobile() {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return false;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const narrow = matchMedia('(max-width: 820px)').matches;
    const ua = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    return coarse || (narrow && ua);
  }
  const SKIP_PRO_MOBILE_MINI_PLAYER = detectProMusicSkipMobile();
  try {
    if (SKIP_PRO_MOBILE_MINI_PLAYER && typeof document !== 'undefined' && document.body) {
      document.body.classList.add('pro-script-mobile-hide-mp');
    }
  } catch (_e0) {
    /* BIO: noop */
  }

  /* BIO: Hologram panel behavior and rendering note. */

  /* BIO: Implementation note for this section. */
  const UI = {
    tr: {
      modeDefault: 'VARSAYILAN MOD',
      modePro:     'PRO MOD',
      sub:         "PRO MOD'A HOŞ GELDİNİZ",
      hint:        'Dönmek için kaydırın',
      hint2:       'Gezegenlere tıklayın',
      aboutLabel:  'HAKKIMDA',
      projectsLabel: 'PROJELERİM',
      hobbiesLabel: 'HOBİLER',
      skillsLabel: 'YETENEKLER & İLGİ ALANLARI',
      contactLabel: 'İLETİŞİM',
      aboutSubEdu: 'Eğitim',
      aboutSubExp: 'Deneyim',
      aboutSubBio: 'Hakkımda',
      projectsSubWeb: 'Siber Güvenlik',
      projectsSubMob: 'Yapay Zeka',
      projectsSubBack: 'Karma Projeler',
      hobbiesSubEsp: 'E-Spor',
      hobbiesSubSht: 'Atıcılık',
      hobbiesSubTec: 'Teknoloji Trendleri',
      hobbiesSubTrv: 'Seyahat',
      skillsSubAi: 'Yapay Zeka',
      skillsSubSec: 'Siber Güvenlik',
      contactSubMail: 'E-posta',
      contactSubSoc: 'Sosyal Medya',
      backLabel:   '◄ GERİ DÖN',
      htmlLang:    'tr',
      mapLabel:        'HARİTA',
      mapHint:
        'Dairesel rota: tekerle aşağı = sıradaki (About → … → Contact); döngü ile başa döner. Tıklayınca o konuma gider.',
      mapCloseAria:  'Haritayı kapat',
      mapLoop:       'DÖNGÜ',
      pongInvite:           'Uzaylıyı yenebilir misin?',
      pongTitle:            'Pong — Uzaylı',
      pongYou:              'Sen',
      pongAlien:            'Uzaylı',
      pongReadyQ:           'Hazır mısın?',
      pongReadyControls:
        'W ve S veya yukarı ok ve aşağı ok ile oynanır.',
      pongStart:            'Başla',
      pongGameHint:
        'W / S · ↑ / ↓ · İlk 3 puanı alan kazanır · ESC ile kapat',
      pongWin:
        'Tebrikler, kazandın! Tekrar oyna ile yeniden başla.',
      pongLose:
        'Uzaylı kazandı. Tekrar oyna ile yeniden başla.',
      pongGateHint:
        'Uzaylıyı yen — son düelloyu aç.',
      pongMirrorIntro:
        'En zorlu düello kendine karşıdır.',
      pongMirrorPrepBody:
        'Şimdi kendinle kapışıyorsun: sol raketi W ve S ile, sağ raketi yukarı ve aşağı ok tuşlarıyla yönlendir. İlk üç puanı alan kazanır.',
      pongMirrorPrepReadyQ:
        'Hazır mısın?',
      pongMirrorReadyBtn:
        'Hazırım',
      pongMirrorTitle:      'Son düello — Kendine karşı',
      pongMirrorGameHint:
        'Sol: W / S · Sağ: ↑ / ↓ · İlk 3 puanı alan kazanır · ESC ile kapat',
      pongMirrorLabelLeft:  'Sol',
      pongMirrorLabelRight: 'Sağ',
      pongMirrorWinLeft:
        'Sol taraf kazandı! Tekrar oyna ile yeniden kendine karşı oyna.',
      pongMirrorWinRight:
        'Sağ taraf kazandı! Tekrar oyna ile yeniden kendine karşı oyna.',
      pongPlayAgain:        'Tekrar oyna',
      pongCloseAria:        'Oyunu kapat',
      defaultExitLabel: 'VARSAYILAN MOD  /  ÇIKIŞ',
      defaultExitTitle: 'VARSAYILAN MOD\'A DÖNÜŞ',
      defaultExitSub:
        'Default Mode daha sade ve daha performanslı bir yapı sunar. Geçiş yapmak için Evet\'e tıklayın.',
      defaultExitYes: 'EVET',
      defaultExitNo: 'HAYIR',
      intro2ExitSkip: 'GEÇ ▸',
      a11ySkip: 'Özet içeriğe atla',
      a11yOverviewTitle: '周天爽 — Pro Mode portfolyosu',
      a11yOverviewLead:
        'İnteraktif üç boyutlu kokpit. Masaüstünde fare tekerleği veya klavye (↑ ↓, W, S, Sayfa Yukarı / Aşağı). Mobilde kokpiti yatay kullanın; gyro için sensör izni istenebilir; gezegenler arasında dikey kaydırma.',
      a11yOverviewNavAria: 'Site bağlantıları',
      a11yDefaultLinkText: 'Varsayılan portfolyo görünümüne dön',
      a11yCockpitH2: 'Üç boyutlu kokpit',
      a11yCockpitLead:
        'Görsel içerik tam ekran arka planda sunulur; bu özet ekran okuyucular ve yapılandırılmış gezinme içindir.',
      a11ySectionList:
        'Bölümler: Hakkımda, Projelerim, Hobiler, Yetenekler ve İlgiler, İletişim. Kokpit araç çubuğundaki harita düğmesi veya bu metindeki bağlantılarla seçim yapılabilir; masaüstünde ayrıca ok veya W / S ile gezinilir.',
      masterVolAria: 'Ana ses seviyesi',
      seekAria: 'Çalma konumu',
      mpPrevAria: 'Önceki parça',
      mpPlayAria: 'Çal veya duraklat',
      mpNextAria: 'Sonraki parça'
    },
    en: {
      modeDefault: 'DEFAULT MODE',
      modePro:     'PRO MODE',
      sub:         'WELCOME TO PRO MODE',
      hint:        'Scroll to rotate',
      hint2:       'Click to planets',
      aboutLabel:  'ABOUT ME',
      projectsLabel: 'MY PROJECTS',
      hobbiesLabel: 'HOBBIES',
      skillsLabel: 'SKILLS & INTERESTS',
      contactLabel: 'CONTACT',
      aboutSubEdu: 'Education',
      aboutSubExp: 'Experience',
      aboutSubBio: 'About Me',
      projectsSubWeb: 'Cyber Security',
      projectsSubMob: 'Artificial Intelligence',
      projectsSubBack: 'Mixed Projects',
      hobbiesSubEsp: 'E-Sports',
      hobbiesSubSht: 'Shooting',
      hobbiesSubTec: 'Tech Trends',
      hobbiesSubTrv: 'Travel',
      skillsSubAi: 'Artificial Intelligence',
      skillsSubSec: 'Cyber Security',
      contactSubMail: 'E-mail',
      contactSubSoc: 'Social Media',
      backLabel:   '◄ GO BACK',
      htmlLang:    'en',
      mapLabel:        'MAP',
      mapHint:
        'Circular route: scroll down for next (About → … → Contact); loops back. Click to go there.',
      mapCloseAria:  'Close map',
      mapLoop:       'LOOP',
      pongInvite:           'Can you beat the alien?',
      pongTitle:            'Pong vs Alien',
      pongYou:              'You',
      pongAlien:            'Alien',
      pongReadyQ:           'Ready?',
      pongReadyControls:
        'Play with W and S or the Up and Down arrow keys.',
      pongStart:            'Start',
      pongGameHint:
        'W / S · ↑ / ↓ · First to 3 points wins · ESC to close',
      pongWin:
        'Congratulations — you win! Press Play again to restart.',
      pongLose:
        'Alien wins. Press Play again to restart.',
      pongGateHint:
        'Beat the alien — unlock the final duel.',
      pongMirrorIntro:
        'The hardest duel is against yourself.',
      pongMirrorPrepBody:
        'You face yourself: move the left paddle with W and S, the right paddle with the Up and Down arrows. First to 3 points wins.',
      pongMirrorPrepReadyQ:
        'Ready?',
      pongMirrorReadyBtn:
        "I'm ready",
      pongMirrorTitle:      'Final duel — Yourself',
      pongMirrorGameHint:
        'Left: W / S · Right: ↑ / ↓ · First to 3 points wins · ESC to close',
      pongMirrorLabelLeft:  'Left',
      pongMirrorLabelRight: 'Right',
      pongMirrorWinLeft:
        'Left wins! Press Play again for another duel with yourself.',
      pongMirrorWinRight:
        'Right wins! Press Play again for another duel with yourself.',
      pongPlayAgain:        'Play again',
      pongCloseAria:        'Close game',
      defaultExitLabel: 'DEFAULT MODE  /  EXIT',
      defaultExitTitle: 'SWITCH TO DEFAULT MODE?',
      defaultExitSub:
        'Default Mode offers a simpler, lighter experience. Click Yes to continue.',
      defaultExitYes: 'YES',
      defaultExitNo: 'NO',
      intro2ExitSkip: 'SKIP ▸',
      a11ySkip: 'Skip to summary content',
      a11yOverviewTitle: '周天爽 — Pro Mode portfolio',
      a11yOverviewLead:
        'Interactive 3D cockpit. Desktop: mouse wheel or keyboard (↑ ↓, W / S, Page Up / Down). Mobile: use landscape; gyro may ask for sensor permission; vertical swipe between planets.',
      a11yOverviewNavAria: 'Site links',
      a11yDefaultLinkText: 'Return to default portfolio view',
      a11yCockpitH2: 'Three-dimensional cockpit',
      a11yCockpitLead:
        'The visual cockpit renders full screen behind this summary, which exists for assistive technologies.',
      a11ySectionList:
        'Sections: About, Projects, Hobbies, Skills & Interests, Contact. Jump via the cockpit toolbar map button or desktop arrow / W / S navigation.',
      masterVolAria: 'Master volume',
      seekAria: 'Playback position',
      mpPrevAria: 'Previous track',
      mpPlayAria: 'Play or pause',
      mpNextAria: 'Next track'
    },
    de: {
      modeDefault: 'STANDARD-MODUS',
      modePro:     'PRO-MODUS',
      sub:         'WILLKOMMEN IM PRO-MODUS',
      hint:        'Zum Drehen scrollen',
      hint2:       'Planeten anklicken',
      aboutLabel:  'ÜBER MICH',
      projectsLabel: 'MEINE PROJEKTE',
      hobbiesLabel: 'HOBBYS',
      skillsLabel: 'FÄHIGKEITEN & INTERESSEN',
      contactLabel: 'KONTAKT',
      aboutSubEdu: 'Ausbildung',
      aboutSubExp: 'Erfahrung',
      aboutSubBio: 'Über mich',
      projectsSubWeb: 'Cybersicherheit',
      projectsSubMob: 'Künstliche Intelligenz',
      projectsSubBack: 'Gemischte Projekte',
      hobbiesSubEsp: 'E-Sport',
      hobbiesSubSht: 'Schießen',
      hobbiesSubTec: 'Tech-Trends',
      hobbiesSubTrv: 'Reisen',
      skillsSubAi: 'Künstliche Intelligenz',
      skillsSubSec: 'Cybersicherheit',
      contactSubMail: 'E-Mail',
      contactSubSoc: 'Soziale Medien',
      backLabel:   '◄ ZURÜCK',
      htmlLang:    'de',
      mapLabel:        'KARTE',
      mapHint:
        'Kreisförmig: Mausrad ab = nächster (About → … → Contact); springt zum Anfang. Klick = dorthin.',
      mapCloseAria:  'Karte schließen',
      mapLoop:       'LOOP',
      pongInvite:           'Schlagst du das Alien?',
      pongTitle:            'Pong vs Alien',
      pongYou:              'Du',
      pongAlien:            'Alien',
      pongReadyQ:           'Bereit?',
      pongReadyControls:
        'Mit W und S oder den Pfeiltasten Hoch/Runter spielen.',
      pongStart:            'Start',
      pongGameHint:
        'W / S · ↑ / ↓ · Wer zuerst 3 Punkte hat · ESC zum Schließen',
      pongWin:
        'Glückwunsch — gewonnen! Mit „Noch einmal“ neu starten.',
      pongLose:
        'Das Alien gewinnt. Mit „Noch einmal“ erneut versuchen.',
      pongGateHint:
        'Besiege das Alien — öffne das finale Duell.',
      pongMirrorIntro:
        'Das härteste Duell ist gegen dich selbst.',
      pongMirrorPrepBody:
        'Du spielst gegen dich selbst: links mit W und S, rechts mit den Pfeiltasten Hoch und Runter. Wer zuerst 3 Punkte hat, gewinnt.',
      pongMirrorPrepReadyQ:
        'Bereit?',
      pongMirrorReadyBtn:
        'Ich bin bereit',
      pongMirrorTitle:      'Finales Duell — Du selbst',
      pongMirrorGameHint:
        'Links: W / S · Rechts: ↑ / ↓ · Wer zuerst 3 Punkte hat · ESC zum Schließen',
      pongMirrorLabelLeft:  'Links',
      pongMirrorLabelRight: 'Rechts',
      pongMirrorWinLeft:
        'Linke Seite gewinnt! Mit „Noch einmal“ erneut gegen dich selbst.',
      pongMirrorWinRight:
        'Rechte Seite gewinnt! Mit „Noch einmal“ erneut gegen dich selbst.',
      pongPlayAgain:        'Noch einmal',
      pongCloseAria:        'Spiel schließen',
      defaultExitLabel: 'STANDARD-MODUS  /  BEENDEN',
      defaultExitTitle: 'ZUM STANDARD-MODUS WECHSELN?',
      defaultExitSub:
        'Der Standard-Modus ist schlichter und performanter. Zum Fortfahren auf Ja klicken.',
      defaultExitYes: 'JA',
      defaultExitNo: 'NEIN',
      intro2ExitSkip: 'ÜBERSPRINGEN ▸',
      a11ySkip: 'Zur Zusammenfassung springen',
      a11yOverviewTitle: '周天爽 — Portfolio im Pro‑Modus',
      a11yOverviewLead:
        'Interaktives 3D‑Cockpit. Desktop: Mausrad oder Tastatur (↑ ↓, W / S, Bild auf / ab). Mobil: Querformat; Gyro kann Sensorrechte anfragen; zwischen Planeten vertikal wischen.',
      a11yOverviewNavAria: 'Seiten‑Links',
      a11yDefaultLinkText: 'Zurück zur Standard‑Portfolio‑Ansicht',
      a11yCockpitH2: 'Dreidimensionales Cockpit',
      a11yCockpitLead:
        'Die visuelle Cockpit‑Szene liegt vollflächig im Hintergrund; dieser Block unterstützt Screenreader.',
      a11ySectionList:
        'Bereiche: Über mich, Projekte, Hobbys, Fähigkeiten & Interessen, Kontakt. Über die Kartentaste in der Cockpit‑Leiste oder Pfeiltasten / W / S am Desktop navigieren.',
      masterVolAria: 'Gesamtlautstärke',
      seekAria: 'Wiedergabeposition',
      mpPrevAria: 'Vorheriger Titel',
      mpPlayAria: 'Wiedergabe oder Pause',
      mpNextAria: 'Nächster Titel'
    }
  };



  /* BIO: Repurpose the former German language slot as Chinese for this GitHub Pages copy. */
  UI.de = {
    modeDefault: '默认模式',
    modePro: '专业模式',
    sub: '欢迎进入专业模式',
    hint: '滚动旋转',
    hint2: '点击星球',
    aboutLabel: '关于我',
    projectsLabel: '我的项目',
    hobbiesLabel: '爱好',
    skillsLabel: '技能与兴趣',
    contactLabel: '联系',
    aboutSubEdu: '教育经历',
    aboutSubExp: '经历',
    aboutSubBio: '个人简介',
    projectsSubWeb: '网络安全',
    projectsSubMob: '人工智能',
    projectsSubBack: '综合项目',
    hobbiesSubEsp: '电子竞技',
    hobbiesSubSht: '射击',
    hobbiesSubTec: '技术趋势',
    hobbiesSubTrv: '旅行',
    skillsSubAi: '人工智能',
    skillsSubSec: '网络安全',
    contactSubMail: '邮箱',
    contactSubSoc: '社交媒体',
    backLabel: '◄ 返回',
    htmlLang: 'zh-CN',
    mapLabel: '地图',
    mapHint: '循环路线：向下滚动前往下一个区域；点击可直接跳转。',
    mapCloseAria: '关闭地图',
    mapLoop: '循环',
    pongInvite: '你能击败外星人吗？',
    pongTitle: 'Pong 对战外星人',
    pongYou: '你',
    pongAlien: '外星人',
    pongReadyQ: '准备好了吗？',
    pongReadyControls: '使用 W/S 或上下方向键操作。',
    pongStart: '开始',
    pongGameHint: 'W/S · 上/下 · 先得 3 分获胜 · ESC 关闭',
    pongWin: '恭喜，你赢了！点击再玩一次重新开始。',
    pongLose: '外星人赢了。点击再玩一次重新开始。',
    pongGateHint: '击败外星人，解锁最终对决。',
    pongMirrorIntro: '最难的对决，是面对自己。',
    pongMirrorPrepBody: '你将与自己对战：左侧用 W/S，右侧用上下方向键。先得 3 分获胜。',
    pongMirrorPrepReadyQ: '准备好了吗？',
    pongMirrorReadyBtn: '我准备好了',
    pongMirrorTitle: '最终对决 - 自己',
    pongMirrorGameHint: '左：W/S · 右：上/下 · 先得 3 分获胜 · ESC 关闭',
    pongMirrorLabelLeft: '左侧',
    pongMirrorLabelRight: '右侧',
    pongMirrorWinLeft: '左侧获胜！点击再玩一次重新挑战。',
    pongMirrorWinRight: '右侧获胜！点击再玩一次重新挑战。',
    pongPlayAgain: '再玩一次',
    pongCloseAria: '关闭游戏',
    defaultExitLabel: '默认模式 / 退出',
    defaultExitTitle: '切换到默认模式？',
    defaultExitSub: '默认模式更轻量、更简洁。点击“是”继续。',
    defaultExitYes: '是',
    defaultExitNo: '否',
    intro2ExitSkip: '跳过 ▸',
    a11ySkip: '跳到摘要内容',
    a11yOverviewTitle: '周天爽 - 专业模式作品集',
    a11yOverviewLead: '交互式三维驾驶舱。桌面端可使用滚轮或键盘；移动端建议横屏。',
    a11yOverviewNavAria: '站点链接',
    a11yDefaultLinkText: '返回默认作品集视图',
    a11yCockpitH2: '三维驾驶舱',
    a11yCockpitLead: '视觉驾驶舱在全屏背景中渲染，此摘要用于辅助技术和结构化导航。',
    a11ySectionList: '区域：关于我、项目、爱好、技能与兴趣、联系。',
    masterVolAria: '主音量',
    seekAria: '播放位置',
    mpPrevAria: '上一首',
    mpPlayAria: '播放或暂停',
    mpNextAria: '下一首'
  };

  delete UI.tr;

  let defaultExitModalOpen = false;
  let pdxFocusReturn = null;
  let intro2ExitInProgress = false;
  let defaultExitMeteorSeq = false;
  const PDX_SFX_METEOR_MIX = 0.8;
  const PDX_SFX_CRACK_MIX = 0.55;

  function pauseProCockpitRender() {
    window.dispatchEvent(new Event('bgs-pro-cockpit-render-pause'));
  }
  function resumeProCockpitRender() {
    window.dispatchEvent(new Event('bgs-pro-cockpit-render-resume'));
  }
  function setProBlockingOverlay(on) {
    document.body.classList.toggle('pro-blocking-overlay', !!on);
  }

  function renderDefaultExitModal() {
    const t = UI[currentLang] || UI.en;
    const pl = document.getElementById('pdx-stage-label');
    const pt = document.getElementById('pdx-title');
    const ps = document.getElementById('pdx-sub');
    const py = document.getElementById('pdx-yes');
    const pn = document.getElementById('pdx-no');
    if (pl) pl.textContent = t.defaultExitLabel;
    if (pt) pt.textContent = t.defaultExitTitle;
    if (ps) ps.textContent = t.defaultExitSub;
    if (py) py.textContent = t.defaultExitYes;
    if (pn) pn.textContent = t.defaultExitNo;
  }

  function renderDefaultExitModalIfOpen() {
    const w = document.getElementById('pro-default-exit');
    if (w && w.classList.contains('open')) renderDefaultExitModal();
  }

  function closeDefaultExitConfirm(opts) {
    const wrap = document.getElementById('pro-default-exit');
    if (!wrap) return;
    const restoreFocus = pdxFocusReturn;
    pdxFocusReturn = null;
    wrap.classList.remove('open', 'pdx-exit-closing');
    wrap.setAttribute('aria-hidden', 'true');
    defaultExitModalOpen = false;
    resetPdxExitModalPanelStyles();
    const o = opts || {};
    if (!o.keepBlocking) setProBlockingOverlay(false);
    if (!o.keepRenderPaused) resumeProCockpitRender();
    if (!o.skipRestoreFocus && restoreFocus && typeof restoreFocus.focus === 'function') {
      window.requestAnimationFrame(() => {
        try {
          restoreFocus.focus({ preventScroll: true });
        } catch (_e) {
          try {
            restoreFocus.focus();
          } catch (__e2) {
            /* BIO: noop */
          }
        }
      });
    }
  }

  const STORAGE_LANG = 'bgs_lang';
  const STORAGE_LANG_DEFAULT_MIGRATION = 'bgs_lang_default_zh_v1';
  /** BIO: Ana site ile aynı anahtar (script.js BGS_VOL_KEY). */
  const STORAGE_VOL = 'bgs_vol';
  /** BIO: Mobil / aynı-sekme Pro geçişi — script.js BGS_VOL_SESSION_KEY ile ortak. */
  const STORAGE_VOL_SESSION = 'bgs_vol_session';
  let currentLang = 'de';
  try {
    if (localStorage.getItem(STORAGE_LANG_DEFAULT_MIGRATION) !== '1') {
      localStorage.setItem(STORAGE_LANG, 'de');
      localStorage.setItem(STORAGE_LANG_DEFAULT_MIGRATION, '1');
    } else {
      currentLang = localStorage.getItem(STORAGE_LANG) || 'de';
    }
  } catch (_) {
    currentLang = 'de';
  }
  if (currentLang === 'tr') currentLang = 'en';
  if (!UI[currentLang]) currentLang = 'de';

  const MAP_PLANETS = [
    { id: 'about', tex: '../assets/pro/aboutme/aboutme-texture.webp', shape: 'sphere' },
    { id: 'projects', tex: '../assets/pro/my-projects/my-projects-texture.webp', shape: 'sphere' },
    { id: 'hobbies', tex: '../assets/pro/hobbies/hobbies-texture.webp', shape: 'geoid' },
    { id: 'skills', tex: '../assets/pro/skills-interests/skillsinterests-texture.webp', shape: 'ringed' },
    { id: 'contact', tex: '../assets/pro/contact/contact-texture.webp', shape: 'torus' }
  ];
  const MAP_LABEL_KEY = {
    about: 'aboutLabel',
    projects: 'projectsLabel',
    hobbies: 'hobbiesLabel',
    skills: 'skillsLabel',
    contact: 'contactLabel'
  };

  function getPlanetLabelText(planetId, detail) {
    const t = UI[currentLang] || UI.en;
    const key = MAP_LABEL_KEY[planetId];
    if (detail && key && detail[key] != null) return detail[key];
    return key ? t[key] : planetId;
  }

  function syncProMapOverlayStrings(detail) {
    const t = UI[currentLang] || UI.en;
    const root = document.getElementById('pro-map-overlay');
    if (!root) return;
    const d = detail || {};
    const title = root.querySelector('.pro-map-title');
    if (title) title.textContent = d.mapLabel != null ? d.mapLabel : t.mapLabel;
    const hint = root.querySelector('.pro-map-hint');
    if (hint) hint.textContent = d.mapHint != null ? d.mapHint : t.mapHint;
    const hintSr = root.querySelector('#pro-map-desc');
    if (hintSr) hintSr.textContent = d.mapHint != null ? d.mapHint : t.mapHint;
    const closeBtn = root.querySelector('.pro-map-close');
    if (closeBtn) closeBtn.setAttribute('aria-label', d.mapCloseAria != null ? d.mapCloseAria : t.mapCloseAria);
    const loopEl = root.querySelector('.pro-map-loop-text');
    if (loopEl) loopEl.textContent = d.mapLoop != null ? d.mapLoop : t.mapLoop;
    root.querySelectorAll('.pro-map-node').forEach(node => {
      const id = node.getAttribute('data-planet-id');
      if (!id) return;
      const txt = getPlanetLabelText(id, d);
      const lab = node.querySelector('.pro-map-node-label');
      if (lab) lab.textContent = txt;
      node.setAttribute('aria-label', txt);
    });
  }

  let _proMapCloseTimer = null;
  let _proMapFocusReturn = null;

  function closeProMap() {
    const el = document.getElementById('pro-map-overlay');
    if (!el) return;
    if (el.hasAttribute('hidden')) return;
    const returnEl = _proMapFocusReturn;
    _proMapFocusReturn = null;
    /* BIO: Map overlay behavior and interaction note. */
    if (_proMapCloseTimer) {
      clearTimeout(_proMapCloseTimer);
      _proMapCloseTimer = null;
    }
    el.classList.add('pro-map-overlay--closing');
    _proMapCloseTimer = setTimeout(() => {
      _proMapCloseTimer = null;
      el.classList.remove('pro-map-overlay--closing');
      el.setAttribute('hidden', '');
      if (returnEl && typeof returnEl.focus === 'function') {
        try {
          returnEl.focus({ preventScroll: true });
        } catch (_err) {
          try {
            returnEl.focus();
          } catch (__e) {
            /* BIO: noop */
          }
        }
      }
    }, 480);
  }

  function callScrollToMainPlanet(id) {
    const api = window.bgsProCockpitApi;
    if (!api) return;
    /* BIO: Map overlay behavior and interaction note. */
    if (typeof api.forceExitProSubInstant === 'function') {
      try {
        api.forceExitProSubInstant();
      } catch (_e) {}
    }
    if (typeof api.scrollToMainPlanet === 'function') {
      try {
        api.scrollToMainPlanet(id);
      } catch (_e) {}
    }
  }

  function buildMapNodeShapeHtml(tex, shape) {
    const commonImg = (cls, ex) =>
      '<img class="' + cls + '" src="' + tex + '" alt="" loading="lazy" decoding="async"' + (ex || '') + ' />';
    if (shape === 'geoid') {
      return (
        '<span class="pro-map-shape pro-map-shape--geoid" aria-hidden="true">' + commonImg('pro-map-node-img') + '</span>'
      );
    }
    if (shape === 'ringed') {
      return (
        '<span class="pro-map-shape pro-map-shape--ringed" aria-hidden="true">' +
        '<span class="pro-map-saturn-ring"></span>' +
        '<span class="pro-map-saturn-body">' +
        commonImg('pro-map-node-img') +
        '</span></span>'
      );
    }
    if (shape === 'torus') {
      return (
        '<span class="pro-map-shape pro-map-shape--torus" aria-hidden="true">' +
        commonImg('pro-map-node-img pro-map-torus-img') +
        '</span>'
      );
    }
    return (
      '<span class="pro-map-shape pro-map-shape--sphere" aria-hidden="true">' + commonImg('pro-map-node-img') + '</span>'
    );
  }

  function setProMapOrbitState(root, idx, scrollScene) {
    const n = MAP_PLANETS.length;
    const pick = (((idx | 0) % n) + n) % n;
    if (scrollScene) {
      callScrollToMainPlanet(MAP_PLANETS[pick].id);
    }
    root.querySelectorAll('.pro-map-node').forEach((node, j) => {
      const on = j === pick;
      node.classList.toggle('pro-map-node--active', on);
      if (on) node.setAttribute('aria-current', 'true');
      else node.removeAttribute('aria-current');
    });
  }

  function proMapFocusableButtons(panel) {
    if (!panel) return [];
    return Array.from(panel.querySelectorAll('.pro-map-close,.pro-map-node')).filter(function (b) {
      return !(b.disabled || b.getAttribute('aria-disabled') === 'true');
    });
  }

  function onProMapDocumentKeydown(e) {
    const root = document.getElementById('pro-map-overlay');
    if (!root || root.hasAttribute('hidden')) return;
    const panel = root.querySelector('.pro-map-panel');
    if (!panel) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeProMap();
      return;
    }

    if (e.key !== 'Tab') return;
    const list = proMapFocusableButtons(panel);
    if (!list.length) return;

    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function ensureProMapOverlay() {
    if (document.getElementById('pro-map-overlay')) {
      const staleStage = document.querySelector('#pro-map-overlay .pro-map-stage');
      if (staleStage) staleStage.removeAttribute('aria-hidden');
      syncProMapOverlayStrings();
      return;
    }
    const root = document.createElement('div');
    root.id = 'pro-map-overlay';
    root.className = 'pro-map-overlay';
    root.setAttribute('hidden', '');
    const planetNodes = MAP_PLANETS.map((p, i) =>
      '<button type="button" class="pro-map-node" data-planet-id="' +
        p.id +
        '" data-orbit-index="' +
        i +
        '" aria-label="">' +
        '<span class="pro-map-node-hot" aria-hidden="true"></span>' +
        '<span class="pro-map-node-label"></span>' +
      '</button>'
    ).join('');
    root.innerHTML =
      '<div class="pro-map-backdrop" tabindex="-1" aria-hidden="true"></div>' +
      '<div class="pro-map-panel" role="dialog" aria-modal="true" aria-labelledby="pro-map-title" aria-describedby="pro-map-desc">' +
      '<h2 class="pro-map-title" id="pro-map-title"></h2>' +
      '<button type="button" class="pro-map-close" aria-label="">&times;</button>' +
      '<p id="pro-map-desc" class="pro-map-hint visually-hidden"></p>' +
      '<div class="pro-map-stage">' + planetNodes + '</div>' +
      '</div>';
    document.body.appendChild(root);
    syncProMapOverlayStrings();
    setProMapOrbitState(root, 0, false);
    /* BIO: Map overlay behavior and interaction note. */
    root.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );
    window.addEventListener('bgs-pro-ui-strings', e => {
      if (e && e.detail) syncProMapOverlayStrings(e.detail);
    });
    root.addEventListener('click', e => {
      if (e.target && e.target.closest && e.target.closest('.pro-map-close')) {
        e.preventDefault();
        closeProMap();
        return;
      }
      const node = e.target && e.target.closest && e.target.closest('.pro-map-node');
      if (node) {
        e.preventDefault();
        const id = node.getAttribute('data-planet-id');
        if (id) {
          if (node.classList.contains('pro-map-node--active')) {
            playButtonClickSfx();
          } else {
            playMapClickSfx();
          }
          callScrollToMainPlanet(id);
          closeProMap();
        }
        return;
      }
      if (e.target && e.target.closest && e.target.closest('.pro-map-backdrop')) {
        e.preventDefault();
        closeProMap();
      }
    });
    document.addEventListener('keydown', onProMapDocumentKeydown, false);
  }

  function openMapStub() {
    /* BIO: Map overlay behavior and interaction note. */
    dismissWelcomeOverlay();
    ensureProMapOverlay();
    const el = document.getElementById('pro-map-overlay');
    if (el) {
      /* BIO: Implementation note for this section. */
      if (_proMapCloseTimer) {
        clearTimeout(_proMapCloseTimer);
        _proMapCloseTimer = null;
      }
      el.classList.remove('pro-map-overlay--closing');
      el.removeAttribute('hidden');
      let idx = 0;
      const api = window.bgsProCockpitApi;
      if (api && typeof api.getCarouselMainPlanetIndex === 'function') {
        try {
          idx = api.getCarouselMainPlanetIndex() | 0;
        } catch (_e) {
          idx = 0;
        }
      }
      setProMapOrbitState(el, idx, false);

      _proMapFocusReturn = document.activeElement;
      window.requestAnimationFrame(function () {
        const panel = el.querySelector('.pro-map-panel');
        const picks = proMapFocusableButtons(panel);
        const active = el.querySelector('.pro-map-node--active');
        const focusTarget =
          active && picks.indexOf(active) >= 0 ? active : picks[0] || el.querySelector('.pro-map-close');
        if (focusTarget && typeof focusTarget.focus === 'function') {
          try {
            focusTarget.focus({ preventScroll: true });
          } catch (_e) {
            focusTarget.focus();
          }
        }
      });
    }
  }

  function syncProOverviewA11yStatic(t) {
    if (!t || typeof document === 'undefined') return;
    function gid(id) {
      return document.getElementById(id);
    }
    const skip = gid('pro-skip-overview');
    if (skip) skip.textContent = t.a11ySkip;
    const mh = gid('pro-overview-h1');
    if (mh) mh.textContent = t.a11yOverviewTitle;
    const ld = gid('pro-overview-lead');
    if (ld) ld.textContent = t.a11yOverviewLead;
    const nv = gid('pro-overview-nav');
    if (nv) nv.setAttribute('aria-label', t.a11yOverviewNavAria);
    const dl = gid('pro-overview-default-link');
    if (dl) dl.textContent = t.a11yDefaultLinkText;
    const ch = gid('pro-a11y-cockpit-h2');
    if (ch) ch.textContent = t.a11yCockpitH2;
    const pcl = gid('pro-overview-cockpit-lead');
    if (pcl) pcl.textContent = t.a11yCockpitLead;
    const sl = gid('pro-overview-section-list');
    if (sl) sl.textContent = t.a11ySectionList;
    const mvr = gid('main-vol-range-pro');
    if (mvr) mvr.setAttribute('aria-label', t.masterVolAria);
    const mseek = gid('mp-seek');
    if (mseek) mseek.setAttribute('aria-label', t.seekAria);
    const pv = gid('mp-prev');
    const nx = gid('mp-next');
    const pl = gid('mp-play');
    if (pv) {
      pv.setAttribute('aria-label', t.mpPrevAria);
      pv.setAttribute('title', t.mpPrevAria);
    }
    if (nx) {
      nx.setAttribute('aria-label', t.mpNextAria);
      nx.setAttribute('title', t.mpNextAria);
    }
    if (pl) {
      pl.setAttribute('aria-label', t.mpPlayAria);
      pl.setAttribute('title', t.mpPlayAria);
    }
  }

  function applyLang(lang) {
    const t = UI[lang] || UI.en;
    currentLang = lang;
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (_) {}
    try { localStorage.setItem(STORAGE_LANG_DEFAULT_MIGRATION, '1'); } catch (_) {}
    document.documentElement.lang = t.htmlLang;

    document.querySelectorAll('.tb-mode').forEach(btn => {
      if (btn.dataset.mode === 'default') btn.textContent = t.modeDefault;
      if (btn.dataset.mode === 'pro')     btn.textContent = t.modePro;
    });
    document.querySelectorAll('.tb-lang').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('[data-fallback-ui="default"]').forEach(el => {
      el.textContent = t.modeDefault;
    });
    document.querySelectorAll('[data-fallback-ui="map"]').forEach(el => {
      el.textContent = t.mapLabel;
    });
    window.dispatchEvent(
      new CustomEvent('bgs-pro-ui-strings', {
        detail: {
          modeDefault: t.modeDefault,
          mapLabel: t.mapLabel,
          mapHint: t.mapHint,
          mapCloseAria: t.mapCloseAria,
          mapLoop: t.mapLoop,
          welcomeSub: t.sub,
          welcomeHint: t.hint,
          welcomeHint2: t.hint2,
          aboutLabel: t.aboutLabel,
          projectsLabel: t.projectsLabel,
          hobbiesLabel: t.hobbiesLabel,
          skillsLabel: t.skillsLabel,
          contactLabel: t.contactLabel,
          aboutSubEdu: t.aboutSubEdu,
          aboutSubExp: t.aboutSubExp,
          aboutSubBio: t.aboutSubBio,
          projectsSubWeb: t.projectsSubWeb,
          projectsSubMob: t.projectsSubMob,
          projectsSubBack: t.projectsSubBack,
          hobbiesSubEsp: t.hobbiesSubEsp,
          hobbiesSubSht: t.hobbiesSubSht,
          hobbiesSubTec: t.hobbiesSubTec,
          hobbiesSubTrv: t.hobbiesSubTrv,
          skillsSubAi: t.skillsSubAi,
          skillsSubSec: t.skillsSubSec,
          contactSubMail: t.contactSubMail,
          contactSubSoc: t.contactSubSoc,
          backLabel: t.backLabel,
          pongInvite: t.pongInvite,
          pongTitle: t.pongTitle,
          pongYou: t.pongYou,
          pongAlien: t.pongAlien,
          pongReadyQ: t.pongReadyQ,
          pongReadyControls: t.pongReadyControls,
          pongStart: t.pongStart,
          pongGameHint: t.pongGameHint,
          pongWin: t.pongWin,
          pongLose: t.pongLose,
          pongGateHint: t.pongGateHint,
          pongMirrorIntro: t.pongMirrorIntro,
          pongMirrorPrepBody: t.pongMirrorPrepBody,
          pongMirrorPrepReadyQ: t.pongMirrorPrepReadyQ,
          pongMirrorReadyBtn: t.pongMirrorReadyBtn,
          pongMirrorTitle: t.pongMirrorTitle,
          pongMirrorGameHint: t.pongMirrorGameHint,
          pongMirrorLabelLeft: t.pongMirrorLabelLeft,
          pongMirrorLabelRight: t.pongMirrorLabelRight,
          pongMirrorWinLeft: t.pongMirrorWinLeft,
          pongMirrorWinRight: t.pongMirrorWinRight,
          pongPlayAgain: t.pongPlayAgain,
          pongCloseAria: t.pongCloseAria
        }
      })
    );
    syncProOverviewA11yStatic(t);
    renderDefaultExitModalIfOpen();
  }

  /* BIO: Implementation note for this section. */
  const $cur = document.getElementById('cur');
  const MAP_CUR_HOV = {
    about: 'hov-about',
    projects: 'hov-projects',
    hobbies: 'hov-hobbies',
    skills: 'hov-skills',
    contact: 'hov-contact'
  };
  const MAP_CUR_HOV_LIST = Object.values(MAP_CUR_HOV);
  const PRO_CUR_COCKPIT_HOV = [
    'hov',
    'hov-about',
    'hov-about-sub',
    'hov-projects',
    'hov-projects-sub',
    'hov-hobbies',
    'hov-hobbies-sub',
    'hov-skills',
    'hov-skills-sub',
    'hov-contact',
    'hov-contact-sub'
  ];
  function stripProCursorPlanetChrome() {
    if (!$cur) return;
    PRO_CUR_COCKPIT_HOV.forEach(c => {
      $cur.classList.remove(c);
    });
    MAP_CUR_HOV_LIST.forEach(c => {
      $cur.classList.remove(c);
    });
  }

  function updateProMapCursorStyle(clientX, clientY) {
    if (!$cur) return;
    const dex = document.getElementById('pro-default-exit');
    if (dex && dex.classList.contains('open')) {
      MAP_CUR_HOV_LIST.forEach(c => {
        $cur.classList.remove(c);
      });
      return;
    }
    const o = document.getElementById('pro-map-overlay');
    if (!o || o.hasAttribute('hidden')) {
      MAP_CUR_HOV_LIST.forEach(c => {
        $cur.classList.remove(c);
      });
      return;
    }
    let hit = null;
    try {
      hit = document.elementFromPoint(clientX, clientY);
    } catch (err) {
      return;
    }
    if (!hit) {
      MAP_CUR_HOV_LIST.forEach(c => {
        $cur.classList.remove(c);
      });
      return;
    }
    if (!hit.closest || !hit.closest('#pro-map-overlay')) {
      MAP_CUR_HOV_LIST.forEach(c => {
        $cur.classList.remove(c);
      });
      return;
    }
    const mnode = hit.closest('.pro-map-node');
    const mclose = hit.closest('.pro-map-close');
    MAP_CUR_HOV_LIST.forEach(c => {
      $cur.classList.remove(c);
    });
    if (mnode) {
      const id = mnode.getAttribute('data-planet-id');
      if (id && MAP_CUR_HOV[id]) {
        $cur.classList.add(MAP_CUR_HOV[id]);
      }
      $cur.classList.add('hov');
    } else if (mclose) {
      $cur.classList.add('hov');
    } else {
      $cur.classList.remove('hov');
    }
  }
  function updateDefaultExitModalCursorStyle(clientX, clientY) {
    if (!$cur) return;
    const dex = document.getElementById('pro-default-exit');
    if (!dex || !dex.classList.contains('open')) return;
    PRO_CUR_COCKPIT_HOV.forEach(c => {
      $cur.classList.remove(c);
    });
    MAP_CUR_HOV_LIST.forEach(c => {
      $cur.classList.remove(c);
    });
    let hit = null;
    try {
      hit = document.elementFromPoint(clientX, clientY);
    } catch (_err) {
      return;
    }
    const btn = hit && hit.closest && hit.closest('#pdx-yes, #pdx-no');
    if (btn) {
      $cur.classList.add('hov');
      return;
    }
    $cur.classList.remove('hov');
  }
  if ($cur) {
    const syncCurFromEvent = e => {
      $cur.style.left = e.clientX + 'px';
      $cur.style.top = e.clientY + 'px';
      updateProMapCursorStyle(e.clientX, e.clientY);
      updateDefaultExitModalCursorStyle(e.clientX, e.clientY);
    };
    /* BIO: Audio, SFX, and mini-player behavior note. */
    window.addEventListener('pointermove', syncCurFromEvent, { passive: true });
    window.addEventListener('mousemove', syncCurFromEvent, { passive: true });
    document.addEventListener('mouseover', e => {
      if (e.target.closest && e.target.closest('#pro-map-overlay')) return;
      if (
        e.target.closest('button, a, .tb-lang, .mp-btn, .pro-fb-row-btn, .pro-scroll-planet')
      ) {
        $cur.classList.add('hov');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest && e.target.closest('#pro-map-overlay')) return;
      if (
        e.target.closest('button, a, .tb-lang, .mp-btn, .pro-fb-row-btn, .pro-scroll-planet')
      ) {
        $cur.classList.remove('hov');
      }
    });
  }

  /* BIO: Implementation note for this section. */
  const $veil = document.getElementById('pro-entry-veil');

  function runEntrySequence() {
    playCockpitOpenSfx();
    const $c3 = document.getElementById('cockpit-3d-wrap');
    const vol3d = document.body.classList.contains('cockpit-3d-active') && $c3 && $c3.dataset.cockpit3d === 'ready';
    gsap.set($mainVol, { opacity: 0 });
    if (vol3d && $mainVol) {
      $mainVol.style.visibility = 'hidden';
    }

    const fadeBg = [];
    if ($c3 && $c3.dataset.cockpit3d === 'ready') {
      gsap.set($c3, { opacity: 0 });
      fadeBg.push($c3);
    }

    const tl = gsap.timeline();
    if (fadeBg.length) {
      tl.to(fadeBg, { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0.15);
    }
    tl.to(
      $veil,
      {
        opacity: 0,
        duration: 1.0,
        ease: 'power1.out',
        onComplete: () => { $veil.style.display = 'none'; }
      },
      0.25
    );
    if (!vol3d) {
      tl.to($mainVol, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.4);
    }
    window.__proEntrySequenceRan = true;
  }

  /* BIO: Cockpit layout, rendering, and interaction note. */
  let welcomeDismissed = false;
  function dismissWelcomeOverlay() {
    if (welcomeDismissed) return;
    welcomeDismissed = true;
    try {
      window.dispatchEvent(new Event('bgs-pro-welcome-dismiss'));
    } catch (_) {}
  }
  window.addEventListener('wheel', dismissWelcomeOverlay, { passive: true });
  window.addEventListener('touchmove', dismissWelcomeOverlay, { passive: true });
  window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      dismissWelcomeOverlay();
    }
  });

  /* BIO: Implementation note for this section. */
  let globalVolume = 0.7;
  (function hydrateVolumeFromStores() {
    let v;
    try {
      v = parseFloat(localStorage.getItem(STORAGE_VOL));
      if (!isNaN(v)) {
        globalVolume = Math.max(0, Math.min(1, v));
        return;
      }
    } catch (_) { /* BIO: noop */ }
    try {
      v = parseFloat(sessionStorage.getItem(STORAGE_VOL_SESSION));
      if (!isNaN(v)) globalVolume = Math.max(0, Math.min(1, v));
    } catch (_) { /* BIO: noop */ }
    try {
      sessionStorage.setItem(STORAGE_VOL_SESSION, globalVolume.toFixed(3));
    } catch (_) { /* BIO: noop */ }
  })();

  const $mainVol       = document.getElementById('main-vol');
  const $mainVolBlocks = document.getElementById('main-vol-blocks');
  const $mainVolPct    = document.getElementById('main-vol-pct');
  const $mainVolIcon   = document.getElementById('main-vol-icon');

  const MAIN_BLOCKS = 16;
  const mainBlocks = [];
  for (let i = 0; i < MAIN_BLOCKS; i++) {
    const b = document.createElement('div');
    b.className = 'vb';
    b.style.height = (4 + (i / (MAIN_BLOCKS - 1)) * 12) + 'px';
    $mainVolBlocks.appendChild(b);
    mainBlocks.push(b);
  }

  function mountProMainVolRange(blocksEl) {
    if (!blocksEl || blocksEl.closest('.bgs-vol-blocks-wrap')) return null;
    const wrap = document.createElement('div');
    wrap.className = 'bgs-vol-blocks-wrap';
    blocksEl.parentNode.insertBefore(wrap, blocksEl);
    wrap.appendChild(blocksEl);
    const r = document.createElement('input');
    r.type = 'range';
    r.id = 'main-vol-range-pro';
    r.className = 'bgs-vol-range';
    r.min = '0';
    r.max = '100';
    r.step = '1';
    r.setAttribute('aria-label', 'Master volume');
    wrap.appendChild(r);
    return r;
  }

  const mainVolRangePro = mountProMainVolRange($mainVolBlocks);

  function renderVolume() {
    const active = Math.round(globalVolume * MAIN_BLOCKS);
    mainBlocks.forEach((b, i) => {
      const on = i < active;
      b.classList.toggle('active', on);
      b.classList.toggle('hot', on && i >= MAIN_BLOCKS * 0.85);
    });
    const pct = Math.round(globalVolume * 100) + '%';
    $mainVolPct.textContent = pct;
    $mainVolIcon.textContent = globalVolume === 0 ? '🔇' : '🔊';
    if (mainVolRangePro) {
      mainVolRangePro.value = String(Math.round(globalVolume * 100));
      mainVolRangePro.setAttribute('aria-valuetext', pct);
    }
    try {
      window.dispatchEvent(new Event('bgs-pro-vol-display'));
    } catch (_) {}
  }

  let _sfxVolRadioAud = null;
  let _volRadioDragActive = false;
  let _sfxRadioCloseOpenAud = null;

  function setVolume(v) {
    globalVolume = Math.max(0, Math.min(1, v));
    const s = globalVolume.toFixed(3);
    try { localStorage.setItem(STORAGE_VOL, s); } catch (_) {}
    try { sessionStorage.setItem(STORAGE_VOL_SESSION, s); } catch (_) {}
    renderVolume();
    if (musicAudio) musicAudio.volume = Math.min(1, globalVolume * mpFadeProxy.v);
    if (_volRadioDragActive && _sfxVolRadioAud && !_sfxVolRadioAud.paused) {
      _sfxVolRadioAud.volume = Math.min(1, Math.max(0, globalVolume * 0.42));
    }
  }

  const SFX_COCKPIT_OPEN_SRC = '../assets/pro/sfx/cockpitopen.mp3';
  let _cockpitOpenSfxPlayed = false;
  function playCockpitOpenSfx() {
    if (_cockpitOpenSfxPlayed) return;
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        _cockpitOpenSfxPlayed = true;
        return;
      }
    } catch (_) {}
    _cockpitOpenSfxPlayed = true;
    const a = new Audio(SFX_COCKPIT_OPEN_SRC);
    a.volume = Math.min(1, globalVolume * 0.55);
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  function volFromX(e) {
    const rect = $mainVolBlocks.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }

  let draggingMain = false;
  $mainVolBlocks.addEventListener('mousedown', e => {
    draggingMain = true;
    playVolRadioDragSfx();
    setVolume(volFromX(e));
  });
  window.addEventListener('mousemove', e => {
    if (draggingMain) setVolume(volFromX(e));
  });
  window.addEventListener('mouseup', () => {
    if (draggingMain) stopVolRadioDragSfx();
    draggingMain = false;
  });
  $mainVolBlocks.addEventListener(
    'touchstart',
    e => {
      draggingMain = true;
      playVolRadioDragSfx();
      setVolume(volFromX(e));
    },
    { passive: true }
  );
  window.addEventListener('touchmove', e => {
    if (draggingMain) setVolume(volFromX(e));
  }, { passive: true });
  window.addEventListener('touchend', () => {
    if (draggingMain) stopVolRadioDragSfx();
    draggingMain = false;
  });
  $mainVolBlocks.addEventListener('wheel', e => {
    e.preventDefault();
    setVolume(globalVolume + (e.deltaY < 0 ? 0.05 : -0.05));
  }, { passive: false });

  renderVolume();

  let savedVolume = globalVolume;
  function toggleMute() {
    stopVolRadioDragSfx();
    const sfxBasis = globalVolume > 0 ? globalVolume : savedVolume > 0 ? savedVolume : 0.7;
    playRadioCloseOpenSfx(sfxBasis);
    if (globalVolume > 0) {
      savedVolume = globalVolume;
      setVolume(0);
    } else {
      setVolume(savedVolume > 0 ? savedVolume : 0.7);
    }
  }
  if ($mainVolIcon) $mainVolIcon.addEventListener('click', toggleMute);

  if (mainVolRangePro) {
    mainVolRangePro.addEventListener('input', () => {
      setVolume(parseInt(mainVolRangePro.value, 10) / 100);
    });
  }

  /* BIO: Implementation note for this section. */
  const MUSIC_PLAYLIST = [
    { src: '../assets/default/music/track1.ogg', title: 'TRACK 01' },
    { src: '../assets/default/music/track2.ogg', title: 'TRACK 02' },
    { src: '../assets/default/music/track3.ogg', title: 'TRACK 03' }
  ];

  let $miniPlayer;
  let $mpPrev;
  let $mpPlay;
  let $mpNext;
  let $mpProgress;
  let $mpFill;
  let $mpSeek;
  let $mpCur;
  let $mpDur;
  let $mpIconPlay;
  let $mpIconPause;

  let musicAudio = null;
  let mpIdx = 0;
  let mpSeeking = false;
  let mpFadeTween = null;
  const mpFadeProxy = { v: 1 };

  if (!SKIP_PRO_MOBILE_MINI_PLAYER) {
    $miniPlayer = document.getElementById('mini-player');
    $mpPrev = document.getElementById('mp-prev');
    $mpPlay = document.getElementById('mp-play');
    $mpNext = document.getElementById('mp-next');
    $mpProgress = document.getElementById('mp-progress');
    $mpFill = document.getElementById('mp-progress-fill');
    $mpSeek = document.getElementById('mp-seek');
    $mpCur = document.getElementById('mp-cur');
    $mpDur = document.getElementById('mp-dur');
    if ($mpPlay) {
      $mpIconPlay = $mpPlay.querySelector('.mp-ico-play');
      $mpIconPause = $mpPlay.querySelector('.mp-ico-pause');
    }
  }

  function mpApplyFadedVolume() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    if (musicAudio) musicAudio.volume = Math.min(1, globalVolume * mpFadeProxy.v);
  }
  function mpFadeIn() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    if (mpFadeTween) {
      mpFadeTween.kill();
      mpFadeTween = null;
    }
    mpFadeProxy.v = 0;
    mpApplyFadedVolume();
    mpFadeTween = gsap.to(mpFadeProxy, {
      v: 1,
      duration: 0.2,
      ease: 'power2.out',
      onUpdate: mpApplyFadedVolume,
      onComplete: () => {
        mpFadeTween = null;
      }
    });
  }
  function mpFadeOutThenPause() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    if (mpFadeTween) {
      mpFadeTween.kill();
      mpFadeTween = null;
    }
    mpFadeTween = gsap.to(mpFadeProxy, {
      v: 0,
      duration: 0.2,
      ease: 'power2.in',
      onUpdate: mpApplyFadedVolume,
      onComplete: () => {
        mpFadeTween = null;
        if (musicAudio && !musicAudio.paused) musicAudio.pause();
        mpFadeProxy.v = 1;
      }
    });
  }

  function mpFmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }
  function mpEnsure() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    if (musicAudio) return;
    musicAudio = new Audio();
    musicAudio.preload = 'metadata';
    musicAudio.volume = globalVolume;
    musicAudio.addEventListener('timeupdate',     mpTick);
    musicAudio.addEventListener('loadedmetadata', mpTick);
    musicAudio.addEventListener('durationchange', mpTick);
    musicAudio.addEventListener('ended', () => mpLoad(mpIdx + 1, true));
    musicAudio.addEventListener('play', () => {
      $mpIconPlay.style.display  = 'none';
      $mpIconPause.style.display = '';
      $miniPlayer.classList.add('mp-playing');
    });
    musicAudio.addEventListener('pause', () => {
      $mpIconPlay.style.display  = '';
      $mpIconPause.style.display = 'none';
      $miniPlayer.classList.remove('mp-playing');
    });
    musicAudio.addEventListener('error', () => {});
  }
  function mpLoad(i, autoplay) {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    mpEnsure();
    const n = MUSIC_PLAYLIST.length;
    mpIdx = ((i % n) + n) % n;
    const tr = MUSIC_PLAYLIST[mpIdx];
    musicAudio.src = tr.src;
    $mpFill.style.width = '0%';
    $mpCur.textContent = '0:00';
    $mpDur.textContent = '0:00';
    if (autoplay) {
      if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
      mpFadeProxy.v = 1;
      musicAudio.volume = globalVolume;
      const p = musicAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }
  function mpToggle() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    mpEnsure();
    if (!musicAudio.src) mpLoad(mpIdx, false);
    if (musicAudio.paused) {
      if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
      mpFadeProxy.v = 0;
      mpApplyFadedVolume();
      const p = musicAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      mpFadeIn();
    } else {
      mpFadeOutThenPause();
    }
  }
  function mpClickPrev() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    mpEnsure();
    if (musicAudio.src && musicAudio.currentTime > 3) {
      musicAudio.currentTime = 0;
    } else {
      mpLoad(mpIdx - 1, true);
    }
  }
  function mpTick() {
    if (SKIP_PRO_MOBILE_MINI_PLAYER) return;
    if (!musicAudio) return;
    const cur = musicAudio.currentTime || 0;
    const dur = musicAudio.duration    || 0;
    if (!mpSeeking) {
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      $mpFill.style.width = pct + '%';
      if ($mpSeek && dur > 0) {
        $mpSeek.value = String(Math.round((cur / dur) * 1000));
      }
    }
    $mpCur.textContent = mpFmt(cur);
    $mpDur.textContent = mpFmt(dur);
    if ($mpSeek && musicAudio && isFinite(musicAudio.duration)) {
      const d0 = musicAudio.duration || 0;
      $mpSeek.setAttribute('aria-valuetext', mpFmt(cur) + ' / ' + mpFmt(d0));
    }
    try {
      window.dispatchEvent(new Event('bgs-pro-mp-display'));
    } catch (_) {}
  }

  if (!SKIP_PRO_MOBILE_MINI_PLAYER && $mpPlay && $mpNext && $mpPrev && $mpProgress && $mpSeek) {
    $mpPlay.addEventListener('click', mpToggle);
    $mpNext.addEventListener('click', () => mpLoad(mpIdx + 1, true));
    $mpPrev.addEventListener('click', mpClickPrev);
    $mpSeek.addEventListener('input', () => {
      mpEnsure();
      if (!musicAudio || !isFinite(musicAudio.duration) || musicAudio.duration <= 0) return;
      const ratio = parseInt($mpSeek.value, 10) / 1000;
      $mpFill.style.width = (ratio * 100) + '%';
      try { musicAudio.currentTime = ratio * musicAudio.duration; } catch (_) {}
    });
    $mpSeek.addEventListener('pointerdown', () => { mpSeeking = true; });
    $mpSeek.addEventListener('pointerup', () => { mpSeeking = false; });
    $mpSeek.addEventListener('pointercancel', () => { mpSeeking = false; });
  }

  /* BIO: Cockpit layout, rendering, and interaction note. */
  const SFX_BUTTON_HOVER_SRC = '../assets/pro/sfx/buttonhover.mp3';
  const SFX_BUTTON_CLICK_SRC = '../assets/pro/sfx/buttonclick.mp3';
  const SFX_PLANET_HOVER_SRC = '../assets/pro/sfx/planethover.mp3';
  const SFX_PLANET_BUTTON_CLICK_SRC = '../assets/pro/sfx/planetbuttonclick.mp3';
  const SFX_HOLOGRAM_TYPING_SRC = '../assets/pro/sfx/hologramtyping.mp3';
  const SFX_PLANET_GO_BACK_SRC = '../assets/pro/sfx/planetgoback.mp3';
  const SFX_RADIO_VOICE_SRC = '../assets/pro/sfx/radiovoice.mp3';
  const SFX_RADIO_CLOSE_OPEN_SRC = '../assets/pro/sfx/radiocloseopen.mp3';
  const SFX_MAIL_3D_MODEL_SRC = '../assets/pro/sfx/mail3dmodel.mp3';
  const SFX_MAP_HOVER_SRC = '../assets/pro/sfx/maphover.mp3';
  const SFX_MAP_CLICK_SRC = '../assets/pro/sfx/mapclick.mp3';
  const SFX_PONG_BALL_USER_SRC = '../assets/pro/sfx/pongballhitsuser.mp3';
  const SFX_PONG_BALL_WALL_SRC = '../assets/pro/sfx/pongballhitswall.mp3';
  const SFX_PONG_GAME_WINLOSE_SRC = '../assets/pro/sfx/ponggamewinlose.mp3';
  /* BIO: Map overlay behavior and interaction note. */
  const _buttonHoverSfxParts = [
    '#mini-player .mp-btn',
    '#mini-player #mp-progress',
    '.tb-lang',
    '#pro-fallback-chrome .pro-fb-row-btn'
  ];
  const BUTTON_HOVER_DOM_SELECTOR = _buttonHoverSfxParts.join(', ');
  /* BIO: Map overlay behavior and interaction note. */
  const BUTTON_CLICK_DOM_SELECTOR = [
    ..._buttonHoverSfxParts,
    '#pro-map-overlay .pro-map-close',
    '#pro-pong-overlay button'
  ].join(', ');
  let _sfxButtonHoverAud = null;
  let _sfxButtonHoverPlaying = false;
  function playButtonHoverSfx() {
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    if (globalVolume <= 0) return;
    if (_sfxButtonHoverPlaying) return;
    if (!_sfxButtonHoverAud) {
      _sfxButtonHoverAud = new Audio(SFX_BUTTON_HOVER_SRC);
      _sfxButtonHoverAud.preload = 'auto';
      _sfxButtonHoverAud.addEventListener('ended', () => {
        _sfxButtonHoverPlaying = false;
      });
      _sfxButtonHoverAud.addEventListener('error', () => {
        _sfxButtonHoverPlaying = false;
      });
    }
    _sfxButtonHoverPlaying = true;
    _sfxButtonHoverAud.volume = Math.min(1, globalVolume * 0.88);
    try {
      _sfxButtonHoverAud.currentTime = 0;
    } catch (_) {}
    const p = _sfxButtonHoverAud.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        _sfxButtonHoverPlaying = false;
      });
    }
  }

  function stopButtonHoverSfx() {
    if (!_sfxButtonHoverAud) return;
    try {
      _sfxButtonHoverAud.pause();
      _sfxButtonHoverAud.currentTime = 0;
    } catch (_) {}
    _sfxButtonHoverPlaying = false;
  }

  let _sfxButtonClickAud = null;
  let _sfxButtonClickPlaying = false;
  let _sfxPlanetBtnClickAud = null;
  let _sfxPlanetBtnClickPlaying = false;
  function stopPlanetButtonClickSfx() {
    if (!_sfxPlanetBtnClickAud) return;
    try {
      _sfxPlanetBtnClickAud.pause();
      _sfxPlanetBtnClickAud.currentTime = 0;
    } catch (_) {}
    _sfxPlanetBtnClickPlaying = false;
  }
  function playPlanetButtonClickSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    stopMapClickSfx();
    stopHologramTypingSfx();
    stopPlanetButtonClickSfx();
    if (_sfxButtonClickAud && !_sfxButtonClickAud.paused) {
      try {
        _sfxButtonClickAud.pause();
        _sfxButtonClickAud.currentTime = 0;
      } catch (_) {}
      _sfxButtonClickPlaying = false;
    }
    if (globalVolume <= 0) return;
    if (_sfxPlanetBtnClickPlaying) return;
    if (!_sfxPlanetBtnClickAud) {
      _sfxPlanetBtnClickAud = new Audio(SFX_PLANET_BUTTON_CLICK_SRC);
      _sfxPlanetBtnClickAud.preload = 'auto';
      _sfxPlanetBtnClickAud.addEventListener('ended', () => {
        _sfxPlanetBtnClickPlaying = false;
      });
      _sfxPlanetBtnClickAud.addEventListener('error', () => {
        _sfxPlanetBtnClickPlaying = false;
      });
    }
    _sfxPlanetBtnClickPlaying = true;
    _sfxPlanetBtnClickAud.volume = Math.min(1, globalVolume * 0.88);
    try {
      _sfxPlanetBtnClickAud.currentTime = 0;
    } catch (_) {}
    const pb = _sfxPlanetBtnClickAud.play();
    if (pb && typeof pb.catch === 'function') {
      pb.catch(() => {
        _sfxPlanetBtnClickPlaying = false;
      });
    }
  }

  function playButtonClickSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    stopMapClickSfx();
    stopHologramTypingSfx();
    stopPlanetButtonClickSfx();
    if (globalVolume <= 0) return;
    if (_sfxButtonClickPlaying) return;
    if (!_sfxButtonClickAud) {
      _sfxButtonClickAud = new Audio(SFX_BUTTON_CLICK_SRC);
      _sfxButtonClickAud.preload = 'auto';
      _sfxButtonClickAud.addEventListener('ended', () => {
        _sfxButtonClickPlaying = false;
      });
      _sfxButtonClickAud.addEventListener('error', () => {
        _sfxButtonClickPlaying = false;
      });
    }
    _sfxButtonClickPlaying = true;
    _sfxButtonClickAud.volume = Math.min(1, globalVolume * 0.92);
    try {
      _sfxButtonClickAud.currentTime = 0;
    } catch (_) {}
    const p = _sfxButtonClickAud.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        _sfxButtonClickPlaying = false;
      });
    }
  }

  let _sfxMapClickAud = null;
  let _sfxMapClickPlaying = false;
  function stopMapClickSfx() {
    if (!_sfxMapClickAud) return;
    try {
      _sfxMapClickAud.pause();
      _sfxMapClickAud.currentTime = 0;
    } catch (_) {}
    _sfxMapClickPlaying = false;
  }
  function playMapClickSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    stopHologramTypingSfx();
    stopPlanetButtonClickSfx();
    stopMapClickSfx();
    if (_sfxButtonClickAud && !_sfxButtonClickAud.paused) {
      try {
        _sfxButtonClickAud.pause();
        _sfxButtonClickAud.currentTime = 0;
      } catch (_) {}
      _sfxButtonClickPlaying = false;
    }
    if (globalVolume <= 0) return;
    if (_sfxMapClickPlaying) return;
    if (!_sfxMapClickAud) {
      _sfxMapClickAud = new Audio(SFX_MAP_CLICK_SRC);
      _sfxMapClickAud.preload = 'auto';
      _sfxMapClickAud.addEventListener('ended', () => {
        _sfxMapClickPlaying = false;
      });
      _sfxMapClickAud.addEventListener('error', () => {
        _sfxMapClickPlaying = false;
      });
    }
    _sfxMapClickPlaying = true;
    _sfxMapClickAud.volume = Math.min(1, globalVolume * 0.92);
    try {
      _sfxMapClickAud.currentTime = 0;
    } catch (_) {}
    const pm = _sfxMapClickAud.play();
    if (pm && typeof pm.catch === 'function') {
      pm.catch(() => {
        _sfxMapClickPlaying = false;
      });
    }
  }

  let _sfxPlanetHoverAud = null;
  let _sfxMapHoverAud = null;
  function stopPlanetHoverSfx() {
    if (!_sfxPlanetHoverAud) return;
    try {
      _sfxPlanetHoverAud.pause();
      _sfxPlanetHoverAud.currentTime = 0;
    } catch (_) {}
  }
  function stopMapHoverSfx() {
    if (!_sfxMapHoverAud) return;
    try {
      _sfxMapHoverAud.pause();
      _sfxMapHoverAud.currentTime = 0;
    } catch (_) {}
  }
  function playMapHoverSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxMapHoverAud) {
      _sfxMapHoverAud = new Audio(SFX_MAP_HOVER_SRC);
      _sfxMapHoverAud.preload = 'auto';
    }
    _sfxMapHoverAud.volume = Math.min(1, globalVolume * 0.45);
    try {
      _sfxMapHoverAud.currentTime = 0;
    } catch (_) {}
    const mh = _sfxMapHoverAud.play();
    if (mh && typeof mh.catch === 'function') mh.catch(() => {});
  }
  function playPlanetHoverSfx() {
    stopButtonHoverSfx();
    stopMapHoverSfx();
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxPlanetHoverAud) {
      _sfxPlanetHoverAud = new Audio(SFX_PLANET_HOVER_SRC);
      _sfxPlanetHoverAud.preload = 'auto';
    }
    _sfxPlanetHoverAud.volume = Math.min(1, globalVolume * 0.45);
    try {
      _sfxPlanetHoverAud.currentTime = 0;
    } catch (_) {}
    const pp = _sfxPlanetHoverAud.play();
    if (pp && typeof pp.catch === 'function') pp.catch(() => {});
  }

  let _sfxHoloTypingAud = null;
  function stopHologramTypingSfx() {
    if (!_sfxHoloTypingAud) return;
    try {
      _sfxHoloTypingAud.pause();
      _sfxHoloTypingAud.currentTime = 0;
    } catch (_) {}
  }
  function playHologramTypingSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxHoloTypingAud) {
      _sfxHoloTypingAud = new Audio(SFX_HOLOGRAM_TYPING_SRC);
      _sfxHoloTypingAud.preload = 'auto';
      _sfxHoloTypingAud.loop = false;
    }
    _sfxHoloTypingAud.volume = Math.min(1, globalVolume * 0.38);
    try {
      _sfxHoloTypingAud.currentTime = 0;
    } catch (_) {}
    const ph = _sfxHoloTypingAud.play();
    if (ph && typeof ph.catch === 'function') ph.catch(() => {});
  }

  let _sfxPlanetGoBackAud = null;
  function playPlanetGoBackSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    stopHologramTypingSfx();
    stopPlanetButtonClickSfx();
    if (_sfxButtonClickAud && !_sfxButtonClickAud.paused) {
      try {
        _sfxButtonClickAud.pause();
        _sfxButtonClickAud.currentTime = 0;
      } catch (_) {}
      _sfxButtonClickPlaying = false;
    }
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxPlanetGoBackAud) {
      _sfxPlanetGoBackAud = new Audio(SFX_PLANET_GO_BACK_SRC);
      _sfxPlanetGoBackAud.preload = 'auto';
      _sfxPlanetGoBackAud.loop = false;
    }
    _sfxPlanetGoBackAud.volume = Math.min(1, globalVolume * 0.82);
    try {
      _sfxPlanetGoBackAud.currentTime = 0;
    } catch (_) {}
    const pg = _sfxPlanetGoBackAud.play();
    if (pg && typeof pg.catch === 'function') pg.catch(() => {});
  }

  function stopVolRadioDragSfx() {
    _volRadioDragActive = false;
    if (!_sfxVolRadioAud) return;
    try {
      _sfxVolRadioAud.pause();
      _sfxVolRadioAud.currentTime = 0;
    } catch (_) {}
  }

  function playVolRadioDragSfx() {
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxVolRadioAud) {
      _sfxVolRadioAud = new Audio(SFX_RADIO_VOICE_SRC);
      _sfxVolRadioAud.preload = 'auto';
      _sfxVolRadioAud.loop = true;
    }
    _volRadioDragActive = true;
    _sfxVolRadioAud.volume = Math.min(1, Math.max(0, globalVolume * 0.42));
    try {
      _sfxVolRadioAud.currentTime = 0;
    } catch (_) {}
    const pr = _sfxVolRadioAud.play();
    if (pr && typeof pr.catch === 'function') {
      pr.catch(() => {
        _volRadioDragActive = false;
      });
    }
  }

  function playRadioCloseOpenSfx(volHint) {
    const v =
      typeof volHint === 'number' && volHint > 0
        ? volHint
        : globalVolume > 0
          ? globalVolume
          : 0.7;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxRadioCloseOpenAud) {
      _sfxRadioCloseOpenAud = new Audio(SFX_RADIO_CLOSE_OPEN_SRC);
      _sfxRadioCloseOpenAud.preload = 'auto';
      _sfxRadioCloseOpenAud.loop = false;
    }
    try {
      _sfxRadioCloseOpenAud.currentTime = 0;
    } catch (_) {}
    _sfxRadioCloseOpenAud.volume = Math.min(1, Math.max(0, v * 0.5));
    const pc = _sfxRadioCloseOpenAud.play();
    if (pc && typeof pc.catch === 'function') pc.catch(() => {});
  }

  let _sfxMail3dHoverAud = null;
  function playMail3dModelHoverSfx() {
    stopButtonHoverSfx();
    stopPlanetHoverSfx();
    stopMapHoverSfx();
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
    } catch (_) {}
    if (!_sfxMail3dHoverAud) {
      _sfxMail3dHoverAud = new Audio(SFX_MAIL_3D_MODEL_SRC);
      _sfxMail3dHoverAud.preload = 'auto';
      _sfxMail3dHoverAud.loop = false;
    }
    try {
      _sfxMail3dHoverAud.currentTime = 0;
    } catch (_) {}
    _sfxMail3dHoverAud.volume = Math.min(1, globalVolume * 0.48);
    const pm = _sfxMail3dHoverAud.play();
    if (pm && typeof pm.catch === 'function') pm.catch(() => {});
  }

  let _sfxPongBallUserAud = null;
  let _sfxPongBallWallAud = null;
  let _sfxPongScoreAud = null;

  function playPongBallHitsUserSfx() {
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (_) {}
    if (!_sfxPongBallUserAud) {
      _sfxPongBallUserAud = new Audio(SFX_PONG_BALL_USER_SRC);
      _sfxPongBallUserAud.preload = 'auto';
      _sfxPongBallUserAud.loop = false;
    }
    try {
      _sfxPongBallUserAud.currentTime = 0;
    } catch (_) {}
    _sfxPongBallUserAud.volume = Math.min(1, globalVolume * 0.72);
    const pu = _sfxPongBallUserAud.play();
    if (pu && typeof pu.catch === 'function') pu.catch(() => {});
  }

  function playPongBallHitsWallSfx() {
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (_) {}
    if (!_sfxPongBallWallAud) {
      _sfxPongBallWallAud = new Audio(SFX_PONG_BALL_WALL_SRC);
      _sfxPongBallWallAud.preload = 'auto';
      _sfxPongBallWallAud.loop = false;
    }
    try {
      _sfxPongBallWallAud.currentTime = 0;
    } catch (_) {}
    _sfxPongBallWallAud.volume = Math.min(1, globalVolume * 0.68);
    const pw = _sfxPongBallWallAud.play();
    if (pw && typeof pw.catch === 'function') pw.catch(() => {});
  }

  function playPongGamewinloseSfx() {
    if (globalVolume <= 0) return;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (_) {}
    if (!_sfxPongScoreAud) {
      _sfxPongScoreAud = new Audio(SFX_PONG_GAME_WINLOSE_SRC);
      _sfxPongScoreAud.preload = 'auto';
      _sfxPongScoreAud.loop = false;
    }
    try {
      _sfxPongScoreAud.currentTime = 0;
    } catch (_) {}
    _sfxPongScoreAud.volume = Math.min(1, globalVolume * 0.78);
    const ps = _sfxPongScoreAud.play();
    if (ps && typeof ps.catch === 'function') ps.catch(() => {});
  }

  const _proWarmAudioRefs = [];
  function primeProAudioRef(src) {
    try {
      const a = new Audio(src);
      a.preload = 'auto';
      a.load();
      _proWarmAudioRefs.push(a);
      return a;
    } catch (_) {
      return null;
    }
  }

  function warmProModeRuntime() {
    primeProAudioRef(SFX_BUTTON_HOVER_SRC);
    primeProAudioRef(SFX_BUTTON_CLICK_SRC);
    primeProAudioRef(SFX_PLANET_HOVER_SRC);
    primeProAudioRef(SFX_PLANET_BUTTON_CLICK_SRC);
    primeProAudioRef(SFX_MAP_HOVER_SRC);
    primeProAudioRef(SFX_MAP_CLICK_SRC);
    primeProAudioRef(SFX_HOLOGRAM_TYPING_SRC);
    primeProAudioRef(SFX_PLANET_GO_BACK_SRC);
    primeProAudioRef(SFX_RADIO_VOICE_SRC);
    primeProAudioRef(SFX_RADIO_CLOSE_OPEN_SRC);
    primeProAudioRef(SFX_MAIL_3D_MODEL_SRC);
    primeProAudioRef(SFX_PONG_BALL_USER_SRC);
    primeProAudioRef(SFX_PONG_BALL_WALL_SRC);
    primeProAudioRef(SFX_PONG_GAME_WINLOSE_SRC);
    primeProAudioRef(SFX_COCKPIT_OPEN_SRC);

    try {
      ensureProMapOverlay();
      closeProMap();
    } catch (_) { /* BIO: Ignore map warm-up failures. */ }
  }

  function scheduleProModeWarmup() {
    const run = () => warmProModeRuntime();
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 1600 });
    } else {
      setTimeout(run, 700);
    }
  }

  const _btnHoverSeen = new WeakSet();
  const _planetFbHoverSeen = new WeakSet();
  document.addEventListener(
    'pointerover',
    e => {
      if (e.pointerType === 'touch') return;
      const el =
        e.target && e.target.closest && e.target.closest('#pro-scroll-fallback .pro-scroll-planet');
      if (!el) return;
      if (_planetFbHoverSeen.has(el)) return;
      _planetFbHoverSeen.add(el);
      el.addEventListener('pointerleave', () => _planetFbHoverSeen.delete(el), { once: true });
      playPlanetHoverSfx();
    },
    true
  );

  const _mapNodeHoverSeen = new WeakSet();
  document.addEventListener(
    'pointerover',
    e => {
      if (e.pointerType === 'touch') return;
      const el = e.target && e.target.closest && e.target.closest('#pro-map-overlay .pro-map-node');
      if (!el) return;
      if (_mapNodeHoverSeen.has(el)) return;
      _mapNodeHoverSeen.add(el);
      el.addEventListener('pointerleave', () => _mapNodeHoverSeen.delete(el), { once: true });
      playMapHoverSfx();
    },
    true
  );

  document.addEventListener(
    'pointerover',
    e => {
      if (e.pointerType === 'touch') return;
      const el = e.target && e.target.closest && e.target.closest(BUTTON_HOVER_DOM_SELECTOR);
      if (!el) return;
      if (el.closest('#main-vol-blocks')) return;
      if (_btnHoverSeen.has(el)) return;
      _btnHoverSeen.add(el);
      el.addEventListener('pointerleave', () => _btnHoverSeen.delete(el), { once: true });
      playButtonHoverSfx();
    },
    true
  );

  document.addEventListener(
    'click',
    e => {
      if (e.button !== 0) return;
      const el = e.target && e.target.closest && e.target.closest(BUTTON_CLICK_DOM_SELECTOR);
      if (!el) return;
      if (el.closest('#main-vol-blocks')) return;
      if (el.closest('#main-vol') && !el.closest('#mini-player')) return;
      playButtonClickSfx();
    },
    true
  );

  document.addEventListener(
    'click',
    e => {
      if (e.button !== 0) return;
      const el =
        e.target && e.target.closest && e.target.closest('#pro-scroll-fallback .pro-scroll-planet');
      if (!el) return;
      playPlanetButtonClickSfx();
    },
    true
  );

  /* BIO: Cockpit layout, rendering, and interaction note. */
  document.addEventListener('click', e => {
    const b = e.target && e.target.closest && e.target.closest('.tb-lang');
    if (!b || !b.dataset || !b.dataset.lang) return;
    e.preventDefault();
    applyLang(b.dataset.lang);
  });
  window.addEventListener('bgs-pro-lang-pick', e => {
    const lang = e.detail && e.detail.lang;
    if (!lang || !UI[lang]) return;
    applyLang(lang);
    window.dispatchEvent(new Event('bgs-pro-apply-lang'));
  });
  window.addEventListener('bgs-pro-apply-lang', () => applyLang(currentLang));

  function goDefaultMode() {
    try { sessionStorage.setItem('bgs_returning_from_pro', '1'); } catch (_) {}
    if (musicAudio && !musicAudio.paused) mpFadeOutThenPause();
    const veil = document.createElement('div');
    veil.style.cssText =
      'position:fixed;inset:0;background:#000;z-index:9999;opacity:0;' +
      'pointer-events:none;transition:opacity .7s ease;';
    document.body.appendChild(veil);
    requestAnimationFrame(() => { veil.style.opacity = '1'; });
    setTimeout(() => { window.location.href = '../'; }, 720);
  }

  function resetPdxExitModalPanelStyles() {
    const panel = document.getElementById('pdx-panel');
    const bd = document.getElementById('pdx-backdrop');
    const g = typeof window !== 'undefined' ? window.gsap : null;
    if (g && panel) g.set(panel, { clearProps: 'transform,opacity,scale' });
    if (g && bd) g.set(bd, { clearProps: 'opacity' });
  }

  function playPdxMeteorCrashSfx() {
    try {
      const a = new Audio('../assets/default/sfx/meteor-crash.mp3');
      const g = typeof globalVolume === 'number' ? globalVolume : 0.7;
      a.volume = Math.min(1, PDX_SFX_METEOR_MIX * g);
      window.__pdxMeteorCrashSfxRef = a;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  function playPdxScreenCrackSfx() {
    try {
      const a = new Audio('../assets/default/sfx/screen-crack.mp3');
      const g = typeof globalVolume === 'number' ? globalVolume : 0.7;
      a.volume = Math.min(1, PDX_SFX_CRACK_MIX * g);
      window.__pdxScreenCrackSfxRef = a;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }

  function buildPdxCrackPaths(svgEl, cx, cy) {
    if (!svgEl) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    svgEl.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    svgEl.innerHTML = '';
    const NS = 'http://www.w3.org/2000/svg';
    const radial = 16;
    const reach = Math.hypot(vw, vh) * 0.55;
    for (let i = 0; i < radial; i++) {
      const baseA = (i / radial) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const len = reach * (0.55 + Math.random() * 0.55);
      const segs = 6 + Math.floor(Math.random() * 4);
      const segLen = len / segs;
      let x = cx;
      let y = cy;
      let a = baseA;
      let d = `M ${cx.toFixed(1)} ${cy.toFixed(1)}`;
      for (let s = 0; s < segs; s++) {
        a += (Math.random() - 0.5) * 0.55;
        x += Math.cos(a) * segLen;
        y += Math.sin(a) * segLen;
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke-width', (0.9 + Math.random() * 1.4).toFixed(2));
      path.setAttribute('opacity', (0.55 + Math.random() * 0.45).toFixed(2));
      svgEl.appendChild(path);
      const branches = 1 + Math.floor(Math.random() * 2);
      for (let b = 0; b < branches; b++) {
        const bStart = 2 + Math.floor(Math.random() * Math.max(1, segs - 3));
        let bx = cx;
        let by = cy;
        let ba = baseA;
        for (let s = 0; s < bStart; s++) {
          ba += (Math.random() - 0.5) * 0.35;
          bx += Math.cos(ba) * segLen;
          by += Math.sin(ba) * segLen;
        }
        const bSegs = 2 + Math.floor(Math.random() * 3);
        let bAngle = baseA + (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6);
        let bd = `M ${bx.toFixed(1)} ${by.toFixed(1)}`;
        for (let s = 0; s < bSegs; s++) {
          bAngle += (Math.random() - 0.5) * 0.5;
          bx += Math.cos(bAngle) * segLen * 0.85;
          by += Math.sin(bAngle) * segLen * 0.85;
          bd += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`;
        }
        const bp = document.createElementNS(NS, 'path');
        bp.setAttribute('d', bd);
        bp.setAttribute('stroke-width', (0.6 + Math.random() * 0.9).toFixed(2));
        bp.setAttribute('opacity', (0.4 + Math.random() * 0.4).toFixed(2));
        svgEl.appendChild(bp);
      }
    }
  }

  function spawnPdxMeteorDust(cx, cy, dustEl) {
    if (!dustEl) return;
    dustEl.innerHTML = '';
    const palette = [
      'rgba(255,190,95,0.92)',
      'rgba(255,130,50,0.85)',
      'rgba(255,80,25,0.8)',
      'rgba(210,200,185,0.8)',
      'rgba(160,160,160,0.78)',
      'rgba(85,85,90,0.85)',
      'rgba(35,35,40,0.92)',
      'rgba(35,35,40,0.92)'
    ];
    const N = 80;
    const g = typeof window !== 'undefined' ? window.gsap : null;
    if (!g) return;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('div');
      p.className = 'md-p';
      const size = 2 + Math.random() * 7;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const isEmber = color.startsWith('rgba(255');
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = color;
      if (isEmber) {
        p.style.boxShadow = `0 0 ${(size * 2.4).toFixed(1)}px rgba(255,140,40,0.75)`;
      }
      p.style.left = cx - size / 2 + 'px';
      p.style.top = cy - size / 2 + 'px';
      dustEl.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const speed = 180 + Math.random() * 780;
      const dx = Math.cos(angle) * speed;
      const dyBurst = Math.sin(angle) * speed * 0.7 - (40 + Math.random() * 80);
      const gravity = 160 + Math.random() * 260;
      const life = 1.4 + Math.random() * 1.8;
      const rot = (Math.random() - 0.5) * 220;
      g.to(p, { x: dx, duration: life, ease: 'power3.out' });
      const up = g.timeline();
      up.to(p, { y: dyBurst, duration: life * 0.4, ease: 'power2.out' }).to(p, {
        y: dyBurst + gravity,
        duration: life * 0.6,
        ease: 'power1.in'
      });
      g.to(p, {
        rotation: rot,
        opacity: 0,
        scale: 0.35 + Math.random() * 0.4,
        duration: life,
        ease: 'power2.out',
        onComplete: () => {
          if (p.parentNode) p.parentNode.removeChild(p);
        }
      });
    }
  }

  function runPdxMeteorImpact() {
    const $hit = document.getElementById('pdx-meteor-hit');
    const $img = document.getElementById('pdx-meteor-img');
    const $flash = document.getElementById('pdx-meteor-flash');
    const $predark = document.getElementById('pdx-meteor-predark');
    const $dust = document.getElementById('pdx-meteor-dust');
    const $crack = document.getElementById('pdx-screen-crack');
    const $black = document.getElementById('pdx-screen-black');
    const g = typeof window !== 'undefined' ? window.gsap : null;
    if (!$hit || !$img || !$flash || !$predark || !$dust || !$crack || !$black || !g) {
      playIntro2ThenGoDefault({ skipMusicFade: true });
      return Promise.resolve();
    }
    return new Promise(resolve => {
      $hit.classList.add('active');

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh * 0.48;
      const meteorW = $img.offsetWidth || 640;
      const startX = vw + 160;
      const startY = -vh * 0.45;
      const endX = cx - meteorW / 2;
      const endY = cy - meteorW / 2;

      g.set($img, { x: startX, y: startY, scale: 0.5, rotation: 0, opacity: 0 });
      g.set($flash, { opacity: 0, scale: 0.4 });
      g.set($predark, { opacity: 0 });
      g.set($crack, { opacity: 0 });
      g.set($black, { opacity: 0 });
      $dust.innerHTML = '';

      buildPdxCrackPaths($crack, cx, cy);
      Array.from($crack.querySelectorAll('path')).forEach(p => {
        const L = p.getTotalLength();
        p.style.strokeDasharray = L;
        p.style.strokeDashoffset = L;
      });

      const tl = g.timeline({
        onComplete: () => {
          playIntro2ThenGoDefault({ skipMusicFade: true });
          $hit.classList.remove('active');
          resolve();
        }
      });

      tl.to($predark, { opacity: 0.6, duration: 0.45, ease: 'power2.in' }, 0.05);
      tl.to($predark, { opacity: 0.9, duration: 0.12, ease: 'power2.out' }, 0.5);
      tl.to($img, { opacity: 1, duration: 0.1, ease: 'power1.out' }, 0);
      tl.to(
        $img,
        {
          x: endX,
          y: endY,
          scale: 1.6,
          rotation: 18,
          duration: 0.5,
          ease: 'power3.in'
        },
        0
      );
      tl.to($flash, { opacity: 1, scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.5);
      tl.to($img, { opacity: 0, duration: 0.15, ease: 'power1.out' }, 0.5);
      tl.to($flash, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.65);
      tl.add(() => {
        playPdxMeteorCrashSfx();
        spawnPdxMeteorDust(cx, cy, $dust);
        g.fromTo(
          document.body,
          { x: -10, y: 8 },
          { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.3)', clearProps: 'transform' }
        );
      }, 0.48);
      tl.add(() => {
        playPdxScreenCrackSfx();
      }, 0.6);
      tl.to($crack, { opacity: 1, duration: 0.08, ease: 'none' }, 0.52);
      tl.to(
        '#pdx-screen-crack path',
        {
          strokeDashoffset: 0,
          duration: 0.45,
          stagger: { each: 0.012, from: 'random' },
          ease: 'power2.out'
        },
        0.52
      );
      tl.to($black, { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0.85);
      tl.to($crack, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.35);
      tl.to($predark, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 1.7);
      tl.to({}, { duration: 0.8 });
    });
  }

  function playIntro2ThenGoDefault(opts) {
    const o = opts || {};
    if (intro2ExitInProgress) return;
    intro2ExitInProgress = true;
    setProBlockingOverlay(true);
    pauseProCockpitRender();
    if (!o.skipMusicFade && musicAudio && !musicAudio.paused) mpFadeOutThenPause();

    const t = UI[currentLang] || UI.en;
    const wrap = document.createElement('div');
    wrap.id = 'pdx-intro2-overlay';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    const ttl = document.createElement('h2');
    ttl.id = 'pdx-intro2-title';
    ttl.className = 'visually-hidden';
    ttl.textContent = t.intro2ExitSkip;
    wrap.setAttribute('aria-labelledby', 'pdx-intro2-title');

    const vid = document.createElement('video');
    vid.src = '../assets/default/intro/intro2.mp4';
    vid.setAttribute('playsinline', '');
    vid.playsInline = true;
    vid.volume = globalVolume;

    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'anim-skip';
    skip.textContent = t.intro2ExitSkip;
    skip.setAttribute('aria-label', t.intro2ExitSkip);

    let done = false;
    function finishIntro2Exit() {
      if (done) return;
      done = true;
      try {
        vid.pause();
      } catch (_) {}
      // BIO: Removing the overlay first flashes the cockpit — hold black until ../ loads.
      const hold = document.createElement('div');
      hold.setAttribute('aria-hidden', 'true');
      hold.style.cssText =
        'position:fixed;inset:0;background:#000;z-index:10350;pointer-events:none';
      document.body.appendChild(hold);
      wrap.remove();
      intro2ExitInProgress = false;
      goDefaultMode();
    }

    vid.addEventListener('ended', finishIntro2Exit);
    skip.addEventListener('click', finishIntro2Exit);

    wrap.appendChild(ttl);
    wrap.appendChild(vid);
    wrap.appendChild(skip);
    document.body.appendChild(wrap);

    const p = vid.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        vid.muted = true;
        const p2 = vid.play();
        if (p2 && typeof p2.catch === 'function') p2.catch(() => finishIntro2Exit());
      });
    }
    setTimeout(() => {
      skip.style.opacity = '1';
    }, 600);
  }

  function beginDefaultExitYesSequence() {
    if (intro2ExitInProgress || defaultExitMeteorSeq) return;
    defaultExitMeteorSeq = true;

    const wrap = document.getElementById('pro-default-exit');
    if (wrap) wrap.classList.add('pdx-exit-closing');

    if (musicAudio && !musicAudio.paused) mpFadeOutThenPause();

    const panel = document.getElementById('pdx-panel');
    const bd = document.getElementById('pdx-backdrop');
    const g = typeof window !== 'undefined' ? window.gsap : null;

    function finishModalAndMeteor() {
      if (wrap) {
        wrap.classList.remove('open', 'pdx-exit-closing');
        wrap.setAttribute('aria-hidden', 'true');
      }
      defaultExitModalOpen = false;
      pdxFocusReturn = null;
      resetPdxExitModalPanelStyles();
      runPdxMeteorImpact().finally(() => {
        defaultExitMeteorSeq = false;
      });
    }

    if (!wrap || !panel || !bd) {
      finishModalAndMeteor();
      return;
    }

    if (!g) {
      finishModalAndMeteor();
      return;
    }

    g.timeline({ onComplete: finishModalAndMeteor })
      .to(panel, { scale: 0.92, opacity: 0, duration: 0.28, ease: 'power2.in' }, 0)
      .to(bd, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0.05);
  }

  function openDefaultExitConfirm() {
    if (intro2ExitInProgress || defaultExitMeteorSeq || defaultExitModalOpen) return;
    const wrap = document.getElementById('pro-default-exit');
    if (!wrap) {
      beginDefaultExitYesSequence();
      return;
    }
    resetPdxExitModalPanelStyles();
    renderDefaultExitModal();
    stripProCursorPlanetChrome();
    setProBlockingOverlay(true);
    pauseProCockpitRender();
    pdxFocusReturn = document.activeElement instanceof Element ? document.activeElement : null;
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden', 'false');
    defaultExitModalOpen = true;
    const noBtn = document.getElementById('pdx-no');
    window.requestAnimationFrame(() => {
      if (noBtn && typeof noBtn.focus === 'function') {
        try {
          noBtn.focus({ preventScroll: true });
        } catch (_e) {
          noBtn.focus();
        }
      }
    });
  }

  function wireDefaultExitModal() {
    const wrap = document.getElementById('pro-default-exit');
    const bd = document.getElementById('pdx-backdrop');
    const yesBtn = document.getElementById('pdx-yes');
    const noBtn = document.getElementById('pdx-no');
    if (!wrap || !bd || !yesBtn || !noBtn) return;
    bd.addEventListener('click', () => closeDefaultExitConfirm());
    noBtn.addEventListener('click', () => closeDefaultExitConfirm());
    yesBtn.addEventListener('click', () => beginDefaultExitYesSequence());
    document.addEventListener('keydown', e => {
      if (defaultExitMeteorSeq || intro2ExitInProgress) return;
      if (!wrap.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDefaultExitConfirm();
        return;
      }
      if (e.key !== 'Tab') return;
      const picks = [yesBtn, noBtn].filter(Boolean);
      if (picks.length < 2) return;
      const first = picks[0];
      const last = picks[1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  wireDefaultExitModal();

  window.addEventListener('bgs-pro-go-default', openDefaultExitConfirm);
  window.addEventListener('bgs-pro-map', openMapStub);

  /* BIO: Map overlay behavior and interaction note. */
  function initProScrollHtmlFallback() {
    if (document.getElementById('pro-scroll-fallback')) return;
    const stepPx = 132;
    const order = ['about', 'projects', 'hobbies', 'skills', 'contact'];
    const htmlBtns = order
      .map(
        id =>
          '<button type="button" class="pro-scroll-planet pro-scroll-planet--' +
          id +
          '" data-planet="' +
          id +
          '">' +
          '<span class="pro-scroll-planet-glow" aria-hidden="true"></span>' +
          '<span class="pro-scroll-planet-label"></span>' +
          '</button>'
      )
      .join('');
    const wrap = document.createElement('div');
    wrap.id = 'pro-scroll-fallback';
    wrap.innerHTML =
      '<div class="pro-scroll-fallback-track" id="pro-scroll-fallback-track">' + htmlBtns + '</div>';
    document.body.appendChild(wrap);
    const track = document.getElementById('pro-scroll-fallback-track');
    function syncStripLabels() {
      const t = UI[currentLang] || UI.en;
      document.querySelectorAll('#pro-scroll-fallback [data-planet]').forEach(btn00 => {
        const id = btn00.getAttribute('data-planet');
        const k = MAP_LABEL_KEY[id];
        const sp = btn00.querySelector('.pro-scroll-planet-label');
        if (sp && k) sp.textContent = t[k] || id;
        if (k) btn00.setAttribute('aria-label', t[k] || id);
      });
    }
    syncStripLabels();
    window.addEventListener('bgs-pro-ui-strings', syncStripLabels);
    let planetIndex = 0;
    function applyStripScroll() {
      if (track) {
        const off = -planetIndex * stepPx;
        track.style.transform = 'translate3d(' + off + 'px, -50%, 0)';
      }
    }
    applyStripScroll();
    let skipWheelHtml = true;
    window.addEventListener('bgs-pro-welcome-dismiss', () => {
      skipWheelHtml = true;
    });
    function onWH(e) {
      if (!document.body.classList.contains('cockpit-3d-unavailable')) return;
      if (skipWheelHtml) {
        skipWheelHtml = false;
        return;
      }
      e.preventDefault();
      planetIndex = Math.max(0, Math.min(4, planetIndex + (e.deltaY > 0 ? 1 : -1)));
      applyStripScroll();
    }
    window.addEventListener('wheel', onWH, { passive: false, capture: false });
    function htmlScrollToMainPlanet(id) {
      const idx = order.indexOf(id);
      if (idx < 0) return;
      planetIndex = idx;
      applyStripScroll();
    }
    if (window.bgsProCockpitApi) {
      window.bgsProCockpitApi.scrollToMainPlanet = htmlScrollToMainPlanet;
      window.bgsProCockpitApi.getCarouselMainPlanetIndex = () => planetIndex;
    }
    document.querySelectorAll('#pro-scroll-fallback [data-planet]').forEach(btn0 => {
      btn0.addEventListener('click', e => {
        e.preventDefault();
        const id = btn0.getAttribute('data-planet');
        if (id) {
          const idx2 = order.indexOf(id);
          if (idx2 >= 0) {
            planetIndex = idx2;
            applyStripScroll();
          }
        }
      });
    });
  }

  document.addEventListener('click', e => {
    const fb = e.target && e.target.closest && e.target.closest('[data-fallback-action]');
    if (!fb) return;
    e.preventDefault();
    const a = fb.dataset.fallbackAction;
    if (a === 'default') openDefaultExitConfirm();
    if (a === 'map')     openMapStub();
  });

  /* BIO: Cockpit layout, rendering, and interaction note. */
  let proBooted = false;
  function bootPro() {
    if (proBooted) return;
    proBooted = true;
    applyLang(currentLang);
    runEntrySequence();
    scheduleProModeWarmup();
  }
  function volNormFromClientX3d(normInBlocks) {
    setVolume(Math.max(0, Math.min(1, normInBlocks)));
  }

  window.bgsProCockpitApi = {
    setVolume,
    toggleMute,
    volNormFromClientX3d,
    mpToggle,
    mpClickPrev,
    /* BIO: Map overlay behavior and interaction note. */
    scrollToMainPlanet() {},
    getCarouselMainPlanetIndex() {
      return 0;
    },
    /* BIO: Cockpit layout, rendering, and interaction note. */
    forceExitProSubInstant() {},
    mpNext: () => mpLoad(mpIdx + 1, true),
    mpSeekRatio(r) {
      mpEnsure();
      if (!musicAudio || !isFinite(musicAudio.duration) || musicAudio.duration <= 0) return;
      const ratio = Math.max(0, Math.min(1, r));
      try {
        musicAudio.currentTime = ratio * musicAudio.duration;
      } catch (_) {}
    },
    getSnapshot() {
      return {
        vol: globalVolume,
        mainBlocks: MAIN_BLOCKS,
        iconMute: globalVolume === 0,
        music: musicAudio
          ? {
              cur: musicAudio.currentTime || 0,
              dur: isFinite(musicAudio.duration) ? musicAudio.duration : 0,
              paused: musicAudio.paused
            }
          : { cur: 0, dur: 0, paused: true }
      };
    },
    playButtonHoverSfx,
    playButtonClickSfx,
    playPlanetHoverSfx,
    playPlanetButtonClickSfx,
    playHologramTypingSfx,
    stopHologramTypingSfx,
    playPlanetGoBackSfx,
    playVolRadioDragSfx,
    stopVolRadioDragSfx,
    playMail3dModelHoverSfx,
    playPongBallHitsUserSfx,
    playPongBallHitsWallSfx,
    playPongGamewinloseSfx,
    playMapClickSfx,
    stopMapClickSfx
  };

  window.addEventListener('procockpit3dready', e => {
    if (e.detail && e.detail.mode === 'fallback') {
      try {
        initProScrollHtmlFallback();
      } catch (_err) {}
    }
  });
  window.addEventListener('procockpit3dready', bootPro, { once: true });
  setTimeout(bootPro, 5000);
})();
