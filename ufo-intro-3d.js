import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const MODEL_URL = new URL('assets/pro/common/ufo-optimized.glb', import.meta.url).href;
const MODEL_SCALE = 4.7;
const INTRO_DURATION = 6.35;
let modelTemplatePromise = null;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function easeOutCubic(value) {
  const t = clamp01(value);
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(value) {
  const t = clamp01(value);
  return t * t * t;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    ));
  } catch (_) {
    return false;
  }
}

function loadModelTemplate() {
  if (modelTemplatePromise) return modelTemplatePromise;
  modelTemplatePromise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(MODEL_URL, gltf => resolve(gltf.scene), undefined, reject);
  });
  return modelTemplatePromise;
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(185,252,255,1)');
  gradient.addColorStop(0.18, 'rgba(54,236,255,.75)');
  gradient.addColorStop(0.52, 'rgba(0,163,255,.22)');
  gradient.addColorStop(1, 'rgba(0,96,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function normalizeModel(template) {
  const root = template.clone(true);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  const maxDimension = Math.max(size.x, size.y, size.z, 1e-4);
  const normalized = new THREE.Group();
  normalized.add(root);
  normalized.scale.setScalar(MODEL_SCALE / maxDimension);
  const wrapper = new THREE.Group();
  wrapper.add(normalized);

  root.traverse(object => {
    if (!object.isMesh) return;
    object.frustumCulled = false;
    object.castShadow = false;
    object.receiveShadow = false;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      material.side = THREE.DoubleSide;
      if ('metalness' in material) material.metalness = Math.max(0.72, material.metalness || 0);
      if ('roughness' in material) material.roughness = Math.min(0.34, material.roughness || 1);
      material.needsUpdate = true;
    }
  });

  return wrapper;
}

function createBeam(glowTexture) {
  const group = new THREE.Group();
  group.visible = false;

  const layers = [
    { top: 0.16, bottom: 2.25, opacity: 0.07, color: 0x00d9ff },
    { top: 0.10, bottom: 1.48, opacity: 0.10, color: 0x49efff },
    { top: 0.05, bottom: 0.58, opacity: 0.16, color: 0xc8fbff }
  ];

  for (const layer of layers) {
    const geometry = new THREE.CylinderGeometry(layer.top, layer.bottom, 5.3, 64, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color: layer.color,
      transparent: true,
      opacity: layer.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const cone = new THREE.Mesh(geometry, material);
    cone.userData.baseOpacity = layer.opacity;
    group.add(cone);
  }

  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x5df5ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const groundGlow = new THREE.Sprite(glowMaterial);
  groundGlow.position.y = -2.63;
  groundGlow.scale.set(4.5, 1.25, 1);
  group.add(groundGlow);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x79f8ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.025, 8, 96), ringMaterial);
  ring.position.y = -2.54;
  group.add(ring);

  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i += 1) {
    const y = Math.random() * 5.1 - 2.55;
    const radius = (0.18 + ((2.5 - y) / 5.05) * 1.55) * Math.sqrt(Math.random());
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.33;
    seeds[i] = Math.random();
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xbafaff,
    size: 0.045,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.userData.seeds = seeds;
  group.add(particles);

  group.userData = { glowMaterial, ringMaterial, particleMaterial, particles };
  return group;
}

