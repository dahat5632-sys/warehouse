/* BIO: Cockpit layout, rendering, and interaction note. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const PRO_MOBILE_JS_SLICE_BUDGET_MS = 48;
const THREE_BASIS_TRANSCODER_PATH = 'https://unpkg.com/three@0.170.0/examples/jsm/libs/basis/';

function detectProMobileViewport() {
  if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return false;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const narrow = matchMedia('(max-width: 820px)').matches;
  const ua = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  return coarse || (narrow && ua);
}
const IS_PRO_MOBILE_VIEWPORT = detectProMobileViewport();

/** BIO: Mobil ba艧lang谋莽 鈥?a臒谋r JS bloklar谋 aras谋nda requestIdleCallback / setTimeout ile nefes. */
async function yieldProMobileStartupSlice() {
  if (!IS_PRO_MOBILE_VIEWPORT) return;
  await new Promise(resolve => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout: Math.max(50, PRO_MOBILE_JS_SLICE_BUDGET_MS) });
      return;
    }
    setTimeout(resolve, 0);
  });
}

/** BIO: KTX2 yan yol: ayn谋 g枚reli yol i莽in .webp 鈫?.ktx2 */
function _proHrefToMobKtx2(webpHref) {
  let u = typeof webpHref === 'string' ? webpHref : '';
  u = u.replace(/\.webp([?#].*)?$/i, '.ktx2$1');
  if (!u.toLowerCase().endsWith('.ktx2')) return null;
  return u;
}

/** BIO: Mobil Offscreen Worker ge莽i艧i i莽in canvas meta (transferControl 莽a臒r谋lmadan). */
function annotateProMobThreeCanvasForOffscreen(rendererInstance) {
  if (!IS_PRO_MOBILE_VIEWPORT || !rendererInstance?.domElement) return;
  const el = rendererInstance.domElement;
  const canXfer = typeof el.transferControlToOffscreen === 'function';
  /* BIO: Renderer kurulumu gelecek Worker + OffscreenCanvas ile hizal谋; alpha desktop ile ayr谋lm谋艧t谋r. */
  try {
    el.dataset.bgsThreeOffsurfaceReady = canXfer ? '1' : '0';
    el.dataset.bgsThreeContextFlags = JSON.stringify({
      alpha: false,
      antialias: !IS_PRO_MOBILE_VIEWPORT,
      powerPreference: 'high-performance'
    });
  } catch (_) { /* BIO: k眉莽眉k hedefli 鈥?atla */ }
}

/** BIO: Mobil Pro 鈥?dynamic DPR tavan谋 1.2; masa眉st眉 max 2. */
function proMobilePerfRendererDpr() {
  if (typeof window === 'undefined') return 1;
  const dpr = window.devicePixelRatio || 1;
  if (IS_PRO_MOBILE_VIEWPORT) {
    return Math.min(Math.max(dpr, 1), 1.2);
  }
  return Math.min(dpr, 2);
}

const COCKPIT_GLB_DESKTOP_URL = new URL(
  '../assets/pro/cockpit/cockpit-optimized.glb',
  import.meta.url
).href;
const COCKPIT_GLB_MOBILE_URL = new URL(
  '../assets/pro/cockpit/cockpit-mobile.glb',
  import.meta.url
).href;
const GLB_URL = IS_PRO_MOBILE_VIEWPORT ? COCKPIT_GLB_MOBILE_URL : COCKPIT_GLB_DESKTOP_URL;

/** BIO: Mobil Pro 鈥?alt gezegen GLB (-mobile; gltf-transform optimize, meshopt + WebP). Kokpit ile ayn谋 枚r眉nt眉. */
function proSubPlanetGlbHref(optimizedRelative) {
  const rel =
    IS_PRO_MOBILE_VIEWPORT && optimizedRelative.includes('-optimized.glb')
      ? optimizedRelative.replace('-optimized.glb', '-mobile.glb')
      : optimizedRelative;
  return new URL(rel, import.meta.url).href;
}

const ABOUT_ME_TEXTURE_URL = new URL(
  '../assets/pro/aboutme/aboutme-texture.webp',
  import.meta.url
).href;
const MY_PROJECTS_TEXTURE_URL = new URL(
  '../assets/pro/my-projects/my-projects-texture.webp',
  import.meta.url
).href;
const MY_HOBBIES_TEXTURE_URL = new URL(
  '../assets/pro/hobbies/hobbies-texture.webp',
  import.meta.url
).href;
const SKILLS_INTERESTS_TEXTURE_URL = new URL(
  '../assets/pro/skills-interests/skillsinterests-texture.webp',
  import.meta.url
).href;
const CONTACT_TEXTURE_URL = new URL(
  '../assets/pro/contact/contact-texture.webp',
  import.meta.url
).href;
/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_STICKER_LOGO_URL = new URL(
  '../assets/pro/common/BIO-LOGO-NOBG.webp',
  import.meta.url
).href;
const COCKPIT_STICKER_FROG_URL = new URL('../assets/pro/common/frog.webp', import.meta.url).href;
const COCKPIT_STICKER_ORPETRON_SOTD_URL = new URL(
  '../assets/pro/OrpetronSOTM.png',
  import.meta.url
).href;
/* BIO: Orpetron 鈥淪ite of the Day鈥?write-up 鈥?opens in a new tab when the decal is clicked. */
const COCKPIT_ORPETRON_SOTD_PAGE_URL = new URL(
  '../assets/pro/common/orpetron-award-photo.jpg',
  import.meta.url
).href;
const COCKPIT_STICKER_DESIGN_NOMINEES_URL = new URL(
  '../assets/pro/design-nominees.png',
  import.meta.url
).href;
const COCKPIT_STICKER_AWWWARDS_NOMINEE_URL = new URL(
  '../assets/default/awwwards-nominee-defaultmode.png',
  import.meta.url
).href;
/* BIO: Design Nominees Site of the Day 鈥?opens in a new tab when the decal is clicked. */
const COCKPIT_DESIGN_NOMINEES_PAGE_URL = new URL(
  '../assets/pro/common/design-nominees-reward-photo.jpg',
  import.meta.url
).href;
/* BIO: Awwwards Nominee 鈥?opens in a new tab when the decal is clicked. */
const COCKPIT_AWWWARDS_NOMINEE_PAGE_URL = new URL(
  '../assets/pro/common/awwwards-award-photo.png',
  import.meta.url
).href;
/* BIO: Pilot ID card portrait on About Me sub-planet (CSS3D panel). */
const PRO_BIO_PILOT_PORTRAIT_URL = new URL(
  '../assets/default/common/bilal2.webp',
  import.meta.url
).href;
/* BIO: Planet layout, label, and interaction note. */
const PRO_ABOUT_SUB_TEXTURE_URL = {
  edu: new URL('../assets/pro/aboutme/subnode-education-texture.webp', import.meta.url).href,
  exp: new URL('../assets/pro/aboutme/subnode-experience-texture.webp', import.meta.url).href,
  bio: new URL('../assets/pro/aboutme/subnode-aboutme-texture.webp', import.meta.url).href
};
/* BIO: Implementation note for this section. */
const PRO_ABOUT_UNIVERSITY_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/aboutme/university-optimized.glb'
);
/* BIO: Planet layout, label, and interaction note. */
const PRO_HOBBIES_SHOOTING_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/hobbies/shooting-optimized.glb'
);
const PRO_HOBBIES_BASKETBALL_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/hobbies/hitem3d-figure.glb'
);
/* BIO: Planet layout, label, and interaction note. */
const PRO_CONTACT_MAIL_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/contact/mail-optimized.glb'
);
const PRO_CONTACT_LINKEDIN_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/contact/linkedin-optimized.glb'
);
const PRO_CONTACT_GITHUB_GLB_URL = proSubPlanetGlbHref(
  '../assets/pro/contact/github-optimized.glb'
);
/* BIO: Planet layout, label, and interaction note. */
const PRO_PROJECTS_SUB_TEXTURE_URL = {
  web: new URL('../assets/pro/my-projects/subnode-cybersecurity.webp', import.meta.url).href,
  mob: new URL('../assets/pro/my-projects/subnode-ai.webp', import.meta.url).href,
  back: new URL('../assets/pro/my-projects/subnode-mixed.webp', import.meta.url).href
};
/* BIO: Planet layout, label, and interaction note. */
const PRO_HOBBIES_SUB_TEXTURE_URL = {
  esp: new URL('../assets/pro/hobbies/subnode-esport.webp', import.meta.url).href,
  sht: new URL('../assets/pro/hobbies/subnode-shooting.webp', import.meta.url).href,
  tec: new URL('../assets/pro/hobbies/subnode-tech.webp', import.meta.url).href,
  trv: new URL('../assets/pro/hobbies/subnode-travel.webp', import.meta.url).href
};
/* BIO: Planet layout, label, and interaction note. */
const PRO_PHOTO_WALL_URLS = {
  shtP1: new URL('../assets/default/hobbies/shooting.webp', import.meta.url).href,
  shtP2: new URL('../assets/default/hobbies/shooting2.webp', import.meta.url).href,
  espP1: new URL('../assets/default/hobbies/espor.webp', import.meta.url).href,
  espP2: new URL('../assets/default/hobbies/espor3.webp', import.meta.url).href
};
/* BIO: Planet layout, label, and interaction note. */
const PRO_SKILLS_SUB_TEXTURE_URL = {
  ai: new URL('../assets/pro/skills-interests/subnode-ai.webp', import.meta.url).href,
  sec: new URL('../assets/pro/skills-interests/subnode-cybersecurity.webp', import.meta.url).href
};
/* BIO: Planet layout, label, and interaction note. */
const PRO_CONTACT_SUB_TEXTURE_URL = {
  mail: new URL('../assets/pro/contact/subnode-email.webp', import.meta.url).href,
  soc: new URL('../assets/pro/contact/subnode-social.webp', import.meta.url).href
};

/* BIO: UFO transition configuration note. */
const UFO_GLB_URL = new URL('../assets/pro/common/ufo-optimized.glb', import.meta.url).href;
/* BIO: Cockpit layout, rendering, and interaction note. */
const UFO_CONFIG = {
  /* BIO: UFO transition configuration note. */
  enabled: !IS_PRO_MOBILE_VIEWPORT,

  /* BIO: UFO transition configuration note. */
  previewMode: false,
  /* BIO: Implementation note for this section. */
  previewPos: { right: 0, up: 0.2, forward: 3.5 },

  /* BIO: Implementation note for this section. */
  /* BIO: Implementation note for this section. */
  intervalSec: 60,
  /* BIO: Implementation note for this section. */
  flightDurationSec: 4.5,
  /* BIO: Implementation note for this section. */
  initialDelaySec: 5.0,

  /* BIO: UFO transition configuration note. */
  forwardDistMul: 3.5,
  upOffsetMul: 0.2,
  sideSpreadMul: 5.5,
  /* BIO: Implementation note for this section. */
  posOffset: { right: 0, up: 0, forward: 0 },

  /* BIO: Implementation note for this section. */
  /* BIO: UFO transition configuration note. */
  scaleMul: 1.2,

  /* BIO: Implementation note for this section. */
  rot: { x: 0, y: 0, z: 0 },

  /* BIO: Implementation note for this section. */
  /* BIO: Implementation note for this section. */
  wobbleAmp: 0.0,
  /* BIO: Implementation note for this section. */
  wobbleFreq: 0.6,
  /* BIO: Implementation note for this section. */
  fadeEdgeSec: 0.4
};

/* BIO: UFO transition configuration note. */
const SHOOTING_STAR_CONFIG = {
  enabled: !IS_PRO_MOBILE_VIEWPORT,
  /* BIO: Implementation note for this section. */
  /* BIO: Scroll and navigation behavior note. */
  intervalSec: 23,
  /* BIO: Scroll and navigation behavior note. */
  durationSec: 1.1,
  /* BIO: Scroll and navigation behavior note. */
  initialDelaySec: 10,
  /* BIO: Implementation note for this section. */
  /* BIO: Implementation note for this section. */
  forwardDistMul: 22,
  /* BIO: Implementation note for this section. */
  spawnSpreadMul: 12,
  /* BIO: Implementation note for this section. */
  spawnBiasRight: 0.55,
  spawnBiasUp: 0.55,
  /* BIO: Scroll and navigation behavior note. */
  travelMul: 16,
  /* BIO: Implementation note for this section. */
  lengthMul: 2.8,
  /* BIO: Implementation note for this section. */
  angleMinRad: Math.PI + 0.25,  // BIO: ~194掳
  angleMaxRad: Math.PI + 1.10,  // BIO: ~243掳
  /* BIO: Implementation note for this section. */
  /* BIO: Implementation note for this section. */
  segments: 32,
  /* BIO: Implementation note for this section. */
  headColor: [1.0, 1.0, 1.1],
  /* BIO: Implementation note for this section. */
  fadeEdgeFrac: 0.18
};

const LOOK_SMOOTH = 0.08;
/** BIO: Mobil merkez-kilidi a莽谋kken curYaw/curPitch merkeze daha h谋zl谋 yak谋ns谋n. */
const LOOK_SMOOTH_CENTER_LOCK = 0.2;
/* BIO: Implementation note for this section. */
const MAX_YAW = 0.74;
const MAX_PITCH = 0.28;
/* BIO: Model offset after bbox centering (x/y/z in world units after maxDim scaling where noted). */
const MODEL_EXTRA_OFFSET = new THREE.Vector3(0, 0, 0);
/* BIO: Cockpit layout, rendering, and interaction note. */
const CAMERA_SIDE_FRAC = 0.2;
/* BIO: Implementation note for this section. */
const CAMERA_EYE_FRAC = -0.055;
const CAMERA_SHIFT_Z_FRAC = 0;
/* BIO: Implementation note for this section. */
const LOOK_DEPTH_FRAC = 1.8;
/* BIO: cockpit-mobile.glb daha kompakt; kameray谋 sahneye (negatif X) yakla艧t谋r谋p hologram metinleri kadrajda tut. */
const PRO_MOBILE_CAMERA_FORWARD_FRAC = 0.05;

/* BIO: Implementation note for this section. */
const RENDER_EXPOSURE = 1.35;
/* BIO: Implementation note for this section. */
const CLEAR_COLOR = 0x000000;
/* BIO: WebGL canvas accessibility 鈥?keyed by document.documentElement lang (ISO 639-1). */
const COCKPIT_CANVAS_ARIA_BY_LANG = {
  tr: '脺莽 boyutlu kokpit g枚r眉n眉m眉. Metin 枚zeti sayfan谋n ba艧谋nda.',
  en: 'Three-dimensional cockpit view. A text summary is at the start of the page.',
  de: 'Dreidimensionale Cockpit-Ansicht. Eine Textzusammenfassung steht am Seitenanfang.'
};
const AMBIENT_INTENSITY = 0.58;
const HEMI_SKY = 0xd8e8ff;
const HEMI_GROUND = 0x2a3048;
const HEMI_INTENSITY = 1.45;
const DIR_MAIN_INTENSITY = 1.2;
const DIR_FILL_INTENSITY = 0.62;

const LANG_CANVAS = { w: 256, h: 128 };

/* BIO: Cockpit layout, rendering, and interaction note. */
const LANG_BRAND = '#00F5FF';
const LANG_BRAND_MUTED = 'rgba(0,245,255,0.5)';
const LANG_BRAND_FILL = 'rgba(0,245,255,0.18)';
/* BIO: Cockpit layout, rendering, and interaction note. */
const LANG_BG = 'rgba(22,46,58,0.68)';
/* BIO: Implementation note for this section. */
const LANG_BG_TOP = 'rgba(36,74,92,0.72)';
const LANG_BG_BOT = 'rgba(10,22,30,0.78)';
/* BIO: Implementation note for this section. */
const LANG_RADIUS_PX = 14;

/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_UI_THEMES = {
  default: {
    brand: '#00F5FF',
    brandRgb: '0,245,255',
    fill: 'rgba(0,245,255,0.18)',
    bgTop: 'rgba(36,74,92,0.72)',
    bgBot: 'rgba(10,22,30,0.78)',
    innerTop: 'rgba(200,240,255,0.14)',
    innerBot: 'rgba(0,20,30,0.18)',
    strokeShadow: 'rgba(0,245,255,0.4)',
    haloRgb: '0,245,255',
    textBright: 'rgba(160,248,255',
    textHi: 'rgba(230, 255, 255, 0.98)',
    textSoft: 'rgba(210, 235, 245, 0.9)',
    textClock: 'rgba(160, 255, 255, 0.97)',
    hoverMidR: [60, 100],
    hoverMidG: [245, 8],
    hoverMidB: [255, 0],
    hoverStrokeR: [40, 80],
    hoverStrokeG: [245, 8],
    hoverStrokeB: [255, 0]
  },
  about: {
    brand: '#ed6300',
    brandRgb: '237,99,0',
    fill: 'rgba(237,99,0,0.22)',
    bgTop: 'rgba(92,48,18,0.72)',
    bgBot: 'rgba(28,14,6,0.82)',
    innerTop: 'rgba(255,210,170,0.16)',
    innerBot: 'rgba(30,12,0,0.22)',
    strokeShadow: 'rgba(237,99,0,0.45)',
    haloRgb: '237,99,0',
    textBright: 'rgba(255,200,150',
    textHi: 'rgba(255,230,205,0.98)',
    textSoft: 'rgba(245,215,190,0.9)',
    textClock: 'rgba(255,210,175,0.97)',
    hoverMidR: [237, 18],
    hoverMidG: [130, 80],
    hoverMidB: [30, 60],
    hoverStrokeR: [237, 18],
    hoverStrokeG: [115, 80],
    hoverStrokeB: [20, 60]
  },
  projects: {
    brand: '#e93383',
    brandRgb: '233,51,131',
    fill: 'rgba(233,51,131,0.24)',
    bgTop: 'rgba(80, 22, 48, 0.72)',
    bgBot: 'rgba(20, 6, 16, 0.82)',
    innerTop: 'rgba(255, 180, 220, 0.16)',
    innerBot: 'rgba(40, 8, 24, 0.22)',
    strokeShadow: 'rgba(233, 51, 131, 0.5)',
    haloRgb: '233,51,131',
    textBright: 'rgba(255, 190, 220',
    textHi: 'rgba(255, 220, 235, 0.98)',
    textSoft: 'rgba(250, 200, 225, 0.9)',
    textClock: 'rgba(255, 200, 230, 0.97)',
    hoverMidR: [220, 35],
    hoverMidG: [60, 100],
    hoverMidB: [140, 50],
    hoverStrokeR: [220, 35],
    hoverStrokeG: [50, 100],
    hoverStrokeB: [130, 50]
  },
  hobbies: {
    brand: '#99dfac',
    brandRgb: '153,223,172',
    fill: 'rgba(153,223,172,0.24)',
    bgTop: 'rgba(20, 48, 36, 0.72)',
    bgBot: 'rgba(6, 22, 16, 0.82)',
    innerTop: 'rgba(200, 255, 220, 0.16)',
    innerBot: 'rgba(8, 40, 28, 0.22)',
    strokeShadow: 'rgba(100, 200, 150, 0.45)',
    haloRgb: '100,200,150',
    textBright: 'rgba(210, 255, 225',
    textHi: 'rgba(220, 255, 235, 0.98)',
    textSoft: 'rgba(200, 250, 215, 0.9)',
    textClock: 'rgba(200, 255, 220, 0.97)',
    hoverMidR: [80, 40],
    hoverMidG: [220, 100],
    hoverMidB: [140, 50],
    hoverStrokeR: [70, 40],
    hoverStrokeG: [210, 100],
    hoverStrokeB: [130, 50]
  },
  skills: {
    brand: '#c70fcd',
    brandRgb: '199,15,205',
    fill: 'rgba(199,15,205,0.22)',
    bgTop: 'rgba(48, 16, 52, 0.72)',
    bgBot: 'rgba(18, 6, 22, 0.82)',
    innerTop: 'rgba(255, 200, 255, 0.16)',
    innerBot: 'rgba(40, 8, 44, 0.22)',
    strokeShadow: 'rgba(199, 15, 205, 0.5)',
    haloRgb: '199,15,205',
    textBright: 'rgba(255, 200, 255',
    textHi: 'rgba(255, 230, 255, 0.98)',
    textSoft: 'rgba(240, 200, 250, 0.9)',
    textClock: 'rgba(250, 210, 255, 0.97)',
    hoverMidR: [220, 40],
    hoverMidG: [40, 100],
    hoverMidB: [200, 50],
    hoverStrokeR: [210, 40],
    hoverStrokeG: [35, 100],
    hoverStrokeB: [190, 50]
  },
  contact: {
    /* BIO: Default Mode integration note. */
    brand: '#ffee00',
    brandRgb: '255,238,0',
    fill: 'rgba(255,238,0,0.22)',
    bgTop: 'rgba(46, 42, 6, 0.72)',
    bgBot: 'rgba(14, 12, 0, 0.84)',
    innerTop: 'rgba(255, 255, 200, 0.18)',
    innerBot: 'rgba(48, 44, 8, 0.26)',
    strokeShadow: 'rgba(255, 238, 0, 0.55)',
    haloRgb: '255,238,0',
    textBright: 'rgba(255, 255, 200',
    textHi: 'rgba(255, 255, 230, 0.98)',
    textSoft: 'rgba(245, 240, 160, 0.9)',
    textClock: 'rgba(255, 252, 200, 0.97)',
    hoverMidR: [255, 100],
    hoverMidG: [250, 120],
    hoverMidB: [0, 50],
    hoverStrokeR: [255, 100],
    hoverStrokeG: [240, 110],
    hoverStrokeB: [0, 45]
  }
};
let _cockpitUiThemeId = 'default';
function getCockpitUiTheme() {
  return COCKPIT_UI_THEMES[_cockpitUiThemeId] || COCKPIT_UI_THEMES.default;
}
function setCockpitUiThemeId(id) {
  const next = COCKPIT_UI_THEMES[id] ? id : 'default';
  if (next === _cockpitUiThemeId) return;
  _cockpitUiThemeId = next;
  syncAllCockpitThemedCanvases();
}
function syncAllCockpitThemedCanvases() {
  try { syncLangButtonTextures(); } catch (_) {}
  try { syncToolbarTextures(); } catch (_) {}
  try { syncVolPanelTexture(); } catch (_) {}
  try { syncClockTexture(); } catch (_) {}
  try { syncAboutBackTexture(); } catch (_) {}
  try { syncBioLogoStickerTint(); } catch (_) {}
  try { syncPongInviteTexture(); } catch (_) {}
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function syncBioLogoStickerTint() {
  if (!_cockpitBioLogoDecalMesh || !_cockpitBioLogoDecalMesh.material) {
    return;
  }
  const m = _cockpitBioLogoDecalMesh.material;
  if (!_cockpitUiThemeId || _cockpitUiThemeId === 'default') {
    m.color.set(0xffffff);
    return;
  }
  const th = COCKPIT_UI_THEMES[_cockpitUiThemeId] || COCKPIT_UI_THEMES.default;
  m.color.set(th && th.brand ? th.brand : 0xffffff);
}

/* BIO: Implementation note for this section. */
const COCKPIT_LANG_SCREENS = {
  en: { x: -0.061, y: 0.12, z: -0.175 },
  de: { x: 0.006, y: 0.108, z: -0.175 }
};

/* BIO: Implementation note for this section. */
const COCKPIT_LANG_PLANE = { w: 0.060, h: 0.024 };
/* BIO: Implementation note for this section. */
const COCKPIT_LANG_PLANE_ROT = { x: 0, y: 0.1, z: -0.1 };

/* BIO: Map overlay behavior and interaction note. */
const COCKPIT_TOOLBAR_SCREENS = {
  default: { x: -0.13, y: -0.14, z: -0.176 },
  map: { x: -0.04, y: -0.14, z: -0.21 }
};
/** BIO: Mobil 鈥?MAP ile DEFAULT kokpit ekseninde x鈥檈 g枚re tam kar艧谋 y眉zeye (ayn谋 y/z). */
function toolbarScreenPosition(actionId) {
  if (
    IS_PRO_MOBILE_VIEWPORT &&
    actionId === 'map' &&
    COCKPIT_TOOLBAR_SCREENS.default
  ) {
    const d = COCKPIT_TOOLBAR_SCREENS.default;
    return { x: -0.12, y: -0.14, z: 0.176 };
  }
  return COCKPIT_TOOLBAR_SCREENS[actionId];
}
/* BIO: Implementation note for this section. */
const TOOLBAR_PLANE = { w: 0.088, h: 0.036 };
const TOOLBAR_CANVAS = { w: 500, h: 112 };
const COCKPIT_TOOLBAR_PLANE_ROT = { x: 0, y: 0.55, z: -0.1 };
/** BIO: Mobil toolbar rotasyonu 鈥?sadece de臒i艧ecek eksenleri yaz谋n; kalanlar谋 COCKPIT_TOOLBAR_PLANE_ROT ile birle艧tirilir (Three.js Euler, rad). */
const COCKPIT_TOOLBAR_PLANE_ROT_MOBILE_BY_ACTION = {
  // 脰rnek: kar艧谋 taraftaki Map d眉zlemi i莽in 枚nce y鈥檡i negatifle deneyin: map: { y: -0.55 }
  // default: { y: 0.5 },
  map: { x: 0, y: -3.55, z: 0 }
};
function toolbarPlaneRotationEuler(actionId) {
  const base = COCKPIT_TOOLBAR_PLANE_ROT;
  if (!IS_PRO_MOBILE_VIEWPORT) return base;
  const ov = COCKPIT_TOOLBAR_PLANE_ROT_MOBILE_BY_ACTION[actionId];
  if (!ov || typeof ov !== 'object') return base;
  return {
    x: ov.x != null ? ov.x : base.x,
    y: ov.y != null ? ov.y : base.y,
    z: ov.z != null ? ov.z : base.z
  };
}
let _toolbarUiBound = false;

/* BIO: Cockpit layout, rendering, and interaction note. */
/* BIO: Cockpit layout, rendering, and interaction note. */
let pongInviteLabelText = 'Can you beat the alien?';
let _pongInviteLangListener = false;
const COCKPIT_PONG_INVITE_SCREEN = { x: 0.1, y: -0.05, z: -0.25 };
const COCKPIT_PONG_INVITE_PLANE = { w: 0.096, h: 0.054 };
const COCKPIT_PONG_INVITE_ROT = { x: 0, y: 0.5, z: 0 };
const PONG_INVITE_CANVAS = { w: 560, h: 240 };

/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_STICKER_DECALS = {
  logo: {
    pos: { x: -0.07, y: -0.1, z: -0.24 },
    rot: { x: 0.5, y: 0.52, z: -0.11 },
    widthMul: 0.088
  },
  frog: {
    pos: { x: -0.04, y: -0.09, z: 0.25},
    rot: { x: 0, y: 2.7, z: 0 },
    widthMul: 0.05
  },
  /* 鈹€鈹€ Pro Mode: Orpetron 3D 莽谋kartma 鈥?COCKPIT_STICKER_DECALS.orpetronSotd
   *  pos.x  鈫?sol (鈭? / sa臒 (+)   |  pos.y  鈫?a艧a臒谋 (鈭? / yukar谋 (+)
   *  pos.z  鈫?arkaya (鈭? / 枚ne (+) |  rot    鈫?radyan (y 鈮?2.7 = panele d枚n眉k)
   *  widthMul 鈫?BOYUT (k眉莽眉lt = daha k眉莽眉k rozet; maxDim ile 莽arp谋l谋r) */
  orpetronSotd: {
    pos: { x: -0.11, y: -0.085, z: 0.21 },
    rot: { x: 0, y: 2.7, z: 0 },
    widthMul: 0.06
  },
  /* 鈹€鈹€ Pro Mode: Awwwards Nominee 鈥?Orpetron鈥檜n 脺ST脺; COCKPIT_STICKER_DECALS.awwwardsNominee
   *  pos.y art谋r (枚r. 鈭?.04) = yukar谋 | widthMul = rozet geni艧li臒i */
  awwwardsNominee: {
    pos: { x: -0.11, y: 0.01, z: 0.215 },
    rot: { x: 0, y: 2.8, z: 0 },
    widthMul: 0.02
  },
  /* BIO: frog + Orpetron aras谋 眉st panel 鈥?pos/rot/widthMul ile ince ayar. */
  designNominees: {
    pos: { x: -0.062, y: -0.04, z: 0.215 },
    rot: { x: 0, y: 2.9, z: 0 },
    widthMul: 0.03
  }
};
let _cockpitStickerDecalMeshes = [];
/* BIO: Planet layout, label, and interaction note. */
let _cockpitBioLogoDecalMesh = null;
/* BIO: Implementation note for this section. */
let _cockpitFrogDecalMesh = null;
let _cockpitOrpetronSotdDecalMesh = null;
let _cockpitAwwwardsNomineeDecalMesh = null;
let _cockpitDesignNomineesDecalMesh = null;
let _frogStickerHintEl = null;

/* BIO: Language control and localization note. */
const COCKPIT_ABOUT_BACK = {
  screen: { x: -0.165, y: -0.125, z: 0},
  rot: { x: 0, y: 1.55, z: 0 },
  plane: { w: 0.085, h: 0.034 },
  canvas: { w: 500, h: 112 },
  epsYMul: 0.0006
};

/* BIO: Planet layout, label, and interaction note. */
const COCKPIT_PRO_ABOUT_SUB = {
  screens: {
    edu: { x: -0.4, y: 0, z: 0.2 },
    bio: { x: -0.3, y: 0, z: 0 },
    exp: { x: -0.4, y: 0, z: -0.2 }
  },
  /* BIO: Implementation note for this section. */
  order: ['edu', 'bio', 'exp'],
  planetRadiusMul: 0.092 * 0.48,
  label: {
    w: 0.14,
    h: 0.035,
    yMul: 1.7
  }
};

/* BIO: Pro Mode integration note. */
const COCKPIT_PRO_PROJECTS_SUB = {
  screens: {
    web: { x: -0.4, y: 0, z: 0.2 },
    mob: { x: -0.3, y: 0, z: 0 },
    back: { x: -0.4, y: 0, z: -0.2 }
  },
  order: ['web', 'mob', 'back'],
  planetRadiusMul: 0.092 * 0.48,
  label: {
    w: 0.14,
    h: 0.035,
    yMul: 1.7
  }
};

/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_PRO_HOBBIES_SUB = {
  screens: {
    /* BIO: Implementation note for this section. */
    esp: { x: -0.3, y: 0, z: -0.06 },
    /* BIO: Implementation note for this section. */
    sht: { x: -0.3, y: 0, z: 0.065 },
    /* BIO: Implementation note for this section. */
    tec: { x: -0.36, y: 0, z: -0.2 },
    /* BIO: Implementation note for this section. */
    trv: { x: -0.36, y: 0, z: 0.2 }
  },
  order: ['esp', 'sht', 'tec', 'trv'],
  /* BIO: Planet layout, label, and interaction note. */
  planetRadiusMul: 0.092 * 0.48,
  /* BIO: Implementation note for this section. */
  label: {
    w: 0.14,
    h: 0.035,
    yMul: 1.7
  }
};

/* BIO: Planet layout, label, and interaction note. */
const COCKPIT_PRO_PAIR_SUB_SCREENS = {
  first: { x: -0.25, y: 0, z: 0.075 },
  second: { x: -0.25, y: 0, z: -0.075 }
};

/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_PRO_SKILLS_SUB = {
  screens: {
    /* BIO: Implementation note for this section. */
    ai: COCKPIT_PRO_PAIR_SUB_SCREENS.first,
    /* BIO: Implementation note for this section. */
    sec: COCKPIT_PRO_PAIR_SUB_SCREENS.second
  },
  order: ['ai', 'sec'],
  planetRadiusMul: 0.092 * 0.48,
  label: {
    w: 0.14,
    h: 0.035,
    yMul: 1.7
  }
};

/* BIO: Cockpit layout, rendering, and interaction note. */
const COCKPIT_PRO_CONTACT_SUB = {
  screens: {
    mail: COCKPIT_PRO_PAIR_SUB_SCREENS.first,
    soc: COCKPIT_PRO_PAIR_SUB_SCREENS.second
  },
  order: ['mail', 'soc'],
  planetRadiusMul: 0.092 * 0.48,
  label: {
    w: 0.14,
    h: 0.035,
    yMul: 1.7
  }
};

let renderer;
/* BIO: Mobil KTX2 yolu + masa眉st眉 TextureLoader i莽in ortak y眉kleme. */
let _proMobileKtx2Loader = null;
const _proSharedTextureLoader = new THREE.TextureLoader();

function finalizeProRgbTexture(tex) {
  if (!tex) return;
  if ('colorSpace' in tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  if (tex.isCompressedTexture === true) {
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
  } else {
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
  }
  if (typeof renderer !== 'undefined' && renderer?.capabilities?.getMaxAnisotropy) {
    const a = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);
    if (tex.isCompressedTexture === true || !tex.generateMipmaps) {
      tex.anisotropy = Math.min(tex.anisotropy || a, a);
    } else {
      tex.anisotropy = a;
    }
  }
}

function ensureProMobileKtx2Loader() {
  if (!IS_PRO_MOBILE_VIEWPORT || !renderer) return null;
  if (_proMobileKtx2Loader) return _proMobileKtx2Loader;
  try {
    const ktx = new KTX2Loader();
    ktx.setTranscoderPath(THREE_BASIS_TRANSCODER_PATH);
    ktx.detectSupport(renderer);
    _proMobileKtx2Loader = ktx;
    return _proMobileKtx2Loader;
  } catch (_e) {
    return null;
  }
}

/** BIO: Mobil: her renk dokusu 枚nce .ktx2 (ayn谋 g枚reli yol); 404 ise WebP decode. */
function loadProRgbTexturePreferKtx2(assetHref, onLoaded, onProgress, onError) {
  const apply = tex => {
    finalizeProRgbTexture(tex);
    onLoaded(tex);
  };
  const fallback = () =>
    _proSharedTextureLoader.load(assetHref, apply, onProgress, () => {
      if (typeof onError === 'function') {
        try {
          onError();
        } catch (_e3) {}
      }
    });

  const kUrl = IS_PRO_MOBILE_VIEWPORT ? _proHrefToMobKtx2(assetHref) : null;
  if (!IS_PRO_MOBILE_VIEWPORT || !kUrl) {
    fallback();
    return;
  }
  const ktxLoader = ensureProMobileKtx2Loader();
  if (!ktxLoader) {
    fallback();
    return;
  }
  ktxLoader.load(
    kUrl,
    apply,
    onProgress,
    () => fallback()
  );
}

let scene;
let camera;
let pivot;
/* BIO: Hologram panel behavior and rendering note. */
let css3dRenderer = null;
/* BIO: Implementation note for this section. */
let _proSceneMaxDim = 1;
let targetYaw = 0;
let targetPitch = 0;
let curYaw = 0;
let curPitch = 0;
let _proGyroLookActive = false;
let _proMobileCenterLookLock = false;
let _gyroBannerInjected = false;
let _centerLookLangListenerBound = false;
let _gyroDoEListener = false;
let _gyroNeutralDeg = null;
let _gyroFilteredDeg = null;
const GYRO_REL_DEG_SMOOTH = 0.18;
/* BIO: Derece basina kokpit yaw kazanci; ~1 s枚n眉k, ~2.85 ile yaklasik 14鈥?5 derece tilt MAX_YAW civari. */
const GYRO_YAW_SENS = 2.95;
let _proScrollTouchBound = false;
let _tsSwipeId = null;
let _tsSwipeLastY = 0;
let _tsSwipeAccum = 0;
let _tsSwipeEligible = false;
let _landscapeGateInjected = false;
let _landscapeGateWatchHandler = null;
let _gyroLastSnapAngle = null;
let _gyroOrientNeutralResetBound = false;
/* BIO: Implementation note for this section. */
let starFieldPoints = null;
let _animPrevT = 0;
let proScrollGroup = null;
let proScrollData = null;
let proScrollT = 0;
let proScrollTTarget = 0;
const proPlanetPickables = [];
let aboutLabelText = 'ABOUT ME';
let projectsLabelText = 'MY PROJECTS';
let hobbiesLabelText = 'HOBBIES';
let skillsLabelText = 'SKILLS & INTERESTS';
let contactLabelText = 'CONTACT';
let aboutLabelSprite = null;
let projectsLabelSprite = null;
let hobbiesLabelSprite = null;
let skillsLabelSprite = null;
let contactLabelSprite = null;
let aboutMePlanetMesh = null;
let myProjectsPlanetMesh = null;
let hobbiesPlanetMesh = null;
let skillsPlanetMesh = null;
let contactPlanetMesh = null;
let proScrollAboutOff = null;
let proScrollProjectsOff = null;
let proScrollHobbiesOff = null;
let proScrollSkillsOff = null;
let proScrollContactOff = null;
let _proScrollWheelBound = false;
let _proScrollWelcomeListenerBound = false;

/* BIO: Planet layout, label, and interaction note. */
let aboutDiveGroup = null;     /* BIO: Implementation note for this section. */
let aboutMainShell = null;     /* BIO: Planet layout, label, and interaction note. */
let aboutSubRoot = null;       /* BIO: Planet layout, label, and interaction note. */
const proAboutSubGroups = [];  /* BIO: [{group, mesh, labelSprite, subId, targetPos, delay}] */
const proAboutSubPickMeshes = [];
const proAboutSubLabelSprites = [];
const proAboutSubLabelTexts = { edu: 'Education', exp: 'Experience', bio: 'About Me' };
let aboutBackMesh = null;
let aboutBackLabelText = '鈼?GO BACK';
/* BIO: Planet layout, label, and interaction note. */
let proAboutMode = 'idle';
let proAboutAnim = { t: 0, duration: 0.55 };
let proAboutScrollLocked = false;
/* BIO: Planet layout, label, and interaction note. */
let projectsDiveGroup = null;
let projectsMainShell = null;
let projectsSubRoot = null;
const proProjectsSubGroups = [];
const proProjectsSubLabelSprites = [];
const proProjectsSubLabelTexts = {
  web: 'Cyber Security',
  mob: 'Artificial Intelligence',
  back: 'Mixed Projects'
};
let proProjectsMode = 'idle';
let proProjectsAnim = { t: 0, duration: 0.55 };
let proProjectsScrollLocked = false;
let _proProjectsHoverTarget = null;
/* BIO: Pro Mode integration note. */
const _proProjectsHoverPink = new THREE.Color(0xfb378d);
/* BIO: Pro Mode integration note. */
let hobbiesDiveGroup = null;
let hobbiesMainShell = null;
let hobbiesSubRoot = null;
const proHobbiesSubGroups = [];
const proHobbiesSubLabelSprites = [];
/* BIO: Default Mode integration note. */
const proHobbiesSubLabelTexts = {
  esp: 'E-Sports',
  sht: 'Basketball',
  tec: 'Tech Trends',
  trv: 'Travel'
};
let proHobbiesMode = 'idle';
let proHobbiesAnim = { t: 0, duration: 0.55 };
let proHobbiesScrollLocked = false;
let _proHobbiesHoverTarget = null;
const _proHobbiesHoverHi = new THREE.Color(0x55ee99);
/* BIO: Implementation note for this section. */
let skillsDiveGroup = null;
let skillsMainShell = null;
let skillsSubRoot = null;
const proSkillsSubGroups = [];
const proSkillsSubLabelSprites = [];
const proSkillsSubLabelTexts = {
  ai: '浜哄伐鏅鸿兘',
  sec: 'Cyber Security'
};
let proSkillsMode = 'idle';
let proSkillsAnim = { t: 0, duration: 0.55 };
let proSkillsScrollLocked = false;
let _proSkillsHoverTarget = null;
const _proSkillsHoverHi = new THREE.Color(0xff55ff);
/* BIO: Implementation note for this section. */
let contactDiveGroup = null;
let contactMainShell = null;
let contactSubRoot = null;
const proContactSubGroups = [];
const proContactSubLabelSprites = [];
const proContactSubLabelTexts = { mail: 'E-mail', soc: 'Social Media' };
let proContactMode = 'idle';
let proContactAnim = { t: 0, duration: 0.55 };
let proContactScrollLocked = false;
let _proContactHoverTarget = null;
const _proContactHoverHi = new THREE.Color(0xffffaa);
/* BIO: Planet layout, label, and interaction note. */
const PRO_CONTACT_SPIN = {
  duration: 0.5,
  turns: 1.0,
  axis: 'z'
};
/* BIO: Planet layout, label, and interaction note. */
const PRO_ABOUT_DIVE_BONUS = 3.2;
/* BIO: Planet layout, label, and interaction note. */
const PRO_ABOUT_HOVER_SMOOTH = 14;
/* BIO: Implementation note for this section. */
const PRO_ABOUT_MAIN_HOVER_SCALE = 0.11;
const PRO_ABOUT_SUB_HOVER_SCALE = 0.055;
const _proAboutHoverOrange = new THREE.Color(0xff7722);
/* BIO: Pro Mode integration note. */
let _proAboutHoverTarget = null;
/* BIO: Planet layout, label, and interaction note. */
let _prevPlanetHoverSfxKey = null;
const _plProj = new THREE.Vector3();
/* BIO: Planet layout, label, and interaction note. */
const PRO_SCROLL_LERP = 0.085;
/* BIO: Implementation note for this section. */
const PRO_SCROLL_WHEEL_STEP = 0.02;
/* BIO: Planet layout, label, and interaction note. */
const PRO_SCROLL_T_ABOUT_CENTER = 0.1;
const PRO_SCROLL_T_PROJECTS_CENTER = 0.3;
const PRO_SCROLL_T_HOBBIES_CENTER = 0.5;
const PRO_SCROLL_T_SKILLS_CENTER = 0.7;
const PRO_SCROLL_T_CONTACT_CENTER = 0.9;
const PRO_SCROLL_OFF_LEFT = 2;
/* BIO: Planet layout, label, and interaction note. */
const PRO_SCROLL_LABEL_SWAP_AP = 0.2;
const PRO_SCROLL_LABEL_SWAP_PH = 0.4;
const PRO_SCROLL_LABEL_SWAP_HS = 0.6;
const PRO_SCROLL_LABEL_SWAP_SC = 0.8;
/* BIO: Planet layout, label, and interaction note. */
const PRO_SCROLL_SNAP_DELAY_MS = 1400;
const PRO_SCROLL_CENTERS = [
  PRO_SCROLL_T_ABOUT_CENTER,
  PRO_SCROLL_T_PROJECTS_CENTER,
  PRO_SCROLL_T_HOBBIES_CENTER,
  PRO_SCROLL_T_SKILLS_CENTER,
  PRO_SCROLL_T_CONTACT_CENTER
];

const MAIN_PLANET_SCROLL_T = {
  about: PRO_SCROLL_T_ABOUT_CENTER,
  projects: PRO_SCROLL_T_PROJECTS_CENTER,
  hobbies: PRO_SCROLL_T_HOBBIES_CENTER,
  skills: PRO_SCROLL_T_SKILLS_CENTER,
  contact: PRO_SCROLL_T_CONTACT_CENTER
};

/* BIO: Map overlay behavior and interaction note. */
function scrollCarouselToMainPlanet(id) {
  if (!proScrollGroup || !proScrollData) return;
  const targetMod = MAIN_PLANET_SCROLL_T[id];
  if (targetMod === undefined) return;
  const cur = proScrollT;
  const base = Math.floor(cur);
  const candidates = [base - 1 + targetMod, base + targetMod, base + 1 + targetMod];
  let best = candidates[1];
  let bestAbs = Math.abs(candidates[1] - cur);
  for (let i = 0; i < candidates.length; i += 1) {
    const a = Math.abs(candidates[i] - cur);
    if (a < bestAbs) {
      bestAbs = a;
      best = candidates[i];
    }
  }
  proScrollTTarget = best;
  _proScrollLastWheelT = 0;
  _proScrollSnapDone = true;
  _proScrollPlanetsUnlocked = true;
}

/* BIO: Map overlay behavior and interaction note. */
function getCarouselMainPlanetIndex() {
  if (!proScrollGroup || !proScrollData) return 0;
  const t = proScrollMod1(proScrollT);
  let bestI = 0;
  let bestD = Infinity;
  for (let i = 0; i < PRO_SCROLL_CENTERS.length; i += 1) {
    const c = PRO_SCROLL_CENTERS[i];
    const diff = Math.abs(t - c);
    const d = Math.min(diff, 1 - diff);
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return bestI;
}

let _proScrollLastWheelT = 0;
let _proScrollSnapDone = false;
/* BIO: Planet layout, label, and interaction note. */
let _proScrollPlanetsUnlocked = false;
/* BIO: Planet layout, label, and interaction note. */
const ABOUT_PLANET_COLOR = 0xed6300;
const ABOUT_PLANET_EMISSIVE = 0x803010;
/* BIO: Implementation note for this section. */
function buildAboutMePlanet3D(r) {
  const model = new THREE.Group();
  const segs = 72;
  const coreGeo = new THREE.SphereGeometry(r, segs, segs);
  const pos = coreGeo.attributes.position;
  const v = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    p.copy(v).normalize();
    const t =
      0.1 * Math.sin(p.x * 6.2 + p.y * 3.1) * Math.cos(p.z * 5.4 + 0.4) +
      0.06 * Math.sin(p.y * 9.0 + 1.7) * Math.sin(p.x * 4.0) +
      0.045 * Math.sin(p.z * 12.0) +
      0.028 * (Math.sin((p.x + p.y) * 14) + Math.cos((p.y + p.z) * 11));
    const s = 1 + t * 0.55;
    v.copy(p).multiplyScalar(r * s);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  coreGeo.computeVertexNormals();

  const coreMat = new THREE.MeshStandardMaterial({
    color: ABOUT_PLANET_COLOR,
    emissive: ABOUT_PLANET_EMISSIVE,
    emissiveIntensity: 0.4,
    metalness: 0.1,
    roughness: 0.52
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.name = 'aboutMeCore';
  core.castShadow = false;
  core.receiveShadow = false;
  core.userData.proPlanetId = 'about';
  coreMat.userData._hoverBaseE = new THREE.Color().copy(coreMat.emissive);
  coreMat.userData._hoverBaseEi = coreMat.emissiveIntensity;
  model.add(core);

  return model;
}

/* BIO: Map overlay behavior and interaction note. */
function applyAboutMePlanetTexture(aboutGroup) {
  if (!aboutGroup) return;
  loadProRgbTexturePreferKtx2(
    ABOUT_ME_TEXTURE_URL,
    tex => {
      if (!aboutGroup.parent) {
        tex.dispose();
        return;
      }
      const core = aboutGroup.getObjectByName('aboutMeCore');
      if (!core || !core.isMesh || !core.material) {
        tex.dispose();
        return;
      }
      const mat = core.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x402010);
      mat.emissiveIntensity = 0.24;
      mat.metalness = 0.08;
      mat.roughness = 0.48;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

const MY_PROJECTS_COLOR = 0xff006e;
const MY_PROJECTS_EMISSIVE = 0x990044;
/* BIO: Planet layout, label, and interaction note. */
function buildMyProjectsPlanet3D(r) {
  const model = new THREE.Group();
  const geo = new THREE.SphereGeometry(r, 64, 64);
  const mat = new THREE.MeshStandardMaterial({
    color: MY_PROJECTS_COLOR,
    emissive: MY_PROJECTS_EMISSIVE,
    emissiveIntensity: 0.22,
    metalness: 0.1,
    roughness: 0.5
  });
  const m = new THREE.Mesh(geo, mat);
  m.name = 'myProjectsCore';
  m.userData.proPlanetId = 'projects';
  mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
  mat.userData._hoverBaseEi = mat.emissiveIntensity;
  model.add(m);
  model.name = 'myProjectsPlanet';
  model.userData.proPlanetId = 'projects';
  return model;
}

/* BIO: Map overlay behavior and interaction note. */
function applyMyProjectsPlanetTexture(projectsGroup) {
  if (!projectsGroup) return;
  loadProRgbTexturePreferKtx2(
    MY_PROJECTS_TEXTURE_URL,
    tex => {
      if (!projectsGroup.parent) {
        tex.dispose();
        return;
      }
      const core = projectsGroup.getObjectByName('myProjectsCore');
      if (!core || !core.isMesh || !core.material) {
        tex.dispose();
        return;
      }
      const mat = core.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x220010);
      mat.emissiveIntensity = 0.1;
      mat.metalness = 0.06;
      mat.roughness = 0.58;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {
      /* BIO: Implementation note for this section. */
    }
  );
}

const HOBBIES_PLANET_COLOR = 0x00ed7e;
const HOBBIES_PLANET_EMISSIVE = 0x006040;
/* BIO: Implementation note for this section. */
function buildHobbiesGeoidPlanet3D(r) {
  const model = new THREE.Group();
  const segs = 64;
  const coreGeo = new THREE.SphereGeometry(r, segs, segs);
  const pos = coreGeo.attributes.position;
  const v = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    p.copy(v).normalize();
    const y2 = p.y * p.y;
    const bulge = 0.045 * (1 - y2);
    const und =
      0.02 * Math.sin(p.x * 5.2 + p.y * 3.1) * Math.cos(p.z * 4.2 + 0.3) +
      0.012 * Math.sin(p.y * 8.5);
    const s = 1 + bulge + und;
    v.copy(p).multiplyScalar(r * s);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  coreGeo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: HOBBIES_PLANET_COLOR,
    emissive: HOBBIES_PLANET_EMISSIVE,
    emissiveIntensity: 0.2,
    metalness: 0.08,
    roughness: 0.55
  });
  const m = new THREE.Mesh(coreGeo, mat);
  m.name = 'hobbiesCore';
  m.userData.proPlanetId = 'hobbies';
  mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
  mat.userData._hoverBaseEi = mat.emissiveIntensity;
  model.add(m);
  model.name = 'hobbiesPlanet';
  model.userData.proPlanetId = 'hobbies';
  return model;
}

function applyHobbiesPlanetTexture(hobbiesGroup) {
  if (!hobbiesGroup) return;
  loadProRgbTexturePreferKtx2(
    MY_HOBBIES_TEXTURE_URL,
    tex => {
      if (!hobbiesGroup.parent) {
        tex.dispose();
        return;
      }
      const core = hobbiesGroup.getObjectByName('hobbiesCore');
      if (!core || !core.isMesh || !core.material) {
        tex.dispose();
        return;
      }
      const mat = core.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x001810);
      mat.emissiveIntensity = 0.09;
      mat.metalness = 0.05;
      mat.roughness = 0.6;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

const HOBBIES_SUB_GEOIT_COLOR = 0x99dfac;
const HOBBIES_SUB_GEOIT_EMISSIVE = 0x304838;
/* BIO: Planet layout, label, and interaction note. */
function buildHobbiesSubGeoidPlanet3D(r, subId) {
  const segs = 64;
  const coreGeo = new THREE.SphereGeometry(r, segs, segs);
  const pos = coreGeo.attributes.position;
  const v = new THREE.Vector3();
  const p = new THREE.Vector3();
  const sOff =
    subId === 'esp' ? 0.0 : subId === 'sht' ? 2.1 : subId === 'tec' ? 4.2 : 6.3;
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    p.copy(v).normalize();
    const y2 = p.y * p.y;
    const bulge = 0.045 * (1 - y2);
    const und =
      0.02 *
        Math.sin(p.x * 5.2 + sOff + p.y * 3.1) *
        Math.cos(p.z * 4.2 + 0.3 + sOff * 0.2) +
      0.012 * Math.sin(p.y * 8.5 + sOff);
    const s = 1 + bulge + und;
    v.copy(p).multiplyScalar(r * s);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  coreGeo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: HOBBIES_SUB_GEOIT_COLOR,
    emissive: HOBBIES_SUB_GEOIT_EMISSIVE,
    emissiveIntensity: 0.2,
    metalness: 0.08,
    roughness: 0.55
  });
  mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
  mat.userData._hoverBaseEi = mat.emissiveIntensity;
  const m = new THREE.Mesh(coreGeo, mat);
  m.name = 'hobbiesSubCore_' + subId;
  m.userData.proPlanetId = 'hobbies';
  m.userData.proSubId = subId;
  return m;
}

function applyHobbiesSubPlanetTexture(mesh) {
  if (!mesh || !mesh.userData.proSubId) return;
  const url = PRO_HOBBIES_SUB_TEXTURE_URL[mesh.userData.proSubId];
  if (!url) return;
  loadProRgbTexturePreferKtx2(
    url,
    tex => {
      if (!mesh.parent) {
        tex.dispose();
        return;
      }
      if (!mesh.isMesh || !mesh.material) {
        tex.dispose();
        return;
      }
      const mat = mesh.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x102818);
      mat.emissiveIntensity = 0.12;
      mat.metalness = 0.08;
      mat.roughness = 0.5;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

const SKILLS_PLANET_COLOR = 0xbf00ff;
const SKILLS_PLANET_EMISSIVE = 0x4a0088;
const SKILLS_RING_EMISSIVE = 0x5522aa;

/* BIO: Planet layout, label, and interaction note. */
function createSkillsSaturnRingRadialTexture() {
  const w = 4;
  const h = 1024;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) {
    return null;
  }
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1);
    const fine = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 36);
    const med = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 9);
    const wide = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2.2);
    let a = 0.14 + 0.9 * (0.35 * fine + 0.25 * med + 0.2 * wide);
    a *= 0.5 + 0.5 * t;
    if (t > 0.34 && t < 0.4) a *= 0.05;
    if (t > 0.5 && t < 0.56) a *= 0.08;
    if (t > 0.73 && t < 0.78) a *= 0.07;
    a = Math.min(1, Math.max(0, a));
    const br = 0.45 + 0.55 * fine;
    const r = Math.floor(150 + 105 * br);
    const g = Math.floor(80 + 120 * med);
    const b = Math.floor(235 + 20 * wide);
    for (let x = 0; x < w; x += 1) {
      const j = (y * w + x) * 4;
      d[j] = r;
      d[j + 1] = g;
      d[j + 2] = b;
      d[j + 3] = Math.floor(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  if ('colorSpace' in tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

/* BIO: Implementation note for this section. */
function createSkillsSubSaturnRingRadialTexture() {
  const w = 4;
  const h = 1024;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) {
    return null;
  }
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1);
    const fine = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 36);
    const med = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 9);
    const wide = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2.2);
    let a = 0.14 + 0.9 * (0.35 * fine + 0.25 * med + 0.2 * wide);
    a *= 0.5 + 0.5 * t;
    if (t > 0.34 && t < 0.4) a *= 0.05;
    if (t > 0.5 && t < 0.56) a *= 0.08;
    if (t > 0.73 && t < 0.78) a *= 0.07;
    a = Math.min(1, Math.max(0, a));
    const br = 0.45 + 0.55 * fine;
    const r0 = 199;
    const g0 = 15;
    const b0 = 205;
    const r = Math.floor(r0 * (0.5 + 0.5 * br) + 40 * med);
    const gch = Math.floor(g0 + 80 * br + 50 * med);
    const bch = Math.floor(b0 * (0.6 + 0.4 * wide) + 30 * med);
    for (let x = 0; x < w; x += 1) {
      const j = (y * w + x) * 4;
      d[j] = Math.min(255, r);
      d[j + 1] = Math.min(255, gch);
      d[j + 2] = Math.min(255, bch);
      d[j + 3] = Math.floor(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  if ('colorSpace' in tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

const SKILLS_SUB_PLANET_COLOR = 0xc70fcd;
const SKILLS_SUB_PLANET_EMISSIVE = 0x580868;
const SKILLS_SUB_RING_EMISSIVE = 0x680088;

/* BIO: Planet layout, label, and interaction note. */
function buildSkillsSaturnPlanet3D(r) {
  const model = new THREE.Group();
  const coreGeo = new THREE.SphereGeometry(r, 64, 64);
  const coreMat = new THREE.MeshStandardMaterial({
    color: SKILLS_PLANET_COLOR,
    emissive: SKILLS_PLANET_EMISSIVE,
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.5
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.name = 'skillsCore';
  core.userData.proPlanetId = 'skills';
  coreMat.userData._hoverBaseE = new THREE.Color().copy(coreMat.emissive);
  coreMat.userData._hoverBaseEi = coreMat.emissiveIntensity;
  model.add(core);

  const inner = r * 1.1;
  const outer = r * 2.1;
  const ringGeo = new THREE.RingGeometry(inner, outer, 256, 1);
  const ringMap = createSkillsSaturnRingRadialTexture();
  const ringMat = new THREE.MeshStandardMaterial(
    ringMap
      ? {
          color: 0xffffff,
          emissive: SKILLS_RING_EMISSIVE,
          emissiveIntensity: 0.24,
          map: ringMap,
          metalness: 0.16,
          roughness: 0.55,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        }
      : {
          color: 0xd8b0ff,
          emissive: SKILLS_RING_EMISSIVE,
          emissiveIntensity: 0.3,
          metalness: 0.1,
          roughness: 0.45,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
          depthWrite: false
        }
  );
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.name = 'skillsRing';
  ring.position.y = 0;
  ring.rotation.x = Math.PI / 2;
  ring.rotation.z = 0.11;
  ring.renderOrder = 1;
  model.add(ring);

  model.name = 'skillsPlanet';
  model.userData.proPlanetId = 'skills';
  return model;
}

/* BIO: Planet layout, label, and interaction note. */
function buildSkillsSubSaturnPlanet3D(r, subId) {
  const model = new THREE.Group();
  const sRot = subId === 'ai' ? 0.0 : 0.19;
  const coreGeo = new THREE.SphereGeometry(r, 64, 64);
  const coreMat = new THREE.MeshStandardMaterial({
    color: SKILLS_SUB_PLANET_COLOR,
    emissive: SKILLS_SUB_PLANET_EMISSIVE,
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.5
  });
  coreMat.userData._hoverBaseE = new THREE.Color().copy(coreMat.emissive);
  coreMat.userData._hoverBaseEi = coreMat.emissiveIntensity;
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.name = 'skillsSubCore_' + subId;
  core.userData.proPlanetId = 'skills';
  core.userData.proSubId = subId;
  model.add(core);

  const inner = r * 1.1;
  const outer = r * 2.1;
  const ringGeo = new THREE.RingGeometry(inner, outer, 256, 1);
  const ringMap = createSkillsSubSaturnRingRadialTexture();
  const ringMat = new THREE.MeshStandardMaterial(
    ringMap
      ? {
          color: 0xffffff,
          emissive: SKILLS_SUB_RING_EMISSIVE,
          emissiveIntensity: 0.24,
          map: ringMap,
          metalness: 0.16,
          roughness: 0.55,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        }
      : {
          color: 0xc70fcd,
          emissive: SKILLS_SUB_RING_EMISSIVE,
          emissiveIntensity: 0.3,
          metalness: 0.1,
          roughness: 0.45,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
          depthWrite: false
        }
  );
  ringMat.userData._hoverBaseE = new THREE.Color().copy(ringMat.emissive);
  ringMat.userData._hoverBaseEi = ringMat.emissiveIntensity;
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.name = 'skillsSubRing_' + subId;
  ring.userData.proPlanetId = 'skills';
  ring.userData.proSubId = subId;
  ring.position.y = 0;
  ring.rotation.x = Math.PI / 2;
  ring.rotation.z = 0.11 + sRot;
  ring.renderOrder = 1;
  model.add(ring);

  model.name = 'skillsSubPlanet_' + subId;
  return model;
}

function applySkillsSubPlanetTexture(skillsSubGroup) {
  if (!skillsSubGroup || !skillsSubGroup.userData || !skillsSubGroup.userData._subId) return;
  const sid = skillsSubGroup.userData._subId;
  const url = PRO_SKILLS_SUB_TEXTURE_URL[sid];
  if (!url) return;
  loadProRgbTexturePreferKtx2(
    url,
    tex => {
      if (!skillsSubGroup.parent) {
        tex.dispose();
        return;
      }
      const core = skillsSubGroup.getObjectByName('skillsSubCore_' + sid);
      if (!core || !core.isMesh || !core.material) {
        tex.dispose();
        return;
      }
      const mat = core.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x280030);
      mat.emissiveIntensity = 0.11;
      mat.metalness = 0.08;
      mat.roughness = 0.52;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

function applySkillsPlanetTexture(skillsGroup) {
  if (!skillsGroup) return;
  loadProRgbTexturePreferKtx2(
    SKILLS_INTERESTS_TEXTURE_URL,
    tex => {
      if (!skillsGroup.parent) {
        tex.dispose();
        return;
      }
      const core = skillsGroup.getObjectByName('skillsCore');
      if (!core || !core.isMesh || !core.material) {
        tex.dispose();
        return;
      }
      const mat = core.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x1a0028);
      mat.emissiveIntensity = 0.1;
      mat.metalness = 0.08;
      mat.roughness = 0.55;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

/* BIO: Default Mode integration note. */
const CONTACT_TORUS_COLOR = 0xffee00;
const CONTACT_TORUS_EMISSIVE = 0x7a6600;
/* BIO: Implementation note for this section. */
function buildContactTorusPlanet3D(r) {
  const model = new THREE.Group();
  const R = r * 0.66;
  const tube = r * 0.25;
  const torusGeo = new THREE.TorusGeometry(R, tube, 22, 88);
  const torusMat = new THREE.MeshStandardMaterial({
    color: CONTACT_TORUS_COLOR,
    emissive: CONTACT_TORUS_EMISSIVE,
    emissiveIntensity: 0.28,
    metalness: 0.1,
    roughness: 0.42,
    side: THREE.DoubleSide
  });
  torusMat.userData._hoverBaseE = new THREE.Color().copy(torusMat.emissive);
  torusMat.userData._hoverBaseEi = torusMat.emissiveIntensity;
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.name = 'contactTorus';
  torus.userData.proPlanetId = 'contact';
  torus.rotation.set(0, -Math.PI / 2, 0);
  model.add(torus);
  model.name = 'contactPlanet';
  model.userData.proPlanetId = 'contact';
  /* BIO: Implementation note for this section. */
  model.userData._innerHoleRadius = Math.max(0, R - tube);
  return model;
}

/* BIO: Default Mode integration note. */
function buildContactSubTorusPlanet3D(r, subId) {
  const model = new THREE.Group();
  const R = r * 0.66;
  const tube = r * 0.25;
  const tRot = subId === 'mail' ? 0.0 : 0.22;
  const torusGeo = new THREE.TorusGeometry(R, tube, 22, 88);
  const torusMat = new THREE.MeshStandardMaterial({
    color: CONTACT_TORUS_COLOR,
    emissive: CONTACT_TORUS_EMISSIVE,
    emissiveIntensity: 0.28,
    metalness: 0.1,
    roughness: 0.42,
    side: THREE.DoubleSide
  });
  torusMat.userData._hoverBaseE = new THREE.Color().copy(torusMat.emissive);
  torusMat.userData._hoverBaseEi = torusMat.emissiveIntensity;
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.name = 'contactSubTorus_' + subId;
  torus.userData.proPlanetId = 'contact';
  torus.userData.proSubId = subId;
  torus.rotation.set(0, -Math.PI / 2 + tRot, 0);
  model.add(torus);
  model.name = 'contactSubPlanet_' + subId;
  model.userData._subId = subId;
  return model;
}

function applyContactSubPlanetTexture(contactSubGroup) {
  if (!contactSubGroup || !contactSubGroup.userData || !contactSubGroup.userData._subId) return;
  const sid = contactSubGroup.userData._subId;
  const url = PRO_CONTACT_SUB_TEXTURE_URL[sid];
  if (!url) return;
  loadProRgbTexturePreferKtx2(
    url,
    tex => {
      if (!contactSubGroup.parent) {
        tex.dispose();
        return;
      }
      const tor = contactSubGroup.getObjectByName('contactSubTorus_' + sid);
      if (!tor || !tor.isMesh || !tor.material) {
        tex.dispose();
        return;
      }
      const mat = tor.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x5c4e00);
      mat.emissiveIntensity = 0.18;
      mat.metalness = 0.08;
      mat.roughness = 0.5;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

function applyContactPlanetTexture(contactGroup) {
  if (!contactGroup) return;
  loadProRgbTexturePreferKtx2(
    CONTACT_TEXTURE_URL,
    tex => {
      if (!contactGroup.parent) {
        tex.dispose();
        return;
      }
      const tor = contactGroup.getObjectByName('contactTorus');
      if (!tor || !tor.isMesh || !tor.material) {
        tex.dispose();
        return;
      }
      const mat = tor.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x5c4e00);
      mat.emissiveIntensity = 0.18;
      mat.metalness = 0.08;
      mat.roughness = 0.5;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}
const _starFwd = new THREE.Vector3();
const _starRight = new THREE.Vector3();
const _starUp = new THREE.Vector3();
const _starTmp = new THREE.Vector3();
const _starToCam = new THREE.Vector3();
/* BIO: Implementation note for this section. */
const STAR_DRIFT = 0.55;
const STAR_RESPAWN_NEAR_FRAC = 0.2;

const _camFwd = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _worldUp = new THREE.Vector3(0, 1, 0);
const _qYaw = new THREE.Quaternion();
const _qPitch = new THREE.Quaternion();
const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
/** BIO: Decal-alpha raycasts 鈥?Mesh.prototype kullan谋m谋na ge莽ici sonu莽 alan谋 (ay谋rma yap谋lm谋yor). */
const _stickerPickRayTmp = [];

/* BIO: Implementation note for this section. */
let _cockpitUiHoverObject = null;
const COCKPIT_UI_HOVER_SMOOTH = 0.2;
const COCKPIT_UI_HOVER_SMOOTH_REDUCED = 0.35;
/* BIO: Implementation note for this section. */
const UI_HOVER_T_CANVAS = 0.9;
/* BIO: Implementation note for this section. */
const COCKPIT_UI_HOVER_SCALE = 0.1;
const COCKPIT_UI_HOVER_Z_FRAC = 0.1;

/* BIO: Cockpit layout, rendering, and interaction note. */
/* BIO: Cockpit layout, rendering, and interaction note. */
const VOL_SLIDER_UI = { w: 600, h: 64 };
const volSliderLayouts = {
  icon: { x: 4, y: 6, w: 40, h: 52 },
  blocks: { x: 52, y: 6, w: 426, h: 52 },
  pct: { x: 490, y: 8, w: 102, h: 48 }
};

const COCKPIT_VOL_SLIDER_SCREEN = { x: -0.055, y: 0.115, z: 0.17 };
const COCKPIT_VOL_SLIDER_PLANE = { w: 0.118, h: 0.0126 };
const COCKPIT_VOL_SLIDER_ROT = { x: 0, y: 2.8, z: -0.05 };

const VOL_PLAYER_UI = { w: 620, h: 130 };
/* BIO: Implementation note for this section. */
const volPlayerLayouts = {
  prev: { x: 346, y: 8, w: 66, h: 50 },
  play: { x: 434, y: 5, w: 84, h: 54 },
  next: { x: 540, y: 8, w: 66, h: 50 },
  progress: { x: 6, y: 72, w: 608, h: 22 }
};

const COCKPIT_VOL_PLAYER_SCREEN = { x: -0.08, y: -0.145, z: 0.196 };
const COCKPIT_VOL_PLAYER_PLANE = { w: 0.124, h: 0.05 };
const COCKPIT_VOL_PLAYER_ROT = { x: 0, y: 2.6, z: 0.06 };

/* BIO: Cockpit layout, rendering, and interaction note. */
const CLOCK_UI = { w: 480, h: 100 };
const COCKPIT_CLOCK_SCREEN = { x: -0.18, y: 0.15, z: 0 };
const COCKPIT_CLOCK_PLANE = { w: 0.12, h: 0.025 };
const COCKPIT_CLOCK_ROT = { x: 0, y: 1.55, z: 0 };

/* BIO: Cockpit layout, rendering, and interaction note. */
const WELCOME_LOGO_URL = new URL('../assets/pro/common/BIO-LOGO-NOBG.webp', import.meta.url).href;
const WELCOME_CANVAS_SHIFT_Y = 0.08;
/* BIO: Implementation note for this section. */
const WELCOME_LOGO_MAX_W_FRAC = 0.9;
const WELCOME_LOGO_MAX_H_FRAC = 0.6;
const WELCOME_LOGO_TEXT_ANCHOR_FRAC = 0.86;
const COCKPIT_WELCOME_SCREEN = { x: -0.15, y: 0, z: 0 };
const COCKPIT_WELCOME_PLANE = { w: 0.55, h: 0.23 };
const COCKPIT_WELCOME_ROT = { x: 0, y: 1.6, z: 0 };
const WELCOME_TITLE_CANVAS = { w: 1900, h: 960 };
/** BIO: Mobil ilk ekran metni 鈥?daha b眉y眉k d眉zlem + daha y眉ksek canvas DPR. */
const WELCOME_TITLE_CANVAS_MOBILE = { w: 1560, h: 1000 };
const WELCOME_MOBILE_PLANE_MUL = { w: 1.26, h: 1.36 };
const WELCOME_FADE_IN_SEC = 1.1;
const WELCOME_FADE_OUT_SEC = 0.65;

let welcomeTitleMesh = null;
let _welcomeStringListener = false;
let _welcomeDismissListener = false;
const welcomeStrings = {
  sub: 'WELCOME TO PRO MODE',
  hint: 'Scroll to rotate',
  hint2: 'Click to planets'
};

let welcomeLogoImg = null;
let _welcomeLogoLoadStarted = false;

function getWelcomeTitleLogicalSize() {
  if (IS_PRO_MOBILE_VIEWPORT) return { ...WELCOME_TITLE_CANVAS_MOBILE };
  return { ...WELCOME_TITLE_CANVAS };
}

function welcomeTitleCanvasPixelRatio() {
  if (!IS_PRO_MOBILE_VIEWPORT) return getCockpitCanvasDpr();
  const r = typeof window !== 'undefined' && window.devicePixelRatio;
  const raw = r && r > 0 ? r : 1.25;
  return Math.min(2, Math.max(1.42, raw));
}

function initWelcomeTitleHiDpiCanvas2d(cnv, ctx, logicalW, logicalH) {
  const dpr = welcomeTitleCanvasPixelRatio();
  cnv.width = Math.round(logicalW * dpr);
  cnv.height = Math.round(logicalH * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = true;
  if (ctx.imageSmoothingQuality !== undefined) ctx.imageSmoothingQuality = 'high';
  return dpr;
}

function ensureWelcomeLogoImage() {
  if (_welcomeLogoLoadStarted) return;
  _welcomeLogoLoadStarted = true;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => requestAnimationFrame(drawWelcomeTitleCanvas2d);
  img.onerror = () => { /* BIO: Implementation note for this section. */ };
  img.src = WELCOME_LOGO_URL;
  welcomeLogoImg = img;
}

/* BIO: Language control and localization note. */
const langButtonMeshes = [];
/* BIO: Map overlay behavior and interaction note. */
const toolbarActionMeshes = [];
/* BIO: Implementation note for this section. */
let pongInviteMesh = null;
const volSliderMeshes = [];
const volPlayerMeshes = [];
/* BIO: Cockpit layout, rendering, and interaction note. */
const clockDisplayMeshes = [];

let _clockIntervalId = null;

function allVolUiMeshes() {
  return volSliderMeshes.concat(volPlayerMeshes);
}

let _vol3dDown = false;
let _vol3dSeek = false;
let _vol3dBlocks = false;
let _vol3dActiveMesh = null;
let _vol3dTapMode = 'none';
let _vol3dTapX = 0;
let _vol3dTapY = 0;
let _vol3dPtrId = -1;
/* BIO: Implementation note for this section. */
let _vol3dTapDownT = 0;
const VOL3D_TAP_MAX_MS = 400;
const _vol3dWorldPt = new THREE.Vector3();
const _vol3dNormal = new THREE.Vector3(0, 0, 1);
const _vol3dQuat = new THREE.Quaternion();
const _vol3dPlane = new THREE.Plane();
let _vol3dEventBound = false;
let _volDisplayListener = false;
let _clockLangListenerBound = false;

let reduceMotion =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

let _langListenerBound = false;
let _langPointerDownBound = false;

function createCockpitUiFaceMaterial(map) {
  return new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    alphaTest: 0.01,
    polygonOffset: true,
    polygonOffsetFactor: -0.2,
    polygonOffsetUnits: -1
  });
}

const COCKPIT_STICKER_PICK_ALPHA_MIN = 34;
/** BIO: KTX s谋k谋艧t谋r谋lm谋艧 doku i莽in raster okunamazsa Orpetron rozet UV鈥檚i (~daire) dar hitbox. */
const COCKPIT_ORPETRON_STICKER_UV_ELLIPSE_R2 = 0.195;

function cockpitStickerUvPickPasses(mesh, hit) {
  const uv = hit.uv;
  if (!uv || !mesh) return true;
  const pick = mesh.userData._stickerPick;
  if (pick && pick.data && pick.w > 1 && pick.h > 1) {
    const x = Math.max(0, Math.min(pick.w - 1, Math.round(uv.x * (pick.w - 1))));
    /* BIO: 眉莽.js UV 鈫?canvas sat谋r s谋ras谋; ters se莽imde hep 艧effaf okunursa uv.y ile de臒i艧tir. */
    const y = Math.max(0, Math.min(pick.h - 1, Math.round((1 - uv.y) * (pick.h - 1))));
    const a = pick.data[y * pick.w * 4 + x * 4 + 3];
    if (a < COCKPIT_STICKER_PICK_ALPHA_MIN) return false;
    return true;
  }
  const r2 = mesh.userData._stickerEllipseR2;
  if (typeof r2 === 'number' && r2 > 0) {
    const du = uv.x - 0.5;
    const dv = uv.y - 0.5;
    return du * du + dv * dv <= r2;
  }
  return true;
}

function cacheCockpitStickerPickRaster(mesh, tex) {
  if (!mesh || !tex || tex.isCompressedTexture === true) return false;
  try {
    const img = tex.image;
    const wRaw = img && (img.naturalWidth || img.width);
    const hRaw = img && (img.naturalHeight || img.height);
    const w = wRaw >= 4 ? Math.min(Math.floor(wRaw), 768) : 0;
    const h = hRaw >= 4 ? Math.min(Math.floor(hRaw), 768) : 0;
    if (!(w >= 4 && h >= 4 && typeof document !== 'undefined')) return false;
    const cav = document.createElement('canvas');
    cav.width = w;
    cav.height = h;
    const cx = cav.getContext('2d', { willReadFrequently: true });
    if (!cx) return false;
    cx.drawImage(img, 0, 0, w, h);
    const im = cx.getImageData(0, 0, w, h);
    mesh.userData._stickerPick = { data: im.data, w, h };
    return true;
  } catch (_e) {
    mesh.userData._stickerPick = null;
    return false;
  }
}

function installCockpitStickerAlphaAwareRaycast(mesh) {
  if (!mesh || typeof mesh.userData !== 'object') return;
  mesh.raycast = function cockpitStickerAlphaRaycast(raycaster, intersects) {
    _stickerPickRayTmp.length = 0;
    THREE.Mesh.prototype.raycast.call(mesh, raycaster, _stickerPickRayTmp);
    if (_stickerPickRayTmp.length === 0) return;
    let best = null;
    for (let i = 0; i < _stickerPickRayTmp.length; i += 1) {
      const hi = _stickerPickRayTmp[i];
      if (hi.object !== mesh) continue;
      if (!cockpitStickerUvPickPasses(mesh, hi)) continue;
      if (!best || hi.distance < best.distance) best = hi;
    }
    if (best) intersects.push(best);
  };
}

function createCockpitWelcomeMaterial(map) {
  return new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    opacity: 0
  });
}

/** BIO: Mobil HUD canvas 鈥?d眉艧眉k DPR ile metin bulan谋kt谋; 1.85 tavan ile denge. */
function getCockpitCanvasDpr() {
  const r = typeof window !== 'undefined' && window.devicePixelRatio;
  const raw = r && r > 0 ? r : 1;
  if (IS_PRO_MOBILE_VIEWPORT) {
    return Math.min(1.85, Math.max(1.2, raw >= 1 ? raw : 1.25));
  }
  return Math.min(2.5, raw > 0 ? raw : 2);
}

const PRO_LABEL_SPRITE_LOGICAL_W = 512;
const PRO_LABEL_SPRITE_LOGICAL_H = 128;

function planetLabelSpriteCanvasDpr() {
  if (!IS_PRO_MOBILE_VIEWPORT) return 1;
  const r = typeof window !== 'undefined' && window.devicePixelRatio;
  const raw = r && r > 0 ? r : 1.25;
  return Math.min(1.85, Math.max(1.25, raw));
}

function bootstrapPlanetLabelCanvas2d(cnv) {
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const dpr = planetLabelSpriteCanvasDpr();
  cnv.width = Math.round(PRO_LABEL_SPRITE_LOGICAL_W * dpr);
  cnv.height = Math.round(PRO_LABEL_SPRITE_LOGICAL_H * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = true;
  if (ctx.imageSmoothingQuality !== undefined) ctx.imageSmoothingQuality = 'high';
}

function initCockpitHiDpiCanvas2d(cnv, ctx, logicalW, logicalH) {
  const dpr = getCockpitCanvasDpr();
  cnv.width = Math.round(logicalW * dpr);
  cnv.height = Math.round(logicalH * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = true;
  if (ctx.imageSmoothingQuality !== undefined) ctx.imageSmoothingQuality = 'high';
  return dpr;
}

function applyCockpitCanvasTextureFilter(map) {
  if (!map) return;
  map.minFilter = THREE.LinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.generateMipmaps = false;
}

function getVolSnapshot() {
  const api = typeof window !== 'undefined' && window.bgsProCockpitApi;
  return api && api.getSnapshot
    ? api.getSnapshot()
    : { vol: 0.7, mainBlocks: 16, iconMute: false, music: { cur: 0, dur: 0, paused: true } };
}

function drawVolSliderCanvas2d(ctx) {
  const W = VOL_SLIDER_UI.w;
  const H = VOL_SLIDER_UI.h;
  const L = volSliderLayouts;
  const snap = getVolSnapshot();
  const th = getCockpitUiTheme();
  const blocksN = snap.mainBlocks || 16;
  const activeB = Math.round(snap.vol * blocksN);
  ctx.clearRect(0, 0, W, H);
  drawCockpitHudPanelBg(ctx, 2, 2, W - 4, H - 4, Math.min(LANG_RADIUS_PX, H * 0.42), {});

  ctx.fillStyle = snap.iconMute ? 'rgba(170, 210, 220, 0.92)' : th.textClock;
  ctx.font = '700 18px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = `rgba(${th.brandRgb},0.65)`;
  ctx.shadowBlur = 5;
  ctx.fillText('音量', L.icon.x + L.icon.w * 0.5, L.icon.y + L.icon.h * 0.5);
  ctx.shadowBlur = 0;

  const b = L.blocks;
  const gap = 2;
  const bw = (b.w - (blocksN - 1) * gap) / blocksN;
  const barMin = 5;
  const barSpan = Math.max(8, b.h - 6);
  for (let i = 0; i < blocksN; i++) {
    const on = i < activeB;
    const x = b.x + i * (bw + gap);
    const tRamp = blocksN > 1 ? i / (blocksN - 1) : 0;
    const bh = barMin + tRamp * (barSpan - barMin);
    const y = b.y + b.h - bh;
    if (on) {
      ctx.fillStyle = i >= blocksN * 0.85 ? `rgba(${th.brandRgb},0.95)` : `rgba(${th.brandRgb},0.72)`;
    } else {
      ctx.fillStyle = `rgba(${th.brandRgb},0.08)`;
    }
    ctx.fillRect(x, y, Math.max(2, bw - 0.5), bh);
    ctx.strokeStyle = on ? `rgba(${th.brandRgb},0.75)` : `rgba(${th.brandRgb},0.2)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, Math.max(2, bw - 0.5), bh);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const pct = Math.round(snap.vol * 100) + '%';
  const pctX = L.pct.x + L.pct.w - 2;
  const pctY = L.pct.y + L.pct.h * 0.5;
  ctx.font = '700 30px "Share Tech Mono",monospace';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 5;
  ctx.fillStyle = th.textHi;
  ctx.fillText(pct, pctX, pctY);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawVolPlayerCanvas2d(ctx) {
  const W = VOL_PLAYER_UI.w;
  const H = VOL_PLAYER_UI.h;
  const L = volPlayerLayouts;
  const snap = getVolSnapshot();
  const th = getCockpitUiTheme();
  ctx.clearRect(0, 0, W, H);
  drawCockpitHudPanelBg(ctx, 3, 3, W - 6, H - 6, LANG_RADIUS_PX, {});

  const drawBtn = r => {
    const rr = Math.min(8, r.h * 0.3);
    cockpitRoundRectPath(ctx, r.x, r.y, r.w, r.h, rr);
    ctx.fillStyle = `rgba(${th.brandRgb},0.16)`;
    ctx.fill();
    cockpitRoundRectPath(ctx, r.x, r.y, r.w, r.h, rr);
    ctx.strokeStyle = `rgba(${th.brandRgb},0.55)`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  };
  drawBtn(L.prev);
  drawBtn(L.play);
  drawBtn(L.next);
  ctx.fillStyle = `rgba(${th.brandRgb},0.85)`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '24px "Segoe UI",sans-serif';
  const cy = L.play.y + L.play.h * 0.5;
  const cyPrev = L.prev.y + L.prev.h * 0.5;
  const cyNext = L.next.y + L.next.h * 0.5;
  ctx.fillText('<<', L.prev.x + L.prev.w * 0.5, cyPrev);
  const playing = snap.music && !snap.music.paused;
  ctx.fillText(playing ? 'II' : '>', L.play.x + L.play.w * 0.5, cy);
  ctx.fillText('>>', L.next.x + L.next.w * 0.5, cyNext);

  const p = L.progress;
  const dur = snap.music.dur;
  const cur = snap.music.cur;
  const r = dur > 0 ? cur / dur : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = `rgba(${th.brandRgb},0.45)`;
  ctx.fillRect(p.x, p.y, p.w * Math.max(0, Math.min(1, r)), p.h);
  ctx.strokeStyle = `rgba(${th.brandRgb},0.3)`;
  ctx.strokeRect(p.x, p.y, p.w, p.h);

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return m + ':' + (sc < 10 ? '0' : '') + sc;
  }
  ctx.textBaseline = 'bottom';
  ctx.font = '600 22px "Share Tech Mono",monospace';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 5;
  ctx.fillStyle = th.textHi;
  const timeY = H - 6;
  ctx.textAlign = 'left';
  ctx.fillText(fmt(cur), 10, timeY);
  ctx.textAlign = 'right';
  ctx.fillText(fmt(dur), W - 10, timeY);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawClockCanvas2d(ctx) {
  const W = CLOCK_UI.w;
  const H = CLOCK_UI.h;
  const now = new Date();
  const th = getCockpitUiTheme();
  ctx.clearRect(0, 0, W, H);
  drawCockpitHudPanelBg(ctx, 3, 3, W - 6, H - 6, LANG_RADIUS_PX, {});
  const loc = getClockIntlLocale();
  const timeStr = now.toLocaleTimeString(loc, {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dateStr = now.toLocaleDateString(loc, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = th.textClock;
  ctx.font = '600 30px "Share Tech Mono",monospace';
  ctx.fillText(timeStr, W * 0.5, H * 0.34);
  ctx.fillStyle = th.textSoft;
  ctx.font = '500 17px "Segoe UI",sans-serif';
  ctx.fillText(dateStr, W * 0.5, H * 0.72);
}

function syncClockTexture() {
  for (const m of clockDisplayMeshes) {
    const d = m.userData;
    if (!d._ctx || !d._map) continue;
    drawClockCanvas2d(d._ctx);
    d._map.needsUpdate = true;
  }
}

function syncVolPanelTexture() {
  for (const m of volSliderMeshes) {
    const d = m.userData;
    if (!d._ctx || !d._map) continue;
    drawVolSliderCanvas2d(d._ctx);
    d._map.needsUpdate = true;
  }
  for (const m of volPlayerMeshes) {
    const d = m.userData;
    if (!d._ctx || !d._map) continue;
    drawVolPlayerCanvas2d(d._ctx);
    d._map.needsUpdate = true;
  }
}

/* BIO: Implementation note for this section. */
function cockpitRoundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w * 0.5, h * 0.5));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/* BIO: Map overlay behavior and interaction note. */
function cockpitHudNotchedPath(ctx, x, y, w, h, radius) {
  const n = Math.max(6, Math.min(radius * 1.15, h * 0.22, w * 0.12));
  ctx.beginPath();
  ctx.moveTo(x + n, y);
  ctx.lineTo(x + w - n, y);
  ctx.lineTo(x + w, y + n);
  ctx.lineTo(x + w, y + h - n);
  ctx.lineTo(x + w - n, y + h);
  ctx.lineTo(x + n, y + h);
  ctx.lineTo(x, y + h - n);
  ctx.lineTo(x, y + n);
  ctx.closePath();
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function drawCockpitHudPanelBg(ctx, x, y, w, h, radius, opts) {
  const o = opts || {};
  const t = Math.min(1, Math.max(0, (o.tHover || 0) * UI_HOVER_T_CANVAS));
  const active = !!o.active;
  const r = Math.max(0, Math.min(radius, w * 0.5, h * 0.5));
  const th = getCockpitUiTheme();
  const path = () => cockpitHudNotchedPath(ctx, x, y, w, h, r);

  ctx.save();
  path();
  ctx.shadowColor = `rgba(${th.haloRgb},${(0.42 + t * 0.2 + (active ? 0.08 : 0)).toFixed(3)})`;
  ctx.shadowBlur = 16 + t * 8 + (active ? 4 : 0);
  ctx.fillStyle = `rgba(${th.haloRgb},0.06)`;
  ctx.fill();
  ctx.restore();

  path();
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, th.bgTop);
  grad.addColorStop(0.55, 'rgba(0,8,14,0.58)');
  grad.addColorStop(1, th.bgBot);
  ctx.fillStyle = grad;
  ctx.fill();

  if (active) {
    path();
    ctx.fillStyle = th.fill;
    ctx.fill();
  }

  ctx.save();
  cockpitHudNotchedPath(ctx, x + 1, y + 1, w - 2, h - 2, Math.max(0, r - 1));
  ctx.clip();
  const igrad = ctx.createLinearGradient(0, y, 0, y + h);
  igrad.addColorStop(0, th.innerTop);
  igrad.addColorStop(0.45, 'rgba(255,255,255,0.00)');
  igrad.addColorStop(1, th.innerBot);
  ctx.fillStyle = igrad;
  ctx.fillRect(x, y, w, h);

  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${th.brandRgb},${(0.09 + t * 0.08).toFixed(3)})`;
  const gridStep = Math.max(10, Math.min(28, h * 0.28));
  for (let yy = y + gridStep; yy < y + h - 4; yy += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x + r * 1.2, yy);
    ctx.lineTo(x + w - r * 1.2, yy);
    ctx.stroke();
  }
  for (let xx = x + gridStep * 1.4; xx < x + w - 4; xx += gridStep * 1.8) {
    ctx.beginPath();
    ctx.moveTo(xx, y + 5);
    ctx.lineTo(xx, y + h - 5);
    ctx.stroke();
  }

  const scanY = y + h * (0.26 + t * 0.42);
  const scan = ctx.createLinearGradient(x, scanY - h * 0.12, x, scanY + h * 0.12);
  scan.addColorStop(0, `rgba(${th.brandRgb},0)`);
  scan.addColorStop(0.5, `rgba(${th.brandRgb},${(0.1 + t * 0.12).toFixed(3)})`);
  scan.addColorStop(1, `rgba(${th.brandRgb},0)`);
  ctx.fillStyle = scan;
  ctx.fillRect(x, scanY - h * 0.12, w, h * 0.24);
  ctx.restore();

  const strokeA = active ? 1 : Math.min(0.95, 0.55 + t * 0.3);
  const strokeStyle = active
    ? t > 0.04
      ? `rgb(${Math.round(th.hoverStrokeR[0] + th.hoverStrokeR[1] * t)}, ${Math.round(th.hoverStrokeG[0] + th.hoverStrokeG[1] * t)}, ${Math.round(th.hoverStrokeB[0] + th.hoverStrokeB[1] * t)})`
      : th.brand
    : `rgba(${th.brandRgb},${strokeA.toFixed(3)})`;
  path();
  ctx.lineWidth = 2 + t * 0.5;
  ctx.strokeStyle = strokeStyle;
  ctx.shadowColor = th.strokeShadow;
  ctx.shadowBlur = 5 + t * 4 + (active ? 2 : 0);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const tick = Math.max(5, Math.min(14, h * 0.16));
  ctx.save();
  ctx.strokeStyle = `rgba(${th.brandRgb},${(0.62 + t * 0.2).toFixed(3)})`;
  ctx.lineWidth = 1.5 + t * 0.6;
  ctx.beginPath();
  /* BIO: Button layout and interaction note. */
  ctx.moveTo(x + tick * 0.9, y + tick * 0.85);
  ctx.lineTo(x + tick * 2.35, y + tick * 0.85);
  ctx.moveTo(x + tick * 0.9, y + tick * 0.85);
  ctx.lineTo(x + tick * 0.9, y + tick * 2.05);
  ctx.moveTo(x + w - tick * 0.9, y + tick * 0.85);
  ctx.lineTo(x + w - tick * 2.35, y + tick * 0.85);
  ctx.moveTo(x + w - tick * 0.9, y + tick * 0.85);
  ctx.lineTo(x + w - tick * 0.9, y + tick * 2.05);
  ctx.moveTo(x + tick * 0.9, y + h - tick * 0.85);
  ctx.lineTo(x + tick * 2.35, y + h - tick * 0.85);
  ctx.moveTo(x + tick * 0.9, y + h - tick * 0.85);
  ctx.lineTo(x + tick * 0.9, y + h - tick * 2.05);
  ctx.moveTo(x + w - tick * 0.9, y + h - tick * 0.85);
  ctx.lineTo(x + w - tick * 2.35, y + h - tick * 0.85);
  ctx.moveTo(x + w - tick * 0.9, y + h - tick * 0.85);
  ctx.lineTo(x + w - tick * 0.9, y + h - tick * 2.05);
  ctx.stroke();
  ctx.strokeStyle = `rgba(${th.haloRgb},${(0.35 + t * 0.2).toFixed(3)})`;
  ctx.beginPath();
  ctx.moveTo(x + 3, y + h * 0.3);
  ctx.lineTo(x + 3, y + h * 0.7);
  ctx.moveTo(x + w - 3, y + h * 0.3);
  ctx.lineTo(x + w - 3, y + h * 0.7);
  ctx.stroke();
  ctx.restore();
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function drawLangButtonCanvas(ctx, w, h, text, active, tHover = 0) {
  const t = Math.min(1, Math.max(0, tHover * UI_HOVER_T_CANVAS));
  const th = getCockpitUiTheme();
  ctx.clearRect(0, 0, w, h);
  const pad = 10;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  drawCockpitHudPanelBg(ctx, pad, pad, innerW, innerH, LANG_RADIUS_PX, {
    active,
    tHover
  });
  const fillA = active ? 1 : Math.min(0.97, 0.7 + t * 0.25);
  const fillStyle = active
    ? t > 0.04
      ? `rgb(${Math.round(th.hoverMidR[0] + th.hoverMidR[1] * t)}, ${Math.round(th.hoverMidG[0] + th.hoverMidG[1] * t)}, ${Math.round(th.hoverMidB[0] + th.hoverMidB[1] * t)})`
      : th.brand
    : `${th.textBright},${fillA.toFixed(3)})`;
  ctx.fillStyle = fillStyle;
  ctx.font = '800 54px "Orbitron","Share Tech Mono","Segoe UI",monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = active
    ? `rgba(${th.brandRgb},0.7)`
    : `rgba(${th.brandRgb},0.45)`;
  ctx.shadowBlur = 5 + 3.5 * t + (active ? 1.5 : 0);
  ctx.fillText(text, w * 0.5, h * 0.52);
  ctx.shadowBlur = 0;
}

/* BIO: Implementation note for this section. */
function drawFittedActionLabel(ctx, w, h, text, isActive, tHover = 0) {
  const t = Math.min(1, Math.max(0, tHover * UI_HOVER_T_CANVAS));
  const th = getCockpitUiTheme();
  ctx.clearRect(0, 0, w, h);
  const pad = 10;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const radius = Math.min(LANG_RADIUS_PX, innerH * 0.4);
  drawCockpitHudPanelBg(ctx, pad, pad, innerW, innerH, radius, {
    active: isActive,
    tHover
  });
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fillA = isActive ? 1 : Math.min(0.97, 0.7 + t * 0.25);
  const fillStyle = isActive
    ? t > 0.04
      ? `rgb(${Math.round(th.hoverMidR[0] + th.hoverMidR[1] * t)}, ${Math.round(th.hoverMidG[0] + th.hoverMidG[1] * t)}, ${Math.round(th.hoverMidB[0] + th.hoverMidB[1] * t)})`
      : th.brand
    : `${th.textBright},${fillA.toFixed(3)})`;
  ctx.fillStyle = fillStyle;
  let best = 20;
  for (let fs = 32; fs >= 10; fs -= 1) {
    ctx.font = `700 ${fs}px "Orbitron","Share Tech Mono","Segoe UI",monospace`;
    if (ctx.measureText(text).width <= innerW * 0.95) {
      best = fs;
      break;
    }
  }
  ctx.font = `700 ${best}px "Orbitron","Share Tech Mono","Segoe UI",monospace`;
  ctx.shadowColor = isActive
    ? `rgba(${th.brandRgb},0.6)`
    : `rgba(${th.brandRgb},0.4)`;
  ctx.shadowBlur = 4 + 3 * t + (isActive ? 1.2 : 0);
  ctx.fillText(text, w * 0.5, h * 0.5);
  ctx.shadowBlur = 0;
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function drawPongInviteCanvas(mesh) {
  if (!mesh || !mesh.userData || !mesh.userData._ctx) return;
  const ctx2 = mesh.userData._ctx;
  const w = PONG_INVITE_CANVAS.w;
  const h = PONG_INVITE_CANVAS.h;
  const tHover =
    mesh.userData._uiHoverF !== undefined ? mesh.userData._uiHoverF || 0 : 0;
  const t = Math.min(1, Math.max(0, tHover * UI_HOVER_T_CANVAS));
  const th = getCockpitUiTheme();
  ctx2.clearRect(0, 0, w, h);
  const pad = 10;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const radius = Math.min(LANG_RADIUS_PX, innerH * 0.38);
  drawCockpitHudPanelBg(ctx2, pad, pad, innerW, innerH, radius, {
    active: false,
    tHover
  });
  const words = String(pongInviteLabelText || '').split(/\s+/);
  let fs = 28;
  let lines = [];
  for (; fs >= 11; fs -= 1) {
    ctx2.font = `700 ${fs}px "Orbitron","Share Tech Mono","Segoe UI",monospace`;
    lines = [];
    let line = '';
    for (let wi = 0; wi < words.length; wi += 1) {
      const test = line ? `${line} ${words[wi]}` : words[wi];
      if (ctx2.measureText(test).width <= innerW * 0.94) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = words[wi];
      }
    }
    if (line) lines.push(line);
    const lineH = fs * 1.28;
    if (lines.length * lineH <= innerH * 0.9) break;
  }
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  const fillA = Math.min(0.97, 0.72 + t * 0.22);
  ctx2.fillStyle = `${th.textBright},${fillA.toFixed(3)})`;
  const lineH = fs * 1.26;
  const startY = h * 0.5 - ((lines.length - 1) * lineH * 0.5);
  ctx2.font = `700 ${fs}px "Orbitron","Share Tech Mono","Segoe UI",monospace`;
  for (let i = 0; i < lines.length; i += 1) {
    ctx2.shadowColor = `rgba(${th.brandRgb},0.42)`;
    ctx2.shadowBlur = 3.5 + 2.5 * t;
    ctx2.fillText(lines[i], w * 0.5, startY + i * lineH);
  }
  ctx2.shadowBlur = 0;
  if (mesh.userData._map) mesh.userData._map.needsUpdate = true;
}

function syncPongInviteTexture() {
  if (pongInviteMesh) drawPongInviteCanvas(pongInviteMesh);
}

let toolbarLabelStrings = {
  modeDefault: 'DEFAULT MODE',
  mapLabel: 'MAP'
};

function syncToolbarTextures() {
  const t = toolbarLabelStrings;
  for (const m of toolbarActionMeshes) {
    const d = m.userData;
    if (!d._ctx || !d.actionId) continue;
    const line = d.actionId === 'default' ? t.modeDefault : t.mapLabel;
    const h = d._uiHoverF != null ? d._uiHoverF : 0;
    drawFittedActionLabel(d._ctx, TOOLBAR_CANVAS.w, TOOLBAR_CANVAS.h, line, false, h);
    if (d._map) d._map.needsUpdate = true;
  }
}

function onProUiStrings(e) {
  const d = e.detail;
  if (!d) return;
  if (d.modeDefault) toolbarLabelStrings.modeDefault = d.modeDefault;
  if (d.mapLabel) toolbarLabelStrings.mapLabel = d.mapLabel;
  requestAnimationFrame(syncToolbarTextures);
}

function getStoredLang() {
  try {
    return localStorage.getItem('bgs_lang') || 'de';
  } catch (_) {
    return 'de';
  }
}

/* BIO: Button layout and interaction note. */
function getClockIntlLocale() {
  const lang = getStoredLang();
  if (lang === 'tr') return 'en-GB';
  if (lang === 'de') return 'zh-CN';
  return 'en-GB';
}

function syncLangButtonTextures() {
  const active = getStoredLang();
  for (const m of langButtonMeshes) {
    const data = m.userData;
    if (!data._ctx) continue;
    const lang = data.lang;
    const up = lang === 'de' ? '中文' : (lang || 'en').toString().toUpperCase();
    const h = data._uiHoverF != null ? data._uiHoverF : 0;
    drawLangButtonCanvas(data._ctx, LANG_CANVAS.w, LANG_CANVAS.h, up, active === lang, h);
    if (data._map) {
      data._map.needsUpdate = true;
    }
  }
}

function isPointerOverChrome(clientX, clientY) {
  const skipHtmlVol = document.body && document.body.classList.contains('cockpit-3d-active');
  const mv = skipHtmlVol ? null : document.getElementById('main-vol');
  const fb = document.getElementById('pro-fallback-chrome');
  for (const el of [mv, fb]) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
      return true;
    }
  }
  return false;
}

function isPointerOverUI(clientX, clientY) {
  if (isPointerOverChrome(clientX, clientY)) return true;
  /* BIO: Audio, SFX, and mini-player behavior note. */
  if (typeof document.elementFromPoint !== 'function') return false;
  const hit = document.elementFromPoint(clientX, clientY);
  if (hit && hit.closest('.pro-lang-fallback')) return true;
  /* BIO: Map overlay behavior and interaction note. */
  if (hit && hit.closest && hit.closest('#pro-map-overlay')) {
    const mo = document.getElementById('pro-map-overlay');
    if (mo && !mo.hasAttribute('hidden')) return true;
  }
  if (hit && hit.closest && hit.closest('#pro-pong-overlay')) {
    const po = document.getElementById('pro-pong-overlay');
    if (po && !po.hasAttribute('hidden')) return true;
  }
  return false;
}

function isPointerOverProMapOpen(clientX, clientY) {
  const el = document.getElementById('pro-map-overlay');
  if (!el || el.hasAttribute('hidden') || typeof document.elementFromPoint !== 'function') {
    return false;
  }
  const hit = document.elementFromPoint(clientX, clientY);
  if (!hit || !hit.closest) return false;
  return !!hit.closest('#pro-map-overlay');
}

/* BIO: Tooltip metinleri 鈥?document.documentElement.lang ile se莽ilir (_proCurrentLang). */
const PRO_COCKPIT_STICKER_HINT_COPY = {
  frog: {
    tr: 'Sticker',
    en: 'Sticker',
    de: 'Sticker'
  },
  orpetronSotd: {
    tr: 'Orpetron 脰d眉l眉',
    en: 'Orpetron Award',
    de: 'Orpetron-Auszeichnung'
  },
  designNominees: {
    tr: 'REWARD',
    en: 'REWARD',
    de: 'REWARD'
  },
  awwwardsNominee: {
    tr: 'AWARD',
    en: 'AWARD',
    de: 'AWARD'
  }
};

function ensureFrogStickerHintEl() {
  if (_frogStickerHintEl && _frogStickerHintEl.parentNode) {
    return _frogStickerHintEl;
  }
  const d = document.createElement('div');
  d.id = 'pro-frog-sticker-hint';
  d.className = 'pro-frog-sticker-hint';
  d.setAttribute('role', 'tooltip');
  d.textContent = 'Sticker';
  d.style.display = 'none';
  document.body.appendChild(d);
  _frogStickerHintEl = d;
  return d;
}

function setFrogStickerHintVisible(vis, clientX, clientY, labelText) {
  const el = ensureFrogStickerHintEl();
  if (!vis) {
    el.style.display = 'none';
    return;
  }
  if (labelText != null && labelText !== '') {
    el.textContent = labelText;
  }
  const pad = 14;
  el.style.left = clientX + pad + 'px';
  el.style.top = clientY + pad + 'px';
  el.style.display = 'block';
}

function tryHandleCockpitAwardStickerClick(e, obj) {
  if (!obj || !obj.userData) return false;
  const url =
    obj.userData.orpetronSotdUrl ||
    obj.userData.designNomineesUrl ||
    obj.userData.awwwardsNomineeUrl;
  if (!url) return false;
  e.preventDefault();
  e.stopPropagation();
  playProButtonClickSfx();
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (_err) {}
  return true;
}

/* BIO: Sol t谋klama ile ayn谋 pick s谋ras谋; orta t谋k `auxclick` ile gelir (`click` ate艧lenmez). */
function cockpitTryAwardStickerFromMiddleClick(e, clientX, clientY) {
  if (
    (!_cockpitOrpetronSotdDecalMesh &&
      !_cockpitAwwwardsNomineeDecalMesh &&
      !_cockpitDesignNomineesDecalMesh) ||
    !camera ||
    !renderer ||
    isProBlockingExitFlow()
  ) {
    return false;
  }
  const cnv = renderer.domElement;
  if (!cnv || e.currentTarget !== cnv || cnv.nodeName !== 'CANVAS') return false;

  const rect = cnv.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return false;
  }
  if (
    isPointerOverChrome(clientX, clientY) ||
    isPointerOverUI(clientX, clientY) ||
    isPointerOverProMapOpen(clientX, clientY)
  ) {
    return false;
  }

  if (proSubMode !== 'idle') {
    if (proSubMode !== 'ready') return false;
    const obj = pickCockpitUiObject(clientX, clientY);
    return tryHandleCockpitAwardStickerClick(e, obj);
  }

  const ph = pickProPlanetByScreenSpace(clientX, clientY);
  if (ph && ph.userData && ph.userData.proPlanetId) return false;

  if (raycastClockDisplayHit(clientX, clientY)) return false;

  const obj = pickCockpitUiObject(clientX, clientY);
  return tryHandleCockpitAwardStickerClick(e, obj);
}

function onCockpitUiAuxclick(e) {
  if (e.button !== 1) return;
  cockpitTryAwardStickerFromMiddleClick(e, e.clientX, e.clientY);
}

/* BIO: Frog + 枚d眉l 莽谋kartmalar谋 i莽in ortak ara莽 ipucu. */
function updateFrogStickerHint(clientX, clientY) {
  if (!camera || !renderer) {
    setFrogStickerHintVisible(false);
    return;
  }
  if (
    !_cockpitFrogDecalMesh &&
    !_cockpitOrpetronSotdDecalMesh &&
    !_cockpitAwwwardsNomineeDecalMesh &&
    !_cockpitDesignNomineesDecalMesh
  ) {
    setFrogStickerHintVisible(false);
    return;
  }
  if (!document.body || !document.body.classList.contains('cockpit-3d-active')) {
    setFrogStickerHintVisible(false);
    return;
  }
  if (isPointerOverUI(clientX, clientY) || isPointerOverProMapOpen(clientX, clientY)) {
    setFrogStickerHintVisible(false);
    return;
  }
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    setFrogStickerHintVisible(false);
    return;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  const pickMeshes = [
    _cockpitDesignNomineesDecalMesh,
    _cockpitAwwwardsNomineeDecalMesh,
    _cockpitOrpetronSotdDecalMesh,
    _cockpitFrogDecalMesh
  ].filter(Boolean);
  const hits = pickMeshes.length ? _ray.intersectObjects(pickMeshes, false) : [];
  if (!hits || hits.length === 0) {
    setFrogStickerHintVisible(false);
    return;
  }
  const hitMesh = hits[0].object;
  const lang = _proCurrentLang();
  let labelKey = '';
  if (hitMesh === _cockpitFrogDecalMesh) labelKey = 'frog';
  else if (hitMesh === _cockpitOrpetronSotdDecalMesh) labelKey = 'orpetronSotd';
  else if (hitMesh === _cockpitAwwwardsNomineeDecalMesh) labelKey = 'awwwardsNominee';
  else if (hitMesh === _cockpitDesignNomineesDecalMesh) labelKey = 'designNominees';
  if (!labelKey) {
    setFrogStickerHintVisible(false);
    return;
  }
  const row = PRO_COCKPIT_STICKER_HINT_COPY[labelKey];
  const label = (row && (row[lang] || row.en)) || '';
  setFrogStickerHintVisible(true, clientX, clientY, label);
}

function pickCockpitUiObject(clientX, clientY) {
  if (!camera || !renderer) return null;
  if (isProBlockingExitFlow()) return null;
  if (isPointerOverChrome(clientX, clientY)) return null;
  if (isPointerOverUI(clientX, clientY)) return null;
  const pickable = langButtonMeshes.concat(toolbarActionMeshes, allVolUiMeshes());
  if (_cockpitOrpetronSotdDecalMesh) pickable.push(_cockpitOrpetronSotdDecalMesh);
  if (_cockpitAwwwardsNomineeDecalMesh) pickable.push(_cockpitAwwwardsNomineeDecalMesh);
  if (_cockpitDesignNomineesDecalMesh) pickable.push(_cockpitDesignNomineesDecalMesh);
  if (pongInviteMesh) pickable.push(pongInviteMesh);
  if (aboutBackMesh && aboutBackMesh.visible) pickable.push(aboutBackMesh);
  /* BIO: Pro Mode integration note. */
  if (
    proSubMode === 'ready' &&
    _proSubStaticDecorPickables &&
    _proSubStaticDecorPickables.length
  ) {
    for (let i = 0; i < _proSubStaticDecorPickables.length; i += 1) {
      pickable.push(_proSubStaticDecorPickables[i]);
    }
  }
  if (pickable.length === 0) return null;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  const hit = _ray.intersectObjects(pickable, false);
  return (hit[0] && hit[0].object) || null;
}

function updateCockpitUiHoverTarget(clientX, clientY) {
  _cockpitUiHoverObject = pickCockpitUiObject(clientX, clientY);
}

/* BIO: Audio, SFX, and mini-player behavior note. */
function cockpitVolSliderHoverSkipsButtonSfx() {
  const m = _cockpitUiHoverObject;
  return !!(m && m.userData && m.userData.cockpitVolPart === 'slider');
}

function playProButtonClickSfx() {
  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api.playButtonClickSfx === 'function') api.playButtonClickSfx();
  } catch (_e) {}
}

function playProPlanetButtonClickSfx() {
  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api.playPlanetButtonClickSfx === 'function') api.playPlanetButtonClickSfx();
  } catch (_e2) {}
}

function playProPlanetGoBackSfx() {
  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api.playPlanetGoBackSfx === 'function') api.playPlanetGoBackSfx();
  } catch (_e3) {}
}

function lerpCockpitUiHoverFactor(dtK, mesh) {
  if (!mesh.userData) mesh.userData = {};
  const want = mesh === _cockpitUiHoverObject ? 1 : 0;
  let f = mesh.userData._uiHoverF;
  if (f === undefined) f = 0;
  f += (want - f) * dtK;
  if (f < 0.003) f = 0;
  if (f > 0.997) f = 1;
  mesh.userData._uiHoverF = f;
  return f;
}

function applyCockpitUiHoverTransform(mesh, f) {
  if (!mesh || !mesh.userData._uiBasePos) return;
  const t = Math.min(1, Math.max(0, f));
  const hoverFrac =
    mesh.userData._cockpitStickerHoverScale != null ? mesh.userData._cockpitStickerHoverScale : COCKPIT_UI_HOVER_SCALE;
  const s = 1 + hoverFrac * t;
  mesh.scale.set(s, s, s);
  mesh.position.copy(mesh.userData._uiBasePos);
  if (mesh.userData._uiHoverZMax > 0) {
    mesh.translateZ(t * mesh.userData._uiHoverZMax);
  }
}

function onCockpitUiClick(e) {
  /* BIO: Button layout and interaction note. */
  if (e.button > 0) return;
  if (!camera) return;
  if (isProBlockingExitFlow()) return;
  const c = e.currentTarget;
  if (!c || c.nodeName !== 'CANVAS') return;
  if (isPointerOverChrome(e.clientX, e.clientY)) return;
  /* BIO: Map overlay behavior and interaction note. */
  if (proSubMode !== 'idle') {
    if (proSubMode === 'ready') {
      const obj = pickCockpitUiObject(e.clientX, e.clientY);
      if (obj && obj.userData) {
        if (tryHandleCockpitAwardStickerClick(e, obj)) return;
        if (obj.userData.actionId === 'diveBack') {
          e.preventDefault();
          e.stopPropagation();
          startProSubRetreatSequence();
          return;
        }
        if (obj.userData.actionId === 'default') {
          e.preventDefault();
          e.stopPropagation();
          playProButtonClickSfx();
          window.dispatchEvent(new Event('bgs-pro-go-default'));
          return;
        }
        if (obj.userData.actionId === 'map') {
          e.preventDefault();
          e.stopPropagation();
          playProButtonClickSfx();
          window.dispatchEvent(new Event('bgs-pro-map'));
          return;
        }
        if (obj.userData.lang) {
          e.preventDefault();
          e.stopPropagation();
          playProButtonClickSfx();
          window.dispatchEvent(
            new CustomEvent('bgs-pro-lang-pick', { detail: { lang: obj.userData.lang } })
          );
          return;
        }
        if (obj.userData.actionId === 'subDecor' && obj.userData.onClick) {
          e.preventDefault();
          e.stopPropagation();
          playProButtonClickSfx();
          const action = obj.userData.onClick;
          if (action.type === 'href' && action.href) {
            const allowedScheme = /^(https?:|mailto:|tel:)/i.test(action.href);
            if (!allowedScheme) return;
            /* BIO: HTTP(S) links open in a new tab; mailto/tel links stay in this window and let the OS handle them. */
            const isHttp = /^https?:\/\//i.test(action.href);
            const target = action.target || (isHttp ? '_blank' : '_self');
            try {
              if (target === '_blank') {
                window.open(action.href, '_blank', 'noopener,noreferrer');
              } else {
                window.location.href = action.href;
              }
            } catch (_) { /* BIO: Ignore navigation failures. */ }
          }
          return;
        }
      }
    }
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  {
    const ph = pickProPlanetByScreenSpace(e.clientX, e.clientY);
    if (ph && ph.userData && ph.userData.proPlanetId) {
      e.preventDefault();
      e.stopPropagation();
      const id = ph.userData.proPlanetId;
      const sub = ph.userData.proSubId;
      /* BIO: Planet layout, label, and interaction note. */
      if (sub) {
        playProPlanetButtonClickSfx();
        const reg = PRO_PLANET_REGISTRY[id];
        const hasContent = !!(PRO_SUB_CONTENT[id] && PRO_SUB_CONTENT[id][sub]);
        if (reg && reg.mainMode() === 'ready' && proSubMode === 'idle' && hasContent) {
          startProSubDiveSequence(id, sub);
          return;
        }
        window.dispatchEvent(
          new CustomEvent('bgs-pro-planet', { detail: { id, sub: [sub] } })
        );
        return;
      }
      /* BIO: Planet layout, label, and interaction note. */
      if (id === 'about' && proAboutMode === 'idle' && proProjectsMode === 'idle' && proHobbiesMode === 'idle' && proSkillsMode === 'idle' && proContactMode === 'idle') {
        playProPlanetButtonClickSfx();
        startProAboutExpandSequence();
        return;
      }
      if (id === 'about') return;
      if (id === 'projects' && proProjectsMode === 'idle' && proAboutMode === 'idle' && proHobbiesMode === 'idle' && proSkillsMode === 'idle' && proContactMode === 'idle') {
        playProPlanetButtonClickSfx();
        startProProjectsExpandSequence();
        return;
      }
      if (id === 'projects') return;
      if (id === 'hobbies' && proHobbiesMode === 'idle' && proAboutMode === 'idle' && proProjectsMode === 'idle' && proSkillsMode === 'idle' && proContactMode === 'idle') {
        playProPlanetButtonClickSfx();
        startProHobbiesExpandSequence();
        return;
      }
      if (id === 'hobbies') return;
      if (id === 'skills' && proSkillsMode === 'idle' && proAboutMode === 'idle' && proProjectsMode === 'idle' && proHobbiesMode === 'idle' && proContactMode === 'idle') {
        playProPlanetButtonClickSfx();
        startProSkillsExpandSequence();
        return;
      }
      if (id === 'skills') return;
      if (id === 'contact' && proContactMode === 'idle' && proAboutMode === 'idle' && proProjectsMode === 'idle' && proHobbiesMode === 'idle' && proSkillsMode === 'idle') {
        playProPlanetButtonClickSfx();
        startProContactExpandSequence();
        return;
      }
      if (id === 'contact') return;
      window.dispatchEvent(
        new CustomEvent('bgs-pro-planet', { detail: { id } })
      );
      return;
    }
  }
  if (raycastClockDisplayHit(e.clientX, e.clientY)) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  const obj = pickCockpitUiObject(e.clientX, e.clientY);
  if (!obj) return;
  if (tryHandleCockpitAwardStickerClick(e, obj)) return;
  if (obj.userData.cockpitVolPart) return;
  e.preventDefault();
  e.stopPropagation();
  if (obj.userData.lang) {
    playProButtonClickSfx();
    window.dispatchEvent(
      new CustomEvent('bgs-pro-lang-pick', { detail: { lang: obj.userData.lang } })
    );
    return;
  }
  if (obj.userData.actionId === 'default') {
    playProButtonClickSfx();
    window.dispatchEvent(new Event('bgs-pro-go-default'));
    return;
  }
  if (obj.userData.actionId === 'map') {
    playProButtonClickSfx();
    window.dispatchEvent(new Event('bgs-pro-map'));
    return;
  }
  if (obj.userData.actionId === 'pongInvite') {
    playProButtonClickSfx();
    window.dispatchEvent(new CustomEvent('bgs-pro-pong-open'));
    return;
  }
  if (obj.userData.actionId === 'diveBack') {
    if (proSubMode === 'ready') startProSubRetreatSequence();
    else if (proAboutMode === 'ready') startProAboutRetreatSequence();
    else if (proProjectsMode === 'ready') startProProjectsRetreatSequence();
    else if (proHobbiesMode === 'ready') startProHobbiesRetreatSequence();
    else if (proSkillsMode === 'ready') startProSkillsRetreatSequence();
    else if (proContactMode === 'ready') startProContactRetreatSequence();
  }
}

function updateLookTarget(clientX, clientY) {
  const cockpit = document.getElementById('cockpit');
  if (!cockpit || reduceMotion) return;
  /* BIO: Map overlay behavior and interaction note. */
  if (!isProMapOverlayOpen() && isPointerOverUI(clientX, clientY)) {
    targetYaw = 0;
    targetPitch = 0;
    return;
  }
  const r = cockpit.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return;
  const nx = (clientX - r.left) / r.width;
  const ny = (clientY - r.top) / r.height;
  if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
    targetYaw = 0;
    targetPitch = 0;
    return;
  }
  targetYaw = (nx - 0.5) * 2 * MAX_YAW;
  /* BIO: Implementation note for this section. */
  targetPitch = (ny - 0.5) * 2 * MAX_PITCH;
}

function onPointerMove(e) {
  if (isProBlockingExitFlow()) return;
  const prevUiHover = _cockpitUiHoverObject;
  updateCockpitUiHoverTarget(e.clientX, e.clientY);
  if (
    _cockpitUiHoverObject &&
    _cockpitUiHoverObject !== prevUiHover &&
    !cockpitVolSliderHoverSkipsButtonSfx()
  ) {
    try {
      const api = window.bgsProCockpitApi;
      if (api && typeof api.playButtonHoverSfx === 'function') api.playButtonHoverSfx();
    } catch (_err) {}
  }
  syncAboutPlanetCursorHint(e.clientX, e.clientY);
  updateFrogStickerHint(e.clientX, e.clientY);
  const skipPointerLook =
    reduceMotion ||
    (detectProMobileViewport() && _proGyroLookActive) ||
    (detectProMobileViewport() && _proMobileCenterLookLock);
  if (!skipPointerLook) updateLookTarget(e.clientX, e.clientY);
}

function onTouch(e) {
  if (isProBlockingExitFlow()) return;
  const t = e.touches && e.touches[0];
  if (t) {
    const prevUiHover = _cockpitUiHoverObject;
    updateCockpitUiHoverTarget(t.clientX, t.clientY);
    if (
      _cockpitUiHoverObject &&
      _cockpitUiHoverObject !== prevUiHover &&
      !cockpitVolSliderHoverSkipsButtonSfx()
    ) {
      try {
        const api = window.bgsProCockpitApi;
        if (api && typeof api.playButtonHoverSfx === 'function') api.playButtonHoverSfx();
      } catch (_err2) {}
    }
    syncAboutPlanetCursorHint(t.clientX, t.clientY);
    updateFrogStickerHint(t.clientX, t.clientY);
    const skipPointerLook =
      reduceMotion ||
      (detectProMobileViewport() && _proGyroLookActive) ||
      (detectProMobileViewport() && _proMobileCenterLookLock);
    if (!skipPointerLook) updateLookTarget(t.clientX, t.clientY);
  }
}

function onTouchEndCockpitUi() {
  _cockpitUiHoverObject = null;
  setFrogStickerHintVisible(false);
}

/* BIO: Pause heavy WebGL/CSS3D work during Default exit modal / intro2 (video + renderer = jank). */
let _cockpitRenderPaused = false;
let _cockpitMobileRafScheduled = false;
/** BIO: Mobil IntersectionObserver; tam ekranda genelde s眉rekli kesi艧ir 鈥?sekme yoklu臒u document.hidden ile. */
let _cockpitMobileIoIntersecting = true;

function _cockpitMobileShouldThrottleAnimate() {
  if (!IS_PRO_MOBILE_VIEWPORT) return false;
  if (_cockpitRenderPaused) return true;
  if (typeof document !== 'undefined' && document.hidden) return true;
  if (!_cockpitMobileIoIntersecting) return true;
  return false;
}

/** BIO: RAF zinciri kesildi臒inde (sekme arka plan / g枚r眉nmez sarmalay谋c谋) yeniden ba艧lat谋r. */
function kickCockpitMobileAnimateChain() {
  if (!IS_PRO_MOBILE_VIEWPORT) return;
  if (_cockpitMobileRafScheduled) return;
  if (!camera || !pivot || !renderer) return;
  if (_cockpitMobileShouldThrottleAnimate()) return;
  _cockpitMobileRafScheduled = true;
  requestAnimationFrame(animate);
}

function setupCockpitMobileRafObservers(wrapEl) {
  if (!IS_PRO_MOBILE_VIEWPORT || typeof document === 'undefined') return;

  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) {
        kickCockpitMobileAnimateChain();
      } else {
        _cockpitMobileRafScheduled = false;
      }
    },
    { passive: true }
  );

  /* BIO: Dokunulabilir y眉zeye kayd谋r谋l谋rsa veya gizlenirse RAF鈥櫮?d眉艧眉r. */
  try {
    if (!wrapEl || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ents => {
        let hit = false;
        for (const e of ents) {
          if (e.isIntersecting) {
            hit = true;
            break;
          }
        }
        _cockpitMobileIoIntersecting = hit;
        if (hit) kickCockpitMobileAnimateChain();
        else _cockpitMobileRafScheduled = false;
      },
      { root: null, rootMargin: '0px', threshold: [0, 0.001, 1] }
    );
    io.observe(wrapEl);
  } catch (_) { /* BIO: uyumluluk */ }
}

if (typeof window !== 'undefined') {
  window.addEventListener('bgs-pro-cockpit-render-pause', () => {
    _cockpitRenderPaused = true;
  });
  window.addEventListener('bgs-pro-cockpit-render-resume', () => {
    _cockpitRenderPaused = false;
    kickCockpitMobileAnimateChain();
  });
}

function animate() {
  /* BIO: Mas眉st眉 鈥?mevcut davran谋艧 korunur. Mobil 鈥?zincir uygun de臒ilse durur (sekme arka plan / g枚r眉nmez). */
  if (!IS_PRO_MOBILE_VIEWPORT) {
    requestAnimationFrame(animate);
  } else {
    _cockpitMobileRafScheduled = false;
    if (_cockpitMobileShouldThrottleAnimate()) {
      return;
    }
  }

  if (!camera || !pivot) return;
  if (_cockpitRenderPaused) return;
  const now = performance.now();
  const rawDt = _animPrevT > 0 ? (now - _animPrevT) / 1000 : 1 / 60;
  const dt = Math.min(0.05, rawDt);
  _animPrevT = now;
  if (starFieldPoints) {
    updateCockpitStarfield(dt);
  }
  updateCockpitUfo(dt);
  updateCockpitShootingStar();
  if (proScrollGroup && proScrollData) {
    if (_proScrollLastWheelT > 0 && !_proScrollSnapDone) {
      const nowMs =
        typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      if (nowMs - _proScrollLastWheelT > PRO_SCROLL_SNAP_DELAY_MS) {
        const tNormTgt = proScrollMod1(proScrollTTarget);
        let bestC = PRO_SCROLL_CENTERS[0];
        let bestD = Math.min(
          Math.abs(tNormTgt - bestC),
          1 - Math.abs(tNormTgt - bestC)
        );
        for (let i = 1; i < PRO_SCROLL_CENTERS.length; i += 1) {
          const diff = Math.abs(tNormTgt - PRO_SCROLL_CENTERS[i]);
          const d = Math.min(diff, 1 - diff);
          if (d < bestD) {
            bestD = d;
            bestC = PRO_SCROLL_CENTERS[i];
          }
        }
        let delta = bestC - tNormTgt;
        if (delta > 0.5) delta -= 1;
        else if (delta < -0.5) delta += 1;
        proScrollTTarget += delta;
        _proScrollSnapDone = true;
      }
    }
    proScrollT += (proScrollTTarget - proScrollT) * PRO_SCROLL_LERP;
    const floorT = Math.floor(proScrollT);
    if (floorT !== 0 && floorT === Math.floor(proScrollTTarget)) {
      proScrollT -= floorT;
      proScrollTTarget -= floorT;
    }
    updateProScrollGroupPosition();
    const tScroll = proScrollMod1(proScrollT);
    if (aboutLabelSprite && camera) {
      aboutLabelSprite.lookAt(camera.position);
    }
    if (projectsLabelSprite && camera) {
      projectsLabelSprite.lookAt(camera.position);
    }
    if (hobbiesLabelSprite && camera) {
      hobbiesLabelSprite.lookAt(camera.position);
    }
    if (skillsLabelSprite && camera) {
      skillsLabelSprite.lookAt(camera.position);
    }
    if (contactLabelSprite && camera) {
      contactLabelSprite.lookAt(camera.position);
    }
    const swapAP = PRO_SCROLL_LABEL_SWAP_AP;
    const swapPH = PRO_SCROLL_LABEL_SWAP_PH;
    const swapHS = PRO_SCROLL_LABEL_SWAP_HS;
    const swapSC = PRO_SCROLL_LABEL_SWAP_SC;
    if (aboutLabelSprite) {
      /* BIO: Planet layout, label, and interaction note. */
      aboutLabelSprite.visible =
        tScroll < swapAP &&
        (!aboutMainShell || aboutMainShell.visible) &&
        (proAboutMode === 'idle' || proAboutMode === 'undive');
    }
    if (projectsLabelSprite) {
      projectsLabelSprite.visible =
        tScroll >= swapAP &&
        tScroll < swapPH &&
        (!projectsMainShell || projectsMainShell.visible) &&
        (proProjectsMode === 'idle' || proProjectsMode === 'undive');
    }
    if (hobbiesLabelSprite) {
      hobbiesLabelSprite.visible =
        tScroll >= swapPH &&
        tScroll < swapHS &&
        (!hobbiesMainShell || hobbiesMainShell.visible) &&
        (proHobbiesMode === 'idle' || proHobbiesMode === 'undive');
    }
    if (skillsLabelSprite) {
      skillsLabelSprite.visible =
        tScroll >= swapHS &&
        tScroll < swapSC &&
        (!skillsMainShell || skillsMainShell.visible) &&
        (proSkillsMode === 'idle' || proSkillsMode === 'undive');
    }
    if (contactLabelSprite) {
      contactLabelSprite.visible =
        tScroll >= swapSC &&
        (!contactMainShell || contactMainShell.visible) &&
        (proContactMode === 'idle' || proContactMode === 'undive');
    }
    if (proScrollAboutOff) {
      proScrollAboutOff.visible = tScroll < swapAP;
    }
    if (proScrollProjectsOff) {
      proScrollProjectsOff.visible = tScroll >= swapAP && tScroll < swapPH;
    }
    if (proScrollHobbiesOff) {
      proScrollHobbiesOff.visible = tScroll >= swapPH && tScroll < swapHS;
    }
    if (proScrollSkillsOff) {
      proScrollSkillsOff.visible = tScroll >= swapHS && tScroll < swapSC;
    }
    if (proScrollContactOff) {
      proScrollContactOff.visible = tScroll >= swapSC;
    }
    if (aboutMePlanetMesh && (!aboutMainShell || aboutMainShell.visible)) {
      aboutMePlanetMesh.rotation.y += dt * (reduceMotion ? 0 : 0.14);
    }
    for (const g of proAboutSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        g.mesh.rotation.y += dt * (reduceMotion ? 0 : 0.18);
      }
    }
    for (const g of proProjectsSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        g.mesh.rotation.y += dt * (reduceMotion ? 0 : 0.16);
      }
    }
    for (const g of proHobbiesSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        g.mesh.rotation.y += dt * (reduceMotion ? 0 : 0.15);
      }
    }
    for (const g of proSkillsSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        g.mesh.rotation.y += dt * (reduceMotion ? 0 : 0.14);
      }
    }
    updateProAboutExpandAnim(dt);
    updateProProjectsExpandAnim(dt);
    updateProHobbiesExpandAnim(dt);
    updateProSkillsExpandAnim(dt);
    updateProContactExpandAnim(dt);
    updateProSubExpandAnim(dt);
    _updateProSubDetailCarousel(dt);
    _updateProSubStaticDecor(dt);
    updateProAboutPlanetHoverVisuals(dt);
    updateProProjectsPlanetHoverVisuals(dt);
    updateProHobbiesPlanetHoverVisuals(dt);
    updateProSkillsPlanetHoverVisuals(dt);
    updateProContactPlanetHoverVisuals(dt);
    /* BIO: Implementation note for this section. */
    if (camera) {
      for (const spr of proAboutSubLabelSprites) {
        if (spr && spr.visible) spr.lookAt(camera.position);
      }
      for (const spr of proProjectsSubLabelSprites) {
        if (spr && spr.visible) spr.lookAt(camera.position);
      }
      for (const spr of proHobbiesSubLabelSprites) {
        if (spr && spr.visible) spr.lookAt(camera.position);
      }
      for (const spr of proSkillsSubLabelSprites) {
        if (spr && spr.visible) spr.lookAt(camera.position);
      }
      for (const spr of proContactSubLabelSprites) {
        if (spr && spr.visible) spr.lookAt(camera.position);
      }
    }
    if (myProjectsPlanetMesh && (!projectsMainShell || projectsMainShell.visible)) {
      myProjectsPlanetMesh.rotation.y += dt * (reduceMotion ? 0 : 0.12);
    }
    if (hobbiesPlanetMesh && (!hobbiesMainShell || hobbiesMainShell.visible)) {
      hobbiesPlanetMesh.rotation.y += dt * (reduceMotion ? 0 : 0.1);
    }
    if (skillsPlanetMesh && (!skillsMainShell || skillsMainShell.visible)) {
      skillsPlanetMesh.rotation.y += dt * (reduceMotion ? 0 : 0.09);
    }
    if (contactPlanetMesh && (!contactMainShell || contactMainShell.visible)) {
      contactPlanetMesh.rotation.y += dt * (reduceMotion ? 0 : 0.085);
    }
    for (const g of proContactSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        g.mesh.rotation.y += dt * (reduceMotion ? 0 : 0.1);
      }
    }
  }
  syncBioLogoStickerTint();
  if (welcomeTitleMesh && welcomeTitleMesh.userData) {
    const u = welcomeTitleMesh.userData;
    const m = welcomeTitleMesh.material;
    if (!u.dismissed) {
      if (u.dismissing) {
        if (u._opSnap == null) u._opSnap = m.opacity;
        u.dismissingT = Math.min(1, (u.dismissingT || 0) + dt / WELCOME_FADE_OUT_SEC);
        m.opacity = (u._opSnap || 1) * (1 - u.dismissingT);
        if (u.dismissingT >= 0.999) {
          welcomeTitleMesh.visible = false;
          u.dismissed = true;
          m.opacity = 0;
        }
      } else if (reduceMotion) {
        u.fade = 1;
        m.opacity = 1;
      } else {
        u.fade = Math.min(1, (u.fade || 0) + dt / WELCOME_FADE_IN_SEC);
        m.opacity = u.fade;
      }
    }
  }
  if (!reduceMotion) {
    let smoothYaw = LOOK_SMOOTH;
    let smoothPitch = LOOK_SMOOTH;
    if (detectProMobileViewport() && _proMobileCenterLookLock) {
      targetYaw = 0;
      targetPitch = 0;
      smoothYaw = LOOK_SMOOTH_CENTER_LOCK;
      smoothPitch = LOOK_SMOOTH_CENTER_LOCK;
    }
    curYaw += (targetYaw - curYaw) * smoothYaw;
    curPitch += (targetPitch - curPitch) * smoothPitch;
    camera.getWorldDirection(_camFwd);
    _camRight.crossVectors(_camFwd, _worldUp);
    if (_camRight.lengthSq() < 1e-8) {
      _camRight.set(0, 0, 1);
    } else {
      _camRight.normalize();
    }
    _qYaw.setFromAxisAngle(_worldUp, curYaw);
    _qPitch.setFromAxisAngle(_camRight, curPitch);
    pivot.quaternion.multiplyQuaternions(_qYaw, _qPitch);
  } else {
    pivot.quaternion.identity();
  }
  if (
    camera &&
    (langButtonMeshes.length > 0 ||
      toolbarActionMeshes.length > 0 ||
      volSliderMeshes.length > 0 ||
      volPlayerMeshes.length > 0 ||
      pongInviteMesh ||
      _cockpitOrpetronSotdDecalMesh ||
      _cockpitAwwwardsNomineeDecalMesh ||
      _cockpitDesignNomineesDecalMesh)
  ) {
    const k = reduceMotion ? COCKPIT_UI_HOVER_SMOOTH_REDUCED : COCKPIT_UI_HOVER_SMOOTH;
    for (const m of langButtonMeshes) {
      const f = lerpCockpitUiHoverFactor(k, m);
      applyCockpitUiHoverTransform(m, f);
    }
    for (const m of toolbarActionMeshes) {
      const f = lerpCockpitUiHoverFactor(k, m);
      applyCockpitUiHoverTransform(m, f);
    }
    if (pongInviteMesh) {
      const f = lerpCockpitUiHoverFactor(k, pongInviteMesh);
      applyCockpitUiHoverTransform(pongInviteMesh, f);
    }
    for (const m of volSliderMeshes) {
      const f = lerpCockpitUiHoverFactor(k, m);
      applyCockpitUiHoverTransform(m, f);
    }
    for (const m of volPlayerMeshes) {
      const f = lerpCockpitUiHoverFactor(k, m);
      applyCockpitUiHoverTransform(m, f);
    }
    if (aboutBackMesh && aboutBackMesh.visible) {
      const f = lerpCockpitUiHoverFactor(k, aboutBackMesh);
      applyCockpitUiHoverTransform(aboutBackMesh, f);
      syncAboutBackTexture();
    }
    if (_cockpitOrpetronSotdDecalMesh) {
      const fOrb = lerpCockpitUiHoverFactor(k, _cockpitOrpetronSotdDecalMesh);
      applyCockpitUiHoverTransform(_cockpitOrpetronSotdDecalMesh, fOrb);
    }
    if (_cockpitAwwwardsNomineeDecalMesh) {
      const fAw = lerpCockpitUiHoverFactor(k, _cockpitAwwwardsNomineeDecalMesh);
      applyCockpitUiHoverTransform(_cockpitAwwwardsNomineeDecalMesh, fAw);
    }
    if (_cockpitDesignNomineesDecalMesh) {
      const fDn = lerpCockpitUiHoverFactor(k, _cockpitDesignNomineesDecalMesh);
      applyCockpitUiHoverTransform(_cockpitDesignNomineesDecalMesh, fDn);
    }
    syncLangButtonTextures();
    syncToolbarTextures();
    syncPongInviteTexture();
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  if (css3dRenderer && scene && camera) {
    css3dRenderer.render(scene, camera);
  }
  if (IS_PRO_MOBILE_VIEWPORT) {
    if (!_cockpitMobileShouldThrottleAnimate()) {
      _cockpitMobileRafScheduled = true;
      requestAnimationFrame(animate);
    }
  }
}

function onResize() {
  if (!camera) return;
  if (!renderer) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(proMobilePerfRendererDpr());
  if (css3dRenderer) css3dRenderer.setSize(w, h);
  kickCockpitMobileAnimateChain();
}

function warmCockpitRenderer() {
  if (!renderer || !scene || !camera) return;
  try {
    if (typeof renderer.compile === 'function') renderer.compile(scene, camera);
    renderer.render(scene, camera);
    if (css3dRenderer) css3dRenderer.render(scene, camera);
  } catch (_) { /* BIO: Ignore renderer warm-up failures. */ }
}

function spawnCockpitStarIndex(arr, i, maxDim) {
  if (!camera) return;
  camera.getWorldDirection(_starFwd);
  _starUp.set(0, 1, 0);
  _starRight.copy(_starUp).cross(_starFwd);
  if (_starRight.lengthSq() < 1e-8) {
    _starRight.set(1, 0, 0).cross(_starFwd);
  }
  _starRight.normalize();
  _starUp.copy(_starFwd).cross(_starRight).normalize();
  /* BIO: Implementation note for this section. */
  const dMin = 3.2;
  const dMax = 47;
  const dAlong = (dMin + Math.random() * (dMax - dMin)) * maxDim;
  const rMax = maxDim * 18.5;
  const r = rMax * Math.sqrt(Math.random());
  const theta = Math.random() * Math.PI * 2;
  _starTmp.copy(camera.position);
  _starTmp.addScaledVector(_starFwd, dAlong);
  _starTmp.addScaledVector(_starRight, Math.cos(theta) * r);
  _starTmp.addScaledVector(_starUp, Math.sin(theta) * r);
  const j = i * 3;
  arr[j] = _starTmp.x;
  arr[j + 1] = _starTmp.y;
  arr[j + 2] = _starTmp.z;
}

function updateCockpitStarfield(dt) {
  if (!starFieldPoints || !camera) return;
  const attr = starFieldPoints.geometry.getAttribute('position');
  if (!attr) return;
  const arr = attr.array;
  const n = arr.length / 3;
  const { maxDim, drift, respawnNear } = starFieldPoints.userData;
  camera.getWorldDirection(_starFwd);
  const step = drift * maxDim * dt;
  const mx = -_starFwd.x * step;
  const my = -_starFwd.y * step;
  const mz = -_starFwd.z * step;
  for (let i = 0; i < n; i++) {
    const b = i * 3;
    arr[b] += mx;
    arr[b + 1] += my;
    arr[b + 2] += mz;
    _starTmp.set(arr[b], arr[b + 1], arr[b + 2]);
    _starToCam.subVectors(_starTmp, camera.position);
    const along = _starToCam.dot(_starFwd);
    if (along < respawnNear) {
      spawnCockpitStarIndex(arr, i, maxDim);
    }
  }
  attr.needsUpdate = true;
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function addCockpitStarfield(worldScene, maxDim) {
  if (starFieldPoints) {
    worldScene.remove(starFieldPoints);
    starFieldPoints.geometry?.dispose();
    if (Array.isArray(starFieldPoints.material)) {
      starFieldPoints.material.forEach(m => m?.dispose());
    } else {
      starFieldPoints.material?.dispose();
    }
    starFieldPoints = null;
  }
  let count = 2400;
  if (reduceMotion) count = 800;
  else if (IS_PRO_MOBILE_VIEWPORT) count = 720;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    spawnCockpitStarIndex(positions, i, maxDim);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const c = 0.5 + Math.random() * 0.5;
    col[i * 3] = c;
    col[i * 3 + 1] = c * 0.96;
    col[i * 3 + 2] = 1;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: maxDim * 0.0005,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false
  });
  starFieldPoints = new THREE.Points(geo, mat);
  starFieldPoints.name = 'cockpitStarfield';
  starFieldPoints.renderOrder = -10;
  starFieldPoints.userData = {
    maxDim,
    drift: reduceMotion ? STAR_DRIFT * 0.4 : STAR_DRIFT,
    respawnNear: STAR_RESPAWN_NEAR_FRAC * maxDim
  };
  worldScene.add(starFieldPoints);
}

/* BIO: Cockpit layout, rendering, and interaction note. */
let ufoModel = null;
let ufoMaxDim = 0;
let ufoReady = false;
let ufoActive = false;
let ufoFirstShown = false;
/* BIO: Implementation note for this section. */
let ufoWaitStartMs = 0;
let ufoFlightStartMs = 0;
/* BIO: Implementation note for this section. */
let ufoFlightCount = 0;
let _ufoMaterials = [];
const _ufoFwd = new THREE.Vector3();
const _ufoRight = new THREE.Vector3();
const _ufoWorldUp = new THREE.Vector3(0, 1, 0);
const _ufoCenter = new THREE.Vector3();
const _ufoStart = new THREE.Vector3();
const _ufoEnd = new THREE.Vector3();

function addCockpitUfo(worldScene, maxDim) {
  if (!UFO_CONFIG.enabled) return;
  ufoMaxDim = maxDim;
  ufoWaitStartMs = performance.now();
  ufoFlightStartMs = 0;
  ufoFlightCount = 0;
  ufoFirstShown = false;
  ufoActive = false;
  const loader = new GLTFLoader();
  /* BIO: Scroll and navigation behavior note. */
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    UFO_GLB_URL,
    gltf => {
      const root = gltf.scene;
      root.name = 'cockpitUfo';
      root.updateMatrixWorld(true);
      /* BIO: Implementation note for this section. */
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);
      const modelMax = Math.max(size.x, size.y, size.z, 1e-4);
      const target = UFO_CONFIG.scaleMul * maxDim;
      const s = target / modelMax;
      const wrap = new THREE.Group();
      wrap.name = 'cockpitUfoWrap';
      wrap.add(root);
      wrap.scale.setScalar(s);
      wrap.visible = false;
      /* BIO: Implementation note for this section. */
      wrap.updateMatrixWorld(true);
      const box2 = new THREE.Box3().setFromObject(wrap);
      const center2 = box2.getCenter(new THREE.Vector3());
      if (isFinite(center2.x) && (center2.lengthSq() > 1e-6)) {
        /* BIO: Implementation note for this section. */
        const inv = 1 / (s || 1);
        root.position.x -= center2.x * inv;
        root.position.y -= center2.y * inv;
        root.position.z -= center2.z * inv;
      }
      _ufoMaterials.length = 0;
      root.traverse(obj => {
        if (obj.isMesh) {
          obj.frustumCulled = false;
          /* BIO: Implementation note for this section. */
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const m of mats) {
            if (!m) continue;
            m.transparent = true;
            if (typeof m.opacity !== 'number') m.opacity = 1;
            m.userData._baseOpacity = m.opacity;
            _ufoMaterials.push(m);
          }
        }
      });
      ufoModel = wrap;
      worldScene.add(wrap);
      ufoReady = true;
    },
    undefined,
    err => {
      console.warn('[cockpit-3d] UFO glb y眉klenemedi:', err?.message || err);
    }
  );
}

function _setUfoOpacity(a) {
  for (const m of _ufoMaterials) {
    const base = typeof m.userData._baseOpacity === 'number' ? m.userData._baseOpacity : 1;
    m.opacity = base * a;
  }
}

function _computeUfoEndpoints(reverse) {
  if (!camera) return;
  camera.getWorldDirection(_ufoFwd);
  _ufoRight.copy(_ufoFwd).cross(_ufoWorldUp);
  if (_ufoRight.lengthSq() < 1e-8) _ufoRight.set(1, 0, 0);
  _ufoRight.normalize();
  const md = ufoMaxDim;
  const fwd = UFO_CONFIG.forwardDistMul * md + UFO_CONFIG.posOffset.forward * md;
  const up = UFO_CONFIG.upOffsetMul * md + UFO_CONFIG.posOffset.up * md;
  const rOff = UFO_CONFIG.posOffset.right * md;
  const side = UFO_CONFIG.sideSpreadMul * md;
  _ufoCenter
    .copy(camera.position)
    .addScaledVector(_ufoFwd, fwd)
    .addScaledVector(_ufoRight, rOff)
    .addScaledVector(_ufoWorldUp, up);
  /* BIO: UFO transition configuration note. */
  const sStart = reverse ? -side : +side;
  const sEnd = reverse ? +side : -side;
  _ufoStart.copy(_ufoCenter).addScaledVector(_ufoRight, sStart);
  _ufoEnd.copy(_ufoCenter).addScaledVector(_ufoRight, sEnd);
}

function updateCockpitUfo(dt) {
  if (!UFO_CONFIG.enabled || !ufoReady || !ufoModel) return;
  /* BIO: UFO transition configuration note. */
  if (UFO_CONFIG.previewMode) {
    if (!camera) return;
    camera.getWorldDirection(_ufoFwd);
    _ufoRight.copy(_ufoFwd).cross(_ufoWorldUp);
    if (_ufoRight.lengthSq() < 1e-8) _ufoRight.set(1, 0, 0);
    _ufoRight.normalize();
    const md = ufoMaxDim;
    const pp = UFO_CONFIG.previewPos;
    ufoModel.position
      .copy(camera.position)
      .addScaledVector(_ufoFwd, pp.forward * md)
      .addScaledVector(_ufoRight, pp.right * md)
      .addScaledVector(_ufoWorldUp, pp.up * md);
    ufoModel.rotation.set(UFO_CONFIG.rot.x, UFO_CONFIG.rot.y, UFO_CONFIG.rot.z);
    ufoModel.visible = true;
    _setUfoOpacity(1);
    /* BIO: Implementation note for this section. */
    ufoActive = false;
    ufoFirstShown = false;
    ufoFlightCount = 0;
    ufoWaitStartMs = performance.now();
    ufoFlightStartMs = 0;
    return;
  }
  const nowMs = performance.now();
  if (!ufoActive) {
    /* BIO: Implementation note for this section. */
    const targetWaitMs = ufoFirstShown
      ? Math.max(0, UFO_CONFIG.intervalSec) * 1000
      : Math.max(0, UFO_CONFIG.initialDelaySec) * 1000;
    if (nowMs - ufoWaitStartMs >= targetWaitMs) {
      ufoFlightCount += 1;
      ufoActive = true;
      ufoFirstShown = true;
      ufoFlightStartMs = nowMs;
      /* BIO: Implementation note for this section. */
      const reverse = ufoFlightCount % 2 === 0;
      _computeUfoEndpoints(reverse);
      ufoModel.visible = true;
      _setUfoOpacity(0);
    } else {
      if (ufoModel.visible) ufoModel.visible = false;
      return;
    }
  }
  const dur = Math.max(0.01, UFO_CONFIG.flightDurationSec);
  const flightSec = (nowMs - ufoFlightStartMs) / 1000;
  const p = Math.min(1, flightSec / dur);
  ufoModel.position.lerpVectors(_ufoStart, _ufoEnd, p);
  if (UFO_CONFIG.wobbleAmp !== 0) {
    const w =
      Math.sin(flightSec * UFO_CONFIG.wobbleFreq * Math.PI * 2) *
      UFO_CONFIG.wobbleAmp *
      ufoMaxDim;
    ufoModel.position.y += w;
  }
  ufoModel.rotation.set(UFO_CONFIG.rot.x, UFO_CONFIG.rot.y, UFO_CONFIG.rot.z);
  /* BIO: Implementation note for this section. */
  const fadeT = Math.max(0.001, UFO_CONFIG.fadeEdgeSec);
  const edgeIn = Math.min(1, flightSec / fadeT);
  const edgeOut = Math.min(1, (dur - flightSec) / fadeT);
  _setUfoOpacity(Math.max(0, Math.min(1, edgeIn * edgeOut)));
  if (p >= 1) {
    ufoActive = false;
    ufoModel.visible = false;
    _setUfoOpacity(0);
    /* BIO: Implementation note for this section. */
    ufoWaitStartMs = nowMs;
  }
}

/* BIO: Shooting-star animation configuration note. */
let shootingStarLine = null;
let shootingStarMaxDim = 0;
let shootingStarReady = false;
let shootingStarActive = false;
let shootingStarFirstShown = false;
let shootingStarWaitStartMs = 0;
let shootingStarStartedMs = 0;
const _ssFwd = new THREE.Vector3();
const _ssRight = new THREE.Vector3();
const _ssWorldUp = new THREE.Vector3(0, 1, 0);
const _ssStart = new THREE.Vector3();
const _ssEnd = new THREE.Vector3();
const _ssDir = new THREE.Vector3();
const _ssLocalX = new THREE.Vector3(1, 0, 0);
const _ssQuat = new THREE.Quaternion();

function addCockpitShootingStar(worldScene, maxDim) {
  if (!SHOOTING_STAR_CONFIG.enabled) return;
  shootingStarMaxDim = maxDim;
  shootingStarWaitStartMs = performance.now();
  shootingStarActive = false;
  shootingStarFirstShown = false;
  /* BIO: Implementation note for this section. */
  const segs = Math.max(4, SHOOTING_STAR_CONFIG.segments | 0);
  const n = segs + 1;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const len = SHOOTING_STAR_CONFIG.lengthMul * maxDim;
  const hc = SHOOTING_STAR_CONFIG.headColor;
  const hr = hc[0] || 1, hg = hc[1] || 1, hb = hc[2] || 1;
  for (let i = 0; i < n; i++) {
    const t = i / segs;
    positions[i * 3 + 0] = -t * len;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
    const f = 1 - t;
    colors[i * 3 + 0] = hr * f;
    colors[i * 3 + 1] = hg * f;
    colors[i * 3 + 2] = hb * f;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 1
  });
  const line = new THREE.Line(geo, mat);
  line.name = 'cockpitShootingStar';
  line.visible = false;
  line.frustumCulled = false;
  line.renderOrder = -5;
  shootingStarLine = line;
  worldScene.add(line);
  shootingStarReady = true;
}

function _spawnShootingStar() {
  if (!camera || !shootingStarLine) return;
  camera.getWorldDirection(_ssFwd);
  _ssRight.copy(_ssFwd).cross(_ssWorldUp);
  if (_ssRight.lengthSq() < 1e-8) _ssRight.set(1, 0, 0);
  _ssRight.normalize();
  const md = shootingStarMaxDim;
  const spread = SHOOTING_STAR_CONFIG.spawnSpreadMul * md;
  const rB = SHOOTING_STAR_CONFIG.spawnBiasRight;
  const uB = SHOOTING_STAR_CONFIG.spawnBiasUp;
  /* BIO: Implementation note for this section. */
  const rx = spread * (rB + (Math.random() - 0.5) * 0.6);
  const uy = spread * (uB + (Math.random() - 0.5) * 0.6);
  const fwd = SHOOTING_STAR_CONFIG.forwardDistMul * md;
  _ssStart
    .copy(camera.position)
    .addScaledVector(_ssFwd, fwd)
    .addScaledVector(_ssRight, rx)
    .addScaledVector(_ssWorldUp, uy);
  /* BIO: Implementation note for this section. */
  const a =
    SHOOTING_STAR_CONFIG.angleMinRad +
    Math.random() *
      (SHOOTING_STAR_CONFIG.angleMaxRad - SHOOTING_STAR_CONFIG.angleMinRad);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  _ssDir
    .set(0, 0, 0)
    .addScaledVector(_ssRight, dx)
    .addScaledVector(_ssWorldUp, dy)
    .normalize();
  const travel = SHOOTING_STAR_CONFIG.travelMul * md;
  _ssEnd.copy(_ssStart).addScaledVector(_ssDir, travel);
  /* BIO: Implementation note for this section. */
  _ssQuat.setFromUnitVectors(_ssLocalX, _ssDir);
  shootingStarLine.quaternion.copy(_ssQuat);
  shootingStarLine.position.copy(_ssStart);
  shootingStarLine.visible = true;
  shootingStarLine.material.opacity = 0;
}

function updateCockpitShootingStar() {
  if (!SHOOTING_STAR_CONFIG.enabled || !shootingStarReady || !shootingStarLine) return;
  const nowMs = performance.now();
  if (!shootingStarActive) {
    const targetWaitMs = shootingStarFirstShown
      ? Math.max(0, SHOOTING_STAR_CONFIG.intervalSec) * 1000
      : Math.max(0, SHOOTING_STAR_CONFIG.initialDelaySec) * 1000;
    if (nowMs - shootingStarWaitStartMs >= targetWaitMs) {
      shootingStarActive = true;
      shootingStarFirstShown = true;
      shootingStarStartedMs = nowMs;
      _spawnShootingStar();
    } else {
      if (shootingStarLine.visible) shootingStarLine.visible = false;
      return;
    }
  }
  const dur = Math.max(0.01, SHOOTING_STAR_CONFIG.durationSec);
  const elapsed = (nowMs - shootingStarStartedMs) / 1000;
  const p = Math.min(1, elapsed / dur);
  shootingStarLine.position.copy(_ssStart).lerp(_ssEnd, p);
  const fadeFrac = Math.max(0.01, Math.min(0.5, SHOOTING_STAR_CONFIG.fadeEdgeFrac));
  const fadeIn = Math.min(1, p / fadeFrac);
  const fadeOut = Math.min(1, (1 - p) / fadeFrac);
  shootingStarLine.material.opacity = Math.max(0, Math.min(1, fadeIn * fadeOut));
  if (p >= 1) {
    shootingStarActive = false;
    shootingStarLine.visible = false;
    shootingStarLine.material.opacity = 0;
    shootingStarWaitStartMs = nowMs;
  }
}

/* BIO: Scroll and navigation behavior note. */

/* BIO: Scroll and navigation behavior note. */
function proScrollMod1(x) {
  return ((x % 1) + 1) % 1;
}

function updateProScrollGroupPosition() {
  if (!proScrollGroup || !proScrollData) return;
  const t = proScrollMod1(proScrollT);
  const { base, right, sideAmp } = proScrollData;
  proScrollGroup.position.copy(base);
  if (
    !proScrollAboutOff ||
    !proScrollProjectsOff ||
    !proScrollHobbiesOff ||
    !proScrollSkillsOff ||
    !proScrollContactOff
  ) {
    return;
  }
  const cA = PRO_SCROLL_T_ABOUT_CENTER;
  const cP = PRO_SCROLL_T_PROJECTS_CENTER;
  const cH = PRO_SCROLL_T_HOBBIES_CENTER;
  const cS = PRO_SCROLL_T_SKILLS_CENTER;
  const cC = PRO_SCROLL_T_CONTACT_CENTER;
  const sA = sideAmp;
  const offL = PRO_SCROLL_OFF_LEFT;
  const RIGHT = sA;
  const CENTER = 0;
  const LEFT = -offL * sA;
  const setX = (off, mult) => off.position.copy(right).multiplyScalar(mult);

  /* BIO: Planet layout, label, and interaction note. */
  const midAP = (cA + cP) * 0.5;
  const midPH = (cP + cH) * 0.5;
  const midHS = (cH + cS) * 0.5;
  const midSC = (cS + cC) * 0.5;

  if (t <= cA) {
    const u = cA <= 1e-6 ? 1 : t / cA;
    setX(proScrollAboutOff, (1 - u) * RIGHT);
    setX(proScrollProjectsOff, RIGHT);
    setX(proScrollHobbiesOff, RIGHT);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= midAP) {
    const u = (t - cA) / (midAP - cA);
    setX(proScrollAboutOff, LEFT * u);
    setX(proScrollProjectsOff, RIGHT);
    setX(proScrollHobbiesOff, RIGHT);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= cP) {
    const u = (t - midAP) / (cP - midAP);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, (1 - u) * RIGHT);
    setX(proScrollHobbiesOff, RIGHT);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= midPH) {
    const u = (t - cP) / (midPH - cP);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, LEFT * u);
    setX(proScrollHobbiesOff, RIGHT);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= cH) {
    const u = (t - midPH) / (cH - midPH);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, (1 - u) * RIGHT);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= midHS) {
    const u = (t - cH) / (midHS - cH);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, LEFT * u);
    setX(proScrollSkillsOff, RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= cS) {
    const u = (t - midHS) / (cS - midHS);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, LEFT);
    setX(proScrollSkillsOff, (1 - u) * RIGHT);
    setX(proScrollContactOff, LEFT);
  } else if (t <= midSC) {
    const u = (t - cS) / (midSC - cS);
    setX(proScrollAboutOff, LEFT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, LEFT);
    setX(proScrollSkillsOff, LEFT * u);
    setX(proScrollContactOff, LEFT);
  } else if (t <= cC) {
    const u = (t - midSC) / (cC - midSC);
    setX(proScrollAboutOff, RIGHT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, LEFT);
    setX(proScrollSkillsOff, LEFT);
    setX(proScrollContactOff, (1 - u) * RIGHT);
  } else {
    const u = (t - cC) / (1 - cC);
    setX(proScrollAboutOff, RIGHT);
    setX(proScrollProjectsOff, LEFT);
    setX(proScrollHobbiesOff, LEFT);
    setX(proScrollSkillsOff, LEFT);
    setX(proScrollContactOff, LEFT * u);
  }
}

function drawAboutLabelToCanvas() {
  if (!aboutLabelSprite || !aboutLabelSprite.userData._canvas) return;
  const cnv = aboutLabelSprite.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  ctx.fillStyle = 'rgba(237, 99, 0, 0.98)';
  ctx.font = '600 40px "Share Tech Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(237, 99, 0, 0.45)';
  ctx.shadowBlur = 14;
  ctx.fillText(aboutLabelText, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = aboutLabelSprite.userData._map;
  if (m) m.needsUpdate = true;
}

function drawProjectsLabelToCanvas() {
  if (!projectsLabelSprite || !projectsLabelSprite.userData._canvas) return;
  const cnv = projectsLabelSprite.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  ctx.fillStyle = 'rgba(255, 0, 110, 0.98)';
  ctx.font = '600 40px "Share Tech Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255, 0, 110, 0.45)';
  ctx.shadowBlur = 14;
  ctx.fillText(projectsLabelText, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = projectsLabelSprite.userData._map;
  if (m) m.needsUpdate = true;
}

function drawHobbiesLabelToCanvas() {
  if (!hobbiesLabelSprite || !hobbiesLabelSprite.userData._canvas) return;
  const cnv = hobbiesLabelSprite.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  ctx.fillStyle = 'rgba(153, 223, 172, 0.98)';
  ctx.font = '600 40px "Share Tech Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(100, 200, 150, 0.45)';
  ctx.shadowBlur = 14;
  ctx.fillText(hobbiesLabelText, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = hobbiesLabelSprite.userData._map;
  if (m) m.needsUpdate = true;
}

function drawSkillsLabelToCanvas() {
  if (!skillsLabelSprite || !skillsLabelSprite.userData._canvas) return;
  const cnv = skillsLabelSprite.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  const text = skillsLabelText;
  let fs = 40;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(199, 15, 205, 0.98)';
  ctx.shadowColor = 'rgba(199, 15, 205, 0.45)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = skillsLabelSprite.userData._map;
  if (m) m.needsUpdate = true;
}

function drawContactLabelToCanvas() {
  if (!contactLabelSprite || !contactLabelSprite.userData._canvas) return;
  const cnv = contactLabelSprite.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  const text = contactLabelText;
  let fs = 40;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(255, 238, 0, 0.98)';
  ctx.shadowColor = 'rgba(255, 238, 0, 0.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = contactLabelSprite.userData._map;
  if (m) m.needsUpdate = true;
}

/* BIO: Planet layout, label, and interaction note. */
function buildProAboutSubPlanet(r, subId) {
  const segs = 48;
  const geo = new THREE.SphereGeometry(r, segs, segs);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const p = new THREE.Vector3();
  const seed = subId === 'edu' ? 1.1 : subId === 'exp' ? 2.3 : 3.7;
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    p.copy(v).normalize();
    const t =
      0.09 * Math.sin(p.x * 5.3 + seed) * Math.cos(p.z * 6.1 + seed * 0.4) +
      0.05 * Math.sin(p.y * 8.7 + seed * 1.1) +
      0.03 * Math.cos((p.x + p.z) * 10 + seed);
    const s = 1 + t * 0.4;
    v.copy(p).multiplyScalar(r * s);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const hexCore = subId === 'edu' ? 0xffb060 : subId === 'exp' ? 0xff8030 : 0xed6300;
  const mat = new THREE.MeshStandardMaterial({
    color: hexCore,
    emissive: 0x401810,
    emissiveIntensity: 0.35,
    metalness: 0.08,
    roughness: 0.5
  });
  mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
  mat.userData._hoverBaseEi = mat.emissiveIntensity;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'proAboutSubPlanet_' + subId;
  mesh.userData.proPlanetId = 'about';
  mesh.userData.proSubId = subId;
  return mesh;
}

/* BIO: Map overlay behavior and interaction note. */
function applyProAboutSubPlanetTexture(mesh) {
  if (!mesh || !mesh.userData.proSubId) return;
  const url = PRO_ABOUT_SUB_TEXTURE_URL[mesh.userData.proSubId];
  if (!url) return;
  loadProRgbTexturePreferKtx2(
    url,
    tex => {
      if (!mesh.parent) {
        tex.dispose();
        return;
      }
      if (!mesh.isMesh || !mesh.material) {
        tex.dispose();
        return;
      }
      const mat = mesh.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x352010);
      mat.emissiveIntensity = 0.22;
      mat.metalness = 0.08;
      mat.roughness = 0.48;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

const PRO_PROJECTS_SUB_BASE_HEX = 0xe93383;
const PRO_PROJECTS_SUB_EMISSIVE_HEX = 0x601838;

/* BIO: Planet layout, label, and interaction note. */
function buildProProjectsSubPlanet(r, subId) {
  const segs = 48;
  const geo = new THREE.SphereGeometry(r, segs, segs);
  const mat = new THREE.MeshStandardMaterial({
    color: PRO_PROJECTS_SUB_BASE_HEX,
    emissive: PRO_PROJECTS_SUB_EMISSIVE_HEX,
    emissiveIntensity: 0.36,
    metalness: 0.08,
    roughness: 0.45
  });
  mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
  mat.userData._hoverBaseEi = mat.emissiveIntensity;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'proProjectsSubPlanet_' + subId;
  mesh.userData.proPlanetId = 'projects';
  mesh.userData.proSubId = subId;
  return mesh;
}

function applyProProjectsSubPlanetTexture(mesh) {
  if (!mesh || !mesh.userData.proSubId) return;
  const url = PRO_PROJECTS_SUB_TEXTURE_URL[mesh.userData.proSubId];
  if (!url) return;
  loadProRgbTexturePreferKtx2(
    url,
    tex => {
      if (!mesh.parent) {
        tex.dispose();
        return;
      }
      if (!mesh.isMesh || !mesh.material) {
        tex.dispose();
        return;
      }
      const mat = mesh.material;
      if (mat.map) mat.map.dispose();
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0x401028);
      mat.emissiveIntensity = 0.22;
      mat.metalness = 0.08;
      mat.roughness = 0.48;
      mat.needsUpdate = true;
      mat.userData._hoverBaseE = new THREE.Color().copy(mat.emissive);
      mat.userData._hoverBaseEi = mat.emissiveIntensity;
    },
    undefined,
    () => {}
  );
}

function drawAboutSubLabelToCanvas(spr, text) {
  if (!spr || !spr.userData._canvas) return;
  const cnv = spr.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  let fs = 38;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(255, 190, 120, 0.98)';
  ctx.shadowColor = 'rgba(237, 99, 0, 0.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = spr.userData._map;
  if (m) m.needsUpdate = true;
}

function drawAllAboutSubLabelCanvases() {
  for (const g of proAboutSubGroups) {
    if (!g || !g.labelSprite || !g.subId) continue;
    const txt = proAboutSubLabelTexts[g.subId] || '';
    drawAboutSubLabelToCanvas(g.labelSprite, txt);
  }
}

function drawProjectsSubLabelToCanvas(spr, text) {
  if (!spr || !spr.userData._canvas) return;
  const cnv = spr.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  let fs = 38;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(255, 200, 230, 0.98)';
  ctx.shadowColor = 'rgba(233, 51, 131, 0.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = spr.userData._map;
  if (m) m.needsUpdate = true;
}

function drawAllProjectsSubLabelCanvases() {
  for (const g of proProjectsSubGroups) {
    if (!g || !g.labelSprite || !g.subId) continue;
    const txt = proProjectsSubLabelTexts[g.subId] || '';
    drawProjectsSubLabelToCanvas(g.labelSprite, txt);
  }
}

function drawHobbiesSubLabelToCanvas(spr, text) {
  if (!spr || !spr.userData._canvas) return;
  const cnv = spr.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  let fs = 38;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(200, 255, 220, 0.98)';
  ctx.shadowColor = 'rgba(100, 200, 150, 0.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = spr.userData._map;
  if (m) m.needsUpdate = true;
}

function drawAllHobbiesSubLabelCanvases() {
  for (const g of proHobbiesSubGroups) {
    if (!g || !g.labelSprite || !g.subId) continue;
    const txt = proHobbiesSubLabelTexts[g.subId] || '';
    drawHobbiesSubLabelToCanvas(g.labelSprite, txt);
  }
}

function drawSkillsSubLabelToCanvas(spr, text) {
  if (!spr || !spr.userData._canvas) return;
  const cnv = spr.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  let fs = 38;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(250, 200, 255, 0.98)';
  ctx.shadowColor = 'rgba(199, 15, 205, 0.55)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = spr.userData._map;
  if (m) m.needsUpdate = true;
}

function drawAllSkillsSubLabelCanvases() {
  for (const g of proSkillsSubGroups) {
    if (!g || !g.labelSprite || !g.subId) continue;
    const txt = proSkillsSubLabelTexts[g.subId] || '';
    drawSkillsSubLabelToCanvas(g.labelSprite, txt);
  }
}

function drawContactSubLabelToCanvas(spr, text) {
  if (!spr || !spr.userData._canvas) return;
  const cnv = spr.userData._canvas;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const wC = PRO_LABEL_SPRITE_LOGICAL_W;
  const hC = PRO_LABEL_SPRITE_LOGICAL_H;
  ctx.clearRect(0, 0, wC, hC);
  let fs = 38;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (; fs >= 12; fs -= 1) {
    ctx.font = `600 ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(text).width <= wC * 0.92) break;
  }
  ctx.fillStyle = 'rgba(255, 238, 0, 0.98)';
  ctx.shadowColor = 'rgba(255, 238, 0, 0.5)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, wC * 0.5, hC * 0.5);
  ctx.shadowBlur = 0;
  const m = spr.userData._map;
  if (m) m.needsUpdate = true;
}

function drawAllContactSubLabelCanvases() {
  for (const g of proContactSubGroups) {
    if (!g || !g.labelSprite || !g.subId) continue;
    const txt = proContactSubLabelTexts[g.subId] || '';
    drawContactSubLabelToCanvas(g.labelSprite, txt);
  }
}

/* BIO: Implementation note for this section. */
function smoothStep01(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/* BIO: Pro Mode integration note. */
const PRO_DIVE_OVERLAY = {
  revealFadeOutDur: 0.45
};
let _proDiveOverlayEl = null;

function ensureProDiveOverlay() {
  if (_proDiveOverlayEl && _proDiveOverlayEl.isConnected) return _proDiveOverlayEl;
  if (typeof document === 'undefined' || !document.body) return null;
  let el = document.getElementById('pro-dive-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pro-dive-overlay';
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '2147483600';
    el.style.background = 'rgba(0,0,0,0)';
    el.style.opacity = '1';
    el.style.transition = 'none';
    el.style.willChange = 'background-color';
    document.body.appendChild(el);
  }
  _proDiveOverlayEl = el;
  return el;
}

/* BIO: Implementation note for this section. */
function setProDiveOverlay(blackA) {
  const el = ensureProDiveOverlay();
  if (!el) return;
  const a = Math.max(0, Math.min(1, blackA));
  if (a <= 0.001) {
    el.style.background = 'rgba(0,0,0,0)';
    return;
  }
  el.style.background = 'rgba(0,0,0,' + a.toFixed(3) + ')';
}

function clearProDiveOverlay() {
  if (!_proDiveOverlayEl) return;
  _proDiveOverlayEl.style.background = 'rgba(0,0,0,0)';
}

/* BIO: Cockpit layout, rendering, and interaction note. */

const PRO_SUB_LIGHT_PULSE_CONFIG = {
  /* BIO: Planet layout, label, and interaction note. */
  enabledFor: new Set([
    'about/edu', 'about/exp', 'about/bio',
    'projects/web', 'projects/mob', 'projects/back',
    'hobbies/esp', 'hobbies/sht', 'hobbies/tec', 'hobbies/trv',
    'skills/ai', 'skills/sec',
    'contact/mail', 'contact/soc'
  ]),
  /* BIO: Implementation note for this section. */
  peakAlpha: 0.10,
  /* BIO: Implementation note for this section. */
  attackMs: 90,
  /* BIO: Doruk bekleme (ms). */
  holdMs: 40,
  /* BIO: Implementation note for this section. */
  decayMs: 420
};

let _proSubLightOverlayEl = null;
let _proSubLightPulseTimer = null;

function _parseHexToRgbLocal(hex) {
  if (!hex) return { r: 255, g: 255, b: 255 };
  let s = String(hex).trim().replace('#', '');
  if (s.length === 3) s = s.split('').map(c => c + c).join('');
  const n = parseInt(s, 16);
  if (!Number.isFinite(n)) return { r: 255, g: 255, b: 255 };
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

function ensureProSubLightOverlay() {
  if (_proSubLightOverlayEl && _proSubLightOverlayEl.isConnected) return _proSubLightOverlayEl;
  if (typeof document === 'undefined' || !document.body) return null;
  let el = document.getElementById('pro-sub-light-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pro-sub-light-overlay';
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.pointerEvents = 'none';
    /* BIO: Hologram panel behavior and rendering note. */
    el.style.zIndex = '2147483650';
    el.style.backgroundColor = 'rgba(255,255,255,0)';
    el.style.transition = 'none';
    el.style.willChange = 'background-color';
    el.style.mixBlendMode = 'screen';
    document.body.appendChild(el);
  }
  _proSubLightOverlayEl = el;
  return el;
}

/* BIO: Implementation note for this section. */
function triggerProSubLightPulse(themeHex) {
  if (reduceMotion) return;
  const el = ensureProSubLightOverlay();
  if (!el) return;
  const rgb = _parseHexToRgbLocal(themeHex);
  const cfg = PRO_SUB_LIGHT_PULSE_CONFIG;
  if (_proSubLightPulseTimer) {
    clearTimeout(_proSubLightPulseTimer);
    _proSubLightPulseTimer = null;
  }
  el.style.transition = 'none';
  el.style.backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)';
  /* BIO: Implementation note for this section. */
  void el.offsetHeight;
  el.style.transition = 'background-color ' + cfg.attackMs + 'ms ease-out';
  el.style.backgroundColor =
    'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + cfg.peakAlpha.toFixed(3) + ')';
  _proSubLightPulseTimer = setTimeout(() => {
    el.style.transition = 'background-color ' + cfg.decayMs + 'ms ease-out';
    el.style.backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)';
    _proSubLightPulseTimer = null;
  }, cfg.attackMs + cfg.holdMs);
}

/* BIO: Implementation note for this section. */
function clearProSubLightPulse() {
  if (_proSubLightPulseTimer) {
    clearTimeout(_proSubLightPulseTimer);
    _proSubLightPulseTimer = null;
  }
  if (_proSubLightOverlayEl) {
    _proSubLightOverlayEl.style.transition = 'none';
    _proSubLightOverlayEl.style.backgroundColor = 'rgba(255,255,255,0)';
  }
}

/* BIO: Planet layout, label, and interaction note. */
function updateProDiveOverlayForMode(mode, u) {
  if (mode === 'dive') {
    setProDiveOverlay(smoothStep01(u));
  } else if (mode === 'reveal') {
    const fadeDur = Math.max(0.001, PRO_DIVE_OVERLAY.revealFadeOutDur);
    const fu = Math.min(1, u / fadeDur);
    setProDiveOverlay(1 - smoothStep01(fu));
  } else {
    clearProDiveOverlay();
  }
}

/* BIO: Planet layout, label, and interaction note. */
function startProAboutExpandSequence() {
  if (!aboutDiveGroup || !aboutMainShell || !aboutSubRoot) return;
  if (proAboutMode !== 'idle') return;
  if (proProjectsMode !== 'idle') return;
  if (proHobbiesMode !== 'idle') return;
  if (proSkillsMode !== 'idle') return;
  if (proContactMode !== 'idle') return;
  proAboutMode = 'dive';
  proAboutAnim.t = 0;
  proAboutAnim.duration = reduceMotion ? 0.001 : 0.55;
  proAboutScrollLocked = true;
  setCockpitUiThemeId('about');
  if (aboutBackMesh) {
    aboutBackMesh.visible = true;
    if (aboutBackMesh.userData) aboutBackMesh.userData._uiHoverF = 0;
  }
  aboutMainShell.visible = true;
  aboutSubRoot.visible = false;
  for (const g of proAboutSubGroups) {
    if (!g || !g.group) continue;
    g.group.scale.setScalar(0.001);
    g.group.visible = false;
  }
  if (reduceMotion) {
    aboutMainShell.visible = false;
    aboutSubRoot.visible = true;
    for (const g of proAboutSubGroups) {
      if (!g || !g.group) continue;
      g.group.position.copy(g.targetPos);
      g.group.scale.setScalar(1);
      g.group.visible = true;
    }
    aboutDiveGroup.position.set(0, 0, 0);
    aboutDiveGroup.scale.setScalar(1);
    proAboutMode = 'ready';
  }
}

/* BIO: Planet layout, label, and interaction note. */
function startProAboutRetreatSequence() {
  if (!aboutDiveGroup || !aboutMainShell || !aboutSubRoot) {
    finishProAboutRetreat();
    return;
  }
  if (proAboutMode !== 'ready') return;
  if (proSubMode !== 'idle') return;
  playProPlanetGoBackSfx();
  if (reduceMotion) {
    finishProAboutRetreat();
    return;
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  proAboutMode = 'foldSubs';
  proAboutAnim.t = 0;
  proAboutAnim.duration = 0.6;
  /* BIO: Scroll and navigation behavior note. */
}

function finishProAboutRetreat() {
  if (!aboutDiveGroup || !aboutMainShell || !aboutSubRoot) {
    proAboutMode = 'idle';
    proAboutScrollLocked = false;
    proAboutAnim.t = 0;
    setCockpitUiThemeId('default');
    if (aboutBackMesh) aboutBackMesh.visible = false;
    clearProDiveOverlay();
    return;
  }
  proAboutMode = 'idle';
  proAboutScrollLocked = false;
  proAboutAnim.t = 0;
  aboutDiveGroup.position.set(0, 0, 0);
  aboutDiveGroup.scale.setScalar(1);
  aboutMainShell.visible = true;
  aboutSubRoot.visible = false;
  for (const g of proAboutSubGroups) {
    if (!g || !g.group) continue;
    g.group.visible = false;
    g.group.scale.setScalar(0.001);
    g.group.position.set(0, 0, 0);
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  setCockpitUiThemeId('default');
  clearProDiveOverlay();
}

function updateProAboutExpandAnim(dt) {
  if (!aboutDiveGroup || !aboutMainShell || !aboutSubRoot) return;
  if (proAboutMode === 'idle' || proAboutMode === 'ready') return;
  proAboutAnim.t = Math.min(proAboutAnim.duration, proAboutAnim.t + dt);
  const u = proAboutAnim.duration > 0 ? proAboutAnim.t / proAboutAnim.duration : 1;
  updateProDiveOverlayForMode(proAboutMode, u);
  if (proAboutMode === 'dive') {
    const e = smoothStep01(u);
    /* BIO: Planet layout, label, and interaction note. */
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * e;
    aboutDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      proAboutMode = 'reveal';
      proAboutAnim.t = 0;
      proAboutAnim.duration = reduceMotion ? 0.001 : 0.6;
      aboutMainShell.visible = false;
      aboutSubRoot.visible = true;
      for (const g of proAboutSubGroups) {
        if (!g || !g.group) continue;
        g.group.visible = true;
        g.group.scale.setScalar(0.001);
      }
    }
  } else if (proAboutMode === 'reveal') {
    const n = Math.max(1, proAboutSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proAboutSubGroups.length; i += 1) {
      const g = proAboutSubGroups[i];
      if (!g || !g.group) continue;
      const delay = (i / n) * staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (1 - staggerMax || 0.001)));
      const e = smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(
        g.targetPos.x * e,
        g.targetPos.y * e,
        g.targetPos.z * e
      );
    }
    if (u >= 1) {
      for (const g of proAboutSubGroups) {
        if (!g || !g.group) continue;
        g.group.position.copy(g.targetPos);
        g.group.scale.setScalar(1);
      }
      proAboutMode = 'ready';
    }
  } else if (proAboutMode === 'foldSubs') {
    /* BIO: Planet layout, label, and interaction note. */
    const n = Math.max(1, proAboutSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proAboutSubGroups.length; i += 1) {
      const g = proAboutSubGroups[i];
      if (!g || !g.group) continue;
      const delay = ((n - 1 - i) / n) * staggerMax;
      const denom = 1 - staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (denom || 0.001)));
      const e = 1 - smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(
        g.targetPos.x * e,
        g.targetPos.y * e,
        g.targetPos.z * e
      );
    }
    if (u >= 1) {
      for (const g of proAboutSubGroups) {
        if (!g || !g.group) continue;
        g.group.scale.setScalar(0.001);
        g.group.position.set(0, 0, 0);
        g.group.visible = false;
      }
      aboutSubRoot.visible = false;
      aboutMainShell.visible = true;
      proAboutMode = 'undive';
      proAboutAnim.t = 0;
      proAboutAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proAboutMode === 'undive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * (1 - e);
    aboutDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      finishProAboutRetreat();
    }
  }
}

/* BIO: Implementation note for this section. */
function resetProAboutExpand() {
  finishProAboutRetreat();
}

function resetProProjectsExpand() {
  finishProProjectsRetreat();
}

function resetProHobbiesExpand() {
  finishProHobbiesRetreat();
}

function resetProSkillsExpand() {
  finishProSkillsRetreat();
}

function resetProContactExpand() {
  finishProContactRetreat();
}

function startProProjectsExpandSequence() {
  if (!projectsDiveGroup || !projectsMainShell || !projectsSubRoot) return;
  if (proProjectsMode !== 'idle') return;
  if (proAboutMode !== 'idle') return;
  if (proHobbiesMode !== 'idle') return;
  if (proSkillsMode !== 'idle') return;
  if (proContactMode !== 'idle') return;
  proProjectsMode = 'dive';
  proProjectsAnim.t = 0;
  proProjectsAnim.duration = reduceMotion ? 0.001 : 0.55;
  proProjectsScrollLocked = true;
  setCockpitUiThemeId('projects');
  if (aboutBackMesh) {
    aboutBackMesh.visible = true;
    if (aboutBackMesh.userData) aboutBackMesh.userData._uiHoverF = 0;
  }
  projectsMainShell.visible = true;
  projectsSubRoot.visible = false;
  for (const g of proProjectsSubGroups) {
    if (!g || !g.group) continue;
    g.group.scale.setScalar(0.001);
    g.group.visible = false;
  }
  if (reduceMotion) {
    projectsMainShell.visible = false;
    projectsSubRoot.visible = true;
    for (const g of proProjectsSubGroups) {
      if (!g || !g.group) continue;
      g.group.position.copy(g.targetPos);
      g.group.scale.setScalar(1);
      g.group.visible = true;
    }
    projectsDiveGroup.position.set(0, 0, 0);
    projectsDiveGroup.scale.setScalar(1);
    proProjectsMode = 'ready';
  }
}

function startProProjectsRetreatSequence() {
  if (!projectsDiveGroup || !projectsMainShell || !projectsSubRoot) {
    finishProProjectsRetreat();
    return;
  }
  if (proProjectsMode !== 'ready') return;
  if (proSubMode !== 'idle') return;
  playProPlanetGoBackSfx();
  if (reduceMotion) {
    finishProProjectsRetreat();
    return;
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  proProjectsMode = 'foldSubs';
  proProjectsAnim.t = 0;
  proProjectsAnim.duration = 0.6;
}

function finishProProjectsRetreat() {
  if (!projectsDiveGroup || !projectsMainShell || !projectsSubRoot) {
    proProjectsMode = 'idle';
    proProjectsScrollLocked = false;
    proProjectsAnim.t = 0;
    setCockpitUiThemeId('default');
    if (aboutBackMesh) aboutBackMesh.visible = false;
    clearProDiveOverlay();
    return;
  }
  proProjectsMode = 'idle';
  proProjectsScrollLocked = false;
  proProjectsAnim.t = 0;
  projectsDiveGroup.position.set(0, 0, 0);
  projectsDiveGroup.scale.setScalar(1);
  projectsMainShell.visible = true;
  projectsSubRoot.visible = false;
  for (const g of proProjectsSubGroups) {
    if (!g || !g.group) continue;
    g.group.visible = false;
    g.group.scale.setScalar(0.001);
    g.group.position.set(0, 0, 0);
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  setCockpitUiThemeId('default');
  clearProDiveOverlay();
}

function updateProProjectsExpandAnim(dt) {
  if (!projectsDiveGroup || !projectsMainShell || !projectsSubRoot) return;
  if (proProjectsMode === 'idle' || proProjectsMode === 'ready') return;
  proProjectsAnim.t = Math.min(proProjectsAnim.duration, proProjectsAnim.t + dt);
  const u = proProjectsAnim.duration > 0 ? proProjectsAnim.t / proProjectsAnim.duration : 1;
  updateProDiveOverlayForMode(proProjectsMode, u);
  if (proProjectsMode === 'dive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * e;
    projectsDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      proProjectsMode = 'reveal';
      proProjectsAnim.t = 0;
      proProjectsAnim.duration = reduceMotion ? 0.001 : 0.6;
      projectsMainShell.visible = false;
      projectsSubRoot.visible = true;
      for (const g of proProjectsSubGroups) {
        if (!g || !g.group) continue;
        g.group.visible = true;
        g.group.scale.setScalar(0.001);
      }
    }
  } else if (proProjectsMode === 'reveal') {
    const n = Math.max(1, proProjectsSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proProjectsSubGroups.length; i += 1) {
      const g = proProjectsSubGroups[i];
      if (!g || !g.group) continue;
      const delay = (i / n) * staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (1 - staggerMax || 0.001)));
      const e = smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proProjectsSubGroups) {
        if (!g || !g.group) continue;
        g.group.position.copy(g.targetPos);
        g.group.scale.setScalar(1);
      }
      proProjectsMode = 'ready';
    }
  } else if (proProjectsMode === 'foldSubs') {
    const n = Math.max(1, proProjectsSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proProjectsSubGroups.length; i += 1) {
      const g = proProjectsSubGroups[i];
      if (!g || !g.group) continue;
      const delay = ((n - 1 - i) / n) * staggerMax;
      const denom = 1 - staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (denom || 0.001)));
      const e = 1 - smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proProjectsSubGroups) {
        if (!g || !g.group) continue;
        g.group.scale.setScalar(0.001);
        g.group.position.set(0, 0, 0);
        g.group.visible = false;
      }
      projectsSubRoot.visible = false;
      projectsMainShell.visible = true;
      proProjectsMode = 'undive';
      proProjectsAnim.t = 0;
      proProjectsAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proProjectsMode === 'undive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * (1 - e);
    projectsDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      finishProProjectsRetreat();
    }
  }
}

function startProHobbiesExpandSequence() {
  if (!hobbiesDiveGroup || !hobbiesMainShell || !hobbiesSubRoot) return;
  if (proHobbiesMode !== 'idle') return;
  if (proAboutMode !== 'idle') return;
  if (proProjectsMode !== 'idle') return;
  if (proSkillsMode !== 'idle') return;
  if (proContactMode !== 'idle') return;
  proHobbiesMode = 'dive';
  proHobbiesAnim.t = 0;
  proHobbiesAnim.duration = reduceMotion ? 0.001 : 0.55;
  proHobbiesScrollLocked = true;
  setCockpitUiThemeId('hobbies');
  if (aboutBackMesh) {
    aboutBackMesh.visible = true;
    if (aboutBackMesh.userData) aboutBackMesh.userData._uiHoverF = 0;
  }
  hobbiesMainShell.visible = true;
  hobbiesSubRoot.visible = false;
  for (const g of proHobbiesSubGroups) {
    if (!g || !g.group) continue;
    g.group.scale.setScalar(0.001);
    g.group.visible = false;
  }
  if (reduceMotion) {
    hobbiesMainShell.visible = false;
    hobbiesSubRoot.visible = true;
    for (const g of proHobbiesSubGroups) {
      if (!g || !g.group) continue;
      g.group.position.copy(g.targetPos);
      g.group.scale.setScalar(1);
      g.group.visible = true;
    }
    hobbiesDiveGroup.position.set(0, 0, 0);
    hobbiesDiveGroup.scale.setScalar(1);
    proHobbiesMode = 'ready';
  }
}

function startProHobbiesRetreatSequence() {
  if (!hobbiesDiveGroup || !hobbiesMainShell || !hobbiesSubRoot) {
    finishProHobbiesRetreat();
    return;
  }
  if (proHobbiesMode !== 'ready') return;
  if (proSubMode !== 'idle') return;
  playProPlanetGoBackSfx();
  if (reduceMotion) {
    finishProHobbiesRetreat();
    return;
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  proHobbiesMode = 'foldSubs';
  proHobbiesAnim.t = 0;
  proHobbiesAnim.duration = 0.6;
}

function finishProHobbiesRetreat() {
  if (!hobbiesDiveGroup || !hobbiesMainShell || !hobbiesSubRoot) {
    proHobbiesMode = 'idle';
    proHobbiesScrollLocked = false;
    proHobbiesAnim.t = 0;
    setCockpitUiThemeId('default');
    if (aboutBackMesh) aboutBackMesh.visible = false;
    clearProDiveOverlay();
    return;
  }
  proHobbiesMode = 'idle';
  proHobbiesScrollLocked = false;
  proHobbiesAnim.t = 0;
  hobbiesDiveGroup.position.set(0, 0, 0);
  hobbiesDiveGroup.scale.setScalar(1);
  hobbiesMainShell.visible = true;
  hobbiesSubRoot.visible = false;
  for (const g of proHobbiesSubGroups) {
    if (!g || !g.group) continue;
    g.group.visible = false;
    g.group.scale.setScalar(0.001);
    g.group.position.set(0, 0, 0);
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  setCockpitUiThemeId('default');
  clearProDiveOverlay();
}

function updateProHobbiesExpandAnim(dt) {
  if (!hobbiesDiveGroup || !hobbiesMainShell || !hobbiesSubRoot) return;
  if (proHobbiesMode === 'idle' || proHobbiesMode === 'ready') return;
  proHobbiesAnim.t = Math.min(proHobbiesAnim.duration, proHobbiesAnim.t + dt);
  const u = proHobbiesAnim.duration > 0 ? proHobbiesAnim.t / proHobbiesAnim.duration : 1;
  updateProDiveOverlayForMode(proHobbiesMode, u);
  if (proHobbiesMode === 'dive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * e;
    hobbiesDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      proHobbiesMode = 'reveal';
      proHobbiesAnim.t = 0;
      proHobbiesAnim.duration = reduceMotion ? 0.001 : 0.6;
      hobbiesMainShell.visible = false;
      hobbiesSubRoot.visible = true;
      for (const g of proHobbiesSubGroups) {
        if (!g || !g.group) continue;
        g.group.visible = true;
        g.group.scale.setScalar(0.001);
      }
    }
  } else if (proHobbiesMode === 'reveal') {
    const n = Math.max(1, proHobbiesSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proHobbiesSubGroups.length; i += 1) {
      const g = proHobbiesSubGroups[i];
      if (!g || !g.group) continue;
      const delay = (i / n) * staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (1 - staggerMax || 0.001)));
      const e = smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proHobbiesSubGroups) {
        if (!g || !g.group) continue;
        g.group.position.copy(g.targetPos);
        g.group.scale.setScalar(1);
      }
      proHobbiesMode = 'ready';
    }
  } else if (proHobbiesMode === 'foldSubs') {
    const n = Math.max(1, proHobbiesSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proHobbiesSubGroups.length; i += 1) {
      const g = proHobbiesSubGroups[i];
      if (!g || !g.group) continue;
      const delay = ((n - 1 - i) / n) * staggerMax;
      const denom = 1 - staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (denom || 0.001)));
      const e = 1 - smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proHobbiesSubGroups) {
        if (!g || !g.group) continue;
        g.group.scale.setScalar(0.001);
        g.group.position.set(0, 0, 0);
        g.group.visible = false;
      }
      hobbiesSubRoot.visible = false;
      hobbiesMainShell.visible = true;
      proHobbiesMode = 'undive';
      proHobbiesAnim.t = 0;
      proHobbiesAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proHobbiesMode === 'undive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * (1 - e);
    hobbiesDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      finishProHobbiesRetreat();
    }
  }
}

function applyProHobbiesHoverMaterial(material, f, isMain) {
  if (!material || f <= 0) {
    if (material && material.userData && material.userData._hoverBaseE) {
      material.emissive.copy(material.userData._hoverBaseE);
      material.emissiveIntensity = material.userData._hoverBaseEi;
    }
    return;
  }
  if (!material.userData._hoverBaseE) {
    material.userData._hoverBaseE = new THREE.Color().copy(material.emissive);
    material.userData._hoverBaseEi = material.emissiveIntensity;
  }
  const t = Math.min(1, f);
  const bMul = isMain ? 1.5 : 1.32;
  const bi = material.userData._hoverBaseEi * bMul;
  material.emissive
    .copy(material.userData._hoverBaseE)
    .lerp(_proHobbiesHoverHi, t * 0.62);
  material.emissiveIntensity = THREE.MathUtils.lerp(
    material.userData._hoverBaseEi,
    bi,
    t
  );
}

function updateProHobbiesPlanetHoverVisuals(dt) {
  if (!proScrollGroup || !proScrollData) return;
  const tgt = _proHobbiesHoverTarget;
  const wantH =
    tgt === hobbiesPlanetMesh &&
    proHobbiesMode === 'idle' &&
    hobbiesMainShell &&
    hobbiesMainShell.visible;
  const fH = hobbiesPlanetMesh ? lerpProAboutHoverFactor(hobbiesPlanetMesh, wantH, dt) : 0;
  if (proHobbiesMode === 'idle' && hobbiesPlanetMesh) {
    hobbiesPlanetMesh.scale.setScalar(1 + PRO_ABOUT_MAIN_HOVER_SCALE * fH);
    const c = hobbiesPlanetMesh.getObjectByName('hobbiesCore');
    if (c && c.material) applyProHobbiesHoverMaterial(c.material, fH, true);
  } else if (hobbiesPlanetMesh) {
    hobbiesPlanetMesh.scale.setScalar(1);
    const c0 = hobbiesPlanetMesh.getObjectByName('hobbiesCore');
    if (c0 && c0.material) applyProHobbiesHoverMaterial(c0.material, 0, true);
  }
  for (const g of proHobbiesSubGroups) {
    if (!g || !g.mesh || !g.group) continue;
    const wantS = tgt === g.mesh && proHobbiesMode === 'ready' && proSubMode === 'idle';
    const fG = lerpProAboutHoverFactor(g.mesh, wantS, dt);
    if (proHobbiesMode === 'ready' && proSubMode === 'idle' && g.group.parent && g.group.visible) {
      g.group.scale.setScalar(1 + PRO_ABOUT_SUB_HOVER_SCALE * fG);
      if (g.mesh.material) applyProHobbiesHoverMaterial(g.mesh.material, fG, false);
    } else if (g.mesh.material) {
      applyProHobbiesHoverMaterial(g.mesh.material, 0, false);
    }
  }
}

function startProSkillsExpandSequence() {
  if (!skillsDiveGroup || !skillsMainShell || !skillsSubRoot) return;
  if (proSkillsMode !== 'idle') return;
  if (proAboutMode !== 'idle') return;
  if (proProjectsMode !== 'idle') return;
  if (proHobbiesMode !== 'idle') return;
  if (proContactMode !== 'idle') return;
  proSkillsMode = 'dive';
  proSkillsAnim.t = 0;
  proSkillsAnim.duration = reduceMotion ? 0.001 : 0.55;
  proSkillsScrollLocked = true;
  setCockpitUiThemeId('skills');
  if (aboutBackMesh) {
    aboutBackMesh.visible = true;
    if (aboutBackMesh.userData) aboutBackMesh.userData._uiHoverF = 0;
  }
  skillsMainShell.visible = true;
  skillsSubRoot.visible = false;
  for (const g of proSkillsSubGroups) {
    if (!g || !g.group) continue;
    g.group.scale.setScalar(0.001);
    g.group.visible = false;
  }
  if (reduceMotion) {
    skillsMainShell.visible = false;
    skillsSubRoot.visible = true;
    for (const g of proSkillsSubGroups) {
      if (!g || !g.group) continue;
      g.group.position.copy(g.targetPos);
      g.group.scale.setScalar(1);
      g.group.visible = true;
    }
    skillsDiveGroup.position.set(0, 0, 0);
    skillsDiveGroup.scale.setScalar(1);
    proSkillsMode = 'ready';
  }
}

function startProSkillsRetreatSequence() {
  if (!skillsDiveGroup || !skillsMainShell || !skillsSubRoot) {
    finishProSkillsRetreat();
    return;
  }
  if (proSkillsMode !== 'ready') return;
  if (proSubMode !== 'idle') return;
  playProPlanetGoBackSfx();
  if (reduceMotion) {
    finishProSkillsRetreat();
    return;
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  proSkillsMode = 'foldSubs';
  proSkillsAnim.t = 0;
  proSkillsAnim.duration = 0.6;
}

function finishProSkillsRetreat() {
  if (!skillsDiveGroup || !skillsMainShell || !skillsSubRoot) {
    proSkillsMode = 'idle';
    proSkillsScrollLocked = false;
    proSkillsAnim.t = 0;
    setCockpitUiThemeId('default');
    if (aboutBackMesh) aboutBackMesh.visible = false;
    clearProDiveOverlay();
    return;
  }
  proSkillsMode = 'idle';
  proSkillsScrollLocked = false;
  proSkillsAnim.t = 0;
  skillsDiveGroup.position.set(0, 0, 0);
  skillsDiveGroup.scale.setScalar(1);
  skillsMainShell.visible = true;
  skillsSubRoot.visible = false;
  for (const g of proSkillsSubGroups) {
    if (!g || !g.group) continue;
    g.group.visible = false;
    g.group.scale.setScalar(0.001);
    g.group.position.set(0, 0, 0);
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  setCockpitUiThemeId('default');
  clearProDiveOverlay();
}

function updateProSkillsExpandAnim(dt) {
  if (!skillsDiveGroup || !skillsMainShell || !skillsSubRoot) return;
  if (proSkillsMode === 'idle' || proSkillsMode === 'ready') return;
  proSkillsAnim.t = Math.min(proSkillsAnim.duration, proSkillsAnim.t + dt);
  const u = proSkillsAnim.duration > 0 ? proSkillsAnim.t / proSkillsAnim.duration : 1;
  updateProDiveOverlayForMode(proSkillsMode, u);
  if (proSkillsMode === 'dive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * e;
    skillsDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      proSkillsMode = 'reveal';
      proSkillsAnim.t = 0;
      proSkillsAnim.duration = reduceMotion ? 0.001 : 0.6;
      skillsMainShell.visible = false;
      skillsSubRoot.visible = true;
      for (const g of proSkillsSubGroups) {
        if (!g || !g.group) continue;
        g.group.visible = true;
        g.group.scale.setScalar(0.001);
      }
    }
  } else if (proSkillsMode === 'reveal') {
    const n = Math.max(1, proSkillsSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proSkillsSubGroups.length; i += 1) {
      const g = proSkillsSubGroups[i];
      if (!g || !g.group) continue;
      const delay = (i / n) * staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (1 - staggerMax || 0.001)));
      const e = smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proSkillsSubGroups) {
        if (!g || !g.group) continue;
        g.group.position.copy(g.targetPos);
        g.group.scale.setScalar(1);
      }
      proSkillsMode = 'ready';
    }
  } else if (proSkillsMode === 'foldSubs') {
    const n = Math.max(1, proSkillsSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proSkillsSubGroups.length; i += 1) {
      const g = proSkillsSubGroups[i];
      if (!g || !g.group) continue;
      const delay = ((n - 1 - i) / n) * staggerMax;
      const denom = 1 - staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (denom || 0.001)));
      const e = 1 - smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proSkillsSubGroups) {
        if (!g || !g.group) continue;
        g.group.scale.setScalar(0.001);
        g.group.position.set(0, 0, 0);
        g.group.visible = false;
      }
      skillsSubRoot.visible = false;
      skillsMainShell.visible = true;
      proSkillsMode = 'undive';
      proSkillsAnim.t = 0;
      proSkillsAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proSkillsMode === 'undive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * (1 - e);
    skillsDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      finishProSkillsRetreat();
    }
  }
}

function applyProSkillsHoverMaterial(material, f, isMain) {
  if (!material || f <= 0) {
    if (material && material.userData && material.userData._hoverBaseE) {
      material.emissive.copy(material.userData._hoverBaseE);
      material.emissiveIntensity = material.userData._hoverBaseEi;
    }
    return;
  }
  if (!material.userData._hoverBaseE) {
    material.userData._hoverBaseE = new THREE.Color().copy(material.emissive);
    material.userData._hoverBaseEi = material.emissiveIntensity;
  }
  const t = Math.min(1, f);
  const bMul = isMain ? 1.5 : 1.32;
  const bi = material.userData._hoverBaseEi * bMul;
  material.emissive
    .copy(material.userData._hoverBaseE)
    .lerp(_proSkillsHoverHi, t * 0.62);
  material.emissiveIntensity = THREE.MathUtils.lerp(
    material.userData._hoverBaseEi,
    bi,
    t
  );
}

function updateProSkillsPlanetHoverVisuals(dt) {
  if (!proScrollGroup || !proScrollData) return;
  const tgt = _proSkillsHoverTarget;
  const wantSk =
    tgt === skillsPlanetMesh &&
    proSkillsMode === 'idle' &&
    skillsMainShell &&
    skillsMainShell.visible;
  const fSk = skillsPlanetMesh ? lerpProAboutHoverFactor(skillsPlanetMesh, wantSk, dt) : 0;
  if (proSkillsMode === 'idle' && skillsPlanetMesh) {
    skillsPlanetMesh.scale.setScalar(1 + PRO_ABOUT_MAIN_HOVER_SCALE * fSk);
    const c = skillsPlanetMesh.getObjectByName('skillsCore');
    if (c && c.material) applyProSkillsHoverMaterial(c.material, fSk, true);
  } else if (skillsPlanetMesh) {
    skillsPlanetMesh.scale.setScalar(1);
    const c0 = skillsPlanetMesh.getObjectByName('skillsCore');
    if (c0 && c0.material) applyProSkillsHoverMaterial(c0.material, 0, true);
  }
  for (const g of proSkillsSubGroups) {
    if (!g || !g.mesh || !g.group) continue;
    const wantS =
      proSkillsMode === 'ready' &&
      proSubMode === 'idle' &&
      (tgt === g.mesh || (g.ring && tgt === g.ring));
    const fG = lerpProAboutHoverFactor(g.mesh, wantS, dt);
    if (proSkillsMode === 'ready' && proSubMode === 'idle' && g.group.parent && g.group.visible) {
      g.group.scale.setScalar(1 + PRO_ABOUT_SUB_HOVER_SCALE * fG);
      if (g.mesh.material) applyProSkillsHoverMaterial(g.mesh.material, fG, false);
      if (g.ring && g.ring.material) applyProSkillsHoverMaterial(g.ring.material, fG * 0.72, false);
    } else {
      if (g.mesh.material) applyProSkillsHoverMaterial(g.mesh.material, 0, false);
      if (g.ring && g.ring.material) applyProSkillsHoverMaterial(g.ring.material, 0, false);
    }
  }
}

function startProContactExpandSequence() {
  if (!contactDiveGroup || !contactMainShell || !contactSubRoot) return;
  if (proContactMode !== 'idle') return;
  if (proAboutMode !== 'idle') return;
  if (proProjectsMode !== 'idle') return;
  if (proHobbiesMode !== 'idle') return;
  if (proSkillsMode !== 'idle') return;
  proContactMode = reduceMotion ? 'dive' : 'spin';
  proContactAnim.t = 0;
  proContactAnim.duration = reduceMotion
    ? 0.001
    : Math.max(0.001, PRO_CONTACT_SPIN.duration);
  proContactScrollLocked = true;
  setCockpitUiThemeId('contact');
  if (contactPlanetMesh) contactPlanetMesh.rotation.set(0, 0, 0);
  if (aboutBackMesh) {
    aboutBackMesh.visible = true;
    if (aboutBackMesh.userData) aboutBackMesh.userData._uiHoverF = 0;
  }
  contactMainShell.visible = true;
  contactSubRoot.visible = false;
  for (const g of proContactSubGroups) {
    if (!g || !g.group) continue;
    g.group.scale.setScalar(0.001);
    g.group.visible = false;
  }
  if (reduceMotion) {
    contactMainShell.visible = false;
    contactSubRoot.visible = true;
    for (const g of proContactSubGroups) {
      if (!g || !g.group) continue;
      g.group.position.copy(g.targetPos);
      g.group.scale.setScalar(1);
      g.group.visible = true;
    }
    contactDiveGroup.position.set(0, 0, 0);
    contactDiveGroup.scale.setScalar(1);
    proContactMode = 'ready';
  }
}

function startProContactRetreatSequence() {
  if (!contactDiveGroup || !contactMainShell || !contactSubRoot) {
    finishProContactRetreat();
    return;
  }
  if (proContactMode !== 'ready') return;
  if (proSubMode !== 'idle') return;
  playProPlanetGoBackSfx();
  if (reduceMotion) {
    finishProContactRetreat();
    return;
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  proContactMode = 'foldSubs';
  proContactAnim.t = 0;
  proContactAnim.duration = 0.6;
}

function finishProContactRetreat() {
  _disposeProSubHoloCard();
  if (!contactDiveGroup || !contactMainShell || !contactSubRoot) {
    proContactMode = 'idle';
    proContactScrollLocked = false;
    proContactAnim.t = 0;
    setCockpitUiThemeId('default');
    if (aboutBackMesh) aboutBackMesh.visible = false;
    clearProDiveOverlay();
    return;
  }
  proContactMode = 'idle';
  proContactScrollLocked = false;
  proContactAnim.t = 0;
  contactDiveGroup.position.set(0, 0, 0);
  contactDiveGroup.scale.setScalar(1);
  if (contactPlanetMesh) contactPlanetMesh.rotation.set(0, 0, 0);
  contactMainShell.visible = true;
  contactSubRoot.visible = false;
  for (const g of proContactSubGroups) {
    if (!g || !g.group) continue;
    g.group.visible = false;
    g.group.scale.setScalar(0.001);
    g.group.position.set(0, 0, 0);
  }
  if (aboutBackMesh) aboutBackMesh.visible = false;
  setCockpitUiThemeId('default');
  clearProDiveOverlay();
}

function updateProContactExpandAnim(dt) {
  if (!contactDiveGroup || !contactMainShell || !contactSubRoot) return;
  if (proContactMode === 'idle' || proContactMode === 'ready') return;
  proContactAnim.t = Math.min(proContactAnim.duration, proContactAnim.t + dt);
  const u = proContactAnim.duration > 0 ? proContactAnim.t / proContactAnim.duration : 1;
  updateProDiveOverlayForMode(proContactMode, u);
  if (proContactMode === 'spin') {
    if (contactPlanetMesh) {
      const e = smoothStep01(u);
      const ang = e * Math.PI * 2 * PRO_CONTACT_SPIN.turns;
      const ax = PRO_CONTACT_SPIN.axis;
      contactPlanetMesh.rotation.x = ax === 'x' ? ang : 0;
      contactPlanetMesh.rotation.y = ax === 'y' ? ang : 0;
      contactPlanetMesh.rotation.z = ax === 'z' ? ang : 0;
    }
    if (u >= 1) {
      if (contactPlanetMesh) contactPlanetMesh.rotation.set(0, 0, 0);
      proContactMode = 'dive';
      proContactAnim.t = 0;
      proContactAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proContactMode === 'dive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * e;
    contactDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      proContactMode = 'reveal';
      proContactAnim.t = 0;
      proContactAnim.duration = reduceMotion ? 0.001 : 0.6;
      contactMainShell.visible = false;
      contactSubRoot.visible = true;
      for (const g of proContactSubGroups) {
        if (!g || !g.group) continue;
        g.group.visible = true;
        g.group.scale.setScalar(0.001);
      }
    }
  } else if (proContactMode === 'reveal') {
    const n = Math.max(1, proContactSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proContactSubGroups.length; i += 1) {
      const g = proContactSubGroups[i];
      if (!g || !g.group) continue;
      const delay = (i / n) * staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (1 - staggerMax || 0.001)));
      const e = smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proContactSubGroups) {
        if (!g || !g.group) continue;
        g.group.position.copy(g.targetPos);
        g.group.scale.setScalar(1);
      }
      proContactMode = 'ready';
    }
  } else if (proContactMode === 'foldSubs') {
    const n = Math.max(1, proContactSubGroups.length);
    const staggerMax = 0.45;
    for (let i = 0; i < proContactSubGroups.length; i += 1) {
      const g = proContactSubGroups[i];
      if (!g || !g.group) continue;
      const delay = ((n - 1 - i) / n) * staggerMax;
      const denom = 1 - staggerMax;
      const localU = Math.max(0, Math.min(1, (u - delay) / (denom || 0.001)));
      const e = 1 - smoothStep01(localU);
      g.group.scale.setScalar(0.001 + e * (1 - 0.001));
      g.group.position.set(g.targetPos.x * e, g.targetPos.y * e, g.targetPos.z * e);
    }
    if (u >= 1) {
      for (const g of proContactSubGroups) {
        if (!g || !g.group) continue;
        g.group.scale.setScalar(0.001);
        g.group.position.set(0, 0, 0);
        g.group.visible = false;
      }
      contactSubRoot.visible = false;
      contactMainShell.visible = true;
      proContactMode = 'undive';
      proContactAnim.t = 0;
      proContactAnim.duration = reduceMotion ? 0.001 : 0.55;
    }
  } else if (proContactMode === 'undive') {
    const e = smoothStep01(u);
    const sc = 1 + PRO_ABOUT_DIVE_BONUS * (1 - e);
    contactDiveGroup.scale.setScalar(sc);
    if (u >= 1) {
      finishProContactRetreat();
    }
  }
}

/* BIO: Map overlay behavior and interaction note. */

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_DIVE = {
  approachDur: 0.75,
  holdDur: 0.15,
  revealDur: 0.9,
  hideDur: 0.45,
  retreatDur: 0.6,
  growScale: 2.4,
  lineStaggerMs: 90,
  /* BIO: Planet layout, label, and interaction note. */
  cardPxWidth: 640,
  cardPxHeight: 'auto',
  cardWorldWidth: 0.55,
  /* BIO: Implementation note for this section. */
  cardLocalPos: { x: -0.6, y: 0.05, z: 0 },
  /* BIO: Implementation note for this section. */
  cardLocalRot: { x: 0, y: 1.57, z: 0 },
  /* BIO: Implementation note for this section. */
  cardReadyOpacity: 0.95
};

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_DETAIL_REGISTRY = {
  /* BIO: Implementation note for this section. */
  'about/edu': {
    enabled: true,
    wheelStep: 0.045,
    lerp: PRO_SCROLL_LERP,
    snapDelayMs: PRO_SCROLL_SNAP_DELAY_MS,
    slideZMul: 1.25,
    modelPos: { x: -3.5, y: -0.2, z: 0.31 },
    modelRot: { x: 0, y: 5, z: 0 },
    modelHeightMul: 0.46,
    modelAutoRotateSpeed: 0.22,
    labelPxWidth: 960,
    labelWorldWidthMul: 1.55,
    labelOffsetYMul: 0.40,
    dotsTopPx: 34,
    dotLabel: 'University 3D',
    themeRgba: {
      glow: 'rgba(255,175,102,.95)',
      glow2: 'rgba(255,175,102,.78)',
      glow3: 'rgba(255,175,102,.42)',
      stroke: 'rgba(255,175,102,.45)'
    },
    labelText: {
      tr: '湖北科技职业学院 3D Modeli (Temsili)',
      en: '湖北科技职业学院 3D Model (Representative)',
      de: '湖北科技职业学院 3D-Modell (Symbolisch)'
    },
    scrollHintText: {
      tr: '3D modeli g枚rmek i莽in kayd谋r谋n',
      en: 'Scroll to see the 3D model',
      de: 'Scrollen, um das 3D-Modell zu sehen'
    },
    builder: {
      type: 'glb',
      glbUrl: PRO_ABOUT_UNIVERSITY_GLB_URL,
      fallback: () => _buildProEduFallbackModel(),
      modelName: 'proEduUniversityModel'
    }
  },
  /* BIO: Pro Mode integration note. */
  'about/bio': {
    enabled: true,
    wheelStep: 0.045,
    lerp: PRO_SCROLL_LERP,
    snapDelayMs: PRO_SCROLL_SNAP_DELAY_MS,
    slideZMul: 1.4,
    /* BIO: Implementation note for this section. */
    modelPos: { x: -3.2, y: 0.1, z: 0 },
    modelRot: { x: 0, y: 0, z: 0 },
    /* BIO: Implementation note for this section. */
    modelHeightMul: 0.9,
    /* BIO: Implementation note for this section. */
    cardWorldWidthMul: 2.4,
    cardThemeColor: '#ff8c3a',
    modelAutoRotateSpeed: 0,
    labelPxWidth: 960,
    labelWorldWidthMul: 1.55,
    /* BIO: Implementation note for this section. */
    labelOffsetYMul: 0.10,
    dotsTopPx: 34,
    dotLabel: 'Pilot ID Card',
    themeRgba: {
      glow: 'rgba(255,175,102,.95)',
      glow2: 'rgba(255,175,102,.78)',
      glow3: 'rgba(255,175,102,.42)',
      stroke: 'rgba(255,175,102,.45)'
    },
    labelText: {
      tr: 'Pilot Kimlik Kart谋',
      en: 'Pilot Identity Card',
      de: 'Pilot-Identit盲tsausweis'
    },
    scrollHintText: {
      tr: 'Pilot kimlik kart谋n谋 g枚rmek i莽in kayd谋r谋n',
      en: 'Scroll to see the pilot ID card',
      de: 'Scrollen, um den Pilotenausweis zu sehen'
    },
    builder: {
      type: 'procedural',
      build: (rootGroup, cfg, onReady) => _buildProBioPilotIdCard(rootGroup, cfg, onReady)
    }
  },
  /* BIO: Photo and gallery behavior note. */
  'hobbies/sht': {
    enabled: true,
    wheelStep: 0.045,
    lerp: PRO_SCROLL_LERP,
    snapDelayMs: PRO_SCROLL_SNAP_DELAY_MS,
    slideZMul: 1.4,
    /* BIO: Implementation note for this section. */
    modelPos: { x: -3.2, y: 0.1, z: 0 },
    modelRot: { x: 0, y: 0, z: 0 },
    /* BIO: Photo and gallery behavior note. */
    modelHeightMul: 0.7,
    /* BIO: Implementation note for this section. */
    cardWorldWidthMul: 2.4,
    /* BIO: Implementation note for this section. */
    cardThemeColor: '#5cffa8',
    modelAutoRotateSpeed: 0,
    labelPxWidth: 960,
    labelWorldWidthMul: 1.55,
    labelOffsetYMul: 0.10,
    dotsTopPx: 34,
    dotLabel: 'Photo Wall',
    themeRgba: {
      glow: 'rgba(92,255,168,.95)',
      glow2: 'rgba(92,255,168,.78)',
      glow3: 'rgba(92,255,168,.42)',
      stroke: 'rgba(92,255,168,.45)'
    },
    labelText: {
      tr: '篮球归档',
      en: 'Basketball Archive',
      de: '篮球归档'
    },
    scrollHintText: {
      tr: 'Foto臒raflar谋 ve 3D modeli g枚rmek i莽in kayd谋r谋n',
      en: 'Scroll to see the photos and the 3D model',
      de: 'Scrollen, um die Fotos und das 3D-Modell zu sehen'
    },
    photoUrls: {
      p1: PRO_PHOTO_WALL_URLS.shtP1,
      p2: PRO_PHOTO_WALL_URLS.shtP2
    },
    hidePhotoCards: true,
    /* BIO: Scroll and navigation behavior note. */
    photoObjectPosition: { p2: 'center 18%' },
    wallText: {
      tr: { title: '篮球归档', p1: '', p2: '' },
      en: { title: 'BASKETBALL ARCHIVE', p1: '', p2: '' },
      de: { title: '篮球归档', p1: '', p2: '' }
    },
    builder: {
      type: 'procedural',
      build: (rootGroup, cfg, onReady) => _buildProPhotoWall(rootGroup, cfg, onReady)
    },
    /* BIO: Scroll and navigation behavior note. */
    secondBuilder: {
      type: 'glb',
      glbUrl: PRO_HOBBIES_BASKETBALL_GLB_URL,
      modelName: 'proShootingFigure',
      /* BIO: Implementation note for this section. */
      modelPos: { x: -1, y: 0.05, z: 0 },
      modelRot: { x: 0, y: 0, z: 0 },
      modelHeightMul: 0.55,
      modelAutoRotateSpeed: 0.35,
      /* BIO: Implementation note for this section. */
      labelPos: { x: -1, y: 0.4, z: 0 },
      labelText: {
        tr: '我的篮球 3D 模型',
        en: 'My Basketball 3D Figure',
        de: '我的篮球 3D 模型'
      },
      /* BIO: Implementation note for this section. */
      labelPxWidth: 960,
      labelWorldWidthMul: 0.85,
      labelOffsetYMul: 0.10,
      labelFontPx: 40,
      /* BIO: Implementation note for this section. */
      dotLabel: '3D Figure'
    }
  },
  /* BIO: Photo and gallery behavior note. */
  'hobbies/esp': {
    enabled: true,
    wheelStep: 0.045,
    lerp: PRO_SCROLL_LERP,
    snapDelayMs: PRO_SCROLL_SNAP_DELAY_MS,
    slideZMul: 1.4,
    /* BIO: Implementation note for this section. */
    modelPos: { x: -3.2, y: 0.1, z: 0 },
    modelRot: { x: 0, y: 0, z: 0 },
    modelHeightMul: 0.7,
    cardWorldWidthMul: 2.4,
    cardThemeColor: '#5cffa8',
    modelAutoRotateSpeed: 0,
    labelPxWidth: 960,
    labelWorldWidthMul: 1.55,
    labelOffsetYMul: 0.10,
    dotsTopPx: 34,
    dotLabel: 'Photo Wall',
    themeRgba: {
      glow: 'rgba(92,255,168,.95)',
      glow2: 'rgba(92,255,168,.78)',
      glow3: 'rgba(92,255,168,.42)',
      stroke: 'rgba(92,255,168,.45)'
    },
    labelText: {
      tr: 'E-Spor Ar艧ivi',
      en: 'E-Sports Archive',
      de: 'E-Sport-Archiv'
    },
    scrollHintText: {
      tr: 'Foto臒raflar谋 g枚rmek i莽in kayd谋r谋n',
      en: 'Scroll to see the photos',
      de: 'Scrollen, um die Fotos zu sehen'
    },
    photoUrls: {
      p1: PRO_PHOTO_WALL_URLS.espP1,
      p2: PRO_PHOTO_WALL_URLS.espP2
    },
    wallText: {
      tr: {
        title: 'E-SPOR AR艦陌V陌',
        p1: '陌lk offline turnuvam 路 K眉莽眉k莽ekmece, 2021',
        p2: 'Tak谋m谋mla turnuvada 路 (En soldaki benim)'
      },
      en: {
        title: 'E-SPORTS ARCHIVE',
        p1: 'My first offline tournament 路 K眉莽眉k莽ekmece, 2021',
        p2: 'With my team at the tournament 路 (I am on the far left)'
      },
      de: {
        title: 'E-SPORT-ARCHIV',
        p1: 'Mein erstes Offline-Turnier 路 K眉莽眉k莽ekmece, 2021',
        p2: 'Mit meinem Team beim Turnier 路 (Ich bin ganz links)'
      }
    },
    builder: {
      type: 'procedural',
      build: (rootGroup, cfg, onReady) => _buildProPhotoWall(rootGroup, cfg, onReady)
    }
  }
};

/* BIO: Planet layout, label, and interaction note. */
function _proCurrentSubDetailCfg() {
  if (!proSubActivePlanetId || !proSubActiveSubId) return null;
  const key = proSubActivePlanetId + '/' + proSubActiveSubId;
  const cfg = PRO_SUB_DETAIL_REGISTRY[key];
  if (!cfg || cfg.enabled === false) return null;
  return cfg;
}

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_STATIC_DECOR_REGISTRY = {
  /* BIO: Implementation note for this section. */
  'contact/mail': {
    enabled: true,
    holoCardYOffsetMul: 0.1,
    models: [
      {
        glbUrl: PRO_CONTACT_MAIL_GLB_URL,
        modelPos: { x: -0.5, y: -0.05, z: 0 },
        modelRot: { x: 0, y: 1.57, z: 0 },
        modelHeightMul: 0.13,
        autoRotateSpeed: 0.45,
        hitProxyPaddingMul: 1.15,
        /* BIO: Implementation note for this section. */
        glowColor: '#ff6a00',
        glowScaleMul: 2.4,
        hoverScale: 1.18,
        onClick: { type: 'href', href: 'mailto:dahat5632@gmail.com' }
      }
    ]
  },
  /* BIO: Implementation note for this section. */
  'contact/soc': {
    enabled: true,
    holoCardYOffsetMul: 0.1,
    models: [
      {
        glbUrl: PRO_CONTACT_LINKEDIN_GLB_URL,
        modelPos: { x: -0.5, y: -0.05, z: -0.14 },
        modelRot: { x: 0, y: 1.57, z: 0 },
        modelHeightMul: 0.13,
        autoRotateSpeed: 0.45,
        /* BIO: Language control and localization note. */
        hitProxyPaddingMul: 1.0,
        /* BIO: LinkedIn marka mavisi. */
        glowColor: '#0a66c2',
        glowScaleMul: 2.4,
        hoverScale: 1.18,
        onClick: { type: 'href', href: 'https://www.linkedin.com/in/bilalgurkansanli/' }
      },
      {
        glbUrl: PRO_CONTACT_GITHUB_GLB_URL,
        modelPos: { x: -0.5, y: -0.05, z: 0.14 },
        modelRot: { x: 0, y: 1.57, z: 0 },
        modelHeightMul: 0.13,
        autoRotateSpeed: 0.45,
        hitProxyPaddingMul: 1.0,
        /* BIO: Implementation note for this section. */
        glowColor: '#ffffff',
        glowScaleMul: 2.4,
        hoverScale: 1.18,
        onClick: { type: 'href', href: 'https://github.com/bilalgurkansanli' }
      }
    ]
  }
};

/* BIO: Planet layout, label, and interaction note. */
function _proCurrentSubStaticDecorCfg() {
  if (!proSubActivePlanetId || !proSubActiveSubId) return null;
  const key = proSubActivePlanetId + '/' + proSubActiveSubId;
  const cfg = PRO_SUB_STATIC_DECOR_REGISTRY[key];
  if (!cfg || cfg.enabled === false) return null;
  return cfg;
}

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_TERMINAL_CONFIG = {
  /* BIO: Planet layout, label, and interaction note. */
  enabledFor: new Set([
    'about/edu', 'about/bio', 'about/exp',
    'projects/web', 'projects/mob', 'projects/back',
    'hobbies/esp', 'hobbies/sht', 'hobbies/tec', 'hobbies/trv',
    'skills/ai', 'skills/sec',
    'contact/mail', 'contact/soc'
  ]),
  /* BIO: Implementation note for this section. */
  contentCharMs: 10,
  /* BIO: Implementation note for this section. */
  contentMaxTotalMs: 3200,
  /* BIO: Implementation note for this section. */
  cursorLingerMs: 1200
};

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_CONTENT = {
  about: {
    edu: {
      tr: { title: 'E臑陌T陌M', html: `
        <div class="tl-wrap">
          <div class="tl-item active">
            <div class="tl-year">2022 - 2025</div>
            <div class="tl-title">湖北科技职业学院</div>
            <div class="tl-desc">陌nternet ve A臒 Teknolojileri</div>
          </div>
          <div class="tl-item">
            <div class="tl-year">2019 - 2022</div>
            <div class="tl-title">孝感一中</div>
            <div class="tl-desc">Lise E臒itimi</div>
          </div>
        </div>
        <hr class="divider">
        <div class="tl-section-title">获奖</div>
        <div class="tl-cert">
          <a href="#" target="_blank" rel="noopener">湖北省新能源汽车故障诊断二等奖</a>
        </div>` },
      en: { title: 'EDUCATION', html: `
        <div class="tl-wrap">
          <div class="tl-item active">
            <div class="tl-year">2022 - 2025</div>
            <div class="tl-title">湖北科技职业学院</div>
            <div class="tl-desc">Internet and Network Technologies</div>
          </div>
          <div class="tl-item">
            <div class="tl-year">2019 - 2022</div>
            <div class="tl-title">孝感一中</div>
            <div class="tl-desc">High School Education</div>
          </div>
        </div>
        <hr class="divider">
        <div class="tl-section-title">获奖</div>
        <div class="tl-cert">
          <a href="#" target="_blank" rel="noopener">湖北省新能源汽车故障诊断二等奖</a>
        </div>` },
      de: { title: 'AUSBILDUNG', html: `
        <div class="tl-wrap">
          <div class="tl-item active">
            <div class="tl-year">2022 - 2025</div>
            <div class="tl-title">湖北科技职业学院</div>
            <div class="tl-desc">Internet- und Netzwerktechnologien</div>
          </div>
          <div class="tl-item">
            <div class="tl-year">2019 - 2022</div>
            <div class="tl-title">孝感一中</div>
            <div class="tl-desc">Gymnasiale Ausbildung</div>
          </div>
        </div>
        <hr class="divider">
        <div class="tl-section-title">获奖</div>
        <div class="tl-cert">
          <a href="#" target="_blank" rel="noopener">湖北省新能源汽车故障诊断二等奖</a>
        </div>` }
    },
    exp: {
      tr: { title: 'DENEY陌M', html: `<p>Hen眉z 枚臒renciyim. Deneyim kazand谋k莽a bu b枚l眉m眉 g眉ncelleyece臒im.</p>` },
      en: { title: 'EXPERIENCE', html: `<p>I'm still a student. I'll update this section as I gain experience.</p>` },
      de: { title: 'ERFAHRUNG', html: `<p>Ich bin noch Student. Ich werde diesen Bereich aktualisieren, sobald ich Erfahrung gesammelt habe.</p>` }
    },
    bio: {
      tr: { title: 'HAKKIMDA', html: `
        <p>Merhaba! Ben <strong>鍛ㄥぉ鐖?/strong>. Nam谋di臒er <strong>ZTS</strong></p>
        <hr class="divider">
        <p>Siber G眉venlik ve Yapay Zeka alanlar谋na ilgi duyuyorum ve bu alanlarda her g眉n kendimi geli艧tirmek i莽in 莽abal谋yorum. 脰zellikle Yapay Zeka destekli Siber G眉venlik Sistemleri 眉zerine yo臒unla艧arak, dijital d眉nyadaki tehditleri hen眉z ger莽ekle艧meden tespit edebilen ak谋ll谋 botlar geli艧tirmeyi hedefliyorum.</p>
        <hr class="divider">
        <p class="psh-note">Bunlar谋n d谋艧谋nda hobi olarak E-Spor, Basketbol, At谋c谋l谋k sporlar谋na ilgi duyuyorum. Gezmeyi ve yeni yerler ke艧fetmeyi seviyorum. Genellikle sessiz bir ki艧ili臒im var ama aram谋zdaki buzlar谋 k谋rd谋臒谋m谋zda bazen de 莽ok konu艧abilirim :)</p>` },
      en: { title: 'ABOUT ME', html: `
        <p>Hello! I'm <strong>鍛ㄥぉ鐖?/strong>. Also known as <strong>ZTS</strong></p>
        <hr class="divider">
        <p>I'm passionate about Cybersecurity and Artificial Intelligence, and I strive to improve myself in these fields every day. I'm particularly focused on AI-powered Cybersecurity Systems, aiming to develop intelligent bots that can detect digital threats before they even occur.</p>
        <hr class="divider">
        <p class="psh-note">Besides these, I'm interested in E-Sports and Basketball as hobbies. I love traveling and exploring new places. I'm generally a quiet person, but once we break the ice, I can be quite talkative sometimes :)</p>` },
      de: { title: '脺BER MICH', html: `
        <p>Hallo! Ich bin <strong>鍛ㄥぉ鐖?/strong>. Auch bekannt als <strong>ZTS</strong></p>
        <hr class="divider">
        <p>Ich interessiere mich f眉r Cybersicherheit und K眉nstliche Intelligenz und arbeite jeden Tag daran, mich in diesen Bereichen weiterzuentwickeln. Mein besonderer Fokus liegt auf KI-gest眉tzten Cybersicherheitssystemen, mit dem Ziel, intelligente Bots zu entwickeln, die digitale Bedrohungen erkennen, bevor sie auftreten.</p>
        <hr class="divider">
        <p class="psh-note">Abgesehen davon interessiere ich mich f眉r E-Sport und Basketball als Hobbys. Ich reise gerne und entdecke neue Orte. Ich bin generell eine ruhige Person, aber wenn das Eis gebrochen ist, kann ich manchmal auch sehr gespr盲chig sein :)</p>` }
    }
  },
  projects: {
    web: {
      tr: { title: 'S陌BER G脺VENL陌K PROJELER陌', html: `
        <p><strong>Projeler</strong></p>
        <ul><li>脟ok yak谋nda...</li><li>脟ok yak谋nda...</li><li>脟ok yak谋nda...</li></ul>
        <hr class="divider">
        <p><strong>Kulland谋臒谋m Teknolojiler</strong></p>
        <ul><li>Python</li><li>[eklenecek]</li><li>[eklenecek]</li></ul>` },
      en: { title: 'CYBER SECURITY PROJECTS', html: `
        <p><strong>Projects</strong></p>
        <ul><li>Coming soon...</li><li>Coming soon...</li><li>Coming soon...</li></ul>
        <hr class="divider">
        <p><strong>Technologies Used</strong></p>
        <ul><li>Python</li><li>[to be added]</li><li>[to be added]</li></ul>` },
      de: { title: 'CYBER SECURITY PROJEKTE', html: `
        <p><strong>Projekte</strong></p>
        <ul><li>Kommt bald...</li><li>Kommt bald...</li><li>Kommt bald...</li></ul>
        <hr class="divider">
        <p><strong>Verwendete Technologien</strong></p>
        <ul><li>Python</li><li>[wird hinzugef眉gt]</li><li>[wird hinzugef眉gt]</li></ul>` }
    },
    mob: {
      tr: { title: 'YAPAY ZEKA PROJELER陌', html: `
        <p><strong>Projeler</strong></p>
        <ul><li>脟ok yak谋nda...</li><li>脟ok yak谋nda...</li></ul>
        <hr class="divider">
        <p>Projeler hakk谋nda bilgiler eklenecek</p>` },
      en: { title: 'AI PROJECTS', html: `
        <p><strong>Projects</strong></p>
        <ul><li>Coming soon...</li><li>Coming soon...</li></ul>
        <hr class="divider">
        <p>Project details to be added</p>` },
      de: { title: 'KI-PROJEKTE', html: `
        <p><strong>Projekte</strong></p>
        <ul><li>Kommt bald...</li><li>Kommt bald...</li></ul>
        <hr class="divider">
        <p>Projektdetails werden hinzugef眉gt</p>` }
    },
    back: {
      tr: { title: 'KARMA PROJELER', html: `
        <p><strong>Projeler</strong></p>
        <ul><li>脟ok yak谋nda...</li><li>脟ok yak谋nda...</li></ul>
        <hr class="divider">
        <p><strong>Kulland谋臒谋m Teknolojiler</strong></p>
        <ul><li>Python</li><li>[eklenecek]</li><li>[eklenecek]</li></ul>` },
      en: { title: 'MIXED PROJECTS', html: `
        <p><strong>Projects</strong></p>
        <ul><li>Coming soon...</li><li>Coming soon...</li></ul>
        <hr class="divider">
        <p><strong>Technologies Used</strong></p>
        <ul><li>Python</li><li>[to be added]</li><li>[to be added]</li></ul>` },
      de: { title: 'GEMISCHTE PROJEKTE', html: `
        <p><strong>Projekte</strong></p>
        <ul><li>Kommt bald...</li><li>Kommt bald...</li></ul>
        <hr class="divider">
        <p><strong>Verwendete Technologien</strong></p>
        <ul><li>Python</li><li>[wird hinzugef眉gt]</li><li>[wird hinzugef眉gt]</li></ul>` }
    }
  },
  hobbies: {
    esp: {
      tr: { title: 'E-SPOR', html: `
        <p><strong>Favori Oyunlar</strong></p>
        <ul><li>VALORANT</li><li>CS2</li></ul>
        <hr class="divider">
        <p>E-spor; bana ileti艧im, tak谋m oyunu, stres alt谋nda so臒ukkanl谋 karar verme ve h谋zl谋 problem 莽枚zme yetisi kazand谋rd谋. Rekabet莽i arenada edindi臒im bu disiplin, sadece oyunlarda de臒il, hayatta da bana yard谋mc谋 oldu.</p>` },
      en: { title: 'E-SPORTS', html: `
        <p><strong>Favorite Games</strong></p>
        <ul><li>VALORANT</li><li>CS2</li></ul>
        <hr class="divider">
        <p>E-sports taught me communication, teamwork, calm decision-making under pressure, and quick problem-solving. The discipline I gained in the competitive arena has helped me not only in games but also in life.</p>` },
      de: { title: 'E-SPORT', html: `
        <p><strong>Lieblingsspiele</strong></p>
        <ul><li>VALORANT</li><li>CS2</li></ul>
        <hr class="divider">
        <p>E-Sport hat mir Kommunikation, Teamarbeit, besonnene Entscheidungsfindung unter Druck und schnelles Probleml枚sen beigebracht. Die Disziplin, die ich in der kompetitiven Arena gewonnen habe, hat mir nicht nur in Spielen, sondern auch im Leben geholfen.</p>` }
    },
    sht: {
      tr: { title: '篮球', html: `
        <p>篮球需要体能、节奏感、团队配合和临场判断。它训练了我的专注力、沟通能力以及在压力下快速决策的能力。</p>
        <hr class="divider">
        <p class="psh-note">这是一项需要热情、耐心、纪律和协作的运动。</p>` },
      en: { title: 'BASKETBALL', html: `
        <p>Basketball requires physical fitness, rhythm, teamwork, and quick judgment. It trains my focus, communication, and ability to make fast decisions under pressure.</p>
        <hr class="divider">
        <p class="psh-note">It is a sport that demands passion, patience, discipline, and collaboration.</p>` },
      de: { title: '篮球', html: `
        <p>篮球需要体能、节奏感、团队配合和临场判断。它训练了我的专注力、沟通能力以及在压力下快速决策的能力。</p>
        <hr class="divider">
        <p class="psh-note">这是一项需要热情、耐心、纪律和协作的运动。</p>` }
    },
    tec: {
      tr: { title: 'TEKNOLOJ陌 TRENDLER陌', html: `
        <p><strong>Takip Etti臒im Alanlar</strong></p>
        <ul>
          <li>Yapay Zeka &amp; LLM geli艧meleri</li>
          <li>Siber g眉venlik haberleri</li>
          <li>Yeni siber g眉venlik &amp; yapay zeka uygulamalar谋</li>
          <li>Donan谋m &amp; yonga mimarisi</li>
          <li>Kuantum Bilgisayar</li>
        </ul>
        <hr class="divider">
        <p>Teknoloji trendlerini takip etmeyi 莽ok seviyorum. 脟眉nk眉 bu sayede yapay zeka, siber g眉venlik ve di臒er alanlarda kendimi geli艧tirebilecek fikirleri kafamda olu艧turabiliyorum. Ayr谋ca 莽ok h谋zl谋 ilerleyen teknolojileri ka莽谋rmayarak kendimi geli艧tiriyorum.</p>` },
      en: { title: 'TECH TRENDS', html: `
        <p><strong>Areas I Follow</strong></p>
        <ul>
          <li>Artificial Intelligence &amp; LLM developments</li>
          <li>Cybersecurity news</li>
          <li>New cybersecurity &amp; AI applications</li>
          <li>Hardware &amp; chip architecture</li>
          <li>Quantum Computing</li>
        </ul>
        <hr class="divider">
        <p>I love following technology trends. This way, I can form ideas in my mind to improve myself in artificial intelligence, cybersecurity, and other fields. I also keep up with rapidly advancing technologies to continuously develop myself.</p>` },
      de: { title: 'TECH-TRENDS', html: `
        <p><strong>Bereiche, denen ich folge</strong></p>
        <ul>
          <li>K眉nstliche Intelligenz &amp; LLM-Entwicklungen</li>
          <li>Cybersicherheits-Nachrichten</li>
          <li>Neue Cybersicherheits- &amp; KI-Anwendungen</li>
          <li>Hardware &amp; Chiparchitektur</li>
          <li>Quantencomputer</li>
        </ul>
        <hr class="divider">
        <p>Ich verfolge sehr gerne Technologietrends. Dadurch kann ich Ideen entwickeln, um mich in den Bereichen K眉nstliche Intelligenz, Cybersicherheit und anderen Feldern weiterzuentwickeln. Au脽erdem halte ich mich durch die schnell fortschreitenden Technologien stets auf dem Laufenden.</p>` }
    },
    trv: {
      tr: { title: 'SEYAHAT', html: `<p>Seyahat etmeyi ve yeni yerler ke艧fetmeyi seviyorum. 脟眉nk眉 her yeni yere gitti臒imde yeni fikirler ve deneyimler kazan谋yorum. Ayr谋ca yeni yerlere gidince sanki beynimin farkl谋 yerlerini kullan谋yormu艧 gibi hissediyorum.</p>` },
      en: { title: 'TRAVEL', html: `<p>I love traveling and exploring new places. Because every time I visit a new place, I gain new ideas and experiences. Also, when I go to new places, I feel like I'm using different parts of my brain.</p>` },
      de: { title: 'REISEN', html: `<p>Ich liebe es zu reisen und neue Orte zu entdecken. Denn jedes Mal, wenn ich einen neuen Ort besuche, gewinne ich neue Ideen und Erfahrungen. Au脽erdem habe ich das Gef眉hl, verschiedene Teile meines Gehirns zu nutzen, wenn ich neue Orte besuche.</p>` }
    }
  },
  skills: {
    ai: {
      tr: { title: 'YAPAY ZEKA', html: `
        <p><strong>K眉t眉phaneler &amp; Ara莽lar</strong></p>
        <ul><li>Obsidian</li><li>Codex, VS Code, Gemini, Claude Code</li></ul>
        <hr class="divider">
        <p><strong>Tamamlad谋臒谋m Projeler</strong></p>
        <ul><li><a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br><span>ML modelleriyle ki艧isel 枚zelliklere dayal谋 sa臒l谋k sigortas谋 maliyeti tahmini <strong>(Denetimli 脰臒renme)</strong></span></li></ul>
        <hr class="divider">
        <p><strong>陌lgi Alanlar谋</strong></p>
        <ul><li>Do臒al Dil 陌艧leme (NLP)</li><li>Makine 脰臒renmesi</li><li>脺retken Yapay Zeka (GenAI)</li></ul>` },
      en: { title: '浜哄伐鏅鸿兘', html: `
        <p><strong>鐭ヨ瘑搴撳拰宸ュ叿</strong></p>
        <ul><li>Obsidian</li><li>Codex, VS Code, Gemini, Claude Code</li></ul>
        <hr class="divider">
        <p><strong>Completed Projects</strong></p>
        <ul><li><a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br><span>Health insurance cost prediction based on personal features using ML models <strong>(Supervised Learning)</strong></span></li></ul>
        <hr class="divider">
        <p><strong>Areas of Interest</strong></p>
        <ul><li>Natural Language Processing (NLP)</li><li>Machine Learning</li><li>Generative AI (GenAI)</li></ul>` },
      de: { title: 'K脺NSTLICHE INTELLIGENZ', html: `
        <p><strong>Bibliotheken &amp; Werkzeuge</strong></p>
        <ul><li>Obsidian</li><li>Codex, VS Code, Gemini, Claude Code</li></ul>
        <hr class="divider">
        <p><strong>Abgeschlossene Projekte</strong></p>
        <ul><li><a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br><span>Krankenversicherungskostenvorhersage basierend auf pers枚nlichen Merkmalen mit ML-Modellen <strong>(脺berwachtes Lernen)</strong></span></li></ul>
        <hr class="divider">
        <p><strong>Interessengebiete</strong></p>
        <ul><li>Nat眉rliche Sprachverarbeitung (NLP)</li><li>Maschinelles Lernen</li><li>Generative KI (GenAI)</li></ul>` }
    },
    sec: {
      tr: { title: 'S陌BER G脺VENL陌K', html: `
        <p><strong>陌lgi Alanlar谋</strong></p>
        <ul><li>A臒 g眉venli臒i</li><li>Penetrasyon testi</li><li>G眉venlik a莽谋臒谋 analizi (CVE)</li><li>Kriptografi</li></ul>
        <hr class="divider">
        <p><strong>Kulland谋臒谋m Ara莽lar</strong></p>
        <ul><li>Nmap / Zenmap</li><li>Metasploit</li><li>Burp Suite</li><li>[Di臒er ara莽lar eklenecek]</li></ul>
        <hr class="divider">
        <p>艦u an Cisco'nun CyberOps ve Ethical Hacking e臒itimlerini al谋yorum. Bu e臒itimler sonras谋ndaysa sertifika s谋navlar谋na girip sertifikalar谋m谋 alaca臒谋m.</p>` },
      en: { title: '新能源汽车', html: `
        <p><strong>研究兴趣领域</strong></p>
        <ul><li>新能源汽车</li><li>智能座舱</li><li>电池与电驱系统</li><li>自动驾驶与车联网</li></ul>` },
      de: { title: 'CYBERSICHERHEIT', html: `
        <p><strong>Interessengebiete</strong></p>
        <ul><li>Netzwerksicherheit</li><li>Penetrationstests</li><li>Schwachstellenanalyse (CVE)</li><li>Kryptographie</li></ul>
        <hr class="divider">
        <p><strong>Verwendete Werkzeuge</strong></p>
        <ul><li>Nmap / Zenmap</li><li>Metasploit</li><li>Burp Suite</li><li>[Weitere Werkzeuge werden hinzugef眉gt]</li></ul>
        <hr class="divider">
        <p>Ich absolviere derzeit Ciscos CyberOps- und Ethical-Hacking-Kurse. Danach werde ich die Zertifizierungspr眉fungen ablegen, um meine Zertifikate zu erhalten.</p>` }
    }
  },
  contact: {
    mail: {
      tr: { title: 'E-POSTA', html: `
        <p>Bana e-posta ile ula艧abilirsiniz:</p>
        <p class="psh-mail"><a href="mailto:dahat5632@gmail.com">dahat5632@gmail.com</a></p>
        <p class="psh-note">陌艧 birli臒i teklifleri, proje fikirleri veya sadece merhaba demek i莽in yazmaktan 莽ekinmeyin.</p>` },
      en: { title: 'EMAIL', html: `
        <p>You can reach me via email:</p>
        <p class="psh-mail"><a href="mailto:dahat5632@gmail.com">dahat5632@gmail.com</a></p>
        <p class="psh-note">Don't hesitate to write for collaboration offers, project ideas, or just to say hello.</p>` },
      de: { title: 'E-MAIL', html: `
        <p>Sie k枚nnen mich per E-Mail erreichen:</p>
        <p class="psh-mail"><a href="mailto:dahat5632@gmail.com">dahat5632@gmail.com</a></p>
        <p class="psh-note">Z枚gern Sie nicht, mir f眉r Kooperationsangebote, Projektideen oder einfach nur um Hallo zu sagen zu schreiben.</p>` }
    },
    soc: {
      tr: { title: 'SOSYAL MEDYA', html: `
        <p>Beni sosyal medyada bulun. LinkedIn'de ba臒lant谋 atmaktan 莽ekinmeyin.</p>
        <hr class="divider">
        <p class="psh-note">A艧a臒谋daki ikonlara t谋klayarak profillerime ula艧abilirsiniz.</p>` },
      en: { title: 'SOCIAL MEDIA', html: `
        <p>Find me on social media. Don't hesitate to connect on LinkedIn.</p>
        <hr class="divider">
        <p class="psh-note">Click the icons below to visit my profiles.</p>` },
      de: { title: 'SOZIALE MEDIEN', html: `
        <p>Finden Sie mich in sozialen Medien. Z枚gern Sie nicht, sich auf LinkedIn zu vernetzen.</p>
        <hr class="divider">
        <p class="psh-note">Klicken Sie auf die Symbole unten, um zu meinen Profilen zu gelangen.</p>` }
    }
  }
};

/* BIO: Planet layout, label, and interaction note. */
const PRO_SUB_THEMES = {
  about:    '#ff6a00',
  projects: '#ff006e',
  hobbies:  '#00ff88',
  skills:   '#bf00ff',
  contact:  '#ffee00'
};

/* BIO: Planet layout, label, and interaction note. */
const PRO_PLANET_REGISTRY = {
  about:    { subGroups: () => proAboutSubGroups,    subRoot: () => aboutSubRoot,    mainMode: () => proAboutMode },
  projects: { subGroups: () => proProjectsSubGroups, subRoot: () => projectsSubRoot, mainMode: () => proProjectsMode },
  hobbies:  { subGroups: () => proHobbiesSubGroups,  subRoot: () => hobbiesSubRoot,  mainMode: () => proHobbiesMode },
  skills:   { subGroups: () => proSkillsSubGroups,   subRoot: () => skillsSubRoot,   mainMode: () => proSkillsMode },
  contact:  { subGroups: () => proContactSubGroups,  subRoot: () => contactSubRoot,  mainMode: () => proContactMode }
};

/* BIO: Planet layout, label, and interaction note. */
let proSubActivePlanetId = null;
let proSubActiveSubId = null;
let proSubMode = 'idle';
let proSubAnim = { t: 0, duration: 0 };
let _proSubSaved = null;
/* BIO: Planet layout, label, and interaction note. */
let _proSubHoloCard3D = null;
/* BIO: Implementation note for this section. */
let _proSubHoloCard3DEl = null;
/* BIO: Planet layout, label, and interaction note. */
let _proSubDetailRoot = null;
let _proSubDetailModel = null;
let _proSubDetailLabel3D = null;
let _proSubDetailLabelEl = null;
let _proSubDetailDotsEl = null;
let _proSubDetailT = 0;
let _proSubDetailTTarget = 0;
let _proSubDetailLoading = false;
let _proSubDetailLoaded = false;
let _proSubDetailLastWheelT = 0;
let _proSubDetailSnapDone = true;
let _proSubDetailModelBasePos = new THREE.Vector3();
let _proSubDetailLabelBasePos = new THREE.Vector3();
let _proSubDetailHoloBasePos = new THREE.Vector3();
/* BIO: Implementation note for this section. */
let _proSubDetailBuilderHooks = null;
/* BIO: Hologram panel behavior and rendering note. */
let _proSubDetailRoot2 = null;
let _proSubDetailModel2 = null;
let _proSubDetailLabel3D2 = null;
let _proSubDetailLabelEl2 = null;
let _proSubDetailLoading2 = false;
let _proSubDetailLoaded2 = false;
let _proSubDetailModelBasePos2 = new THREE.Vector3();
let _proSubDetailLabelBasePos2 = new THREE.Vector3();
let _proSubDetailBuilderHooks2 = null;
/* BIO: Planet layout, label, and interaction note. */
let _proSubDetailLastSubKey = null;

/* BIO: Hologram panel behavior and rendering note. */
let _proSubStaticDecorRoot = null;
/* BIO: Pro Mode integration note. */
let _proSubStaticDecorEntries = [];
let _proSubStaticDecorPickables = [];
let _proSubStaticDecorHoloOffset = 0;
/* BIO: Language control and localization note. */
let _proSubStaticDecorOffsetCard = null;
let _proSubStaticDecorLastSubKey = null;
let _proSubStaticDecorLoading = 0;

/* BIO: Language control and localization note. */
let _proSubTerminalTimers = [];
/* BIO: Planet layout, label, and interaction note. */
const _proSubTerminalSeen = new Set();

function _proCurrentLang() {
  const v = (document.documentElement && document.documentElement.lang) || '';
  if (v === 'tr') return 'en';
  if (v === 'en') return 'en';
  return 'de';
}

function ensureProSubHoloCss() {
  if (document.getElementById('pro-sub-holo-style')) return;
  const s = document.createElement('style');
  s.id = 'pro-sub-holo-style';
  s.textContent = [
    /* BIO: Language control and localization note. */
    '.pro-sub-holo-3d{pointer-events:none;user-select:none;opacity:0;transition:opacity .35s cubic-bezier(.2,.7,.2,1);transform-style:preserve-3d;}',
    '.pro-sub-holo-3d.is-open{opacity:1;}',
    '.pro-sub-holo-3d .psh-card{--theme:#ffee00;position:relative;pointer-events:auto;user-select:text;-webkit-user-select:text;padding:28px 30px 26px;border:1px solid color-mix(in srgb,var(--theme) 55%,transparent);border-radius:16px;background:linear-gradient(180deg,rgba(8,10,16,.42),rgba(4,6,10,.55));box-shadow:0 0 0 1px rgba(255,255,255,.05) inset,0 0 44px color-mix(in srgb,var(--theme) 22%,transparent);backdrop-filter:blur(12px) saturate(120%);-webkit-backdrop-filter:blur(12px) saturate(120%);color:#eaeaea;font-family:"Orbitron","Segoe UI",sans-serif;overflow:hidden;}',
    '.pro-sub-holo-3d .psh-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,color-mix(in srgb,var(--theme) 85%,transparent),transparent 55%);mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}',
    '.pro-sub-holo-3d .psh-scanlines{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.045) 0 1px,transparent 1px 3px);mix-blend-mode:screen;opacity:.35;}',
    '.pro-sub-holo-3d .psh-close{position:absolute;top:10px;right:12px;width:34px;height:34px;border:1px solid color-mix(in srgb,var(--theme) 45%,transparent);background:rgba(0,0,0,.3);color:var(--theme);border-radius:9px;font-size:22px;line-height:1;cursor:pointer;transition:background .15s,transform .15s;font-family:inherit;}',
    '.pro-sub-holo-3d .psh-close:hover{background:color-mix(in srgb,var(--theme) 18%,rgba(0,0,0,.4));transform:scale(1.06);}',
    '.pro-sub-holo-3d .psh-title{margin:2px 0 16px;font-size:22px;letter-spacing:.16em;color:var(--theme);text-shadow:0 0 14px color-mix(in srgb,var(--theme) 65%,transparent);}',
    '.pro-sub-holo-3d .psh-divider{height:1px;margin:0 0 18px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--theme) 55%,transparent),transparent);}',
    '.pro-sub-holo-3d .psh-body{font-size:15px;line-height:1.6;max-height:58vh;overflow-y:auto;padding-right:6px;}',
    '.pro-sub-holo-3d .psh-body::-webkit-scrollbar{width:4px;}',
    '.pro-sub-holo-3d .psh-body::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--theme) 45%,transparent);border-radius:2px;}',
    '.pro-sub-holo-3d .psh-body>*{opacity:0;transform:translateY(8px);animation:pshLineIn .5s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:calc(var(--i,0) * 1ms);}',
    '.pro-sub-holo-3d .psh-body p{margin:0 0 10px;}',
    '.pro-sub-holo-3d .psh-body strong{color:var(--theme);}',
    /* BIO: Hologram panel behavior and rendering note. */
    '.pro-sub-holo-3d .psh-body ul{list-style:none;padding:0;margin:0 0 10px;}',
    '.pro-sub-holo-3d .psh-body ul li{position:relative;padding:0 0 4px 16px;line-height:1.55;}',
    '.pro-sub-holo-3d .psh-body ul li::before{content:">";position:absolute;left:0;top:0;color:var(--theme);opacity:.8;}',
    '.pro-sub-holo-3d .psh-body a{color:var(--theme);text-decoration:none;text-shadow:0 0 10px color-mix(in srgb,var(--theme) 40%,transparent);border-bottom:1px dashed color-mix(in srgb,var(--theme) 35%,transparent);transition:opacity .2s,border-color .2s;}',
    '.pro-sub-holo-3d .psh-body a:hover{opacity:.85;border-bottom-color:var(--theme);}',
    '.pro-sub-holo-3d .psh-body hr.divider,.pro-sub-holo-3d .psh-body hr{border:none;border-top:1px solid color-mix(in srgb,var(--theme) 25%,transparent);margin:12px 0;}',
    /* BIO: Default Mode integration note. */
    '.pro-sub-holo-3d .psh-body .tl-wrap{position:relative;padding-left:18px;margin:6px 0;}',
    '.pro-sub-holo-3d .psh-body .tl-wrap::before{content:"";position:absolute;left:6px;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--theme) 30%,transparent);}',
    '.pro-sub-holo-3d .psh-body .tl-item{position:relative;padding:0 0 12px 14px;}',
    '.pro-sub-holo-3d .psh-body .tl-item:last-child{padding-bottom:0;}',
    '.pro-sub-holo-3d .psh-body .tl-item::before{content:"";position:absolute;left:-6px;top:6px;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);}',
    '.pro-sub-holo-3d .psh-body .tl-item.active::before{background:var(--theme);box-shadow:0 0 10px color-mix(in srgb,var(--theme) 65%,transparent);}',
    '.pro-sub-holo-3d .psh-body .tl-year{font-size:11px;letter-spacing:.12em;opacity:.7;margin-bottom:2px;}',
    '.pro-sub-holo-3d .psh-body .tl-title{font-size:14px;color:var(--theme);margin-bottom:2px;}',
    '.pro-sub-holo-3d .psh-body .tl-desc{font-size:12px;opacity:.82;}',
    '.pro-sub-holo-3d .psh-body .tl-section-title{font-size:12px;letter-spacing:.2em;opacity:.75;margin:8px 0 6px;color:var(--theme);}',
    '.pro-sub-holo-3d .psh-body .tl-cert{display:flex;flex-direction:column;gap:4px;}',
    '.pro-sub-holo-3d .psh-body .tl-cert a{font-size:13px;}',
    '.pro-sub-holo-3d .psh-mail a{font-size:17px;letter-spacing:.03em;padding-bottom:2px;}',
    '.pro-sub-holo-3d .psh-note{font-size:13px;color:color-mix(in srgb,var(--theme) 50%,#cccccc 50%);opacity:.85;font-style:italic;}',
    /* BIO: Implementation note for this section. */
    '.pro-sub-holo-3d .psh-body.is-typewriter>*{opacity:1!important;transform:none!important;animation:none!important;}',
    '.pro-sub-holo-3d .psh-body.is-typewriter .psh-tw-cursor{display:inline-block;margin-left:2px;color:var(--theme);animation:pshCursorBlink .75s steps(2) infinite;}',
    /* BIO: Planet layout, label, and interaction note. */
    '.pro-sub-holo-3d .psh-scroll-hint{margin-top:14px;padding-top:10px;border-top:1px dashed color-mix(in srgb,var(--theme) 28%,transparent);display:flex;align-items:center;justify-content:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:color-mix(in srgb,var(--theme) 65%,#cccccc 35%);opacity:.92;}',
    '.pro-sub-holo-3d .psh-scroll-hint .psh-hint-chev{display:inline-block;width:10px;height:10px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-2px);animation:pshHintBob 1.4s ease-in-out infinite;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--theme) 55%,transparent));}',
    '@keyframes pshHintBob{0%,100%{transform:rotate(45deg) translateY(-2px);}50%{transform:rotate(45deg) translateY(3px);}}',
    '@keyframes pshCursorBlink{50%{opacity:0;}}',
    '@keyframes pshLineIn{to{opacity:1;transform:translateY(0);}}'
  ].join('\n');
  document.head.appendChild(s);
}

function _buildProSubHoloCardElement() {
  ensureProSubHoloCss();
  const el = document.createElement('div');
  el.className = 'pro-sub-holo-3d';
  el.innerHTML =
    '<div class="psh-card">' +
      '<div class="psh-scanlines"></div>' +
      '<button type="button" class="psh-close" aria-label="Close">\u00d7</button>' +
      '<h3 class="psh-title"></h3>' +
      '<div class="psh-divider"></div>' +
      '<div class="psh-body"></div>' +
    '</div>';
  const closeBtn = el.querySelector('.psh-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', ev => {
      ev.preventDefault();
      if (proSubMode === 'ready') startProSubRetreatSequence();
    });
  }
  return el;
}

/* BIO: Planet layout, label, and interaction note. */
function renderProSubHoloCard(parentRoot, themeHex, title, html) {
  if (!parentRoot) return;
  const el = _buildProSubHoloCardElement();
  const card = el.querySelector('.psh-card');
  const t = el.querySelector('.psh-title');
  const b = el.querySelector('.psh-body');
  if (!card || !t || !b) return;
  card.style.setProperty('--theme', themeHex);
  t.textContent = title || '';
  // BIO: Trusted, author-controlled static content only.
  // BIO: Do not pass URL params, CMS data, or visitor input into this sink.
  b.innerHTML = html || '';
  const kids = b.children;
  const step = Math.max(0, PRO_SUB_DIVE.lineStaggerMs);
  for (let i = 0; i < kids.length; i += 1) {
    kids[i].style.setProperty('--i', (i * step).toString());
  }
  if (_proSubHoloCard3D) {
    if (_proSubHoloCard3D.parent) _proSubHoloCard3D.parent.remove(_proSubHoloCard3D);
    if (_proSubHoloCard3D.element && _proSubHoloCard3D.element.parentNode) {
      _proSubHoloCard3D.element.parentNode.removeChild(_proSubHoloCard3D.element);
    }
  }
  const pxW = Math.max(1, PRO_SUB_DIVE.cardPxWidth);
  const pxHRaw = PRO_SUB_DIVE.cardPxHeight;
  el.style.width = pxW + 'px';
  if (typeof pxHRaw === 'number' && pxHRaw > 0) {
    el.style.height = pxHRaw + 'px';
  } else {
    el.style.height = 'auto';
  }
  const obj3d = new CSS3DObject(el);
  const worldW = PRO_SUB_DIVE.cardWorldWidth * _proSceneMaxDim;
  const s = worldW / pxW;
  obj3d.scale.setScalar(s);
  const lp = PRO_SUB_DIVE.cardLocalPos;
  obj3d.position.set(lp.x * _proSceneMaxDim, lp.y * _proSceneMaxDim, lp.z * _proSceneMaxDim);
  const lr = PRO_SUB_DIVE.cardLocalRot;
  obj3d.rotation.set(lr.x || 0, lr.y || 0, lr.z || 0);
  parentRoot.add(obj3d);
  _proSubHoloCard3D = obj3d;
  _proSubHoloCard3DEl = el;
  requestAnimationFrame(() => {
    if (_proSubHoloCard3DEl) _proSubHoloCard3DEl.classList.add('is-open');
  });
}

/* BIO: Language control and localization note. */
function _renderProSubHoloForActive() {
  if (!proSubActivePlanetId || !proSubActiveSubId) return;
  const reg = PRO_PLANET_REGISTRY[proSubActivePlanetId];
  if (!reg) return;
  const root = reg.subRoot();
  const theme = PRO_SUB_THEMES[proSubActivePlanetId] || '#ffffff';
  const lang = _proCurrentLang();
  const byLang = (PRO_SUB_CONTENT[proSubActivePlanetId] || {})[proSubActiveSubId] || null;
  const c = byLang && (byLang[lang] || byLang.en);
  if (!c) return;
  const key = proSubActivePlanetId + '/' + proSubActiveSubId;
  const useTerminal = _shouldUseTerminalFor(proSubActivePlanetId, proSubActiveSubId)
    && !reduceMotion
    && !_proSubTerminalSeen.has(key);
  if (useTerminal) {
    _renderProSubHoloTerminal(root, theme, c.title, c.html, key);
  } else {
    renderProSubHoloCard(root, theme, c.title, c.html);
  }
  _setupProSubDetailCarousel(root);
  _setupProSubStaticDecor(root);
  /* BIO: Language control and localization note. */
  if (proSubMode !== 'ready'
    && PRO_SUB_LIGHT_PULSE_CONFIG.enabledFor.has(key)) {
    triggerProSubLightPulse(theme);
  }
}

function hideProSubHoloCard() {
  _clearProSubTerminalTimers();
  if (_proSubHoloCard3DEl) _proSubHoloCard3DEl.classList.remove('is-open');
  if (_proSubHoloCard3DEl) _proSubHoloCard3DEl.style.opacity = '0';
  if (_proSubDetailDotsEl) _proSubDetailDotsEl.style.display = 'none';
  if (_proSubDetailRoot) _proSubDetailRoot.visible = false;
}

function _disposeProSubHoloCard() {
  if (_proSubHoloCard3D) {
    if (_proSubHoloCard3D.parent) _proSubHoloCard3D.parent.remove(_proSubHoloCard3D);
  }
  if (_proSubHoloCard3DEl && _proSubHoloCard3DEl.parentNode) {
    _proSubHoloCard3DEl.parentNode.removeChild(_proSubHoloCard3DEl);
  }
  _proSubHoloCard3D = null;
  _proSubHoloCard3DEl = null;
  _disposeProSubDetailCarousel();
  _proSubDetailLastSubKey = null;
  _disposeProSubStaticDecor();
  _proSubStaticDecorLastSubKey = null;
}

/* BIO: Hologram panel behavior and rendering note. */

function _isProSubDetailCarouselActive() {
  return proSubMode !== 'idle' &&
    !!_proCurrentSubDetailCfg() &&
    !!_proSubDetailRoot;
}

/* BIO: Map overlay behavior and interaction note. */
const _PRO_SUB_DETAIL_DOT_MAPCLICK_KEYS = new Set([
  'about/edu',
  'about/bio',
  'hobbies/esp',
  'hobbies/sht'
]);
function _maybePlaySubDetailDotMapClickSfx() {
  const api = typeof window !== 'undefined' && window.bgsProCockpitApi;
  if (!api || typeof api.playMapClickSfx !== 'function') return;
  const pid = proSubActivePlanetId;
  const sid = proSubActiveSubId;
  if (!pid || !sid) return;
  const key = pid + '/' + sid;
  if (!_PRO_SUB_DETAIL_DOT_MAPCLICK_KEYS.has(key)) return;
  api.playMapClickSfx();
}

function _ensureProSubDetailDots(cfg) {
  cfg = cfg || _proCurrentSubDetailCfg();
  if (_proSubDetailDotsEl && _proSubDetailDotsEl.isConnected) return _proSubDetailDotsEl;
  if (!document.getElementById('pro-sub-detail-style-v3')) {
    const style = document.createElement('style');
    style.id = 'pro-sub-detail-style-v3';
    style.textContent = [
      /* BIO: Language control and localization note. */
      '.pro-sub-detail-dots{position:fixed;left:50%;transform:translateX(-50%);z-index:35;display:flex;gap:16px;align-items:center;pointer-events:auto;--psd-glow:rgba(255,179,102,.8);--psd-glow-soft:rgba(255,179,102,.18);--psd-glow-shadow:rgba(255,179,102,.3);--psd-active:#ffaf66;--psd-active-shadow:rgba(255,179,102,.85);}',
      '.pro-sub-detail-dot{width:18px;height:18px;border-radius:999px;border:1.5px solid var(--psd-glow);background:var(--psd-glow-soft);box-shadow:0 0 14px var(--psd-glow-shadow);cursor:pointer;padding:0;transition:transform .18s,background .18s,box-shadow .18s;}',
      '.pro-sub-detail-dot.is-active{background:var(--psd-active);transform:scale(1.2);box-shadow:0 0 22px var(--psd-active-shadow);}',
      '.pro-sub-detail-dot:focus-visible{outline:2px solid #fff;outline-offset:5px;}'
    ].join('\n');
    document.head.appendChild(style);
  }
  const wrap = document.createElement('div');
  wrap.className = 'pro-sub-detail-dots';
  wrap.setAttribute('aria-label', 'Sub-detail pages');
  if (cfg && typeof cfg.dotsTopPx === 'number') wrap.style.top = cfg.dotsTopPx + 'px';
  if (cfg && cfg.themeRgba) {
    const t = cfg.themeRgba;
    if (t.glow) wrap.style.setProperty('--psd-glow', t.glow);
    if (t.glow2) wrap.style.setProperty('--psd-glow-soft', t.glow2.replace(/,\.[0-9]+\)/, ',.18)'));
    if (t.glow3) wrap.style.setProperty('--psd-glow-shadow', t.glow3.replace(/,\.[0-9]+\)/, ',.3)'));
    if (t.activeFill) wrap.style.setProperty('--psd-active', t.activeFill);
    if (t.glow) wrap.style.setProperty('--psd-active-shadow', t.glow);
  }
  const dotLabel = (cfg && cfg.dotLabel) || 'Detail';
  const labels = ['Hologram', dotLabel];
  /* BIO: Implementation note for this section. */
  if (cfg && cfg.secondBuilder) {
    labels.push((cfg.secondBuilder.dotLabel) || '3D Figure');
  }
  for (let i = 0; i < labels.length; i += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pro-sub-detail-dot';
    btn.setAttribute('aria-label', labels[i]);
    btn.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      _maybePlaySubDetailDotMapClickSfx();
      _setProSubDetailCarouselPage(i);
    });
    wrap.appendChild(btn);
  }
  cockpit.appendChild(wrap);
  _proSubDetailDotsEl = wrap;
  return wrap;
}

function _syncProSubDetailDots() {
  if (!_proSubDetailDotsEl) return;
  const active = _getProSubDetailNearestPage();
  const kids = _proSubDetailDotsEl.children;
  for (let i = 0; i < kids.length; i += 1) {
    kids[i].classList.toggle('is-active', i === active);
    kids[i].setAttribute('aria-pressed', i === active ? 'true' : 'false');
  }
}

/* BIO: Hologram panel behavior and rendering note. */
function _proSubDetailPageCount() {
  const cfg = _proCurrentSubDetailCfg();
  return cfg && cfg.secondBuilder ? 3 : 2;
}

function _getProSubDetailNearestPage() {
  const t = proScrollMod1(_proSubDetailTTarget);
  const N = _proSubDetailPageCount();
  /* BIO: Implementation note for this section. */
  let bestI = 0;
  let bestD = 1;
  for (let i = 0; i < N; i += 1) {
    const ph = i / N;
    const diff = Math.abs(t - ph);
    const d = Math.min(diff, 1 - diff);
    if (d < bestD) { bestD = d; bestI = i; }
  }
  return bestI;
}

function _setProSubDetailCarouselPage(pageIdx) {
  const N = _proSubDetailPageCount();
  const idx = ((pageIdx % N) + N) % N;
  const targetPhase = idx / N;
  const current = proScrollMod1(_proSubDetailTTarget);
  let delta = targetPhase - current;
  if (delta > 0.5) delta -= 1;
  else if (delta < -0.5) delta += 1;
  _proSubDetailTTarget += delta;
  _proSubDetailLastWheelT = 0;
  _proSubDetailSnapDone = true;
  _syncProSubDetailDots();
}

function _handleProSubDetailWheel(deltaY) {
  if (!_isProSubDetailCarouselActive()) return false;
  const cfg = _proCurrentSubDetailCfg();
  if (!cfg) return false;
  const step = cfg.wheelStep;
  _proSubDetailTTarget += deltaY > 0 ? step : -step;
  _proSubDetailLastWheelT =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  _proSubDetailSnapDone = false;
  _syncProSubDetailDots();
  return true;
}

function _maybeSnapProSubDetailCarousel() {
  if (!_isProSubDetailCarouselActive()) return;
  if (_proSubDetailLastWheelT <= 0 || _proSubDetailSnapDone) return;
  const cfg = _proCurrentSubDetailCfg();
  if (!cfg) return;
  const nowMs =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  if (nowMs - _proSubDetailLastWheelT <= cfg.snapDelayMs) return;
  const tNormTgt = proScrollMod1(_proSubDetailTTarget);
  const N = _proSubDetailPageCount();
  /* BIO: Implementation note for this section. */
  const centers = [];
  for (let i = 0; i < N; i += 1) centers.push(i / N);
  let bestC = centers[0];
  let bestD = Math.min(Math.abs(tNormTgt - bestC), 1 - Math.abs(tNormTgt - bestC));
  for (let i = 1; i < centers.length; i += 1) {
    const diff = Math.abs(tNormTgt - centers[i]);
    const d = Math.min(diff, 1 - diff);
    if (d < bestD) {
      bestD = d;
      bestC = centers[i];
    }
  }
  let delta = bestC - tNormTgt;
  if (delta > 0.5) delta -= 1;
  else if (delta < -0.5) delta += 1;
  _proSubDetailTTarget += delta;
  _proSubDetailSnapDone = true;
  _syncProSubDetailDots();
}

/* BIO: Pro Mode integration note. */

const PRO_BIO_ID_CARD_TEXT = {
  tr: {
    org: 'BIO AKADEM陌S陌',
    orgSub: 'P陌LOT K脺NYES陌',
    clrLabel: 'YETK陌',
    clrVal: 'A-7',
    name: 'AD',
    nameVal: '周天爽',
    codename: 'KOD ADI',
    codenameVal: 'ZTS',
    role: 'G脰REV',
    roleVal: '脰臑RENC陌',
    focus: 'ALAN',
    focusVal: 'YAPAY ZEKA 路 S陌BER G脺VENL陌K',
    statCuriosity: 'MERAK',
    statFocus: 'ODAK',
    statCalm: 'SAK陌NL陌K',
    statTeamwork: 'TAKIM 脟ALI艦MASI',
    statProactivity: 'PROAKT陌FL陌K',
    statCreativity: 'YARATICILIK',
    idText: 'KIMLIK-2026-危-04A7'
  },
  en: {
    org: 'ZTS ACADEMY',
    orgSub: 'PILOT MANIFEST',
    clrLabel: 'CLEARANCE',
    clrVal: 'A-7',
    name: 'NAME',
    nameVal: '周天爽',
    codename: 'CODENAME',
    codenameVal: 'ZTS',
    role: 'ROLE',
    roleVal: 'STUDENT',
    focus: 'FOCUS',
    focusVal: 'AI 路 CYBERSEC',
    statCuriosity: 'CURIOSITY',
    statFocus: 'FOCUS',
    statCalm: 'CALM',
    statTeamwork: 'TEAMWORK',
    statProactivity: 'PROACTIVITY',
    statCreativity: 'CREATIVITY',
    idText: 'ID-2026-危-04A7'
  },
  de: {
    org: 'ZTS-AKADEMIE',
    orgSub: 'PILOT-AKTE',
    clrLabel: 'FREIGABE',
    clrVal: 'A-7',
    name: 'NAME',
    nameVal: '周天爽',
    codename: 'CODENAME',
    codenameVal: 'ZTS',
    role: 'ROLLE',
    roleVal: 'STUDENT',
    focus: 'FOKUS',
    focusVal: 'KI 路 CYBERSEC',
    statCuriosity: 'NEUGIER',
    statFocus: 'FOKUS',
    statCalm: 'RUHE',
    statTeamwork: 'TEAMWORK',
    statProactivity: 'PROAKTIVIT脛T',
    statCreativity: 'KREATIVIT脛T',
    idText: 'ID-2026-危-04A7'
  }
};

function _ensureProBioIdCardCss() {
  if (document.getElementById('pro-bio-id-card-style')) return;
  const style = document.createElement('style');
  style.id = 'pro-bio-id-card-style';
  style.textContent = [
    '.pro-bio-id{pointer-events:none;user-select:none;opacity:0;transition:opacity .25s linear;transform-style:preserve-3d;}',
    '.pro-bio-id .pbi-card{--th:#ff8c3a;position:relative;pointer-events:auto;user-select:text;-webkit-user-select:text;width:760px;height:410px;padding:22px 30px 38px;background:linear-gradient(135deg,rgba(20,14,8,.78),rgba(8,5,3,.9));border:1px solid color-mix(in srgb,var(--th) 55%,transparent);border-radius:18px;font-family:"Orbitron","Share Tech Mono","Segoe UI",sans-serif;color:#f5e8d4;box-shadow:0 0 0 1px rgba(255,255,255,.06) inset,0 0 64px color-mix(in srgb,var(--th) 30%,transparent);overflow:hidden;}',
    '.pro-bio-id .pbi-card::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.05) 0 1px,transparent 1px 4px);pointer-events:none;opacity:.55;mix-blend-mode:screen;}',
    '.pro-bio-id .pbi-bg-grid{position:absolute;inset:0;background-image:linear-gradient(to right,color-mix(in srgb,var(--th) 18%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in srgb,var(--th) 18%,transparent) 1px,transparent 1px);background-size:36px 36px;opacity:.32;pointer-events:none;}',
    '.pro-bio-id .pbi-corner{position:absolute;width:22px;height:22px;border:2px solid var(--th);filter:drop-shadow(0 0 8px color-mix(in srgb,var(--th) 65%,transparent));}',
    '.pro-bio-id .pbi-tl{top:8px;left:8px;border-right:none;border-bottom:none;}',
    '.pro-bio-id .pbi-tr{top:8px;right:8px;border-left:none;border-bottom:none;}',
    '.pro-bio-id .pbi-bl{bottom:8px;left:8px;border-right:none;border-top:none;}',
    '.pro-bio-id .pbi-br{bottom:8px;right:8px;border-left:none;border-top:none;}',
    '.pro-bio-id .pbi-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;position:relative;}',
    '.pro-bio-id .pbi-org-block{display:flex;flex-direction:column;gap:2px;}',
    '.pro-bio-id .pbi-org{font-size:18px;font-weight:900;letter-spacing:.14em;color:var(--th);text-shadow:0 0 12px color-mix(in srgb,var(--th) 55%,transparent);}',
    '.pro-bio-id .pbi-org-sub{font-size:11px;letter-spacing:.28em;opacity:.6;}',
    '.pro-bio-id .pbi-clearance{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}',
    '.pro-bio-id .pbi-clr-label{font-size:10px;letter-spacing:.28em;opacity:.55;}',
    '.pro-bio-id .pbi-clr-val{font-size:24px;font-weight:900;letter-spacing:.18em;color:var(--th);text-shadow:0 0 12px color-mix(in srgb,var(--th) 60%,transparent);line-height:1;}',
    '.pro-bio-id .pbi-body{display:flex;gap:22px;align-items:stretch;position:relative;}',
    '.pro-bio-id .pbi-portrait{position:relative;width:148px;height:172px;border:1px solid color-mix(in srgb,var(--th) 50%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--th) 8%,transparent),color-mix(in srgb,var(--th) 2%,transparent));display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:8px;overflow:hidden;}',
    '.pro-bio-id .pbi-port-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;}',
    '.pro-bio-id .pbi-port-scan{z-index:2;position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--th),transparent);box-shadow:0 0 12px var(--th);animation:pbiScan 3.4s linear infinite;top:0;}',
    '@keyframes pbiScan{0%{top:0;opacity:.9;}50%{top:100%;opacity:1;}50.01%{opacity:0;}100%{top:0;opacity:0;}}',
    '.pro-bio-id .pbi-info{flex:1;display:flex;flex-direction:column;gap:6px;padding-top:2px;}',
    '.pro-bio-id .pbi-row{display:grid;grid-template-columns:108px 1fr;gap:14px;align-items:baseline;padding:6px 0;border-bottom:1px dashed color-mix(in srgb,var(--th) 24%,transparent);}',
    '.pro-bio-id .pbi-row:last-child{border-bottom:none;}',
    '.pro-bio-id .pbi-k{font-size:10px;letter-spacing:.22em;opacity:.65;}',
    '.pro-bio-id .pbi-v{font-size:15px;letter-spacing:.04em;color:#f7e8d6;text-shadow:0 0 8px color-mix(in srgb,var(--th) 32%,transparent);}',
    '.pro-bio-id .pbi-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 16px;margin-top:16px;}',
    '.pro-bio-id .pbi-stat{display:flex;flex-direction:column;gap:5px;}',
    '.pro-bio-id .pbi-stat-k{font-size:10px;letter-spacing:.22em;opacity:.7;}',
    '.pro-bio-id .pbi-bar{position:relative;height:6px;background:color-mix(in srgb,var(--th) 18%,transparent);border-radius:4px;overflow:hidden;}',
    '.pro-bio-id .pbi-bar-fill{height:100%;background:linear-gradient(90deg,var(--th),color-mix(in srgb,var(--th) 60%,#fff));box-shadow:0 0 10px color-mix(in srgb,var(--th) 65%,transparent);transform-origin:left;animation:pbiBarIn 1.1s cubic-bezier(.2,.7,.2,1) .2s both;}',
    '@keyframes pbiBarIn{from{transform:scaleX(0);}to{transform:scaleX(1);}}',
    '.pro-bio-id .pbi-footer{position:absolute;left:28px;right:28px;bottom:14px;display:flex;justify-content:space-between;align-items:center;}',
    '.pro-bio-id .pbi-id{font-size:11px;letter-spacing:.22em;opacity:.65;}',
    '.pro-bio-id .pbi-barcode{width:160px;height:22px;background:repeating-linear-gradient(90deg,color-mix(in srgb,var(--th) 75%,#fff 25%) 0 1px,transparent 1px 3px,color-mix(in srgb,var(--th) 60%,transparent) 3px 4px,transparent 4px 6px,color-mix(in srgb,var(--th) 80%,#fff 20%) 6px 8px,transparent 8px 11px);opacity:.85;}'
  ].join('\n');
  document.head.appendChild(style);
}

/* BIO: Hologram panel behavior and rendering note. */
function _buildProBioPilotIdCard(rootGroup, cfg, onReady) {
  if (!rootGroup) return;
  _ensureProBioIdCardCss();
  const lang = _proCurrentLang();
  const t = PRO_BIO_ID_CARD_TEXT[lang] || PRO_BIO_ID_CARD_TEXT.en;
  const el = document.createElement('div');
  el.className = 'pro-bio-id';
  el.innerHTML = (
    '<div class="pbi-card">' +
      '<div class="pbi-bg-grid"></div>' +
      '<div class="pbi-corner pbi-tl"></div>' +
      '<div class="pbi-corner pbi-tr"></div>' +
      '<div class="pbi-corner pbi-bl"></div>' +
      '<div class="pbi-corner pbi-br"></div>' +
      '<div class="pbi-header">' +
        '<div class="pbi-org-block">' +
          '<span class="pbi-org"></span>' +
          '<span class="pbi-org-sub"></span>' +
        '</div>' +
        '<div class="pbi-clearance">' +
          '<span class="pbi-clr-label"></span>' +
          '<span class="pbi-clr-val"></span>' +
        '</div>' +
      '</div>' +
      '<div class="pbi-body">' +
        '<div class="pbi-portrait">' +
          '<img class="pbi-port-img" src="' +
            PRO_BIO_PILOT_PORTRAIT_URL +
            '" alt="" decoding="async" draggable="false" aria-hidden="true" />' +
          '<div class="pbi-port-scan"></div>' +
        '</div>' +
        '<div class="pbi-info">' +
          '<div class="pbi-row"><span class="pbi-k" data-k="name"></span><span class="pbi-v" data-v="name"></span></div>' +
          '<div class="pbi-row"><span class="pbi-k" data-k="codename"></span><span class="pbi-v" data-v="codename"></span></div>' +
          '<div class="pbi-row"><span class="pbi-k" data-k="role"></span><span class="pbi-v" data-v="role"></span></div>' +
          '<div class="pbi-row"><span class="pbi-k" data-k="focus"></span><span class="pbi-v" data-v="focus"></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="pbi-stats">' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="curiosity"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:100%"></div></div></div>' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="focus"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:88%"></div></div></div>' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="calm"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:100%"></div></div></div>' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="teamwork"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:100%"></div></div></div>' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="proactivity"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:50%"></div></div></div>' +
        '<div class="pbi-stat"><span class="pbi-stat-k" data-k="creativity"></span><div class="pbi-bar"><div class="pbi-bar-fill" style="width:65%"></div></div></div>' +
      '</div>' +
      '<div class="pbi-footer">' +
        '<span class="pbi-id"></span>' +
        '<div class="pbi-barcode" aria-hidden="true"></div>' +
      '</div>' +
    '</div>'
  );
  /* BIO: Implementation note for this section. */
  const setText = (sel, val) => {
    const node = el.querySelector(sel);
    if (node) node.textContent = val;
  };
  setText('.pbi-org', t.org);
  setText('.pbi-org-sub', t.orgSub);
  setText('.pbi-clr-label', t.clrLabel);
  setText('.pbi-clr-val', t.clrVal);
  setText('.pbi-k[data-k="name"]', t.name);
  setText('.pbi-v[data-v="name"]', t.nameVal);
  setText('.pbi-k[data-k="codename"]', t.codename);
  setText('.pbi-v[data-v="codename"]', t.codenameVal);
  setText('.pbi-k[data-k="role"]', t.role);
  setText('.pbi-v[data-v="role"]', t.roleVal);
  setText('.pbi-k[data-k="focus"]', t.focus);
  setText('.pbi-v[data-v="focus"]', t.focusVal);
  setText('.pbi-stat-k[data-k="curiosity"]', t.statCuriosity);
  setText('.pbi-stat-k[data-k="focus"]', t.statFocus);
  setText('.pbi-stat-k[data-k="calm"]', t.statCalm);
  setText('.pbi-stat-k[data-k="teamwork"]', t.statTeamwork);
  setText('.pbi-stat-k[data-k="proactivity"]', t.statProactivity);
  setText('.pbi-stat-k[data-k="creativity"]', t.statCreativity);
  setText('.pbi-id', t.idText);

  /* BIO: Planet layout, label, and interaction note. */
  const card = el.querySelector('.pbi-card');
  if (card) card.style.setProperty('--th', cfg.cardThemeColor || '#ff8c3a');

  const obj = new CSS3DObject(el);
  const maxDim = _proSceneMaxDim || 1;
  const cardPxWidth = 720;
  const targetWorldWidth = (cfg.cardWorldWidthMul || 1.55) * maxDim;
  const s = targetWorldWidth / cardPxWidth;
  obj.scale.setScalar(s);
  /* BIO: Hologram panel behavior and rendering note. */
  obj.rotation.set(
    PRO_SUB_DIVE.cardLocalRot.x || 0,
    PRO_SUB_DIVE.cardLocalRot.y || 0,
    PRO_SUB_DIVE.cardLocalRot.z || 0
  );
  obj.name = 'proBioPilotIdCard3D';

  const model = new THREE.Group();
  model.name = 'proBioPilotIdCard';
  model.add(obj);
  rootGroup.add(model);

  /* BIO: Implementation note for this section. */
  const orbMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(cfg.cardThemeColor || '#ffae66'),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const orbGeo = new THREE.SphereGeometry(maxDim * 0.012, 12, 10);
  const orbR = (cfg.cardWorldWidthMul || 1.55) * maxDim * 0.62;
  const orbPhases = [];
  const orbTilts = [];
  const orbInst = new THREE.InstancedMesh(orbGeo, orbMat, 4);
  orbInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const orbDummy = new THREE.Object3D();
  for (let i = 0; i < 4; i += 1) {
    orbPhases.push((i / 4) * Math.PI * 2);
    orbTilts.push((i % 2 === 0 ? 1 : -1) * 0.08 * maxDim);
    const ph = orbPhases[i];
    orbDummy.position.set(
      Math.cos(ph) * orbR,
      orbTilts[i],
      Math.sin(ph) * orbR * 0.18
    );
    orbDummy.updateMatrix();
    orbInst.setMatrixAt(i, orbDummy.matrix);
  }
  orbInst.instanceMatrix.needsUpdate = true;
  model.add(orbInst);

  onReady({
    model,
    el,
    orbs: [],
    orbMat,
    orbGeo,
    /* BIO: Implementation note for this section. */
    applyOpacity: (m, alpha) => {
      el.style.opacity = String(alpha);
      orbMat.opacity = 0.85 * alpha;
    },
    /* BIO: Hologram panel behavior and rendering note. */
    autoSpin: (m, dt) => {
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const ts = now / 1000;
      m.rotation.y = Math.sin(ts * 0.32) * 0.20;
      m.rotation.x = Math.sin(ts * 0.21) * 0.06;
      const dtp = dt * 0.4;
      for (let i = 0; i < 4; i += 1) {
        orbPhases[i] += dtp;
        const ph = orbPhases[i];
        orbDummy.position.set(
          Math.cos(ph) * orbR,
          orbTilts[i] + Math.sin(ph * 1.6) * maxDim * 0.02,
          Math.sin(ph) * orbR * 0.18
        );
        orbDummy.updateMatrix();
        orbInst.setMatrixAt(i, orbDummy.matrix);
      }
      orbInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      if (orbGeo && typeof orbGeo.dispose === 'function') orbGeo.dispose();
      if (orbMat && typeof orbMat.dispose === 'function') orbMat.dispose();
    }
  });
}

/* BIO: Photo and gallery behavior note. */

function _ensureProPhotoWallCss() {
  if (document.getElementById('pro-photo-wall-style')) return;
  const style = document.createElement('style');
  style.id = 'pro-photo-wall-style';
  style.textContent = [
    '.pro-photo-wall{pointer-events:none;user-select:none;opacity:0;transition:opacity .25s linear;transform-style:preserve-3d;}',
    '.pro-photo-wall .ppw-frame{--th:#5cffa8;position:relative;pointer-events:auto;user-select:text;-webkit-user-select:text;display:flex;gap:30px;padding:34px 36px 32px;background:linear-gradient(135deg,rgba(8,18,12,.78),rgba(2,8,5,.92));border:1px solid color-mix(in srgb,var(--th) 55%,transparent);border-radius:18px;box-shadow:0 0 0 1px rgba(255,255,255,.06) inset,0 0 64px color-mix(in srgb,var(--th) 26%,transparent);}',
    '.pro-photo-wall .ppw-bg-grid{position:absolute;inset:0;background-image:linear-gradient(to right,color-mix(in srgb,var(--th) 14%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in srgb,var(--th) 14%,transparent) 1px,transparent 1px);background-size:36px 36px;opacity:.30;pointer-events:none;border-radius:18px;}',
    '.pro-photo-wall .ppw-corner{position:absolute;width:22px;height:22px;border:2px solid var(--th);filter:drop-shadow(0 0 8px color-mix(in srgb,var(--th) 65%,transparent));}',
    '.pro-photo-wall .ppw-tl{top:8px;left:8px;border-right:none;border-bottom:none;}',
    '.pro-photo-wall .ppw-tr{top:8px;right:8px;border-left:none;border-bottom:none;}',
    '.pro-photo-wall .ppw-bl{bottom:8px;left:8px;border-right:none;border-top:none;}',
    '.pro-photo-wall .ppw-br{bottom:8px;right:8px;border-left:none;border-top:none;}',
    '.pro-photo-wall .ppw-title{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,rgba(2,10,6,.96),rgba(0,2,1,.96));padding:6px 18px;border:1px solid color-mix(in srgb,var(--th) 55%,transparent);border-radius:999px;font:700 11px/1 "Orbitron","Share Tech Mono","Segoe UI",sans-serif;letter-spacing:.32em;color:var(--th);text-shadow:0 0 12px color-mix(in srgb,var(--th) 60%,transparent);white-space:nowrap;}',
    '.pro-photo-wall .ppw-card{position:relative;width:330px;background:linear-gradient(180deg,#0a120e,#020604);padding:14px 14px 16px;border:1px solid color-mix(in srgb,var(--th) 45%,transparent);border-radius:8px;box-shadow:0 18px 40px rgba(0,0,0,.6),0 0 28px color-mix(in srgb,var(--th) 22%,transparent);transform-origin:50% 60%;}',
    '.pro-photo-wall .ppw-card.ppw-l{transform:rotate(-3.6deg);}',
    '.pro-photo-wall .ppw-card.ppw-r{transform:rotate(3.6deg);}',
    '.pro-photo-wall .ppw-photo{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border:1px solid color-mix(in srgb,var(--th) 30%,transparent);border-radius:4px;background:#000;}',
    '.pro-photo-wall .ppw-photo img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.05) saturate(1.05);}',
    '.pro-photo-wall .ppw-photo::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.06) 0 1px,transparent 1px 4px);pointer-events:none;mix-blend-mode:screen;opacity:.55;}',
    '.pro-photo-wall .ppw-photo-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--th),transparent);box-shadow:0 0 12px var(--th);animation:ppwScan 4s linear infinite;top:0;}',
    '@keyframes ppwScan{0%{top:0;opacity:.85;}50%{top:100%;opacity:1;}50.01%{opacity:0;}100%{top:0;opacity:0;}}',
    '.pro-photo-wall .ppw-card.ppw-r .ppw-photo-scan{animation-delay:-2s;}',
    '.pro-photo-wall .ppw-cap{margin-top:12px;font:600 12px/1.4 "Share Tech Mono","Orbitron","Segoe UI",sans-serif;letter-spacing:.10em;color:#d8ffec;text-align:center;text-shadow:0 0 8px color-mix(in srgb,var(--th) 32%,transparent);}',
    '.pro-photo-wall .ppw-tag{position:absolute;top:-10px;left:14px;background:var(--th);color:#04140c;font:900 9px/1 "Orbitron","Segoe UI",sans-serif;letter-spacing:.24em;padding:5px 9px;border-radius:3px;box-shadow:0 0 12px color-mix(in srgb,var(--th) 60%,transparent);}'
  ].join('\n');
  document.head.appendChild(style);
}

/* BIO: Planet layout, label, and interaction note. */
function _buildProPhotoWall(rootGroup, cfg, onReady) {
  if (!rootGroup) return;
  _ensureProPhotoWallCss();
  const lang = _proCurrentLang();
  const wallText = cfg.wallText || {};
  const t = wallText[lang] || wallText.en || { title: '', p1: '', p2: '' };
  const photos = cfg.photoUrls || {};
  const el = document.createElement('div');
  el.className = 'pro-photo-wall';
  el.innerHTML = (
    '<div class="ppw-frame">' +
      '<div class="ppw-bg-grid"></div>' +
      '<div class="ppw-corner ppw-tl"></div>' +
      '<div class="ppw-corner ppw-tr"></div>' +
      '<div class="ppw-corner ppw-bl"></div>' +
      '<div class="ppw-corner ppw-br"></div>' +
      '<div class="ppw-title"></div>' +
      '<div class="ppw-card ppw-l">' +
        '<span class="ppw-tag">01</span>' +
        '<div class="ppw-photo">' +
          '<img alt="" />' +
          '<div class="ppw-photo-scan"></div>' +
        '</div>' +
        '<div class="ppw-cap" data-c="p1"></div>' +
      '</div>' +
      '<div class="ppw-card ppw-r">' +
        '<span class="ppw-tag">02</span>' +
        '<div class="ppw-photo">' +
          '<img alt="" />' +
          '<div class="ppw-photo-scan"></div>' +
        '</div>' +
        '<div class="ppw-cap" data-c="p2"></div>' +
      '</div>' +
    '</div>'
  );
  const setText = (sel, val) => {
    const node = el.querySelector(sel);
    if (node) node.textContent = val;
  };
  setText('.ppw-title', t.title);
  setText('.ppw-cap[data-c="p1"]', t.p1);
  setText('.ppw-cap[data-c="p2"]', t.p2);
  if (cfg.hidePhotoCards) {
    el.querySelectorAll('.ppw-card').forEach(card => card.remove());
  }
  const imgs = el.querySelectorAll('img');
  /* BIO: Photo and gallery behavior note. */
  const objPos = cfg.photoObjectPosition || {};
  if (imgs[0]) {
    imgs[0].src = photos.p1 || '';
    imgs[0].alt = t.p1;
    if (objPos.p1) imgs[0].style.objectPosition = objPos.p1;
  }
  if (imgs[1]) {
    imgs[1].src = photos.p2 || '';
    imgs[1].alt = t.p2;
    if (objPos.p2) imgs[1].style.objectPosition = objPos.p2;
  }

  /* BIO: Implementation note for this section. */
  const frame = el.querySelector('.ppw-frame');
  if (frame) frame.style.setProperty('--th', cfg.cardThemeColor || '#5cffa8');

  const obj = new CSS3DObject(el);
  const maxDim = _proSceneMaxDim || 1;
  /* BIO: Implementation note for this section. */
  const cardPxWidth = 760;
  const targetWorldWidth = (cfg.cardWorldWidthMul || 2.4) * maxDim;
  const s = targetWorldWidth / cardPxWidth;
  obj.scale.setScalar(s);
  obj.rotation.set(
    PRO_SUB_DIVE.cardLocalRot.x || 0,
    PRO_SUB_DIVE.cardLocalRot.y || 0,
    PRO_SUB_DIVE.cardLocalRot.z || 0
  );
  obj.name = 'proPhotoWall3D';

  const model = new THREE.Group();
  model.name = 'proPhotoWall';
  model.add(obj);
  rootGroup.add(model);

  /* BIO: Implementation note for this section. */
  const orbMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(cfg.cardThemeColor || '#5cffa8'),
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const orbGeo = new THREE.SphereGeometry(maxDim * 0.011, 12, 10);
  const orbR = (cfg.cardWorldWidthMul || 2.4) * maxDim * 0.58;
  const orbPhases = [];
  const orbTilts = [];
  const orbInst = new THREE.InstancedMesh(orbGeo, orbMat, 4);
  orbInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const orbDummy = new THREE.Object3D();
  for (let i = 0; i < 4; i += 1) {
    orbPhases.push((i / 4) * Math.PI * 2);
    orbTilts.push((i % 2 === 0 ? 1 : -1) * 0.07 * maxDim);
    const ph = orbPhases[i];
    orbDummy.position.set(
      Math.cos(ph) * orbR,
      orbTilts[i],
      Math.sin(ph) * orbR * 0.18
    );
    orbDummy.updateMatrix();
    orbInst.setMatrixAt(i, orbDummy.matrix);
  }
  orbInst.instanceMatrix.needsUpdate = true;
  model.add(orbInst);

  onReady({
    model,
    el,
    orbs: [],
    orbMat,
    orbGeo,
    applyOpacity: (m, alpha) => {
      el.style.opacity = String(alpha);
      orbMat.opacity = 0.78 * alpha;
    },
    autoSpin: (m, dt) => {
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const ts = now / 1000;
      m.rotation.y = Math.sin(ts * 0.30) * 0.18;
      m.rotation.x = Math.sin(ts * 0.20) * 0.05;
      const dtp = dt * 0.35;
      for (let i = 0; i < 4; i += 1) {
        orbPhases[i] += dtp;
        const ph = orbPhases[i];
        orbDummy.position.set(
          Math.cos(ph) * orbR,
          orbTilts[i] + Math.sin(ph * 1.6) * maxDim * 0.02,
          Math.sin(ph) * orbR * 0.18
        );
        orbDummy.updateMatrix();
        orbInst.setMatrixAt(i, orbDummy.matrix);
      }
      orbInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      if (orbGeo && typeof orbGeo.dispose === 'function') orbGeo.dispose();
      if (orbMat && typeof orbMat.dispose === 'function') orbMat.dispose();
    }
  });
}

/* BIO: Education GLB builder (cfg.builder.type === 'glb') */

function _buildProEduFallbackModel() {
  const g = new THREE.Group();
  g.name = 'proEduUniversityFallback';
  const maxDim = _proSceneMaxDim || 1;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(maxDim * 0.42, maxDim * 0.16, maxDim * 0.26),
    new THREE.MeshStandardMaterial({
      color: 0xd98b45,
      emissive: 0x3a1c08,
      roughness: 0.62,
      metalness: 0.12
    })
  );
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(maxDim * 0.25, maxDim * 0.13, 4),
    new THREE.MeshStandardMaterial({
      color: 0xffb066,
      emissive: 0x2a1404,
      roughness: 0.65
    })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = maxDim * 0.14;
  g.add(body, roof);
  return g;
}

function _buildProBasketballFigure(rootGroup, cfg, onReady) {
  if (!rootGroup) return;

  const g = new THREE.Group();
  g.name = (cfg && cfg.modelName) || 'proBasketballFigure';

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xb87552,
    roughness: 0.48,
    metalness: 0.02
  });
  const skinGlowMat = skinMat.clone();
  skinGlowMat.emissive.setHex(0x1b0803);
  skinGlowMat.emissiveIntensity = 0.08;

  const uniformMat = new THREE.MeshStandardMaterial({
    color: 0x05070c,
    emissive: 0x00050a,
    emissiveIntensity: 0.18,
    roughness: 0.58,
    metalness: 0.08
  });
  const clothMat = new THREE.MeshStandardMaterial({
    color: 0x0b1020,
    emissive: 0x00111a,
    emissiveIntensity: 0.12,
    roughness: 0.62,
    metalness: 0.04
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf4f4ef,
    emissive: 0x101010,
    emissiveIntensity: 0.05,
    roughness: 0.42
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x070707,
    roughness: 0.86
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x030408,
    emissive: 0x00141a,
    emissiveIntensity: 0.18,
    roughness: 0.5,
    metalness: 0.12
  });
  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00a8b8,
    emissiveIntensity: 0.85,
    roughness: 0.38,
    metalness: 0.08
  });

  const addMesh = (name, geo, mat, pos, rot, scale) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    if (pos) m.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
    if (rot) m.rotation.set(rot.x || 0, rot.y || 0, rot.z || 0);
    if (scale) m.scale.set(scale.x || 1, scale.y || 1, scale.z || 1);
    g.add(m);
    return m;
  };

  const limb = (name, radiusTop, radiusBottom, height, mat, pos, rot) =>
    addMesh(
      name,
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28, 1),
      mat,
      pos,
      rot
    );

  const torso = addMesh(
    'blackSleevelessJersey',
    new THREE.CylinderGeometry(0.34, 0.45, 1.08, 36, 1),
    uniformMat,
    { x: 0, y: 1.95, z: 0 },
    null,
    { x: 0.86, y: 1, z: 0.42 }
  );

  const chestMark = addMesh(
    'dukeStyleChestMark',
    new THREE.PlaneGeometry(0.26, 0.18),
    whiteMat,
    { x: 0, y: 2.06, z: 0.185 },
    null
  );
  chestMark.renderOrder = 4;

  addMesh(
    'waistBand',
    new THREE.CylinderGeometry(0.44, 0.47, 0.12, 36, 1),
    clothMat,
    { x: 0, y: 1.36, z: 0 },
    null,
    { x: 0.9, y: 1, z: 0.46 }
  );
  addMesh(
    'blackShorts',
    new THREE.CylinderGeometry(0.46, 0.56, 0.54, 36, 1),
    clothMat,
    { x: 0, y: 1.1, z: 0 },
    null,
    { x: 0.92, y: 1, z: 0.48 }
  );
  addMesh('leftShortPanel', new THREE.BoxGeometry(0.1, 0.38, 0.025), whiteMat, { x: -0.34, y: 1.05, z: 0.2 }, { z: -0.18 });
  addMesh('rightShortPanel', new THREE.BoxGeometry(0.1, 0.38, 0.025), whiteMat, { x: 0.34, y: 1.05, z: 0.2 }, { z: 0.18 });

  limb('neck', 0.12, 0.13, 0.18, skinGlowMat, { x: 0, y: 2.57, z: 0 });
  addMesh('head', new THREE.SphereGeometry(0.27, 36, 24), skinGlowMat, { x: 0.01, y: 2.86, z: 0.02 }, null, { x: 0.9, y: 1.08, z: 0.82 });
  addMesh('chin', new THREE.SphereGeometry(0.12, 24, 14), skinGlowMat, { x: 0.005, y: 2.68, z: 0.105 }, null, { x: 0.9, y: 0.58, z: 0.65 });

  const hairRoot = new THREE.Group();
  hairRoot.name = 'curlyHair';
  const hairPoints = [
    [-0.18, 3.07, -0.02, 0.13], [-0.06, 3.12, 0.03, 0.15], [0.08, 3.1, 0.02, 0.14],
    [0.2, 3.04, -0.02, 0.12], [-0.27, 2.96, 0, 0.12], [0.27, 2.96, 0, 0.12],
    [-0.12, 3.0, 0.12, 0.1], [0.12, 3.0, 0.12, 0.1], [0.0, 3.18, -0.03, 0.11]
  ];
  for (const [x, y, z, r] of hairPoints) {
    const curl = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), hairMat);
    curl.position.set(x, y, z);
    hairRoot.add(curl);
  }
  g.add(hairRoot);

  addMesh('leftEye', new THREE.SphereGeometry(0.018, 12, 8), hairMat, { x: -0.075, y: 2.9, z: 0.23 });
  addMesh('rightEye', new THREE.SphereGeometry(0.018, 12, 8), hairMat, { x: 0.08, y: 2.9, z: 0.23 });
  addMesh('nose', new THREE.ConeGeometry(0.025, 0.08, 12), skinMat, { x: 0.005, y: 2.82, z: 0.26 }, { x: Math.PI / 2 });
  addMesh('mouth', new THREE.BoxGeometry(0.12, 0.012, 0.01), hairMat, { x: 0.005, y: 2.72, z: 0.245 });

  limb('leftUpperArm', 0.09, 0.08, 0.62, skinMat, { x: -0.43, y: 2.02, z: 0.03 }, { z: -0.16 });
  limb('rightUpperArm', 0.09, 0.08, 0.62, skinMat, { x: 0.43, y: 2.02, z: 0.03 }, { z: 0.16 });
  limb('leftForearm', 0.075, 0.065, 0.62, skinMat, { x: -0.53, y: 1.48, z: 0.02 }, { z: -0.08 });
  limb('rightForearm', 0.075, 0.065, 0.62, skinMat, { x: 0.53, y: 1.48, z: 0.02 }, { z: 0.08 });
  addMesh('leftHand', new THREE.SphereGeometry(0.075, 18, 12), skinMat, { x: -0.57, y: 1.13, z: 0.02 }, null, { x: 0.8, y: 1.1, z: 0.55 });
  addMesh('rightHand', new THREE.SphereGeometry(0.075, 18, 12), skinMat, { x: 0.57, y: 1.13, z: 0.02 }, null, { x: 0.8, y: 1.1, z: 0.55 });

  limb('leftThigh', 0.14, 0.12, 0.58, skinMat, { x: -0.19, y: 0.62, z: 0 }, { z: 0.03 });
  limb('rightThigh', 0.14, 0.12, 0.58, skinMat, { x: 0.19, y: 0.62, z: 0 }, { z: -0.03 });
  limb('leftCalf', 0.105, 0.075, 0.62, skinMat, { x: -0.19, y: 0.03, z: 0.01 }, { z: -0.02 });
  limb('rightCalf', 0.105, 0.075, 0.62, skinMat, { x: 0.19, y: 0.03, z: 0.01 }, { z: 0.02 });
  addMesh('leftShoe', new THREE.BoxGeometry(0.28, 0.11, 0.48), shoeMat, { x: -0.2, y: -0.34, z: 0.1 }, { x: 0.02 });
  addMesh('rightShoe', new THREE.BoxGeometry(0.28, 0.11, 0.48), shoeMat, { x: 0.2, y: -0.34, z: 0.1 }, { x: 0.02 });
  addMesh('leftShoeAccent', new THREE.BoxGeometry(0.16, 0.018, 0.012), whiteMat, { x: -0.2, y: -0.3, z: 0.345 }, { z: -0.28 });
  addMesh('rightShoeAccent', new THREE.BoxGeometry(0.16, 0.018, 0.012), whiteMat, { x: 0.2, y: -0.3, z: 0.345 }, { z: 0.28 });

  const baseRing = addMesh(
    'cyanHoloBase',
    new THREE.TorusGeometry(0.58, 0.01, 12, 96),
    cyanMat,
    { x: 0, y: -0.42, z: 0 },
    { x: Math.PI / 2 }
  );
  baseRing.renderOrder = 2;

  _normalizeProSubDetailModel(g, cfg);
  rootGroup.add(g);
  onReady({
    model: g,
    autoSpin: (model, dt, pageCfg) => {
      if (!model) return;
      model.rotation.y += dt * ((pageCfg && pageCfg.modelAutoRotateSpeed) || 0.25);
    }
  });
}

/* BIO: Implementation note for this section. */
function _normalizeProSubDetailModel(model, cfg) {
  if (!model) return;
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = _proSceneMaxDim || 1;
  const heightMul = (cfg && cfg.modelHeightMul) || 0.46;
  const targetH = Math.max(0.001, heightMul * maxDim);
  const srcH = Math.max(0.001, size.y || Math.max(size.x, size.z));
  const scl = targetH / srcH;
  model.scale.multiplyScalar(scl);
  model.position.sub(center.multiplyScalar(scl));
}

/* BIO: Implementation note for this section. */
function _proSubDetailBuilder_glb(rootGroup, cfg, onReady) {
  if (!rootGroup || _proSubDetailLoading || _proSubDetailLoaded) return;
  _proSubDetailLoading = true;
  const url = cfg.builder.glbUrl;
  const fallbackFn = cfg.builder.fallback;
  const finalize = (raw, isFallback) => {
    _proSubDetailLoading = false;
    if (!_proSubDetailRoot) return;
    const model = raw || (fallbackFn ? fallbackFn() : new THREE.Group());
    model.name = (cfg.builder.modelName || 'proSubDetailModel') + (isFallback ? 'Fallback' : '');
    model.traverse(o => {
      if (o.isMesh && o.material) {
        o.castShadow = false;
        o.receiveShadow = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (typeof m._proSubDetailBaseOpacity !== 'number') {
            m._proSubDetailBaseOpacity = (typeof m.opacity === 'number' ? m.opacity : 1);
          }
          if (typeof m._proSubDetailBaseTransparent !== 'boolean') {
            m._proSubDetailBaseTransparent = !!m.transparent;
          }
          if (m.emissive && typeof m.emissiveIntensity === 'number') {
            m.emissiveIntensity = Math.max(m.emissiveIntensity, 0.12);
          }
        }
      }
    });
    _normalizeProSubDetailModel(model, cfg);
    rootGroup.add(model);
    onReady({ model });
  };
  if (!url) { finalize(null, true); return; }
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    url,
    gltf => finalize(gltf.scene, false),
    undefined,
    () => finalize(null, true)
  );
}

/* BIO: Generic label (CSS3D, theme-aware) */

function _createProSubDetailLabel3D(cfg) {
  if (!cfg) return null;
  const lang = _proCurrentLang();
  const text = (cfg.labelText && (cfg.labelText[lang] || cfg.labelText.en)) || '';
  if (!text) return null;
  if (!document.getElementById('pro-sub-model-label-style-v2')) {
    const style = document.createElement('style');
    style.id = 'pro-sub-model-label-style-v2';
    style.textContent = [
      /* BIO: Pro Mode integration note. */
      '.pro-sub-model-label{pointer-events:none;user-select:none;opacity:0;transition:opacity .18s linear;transform-style:preserve-3d;--lbl-glow:rgba(255,175,102,.95);--lbl-glow2:rgba(255,175,102,.78);--lbl-glow3:rgba(255,175,102,.42);--lbl-stroke:rgba(255,175,102,.45);}',
      '.pro-sub-model-label-inner{text-align:center;white-space:nowrap;pointer-events:auto;user-select:text;-webkit-user-select:text;cursor:text;font-family:"Orbitron","Share Tech Mono","Segoe UI",sans-serif;font-weight:900;letter-spacing:.08em;line-height:1.05;color:#fff6df;text-shadow:0 0 8px var(--lbl-glow),0 0 24px var(--lbl-glow2),0 0 42px var(--lbl-glow3);-webkit-text-stroke:1px var(--lbl-stroke);}',
      '.pro-sub-model-label-inner::after{content:"";display:block;height:2px;width:62%;margin:12px auto 0;background:linear-gradient(90deg,transparent,var(--lbl-glow),transparent);box-shadow:0 0 16px var(--lbl-glow);}'
    ].join('\n');
    document.head.appendChild(style);
  }
  const el = document.createElement('div');
  el.className = 'pro-sub-model-label';
  el.innerHTML = '<div class="pro-sub-model-label-inner"></div>';
  const inner = el.querySelector('.pro-sub-model-label-inner');
  if (inner) {
    inner.textContent = text;
    inner.style.width = (cfg.labelPxWidth || 960) + 'px';
    inner.style.fontSize = (cfg.labelFontPx || 54) + 'px';
  }
  if (cfg.themeRgba) {
    if (cfg.themeRgba.glow) el.style.setProperty('--lbl-glow', cfg.themeRgba.glow);
    if (cfg.themeRgba.glow2) el.style.setProperty('--lbl-glow2', cfg.themeRgba.glow2);
    if (cfg.themeRgba.glow3) el.style.setProperty('--lbl-glow3', cfg.themeRgba.glow3);
    if (cfg.themeRgba.stroke) el.style.setProperty('--lbl-stroke', cfg.themeRgba.stroke);
  }
  const obj = new CSS3DObject(el);
  const maxDim = _proSceneMaxDim || 1;
  const s = ((cfg.labelWorldWidthMul || 1.55) * maxDim) / Math.max(1, cfg.labelPxWidth || 960);
  obj.scale.setScalar(s);
  obj.rotation.set(
    PRO_SUB_DIVE.cardLocalRot.x || 0,
    PRO_SUB_DIVE.cardLocalRot.y || 0,
    PRO_SUB_DIVE.cardLocalRot.z || 0
  );
  obj.name = 'proSubDetailLabel3D';
  _proSubDetailLabelEl = el;
  return obj;
}

function _attachProSubDetailLabel(cfg) {
  const reg = PRO_PLANET_REGISTRY[proSubActivePlanetId];
  const parentRoot = reg && reg.subRoot();
  if (!parentRoot) return;
  if (_proSubDetailLabel3D && _proSubDetailLabel3D.parent) {
    _proSubDetailLabel3D.parent.remove(_proSubDetailLabel3D);
  }
  if (_proSubDetailLabelEl && _proSubDetailLabelEl.parentNode) {
    _proSubDetailLabelEl.parentNode.removeChild(_proSubDetailLabelEl);
  }
  _proSubDetailLabel3D = _createProSubDetailLabel3D(cfg);
  if (_proSubDetailLabel3D) parentRoot.add(_proSubDetailLabel3D);
}

/* BIO: Implementation note for this section. */
function _runProSubDetailBuilder(cfg) {
  if (!cfg) return;
  const t = cfg.builder && cfg.builder.type;
  const onReady = (hooks) => {
    _proSubDetailModel = hooks.model || null;
    _proSubDetailBuilderHooks = hooks || null;
    _attachProSubDetailLabel(cfg);
    _proSubDetailLoaded = true;
    _updateProSubDetailCarousel(0, true);
  };
  if (t === 'glb') _proSubDetailBuilder_glb(_proSubDetailRoot, cfg, onReady);
  else if (t === 'procedural' && typeof cfg.builder.build === 'function') {
    cfg.builder.build(_proSubDetailRoot, cfg, onReady);
  }
}

/* BIO: Implementation note for this section. */
function _buildProSubDetailSecondaryGlb(rootGroup, pageCfg, onReady) {
  if (!rootGroup || _proSubDetailLoading2 || _proSubDetailLoaded2) return;
  _proSubDetailLoading2 = true;
  const url = pageCfg.glbUrl;
  const fallbackFn = pageCfg.fallback;
  const finalize = (raw, isFallback) => {
    _proSubDetailLoading2 = false;
    if (!_proSubDetailRoot2) return;
    const model = raw || (fallbackFn ? fallbackFn() : new THREE.Group());
    model.name = (pageCfg.modelName || 'proSubDetailModel2') + (isFallback ? 'Fallback' : '');
    model.traverse(o => {
      if (o.isMesh && o.material) {
        o.castShadow = false;
        o.receiveShadow = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (typeof m._proSubDetailBaseOpacity !== 'number') {
            m._proSubDetailBaseOpacity = (typeof m.opacity === 'number' ? m.opacity : 1);
          }
          if (typeof m._proSubDetailBaseTransparent !== 'boolean') {
            m._proSubDetailBaseTransparent = !!m.transparent;
          }
          if (m.emissive && typeof m.emissiveIntensity === 'number') {
            m.emissiveIntensity = Math.max(m.emissiveIntensity, 0.12);
          }
        }
      }
    });
    _normalizeProSubDetailModel(model, pageCfg);
    rootGroup.add(model);
    onReady({ model });
  };
  if (!url) { finalize(null, true); return; }
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    url,
    gltf => finalize(gltf.scene, false),
    undefined,
    () => finalize(null, true)
  );
}

/* BIO: Scroll and navigation behavior note. */
function _setupProSubDetailSecondary(parentRoot, mainCfg) {
  if (!parentRoot || !mainCfg || !mainCfg.secondBuilder) return;
  const pageCfg = mainCfg.secondBuilder;
  const maxDim = _proSceneMaxDim || 1;
  const root = new THREE.Group();
  root.name = 'proSubDetailCarouselRoot2';
  const p = pageCfg.modelPos || mainCfg.modelPos;
  root.position.set(p.x * maxDim, p.y * maxDim, p.z * maxDim);
  const r = pageCfg.modelRot || mainCfg.modelRot || { x: 0, y: 0, z: 0 };
  root.rotation.set(r.x || 0, r.y || 0, r.z || 0);
  parentRoot.add(root);
  _proSubDetailRoot2 = root;
  _proSubDetailModelBasePos2.set(p.x * maxDim, p.y * maxDim, p.z * maxDim);
  /* BIO: Implementation note for this section. */
  if (pageCfg.labelPos) {
    const lp = pageCfg.labelPos;
    _proSubDetailLabelBasePos2.set(lp.x * maxDim, lp.y * maxDim, lp.z * maxDim);
  } else {
    _proSubDetailLabelBasePos2.set(
      p.x * maxDim,
      (p.y + (pageCfg.modelHeightMul || 0.46) + (pageCfg.labelOffsetYMul || 0.4)) * maxDim,
      p.z * maxDim
    );
  }
  /* BIO: Language control and localization note. */
  const t = pageCfg.type;
  const onReady = (hooks) => {
    _proSubDetailModel2 = hooks.model || null;
    _proSubDetailBuilderHooks2 = hooks || null;
    /* BIO: Language control and localization note. */
    const labelCfg = Object.assign({}, mainCfg, pageCfg);
    _attachProSubDetailLabelSecondary(labelCfg);
    _proSubDetailLoaded2 = true;
    _updateProSubDetailCarousel(0, true);
  };
  if (t === 'glb') {
    _buildProSubDetailSecondaryGlb(_proSubDetailRoot2, pageCfg, onReady);
  } else if (t === 'procedural' && typeof pageCfg.build === 'function') {
    pageCfg.build(_proSubDetailRoot2, pageCfg, onReady);
  }
}

/* BIO: Language control and localization note. */
function _attachProSubDetailLabelSecondary(labelCfg) {
  const reg = PRO_PLANET_REGISTRY[proSubActivePlanetId];
  const parentRoot = reg && reg.subRoot();
  if (!parentRoot) return;
  if (_proSubDetailLabel3D2 && _proSubDetailLabel3D2.parent) {
    _proSubDetailLabel3D2.parent.remove(_proSubDetailLabel3D2);
  }
  if (_proSubDetailLabelEl2 && _proSubDetailLabelEl2.parentNode) {
    _proSubDetailLabelEl2.parentNode.removeChild(_proSubDetailLabelEl2);
  }
  /* BIO: Pro Mode integration note. */
  const prevPrimaryEl = _proSubDetailLabelEl;
  const obj = _createProSubDetailLabel3D(labelCfg);
  _proSubDetailLabelEl2 = _proSubDetailLabelEl;
  _proSubDetailLabelEl = prevPrimaryEl;
  if (obj) {
    obj.name = 'proSubDetailLabel3D2';
    parentRoot.add(obj);
    _proSubDetailLabel3D2 = obj;
  }
}

function _setupProSubDetailCarousel(parentRoot) {
  const cfg = _proCurrentSubDetailCfg();
  if (!cfg) {
    _disposeProSubDetailCarousel();
    _proSubDetailLastSubKey = null;
    return;
  }
  if (!parentRoot || !_proSubHoloCard3D) return;
  /* BIO: Planet layout, label, and interaction note. */
  const newKey = proSubActivePlanetId + '/' + proSubActiveSubId;
  let preserveT = null;
  let preserveTT = null;
  if (_proSubDetailRoot && _proSubDetailLastSubKey === newKey) {
    preserveT = _proSubDetailT;
    preserveTT = _proSubDetailTTarget;
  }
  _disposeProSubDetailCarousel();
  const maxDim = _proSceneMaxDim || 1;
  const root = new THREE.Group();
  root.name = 'proSubDetailCarouselRoot';
  const p = cfg.modelPos;
  root.position.set(p.x * maxDim, p.y * maxDim, p.z * maxDim);
  const r = cfg.modelRot;
  root.rotation.set(r.x || 0, r.y || 0, r.z || 0);
  parentRoot.add(root);
  _proSubDetailRoot = root;
  if (preserveT !== null) {
    _proSubDetailT = preserveT;
    _proSubDetailTTarget = preserveTT;
    _proSubDetailLastWheelT = 0;
    _proSubDetailSnapDone = true;
  } else {
    _proSubDetailT = 0;
    _proSubDetailTTarget = 0;
    _proSubDetailLastWheelT = 0;
    _proSubDetailSnapDone = true;
  }
  _proSubDetailHoloBasePos.copy(_proSubHoloCard3D.position);
  _proSubDetailModelBasePos.set(p.x * maxDim, p.y * maxDim, p.z * maxDim);
  /* BIO: Implementation note for this section. */
  if (cfg.labelPos) {
    const lp = cfg.labelPos;
    _proSubDetailLabelBasePos.set(lp.x * maxDim, lp.y * maxDim, lp.z * maxDim);
  } else {
    _proSubDetailLabelBasePos.set(
      p.x * maxDim,
      (p.y + (cfg.modelHeightMul || 0.46) + (cfg.labelOffsetYMul || 0.4)) * maxDim,
      p.z * maxDim
    );
  }
  _ensureProSubDetailDots(cfg);
  _syncProSubDetailDots();
  _injectProSubDetailScrollHint(cfg);
  _runProSubDetailBuilder(cfg);
  /* BIO: 3.sayfa varsa (cfg.secondBuilder) parallel kur. */
  if (cfg.secondBuilder) {
    _setupProSubDetailSecondary(parentRoot, cfg);
  }
  _updateProSubDetailCarousel(0, true);
  _proSubDetailLastSubKey = newKey;
}

/* BIO: Hologram panel behavior and rendering note. */
function _injectProSubDetailScrollHint(cfg) {
  cfg = cfg || _proCurrentSubDetailCfg();
  if (!cfg || !_proSubHoloCard3DEl) return;
  const card = _proSubHoloCard3DEl.querySelector('.psh-card');
  if (!card) return;
  let hint = card.querySelector('.psh-scroll-hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'psh-scroll-hint';
    hint.innerHTML = '<span class="psh-hint-text"></span><span class="psh-hint-chev" aria-hidden="true"></span>';
    card.appendChild(hint);
  }
  const lang = _proCurrentLang();
  const txt = (cfg.scrollHintText && (cfg.scrollHintText[lang] || cfg.scrollHintText.en)) || '';
  const span = hint.querySelector('.psh-hint-text');
  if (span) span.textContent = txt;
}

function _disposeProSubDetailCarousel() {
  if (_proSubDetailDotsEl && _proSubDetailDotsEl.parentNode) {
    _proSubDetailDotsEl.parentNode.removeChild(_proSubDetailDotsEl);
  }
  _proSubDetailDotsEl = null;
  if (_proSubDetailLabel3D && _proSubDetailLabel3D.parent) {
    _proSubDetailLabel3D.parent.remove(_proSubDetailLabel3D);
  }
  if (_proSubDetailLabelEl && _proSubDetailLabelEl.parentNode) {
    _proSubDetailLabelEl.parentNode.removeChild(_proSubDetailLabelEl);
  }
  /* BIO: Implementation note for this section. */
  if (_proSubDetailBuilderHooks && typeof _proSubDetailBuilderHooks.dispose === 'function') {
    try { _proSubDetailBuilderHooks.dispose(); } catch (_) { /* BIO: yutulur */ }
  }
  if (_proSubDetailRoot) {
    if (_proSubDetailRoot.parent) _proSubDetailRoot.parent.remove(_proSubDetailRoot);
    _proSubDetailRoot.traverse(o => {
      if (o.geometry && typeof o.geometry.dispose === 'function') o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (m.map) m.map.dispose();
          m.dispose();
        }
      }
    });
  }
  _proSubDetailRoot = null;
  _proSubDetailModel = null;
  _proSubDetailLabel3D = null;
  _proSubDetailLabelEl = null;
  _proSubDetailBuilderHooks = null;
  _proSubDetailLoading = false;
  _proSubDetailLoaded = false;
  _proSubDetailT = 0;
  _proSubDetailTTarget = 0;
  _proSubDetailLastWheelT = 0;
  _proSubDetailSnapDone = true;
  /* BIO: Implementation note for this section. */
  if (_proSubDetailLabel3D2 && _proSubDetailLabel3D2.parent) {
    _proSubDetailLabel3D2.parent.remove(_proSubDetailLabel3D2);
  }
  if (_proSubDetailLabelEl2 && _proSubDetailLabelEl2.parentNode) {
    _proSubDetailLabelEl2.parentNode.removeChild(_proSubDetailLabelEl2);
  }
  if (_proSubDetailBuilderHooks2 && typeof _proSubDetailBuilderHooks2.dispose === 'function') {
    try { _proSubDetailBuilderHooks2.dispose(); } catch (_) { /* BIO: yutulur */ }
  }
  if (_proSubDetailRoot2) {
    if (_proSubDetailRoot2.parent) _proSubDetailRoot2.parent.remove(_proSubDetailRoot2);
    _proSubDetailRoot2.traverse(o => {
      if (o.geometry && typeof o.geometry.dispose === 'function') o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (m.map) m.map.dispose();
          m.dispose();
        }
      }
    });
  }
  _proSubDetailRoot2 = null;
  _proSubDetailModel2 = null;
  _proSubDetailLabel3D2 = null;
  _proSubDetailLabelEl2 = null;
  _proSubDetailBuilderHooks2 = null;
  _proSubDetailLoading2 = false;
  _proSubDetailLoaded2 = false;
}

/* BIO: Hologram panel behavior and rendering note. */

/* BIO: Implementation note for this section. */
let _proSubStaticDecorGlowTex = null;
function _ensureProSubStaticDecorGlowTex() {
  if (_proSubStaticDecorGlowTex) return _proSubStaticDecorGlowTex;
  const sz = 256;
  const cnv = document.createElement('canvas');
  cnv.width = sz; cnv.height = sz;
  const ctx = cnv.getContext('2d');
  const cx = sz * 0.5;
  const cy = sz * 0.5;
  const r = sz * 0.5;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.75, 'rgba(255,255,255,0.10)');
  g.addColorStop(1.0, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, sz, sz);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _proSubStaticDecorGlowTex = tex;
  return tex;
}

/* BIO: Scroll and navigation behavior note. */
function _setupProSubStaticDecor(parentRoot) {
  const cfg = _proCurrentSubStaticDecorCfg();
  if (!cfg) {
    _disposeProSubStaticDecor();
    _proSubStaticDecorLastSubKey = null;
    return;
  }
  if (!parentRoot || !_proSubHoloCard3D) return;
  const newKey = proSubActivePlanetId + '/' + proSubActiveSubId;
  /* BIO: Hologram panel behavior and rendering note. */
  _disposeProSubStaticDecor();

  const maxDim = _proSceneMaxDim || 1;

  if (cfg.holoCardYOffsetMul) {
    const offset = cfg.holoCardYOffsetMul * maxDim;
    _proSubHoloCard3D.position.y += offset;
    _proSubStaticDecorHoloOffset = offset;
    _proSubStaticDecorOffsetCard = _proSubHoloCard3D;
  }

  const root = new THREE.Group();
  root.name = 'proSubStaticDecorRoot';
  parentRoot.add(root);
  _proSubStaticDecorRoot = root;
  _proSubStaticDecorLastSubKey = newKey;

  const models = Array.isArray(cfg.models) ? cfg.models : [];
  if (!models.length) return;

  /* BIO: Implementation note for this section. */
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  for (let i = 0; i < models.length; i += 1) {
    const m = models[i];
    if (!m || !m.glbUrl) continue;
    const sub = new THREE.Group();
    sub.name = 'proSubStaticDecorEntry_' + i;
    const p = m.modelPos || { x: 0, y: 0, z: 0 };
    sub.position.set(p.x * maxDim, p.y * maxDim, p.z * maxDim);
    const r = m.modelRot || { x: 0, y: 0, z: 0 };
    sub.rotation.set(r.x || 0, r.y || 0, r.z || 0);
    root.add(sub);

    const entry = {
      subRoot: sub,
      model: null,
      hitProxy: null,
      autoRotateSpeed: m.autoRotateSpeed || 0,
      modelCfg: m,
      decorSubKey: newKey,
      _prevMailHoverWant: 0,
      /* BIO: Implementation note for this section. */
      invalid: false
    };
    _proSubStaticDecorEntries.push(entry);

    _proSubStaticDecorLoading += 1;
    loader.load(
      m.glbUrl,
      gltf => _onProSubStaticDecorLoaded(gltf, m, entry),
      undefined,
      () => {
        _proSubStaticDecorLoading = Math.max(0, _proSubStaticDecorLoading - 1);
      }
    );
  }
}

function _onProSubStaticDecorLoaded(gltf, modelCfg, entry) {
  _proSubStaticDecorLoading = Math.max(0, _proSubStaticDecorLoading - 1);
  /* BIO: Language control and localization note. */
  if (
    !_proSubStaticDecorRoot ||
    !entry ||
    entry.invalid ||
    !entry.subRoot ||
    !_proSubStaticDecorEntries.includes(entry)
  ) {
    return;
  }
  const model = (gltf && (gltf.scene || (gltf.scenes && gltf.scenes[0]))) || null;
  if (!model) return;
  const maxDim = _proSceneMaxDim || 1;
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const targetH = Math.max(0.001, (modelCfg.modelHeightMul || 0.30) * maxDim);
  const srcH = Math.max(0.001, size.y || Math.max(size.x, size.z));
  const scl = targetH / srcH;
  model.scale.multiplyScalar(scl);
  model.position.sub(center.multiplyScalar(scl));
  entry.subRoot.add(model);
  entry.model = model;
  /* BIO: Implementation note for this section. */
  entry._baseScale = new THREE.Vector3().copy(model.scale);

  /* BIO: Pro Mode integration note. */
  const padded = (modelCfg.hitProxyPaddingMul || 1.10);
  const proxyGeo = new THREE.BoxGeometry(
    Math.max(0.001, size.x * scl) * padded,
    Math.max(0.001, size.y * scl) * padded,
    Math.max(0.001, size.z * scl) * padded
  );
  const proxyMat = new THREE.MeshBasicMaterial({
    transparent: true, opacity: 0, depthWrite: false, depthTest: false
  });
  const proxy = new THREE.Mesh(proxyGeo, proxyMat);
  proxy.name = 'proSubStaticDecorHitProxy';
  proxy.renderOrder = 9999;
  proxy.userData.actionId = 'subDecor';
  proxy.userData.onClick = modelCfg.onClick || null;
  proxy.position.set(0, 0, 0);
  entry.subRoot.add(proxy);
  entry.hitProxy = proxy;
  _proSubStaticDecorPickables.push(proxy);

  /* BIO: Pro Mode integration note. */
  if (modelCfg.glowColor) {
    const glowSize = Math.max(size.x, size.y, size.z) * scl
      * (modelCfg.glowScaleMul || 2.4);
    const glowMat = new THREE.SpriteMaterial({
      map: _ensureProSubStaticDecorGlowTex(),
      color: new THREE.Color(modelCfg.glowColor),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(glowSize, glowSize, 1);
    glow.position.set(0, 0, 0);
    glow.renderOrder = -1; /* BIO: Implementation note for this section. */
    entry.subRoot.add(glow);
    entry.glow = glow;
  }

  /* BIO: Pro Mode integration note. */
  entry.hoverF = 0;
  entry.hoverScale = modelCfg.hoverScale || 1.0;
}

function _disposeProSubStaticDecor() {
  /* BIO: Hologram panel behavior and rendering note. */
  if (
    _proSubStaticDecorHoloOffset &&
    _proSubStaticDecorOffsetCard &&
    _proSubStaticDecorOffsetCard === _proSubHoloCard3D
  ) {
    _proSubHoloCard3D.position.y -= _proSubStaticDecorHoloOffset;
  }
  _proSubStaticDecorHoloOffset = 0;
  _proSubStaticDecorOffsetCard = null;
  /* BIO: Language control and localization note. */
  for (let i = 0; i < _proSubStaticDecorEntries.length; i += 1) {
    if (_proSubStaticDecorEntries[i]) _proSubStaticDecorEntries[i].invalid = true;
  }
  if (_proSubStaticDecorRoot) {
    if (_proSubStaticDecorRoot.parent) _proSubStaticDecorRoot.parent.remove(_proSubStaticDecorRoot);
    _proSubStaticDecorRoot.traverse(o => {
      if (o.geometry && typeof o.geometry.dispose === 'function') o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          /* BIO: Map overlay behavior and interaction note. */
          if (m.map && m.map !== _proSubStaticDecorGlowTex) m.map.dispose();
          m.dispose();
        }
      }
    });
  }
  _proSubStaticDecorRoot = null;
  _proSubStaticDecorEntries = [];
  _proSubStaticDecorPickables = [];
  _proSubStaticDecorLoading = 0;
}

/* BIO: Pro Mode integration note. */
function _updateProSubStaticDecor(dt) {
  if (!_proSubStaticDecorRoot) return;
  const visible = (proSubMode === 'ready' || proSubMode === 'reveal' || proSubMode === 'dive');
  _proSubStaticDecorRoot.visible = visible;
  if (!visible) return;
  /* BIO: Pro Mode integration note. */
  const k = Math.min(1, dt * 12);
  for (let i = 0; i < _proSubStaticDecorEntries.length; i += 1) {
    const e = _proSubStaticDecorEntries[i];
    if (!e) continue;

    /* BIO: Auto-rotate (model varsa). */
    if (e.model && e.autoRotateSpeed) {
      e.model.rotation.y += dt * e.autoRotateSpeed;
    }

    /* BIO: Pro Mode integration note. */
    const want = (e.hitProxy && e.hitProxy === _cockpitUiHoverObject) ? 1 : 0;
    if (
      e.decorSubKey === 'contact/mail' &&
      want === 1 &&
      e._prevMailHoverWant === 0
    ) {
      try {
        const apiM = window.bgsProCockpitApi;
        if (apiM && typeof apiM.playMail3dModelHoverSfx === 'function') apiM.playMail3dModelHoverSfx();
      } catch (_mh) {}
    }
    e._prevMailHoverWant = want;
    e.hoverF = (e.hoverF || 0) + (want - (e.hoverF || 0)) * k;
    if (e.hoverF < 0.003) e.hoverF = 0;
    if (e.hoverF > 0.997) e.hoverF = 1;

    /* BIO: Audio, SFX, and mini-player behavior note. */
    if (e.model && e._baseScale && e.hoverScale && e.hoverScale !== 1) {
      const s = 1 + (e.hoverScale - 1) * e.hoverF;
      e.model.scale.set(
        e._baseScale.x * s,
        e._baseScale.y * s,
        e._baseScale.z * s
      );
    }

    /* BIO: Implementation note for this section. */
    if (e.glow && e.glow.material) {
      e.glow.material.opacity = 0.45 * e.hoverF;
    }
  }
}

function _phaseOffsetForSubDetailPage(pagePhase, t) {
  let d = pagePhase - t;
  if (d > 0.5) d -= 1;
  else if (d < -0.5) d += 1;
  return d * 2;
}

/* BIO: Pro Mode integration note. */
function _setProSubDetailModelOpacity(alpha) {
  if (!_proSubDetailModel) return;
  const a = Math.max(0, Math.min(1, alpha));
  if (_proSubDetailBuilderHooks && typeof _proSubDetailBuilderHooks.applyOpacity === 'function') {
    _proSubDetailBuilderHooks.applyOpacity(_proSubDetailModel, a);
    return;
  }
  const isOpaque = a >= 0.999;
  _proSubDetailModel.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      const base = typeof m._proSubDetailBaseOpacity === 'number' ? m._proSubDetailBaseOpacity : 1;
      const baseTr = !!m._proSubDetailBaseTransparent;
      if (isOpaque) {
        /* BIO: Implementation note for this section. */
        m.transparent = baseTr;
        m.opacity = base;
        m.depthWrite = baseTr ? m.depthWrite : true;
      } else {
        m.transparent = true;
        m.opacity = base * a;
      }
      m.needsUpdate = true;
    }
  });
}

/* BIO: Language control and localization note. */
function _setProSubDetailModelOpacity2(alpha) {
  if (!_proSubDetailModel2) return;
  const a = Math.max(0, Math.min(1, alpha));
  if (_proSubDetailBuilderHooks2 && typeof _proSubDetailBuilderHooks2.applyOpacity === 'function') {
    _proSubDetailBuilderHooks2.applyOpacity(_proSubDetailModel2, a);
    return;
  }
  const isOpaque = a >= 0.999;
  _proSubDetailModel2.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      const base = typeof m._proSubDetailBaseOpacity === 'number' ? m._proSubDetailBaseOpacity : 1;
      const baseTr = !!m._proSubDetailBaseTransparent;
      if (isOpaque) {
        m.transparent = baseTr;
        m.opacity = base;
        m.depthWrite = baseTr ? m.depthWrite : true;
      } else {
        m.transparent = true;
        m.opacity = base * a;
      }
      m.needsUpdate = true;
    }
  });
}

function _updateProSubDetailCarousel(dt, force = false) {
  if (!_proSubDetailRoot || !_proSubHoloCard3D) return;
  if (!force && (proSubMode === 'hide' || proSubMode === 'retreat' || proSubMode === 'idle')) return;
  const cfg = _proCurrentSubDetailCfg();
  if (!cfg) return;
  if (!force) _maybeSnapProSubDetailCarousel();
  if (force) {
    _proSubDetailT = _proSubDetailTTarget;
  } else {
    _proSubDetailT += (_proSubDetailTTarget - _proSubDetailT) * cfg.lerp;
    const floorT = Math.floor(_proSubDetailT);
    if (floorT !== 0 && floorT === Math.floor(_proSubDetailTTarget)) {
      _proSubDetailT -= floorT;
      _proSubDetailTTarget -= floorT;
    }
  }
  const maxDim = _proSceneMaxDim || 1;
  const slide = cfg.slideZMul * maxDim;
  const t = proScrollMod1(_proSubDetailT);
  const EXIT_END = 0.58;
  const ENTER_START = 0.62;

  /* BIO: Hologram panel behavior and rendering note. */
  const hasSecond = !!(cfg.secondBuilder && _proSubDetailRoot2);
  const N = hasSecond ? 3 : 2;
  const fromIdx = Math.floor(t * N) % N;
  const toIdx = (fromIdx + 1) % N;
  const localT = t * N - Math.floor(t * N);
  const exit = smoothStep01(Math.min(1, localT / EXIT_END));
  const enter = smoothStep01(Math.max(0, Math.min(1, (localT - ENTER_START) / (1 - ENTER_START))));

  /* BIO: Default Mode integration note. */
  const alphas = new Array(N).fill(0);
  const offsets = new Array(N).fill(slide);
  alphas[fromIdx] = 1 - exit;
  offsets[fromIdx] = -exit * slide;
  alphas[toIdx] = enter;
  offsets[toIdx] = (1 - enter) * slide;

  /* BIO: Hologram panel behavior and rendering note. */
  const holoAlpha = alphas[0];
  const holoOffset = offsets[0];
  _proSubHoloCard3D.position.copy(_proSubDetailHoloBasePos);
  _proSubHoloCard3D.position.z += holoOffset;
  if (_proSubHoloCard3DEl) {
    _proSubHoloCard3DEl.style.opacity = String(holoAlpha);
    _proSubHoloCard3DEl.style.pointerEvents = holoAlpha > 0.68 ? 'auto' : 'none';
    const hintEl = _proSubHoloCard3DEl.querySelector('.psh-scroll-hint');
    if (hintEl) {
      /* BIO: Implementation note for this section. */
      const dist0 = Math.min(t, 1 - t);
      const hintFade = smoothStep01(Math.max(0, 1 - dist0 / 0.18));
      hintEl.style.opacity = String(holoAlpha * hintFade);
    }
  }

  /* BIO: Pro Mode integration note. */
  const a1 = alphas[1];
  const o1 = offsets[1];
  _proSubDetailRoot.position.copy(_proSubDetailModelBasePos);
  _proSubDetailRoot.position.z += o1;
  _setProSubDetailModelOpacity(a1);
  if (_proSubDetailLabel3D) {
    _proSubDetailLabel3D.position.copy(_proSubDetailLabelBasePos);
    _proSubDetailLabel3D.position.z += o1;
    _proSubDetailLabel3D.visible = a1 > 0.01;
  }
  if (_proSubDetailLabelEl) {
    _proSubDetailLabelEl.style.opacity = String(a1);
  }
  if (_proSubDetailModel && !reduceMotion) {
    if (_proSubDetailBuilderHooks && typeof _proSubDetailBuilderHooks.autoSpin === 'function') {
      _proSubDetailBuilderHooks.autoSpin(_proSubDetailModel, dt, cfg);
    } else {
      _proSubDetailModel.rotation.y += dt * (cfg.modelAutoRotateSpeed || 0);
    }
  }
  _proSubDetailRoot.visible = a1 > 0.01;

  /* BIO: Implementation note for this section. */
  if (hasSecond) {
    const a2 = alphas[2];
    const o2 = offsets[2];
    _proSubDetailRoot2.position.copy(_proSubDetailModelBasePos2);
    _proSubDetailRoot2.position.z += o2;
    _setProSubDetailModelOpacity2(a2);
    if (_proSubDetailLabel3D2) {
      _proSubDetailLabel3D2.position.copy(_proSubDetailLabelBasePos2);
      _proSubDetailLabel3D2.position.z += o2;
      _proSubDetailLabel3D2.visible = a2 > 0.01;
    }
    if (_proSubDetailLabelEl2) {
      _proSubDetailLabelEl2.style.opacity = String(a2);
    }
    if (_proSubDetailModel2 && !reduceMotion) {
      const pageCfg2 = cfg.secondBuilder;
      if (_proSubDetailBuilderHooks2 && typeof _proSubDetailBuilderHooks2.autoSpin === 'function') {
        _proSubDetailBuilderHooks2.autoSpin(_proSubDetailModel2, dt, pageCfg2);
      } else {
        _proSubDetailModel2.rotation.y += dt * (pageCfg2.modelAutoRotateSpeed || 0);
      }
    }
    _proSubDetailRoot2.visible = a2 > 0.01;
  }
}

/* BIO: Implementation note for this section. */

function _shouldUseTerminalFor(planetId, subId) {
  if (!planetId || !subId) return false;
  return PRO_SUB_TERMINAL_CONFIG.enabledFor.has(planetId + '/' + subId);
}

function _clearProSubTerminalTimers() {
  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api.stopHologramTypingSfx === 'function') api.stopHologramTypingSfx();
  } catch (_h) {}
  if (_proSubTerminalTimers.length === 0) return;
  for (const id of _proSubTerminalTimers) clearTimeout(id);
  _proSubTerminalTimers = [];
}

/* BIO: Language control and localization note. */
function _tTimer(delayMs, fn) {
  const id = setTimeout(() => { fn(); }, Math.max(0, delayMs));
  _proSubTerminalTimers.push(id);
  return id;
}

/* BIO: Implementation note for this section. */
function _runProSubContentTypewriter(bodyEl, html, onComplete) {
  _clearProSubTerminalTimers();
  // BIO: Trusted, author-controlled static content only; this preserves links
  // BIO: and markup before the typewriter rewrites text nodes.
  bodyEl.innerHTML = html || '';
  bodyEl.classList.add('is-typewriter');

  /* BIO: Implementation note for this section. */
  const walker = document.createTreeWalker(bodyEl, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    const v = n.nodeValue || '';
    if (!v.trim()) continue;
    nodes.push({ node: n, text: v });
  }
  if (nodes.length === 0) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  try {
    const api = window.bgsProCockpitApi;
    if (api && typeof api.playHologramTypingSfx === 'function') api.playHologramTypingSfx();
  } catch (_ht) {}

  /* BIO: Implementation note for this section. */
  const cfg = PRO_SUB_TERMINAL_CONFIG;
  let total = 0;
  for (const x of nodes) total += x.text.length;
  let charMs = cfg.contentCharMs;
  if (total * charMs > cfg.contentMaxTotalMs) {
    charMs = Math.max(1, Math.floor(cfg.contentMaxTotalMs / total));
  }

  /* BIO: Implementation note for this section. */
  for (const x of nodes) x.node.nodeValue = '';

  /* BIO: Implementation note for this section. */
  const cursor = document.createElement('span');
  cursor.className = 'psh-tw-cursor';
  cursor.textContent = '\u2588';
  bodyEl.appendChild(cursor);

  let delay = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const tnode = nodes[i].node;
    const text = nodes[i].text;
    for (let ci = 1; ci <= text.length; ci += 1) {
      const snap = ci;
      _tTimer(delay, () => { tnode.nodeValue = text.slice(0, snap); });
      delay += charMs;
    }
  }
  _tTimer(delay + cfg.cursorLingerMs, () => {
    if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);
  });
  _tTimer(delay, () => {
    try {
      const apiDone = window.bgsProCockpitApi;
      if (apiDone && typeof apiDone.stopHologramTypingSfx === 'function') apiDone.stopHologramTypingSfx();
    } catch (_hd) {}
    if (typeof onComplete === 'function') onComplete();
  });
}

/* BIO: Language control and localization note. */
function _renderProSubHoloTerminal(parentRoot, themeHex, title, html, seenKey) {
  renderProSubHoloCard(parentRoot, themeHex, title, '');
  if (!_proSubHoloCard3DEl) return;
  const body = _proSubHoloCard3DEl.querySelector('.psh-body');
  if (!body) return;
  body.classList.add('is-typewriter');
  _runProSubContentTypewriter(body, html, () => {
    if (seenKey) _proSubTerminalSeen.add(seenKey);
  });
}

/* BIO: Planet layout, label, and interaction note. */
function _prepProSubSiblingFade(subGroupsArr, activeSubId) {
  const siblings = [];
  if (!subGroupsArr) return siblings;
  for (const g of subGroupsArr) {
    if (!g || !g.group || g.subId === activeSubId) continue;
    const mats = [];
    g.group.traverse(o => {
      if ((o.isMesh || o.isSprite) && o.material) {
        o.material.transparent = true;
        if (typeof o.material._proSubBaseOpacity !== 'number') {
          o.material._proSubBaseOpacity = o.material.opacity != null ? o.material.opacity : 1;
        }
        mats.push(o.material);
      }
    });
    siblings.push({ group: g.group, mats });
  }
  return siblings;
}

function _setProSubSiblingOpacity(siblings, alpha) {
  for (const s of siblings) {
    const k = Math.max(0, Math.min(1, alpha));
    for (const m of s.mats) {
      const base = typeof m._proSubBaseOpacity === 'number' ? m._proSubBaseOpacity : 1;
      m.opacity = base * k;
    }
    if (s.group) s.group.visible = k > 0.001;
  }
}

function _restoreProSubSiblingOpacity(siblings) {
  for (const s of siblings) {
    for (const m of s.mats) {
      const base = typeof m._proSubBaseOpacity === 'number' ? m._proSubBaseOpacity : 1;
      m.opacity = base;
    }
    if (s.group) s.group.visible = true;
  }
}

/* BIO: Planet layout, label, and interaction note. */
function startProSubDiveSequence(planetId, subId) {
  if (proSubMode !== 'idle') return;
  const reg = PRO_PLANET_REGISTRY[planetId];
  if (!reg) return;
  if (reg.mainMode() !== 'ready') return;
  const byPlanet = PRO_SUB_CONTENT[planetId];
  if (!byPlanet || !byPlanet[subId]) return;
  const groupsArr = reg.subGroups();
  const entry = groupsArr && groupsArr.find(g => g && g.subId === subId);
  if (!entry || !entry.group) return;
  proSubActivePlanetId = planetId;
  proSubActiveSubId = subId;
  proSubMode = 'approach';
  proSubAnim.t = 0;
  proSubAnim.duration = reduceMotion ? 0.001 : PRO_SUB_DIVE.approachDur;
  _proSubSaved = {
    planetId,
    subId,
    entry,
    startPos: entry.group.position.clone(),
    startScale: entry.group.scale.x || 1,
    targetPos: entry.targetPos.clone(),
    siblings: _prepProSubSiblingFade(groupsArr, subId)
  };
  if (reduceMotion) {
    entry.group.visible = false;
    _setProSubSiblingOpacity(_proSubSaved.siblings, 0);
    setProDiveOverlay(1);
    _renderProSubHoloForActive();
    proSubMode = 'ready';
  }
}

function startProSubRetreatSequence() {
  if (proSubMode !== 'ready') return;
  playProPlanetGoBackSfx();
  if (!_proSubSaved) {
    finishProSubRetreat();
    return;
  }
  /* BIO: Pro Mode integration note. */
  _disposeProSubDetailCarousel();
  proSubMode = 'hide';
  proSubAnim.t = 0;
  proSubAnim.duration = reduceMotion ? 0.001 : PRO_SUB_DIVE.hideDur;
  hideProSubHoloCard();
  /* BIO: Planet layout, label, and interaction note. */
  clearProDiveOverlay();
}

function finishProSubRetreat() {
  const sv = _proSubSaved;
  if (sv) {
    if (sv.entry && sv.entry.group) {
      sv.entry.group.position.copy(sv.targetPos);
      sv.entry.group.scale.setScalar(sv.startScale || 1);
      sv.entry.group.visible = true;
    }
    _restoreProSubSiblingOpacity(sv.siblings);
  }
  _proSubSaved = null;
  proSubActivePlanetId = null;
  proSubActiveSubId = null;
  proSubMode = 'idle';
  proSubAnim.t = 0;
  _clearProSubTerminalTimers();
  _disposeProSubHoloCard();
  clearProDiveOverlay();
  clearProSubLightPulse();
}

/* BIO: Map overlay behavior and interaction note. */
function forceExitProSubInstant() {
  /* BIO: Planet layout, label, and interaction note. */
  if (proSubMode !== 'idle') {
    if (typeof _disposeProSubDetailCarousel === 'function') {
      try { _disposeProSubDetailCarousel(); } catch (_e) {}
    }
    proSubAnim.t = 0;
    proSubAnim.duration = 0;
    finishProSubRetreat();
  }
  /* BIO: Planet layout, label, and interaction note. */
  if (proAboutMode !== 'idle') {
    proAboutAnim.t = 0;
    proAboutAnim.duration = 0;
    finishProAboutRetreat();
  }
  if (proProjectsMode !== 'idle') {
    proProjectsAnim.t = 0;
    proProjectsAnim.duration = 0;
    finishProProjectsRetreat();
  }
  if (proHobbiesMode !== 'idle') {
    proHobbiesAnim.t = 0;
    proHobbiesAnim.duration = 0;
    finishProHobbiesRetreat();
  }
  if (proSkillsMode !== 'idle') {
    proSkillsAnim.t = 0;
    proSkillsAnim.duration = 0;
    finishProSkillsRetreat();
  }
  if (proContactMode !== 'idle') {
    proContactAnim.t = 0;
    proContactAnim.duration = 0;
    finishProContactRetreat();
  }
}

function updateProSubExpandAnim(dt) {
  if (proSubMode === 'idle' || proSubMode === 'ready') return;
  proSubAnim.t = Math.min(proSubAnim.duration, proSubAnim.t + dt);
  const u = proSubAnim.duration > 0 ? proSubAnim.t / proSubAnim.duration : 1;
  const sv = _proSubSaved;
  if (!sv) {
    proSubMode = 'idle';
    return;
  }
  if (proSubMode === 'approach') {
    const e = smoothStep01(u);
    const g = sv.entry.group;
    g.position.set(
      sv.startPos.x * (1 - e),
      sv.startPos.y * (1 - e),
      sv.startPos.z * (1 - e)
    );
    const s = 1 + (PRO_SUB_DIVE.growScale - 1) * e;
    g.scale.setScalar(s);
    _setProSubSiblingOpacity(sv.siblings, 1 - e);
    setProDiveOverlay(e);
    if (u >= 1) {
      proSubMode = 'hold';
      proSubAnim.t = 0;
      proSubAnim.duration = reduceMotion ? 0.001 : PRO_SUB_DIVE.holdDur;
    }
  } else if (proSubMode === 'hold') {
    setProDiveOverlay(1);
    if (u >= 1) {
      if (sv.entry.group) sv.entry.group.visible = false;
      _renderProSubHoloForActive();
      proSubMode = 'reveal';
      proSubAnim.t = 0;
      proSubAnim.duration = reduceMotion ? 0.001 : PRO_SUB_DIVE.revealDur;
    }
  } else if (proSubMode === 'reveal') {
    const fadeDur = 0.5;
    const fu = Math.min(1, u / fadeDur);
    setProDiveOverlay(1 - smoothStep01(fu));
    if (u >= 1) {
      clearProDiveOverlay();
      proSubMode = 'ready';
      proSubAnim.t = 0;
    }
  } else if (proSubMode === 'hide') {
    /* BIO: Planet layout, label, and interaction note. */
    if (u >= 1) {
      if (sv.entry.group) sv.entry.group.visible = true;
      proSubMode = 'retreat';
      proSubAnim.t = 0;
      proSubAnim.duration = reduceMotion ? 0.001 : PRO_SUB_DIVE.retreatDur;
    }
  } else if (proSubMode === 'retreat') {
    const e = smoothStep01(u);
    const g = sv.entry.group;
    g.position.set(
      sv.targetPos.x * e,
      sv.targetPos.y * e,
      sv.targetPos.z * e
    );
    const s = PRO_SUB_DIVE.growScale + (1 - PRO_SUB_DIVE.growScale) * e;
    g.scale.setScalar(Math.max(0.001, s));
    _setProSubSiblingOpacity(sv.siblings, e);
    /* BIO: Implementation note for this section. */
    if (u >= 1) {
      finishProSubRetreat();
    }
  }
}

function applyProContactHoverMaterial(material, f, isMain) {
  if (!material || f <= 0) {
    if (material && material.userData && material.userData._hoverBaseE) {
      material.emissive.copy(material.userData._hoverBaseE);
      material.emissiveIntensity = material.userData._hoverBaseEi;
    }
    return;
  }
  if (!material.userData._hoverBaseE) {
    material.userData._hoverBaseE = new THREE.Color().copy(material.emissive);
    material.userData._hoverBaseEi = material.emissiveIntensity;
  }
  const t = Math.min(1, f);
  const bMul = isMain ? 1.5 : 1.32;
  const bi = material.userData._hoverBaseEi * bMul;
  material.emissive
    .copy(material.userData._hoverBaseE)
    .lerp(_proContactHoverHi, t * 0.62);
  material.emissiveIntensity = THREE.MathUtils.lerp(
    material.userData._hoverBaseEi,
    bi,
    t
  );
}

function updateProContactPlanetHoverVisuals(dt) {
  if (!proScrollGroup || !proScrollData) return;
  const tgt = _proContactHoverTarget;
  const wantCt =
    tgt === contactPlanetMesh &&
    proContactMode === 'idle' &&
    contactMainShell &&
    contactMainShell.visible;
  const fCt = contactPlanetMesh ? lerpProAboutHoverFactor(contactPlanetMesh, wantCt, dt) : 0;
  if (proContactMode === 'idle' && contactPlanetMesh) {
    contactPlanetMesh.scale.setScalar(1 + PRO_ABOUT_MAIN_HOVER_SCALE * fCt);
    const c = contactPlanetMesh.getObjectByName('contactTorus');
    if (c && c.material) applyProContactHoverMaterial(c.material, fCt, true);
  } else if (contactPlanetMesh) {
    contactPlanetMesh.scale.setScalar(1);
    const c0 = contactPlanetMesh.getObjectByName('contactTorus');
    if (c0 && c0.material) applyProContactHoverMaterial(c0.material, 0, true);
  }
  for (const g of proContactSubGroups) {
    if (!g || !g.mesh || !g.group) continue;
    const wantS = tgt === g.mesh && proContactMode === 'ready' && proSubMode === 'idle';
    const fG = lerpProAboutHoverFactor(g.mesh, wantS, dt);
    /* BIO: Pro Mode integration note. */
    if (proContactMode === 'ready' && proSubMode === 'idle' && g.group.parent && g.group.visible) {
      g.group.scale.setScalar(1 + PRO_ABOUT_SUB_HOVER_SCALE * fG);
      if (g.mesh.material) applyProContactHoverMaterial(g.mesh.material, fG, false);
    } else if (g.mesh.material) {
      applyProContactHoverMaterial(g.mesh.material, 0, false);
    }
  }
}

function addProScrollPlanetsToScene(cockpitPivot, maxDim) {
  _proSceneMaxDim = maxDim;
  if (proScrollGroup) {
    if (proScrollGroup.parent) {
      proScrollGroup.parent.remove(proScrollGroup);
    }
    proScrollGroup.traverse(ch => {
      if (ch.geometry) ch.geometry.dispose();
      if (ch.material) {
        if (ch.material.map) ch.material.map.dispose();
        ch.material.dispose();
      }
    });
  }
  proPlanetPickables.length = 0;
  proScrollData = null;
  proScrollAboutOff = null;
  proScrollProjectsOff = null;
  proScrollHobbiesOff = null;
  proScrollSkillsOff = null;
  proScrollContactOff = null;
  aboutLabelSprite = null;
  projectsLabelSprite = null;
  hobbiesLabelSprite = null;
  skillsLabelSprite = null;
  contactLabelSprite = null;
  aboutMePlanetMesh = null;
  aboutDiveGroup = null;
  aboutMainShell = null;
  aboutSubRoot = null;
  proAboutSubGroups.length = 0;
  proAboutSubPickMeshes.length = 0;
  proAboutSubLabelSprites.length = 0;
  proAboutMode = 'idle';
  proAboutScrollLocked = false;
  projectsDiveGroup = null;
  projectsMainShell = null;
  projectsSubRoot = null;
  proProjectsSubGroups.length = 0;
  proProjectsSubLabelSprites.length = 0;
  proProjectsMode = 'idle';
  proProjectsScrollLocked = false;
  _proProjectsHoverTarget = null;
  myProjectsPlanetMesh = null;
  hobbiesDiveGroup = null;
  hobbiesMainShell = null;
  hobbiesSubRoot = null;
  proHobbiesSubGroups.length = 0;
  proHobbiesSubLabelSprites.length = 0;
  proHobbiesMode = 'idle';
  proHobbiesScrollLocked = false;
  _proHobbiesHoverTarget = null;
  hobbiesPlanetMesh = null;
  skillsDiveGroup = null;
  skillsMainShell = null;
  skillsSubRoot = null;
  proSkillsSubGroups.length = 0;
  proSkillsSubLabelSprites.length = 0;
  proSkillsMode = 'idle';
  proSkillsScrollLocked = false;
  _proSkillsHoverTarget = null;
  skillsPlanetMesh = null;
  contactDiveGroup = null;
  contactMainShell = null;
  contactSubRoot = null;
  proContactSubGroups.length = 0;
  proContactSubLabelSprites.length = 0;
  proContactMode = 'idle';
  proContactScrollLocked = false;
  _proContactHoverTarget = null;
  contactPlanetMesh = null;
  proScrollT = 0;
  proScrollTTarget = 0;
  _proScrollPlanetsUnlocked = false;

  proScrollGroup = new THREE.Group();
  proScrollGroup.name = 'proScroll';
  proScrollGroup.renderOrder = 2;
  if (!cockpitPivot) {
    return;
  }
  cockpitPivot.add(proScrollGroup);

  /* BIO: Planet layout, label, and interaction note. */
  const r = maxDim * 0.092;

  if (!camera) {
    return;
  }
  const fwd = new THREE.Vector3();
  camera.getWorldDirection(fwd);
  const rightW = new THREE.Vector3();
  rightW.copy(_worldUp).cross(fwd);
  if (rightW.lengthSq() < 1e-8) {
    rightW.set(1, 0, 0);
  } else {
    rightW.normalize();
  }
  const baseW = new THREE.Vector3().copy(camera.position).addScaledVector(fwd, maxDim * 0.48);
  cockpitPivot.updateWorldMatrix(true, true);
  const _invM = new THREE.Matrix4().copy(cockpitPivot.matrixWorld).invert();
  const base = new THREE.Vector3();
  const right = new THREE.Vector3();
  base.copy(baseW).applyMatrix4(_invM);
  right.copy(rightW).transformDirection(_invM);
  const sideAmp = maxDim * 0.34;
  proScrollData = { base, right, sideAmp, maxDim, radiusWorld: r };

  const aboutOffset = new THREE.Group();
  aboutOffset.name = 'aboutOffset';
  proScrollAboutOff = aboutOffset;
  /* BIO: Planet layout, label, and interaction note. */
  aboutDiveGroup = new THREE.Group();
  aboutDiveGroup.name = 'aboutDiveGroup';
  aboutOffset.add(aboutDiveGroup);
  aboutMainShell = new THREE.Group();
  aboutMainShell.name = 'aboutMainShell';
  aboutDiveGroup.add(aboutMainShell);
  aboutMePlanetMesh = buildAboutMePlanet3D(r);
  aboutMePlanetMesh.name = 'aboutMePlanet';
  aboutMePlanetMesh.userData.proPlanetId = 'about';
  aboutMainShell.add(aboutMePlanetMesh);
  proScrollGroup.add(aboutOffset);
  applyAboutMePlanetTexture(aboutMePlanetMesh);

  /* BIO: Cockpit layout, rendering, and interaction note. */
  aboutSubRoot = new THREE.Group();
  aboutSubRoot.name = 'aboutSubRoot';
  aboutSubRoot.visible = false;
  aboutDiveGroup.add(aboutSubRoot);
  const _subCfg = COCKPIT_PRO_ABOUT_SUB;
  const subR = maxDim * _subCfg.planetRadiusMul;
  const L = _subCfg.label;
  for (const defId of _subCfg.order) {
    const p = _subCfg.screens[defId];
    if (!p) continue;
    const g = new THREE.Group();
    g.name = 'proAboutSub_' + defId;
    g.visible = false;
    g.scale.setScalar(0.001);
    const mesh = buildProAboutSubPlanet(subR, defId);
    applyProAboutSubPlanetTexture(mesh);
    g.add(mesh);
    const cnvSub = document.createElement('canvas');
    bootstrapPlanetLabelCanvas2d(cnvSub);
    const tmapSub = new THREE.CanvasTexture(cnvSub);
    tmapSub.minFilter = THREE.LinearFilter;
    tmapSub.magFilter = THREE.LinearFilter;
    if ('colorSpace' in tmapSub) tmapSub.colorSpace = THREE.SRGBColorSpace;
    const sMatSub = new THREE.SpriteMaterial({ map: tmapSub, transparent: true, depthTest: true });
    const labelSpr = new THREE.Sprite(sMatSub);
    labelSpr.name = 'proAboutSubLabel_' + defId;
    labelSpr.scale.set(maxDim * L.w, maxDim * L.h, 1);
    labelSpr.position.set(0, subR * L.yMul, 0);
    labelSpr.userData._canvas = cnvSub;
    labelSpr.userData._map = tmapSub;
    g.add(labelSpr);
    const targetPos = new THREE.Vector3(p.x * maxDim, p.y * maxDim, p.z * maxDim);
    g.userData.proSubId = defId;
    mesh.userData.proSubId = defId;
    labelSpr.userData.proSubId = defId;
    aboutSubRoot.add(g);
    proAboutSubGroups.push({ group: g, mesh, labelSprite: labelSpr, subId: defId, targetPos });
    proAboutSubPickMeshes.push(mesh);
    proAboutSubLabelSprites.push(labelSpr);
  }
  drawAllAboutSubLabelCanvases();

  const proOff = new THREE.Group();
  proOff.name = 'myProjectsOffset';
  proScrollProjectsOff = proOff;
  proOff.position.copy(right).multiplyScalar(sideAmp);
  projectsDiveGroup = new THREE.Group();
  projectsDiveGroup.name = 'projectsDiveGroup';
  proOff.add(projectsDiveGroup);
  projectsMainShell = new THREE.Group();
  projectsMainShell.name = 'projectsMainShell';
  projectsDiveGroup.add(projectsMainShell);
  myProjectsPlanetMesh = buildMyProjectsPlanet3D(r);
  myProjectsPlanetMesh.name = 'myProjectsPlanet';
  myProjectsPlanetMesh.userData.proPlanetId = 'projects';
  projectsMainShell.add(myProjectsPlanetMesh);
  applyMyProjectsPlanetTexture(myProjectsPlanetMesh);
  projectsSubRoot = new THREE.Group();
  projectsSubRoot.name = 'projectsSubRoot';
  projectsSubRoot.visible = false;
  projectsDiveGroup.add(projectsSubRoot);
  const _projSubCfg = COCKPIT_PRO_PROJECTS_SUB;
  const pSubR = maxDim * _projSubCfg.planetRadiusMul;
  const pL = _projSubCfg.label;
  for (const pId of _projSubCfg.order) {
    const pp = _projSubCfg.screens[pId];
    if (!pp) continue;
    const pg = new THREE.Group();
    pg.name = 'proProjectsSub_' + pId;
    pg.visible = false;
    pg.scale.setScalar(0.001);
    const pm = buildProProjectsSubPlanet(pSubR, pId);
    applyProProjectsSubPlanetTexture(pm);
    pg.add(pm);
    const cnvPsub = document.createElement('canvas');
    bootstrapPlanetLabelCanvas2d(cnvPsub);
    const tmapPsub = new THREE.CanvasTexture(cnvPsub);
    tmapPsub.minFilter = THREE.LinearFilter;
    tmapPsub.magFilter = THREE.LinearFilter;
    if ('colorSpace' in tmapPsub) tmapPsub.colorSpace = THREE.SRGBColorSpace;
    const sMatPsub = new THREE.SpriteMaterial({ map: tmapPsub, transparent: true, depthTest: true });
    const labelSprP = new THREE.Sprite(sMatPsub);
    labelSprP.name = 'proProjectsSubLabel_' + pId;
    labelSprP.scale.set(maxDim * pL.w, maxDim * pL.h, 1);
    labelSprP.position.set(0, pSubR * pL.yMul, 0);
    labelSprP.userData._canvas = cnvPsub;
    labelSprP.userData._map = tmapPsub;
    labelSprP.userData.proSubId = pId;
    pg.add(labelSprP);
    const tPos = new THREE.Vector3(pp.x * maxDim, pp.y * maxDim, pp.z * maxDim);
    pg.userData.proSubId = pId;
    projectsSubRoot.add(pg);
    proProjectsSubGroups.push({ group: pg, mesh: pm, labelSprite: labelSprP, subId: pId, targetPos: tPos });
    proProjectsSubLabelSprites.push(labelSprP);
  }
  drawAllProjectsSubLabelCanvases();
  proScrollGroup.add(proOff);

  const hOff = new THREE.Group();
  hOff.name = 'hobbiesOffset';
  proScrollHobbiesOff = hOff;
  hOff.position.copy(right).multiplyScalar(sideAmp);
  hobbiesDiveGroup = new THREE.Group();
  hobbiesDiveGroup.name = 'hobbiesDiveGroup';
  hOff.add(hobbiesDiveGroup);
  hobbiesMainShell = new THREE.Group();
  hobbiesMainShell.name = 'hobbiesMainShell';
  hobbiesDiveGroup.add(hobbiesMainShell);
  hobbiesPlanetMesh = buildHobbiesGeoidPlanet3D(r);
  hobbiesPlanetMesh.name = 'hobbiesPlanet';
  hobbiesPlanetMesh.userData.proPlanetId = 'hobbies';
  hobbiesMainShell.add(hobbiesPlanetMesh);
  applyHobbiesPlanetTexture(hobbiesPlanetMesh);
  hobbiesSubRoot = new THREE.Group();
  hobbiesSubRoot.name = 'hobbiesSubRoot';
  hobbiesSubRoot.visible = false;
  hobbiesDiveGroup.add(hobbiesSubRoot);
  const _hobSubCfg = COCKPIT_PRO_HOBBIES_SUB;
  const hSubR = maxDim * _hobSubCfg.planetRadiusMul;
  const hL = _hobSubCfg.label;
  for (const hId of _hobSubCfg.order) {
    const hp = _hobSubCfg.screens[hId];
    if (!hp) continue;
    const hg = new THREE.Group();
    hg.name = 'proHobbiesSub_' + hId;
    hg.visible = false;
    hg.scale.setScalar(0.001);
    const hm = buildHobbiesSubGeoidPlanet3D(hSubR, hId);
    applyHobbiesSubPlanetTexture(hm);
    hg.add(hm);
    const cnvHsub = document.createElement('canvas');
    bootstrapPlanetLabelCanvas2d(cnvHsub);
    const tmapHsub = new THREE.CanvasTexture(cnvHsub);
    tmapHsub.minFilter = THREE.LinearFilter;
    tmapHsub.magFilter = THREE.LinearFilter;
    if ('colorSpace' in tmapHsub) tmapHsub.colorSpace = THREE.SRGBColorSpace;
    const sMatHsub = new THREE.SpriteMaterial({ map: tmapHsub, transparent: true, depthTest: true });
    const labelSprH = new THREE.Sprite(sMatHsub);
    labelSprH.name = 'proHobbiesSubLabel_' + hId;
    labelSprH.scale.set(maxDim * hL.w, maxDim * hL.h, 1);
    labelSprH.position.set(0, hSubR * hL.yMul, 0);
    labelSprH.userData._canvas = cnvHsub;
    labelSprH.userData._map = tmapHsub;
    labelSprH.userData.proSubId = hId;
    hg.add(labelSprH);
    const hTpos = new THREE.Vector3(hp.x * maxDim, hp.y * maxDim, hp.z * maxDim);
    hg.userData.proSubId = hId;
    hobbiesSubRoot.add(hg);
    proHobbiesSubGroups.push({ group: hg, mesh: hm, labelSprite: labelSprH, subId: hId, targetPos: hTpos });
    proHobbiesSubLabelSprites.push(labelSprH);
  }
  drawAllHobbiesSubLabelCanvases();
  proScrollGroup.add(hOff);

  const sOff = new THREE.Group();
  sOff.name = 'skillsOffset';
  proScrollSkillsOff = sOff;
  sOff.position.copy(right).multiplyScalar(sideAmp);
  skillsDiveGroup = new THREE.Group();
  skillsDiveGroup.name = 'skillsDiveGroup';
  sOff.add(skillsDiveGroup);
  skillsMainShell = new THREE.Group();
  skillsMainShell.name = 'skillsMainShell';
  skillsDiveGroup.add(skillsMainShell);
  skillsPlanetMesh = buildSkillsSaturnPlanet3D(r);
  skillsPlanetMesh.name = 'skillsPlanet';
  skillsPlanetMesh.userData.proPlanetId = 'skills';
  skillsMainShell.add(skillsPlanetMesh);
  applySkillsPlanetTexture(skillsPlanetMesh);
  skillsSubRoot = new THREE.Group();
  skillsSubRoot.name = 'skillsSubRoot';
  skillsSubRoot.visible = false;
  skillsDiveGroup.add(skillsSubRoot);
  const _skSubCfg = COCKPIT_PRO_SKILLS_SUB;
  const skSubR = maxDim * _skSubCfg.planetRadiusMul;
  const skL = _skSubCfg.label;
  for (const skId of _skSubCfg.order) {
    const sp = _skSubCfg.screens[skId];
    if (!sp) continue;
    const sg = new THREE.Group();
    sg.name = 'proSkillsSub_' + skId;
    sg.visible = false;
    sg.scale.setScalar(0.001);
    const sm = buildSkillsSubSaturnPlanet3D(skSubR, skId);
    sm.userData._subId = skId;
    const skCore = sm.getObjectByName('skillsSubCore_' + skId);
    const skRing = sm.getObjectByName('skillsSubRing_' + skId);
    applySkillsSubPlanetTexture(sm);
    sg.add(sm);
    const cnvSk = document.createElement('canvas');
    bootstrapPlanetLabelCanvas2d(cnvSk);
    const tmapSk = new THREE.CanvasTexture(cnvSk);
    tmapSk.minFilter = THREE.LinearFilter;
    tmapSk.magFilter = THREE.LinearFilter;
    if ('colorSpace' in tmapSk) tmapSk.colorSpace = THREE.SRGBColorSpace;
    const sMatSk = new THREE.SpriteMaterial({ map: tmapSk, transparent: true, depthTest: true });
    const labelSprSk = new THREE.Sprite(sMatSk);
    labelSprSk.name = 'proSkillsSubLabel_' + skId;
    labelSprSk.scale.set(maxDim * skL.w, maxDim * skL.h, 1);
    labelSprSk.position.set(0, skSubR * skL.yMul, 0);
    labelSprSk.userData._canvas = cnvSk;
    labelSprSk.userData._map = tmapSk;
    labelSprSk.userData.proSubId = skId;
    sg.add(labelSprSk);
    const skTpos = new THREE.Vector3(sp.x * maxDim, sp.y * maxDim, sp.z * maxDim);
    sg.userData.proSubId = skId;
    skillsSubRoot.add(sg);
    proSkillsSubGroups.push({
      group: sg,
      mesh: skCore,
      ring: skRing,
      labelSprite: labelSprSk,
      subId: skId,
      targetPos: skTpos
    });
    proSkillsSubLabelSprites.push(labelSprSk);
  }
  drawAllSkillsSubLabelCanvases();
  proScrollGroup.add(sOff);

  const cOff = new THREE.Group();
  cOff.name = 'contactOffset';
  proScrollContactOff = cOff;
  cOff.position.copy(right).multiplyScalar(sideAmp);
  contactDiveGroup = new THREE.Group();
  contactDiveGroup.name = 'contactDiveGroup';
  cOff.add(contactDiveGroup);
  contactMainShell = new THREE.Group();
  contactMainShell.name = 'contactMainShell';
  contactDiveGroup.add(contactMainShell);
  contactPlanetMesh = buildContactTorusPlanet3D(r);
  contactPlanetMesh.name = 'contactPlanet';
  contactPlanetMesh.userData.proPlanetId = 'contact';
  contactMainShell.add(contactPlanetMesh);
  contactSubRoot = new THREE.Group();
  contactSubRoot.name = 'contactSubRoot';
  contactSubRoot.visible = false;
  contactDiveGroup.add(contactSubRoot);
  const _ctSubCfg = COCKPIT_PRO_CONTACT_SUB;
  const ctSubR = maxDim * _ctSubCfg.planetRadiusMul;
  const ctL = _ctSubCfg.label;
  for (const ctId of _ctSubCfg.order) {
    const cp = _ctSubCfg.screens[ctId];
    if (!cp) continue;
    const csg = new THREE.Group();
    csg.name = 'proContactSub_' + ctId;
    csg.visible = false;
    csg.scale.setScalar(0.001);
    const cModel = buildContactSubTorusPlanet3D(ctSubR, ctId);
    cModel.userData._subId = ctId;
    const ctTorus = cModel.getObjectByName('contactSubTorus_' + ctId);
    applyContactSubPlanetTexture(cModel);
    csg.add(cModel);
    const cnvCts = document.createElement('canvas');
    bootstrapPlanetLabelCanvas2d(cnvCts);
    const tmapCts = new THREE.CanvasTexture(cnvCts);
    tmapCts.minFilter = THREE.LinearFilter;
    tmapCts.magFilter = THREE.LinearFilter;
    if ('colorSpace' in tmapCts) tmapCts.colorSpace = THREE.SRGBColorSpace;
    const sMatCts = new THREE.SpriteMaterial({ map: tmapCts, transparent: true, depthTest: true });
    const labelSprCt = new THREE.Sprite(sMatCts);
    labelSprCt.name = 'proContactSubLabel_' + ctId;
    labelSprCt.scale.set(maxDim * ctL.w, maxDim * ctL.h, 1);
    labelSprCt.position.set(0, ctSubR * ctL.yMul, 0);
    labelSprCt.userData._canvas = cnvCts;
    labelSprCt.userData._map = tmapCts;
    labelSprCt.userData.proSubId = ctId;
    csg.add(labelSprCt);
    const ctTpos = new THREE.Vector3(cp.x * maxDim, cp.y * maxDim, cp.z * maxDim);
    csg.userData.proSubId = ctId;
    contactSubRoot.add(csg);
    proContactSubGroups.push({
      group: csg,
      mesh: ctTorus,
      labelSprite: labelSprCt,
      subId: ctId,
      targetPos: ctTpos
    });
    proContactSubLabelSprites.push(labelSprCt);
  }
  drawAllContactSubLabelCanvases();
  proScrollGroup.add(cOff);
  applyContactPlanetTexture(contactPlanetMesh);

  proPlanetPickables.push(
    aboutMePlanetMesh,
    myProjectsPlanetMesh,
    hobbiesPlanetMesh,
    skillsPlanetMesh,
    contactPlanetMesh
  );

  const cnvA = document.createElement('canvas');
  bootstrapPlanetLabelCanvas2d(cnvA);
  const tmapA = new THREE.CanvasTexture(cnvA);
  tmapA.minFilter = THREE.LinearFilter;
  tmapA.magFilter = THREE.LinearFilter;
  if ('colorSpace' in tmapA) tmapA.colorSpace = THREE.SRGBColorSpace;
  const sMatA = new THREE.SpriteMaterial({ map: tmapA, transparent: true, depthTest: true });
  aboutLabelSprite = new THREE.Sprite(sMatA);
  aboutLabelSprite.name = 'aboutLabel';
  aboutLabelSprite.scale.set(maxDim * 0.2, maxDim * 0.05, 1);
  aboutLabelSprite.position.set(0, r * 1.6, 0);
  aboutLabelSprite.userData._canvas = cnvA;
  aboutLabelSprite.userData._map = tmapA;
  aboutMainShell.add(aboutLabelSprite);

  const cnvP = document.createElement('canvas');
  bootstrapPlanetLabelCanvas2d(cnvP);
  const tmapP = new THREE.CanvasTexture(cnvP);
  tmapP.minFilter = THREE.LinearFilter;
  tmapP.magFilter = THREE.LinearFilter;
  if ('colorSpace' in tmapP) tmapP.colorSpace = THREE.SRGBColorSpace;
  const sMatP = new THREE.SpriteMaterial({ map: tmapP, transparent: true, depthTest: true });
  projectsLabelSprite = new THREE.Sprite(sMatP);
  projectsLabelSprite.name = 'projectsLabel';
  projectsLabelSprite.scale.set(maxDim * 0.2, maxDim * 0.05, 1);
  projectsLabelSprite.position.set(0, r * 1.6, 0);
  projectsLabelSprite.userData._canvas = cnvP;
  projectsLabelSprite.userData._map = tmapP;
  projectsMainShell.add(projectsLabelSprite);

  const cnvH = document.createElement('canvas');
  bootstrapPlanetLabelCanvas2d(cnvH);
  const tmapH = new THREE.CanvasTexture(cnvH);
  tmapH.minFilter = THREE.LinearFilter;
  tmapH.magFilter = THREE.LinearFilter;
  if ('colorSpace' in tmapH) tmapH.colorSpace = THREE.SRGBColorSpace;
  const sMatH = new THREE.SpriteMaterial({ map: tmapH, transparent: true, depthTest: true });
  hobbiesLabelSprite = new THREE.Sprite(sMatH);
  hobbiesLabelSprite.name = 'hobbiesLabel';
  hobbiesLabelSprite.scale.set(maxDim * 0.2, maxDim * 0.05, 1);
  hobbiesLabelSprite.position.set(0, r * 1.6, 0);
  hobbiesLabelSprite.userData._canvas = cnvH;
  hobbiesLabelSprite.userData._map = tmapH;
  hobbiesMainShell.add(hobbiesLabelSprite);

  const cnvS = document.createElement('canvas');
  bootstrapPlanetLabelCanvas2d(cnvS);
  const tmapS = new THREE.CanvasTexture(cnvS);
  tmapS.minFilter = THREE.LinearFilter;
  tmapS.magFilter = THREE.LinearFilter;
  if ('colorSpace' in tmapS) tmapS.colorSpace = THREE.SRGBColorSpace;
  const sMatS = new THREE.SpriteMaterial({ map: tmapS, transparent: true, depthTest: true });
  skillsLabelSprite = new THREE.Sprite(sMatS);
  skillsLabelSprite.name = 'skillsLabel';
  skillsLabelSprite.scale.set(maxDim * 0.2, maxDim * 0.05, 1);
  skillsLabelSprite.position.set(0, r * 1.6, 0);
  skillsLabelSprite.userData._canvas = cnvS;
  skillsLabelSprite.userData._map = tmapS;
  skillsMainShell.add(skillsLabelSprite);

  const cnvC = document.createElement('canvas');
  bootstrapPlanetLabelCanvas2d(cnvC);
  const tmapC = new THREE.CanvasTexture(cnvC);
  tmapC.minFilter = THREE.LinearFilter;
  tmapC.magFilter = THREE.LinearFilter;
  if ('colorSpace' in tmapC) tmapC.colorSpace = THREE.SRGBColorSpace;
  const sMatC = new THREE.SpriteMaterial({ map: tmapC, transparent: true, depthTest: true });
  contactLabelSprite = new THREE.Sprite(sMatC);
  contactLabelSprite.name = 'contactLabel';
  contactLabelSprite.scale.set(maxDim * 0.2, maxDim * 0.05, 1);
  contactLabelSprite.position.set(0, r * 1.65, 0);
  contactLabelSprite.userData._canvas = cnvC;
  contactLabelSprite.userData._map = tmapC;
  contactMainShell.add(contactLabelSprite);

  drawAboutLabelToCanvas();
  drawProjectsLabelToCanvas();
  drawHobbiesLabelToCanvas();
  drawSkillsLabelToCanvas();
  drawContactLabelToCanvas();
  updateProScrollGroupPosition();
}

/* BIO: Planet layout, label, and interaction note. */
function resolveScrollPlanetPickFromHitObject(hitObj) {
  if (!hitObj) return null;
  let o = hitObj;
  for (let d = 0; d < 24 && o; d += 1) {
    if (o.userData && o.userData.proSubId && o.isMesh) {
      return o;
    }
    if (o === aboutMePlanetMesh) return aboutMePlanetMesh;
    if (o === myProjectsPlanetMesh) return myProjectsPlanetMesh;
    if (o === hobbiesPlanetMesh) return hobbiesPlanetMesh;
    if (o === skillsPlanetMesh) return skillsPlanetMesh;
    if (o === contactPlanetMesh) return contactPlanetMesh;
    o = o.parent;
  }
  return null;
}

/* BIO: Planet layout, label, and interaction note. */
function raycastScrollPlanetAt(clientX, clientY) {
  if (!camera || !renderer) return null;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    return null;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  const roots = [];
  if (proAboutMode === 'ready' || proAboutMode === 'reveal') {
    for (const g of proAboutSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) roots.push(g.mesh);
    }
  } else if (proProjectsMode === 'ready' || proProjectsMode === 'reveal') {
    for (const g of proProjectsSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) roots.push(g.mesh);
    }
  } else if (proHobbiesMode === 'ready' || proHobbiesMode === 'reveal') {
    for (const g of proHobbiesSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) roots.push(g.mesh);
    }
  } else if (proSkillsMode === 'ready' || proSkillsMode === 'reveal') {
    for (const g of proSkillsSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) {
        roots.push(g.mesh);
        if (g.ring) roots.push(g.ring);
      }
    }
  } else if (proContactMode === 'ready' || proContactMode === 'reveal') {
    for (const g of proContactSubGroups) {
      if (g && g.mesh && g.group && g.group.visible) roots.push(g.mesh);
    }
  } else {
    if (
      aboutMePlanetMesh &&
      proScrollAboutOff &&
      proScrollAboutOff.visible &&
      (!aboutMainShell || aboutMainShell.visible)
    ) {
      roots.push(aboutMePlanetMesh);
    }
    if (
      myProjectsPlanetMesh &&
      proScrollProjectsOff &&
      proScrollProjectsOff.visible &&
      (!projectsMainShell || projectsMainShell.visible)
    ) {
      roots.push(myProjectsPlanetMesh);
    }
    if (
      hobbiesPlanetMesh &&
      proScrollHobbiesOff &&
      proScrollHobbiesOff.visible &&
      (!hobbiesMainShell || hobbiesMainShell.visible)
    ) {
      roots.push(hobbiesPlanetMesh);
    }
    if (
      skillsPlanetMesh &&
      proScrollSkillsOff &&
      proScrollSkillsOff.visible &&
      (!skillsMainShell || skillsMainShell.visible)
    ) {
      roots.push(skillsPlanetMesh);
    }
    if (
      contactPlanetMesh &&
      proScrollContactOff &&
      proScrollContactOff.visible &&
      (!contactMainShell || contactMainShell.visible)
    ) {
      roots.push(contactPlanetMesh);
    }
  }
  if (roots.length === 0) return null;
  const hits = _ray.intersectObjects(roots, true);
  for (const h of hits) {
    const r = resolveScrollPlanetPickFromHitObject(h.object);
    if (r) return r;
  }
  return null;
}

/* BIO: Pro Mode integration note. */
function getProScrollPlanetHoverTargets(clientX, clientY) {
  _proAboutHoverTarget = null;
  _proProjectsHoverTarget = null;
  _proHobbiesHoverTarget = null;
  _proSkillsHoverTarget = null;
  _proContactHoverTarget = null;
  if (!document.body || !document.body.classList.contains('cockpit-3d-active')) return;
  if (!_proScrollPlanetsUnlocked) return;
  if (isPointerOverChrome(clientX, clientY) || isPointerOverUI(clientX, clientY)) return;
  if (pickCockpitUiObject(clientX, clientY)) return;
  const p = _pickPlanetByScreenAndSprite(clientX, clientY);
  if (!p) return;
  if (p === aboutMePlanetMesh) {
    if (proAboutMode === 'idle' && proScrollAboutOff && proScrollAboutOff.visible && aboutMainShell && aboutMainShell.visible) {
      _proAboutHoverTarget = p;
    }
    return;
  }
  if (p === myProjectsPlanetMesh) {
    if (proProjectsMode === 'idle' && proScrollProjectsOff && proScrollProjectsOff.visible && projectsMainShell && projectsMainShell.visible) {
      _proProjectsHoverTarget = p;
    }
    return;
  }
  if (p === hobbiesPlanetMesh) {
    if (proHobbiesMode === 'idle' && proScrollHobbiesOff && proScrollHobbiesOff.visible && hobbiesMainShell && hobbiesMainShell.visible) {
      _proHobbiesHoverTarget = p;
    }
    return;
  }
  if (p === skillsPlanetMesh) {
    if (proSkillsMode === 'idle' && proScrollSkillsOff && proScrollSkillsOff.visible && skillsMainShell && skillsMainShell.visible) {
      _proSkillsHoverTarget = p;
    }
    return;
  }
  if (p === contactPlanetMesh) {
    if (proContactMode === 'idle' && proScrollContactOff && proScrollContactOff.visible && contactMainShell && contactMainShell.visible) {
      _proContactHoverTarget = p;
    }
    return;
  }
  if (p.userData && p.userData.proSubId) {
    if (p.userData.proPlanetId === 'about' && proAboutMode === 'ready' && p.parent && p.parent.visible) {
      _proAboutHoverTarget = p;
    } else if (p.userData.proPlanetId === 'projects' && proProjectsMode === 'ready' && p.parent && p.parent.visible) {
      _proProjectsHoverTarget = p;
    } else if (p.userData.proPlanetId === 'hobbies' && proHobbiesMode === 'ready' && p.parent && p.parent.visible) {
      _proHobbiesHoverTarget = p;
    } else if (p.userData.proPlanetId === 'skills' && proSkillsMode === 'ready' && p.parent && p.parent.visible) {
      _proSkillsHoverTarget = p;
    } else if (p.userData.proPlanetId === 'contact' && proContactMode === 'ready' && p.parent && p.parent.visible) {
      _proContactHoverTarget = p;
    }
  }
}

function planetHoverSfxKeyFor(tgt, mainMesh, slug) {
  if (!tgt) return null;
  if (tgt === mainMesh) return slug;
  if (tgt.userData && tgt.userData.proSubId) {
    return slug + ':sub:' + tgt.userData.proSubId;
  }
  return null;
}

function getCurrentPlanetHoverSfxKey() {
  let k = planetHoverSfxKeyFor(_proAboutHoverTarget, aboutMePlanetMesh, 'about');
  if (k) return k;
  k = planetHoverSfxKeyFor(_proProjectsHoverTarget, myProjectsPlanetMesh, 'projects');
  if (k) return k;
  k = planetHoverSfxKeyFor(_proHobbiesHoverTarget, hobbiesPlanetMesh, 'hobbies');
  if (k) return k;
  k = planetHoverSfxKeyFor(_proSkillsHoverTarget, skillsPlanetMesh, 'skills');
  if (k) return k;
  return planetHoverSfxKeyFor(_proContactHoverTarget, contactPlanetMesh, 'contact');
}

function lerpProAboutHoverFactor(mesh, want, dt) {
  if (!mesh) return 0;
  if (!mesh.userData) mesh.userData = {};
  const k = reduceMotion ? 1 : PRO_ABOUT_HOVER_SMOOTH;
  let f = mesh.userData._planetHoverF;
  if (f === undefined) f = 0;
  f += (want - f) * Math.min(1, k * dt);
  if (f < 0.001) f = 0;
  if (f > 0.997) f = 1;
  mesh.userData._planetHoverF = f;
  return f;
}

function applyProAboutHoverMaterial(material, f, isMain) {
  if (!material || f <= 0) {
    if (material && material.userData && material.userData._hoverBaseE) {
      material.emissive.copy(material.userData._hoverBaseE);
      material.emissiveIntensity = material.userData._hoverBaseEi;
    }
    return;
  }
  if (!material.userData._hoverBaseE) {
    material.userData._hoverBaseE = new THREE.Color().copy(material.emissive);
    material.userData._hoverBaseEi = material.emissiveIntensity;
  }
  const t = Math.min(1, f);
  const bMul = isMain ? 1.5 : 1.32;
  const bi = material.userData._hoverBaseEi * bMul;
  material.emissive
    .copy(material.userData._hoverBaseE)
    .lerp(_proAboutHoverOrange, t * 0.62);
  material.emissiveIntensity = THREE.MathUtils.lerp(
    material.userData._hoverBaseEi,
    bi,
    t
  );
}

/* BIO: Planet layout, label, and interaction note. */
function updateProAboutPlanetHoverVisuals(dt) {
  if (!proScrollGroup || !proScrollData) return;
  const tgt = _proAboutHoverTarget;
  const wantMain = tgt === aboutMePlanetMesh && proAboutMode === 'idle' && aboutMainShell && aboutMainShell.visible;
  const fMain = aboutMePlanetMesh ? lerpProAboutHoverFactor(aboutMePlanetMesh, wantMain, dt) : 0;
  if (proAboutMode === 'idle' && aboutMePlanetMesh) {
    aboutMePlanetMesh.scale.setScalar(1 + PRO_ABOUT_MAIN_HOVER_SCALE * fMain);
    const core = aboutMePlanetMesh.getObjectByName('aboutMeCore');
    if (core && core.material) {
      applyProAboutHoverMaterial(core.material, fMain, true);
    }
  } else if (aboutMePlanetMesh) {
    aboutMePlanetMesh.scale.setScalar(1);
    const core0 = aboutMePlanetMesh.getObjectByName('aboutMeCore');
    if (core0 && core0.material) applyProAboutHoverMaterial(core0.material, 0, true);
  }
  for (const g of proAboutSubGroups) {
    if (!g || !g.mesh || !g.group) continue;
    const wantSub = tgt === g.mesh && proAboutMode === 'ready' && proSubMode === 'idle';
    const fS = lerpProAboutHoverFactor(g.mesh, wantSub, dt);
    /* BIO: Implementation note for this section. */
    if (proAboutMode === 'ready' && proSubMode === 'idle' && g.group.parent && g.group.visible) {
      g.group.scale.setScalar(1 + PRO_ABOUT_SUB_HOVER_SCALE * fS);
      if (g.mesh.material) applyProAboutHoverMaterial(g.mesh.material, fS, false);
    } else if (g.mesh.material) {
      applyProAboutHoverMaterial(g.mesh.material, 0, false);
    }
  }
}

function applyProProjectsHoverMaterial(material, f, isMain) {
  if (!material || f <= 0) {
    if (material && material.userData && material.userData._hoverBaseE) {
      material.emissive.copy(material.userData._hoverBaseE);
      material.emissiveIntensity = material.userData._hoverBaseEi;
    }
    return;
  }
  if (!material.userData._hoverBaseE) {
    material.userData._hoverBaseE = new THREE.Color().copy(material.emissive);
    material.userData._hoverBaseEi = material.emissiveIntensity;
  }
  const t = Math.min(1, f);
  /* BIO: Planet layout, label, and interaction note. */
  const bMul = isMain ? 2.15 : 1.35;
  const lerpK = isMain ? 0.88 : 0.65;
  const bi = material.userData._hoverBaseEi * bMul;
  material.emissive
    .copy(material.userData._hoverBaseE)
    .lerp(_proProjectsHoverPink, t * lerpK);
  material.emissiveIntensity = THREE.MathUtils.lerp(
    material.userData._hoverBaseEi,
    bi,
    t
  );
}

function updateProProjectsPlanetHoverVisuals(dt) {
  if (!proScrollGroup || !proScrollData) return;
  const tgt = _proProjectsHoverTarget;
  const wantPM =
    tgt === myProjectsPlanetMesh &&
    proProjectsMode === 'idle' &&
    projectsMainShell &&
    projectsMainShell.visible;
  const fP = myProjectsPlanetMesh ? lerpProAboutHoverFactor(myProjectsPlanetMesh, wantPM, dt) : 0;
  if (proProjectsMode === 'idle' && myProjectsPlanetMesh) {
    myProjectsPlanetMesh.scale.setScalar(1 + PRO_ABOUT_MAIN_HOVER_SCALE * fP);
    const c = myProjectsPlanetMesh.getObjectByName('myProjectsCore');
    if (c && c.material) applyProProjectsHoverMaterial(c.material, fP, true);
  } else if (myProjectsPlanetMesh) {
    myProjectsPlanetMesh.scale.setScalar(1);
    const c0 = myProjectsPlanetMesh.getObjectByName('myProjectsCore');
    if (c0 && c0.material) applyProProjectsHoverMaterial(c0.material, 0, true);
  }
  for (const g of proProjectsSubGroups) {
    if (!g || !g.mesh || !g.group) continue;
    const wantS = tgt === g.mesh && proProjectsMode === 'ready' && proSubMode === 'idle';
    const fG = lerpProAboutHoverFactor(g.mesh, wantS, dt);
    if (proProjectsMode === 'ready' && proSubMode === 'idle' && g.group.parent && g.group.visible) {
      g.group.scale.setScalar(1 + PRO_ABOUT_SUB_HOVER_SCALE * fG);
      if (g.mesh.material) applyProProjectsHoverMaterial(g.mesh.material, fG, false);
    } else if (g.mesh.material) {
      applyProProjectsHoverMaterial(g.mesh.material, 0, false);
    }
  }
}

function syncAboutPlanetCursorHint(clientX, clientY) {
  const cnv = renderer && renderer.domElement;
  const cur = typeof document !== 'undefined' ? document.getElementById('cur') : null;
  const _hovAll = [
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
  if (!cnv || !cur) {
    _proAboutHoverTarget = null;
    _proProjectsHoverTarget = null;
    _proHobbiesHoverTarget = null;
    _proSkillsHoverTarget = null;
    _proContactHoverTarget = null;
    _prevPlanetHoverSfxKey = null;
    return;
  }
  if (!document.body || !document.body.classList.contains('cockpit-3d-active')) {
    _proAboutHoverTarget = null;
    _proProjectsHoverTarget = null;
    _proHobbiesHoverTarget = null;
    _proSkillsHoverTarget = null;
    _proContactHoverTarget = null;
    _prevPlanetHoverSfxKey = null;
    cnv.style.cursor = '';
    cur.classList.remove(..._hovAll);
    return;
  }
  getProScrollPlanetHoverTargets(clientX, clientY);
  if (
    !isProMapOverlayOpen() &&
    !isPointerOverProMapOpen(clientX, clientY) &&
    !reduceMotion
  ) {
    const phKey = getCurrentPlanetHoverSfxKey();
    if (phKey !== _prevPlanetHoverSfxKey) {
      if (phKey) {
        try {
          const api = window.bgsProCockpitApi;
          if (api && typeof api.playPlanetHoverSfx === 'function') api.playPlanetHoverSfx();
        } catch (_ps) {}
      }
      _prevPlanetHoverSfxKey = phKey;
    }
  } else {
    _prevPlanetHoverSfxKey = null;
  }
  /* BIO: Map overlay behavior and interaction note. */
  if (isPointerOverProMapOpen(clientX, clientY)) {
    cnv.style.cursor = 'none';
    return;
  }
  if (reduceMotion) {
    cnv.style.cursor = '';
    cur.classList.remove(..._hovAll);
    return;
  }
  if (isPointerOverChrome(clientX, clientY) || isPointerOverUI(clientX, clientY)) {
    cnv.style.cursor = '';
    cur.classList.remove(..._hovAll);
    return;
  }
  {
    const uiObj = pickCockpitUiObject(clientX, clientY);
    if (uiObj) {
      /* BIO: Map overlay behavior and interaction note. */
      cnv.style.cursor = 'pointer';
      cur.classList.remove(..._hovAll);
      cur.classList.add('hov');
      return;
    }
  }
  if (_proAboutHoverTarget === aboutMePlanetMesh) {
    cur.classList.add('hov-about');
    cur.classList.remove(
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (
    _proAboutHoverTarget &&
    _proAboutHoverTarget.userData &&
    _proAboutHoverTarget.userData.proSubId
  ) {
    cur.classList.add('hov-about-sub');
    cur.classList.remove(
      'hov-about',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (_proProjectsHoverTarget === myProjectsPlanetMesh) {
    cur.classList.add('hov-projects');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (
    _proProjectsHoverTarget &&
    _proProjectsHoverTarget.userData &&
    _proProjectsHoverTarget.userData.proSubId
  ) {
    cur.classList.add('hov-projects-sub');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (_proHobbiesHoverTarget === hobbiesPlanetMesh) {
    cur.classList.add('hov-hobbies');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (
    _proHobbiesHoverTarget &&
    _proHobbiesHoverTarget.userData &&
    _proHobbiesHoverTarget.userData.proSubId
  ) {
    cur.classList.add('hov-hobbies-sub');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (_proSkillsHoverTarget === skillsPlanetMesh) {
    cur.classList.add('hov-skills');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills-sub',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (
    _proSkillsHoverTarget &&
    _proSkillsHoverTarget.userData &&
    _proSkillsHoverTarget.userData.proSubId
  ) {
    cur.classList.add('hov-skills-sub');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-contact',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (_proContactHoverTarget === contactPlanetMesh) {
    cur.classList.add('hov-contact');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact-sub'
    );
    cnv.style.cursor = 'pointer';
  } else if (
    _proContactHoverTarget &&
    _proContactHoverTarget.userData &&
    _proContactHoverTarget.userData.proSubId
  ) {
    cur.classList.add('hov-contact-sub');
    cur.classList.remove(
      'hov-about',
      'hov-about-sub',
      'hov-projects',
      'hov-projects-sub',
      'hov-hobbies',
      'hov-hobbies-sub',
      'hov-skills',
      'hov-skills-sub',
      'hov-contact'
    );
    cnv.style.cursor = 'pointer';
  } else {
    cur.classList.remove(..._hovAll);
    cur.classList.remove('hov');
    cnv.style.cursor = 'none';
  }
  /* BIO: Planet layout, label, and interaction note. */
  if (cnv.style.cursor === 'pointer') {
    cur.classList.add('hov');
  }
}

function _pickPlanetByScreenAndSprite(clientX, clientY) {
  if (!camera || !renderer) return null;
  const fromRay = raycastScrollPlanetAt(clientX, clientY);
  if (fromRay) return fromRay;

  /* BIO: Implementation note for this section. */
  if (proAboutMode === 'ready' || proAboutMode === 'reveal') {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null;
    }
    const rPx = Math.max(40, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 4.5 : 48);
    let bestSub = null;
    let bestDSub = Infinity;
    for (const spr of proAboutSubLabelSprites) {
      if (!spr || !spr.visible) continue;
      spr.getWorldPosition(_plProj);
      _plProj.project(camera);
      if (_plProj.z < -1 || _plProj.z > 1) continue;
      const lx = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
      const ly = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
      const d = Math.hypot(clientX - lx, clientY - ly);
      if (d < rPx * 0.7 && d < bestDSub) {
        bestDSub = d;
        const subId = spr.userData.proSubId;
        const g = proAboutSubGroups.find(gg => gg.subId === subId);
        if (g) bestSub = g.mesh;
      }
    }
    return bestSub;
  }

  if (proProjectsMode === 'ready' || proProjectsMode === 'reveal') {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null;
    }
    const rPx2 = Math.max(40, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 4.5 : 48);
    let bestSubP = null;
    let bestDP = Infinity;
    for (const spr of proProjectsSubLabelSprites) {
      if (!spr || !spr.visible) continue;
      spr.getWorldPosition(_plProj);
      _plProj.project(camera);
      if (_plProj.z < -1 || _plProj.z > 1) continue;
      const lx2 = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
      const ly2 = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
      const d2 = Math.hypot(clientX - lx2, clientY - ly2);
      if (d2 < rPx2 * 0.7 && d2 < bestDP) {
        bestDP = d2;
        const sid = spr.userData.proSubId;
        const g2 = proProjectsSubGroups.find(gg => gg.subId === sid);
        if (g2) bestSubP = g2.mesh;
      }
    }
    return bestSubP;
  }

  if (proHobbiesMode === 'ready' || proHobbiesMode === 'reveal') {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null;
    }
    const rPxH = Math.max(40, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 4.5 : 48);
    let bestSubH = null;
    let bestDH = Infinity;
    for (const spr of proHobbiesSubLabelSprites) {
      if (!spr || !spr.visible) continue;
      spr.getWorldPosition(_plProj);
      _plProj.project(camera);
      if (_plProj.z < -1 || _plProj.z > 1) continue;
      const lxH = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
      const lyH = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
      const dH = Math.hypot(clientX - lxH, clientY - lyH);
      if (dH < rPxH * 0.7 && dH < bestDH) {
        bestDH = dH;
        const sidH = spr.userData.proSubId;
        const gH = proHobbiesSubGroups.find(gg => gg.subId === sidH);
        if (gH) bestSubH = gH.mesh;
      }
    }
    return bestSubH;
  }

  if (proSkillsMode === 'ready' || proSkillsMode === 'reveal') {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null;
    }
    const rPxSk = Math.max(40, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 4.5 : 48);
    let bestSubSk = null;
    let bestDSk = Infinity;
    for (const spr of proSkillsSubLabelSprites) {
      if (!spr || !spr.visible) continue;
      spr.getWorldPosition(_plProj);
      _plProj.project(camera);
      if (_plProj.z < -1 || _plProj.z > 1) continue;
      const lxSk = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
      const lySk = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
      const dSk = Math.hypot(clientX - lxSk, clientY - lySk);
      if (dSk < rPxSk * 0.7 && dSk < bestDSk) {
        bestDSk = dSk;
        const sidSk = spr.userData.proSubId;
        const gSk = proSkillsSubGroups.find(gg => gg.subId === sidSk);
        if (gSk) bestSubSk = gSk.mesh;
      }
    }
    return bestSubSk;
  }

  if (proContactMode === 'ready' || proContactMode === 'reveal') {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null;
    }
    const rPxCt = Math.max(40, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 4.5 : 48);
    let bestSubCt = null;
    let bestDCt = Infinity;
    for (const spr of proContactSubLabelSprites) {
      if (!spr || !spr.visible) continue;
      spr.getWorldPosition(_plProj);
      _plProj.project(camera);
      if (_plProj.z < -1 || _plProj.z > 1) continue;
      const lxCt = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
      const lyCt = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
      const dCt = Math.hypot(clientX - lxCt, clientY - lyCt);
      if (dCt < rPxCt * 0.7 && dCt < bestDCt) {
        bestDCt = dCt;
        const sidCt = spr.userData.proSubId;
        const gCt = proContactSubGroups.find(gg => gg.subId === sidCt);
        if (gCt) bestSubCt = gCt.mesh;
      }
    }
    return bestSubCt;
  }

  const candidates = [];
  if (
    aboutMePlanetMesh &&
    proScrollAboutOff &&
    proScrollAboutOff.visible &&
    (!aboutMainShell || aboutMainShell.visible)
  ) {
    candidates.push(aboutMePlanetMesh);
  }
  if (
    myProjectsPlanetMesh &&
    proScrollProjectsOff &&
    proScrollProjectsOff.visible &&
    (!projectsMainShell || projectsMainShell.visible)
  ) {
    candidates.push(myProjectsPlanetMesh);
  }
  if (
    hobbiesPlanetMesh &&
    proScrollHobbiesOff &&
    proScrollHobbiesOff.visible &&
    (!hobbiesMainShell || hobbiesMainShell.visible)
  ) {
    candidates.push(hobbiesPlanetMesh);
  }
  if (
    skillsPlanetMesh &&
    proScrollSkillsOff &&
    proScrollSkillsOff.visible &&
    (!skillsMainShell || skillsMainShell.visible)
  ) {
    candidates.push(skillsPlanetMesh);
  }
  if (
    contactPlanetMesh &&
    proScrollContactOff &&
    proScrollContactOff.visible &&
    (!contactMainShell || contactMainShell.visible)
  ) {
    candidates.push(contactPlanetMesh);
  }
  if (candidates.length === 0) return null;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    return null;
  }
  const rPx = Math.max(48, (proScrollData && proScrollData.maxDim) ? proScrollData.maxDim * 6.5 : 64);
  let best = null;
  let bestD = Infinity;
  const _plProjCenter = new THREE.Vector3();
  const _plProjEdge = new THREE.Vector3();
  const _camUp = new THREE.Vector3();
  for (const m of candidates) {
    m.getWorldPosition(_plProjCenter);
    _plProj.copy(_plProjCenter);
    _plProj.project(camera);
    if (_plProj.z < -1 || _plProj.z > 1) continue;
    const scrX = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
    const scrY = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
    const d = Math.hypot(clientX - scrX, clientY - scrY);
    /* BIO: Planet layout, label, and interaction note. */
    if (m === contactPlanetMesh && m.userData && m.userData._innerHoleRadius) {
      const innerR = m.userData._innerHoleRadius;
      _camUp.set(0, 1, 0);
      _plProjEdge.copy(_plProjCenter).addScaledVector(_camUp, innerR);
      _plProjEdge.project(camera);
      const ex = ((_plProjEdge.x + 1) * 0.5) * rect.width + rect.left;
      const ey = (1 - (_plProjEdge.y + 1) * 0.5) * rect.height + rect.top;
      const innerPx = Math.hypot(ex - scrX, ey - scrY);
      if (innerPx > 0 && d < innerPx) continue;
    }
    if (d < rPx && d < bestD) {
      bestD = d;
      best = m;
    }
  }
  const labels = [
    aboutLabelSprite,
    projectsLabelSprite,
    hobbiesLabelSprite,
    skillsLabelSprite,
    contactLabelSprite
  ].filter(Boolean);
  for (const spr of labels) {
    if (!spr.visible) continue;
    spr.getWorldPosition(_plProj);
    _plProj.project(camera);
    if (_plProj.z < -1 || _plProj.z > 1) continue;
    const lx = ((_plProj.x + 1) * 0.5) * rect.width + rect.left;
    const ly = (1 - (_plProj.y + 1) * 0.5) * rect.height + rect.top;
    const d = Math.hypot(clientX - lx, clientY - ly);
    if (d < rPx * 0.6 && d < bestD) {
      bestD = d;
      if (spr === aboutLabelSprite) best = aboutMePlanetMesh;
      else if (spr === projectsLabelSprite) best = myProjectsPlanetMesh;
      else if (spr === hobbiesLabelSprite) best = hobbiesPlanetMesh;
      else if (spr === skillsLabelSprite) best = skillsPlanetMesh;
      else if (spr === contactLabelSprite) best = contactPlanetMesh;
    }
  }
  return best;
}

function pickProPlanetByScreenSpace(clientX, clientY) {
  if (!_proScrollPlanetsUnlocked) return null;
  return _pickPlanetByScreenAndSprite(clientX, clientY);
}

function isProMapOverlayOpen() {
  const o = document.getElementById('pro-map-overlay');
  return !!o && !o.hasAttribute('hidden');
}

function isProPongOverlayOpen() {
  const o = document.getElementById('pro-pong-overlay');
  return !!o && !o.hasAttribute('hidden');
}

function isProBlockingExitFlow() {
  try {
    return typeof document !== 'undefined' && document.body.classList.contains('pro-blocking-overlay');
  } catch (_e) {
    return false;
  }
}

/* BIO: Dokunmayla carousel ad谋m谋 i莽in biriken px e艧i臒i 鈥?d眉艧眉k = daha h谋zl谋 ge莽i艧 (masa眉st眉 tekerle臒i etkilenmez). */
const PRO_MOBILE_SWIPE_PIXEL_STEP = 34;

function canBeginProScrollAt(clientX, clientY) {
  if (!document.body.classList.contains('cockpit-3d-active') || !proScrollGroup) return false;
  if (document.body.classList.contains('pro-blocking-overlay')) return false;
  if (isProMapOverlayOpen()) return false;
  if (isProPongOverlayOpen()) return false;
  if (isPointerOverChrome(clientX, clientY)) return false;
  if (raycastClockDisplayHit(clientX, clientY)) return false;
  if (isPointerOverUI(clientX, clientY)) return false;
  if (pickCockpitUiObject(clientX, clientY)) return false;
  return true;
}

/** @returns {'main'|'sub'|'none'} */
function tryApplyVerticalScrollGestures(clientX, clientY, deltaYForStep) {
  if (!canBeginProScrollAt(clientX, clientY)) return 'none';
  if (proSubMode === 'ready' && _handleProSubDetailWheel(deltaYForStep)) return 'sub';
  if (
    proAboutScrollLocked ||
    proProjectsScrollLocked ||
    proHobbiesScrollLocked ||
    proSkillsScrollLocked ||
    proContactScrollLocked
  ) {
    return 'none';
  }
  applyProScrollMainCarousel(deltaYForStep);
  return 'main';
}

function getProDeviceScreenAngle() {
  try {
    const so = typeof screen !== 'undefined' ? screen.orientation : null;
    if (so && typeof so.angle === 'number' && Number.isFinite(so.angle)) {
      return ((so.angle % 360) + 360) % 360;
    }
  } catch (_e) {
    /* BIO: noop */
  }
  if (typeof window !== 'undefined' && typeof window.orientation === 'number') {
    const w = window.orientation;
    if (w === -90) return 270;
    return ((w % 360) + 360) % 360;
  }
  return 0;
}

function snapProOrientationBucket(angleDeg) {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a <= 45 || a > 315) return 0;
  if (a <= 135) return 90;
  if (a <= 225) return 180;
  return 270;
}

/**
 * Asphalt vari: yaln谋zca yan yalpa (direksiyon) 鈥?pitch/alpha kullan谋lmaz.
 * Portrait 0掳/180掳: gamma. Landscape 90掳/270掳: beta (ekran d枚n眉艧眉ne g枚re i艧aret).
 */
function proMobileSteeringLateralDegrees(ev) {
  const beta = typeof ev.beta === 'number' && Number.isFinite(ev.beta) ? ev.beta : NaN;
  const gamma = typeof ev.gamma === 'number' && Number.isFinite(ev.gamma) ? ev.gamma : NaN;

  const bucket = snapProOrientationBucket(getProDeviceScreenAngle());
  let steer = NaN;
  if (bucket === 90) steer = beta;
  else if (bucket === 270) steer = -beta;
  else if (bucket === 180) steer = -gamma;
  else steer = gamma;

  return steer;
}

function bindProGyroOrientationNeutralReset() {
  if (_gyroOrientNeutralResetBound || typeof window === 'undefined') return;
  _gyroOrientNeutralResetBound = true;
  const onCh = () => {
    if (!_proGyroLookActive) return;
    window.requestAnimationFrame(() => {
      if (!_proGyroLookActive) return;
      const snapNow = snapProOrientationBucket(getProDeviceScreenAngle());
      if (_gyroLastSnapAngle === null) {
        _gyroLastSnapAngle = snapNow;
        return;
      }
      if (snapNow !== _gyroLastSnapAngle) {
        _gyroLastSnapAngle = snapNow;
        _gyroNeutralDeg = null;
        _gyroFilteredDeg = null;
      }
    });
  };
  window.addEventListener('orientationchange', onCh, false);
}

function onDeviceOrientation(ev) {
  if (_proMobileCenterLookLock || !_proGyroLookActive || reduceMotion || !camera) return;
  const g = proMobileSteeringLateralDegrees(ev);
  if (!Number.isFinite(g)) return;
  if (_gyroFilteredDeg == null) _gyroFilteredDeg = g;
  else _gyroFilteredDeg += GYRO_REL_DEG_SMOOTH * (g - _gyroFilteredDeg);
  if (_gyroNeutralDeg === null) {
    _gyroNeutralDeg = _gyroFilteredDeg;
    return;
  }
  const relDeg = _gyroFilteredDeg - _gyroNeutralDeg;
  const yaw = THREE.MathUtils.clamp(
    -relDeg * GYRO_YAW_SENS * THREE.MathUtils.DEG2RAD,
    -MAX_YAW,
    MAX_YAW
  );
  targetYaw = yaw;
  targetPitch = 0;
}

function stopProDeviceOrientationListening() {
  if (!_gyroDoEListener || typeof window === 'undefined') return;
  window.removeEventListener('deviceorientation', onDeviceOrientation, true);
  _gyroDoEListener = false;
}

function startProDeviceOrientationListening() {
  stopProDeviceOrientationListening();
  if (typeof window === 'undefined') return;
  _gyroLastSnapAngle = snapProOrientationBucket(getProDeviceScreenAngle());
  bindProGyroOrientationNeutralReset();
  window.addEventListener('deviceorientation', onDeviceOrientation, true);
  _gyroDoEListener = true;
}

async function tryProLockLandscapeOrientation() {
  const so = typeof screen !== 'undefined' ? screen.orientation : null;
  if (so && typeof so.lock === 'function') {
    try {
      await so.lock('landscape-primary');
      return true;
    } catch (_err) {
      /* BIO: iOS Safari and locked-down contexts often reject 鈥?fall through. */
    }
  }
  try {
    const el = typeof document !== 'undefined' ? document.documentElement : null;
    if (el && typeof el.requestFullscreen === 'function') {
      await el.requestFullscreen();
      if (so && typeof so.lock === 'function') {
        await so.lock('landscape-primary');
        return true;
      }
    }
  } catch (_err2) {
    /* BIO: fullscreen optional */
  }
  return typeof matchMedia !== 'undefined' && matchMedia('(orientation: landscape)').matches;
}

function teardownProLandscapeGate() {
  if (_landscapeGateWatchHandler && typeof window !== 'undefined') {
    window.removeEventListener('orientationchange', _landscapeGateWatchHandler);
    window.removeEventListener('resize', _landscapeGateWatchHandler);
    _landscapeGateWatchHandler = null;
  }
  if (typeof document !== 'undefined') {
    const g = document.getElementById('bgs-pro-landscape-gate');
    if (g && g.parentNode) {
      try {
        g.parentNode.removeChild(g);
      } catch (_e) {
        /* BIO: noop */
      }
    }
    try {
      document.body.classList.remove('pro-landscape-gate-active');
    } catch (_e2) {
      /* BIO: noop */
    }
  }
  _landscapeGateInjected = false;
}

/** Gyro banner after landscape gate clears or portrait skip stored. */
function proceedProMobileSensorPrompts() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (reduceMotion || !window.isSecureContext) return;
  if (typeof DeviceOrientationEvent === 'undefined') return;
  injectProMobileGyroBanner();
}

/** @returns true if fullscreen portrait gate overlay is visible (defer gyro prompts). */
function injectProMobileLandscapeGate() {
  if (typeof document === 'undefined' || !detectProMobileViewport()) return false;
  let skipPortrait = false;
  try {
    skipPortrait = sessionStorage.getItem('bgs_pro_landscape_skip') === '1';
  } catch (_e) {
    /* BIO: noop */
  }
  if (skipPortrait) return false;

  const portraitMm =
    typeof matchMedia !== 'undefined' ? matchMedia('(orientation: portrait)').matches : false;
  const portraitRough = window.innerHeight > window.innerWidth + 28;
  if (!portraitMm && !portraitRough) return false;

  if (document.getElementById('bgs-pro-landscape-gate')) return false;

  let lang = 'en';
  try {
    const h = document.documentElement && document.documentElement.getAttribute('lang');
    if (h && h.length >= 2) lang = h.slice(0, 2).toLowerCase();
  } catch (_err) {}

  const copy = {
    tr: {
      title: 'Yatay mod 枚nerilir',
      msg:
        'Mobil Pro kokpit yatay tutuldu臒unda daha rahatt谋r. Telefonunuzu yan 莽evirin veya yatay kilidini deneyin.',
      primary: 'Yataya ge莽',
      secondary: 'Dikeyde devam'
    },
    en: {
      title: 'Landscape recommended',
      msg:
        'Mobile Pro cockpit works best in landscape. Rotate your device or try locking to landscape.',
      primary: 'Use landscape',
      secondary: 'Continue in portrait'
    },
    de: {
      title: 'Querformat empfohlen',
      msg:
        'Der mobile Pro鈥慘okpit funktioniert im Querformat am besten. Drehen Sie das Ger盲t oder sperren Sie die Ausrichtung.',
      primary: 'Quer aktivieren',
      secondary: 'Hochformat nutzen'
    }
  };
  const tc = copy[lang] || copy.en;

  const wrap = document.createElement('div');
  wrap.id = 'bgs-pro-landscape-gate';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'bgs-ls-title');

  const inner = document.createElement('div');
  inner.className = 'bgs-pro-landscape-gate-inner';

  const icon = document.createElement('div');
  icon.className = 'bgs-ls-phone-icon';
  icon.setAttribute('aria-hidden', 'true');

  const h = document.createElement('h2');
  h.id = 'bgs-ls-title';
  h.className = 'bgs-ls-title';
  h.textContent = tc.title;

  const p = document.createElement('p');
  p.className = 'bgs-ls-msg';
  p.textContent = tc.msg;

  const row = document.createElement('div');
  row.className = 'bgs-ls-row';

  const btnPrimary = document.createElement('button');
  btnPrimary.type = 'button';
  btnPrimary.className = 'bgs-ls-primary';
  btnPrimary.textContent = tc.primary;

  const btnSecondary = document.createElement('button');
  btnSecondary.type = 'button';
  btnSecondary.className = 'bgs-ls-secondary';
  btnSecondary.textContent = tc.secondary;

  row.appendChild(btnPrimary);
  row.appendChild(btnSecondary);
  inner.appendChild(icon);
  inner.appendChild(h);
  inner.appendChild(p);
  inner.appendChild(row);
  wrap.appendChild(inner);

  const finishGateAndShowSensors = () => {
    teardownProLandscapeGate();
    proceedProMobileSensorPrompts();
  };

  const checkLandscape = () => {
    if (!_landscapeGateInjected) return;
    const ls =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(orientation: landscape)').matches;
    if (ls || window.innerWidth > window.innerHeight + 24) finishGateAndShowSensors();
  };

  btnSecondary.addEventListener('click', () => {
    try {
      sessionStorage.setItem('bgs_pro_landscape_skip', '1');
    } catch (_s) {
      /* BIO: noop */
    }
    finishGateAndShowSensors();
  });

  btnPrimary.addEventListener('click', async () => {
    await tryProLockLandscapeOrientation();
    checkLandscape();
  });

  _landscapeGateWatchHandler = checkLandscape;
  window.addEventListener('orientationchange', checkLandscape, false);
  window.addEventListener('resize', checkLandscape, false);

  document.body.appendChild(wrap);
  _landscapeGateInjected = true;
  try {
    document.body.classList.add('pro-landscape-gate-active');
  } catch (_b) {
    /* BIO: noop */
  }
  window.requestAnimationFrame(() => wrap.classList.add('open'));

  const primary = btnPrimary;
  if (typeof primary.focus === 'function') {
    requestAnimationFrame(() => {
      try {
        primary.focus({ preventScroll: true });
      } catch (_) {
        primary.focus();
      }
    });
  }

  return true;
}

/** @returns {HTMLElement | null} */
function injectProMobileGyroBanner() {
  if (_gyroBannerInjected || typeof document === 'undefined') return null;
  const root = document.getElementById('cockpit');
  if (!root) return null;

  let lang = 'en';
  try {
    const h = document.documentElement && document.documentElement.getAttribute('lang');
    if (h && h.length >= 2) lang = h.slice(0, 2).toLowerCase();
  } catch (_err) {}

  const copy = {
    tr: {
      msg:
        'Sa臒/sol kokpit bak谋艧谋 i莽in hareket sens枚r眉n眉 a莽man谋z 枚nerilir. 陌zin verin veya tek parmakla bak谋艧 i莽in atlay谋n.',
      enable: 'Sens枚rleri etkinle艧tir (枚nerilen)',
      skip: 'Atla'
    },
    en: {
      msg:
        'Enabling motion sensors is recommended for left/right cockpit look. Allow access, or skip to use one-finger look.',
      enable: 'Enable motion (recommended)',
      skip: 'Skip'
    },
    de: {
      msg:
        'F眉r Kopf-Schwenk links/rechts wird die Aktivierung des Bewegungs颅sensors empfohlen. Erlauben oder 眉berspringen (Ein-Finger-Blick).',
      enable: 'Sensor aktivieren (empfohlen)',
      skip: '脺berspringen'
    }
  };
  const tc = copy[lang] || copy.en;

  const banner = document.createElement('div');
  banner.id = 'bgs-gyro-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', tc.msg);
  const p = document.createElement('p');
  p.className = 'bgs-gyro-msg';
  p.textContent = tc.msg;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'bgs-gyro-enable';
  btn.textContent = tc.enable;
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.id = 'bgs-gyro-skip';
  skip.className = 'bgs-gyro-secondary';
  skip.textContent = tc.skip;
  banner.appendChild(p);
  banner.appendChild(btn);
  banner.appendChild(skip);
  root.appendChild(banner);
  _gyroBannerInjected = true;

  const hideBanner = () => {
    banner.classList.remove('open');
    try {
      root.removeChild(banner);
    } catch (_e) {
      /* BIO: noop */
    }
    _gyroBannerInjected = false;
  };

  skip.addEventListener('click', () => {
    _proGyroLookActive = false;
    hideBanner();
  });

  btn.addEventListener('click', async () => {
    /* BIO: Interaction-gated permission 鈥?iOS Safari 13+ requires a user gesture. */
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const st = await DeviceOrientationEvent.requestPermission();
        if (st !== 'granted') {
          _proGyroLookActive = false;
          hideBanner();
          return;
        }
      }
    } catch (_err2) {
      _proGyroLookActive = false;
      hideBanner();
      return;
    }
    _gyroNeutralDeg = null;
    _gyroFilteredDeg = null;
    _proGyroLookActive = true;
    startProDeviceOrientationListening();
    hideBanner();
  });

  requestAnimationFrame(() => banner.classList.add('open'));
  return banner;
}

function bindProMobileSwipeCarousel() {
  if (_proScrollTouchBound || typeof window === 'undefined') return;
  _proScrollTouchBound = true;

  const onTe = () => {
    _tsSwipeId = null;
    _tsSwipeAccum = 0;
    _tsSwipeEligible = false;
  };

  window.addEventListener(
    'touchstart',
    ev => {
      if (!detectProMobileViewport() || !_proScrollWheelBound) return;
      if (isProBlockingExitFlow()) return;
      if (_gyroBannerInjected && ev.target && ev.target.closest && ev.target.closest('#bgs-gyro-banner'))
        return;
      if (
        _landscapeGateInjected &&
        ev.target &&
        ev.target.closest &&
        ev.target.closest('#bgs-pro-landscape-gate')
      ) {
        return;
      }
      if (!ev.touches || ev.touches.length !== 1) return;
      const t = ev.touches[0];
      _tsSwipeId = t.identifier;
      _tsSwipeLastY = t.clientY;
      _tsSwipeAccum = 0;
      _tsSwipeEligible = canBeginProScrollAt(t.clientX, t.clientY);
    },
    { passive: true, capture: false }
  );

  window.addEventListener(
    'touchmove',
    ev => {
      if (!detectProMobileViewport()) return;
      if (_tsSwipeId == null || !ev.touches || ev.touches.length !== 1) return;
      const t0 = ev.touches[0];
      if (t0.identifier !== _tsSwipeId) return;

      if (!_tsSwipeEligible) {
        _tsSwipeLastY = t0.clientY;
        return;
      }

      if (!canBeginProScrollAt(t0.clientX, t0.clientY)) {
        _tsSwipeEligible = false;
        return;
      }

      const dy = t0.clientY - _tsSwipeLastY;
      _tsSwipeLastY = t0.clientY;

      _tsSwipeAccum += dy;
      while (_tsSwipeAccum >= PRO_MOBILE_SWIPE_PIXEL_STEP) {
        const ok = tryApplyVerticalScrollGestures(t0.clientX, t0.clientY, 100);
        if (ok === 'none') break;
        _tsSwipeAccum -= PRO_MOBILE_SWIPE_PIXEL_STEP;
      }
      while (_tsSwipeAccum <= -PRO_MOBILE_SWIPE_PIXEL_STEP) {
        const ok = tryApplyVerticalScrollGestures(t0.clientX, t0.clientY, -100);
        if (ok === 'none') break;
        _tsSwipeAccum += PRO_MOBILE_SWIPE_PIXEL_STEP;
      }
    },
    { passive: true, capture: false }
  );

  window.addEventListener('touchend', onTe, { passive: true });
  window.addEventListener('touchcancel', onTe, { passive: true });
}

const _CENTER_LOOK_COPY = {
  tr: {
    lock: 'Merkeze kilitle',
    unlock: 'Serbest bak谋艧',
    pressedLabel: 'Kokpit bak谋艧谋 merkezde 鈥?serbest i莽in dokunun'
  },
  en: {
    lock: 'Lock to center',
    unlock: 'Free look',
    pressedLabel: 'Cockpit view locked to center 鈥?tap for free look'
  },
  de: {
    lock: 'Ansicht zentrieren',
    unlock: 'Frei schwenken',
    pressedLabel: 'Kokpit auf Mitte fixiert 鈥?tippen f眉r freien Blick'
  }
};



/* BIO: Repurpose the former German language slot as Chinese for this GitHub Pages copy. */
function applyChineseLanguageSlotCockpit() {
  try {
    COCKPIT_CANVAS_ARIA_BY_LANG.de = '三维驾驶舱视图。页面开头提供文字摘要。';
  } catch (_) {}

  try {
    PRO_BIO_ID_CARD_TEXT.de = {
      org: 'BIO 学院',
      orgSub: '驾驶员档案',
      clrLabel: '权限',
      clrVal: 'A-7',
      name: '姓名',
      nameVal: '周天爽',
      codename: '代号',
      codenameVal: 'ZTS',
      role: '角色',
      roleVal: 'AI 训练师',
      focus: '方向',
      focusVal: 'AI · 新能源汽车',
      statCuriosity: '好奇心',
      statFocus: '专注',
      statCalm: '冷静',
      statTeamwork: '协作',
      statProactivity: '主动性',
      statCreativity: '创造力',
      idText: 'ID-2026-CN-04A7'
    };
  } catch (_) {}

  const c = {
    about: {
      edu: { title: '教育经历', html: `
        <div class="tl-wrap">
          <div class="tl-item active"><div class="tl-year">2022 - 2025</div><div class="tl-title">湖北科技职业学院</div><div class="tl-desc">互联网与网络技术</div></div>
          <div class="tl-item"><div class="tl-year">2019 - 2022</div><div class="tl-title">孝感一中</div><div class="tl-desc">高中教育</div></div>
        </div><hr class="divider"><div class="tl-section-title">获奖</div>
        <div class="tl-cert"><a href="#" target="_blank" rel="noopener">湖北省新能源汽车故障诊断二等奖</a></div>` },
      exp: { title: '经历', html: `<p>我仍在持续学习和成长。随着经验积累，这一部分会继续更新。</p>` },
      bio: { title: '个人简介', html: `<p>你好，我是 <strong>周天爽</strong>，也可以叫我 <strong>ZTS</strong>。</p><hr class="divider"><p>我关注人工智能、AI 训练、新能源汽车和自动化工具，希望把复杂技术转化为稳定、可用、能解决实际问题的能力。</p><hr class="divider"><p class="psh-note">工作之外，我也喜欢关注新技术、游戏、旅行和有挑战性的训练项目。</p>` }
    },
    projects: {
      web: { title: '网站项目', html: `<p><strong>项目</strong></p><ul><li>即将更新...</li><li>即将更新...</li><li>即将更新...</li></ul><hr class="divider"><p><strong>使用技术</strong></p><ul><li>Python</li><li>待添加</li><li>待添加</li></ul>` },
      mob: { title: 'AI 项目', html: `<p><strong>项目</strong></p><ul><li>即将更新...</li><li>即将更新...</li></ul><hr class="divider"><p>项目详情待添加。</p>` },
      back: { title: '综合项目', html: `<p><strong>项目</strong></p><ul><li>即将更新...</li><li>即将更新...</li></ul><hr class="divider"><p><strong>使用技术</strong></p><ul><li>Python</li><li>待添加</li><li>待添加</li></ul>` }
    },
    hobbies: {
      esp: { title: '电子竞技', html: `<p><strong>喜欢的游戏</strong></p><ul><li>VALORANT</li><li>CS2</li></ul><hr class="divider"><p>电子竞技训练了我的沟通、协作、压力下决策和快速解决问题的能力。</p>` },
      sht: { title: '篮球', html: `<p>篮球需要体能、节奏感、团队配合和临场判断。它训练了我的专注力、沟通能力以及在压力下快速决策的能力。</p><hr class="divider"><p class="psh-note">这是一项需要热情、耐心、纪律和协作的运动。</p>` },
      tec: { title: '技术趋势', html: `<p><strong>关注领域</strong></p><ul><li>人工智能与大语言模型</li><li>新能源汽车</li><li>AI 与自动化应用</li><li>硬件与芯片架构</li><li>量子计算</li></ul><hr class="divider"><p>我喜欢跟踪技术趋势，并把这些变化转化为学习方向和项目灵感。</p>` },
      trv: { title: '旅行', html: `<p>我喜欢旅行和探索新地方。新的环境会带来新的经验、想法和观察角度。</p>` }
    },
    skills: {
      ai: { title: '人工智能', html: `<p><strong>知识库和工具</strong></p><ul><li>Obsidian</li><li>Codex, VS Code, Gemini, Claude Code</li></ul><hr class="divider"><p><strong>已完成项目</strong></p><ul><li><a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br><span>基于机器学习模型预测健康保险费用。</span></li></ul><hr class="divider"><p><strong>兴趣方向</strong></p><ul><li>自然语言处理</li><li>机器学习</li><li>生成式 AI</li></ul>` },
      sec: { title: '新能源汽车', html: `<p><strong>研究兴趣领域</strong></p><ul><li>新能源汽车</li><li>智能座舱</li><li>电池与电驱系统</li><li>自动驾驶与车联网</li></ul>` }
    },
    contact: {
      mail: { title: '邮箱', html: `<p>你可以通过邮箱联系我：</p><p class="psh-mail"><a href="mailto:dahat5632@gmail.com">dahat5632@gmail.com</a></p><p class="psh-note">合作、项目想法，或者简单打个招呼，都欢迎联系。</p>` },
      soc: { title: '社交媒体', html: `<p>你可以在社交媒体上找到我，也欢迎通过 LinkedIn 建立连接。</p><hr class="divider"><p class="psh-note">点击下方图标访问我的主页。</p>` }
    }
  };

  try {
    for (const [planet, subs] of Object.entries(c)) {
      if (!PRO_SUB_CONTENT[planet]) continue;
      for (const [sub, value] of Object.entries(subs)) {
        if (!PRO_SUB_CONTENT[planet][sub]) continue;
        PRO_SUB_CONTENT[planet][sub].de = value;
      }
    }
  } catch (_) {}

  try {
    _CENTER_LOOK_COPY.de = {
      lock: '锁定中心',
      unlock: '自由视角',
      pressedLabel: '驾驶舱视角已锁定中心，点击切换为自由视角'
    };
  } catch (_) {}
}

applyChineseLanguageSlotCockpit();

function syncProMobileCenterLookToggleUi() {
  const btn = typeof document !== 'undefined' ? document.getElementById('bgs-pro-center-look-toggle') : null;
  if (!btn) return;
  let lang = 'en';
  try {
    const h = document.documentElement && document.documentElement.getAttribute('lang');
    if (h && h.length >= 2) lang = h.slice(0, 2).toLowerCase();
  } catch (_e) {}
  const row = _CENTER_LOOK_COPY[lang] || _CENTER_LOOK_COPY.en;
  if (_proMobileCenterLookLock) {
    btn.textContent = row.unlock;
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', row.pressedLabel);
  } else {
    btn.textContent = row.lock;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', row.lock);
  }
}

function setProMobileCenterLookLock(locked) {
  _proMobileCenterLookLock = !!locked;
  if (_proMobileCenterLookLock) {
    stopProDeviceOrientationListening();
    targetYaw = 0;
    targetPitch = 0;
  } else if (_proGyroLookActive) {
    startProDeviceOrientationListening();
  }
  syncProMobileCenterLookToggleUi();
}

function injectProMobileCenterLookToggle() {
  if (typeof document === 'undefined' || !detectProMobileViewport()) return;
  if (document.getElementById('bgs-pro-center-look-wrap')) return;
  const root = document.getElementById('cockpit');
  if (!root) return;

  const wrap = document.createElement('div');
  wrap.id = 'bgs-pro-center-look-wrap';
  wrap.className = 'bgs-pro-center-look-wrap';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'bgs-pro-center-look-toggle';
  btn.className = 'bgs-pro-center-look-toggle';
  btn.addEventListener('click', () => setProMobileCenterLookLock(!_proMobileCenterLookLock));
  wrap.appendChild(btn);
  root.appendChild(wrap);
  syncProMobileCenterLookToggleUi();

  if (!_centerLookLangListenerBound && typeof window !== 'undefined') {
    _centerLookLangListenerBound = true;
    window.addEventListener('bgs-pro-apply-lang', syncProMobileCenterLookToggleUi);
  }
}

function initProMobileCockpitUi() {
  if (!detectProMobileViewport() || typeof document === 'undefined') return;
  document.body.classList.add('pro-mobile-cockpit');
  bindProMobileSwipeCarousel();
  const gateShown = injectProMobileLandscapeGate();
  if (!gateShown) proceedProMobileSensorPrompts();
  injectProMobileCenterLookToggle();
}

function applyProScrollMainCarousel(deltaY) {
  proScrollTTarget += deltaY > 0 ? PRO_SCROLL_WHEEL_STEP : -PRO_SCROLL_WHEEL_STEP;
  _proScrollPlanetsUnlocked = true;
  _proScrollLastWheelT =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  _proScrollSnapDone = false;
}

function proScrollKeyboardDeferToFocusedUi() {
  const ae = typeof document !== 'undefined' ? document.activeElement : null;
  if (!ae || ae === document.body) return false;
  if (ae.isContentEditable) return true;
  const t = ae.tagName;
  if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return true;
  if (ae.closest && ae.closest(
    '#pro-fallback-chrome, #pro-lang-fallback:not([hidden]), #pro-map-overlay:not([hidden]), #pro-default-exit.open, #pro-pong-overlay:not([hidden]), #mini-player, #main-vol'
  )) return true;
  return false;
}

function onProScrollKeyboard(e) {
  if (e.repeat) return;
  let deltaSign = 0;
  const k = e.key;
  if (k === 'ArrowDown' || k === 'PageDown') deltaSign = 1;
  else if (k === 'ArrowUp' || k === 'PageUp') deltaSign = -1;
  else if (k === 's' || k === 'S') deltaSign = 1;
  else if (k === 'w' || k === 'W') deltaSign = -1;
  else return;

  if (proScrollKeyboardDeferToFocusedUi()) return;

  if (!document.body.classList.contains('cockpit-3d-active') || !proScrollGroup) return;
  if (document.body.classList.contains('pro-blocking-overlay')) {
    e.preventDefault();
    return;
  }
  if (isProMapOverlayOpen()) {
    e.preventDefault();
    return;
  }
  if (isProPongOverlayOpen()) {
    e.preventDefault();
    return;
  }

  const fakeDy = deltaSign > 0 ? 100 : -100;
  if (proSubMode === 'ready' && _handleProSubDetailWheel(fakeDy)) {
    e.preventDefault();
    return;
  }
  if (proAboutScrollLocked || proProjectsScrollLocked || proHobbiesScrollLocked || proSkillsScrollLocked || proContactScrollLocked) {
    e.preventDefault();
    return;
  }
  e.preventDefault();
  applyProScrollMainCarousel(fakeDy);
}

function onProScrollWheel(e) {
  if (!document.body.classList.contains('cockpit-3d-active') || !proScrollGroup) return;
  if (document.body.classList.contains('pro-blocking-overlay')) {
    e.preventDefault();
    return;
  }
  if (isProMapOverlayOpen()) {
    e.preventDefault();
    return;
  }
  if (isProPongOverlayOpen()) {
    e.preventDefault();
    return;
  }
  if (!canBeginProScrollAt(e.clientX, e.clientY)) return;
  if (proSubMode === 'ready' && _handleProSubDetailWheel(e.deltaY)) {
    e.preventDefault();
    return;
  }
  if (
    proAboutScrollLocked ||
    proProjectsScrollLocked ||
    proHobbiesScrollLocked ||
    proSkillsScrollLocked ||
    proContactScrollLocked
  ) {
    e.preventDefault();
    return;
  }
  e.preventDefault();
  applyProScrollMainCarousel(e.deltaY);
}

function initProScrollInput() {
  if (_proScrollWheelBound) return;
  _proScrollWheelBound = true;
  if (!_proScrollWelcomeListenerBound) {
    _proScrollWelcomeListenerBound = true;
    window.addEventListener('bgs-pro-ui-strings', e => {
      const d = e.detail;
      if (d && d.aboutLabel) {
        aboutLabelText = d.aboutLabel;
        drawAboutLabelToCanvas();
      }
      if (d && d.projectsLabel) {
        projectsLabelText = d.projectsLabel;
        drawProjectsLabelToCanvas();
      }
      if (d && d.hobbiesLabel) {
        hobbiesLabelText = d.hobbiesLabel;
        drawHobbiesLabelToCanvas();
      }
      if (d && d.skillsLabel) {
        skillsLabelText = d.skillsLabel;
        drawSkillsLabelToCanvas();
      }
      if (d && d.contactLabel) {
        contactLabelText = d.contactLabel;
        drawContactLabelToCanvas();
      }
      let subChanged = false;
      if (d && d.aboutSubEdu) { proAboutSubLabelTexts.edu = d.aboutSubEdu; subChanged = true; }
      if (d && d.aboutSubExp) { proAboutSubLabelTexts.exp = d.aboutSubExp; subChanged = true; }
      if (d && d.aboutSubBio) { proAboutSubLabelTexts.bio = d.aboutSubBio; subChanged = true; }
      if (subChanged) drawAllAboutSubLabelCanvases();
      let pSub = false;
      if (d && d.projectsSubWeb) { proProjectsSubLabelTexts.web = d.projectsSubWeb; pSub = true; }
      if (d && d.projectsSubMob) { proProjectsSubLabelTexts.mob = d.projectsSubMob; pSub = true; }
      if (d && d.projectsSubBack) { proProjectsSubLabelTexts.back = d.projectsSubBack; pSub = true; }
      if (pSub) drawAllProjectsSubLabelCanvases();
      let hSub = false;
      if (d && d.hobbiesSubEsp) { proHobbiesSubLabelTexts.esp = d.hobbiesSubEsp; hSub = true; }
      if (d && d.hobbiesSubSht) { proHobbiesSubLabelTexts.sht = d.hobbiesSubSht; hSub = true; }
      if (d && d.hobbiesSubTec) { proHobbiesSubLabelTexts.tec = d.hobbiesSubTec; hSub = true; }
      if (d && d.hobbiesSubTrv) { proHobbiesSubLabelTexts.trv = d.hobbiesSubTrv; hSub = true; }
      if (hSub) drawAllHobbiesSubLabelCanvases();
      let skSub = false;
      if (d && d.skillsSubAi) { proSkillsSubLabelTexts.ai = d.skillsSubAi; skSub = true; }
      if (d && d.skillsSubSec) { proSkillsSubLabelTexts.sec = d.skillsSubSec; skSub = true; }
      if (skSub) drawAllSkillsSubLabelCanvases();
      let ctSub = false;
      if (d && d.contactSubMail) {
        proContactSubLabelTexts.mail = d.contactSubMail;
        ctSub = true;
      }
      if (d && d.contactSubSoc) {
        proContactSubLabelTexts.soc = d.contactSubSoc;
        ctSub = true;
      }
      if (ctSub) drawAllContactSubLabelCanvases();
      if (d && d.backLabel) {
        aboutBackLabelText = d.backLabel;
        if (aboutBackMesh) syncAboutBackTexture();
      }
      /* BIO: Hologram panel behavior and rendering note. */
      if (proSubMode === 'ready') {
        _renderProSubHoloForActive();
      }
    });
  }
  window.addEventListener('wheel', onProScrollWheel, { passive: false, capture: false });
  window.addEventListener('keydown', onProScrollKeyboard, false);
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function addCockpitLangMeshButtons(modelRoot, maxDim) {
  const host = document.getElementById('pro-lang-fallback');
  if (host) {
    host.innerHTML = '';
    host.setAttribute('hidden', '');
  }
  while (langButtonMeshes.length) {
    const o = langButtonMeshes.pop();
    o.geometry.dispose();
    o.material.map && o.material.map.dispose();
    o.material.dispose();
  }

  const pw = COCKPIT_LANG_PLANE.w * maxDim;
  const ph = COCKPIT_LANG_PLANE.h * maxDim;
  const rot = COCKPIT_LANG_PLANE_ROT;
  const eps = maxDim * 0.0005;

  for (const [code, p] of Object.entries(COCKPIT_LANG_SCREENS)) {
    const cnv = document.createElement('canvas');
    cnv.width = LANG_CANVAS.w;
    cnv.height = LANG_CANVAS.h;
    const ctx = cnv.getContext('2d');
    if (!ctx) continue;

    const map = new THREE.CanvasTexture(cnv);
    if ('colorSpace' in map) {
      map.colorSpace = THREE.SRGBColorSpace;
    } else {
      /* BIO: three r1xx */
    }
    map.premultiplyAlpha = true;
    if (renderer) {
      const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
      map.anisotropy = aniso;
    }

    const geo = new THREE.PlaneGeometry(pw, ph);
    const mat = createCockpitUiFaceMaterial(map);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.lang = code;
    mesh.userData._ctx = ctx;
    mesh.userData._map = map;
    mesh.name = 'cockpitLang3d';

    mesh.position.set(p.x * maxDim, p.y * maxDim + eps, p.z * maxDim);
    mesh.rotation.set(rot.x, rot.y, rot.z);
    mesh.userData._uiBasePos = mesh.position.clone();
    mesh.userData._uiHoverZMax = Math.min(pw, ph) * COCKPIT_UI_HOVER_Z_FRAC;

    modelRoot.add(mesh);
    langButtonMeshes.push(mesh);
  }

  syncLangButtonTextures();
  if (!_langListenerBound) {
    _langListenerBound = true;
    window.addEventListener('bgs-pro-apply-lang', () => {
      requestAnimationFrame(syncLangButtonTextures);
    });
  }
  window.dispatchEvent(new Event('bgs-pro-apply-lang'));
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function addCockpitToolbarMeshButtons(modelRoot, maxDim) {
  while (toolbarActionMeshes.length) {
    const o = toolbarActionMeshes.pop();
    o.geometry.dispose();
    o.material.map && o.material.map.dispose();
    o.material.dispose();
  }
  if (!_toolbarUiBound) {
    _toolbarUiBound = true;
    window.addEventListener('bgs-pro-ui-strings', onProUiStrings);
  }

  const eps = maxDim * 0.0006;

  const specs = [
    ['default', toolbarScreenPosition('default')],
    ['map', toolbarScreenPosition('map')]
  ];
  for (const [actionId, pos] of specs) {
    const rotEuler = toolbarPlaneRotationEuler(actionId);
    const pw = TOOLBAR_PLANE.w * maxDim;
    const ph = TOOLBAR_PLANE.h * maxDim;
    const cnv = document.createElement('canvas');
    cnv.width = TOOLBAR_CANVAS.w;
    cnv.height = TOOLBAR_CANVAS.h;
    const ctx = cnv.getContext('2d');
    if (!ctx) continue;
    const map = new THREE.CanvasTexture(cnv);
    if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
    map.premultiplyAlpha = true;
    if (renderer) {
      map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
    }
    const geo = new THREE.PlaneGeometry(pw, ph);
    const mat = createCockpitUiFaceMaterial(map);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.actionId = actionId;
    mesh.name = 'cockpitToolbar3d';
    mesh.userData._ctx = ctx;
    mesh.userData._map = map;
    mesh.position.set(pos.x * maxDim, pos.y * maxDim + eps, pos.z * maxDim);
    mesh.rotation.set(rotEuler.x, rotEuler.y, rotEuler.z);
    mesh.userData._uiBasePos = mesh.position.clone();
    mesh.userData._uiHoverZMax = Math.min(pw, ph) * COCKPIT_UI_HOVER_Z_FRAC;
    modelRoot.add(mesh);
    toolbarActionMeshes.push(mesh);
  }
  syncToolbarTextures();
}

function addCockpitPongInviteButton(modelRoot, maxDim) {
  if (pongInviteMesh) {
    if (pongInviteMesh.parent) pongInviteMesh.parent.remove(pongInviteMesh);
    if (pongInviteMesh.geometry) pongInviteMesh.geometry.dispose();
    if (pongInviteMesh.material) {
      if (pongInviteMesh.material.map) pongInviteMesh.material.map.dispose();
      pongInviteMesh.material.dispose();
    }
    pongInviteMesh = null;
  }
  const cfg = COCKPIT_PONG_INVITE_PLANE;
  const rot = COCKPIT_PONG_INVITE_ROT;
  const pos = COCKPIT_PONG_INVITE_SCREEN;
  const pw = cfg.w * maxDim;
  const ph = cfg.h * maxDim;
  const eps = maxDim * 0.00055;
  const cnv = document.createElement('canvas');
  const ctx2 = cnv.getContext('2d');
  if (!ctx2) return;
  initCockpitHiDpiCanvas2d(cnv, ctx2, PONG_INVITE_CANVAS.w, PONG_INVITE_CANVAS.h);
  const map = new THREE.CanvasTexture(cnv);
  if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
  map.premultiplyAlpha = true;
  if (renderer) {
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
  }
  applyCockpitCanvasTextureFilter(map);
  const geo = new THREE.PlaneGeometry(pw, ph);
  const mat = createCockpitUiFaceMaterial(map);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'cockpitPongInvite3d';
  mesh.userData.actionId = 'pongInvite';
  mesh.userData._ctx = ctx2;
  mesh.userData._map = map;
  mesh.position.set(pos.x * maxDim, pos.y * maxDim + eps, pos.z * maxDim);
  mesh.rotation.set(rot.x, rot.y, rot.z);
  mesh.userData._uiBasePos = mesh.position.clone();
  mesh.userData._uiHoverZMax = Math.min(pw, ph) * COCKPIT_UI_HOVER_Z_FRAC;
  modelRoot.add(mesh);
  pongInviteMesh = mesh;
  ensurePongInviteLangListener();
  drawPongInviteCanvas(mesh);
}

function ensurePongInviteLangListener() {
  if (_pongInviteLangListener) return;
  _pongInviteLangListener = true;
  window.addEventListener('bgs-pro-ui-strings', e => {
    const d = e.detail;
    if (!d || d.pongInvite == null) return;
    pongInviteLabelText = String(d.pongInvite);
    syncPongInviteTexture();
  });
}

/* BIO: Implementation note for this section. */
function drawAboutBackCanvas(mesh) {
  if (!mesh || !mesh.userData || !mesh.userData._ctx) return;
  const ctx = mesh.userData._ctx;
  const hov = mesh.userData._uiHoverF || 0;
  const c = COCKPIT_ABOUT_BACK.canvas;
  drawFittedActionLabel(ctx, c.w, c.h, aboutBackLabelText, false, hov);
  if (mesh.userData._map) mesh.userData._map.needsUpdate = true;
}

function syncAboutBackTexture() {
  if (!aboutBackMesh) return;
  drawAboutBackCanvas(aboutBackMesh);
}

function addCockpitAboutBackButton(modelRoot, maxDim) {
  if (aboutBackMesh) {
    if (aboutBackMesh.parent) aboutBackMesh.parent.remove(aboutBackMesh);
    if (aboutBackMesh.geometry) aboutBackMesh.geometry.dispose();
    if (aboutBackMesh.material) {
      if (aboutBackMesh.material.map) aboutBackMesh.material.map.dispose();
      aboutBackMesh.material.dispose();
    }
    aboutBackMesh = null;
  }
  const cfg = COCKPIT_ABOUT_BACK;
  const pw = cfg.plane.w * maxDim;
  const ph = cfg.plane.h * maxDim;
  const cnv = document.createElement('canvas');
  cnv.width = cfg.canvas.w;
  cnv.height = cfg.canvas.h;
  const ctx = cnv.getContext('2d');
  if (!ctx) return;
  const map = new THREE.CanvasTexture(cnv);
  if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
  map.premultiplyAlpha = true;
  if (renderer) {
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
  }
  const geo = new THREE.PlaneGeometry(pw, ph);
  const mat = createCockpitUiFaceMaterial(map);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'cockpitAboutBack3d';
  mesh.userData.actionId = 'diveBack';
  mesh.userData._ctx = ctx;
  mesh.userData._map = map;
  const eps = maxDim * cfg.epsYMul;
  mesh.position.set(
    cfg.screen.x * maxDim,
    cfg.screen.y * maxDim + eps,
    cfg.screen.z * maxDim
  );
  mesh.rotation.set(
    cfg.rot.x,
    cfg.rot.y,
    cfg.rot.z
  );
  mesh.userData._uiBasePos = mesh.position.clone();
  mesh.userData._uiHoverZMax = Math.min(pw, ph) * COCKPIT_UI_HOVER_Z_FRAC;
  mesh.visible = false;
  modelRoot.add(mesh);
  aboutBackMesh = mesh;
  drawAboutBackCanvas(mesh);
}

function disposeVolMeshList(arr) {
  while (arr.length) {
    const o = arr.pop();
    o.geometry.dispose();
    if (o.material.map) o.material.map.dispose();
    o.material.dispose();
  }
}

function addCockpitVolumeMesh(modelRoot, maxDim) {
  disposeVolMeshList(volSliderMeshes);
  disposeVolMeshList(volPlayerMeshes);

  const eps = maxDim * 0.00035;
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1) : 1;

  function makeMesh(part, screen, plane, rot, uiW, uiH, name) {
    const pw = plane.w * maxDim;
    const ph = plane.h * maxDim;
    const cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d', { alpha: true });
    if (!ctx) return null;
    const dpr = initCockpitHiDpiCanvas2d(cnv, ctx, uiW, uiH);
    const map = new THREE.CanvasTexture(cnv);
    if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
    map.premultiplyAlpha = true;
    map.anisotropy = aniso;
    applyCockpitCanvasTextureFilter(map);
    const geo = new THREE.PlaneGeometry(pw, ph);
    const mesh = new THREE.Mesh(geo, createCockpitUiFaceMaterial(map));
    mesh.name = name;
    mesh.userData.cockpitVolPart = part;
    mesh.userData._ctx = ctx;
    mesh.userData._map = map;
    mesh.userData._uiDpr = dpr;
    mesh.userData._uiW = uiW;
    mesh.userData._uiH = uiH;
    mesh.position.set(screen.x * maxDim, screen.y * maxDim + eps, screen.z * maxDim);
    mesh.rotation.set(rot.x, rot.y, rot.z);
    mesh.userData._uiBasePos = mesh.position.clone();
    mesh.userData._uiHoverZMax = Math.min(pw, ph) * COCKPIT_UI_HOVER_Z_FRAC;
    modelRoot.add(mesh);
    return mesh;
  }

  const mSlider = makeMesh(
    'slider',
    COCKPIT_VOL_SLIDER_SCREEN,
    COCKPIT_VOL_SLIDER_PLANE,
    COCKPIT_VOL_SLIDER_ROT,
    VOL_SLIDER_UI.w,
    VOL_SLIDER_UI.h,
    'cockpitVolSlider3d'
  );
  if (mSlider) volSliderMeshes.push(mSlider);

  if (!IS_PRO_MOBILE_VIEWPORT) {
    const mPlayer = makeMesh(
      'player',
      COCKPIT_VOL_PLAYER_SCREEN,
      COCKPIT_VOL_PLAYER_PLANE,
      COCKPIT_VOL_PLAYER_ROT,
      VOL_PLAYER_UI.w,
      VOL_PLAYER_UI.h,
      'cockpitVolPlayer3d'
    );
    if (mPlayer) volPlayerMeshes.push(mPlayer);
  }

  syncVolPanelTexture();
}

function addCockpitClockMesh(modelRoot, maxDim) {
  while (clockDisplayMeshes.length) {
    const o = clockDisplayMeshes.pop();
    o.geometry.dispose();
    if (o.material.map) o.material.map.dispose();
    o.material.dispose();
  }
  if (_clockIntervalId != null) {
    clearInterval(_clockIntervalId);
    _clockIntervalId = null;
  }

  const eps = maxDim * 0.0003;
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1) : 1;
  const p = COCKPIT_CLOCK_SCREEN;
  const plane = COCKPIT_CLOCK_PLANE;
  const rot = COCKPIT_CLOCK_ROT;
  const uiW = CLOCK_UI.w;
  const uiH = CLOCK_UI.h;
  const pw = plane.w * maxDim;
  const ph = plane.h * maxDim;

  const cnv = document.createElement('canvas');
  const ctx = cnv.getContext('2d', { alpha: true });
  if (!ctx) return;
  const dpr = initCockpitHiDpiCanvas2d(cnv, ctx, uiW, uiH);
  const map = new THREE.CanvasTexture(cnv);
  if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
  map.premultiplyAlpha = true;
  map.anisotropy = aniso;
  applyCockpitCanvasTextureFilter(map);
  const geo = new THREE.PlaneGeometry(pw, ph);
  const mesh = new THREE.Mesh(geo, createCockpitUiFaceMaterial(map));
  mesh.name = 'cockpitClock3d';
  mesh.userData.cockpitClockDisplay = true;
  mesh.userData._ctx = ctx;
  mesh.userData._map = map;
  mesh.userData._uiDpr = dpr;
  mesh.userData._uiW = uiW;
  mesh.userData._uiH = uiH;
  mesh.userData._uiHoverZMax = 0;
  mesh.position.set(p.x * maxDim, p.y * maxDim + eps, p.z * maxDim);
  mesh.rotation.set(rot.x, rot.y, rot.z);
  mesh.userData._uiBasePos = mesh.position.clone();
  modelRoot.add(mesh);
  clockDisplayMeshes.push(mesh);
  syncClockTexture();
  _clockIntervalId = window.setInterval(() => {
    requestAnimationFrame(syncClockTexture);
  }, 1000);
  if (!_clockLangListenerBound) {
    _clockLangListenerBound = true;
    window.addEventListener('bgs-pro-apply-lang', () => {
      requestAnimationFrame(syncClockTexture);
    });
  }
}

function drawWelcomeTitleCanvas2d() {
  if (!welcomeTitleMesh || !welcomeTitleMesh.userData._ctx) return;
  const ctx = welcomeTitleMesh.userData._ctx;
  const w = welcomeTitleMesh.userData._uiW || WELCOME_TITLE_CANVAS.w;
  const h = welcomeTitleMesh.userData._uiH || WELCOME_TITLE_CANVAS.h;
  const isMb = IS_PRO_MOBILE_VIEWPORT;
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const yShift = h * WELCOME_CANVAS_SHIFT_Y;
  const yTop = h * 0.028 + yShift;
  const gapAfterLogo = h * 0.006;
  const gapSubHint = h * (isMb ? 0.102 : 0.085);
  const maxLogoH = h * (isMb ? 0.52 : WELCOME_LOGO_MAX_H_FRAC);
  const maxLogoW = w * WELCOME_LOGO_MAX_W_FRAC;

  let logoDrawH = 0;
  if (welcomeLogoImg && welcomeLogoImg.naturalWidth > 0) {
    const iw = welcomeLogoImg.naturalWidth;
    const ih = welcomeLogoImg.naturalHeight;
    /* BIO: Implementation note for this section. */
    let drawW = Math.min(maxLogoW, iw);
    let drawH = (ih / iw) * drawW;
    if (drawH > maxLogoH) {
      drawH = maxLogoH;
      drawW = (iw / ih) * drawH;
    }
    if (drawW > maxLogoW) {
      drawW = maxLogoW;
      drawH = (ih / iw) * drawW;
    }
    logoDrawH = drawH;
    ctx.drawImage(
      welcomeLogoImg,
      w * 0.5 - drawW * 0.5,
      yTop,
      drawW,
      drawH
    );
  }

  const logoAnchorY =
    logoDrawH > 0
      ? yTop + logoDrawH * WELCOME_LOGO_TEXT_ANCHOR_FRAC
      : yTop + h * 0.18;
  let yAfterLogo = logoAnchorY + (logoDrawH > 0 ? gapAfterLogo : h * (isMb ? 0.05 : 0.04));

  const subWt = isMb ? '600' : '400';
  const subMaxFs = isMb ? 40 : 28;
  const subMinFs = isMb ? 22 : 14;
  let subFs = isMb ? 34 : 22;
  for (let fs = subMaxFs; fs >= subMinFs; fs -= 1) {
    ctx.font = `${subWt} ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(welcomeStrings.sub).width <= w * 0.92) {
      subFs = fs;
      break;
    }
  }
  const ySub = yAfterLogo + subFs * 0.42;
  ctx.font = `${subWt} ${subFs}px "Share Tech Mono", Consolas, monospace`;
  ctx.fillStyle = 'rgba(0,245,255,0.94)';
  if (isMb) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 1;
  }
  ctx.fillText(welcomeStrings.sub, w * 0.5, ySub);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const hintWt = isMb ? '600' : '400';
  const hintLine = `\u21BB  ${welcomeStrings.hint}  \u21BA`;
  const hintMaxFs = isMb ? 34 : 26;
  const hintMinFs = isMb ? 19 : 12;
  let hintFs = isMb ? 30 : 19;
  for (let fs = hintMaxFs; fs >= hintMinFs; fs -= 1) {
    ctx.font = `${hintWt} ${fs}px "Share Tech Mono", Consolas, monospace`;
    if (ctx.measureText(hintLine).width <= w * 0.95) {
      hintFs = fs;
      break;
    }
  }
  const yHint = ySub + subFs * 0.64 + gapSubHint;
  ctx.font = `${hintWt} ${hintFs}px "Share Tech Mono", Consolas, monospace`;
  ctx.fillStyle = 'rgba(0,245,255,0.88)';
  if (isMb) {
    ctx.shadowColor = 'rgba(0,0,0,0.42)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
  }
  ctx.fillText(hintLine, w * 0.5, yHint);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const clickLine = welcomeStrings.hint2 || '';
  const clickWt = isMb ? '500' : '400';
  let clickFs = hintFs;
  if (clickLine) {
    const clickMaxFs = isMb ? 30 : 24;
    const clickMinFs = isMb ? 16 : 12;
    for (let fs = clickMaxFs; fs >= clickMinFs; fs -= 1) {
      ctx.font = `${clickWt} ${fs}px "Share Tech Mono", Consolas, monospace`;
      if (ctx.measureText(clickLine).width <= w * 0.95) {
        clickFs = fs;
        break;
      }
    }
    const yClick = yHint + hintFs * 0.6 + h * (isMb ? 0.038 : 0.032);
    ctx.font = `${clickWt} ${clickFs}px "Share Tech Mono", Consolas, monospace`;
    ctx.fillStyle = 'rgba(0,245,255,0.82)';
    if (isMb) {
      ctx.shadowColor = 'rgba(0,0,0,0.38)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;
    }
    ctx.fillText(clickLine, w * 0.5, yClick);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  const map = welcomeTitleMesh.userData._map;
  if (map) map.needsUpdate = true;
}

function ensureWelcomeStringListeners() {
  if (_welcomeStringListener) return;
  _welcomeStringListener = true;
  window.addEventListener('bgs-pro-ui-strings', e => {
    const d = e.detail;
    if (!d) return;
    if (d.welcomeSub) welcomeStrings.sub = d.welcomeSub;
    if (d.welcomeHint) welcomeStrings.hint = d.welcomeHint;
    if (d.welcomeHint2) welcomeStrings.hint2 = d.welcomeHint2;
    requestAnimationFrame(drawWelcomeTitleCanvas2d);
  });
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(drawWelcomeTitleCanvas2d));
  }
}

function ensureWelcomeDismissListener() {
  if (_welcomeDismissListener) return;
  _welcomeDismissListener = true;
  window.addEventListener('bgs-pro-welcome-dismiss', () => {
    if (welcomeTitleMesh && welcomeTitleMesh.userData) {
      welcomeTitleMesh.userData.dismissing = true;
    }
  });
}

function addCockpitWelcomeTitleMesh(modelRoot, maxDim) {
  if (welcomeTitleMesh) {
    modelRoot.remove(welcomeTitleMesh);
    welcomeTitleMesh.geometry.dispose();
    if (welcomeTitleMesh.material.map) welcomeTitleMesh.material.map.dispose();
    welcomeTitleMesh.material.dispose();
    welcomeTitleMesh = null;
  }

  const eps = maxDim * 0.0004;
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1) : 1;
  const p = COCKPIT_WELCOME_SCREEN;
  const plane = COCKPIT_WELCOME_PLANE;
  const rot = COCKPIT_WELCOME_ROT;
  const logical = getWelcomeTitleLogicalSize();
  const uiW = logical.w;
  const uiH = logical.h;
  const pw =
    plane.w * maxDim * (IS_PRO_MOBILE_VIEWPORT ? WELCOME_MOBILE_PLANE_MUL.w : 1);
  const ph =
    plane.h * maxDim * (IS_PRO_MOBILE_VIEWPORT ? WELCOME_MOBILE_PLANE_MUL.h : 1);

  const cnv = document.createElement('canvas');
  const ctx = cnv.getContext('2d', { alpha: true });
  if (!ctx) return;
  initWelcomeTitleHiDpiCanvas2d(cnv, ctx, uiW, uiH);
  const map = new THREE.CanvasTexture(cnv);
  if ('colorSpace' in map) map.colorSpace = THREE.SRGBColorSpace;
  map.premultiplyAlpha = true;
  map.anisotropy = aniso;
  applyCockpitCanvasTextureFilter(map);
  const geo = new THREE.PlaneGeometry(pw, ph);
  const mat = createCockpitWelcomeMaterial(map);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'cockpitWelcomeTitle3d';
  mesh.userData.cockpitWelcomeTitle = true;
  mesh.userData._ctx = ctx;
  mesh.userData._map = map;
  mesh.userData._uiW = uiW;
  mesh.userData._uiH = uiH;
  mesh.userData.fade = 0;
  mesh.userData.dismissing = false;
  mesh.userData.dismissingT = 0;
  mesh.userData.dismissed = false;
  mesh.userData._opSnap = null;
  mesh.renderOrder = 8;
  mesh.position.set(p.x * maxDim, p.y * maxDim + eps, p.z * maxDim);
  mesh.rotation.set(rot.x, rot.y, rot.z);
  modelRoot.add(mesh);
  welcomeTitleMesh = mesh;
  ensureWelcomeStringListeners();
  ensureWelcomeDismissListener();
  ensureWelcomeLogoImage();
  drawWelcomeTitleCanvas2d();
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function addCockpitStickerDecals(modelRoot, maxDim) {
  _cockpitBioLogoDecalMesh = null;
  _cockpitFrogDecalMesh = null;
  _cockpitOrpetronSotdDecalMesh = null;
  _cockpitAwwwardsNomineeDecalMesh = null;
  _cockpitDesignNomineesDecalMesh = null;
  while (_cockpitStickerDecalMeshes.length) {
    const o = _cockpitStickerDecalMeshes.pop();
    if (o.parent) o.parent.remove(o);
    o.geometry.dispose();
    if (o.material.map) o.material.map.dispose();
    o.material.dispose();
  }
  const aniso =
    renderer && renderer.capabilities?.getMaxAnisotropy
      ? Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1)
      : 1;
  const eps = maxDim * 0.0008;
  const mk = (key, url, spec) => {
    loadProRgbTexturePreferKtx2(
      url,
      tex => {
        if (typeof tex.anisotropy !== 'undefined') {
          tex.anisotropy = aniso;
        }
        const img = tex.image;
        const iw = img && img.width ? img.width : 1;
        const ih = img && img.height ? img.height : 1;
        const pw = spec.widthMul * maxDim;
        const ph = pw * (ih / iw);
        const geo = new THREE.PlaneGeometry(pw, ph);
        const mat = createCockpitUiFaceMaterial(tex);
        /* BIO: Implementation note for this section. */
        if (key === 'frog') {
          mat.color.setScalar(0.6);
        }
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'cockpitStickerDecal_' + key;
        /* BIO: Logo is display-only (no cockpit raycasts); frog + 枚d眉l 莽谋kartmalar谋 pickable (hover, tooltip, outbound link). */
        if (key === 'logo') {
          mesh.raycast = function () {
            /* BIO: Implementation note for this section. */
          };
        }
        if (key === 'frog') {
          _cockpitFrogDecalMesh = mesh;
        }
        if (key === 'orpetronSotd') {
          _cockpitOrpetronSotdDecalMesh = mesh;
          mat.color.set(0xffffff);
          mesh.userData.orpetronSotdUrl = COCKPIT_ORPETRON_SOTD_PAGE_URL;
        }
        if (key === 'awwwardsNominee') {
          _cockpitAwwwardsNomineeDecalMesh = mesh;
          mat.color.set(0xffffff);
          mesh.userData.awwwardsNomineeUrl = COCKPIT_AWWWARDS_NOMINEE_PAGE_URL;
        }
        if (key === 'designNominees') {
          _cockpitDesignNomineesDecalMesh = mesh;
          mat.color.set(0xffffff);
          mesh.userData.designNomineesUrl = COCKPIT_DESIGN_NOMINEES_PAGE_URL;
        }
        if (key === 'logo') {
          _cockpitBioLogoDecalMesh = mesh;
          mat.color.set(0xffffff);
          try {
            syncBioLogoStickerTint();
          } catch (_e) {}
        }
        mesh.position.set(
          spec.pos.x * maxDim,
          spec.pos.y * maxDim + eps,
          spec.pos.z * maxDim
        );
        mesh.rotation.set(spec.rot.x, spec.rot.y, spec.rot.z);
        /* BIO: 脰d眉l 莽谋kartmas谋 hover 鈥?_uiBasePos position.set SONRAs谋 kaydedilir; aksi halde (0,0,0)a yap谋艧谋r. */
        if (key === 'orpetronSotd' || key === 'awwwardsNominee' || key === 'designNominees') {
          mesh.userData._uiBasePos = mesh.position.clone();
          mesh.userData._uiHoverZMax = 0;
          mesh.userData._cockpitStickerHoverScale = 0.06;
        }
        /* BIO: alphaTest pikseli gizler; Raycaster d眉z d枚rtgende 莽arpar 鈥?raster/KTX d眉艧眉艧眉nde UV elips. */
        if (key === 'frog' || key === 'orpetronSotd' || key === 'awwwardsNominee' || key === 'designNominees') {
          const rasterOk = cacheCockpitStickerPickRaster(mesh, tex);
          if (
            (key === 'orpetronSotd' || key === 'awwwardsNominee' || key === 'designNominees') &&
            !rasterOk
          ) {
            mesh.userData._stickerEllipseR2 = COCKPIT_ORPETRON_STICKER_UV_ELLIPSE_R2;
          }
          installCockpitStickerAlphaAwareRaycast(mesh);
        }
        modelRoot.add(mesh);
        _cockpitStickerDecalMeshes.push(mesh);
      },
      undefined,
      () => {
        /* BIO: Audio, SFX, and mini-player behavior note. */
      }
    );
  };
  mk('logo', COCKPIT_STICKER_LOGO_URL, COCKPIT_STICKER_DECALS.logo);
  mk('frog', COCKPIT_STICKER_FROG_URL, COCKPIT_STICKER_DECALS.frog);
  mk('orpetronSotd', COCKPIT_STICKER_ORPETRON_SOTD_URL, COCKPIT_STICKER_DECALS.orpetronSotd);
  mk(
    'awwwardsNominee',
    COCKPIT_STICKER_AWWWARDS_NOMINEE_URL,
    COCKPIT_STICKER_DECALS.awwwardsNominee
  );
  mk(
    'designNominees',
    COCKPIT_STICKER_DESIGN_NOMINEES_URL,
    COCKPIT_STICKER_DECALS.designNominees
  );
}

function raycastClockDisplayHit(clientX, clientY) {
  if (!camera || !renderer || clockDisplayMeshes.length === 0) return false;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return false;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  return _ray.intersectObjects(clockDisplayMeshes, false).length > 0;
}

function volSliderHitFromCanvas(cx, cy) {
  const L = volSliderLayouts;
  const inR = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  if (inR(L.icon, cx, cy)) return 'icon';
  if (inR(L.blocks, cx, cy)) return 'blocks';
  if (inR(L.pct, cx, cy)) return 'pct';
  return 'none';
}

function volPlayerHitFromCanvas(cx, cy) {
  const L = volPlayerLayouts;
  const inR = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  if (inR(L.prev, cx, cy)) return 'prev';
  if (inR(L.play, cx, cy)) return 'play';
  if (inR(L.next, cx, cy)) return 'next';
  if (inR(L.progress, cx, cy)) return 'progress';
  return 'none';
}

function volHitFromPartCanvas(cx, cy, part) {
  if (part === 'slider') return volSliderHitFromCanvas(cx, cy);
  if (part === 'player') return volPlayerHitFromCanvas(cx, cy);
  return 'none';
}

function projectToVolMeshCanvas(clientX, clientY, mesh) {
  if (!camera || !renderer || !mesh || !mesh.geometry || !mesh.geometry.parameters) return null;
  const uiW = mesh.userData._uiW;
  const uiH = mesh.userData._uiH;
  if (!uiW || !uiH) return null;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  const pw = mesh.geometry.parameters.width;
  const ph = mesh.geometry.parameters.height;
  mesh.getWorldPosition(_vol3dWorldPt);
  mesh.getWorldQuaternion(_vol3dQuat);
  _vol3dNormal.set(0, 0, 1).applyQuaternion(_vol3dQuat);
  _vol3dPlane.setFromNormalAndCoplanarPoint(_vol3dNormal, _vol3dWorldPt);
  if (!_ray.ray.intersectPlane(_vol3dPlane, _vol3dWorldPt)) return null;
  mesh.worldToLocal(_vol3dWorldPt);
  const uu = (_vol3dWorldPt.x + pw * 0.5) / pw;
  const vv = (_vol3dWorldPt.y + ph * 0.5) / ph;
  if (uu < 0 || uu > 1 || vv < 0 || vv > 1) return null;
  const cx = uu * uiW;
  const cy = (1 - vv) * uiH;
  return { cx, cy, hit: null, mesh, part: mesh.userData.cockpitVolPart };
}

function pickVolPanelCanvasXY(clientX, clientY, allowPlaneFallback, meshForPlane) {
  const list = allVolUiMeshes();
  if (!camera || !renderer || list.length === 0) return null;
  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  _ndc.set(x, y);
  _ray.setFromCamera(_ndc, camera);
  const thit = _ray.intersectObjects(list, false)[0];
  if (thit && thit.uv) {
    const m = thit.object;
    const uiW = m.userData._uiW;
    const uiH = m.userData._uiH;
    const cx = thit.uv.x * uiW;
    const cy = (1 - thit.uv.y) * uiH;
    const part = m.userData.cockpitVolPart;
    return { cx, cy, hit: thit, mesh: m, part };
  }
  if (!allowPlaneFallback) return null;
  const mesh = meshForPlane || list[0];
  if (!mesh) return null;
  return projectToVolMeshCanvas(clientX, clientY, mesh);
}

function volNormFromSliderCanvasX(cx) {
  const b = volSliderLayouts.blocks;
  return Math.max(0, Math.min(1, (cx - b.x) / b.w));
}

function seekNormFromPlayerCanvasX(cx) {
  const p = volPlayerLayouts.progress;
  return Math.max(0, Math.min(1, (cx - p.x) / p.w));
}

function bindCockpitVol3dPointerIfNeeded() {
  if (_vol3dEventBound) return;
  if (!renderer || !renderer.domElement) return;
  _vol3dEventBound = true;
  const c = renderer.domElement;
  c.addEventListener('selectstart', e => e.preventDefault(), { capture: true });
  c.addEventListener('dragstart', e => e.preventDefault(), { capture: true });
  c.addEventListener('pointerdown', onCockpitVol3dPointerDown, true);
  window.addEventListener('pointermove', onCockpitVol3dPointerMove, { passive: true, capture: true });
  window.addEventListener('pointerup', onCockpitVol3dPointerUp, { passive: true, capture: true });
  window.addEventListener('pointercancel', onCockpitVol3dPointerUp, { passive: true, capture: true });
  c.addEventListener(
    'wheel',
    e => {
      if (!document.body.classList.contains('cockpit-3d-active')) return;
      if (raycastClockDisplayHit(e.clientX, e.clientY)) return;
      const p = pickVolPanelCanvasXY(e.clientX, e.clientY, false);
      if (!p || p.part !== 'slider') return;
      const h = volHitFromPartCanvas(p.cx, p.cy, 'slider');
      if (h === 'none' || h === 'pct') return;
      e.preventDefault();
      const api = window.bgsProCockpitApi;
      if (!api || !api.getSnapshot) return;
      const v0 = api.getSnapshot().vol || 0;
      if (e.deltaY < 0) api.setVolume(Math.min(1, v0 + 0.04));
      else api.setVolume(Math.max(0, v0 - 0.04));
    },
    { passive: false, capture: true }
  );
}

function resetVol3dPointerState() {
  _vol3dDown = false;
  _vol3dSeek = false;
  _vol3dBlocks = false;
  _vol3dActiveMesh = null;
  _vol3dTapMode = 'none';
  _vol3dPtrId = -1;
  _vol3dTapDownT = 0;
}

function onCockpitVol3dPointerDown(e) {
  if (e.button !== 0) return;
  if (!e.isPrimary) return;
  if (isPointerOverChrome(e.clientX, e.clientY)) return;
  if (raycastClockDisplayHit(e.clientX, e.clientY)) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  const p = pickVolPanelCanvasXY(e.clientX, e.clientY, false);
  if (!p) return;
  const part = p.part;
  if (!part) return;
  const api = window.bgsProCockpitApi;
  if (!api) return;
  const hit = volHitFromPartCanvas(p.cx, p.cy, part);
  if (part === 'slider' && (hit === 'none' || hit === 'pct')) return;
  if (part === 'player' && hit === 'none') return;
  e.preventDefault();
  e.stopPropagation();
  _vol3dPtrId = e.pointerId;
  _vol3dDown = true;
  _vol3dActiveMesh = p.mesh;
  _vol3dTapX = e.clientX;
  _vol3dTapY = e.clientY;
  if (part === 'slider' && hit === 'blocks') {
    _vol3dTapDownT = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    _vol3dBlocks = true;
    _vol3dTapMode = 'none';
    api.volNormFromClientX3d(volNormFromSliderCanvasX(p.cx));
    syncVolPanelTexture();
    if (typeof api.playVolRadioDragSfx === 'function') api.playVolRadioDragSfx();
    return;
  }
  if (part === 'player' && hit === 'progress') {
    _vol3dTapDownT = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    _vol3dSeek = true;
    _vol3dTapMode = 'none';
    api.mpSeekRatio(seekNormFromPlayerCanvasX(p.cx));
    syncVolPanelTexture();
    return;
  }
  if (part === 'slider' && hit === 'icon') {
    _vol3dTapMode = 'icon';
    _vol3dTapDownT = performance.now();
  } else if (part === 'player' && (hit === 'prev' || hit === 'play' || hit === 'next')) {
    _vol3dTapMode = hit;
    _vol3dTapDownT = performance.now();
  } else {
    _vol3dTapMode = 'none';
    _vol3dTapDownT = 0;
  }
  _vol3dBlocks = false;
  _vol3dSeek = false;
}

function onCockpitVol3dPointerMove(e) {
  if (!_vol3dDown) return;
  if (_vol3dPtrId >= 0 && e.pointerId !== _vol3dPtrId) return;
  if (!_vol3dBlocks && !_vol3dSeek) return;
  const api = window.bgsProCockpitApi;
  if (!api) return;
  let p = pickVolPanelCanvasXY(e.clientX, e.clientY, false);
  if (p) {
    if (_vol3dBlocks && p.part !== 'slider' && _vol3dActiveMesh) {
      p = projectToVolMeshCanvas(e.clientX, e.clientY, _vol3dActiveMesh);
    } else if (_vol3dSeek && p.part !== 'player' && _vol3dActiveMesh) {
      p = projectToVolMeshCanvas(e.clientX, e.clientY, _vol3dActiveMesh);
    }
  } else if (_vol3dActiveMesh) {
    p = projectToVolMeshCanvas(e.clientX, e.clientY, _vol3dActiveMesh);
  }
  if (p) {
    if (_vol3dBlocks) {
      api.volNormFromClientX3d(volNormFromSliderCanvasX(p.cx));
    } else if (_vol3dSeek) {
      api.mpSeekRatio(seekNormFromPlayerCanvasX(p.cx));
    } else {
      return;
    }
    syncVolPanelTexture();
  }
}

function onCockpitVol3dPointerUp(e) {
  if (!_vol3dDown) return;
  if (_vol3dPtrId >= 0 && e.pointerId !== _vol3dPtrId) return;
  const api = window.bgsProCockpitApi;
  releaseVol3dPointerIfAny(e);
  const wasSeek = _vol3dSeek;
  const wasBlocks = _vol3dBlocks;
  const mode = _vol3dTapMode;
  const tapT0 = _vol3dTapDownT;
  const dx = e.clientX - _vol3dTapX;
  const dy = e.clientY - _vol3dTapY;
  const moved = Math.hypot(dx, dy) > 8;
  resetVol3dPointerState();
  if (!api) return;
  if (wasBlocks && typeof api.stopVolRadioDragSfx === 'function') api.stopVolRadioDragSfx();
  if (moved && (wasSeek || wasBlocks)) return;
  if (mode && mode !== 'none' && !moved) {
    if (tapT0 > 0 && performance.now() - tapT0 > VOL3D_TAP_MAX_MS) return;
    if (mode === 'icon') api.toggleMute();
    else if (mode === 'prev') {
      playProButtonClickSfx();
      api.mpClickPrev();
    } else if (mode === 'play') {
      playProButtonClickSfx();
      api.mpToggle();
    } else if (mode === 'next') {
      playProButtonClickSfx();
      api.mpNext();
    }
    syncVolPanelTexture();
  }
}

function releaseVol3dPointerIfAny(e) {
  const c = renderer && renderer.domElement;
  if (c) {
    try {
      c.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }
}

function injectProLangToolbarFallback() {
  const host = document.getElementById('pro-lang-fallback');
  if (host) {
    host.innerHTML = '';
    for (const code of ['tr', 'en', 'de']) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tb-lang';
      btn.dataset.lang = code;
      btn.textContent = code === 'de' ? '中文' : code.toUpperCase();
      host.appendChild(btn);
    }
    host.removeAttribute('hidden');
  }
  let chrome = document.getElementById('pro-fallback-chrome');
  if (!chrome) {
    chrome = document.createElement('div');
    chrome.id = 'pro-fallback-chrome';
    document.body.appendChild(chrome);
  }
  chrome.innerHTML = '';
  const mk = (act, uik) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pro-fb-row-btn';
    b.setAttribute('data-fallback-action', act);
    b.setAttribute('data-fallback-ui', uik);
    return b;
  };
  chrome.appendChild(mk('default', 'default'));
  chrome.appendChild(mk('map', 'map'));
  chrome.classList.add('is-visible');
  window.dispatchEvent(new Event('bgs-pro-apply-lang'));
}

function failFallback(wrap, img) {
  if (!wrap) {
    window.dispatchEvent(new CustomEvent('procockpit3dready', { detail: { mode: 'no-wrap' } }));
    return;
  }
  teardownProLandscapeGate();
  stopProDeviceOrientationListening();
  _proGyroLookActive = false;
  setProMobileCenterLookLock(false);
  try {
    const cl = typeof document !== 'undefined' ? document.getElementById('bgs-pro-center-look-wrap') : null;
    if (cl && cl.parentNode) cl.parentNode.removeChild(cl);
  } catch (_cl) {}
  wrap.dataset.cockpit3d = 'fallback';
  wrap.innerHTML = '';
  wrap.style.display = 'none';
  if (img) img.style.visibility = '';
  document.body.classList.add('cockpit-3d-unavailable');
  injectProLangToolbarFallback();
  window.dispatchEvent(new CustomEvent('procockpit3dready', { detail: { mode: 'fallback' } }));
}

function succeed(wrap, img) {
  wrap.dataset.cockpit3d = 'ready';
  if (img) {
    img.style.visibility = 'hidden';
    img.style.pointerEvents = 'none';
  }
  document.body.classList.add('cockpit-3d-active');
  initProMobileCockpitUi();
  if (window.__proEntrySequenceRan) {
    if (window.gsap) {
      window.gsap.to(wrap, { opacity: 1, duration: 1.4, ease: 'power1.out' });
    } else {
      wrap.style.opacity = '1';
    }
  }
  window.dispatchEvent(new CustomEvent('procockpit3dready', { detail: { mode: '3d' } }));
}

/* BIO: Merge static GLTF meshes that share one material + render state to cut draw calls; skips skinned, multi-material, morph, instanced. */
function mergeCockpitGltfStaticMeshes(root) {
  if (!root || !root.isObject3D) return;
  root.updateWorldMatrix(true, true);
  const rootInv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const rel = new THREE.Matrix4();

  const buckets = new Map();

  root.traverse(child => {
    if (!child.isMesh || child.isSkinnedMesh || child.isInstancedMesh) return;
    const mesh = child;
    const mat = mesh.material;
    if (!mat || Array.isArray(mat)) return;
    const geo = mesh.geometry;
    if (!geo || !geo.attributes || !geo.attributes.position) return;
    if (geo.morphAttributes && Object.keys(geo.morphAttributes).length) return;

    const key = [
      mat.uuid,
      mesh.visible ? '1' : '0',
      String(mesh.renderOrder),
      String(mesh.layers.mask),
      mesh.castShadow ? 'c1' : 'c0',
      mesh.receiveShadow ? 'r1' : 'r0'
    ].join('|');

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { material: mat, meshes: [], geoms: [] };
      buckets.set(key, bucket);
    }
    bucket.meshes.push(mesh);

    const g = geo.clone();
    mesh.updateWorldMatrix(true, false);
    rel.multiplyMatrices(rootInv, mesh.matrixWorld);
    g.applyMatrix4(rel);
    bucket.geoms.push(g);
  });

  for (const bucket of buckets.values()) {
    if (bucket.geoms.length < 2) {
      for (const g of bucket.geoms) g.dispose();
      continue;
    }

    let mergedGeom;
    try {
      mergedGeom = mergeGeometries(bucket.geoms);
    } catch (_) {
      for (const g of bucket.geoms) g.dispose();
      continue;
    }
    for (const g of bucket.geoms) g.dispose();

    const first = bucket.meshes[0];
    const mergedMesh = new THREE.Mesh(mergedGeom, bucket.material);
    mergedMesh.name = `cockpitMerged_${bucket.material.uuid.slice(0, 8)}`;
    mergedMesh.castShadow = first.castShadow;
    mergedMesh.receiveShadow = first.receiveShadow;
    mergedMesh.visible = first.visible;
    mergedMesh.renderOrder = first.renderOrder;
    mergedMesh.layers.mask = first.layers.mask;
    mergedMesh.frustumCulled = first.frustumCulled;

    const geoCounts = new Map();
    for (const mesh of bucket.meshes) {
      const id = mesh.geometry.uuid;
      geoCounts.set(id, (geoCounts.get(id) || 0) + 1);
    }

    root.add(mergedMesh);

    for (const mesh of bucket.meshes) {
      const parent = mesh.parent;
      if (parent) parent.remove(mesh);
      const gid = mesh.geometry.uuid;
      const left = (geoCounts.get(gid) || 0) - 1;
      geoCounts.set(gid, left);
      if (left === 0 && mesh.geometry && typeof mesh.geometry.dispose === 'function') {
        mesh.geometry.dispose();
      }
    }
  }
}

function syncCockpitCanvasAriaLabel() {
  const c = renderer && renderer.domElement;
  if (!c) return;
  let lang = 'tr';
  try {
    const h = document.documentElement && document.documentElement.getAttribute('lang');
    if (h && h.length >= 2) lang = h.slice(0, 2).toLowerCase();
  } catch (_e) {
    /* BIO: yutulur */
  }
  c.setAttribute(
    'aria-label',
    COCKPIT_CANVAS_ARIA_BY_LANG[lang] || COCKPIT_CANVAS_ARIA_BY_LANG.tr
  );
}

function bindProA11ySkipLink() {
  if (typeof document === 'undefined') return;
  const a = document.querySelector('a.skip-link[href^="#"]');
  if (!a || a.dataset.proSkipBound === '1') return;
  const href = a.getAttribute('href');
  const id = href && href.charAt(0) === '#' ? href.slice(1) : '';
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  a.dataset.proSkipBound = '1';
  a.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      try {
        target.focus({ preventScroll: true });
      } catch (_err) {
        target.focus();
      }
    });
  });
}

async function init() {
  const wrap = document.getElementById('cockpit-3d-wrap');
  const img = document.getElementById('cockpit-img');
  if (!wrap) {
    window.dispatchEvent(new CustomEvent('procockpit3dready', { detail: { mode: 'no-wrap' } }));
    return;
  }

  bindProA11ySkipLink();
  setupCockpitMobileRafObservers(wrap);

  reduceMotion =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(CLEAR_COLOR);
  camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.01, 800);

  pivot = new THREE.Group();
  scene.add(pivot);

  renderer = new THREE.WebGLRenderer({
    antialias: !IS_PRO_MOBILE_VIEWPORT,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(CLEAR_COLOR, 1);
  renderer.setPixelRatio(proMobilePerfRendererDpr());
  renderer.setSize(window.innerWidth, window.innerHeight);
  if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  renderer.toneMapping = IS_PRO_MOBILE_VIEWPORT
    ? THREE.LinearToneMapping
    : THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = RENDER_EXPOSURE;
  renderer.domElement.className = 'cockpit-3d-canvas';
  renderer.domElement.setAttribute('role', 'img');
  wrap.appendChild(renderer.domElement);
  annotateProMobThreeCanvasForOffscreen(renderer);
  syncCockpitCanvasAriaLabel();
  window.addEventListener('bgs-pro-apply-lang', syncCockpitCanvasAriaLabel);
  css3dRenderer = new CSS3DRenderer();
  css3dRenderer.setSize(window.innerWidth, window.innerHeight);
  {
    const d = css3dRenderer.domElement;
    d.style.position = 'absolute';
    d.style.inset = '0';
    d.style.pointerEvents = 'none';
    d.style.zIndex = '5';
    d.classList.add('cockpit-3d-css3d');
    wrap.appendChild(d);
  }
  bindCockpitVol3dPointerIfNeeded();
  renderer.domElement.addEventListener('contextmenu', ev => ev.preventDefault());
  /* BIO: Implementation note for this section. */
  if (!_langPointerDownBound) {
    _langPointerDownBound = true;
    const cnv = renderer.domElement;
    cnv.addEventListener('click', onCockpitUiClick);
    cnv.addEventListener('auxclick', onCockpitUiAuxclick);
    cnv.addEventListener('pointerleave', () => {
      _cockpitUiHoverObject = null;
    });
  }

  ensureProMobileKtx2Loader();
  await yieldProMobileStartupSlice();

  const ambient = new THREE.AmbientLight(0x9eb8dc, AMBIENT_INTENSITY);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(HEMI_SKY, HEMI_GROUND, HEMI_INTENSITY);
  hemi.position.set(0, 1, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xfff5e8, DIR_MAIN_INTENSITY);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  const fill = new THREE.DirectionalLight(0xb8d4ff, DIR_FILL_INTENSITY);
  fill.position.set(-4, 2, -2);
  scene.add(fill);

  const loader = new GLTFLoader();
  /* BIO: cockpit-optimized.glb requires meshopt + KHR_mesh_quantization, so the decoder is attached before loading. */
  loader.setMeshoptDecoder(MeshoptDecoder);

  await yieldProMobileStartupSlice();

  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load(GLB_URL, resolve, undefined, reject);
    });

    const root = gltf.scene;
    pivot.add(root);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    root.position.add(MODEL_EXTRA_OFFSET);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const dist = maxDim * 0.35;
    camera.near = Math.max(0.02, dist * 0.012);
    camera.far = Math.max(600, dist * 80);

    /* BIO: Implementation note for this section. */
    const eyeY = size.y * CAMERA_EYE_FRAC;
    const camX = maxDim * CAMERA_SIDE_FRAC;
    const camZ = maxDim * CAMERA_SHIFT_Z_FRAC;
    const lookX = camX - maxDim * LOOK_DEPTH_FRAC;
    let posX = camX;
    if (IS_PRO_MOBILE_VIEWPORT) {
      posX -= maxDim * PRO_MOBILE_CAMERA_FORWARD_FRAC;
    }
    camera.position.set(posX, eyeY, camZ);
    /* BIO: Implementation note for this section. */
    camera.lookAt(lookX, eyeY, camZ);
    camera.updateProjectionMatrix();

    mergeCockpitGltfStaticMeshes(root);

    await yieldProMobileStartupSlice();

    addCockpitStarfield(scene, maxDim);

    await yieldProMobileStartupSlice();

    addCockpitUfo(scene, maxDim);

    await yieldProMobileStartupSlice();

    addCockpitShootingStar(scene, maxDim);

    await yieldProMobileStartupSlice();

    addProScrollPlanetsToScene(pivot, maxDim);

    await yieldProMobileStartupSlice();

    initProScrollInput();

    await yieldProMobileStartupSlice();
    if (typeof window !== 'undefined' && window.bgsProCockpitApi) {
      window.bgsProCockpitApi.scrollToMainPlanet = scrollCarouselToMainPlanet;
      window.bgsProCockpitApi.getCarouselMainPlanetIndex = getCarouselMainPlanetIndex;
      window.bgsProCockpitApi.forceExitProSubInstant = forceExitProSubInstant;
    }
    await yieldProMobileStartupSlice();
    addCockpitLangMeshButtons(root, maxDim);
    addCockpitToolbarMeshButtons(root, maxDim);
    if (!IS_PRO_MOBILE_VIEWPORT) addCockpitPongInviteButton(root, maxDim);
    addCockpitVolumeMesh(root, maxDim);
    addCockpitClockMesh(root, maxDim);
    addCockpitAboutBackButton(root, maxDim);
    addCockpitWelcomeTitleMesh(root, maxDim);
    addCockpitStickerDecals(root, maxDim);

    await yieldProMobileStartupSlice();

    if (!_volDisplayListener) {
      _volDisplayListener = true;
      const q = () => requestAnimationFrame(syncVolPanelTexture);
      window.addEventListener('bgs-pro-vol-display', q);
      if (!IS_PRO_MOBILE_VIEWPORT) {
        window.addEventListener('bgs-pro-mp-display', q);
      }
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEndCockpitUi, { passive: true });
    window.addEventListener('resize', onResize);

    warmCockpitRenderer();
    succeed(wrap, img);
    if (!IS_PRO_MOBILE_VIEWPORT) {
      animate();
    } else {
      kickCockpitMobileAnimateChain();
    }
  } catch (err) {
    console.warn('[cockpit-3d] GLB not loaded, using WebP fallback:', err?.message || err);
    if (renderer && renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    if (renderer) renderer.dispose();
    renderer = null;
    scene = null;
    camera = null;
    pivot = null;
    failFallback(wrap, img);
  }
}

init().catch(err => {
  console.warn('[cockpit-3d] init error:', err);
  failFallback(document.getElementById('cockpit-3d-wrap'), document.getElementById('cockpit-img'));
});