function updateBeam(beam, strength, elapsed) {
  beam.visible = strength > 0.001;
  beam.scale.x = 0.76 + strength * 0.24;
  beam.scale.z = beam.scale.x;
  for (let i = 0; i < 3; i += 1) {
    const cone = beam.children[i];
    cone.material.opacity = cone.userData.baseOpacity * strength * (0.88 + Math.sin(elapsed * 12 + i) * 0.12);
  }

  const { glowMaterial, ringMaterial, particleMaterial, particles } = beam.userData;
  glowMaterial.opacity = strength * 0.74;
  ringMaterial.opacity = strength * 0.72;
  particleMaterial.opacity = strength * 0.92;
  particles.rotation.y = elapsed * 0.45;
  const positions = particles.geometry.attributes.position.array;
  const seeds = particles.userData.seeds;
  for (let i = 0; i < seeds.length; i += 1) {
    let y = positions[i * 3 + 1] + (0.014 + seeds[i] * 0.018);
    if (y > 2.52) y = -2.55;
    positions[i * 3 + 1] = y;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  beam.userData.ringMaterial.opacity = strength * (0.55 + Math.sin(elapsed * 8) * 0.17);
}

function targetAvatarRect() {
  const image = document.querySelector('.center-avatar image');
  const rect = image?.getBoundingClientRect?.();
  if (rect && rect.width > 20 && rect.height > 20) return rect;
  const width = Math.min(175, window.innerWidth * 0.24);
  const height = width * 1.34;
  return {
    left: window.innerWidth / 2 - width / 2,
    top: window.innerHeight / 2 - height * 0.58,
    width,
    height
  };
}

function createAvatarShell(photoUrl) {
  const rect = targetAvatarRect();
  const shell = document.createElement('div');
  shell.className = 'ufo-intro-avatar-shell';
  shell.style.left = `${rect.left + rect.width / 2}px`;
  shell.style.top = `${rect.top + rect.height / 2}px`;
  shell.style.width = `${rect.width}px`;
  shell.style.height = `${rect.height}px`;

  const image = document.createElement('img');
  image.src = photoUrl;
  image.alt = '';
  shell.appendChild(image);

  const scan = document.createElement('span');
  scan.className = 'ufo-intro-avatar-scan';
  shell.appendChild(scan);
  return shell;
}

function play(options = {}) {
  if (!supportsWebGL()) {
    queueMicrotask(() => options.onError?.(new Error('WebGL is unavailable')));
    return { stop() {} };
  }

  const stage = document.createElement('div');
  stage.className = 'ufo-intro-stage';
  stage.setAttribute('aria-hidden', 'true');
  const avatarShell = createAvatarShell(options.photoUrl || 'assets/default/common/zhou-avatar-image2-cutout.png');
  stage.appendChild(avatarShell);
  document.body.appendChild(stage);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    stage.remove();
    queueMicrotask(() => options.onError?.(error));
    return { stop() {} };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  renderer.domElement.className = 'ufo-intro-canvas';
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.55, 9.2);
  camera.lookAt(0, 0.4, 0);

  scene.add(new THREE.HemisphereLight(0x7feeff, 0x050713, 1.7));
  const keyLight = new THREE.DirectionalLight(0xe2fbff, 4.2);
  keyLight.position.set(-4, 6, 7);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x00cfff, 22, 18, 1.8);
  rimLight.position.set(3.5, 1.8, 3.8);
  scene.add(rimLight);
  const warmLight = new THREE.PointLight(0x6b7cff, 9, 14, 2);
  warmLight.position.set(-4, -1, 2);
  scene.add(warmLight);

  const glowTexture = createGlowTexture();
  const undersideGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x54eaff,
    transparent: true,
    opacity: 0.68,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  undersideGlow.scale.set(3.2, 1.18, 1);
  undersideGlow.position.set(0, -0.58, -0.2);

  const beam = createBeam(glowTexture);
  beam.position.set(0, -2.62, -0.38);
  scene.add(beam);

  let model = null;
  let rafId = 0;
  let stopped = false;
  let startedAt = 0;
  let previousTime = 0;
  let beamCalled = false;
  let closeCalled = false;
  let revealCalled = false;
  let departCalled = false;
  let completeCalled = false;

  function resize() {
    if (stopped) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function finish(notify = true) {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    renderer.dispose();
    glowTexture.dispose();
    stage.remove();
    if (notify && !completeCalled) {
      completeCalled = true;
      options.onComplete?.();
    }
  }

  function frame(now) {
    if (stopped || !model) return;
    const elapsed = (now - startedAt) / 1000;
    const delta = Math.min(0.05, previousTime ? (now - previousTime) / 1000 : 0);
    previousTime = now;

    if (elapsed < 1.65) {
      const p = easeOutCubic(elapsed / 1.65);
      model.position.set(
        THREE.MathUtils.lerp(-7.4, 0, p),
        THREE.MathUtils.lerp(5.0, 2.32, p) + Math.sin(p * Math.PI) * 0.38,
        THREE.MathUtils.lerp(-7.5, 0.15, p)
      );
      const scale = THREE.MathUtils.lerp(0.16, 1, p);
      model.scale.setScalar(scale);
      model.rotation.x = THREE.MathUtils.lerp(-0.28, 0.07, p);
      model.rotation.z = THREE.MathUtils.lerp(-0.52, -0.025, p);
    } else if (elapsed < 5.18) {
      const hoverTime = elapsed - 1.65;
      model.position.set(Math.sin(hoverTime * 0.72) * 0.08, 2.32 + Math.sin(hoverTime * 2.15) * 0.055, 0.15);
      model.scale.setScalar(1);
      model.rotation.x = 0.07 + Math.sin(hoverTime * 1.25) * 0.012;
      model.rotation.z = -0.025 + Math.sin(hoverTime * 1.7) * 0.018;
    } else {
      const p = easeInCubic((elapsed - 5.18) / 1.12);
      model.position.set(
        THREE.MathUtils.lerp(0, 7.8, p),
        THREE.MathUtils.lerp(2.32, 5.7, p),
        THREE.MathUtils.lerp(0.15, -8.5, p)
      );
      const scale = THREE.MathUtils.lerp(1, 0.12, p);
      model.scale.setScalar(scale);
      model.rotation.x = THREE.MathUtils.lerp(0.07, -0.32, p);
      model.rotation.z = THREE.MathUtils.lerp(-0.025, 0.62, p);
    }
    model.rotation.y += delta * 0.11;

    const beamIn = smoothstep((elapsed - 1.82) / 0.42);
    const beamOut = 1 - smoothstep((elapsed - 4.55) / 0.42);
    const beamStrength = beamIn * beamOut;
    beam.position.x = model.position.x;
    beam.position.y = model.position.y - 2.63;
    updateBeam(beam, beamStrength, elapsed);

    if (!beamCalled && elapsed >= 1.82) {
      beamCalled = true;
      stage.classList.add('is-beaming');
      options.onBeam?.();
    }
    if (!closeCalled && elapsed >= 4.55) {
      closeCalled = true;
      stage.classList.add('is-beam-closing');
      options.onClose?.();
    }
    if (!revealCalled && elapsed >= 4.82) {
      revealCalled = true;
      options.onReveal?.();
    }
    if (!departCalled && elapsed >= 5.18) {
      departCalled = true;
      options.onDepart?.();
    }

    undersideGlow.material.opacity = elapsed < 5.18
      ? 0.58 + Math.sin(elapsed * 4) * 0.08
      : Math.max(0, 0.58 * (1 - (elapsed - 5.18) / 0.75));
    renderer.render(scene, camera);

    if (elapsed >= INTRO_DURATION) {
      finish(true);
      return;
    }
    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  loadModelTemplate().then(template => {
    if (stopped) return;
    model = normalizeModel(template);
    model.add(undersideGlow);
    scene.add(model);
    startedAt = performance.now();
    previousTime = startedAt;
    options.onReady?.();
    rafId = requestAnimationFrame(frame);
  }).catch(error => {
    finish(false);
    options.onError?.(error);
  });

  return {
    stop() {
      finish(false);
    }
  };
}

window.BGS_UFO_INTRO_3D = { supported: supportsWebGL(), play };
window.dispatchEvent(new CustomEvent('bgs-ufo-3d-ready'));
