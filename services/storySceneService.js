// Moving, scene-specific vector illustrations. Coordinates are a 1000 x 1000
// stage; the video compositor positions this stage above the narration captions.
const C = { sky: "#173e42", leaf: "#91bc72", light: "#f5f0d9", soil: "#714934", dark: "#142e2a", amber: "#f1c48a", blue: "#a0d4cf" };
const { createCanvas } = require("canvas");
const { drawSystemScene } = require("./systemSceneService");
let distantTree;
const clamp = p => Math.max(0, Math.min(1, p));
const ease = p => { p = clamp(p); return p * p * (3 - 2 * p); };
function disk(c, x, y, r, color) { c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
function ellipse(c, x, y, rx, ry, color, rotation = 0) { c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); c.fill(); }
function stroke(c, points, color, width = 5) {
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
  points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
}
function label(c, value, x, y, color = C.light, size = 25) {
  c.font = `bold ${size}px Arial`; c.textAlign = "center";
  c.strokeStyle = "rgba(18,40,36,0.8)"; c.lineWidth = 4; c.lineJoin = "round"; c.strokeText(value, x, y);
  c.fillStyle = color; c.fillText(value, x, y);
}
function arrow(c, from, to, color = C.amber) {
  stroke(c, [from, to], color, 5);
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  stroke(c, [[to[0] - Math.cos(a - 0.6) * 18, to[1] - Math.sin(a - 0.6) * 18], to, [to[0] - Math.cos(a + 0.6) * 18, to[1] - Math.sin(a + 0.6) * 18]], color, 5);
}
function leaf(c, x, y, size, rotation = 0, color = C.leaf) {
  c.save(); c.translate(x, y); c.rotate(rotation);
  const light = c.createLinearGradient(-size, 0, size, -size * 1.9);
  light.addColorStop(0, "#28594b"); light.addColorStop(0.48, color); light.addColorStop(1, "#b7cc83"); c.fillStyle = light;
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-size, -size, 0, -size * 1.9); c.quadraticCurveTo(size, -size, 0, 0); c.fill();
  stroke(c, [[0, 0], [0, -size * 1.6]], "rgba(232,237,181,0.6)", 1.8);
  for (let i = 1; i < 6; i++) for (const sign of [-1, 1]) {
    const yy = -size * i * 0.27;
    stroke(c, [[0, yy], [sign * size * Math.sin(i / 6 * Math.PI) * 0.45, yy - size * 0.24]], "rgba(228,232,171,0.24)", 1);
  } c.restore();
}
function plant(c, x, y, size = 1, time = 0) {
  c.save(); c.translate(x, y); c.scale(size, size);
  const sway = Math.sin(time * 1.3 + x) * 8;
  stroke(c, [[0, 0], [sway, -170]], "#8bbd68", 10);
  leaf(c, sway / 2, -60, 55, -0.9); leaf(c, sway / 2, -100, 48, 0.9); leaf(c, sway, -165, 45, 0.15);
  c.restore();
}
function flower(c, x, y, s = 1, time = 0) {
  plant(c, x, y, s, time); c.save(); c.translate(x, y - 180 * s);
  for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7; ellipse(c, Math.cos(a) * 25 * s, Math.sin(a) * 25 * s, 16 * s, 28 * s, "#ffa987", a); }
  disk(c, 0, 0, 20 * s, "#ffe3a0"); c.restore();
}
function tree(c, x, y, s = 1, time = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const bark = c.createLinearGradient(-24, 0, 24, 0); bark.addColorStop(0, "#3d4234"); bark.addColorStop(0.6, "#786b48"); bark.addColorStop(1, "#b19b65");
  c.fillStyle = bark; c.beginPath(); c.moveTo(-31, 0); c.lineTo(-13, -310); c.lineTo(8, -315); c.lineTo(27, 0); c.closePath(); c.fill();
  for (let i = 0; i < 7; i++) {
    const sign = i % 2 ? 1 : -1, yy = -100 - i * 27;
    stroke(c, [[0, yy + 35], [sign * (45 + i * 5), yy - 40], [sign * (70 + i * 6), yy - 80]], "#71694b", 7 - i * 0.5);
  }
  for (let i = 0; i < 30; i++) {
    const xx = Math.sin(i * 2.399) * (45 + i % 5 * 14) + Math.sin(time * 0.7 + i) * 2;
    const yy = -215 - Math.cos(i * 1.7) * 60 - i % 4 * 18;
    const radius = 23 + i % 4 * 8;
    const g = c.createRadialGradient(xx - radius * 0.3, yy - radius * 0.6, 2, xx, yy, radius);
    g.addColorStop(0, ["#9eaf72", "#7a9665", "#668a62"][i % 3]); g.addColorStop(1, ["#345b49", "#456e50", "#305647"][i % 3]);
    disk(c, xx, yy, radius, g);
  }
  for (let i = 0; i < 5; i++) stroke(c, [[-10 + i * 6, -10], [-8 + i * 5 + Math.sin(i) * 3, -180]], "rgba(219,195,137,0.17)", 1.3);
  c.restore();
}
function forestTree(c, x, y, s) {
  if (!distantTree) {
    distantTree = createCanvas(320, 420);
    tree(distantTree.getContext("2d"), 160, 410, 1, 0);
  }
  c.drawImage(distantTree, x - 160 * s, y - 410 * s, 320 * s, 420 * s);
}
function world(c, t, { ground = 620, underground = false, night = false } = {}) {
  const sky = c.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, night ? "#101f3b" : "#123c43"); sky.addColorStop(0.55, night ? "#263c50" : "#578c82"); sky.addColorStop(1, night ? "#354c5b" : "#c0c398");
  c.fillStyle = sky; c.fillRect(0, 0, 1000, 1000);
  const sunY = Math.min(140, ground * 0.48);
  const glow = c.createRadialGradient(820, sunY, 10, 820, sunY, 260);
  glow.addColorStop(0, "rgba(255,219,158,0.38)"); glow.addColorStop(1, "rgba(255,219,158,0)");
  disk(c, 820, sunY, 260, glow); disk(c, 820, sunY, 40, night ? "#c8d9dc" : "#f1d5a1");
  c.save(); c.globalAlpha = 0.055; c.fillStyle = "#f4e6bb";
  for (let i = 0; i < 4; i++) {
    c.beginPath(); c.moveTo(790 + i * 24, 0); c.lineTo(210 + i * 120, ground); c.lineTo(300 + i * 125, ground); c.lineTo(820 + i * 24, 0); c.fill();
  } c.restore();
  for (let i = 0; i < 6; i++) {
    const x = ((i * 257 + t * 6) % 1200) - 100;
    ellipse(c, x, 170 + (i % 3) * 45, 115, 22, "rgba(227,246,225,0.12)");
  }
  c.fillStyle = "#376653"; c.beginPath(); c.moveTo(0, ground);
  for (let x = 0; x <= 1000; x += 20) c.lineTo(x, ground - 100 + Math.sin(x / 190) * 55);
  c.lineTo(1000, ground + 100); c.lineTo(0, ground + 100); c.fill();
  for (let layer = 0; layer < 2; layer++) {
    c.save(); c.globalAlpha = layer ? 0.4 : 0.18;
    for (let i = 0; i < 12; i++) {
      const xx = ((i * 109 - t * (layer + 1) * 2) % 1200 + 1200) % 1200 - 100;
      forestTree(c, xx, ground - (layer ? 25 : 75), 0.32 + i % 4 * 0.065);
    } c.restore();
  }
  const soil = c.createLinearGradient(0, ground, 0, 1000); soil.addColorStop(0, "#885b3e"); soil.addColorStop(1, "#3d2d29");
  c.fillStyle = soil; c.fillRect(0, ground, 1000, 1000 - ground);
  for (let i = 0; i < 210; i++) {
    const x = (i * 163) % 1000, y = ground + 15 + ((i * 71) % Math.max(1, 970 - ground));
    ellipse(c, x, y, 1 + i % 5, 1 + i % 3, i % 3 ? "rgba(198,163,109,0.28)" : "rgba(29,30,25,0.35)", i);
  }
  stroke(c, [[0, ground], [1000, ground]], "#adc875", 12);
  if (!underground) for (let i = 0; i < 36; i++) {
    const x = i * 29, h = 12 + i % 5 * 5;
    stroke(c, [[x, ground], [x + Math.sin(t * 1.8 + i) * 6, ground - h]], "#a5c274", 3);
  }
  for (let i = 0; i < 12; i++) {
    const xx = (i * 193 + 73) % 1000, yy = ground + 25 + i % 3 * 18;
    ellipse(c, xx, yy, 12 + i % 4 * 6, 4 + i % 3 * 3, "rgba(22,32,28,0.22)");
    if (!underground && i % 2) leaf(c, xx, yy, 12 + i % 3 * 4, i * 0.6, "#9a9864");
  }
}
function ant(c, x, y, size = 1, time = 0, alpha = 1) {
  c.save(); c.globalAlpha *= clamp(alpha); c.translate(x, y); c.scale(size, size);
  ellipse(c, -6, 29, 64, 9, "rgba(9,21,18,0.24)");
  for (let i = 0; i < 3; i++) for (const sign of [-1, 1]) {
    const step = Math.sin(time * 13 + i * 2 + (sign + 1) * 1.7) * 7;
    stroke(c, [[-12 + i * 13, -2], [-22 + i * 20 + step, sign * 18], [-28 + i * 21 + step, sign * 29]], "#241e1c", 4);
  }
  const shell = c.createLinearGradient(0, -30, 0, 14); shell.addColorStop(0, "#e5ba78"); shell.addColorStop(0.32, "#aa673b"); shell.addColorStop(0.75, "#6d3d29"); shell.addColorStop(1, "#382a21");
  ellipse(c, -30, -8, 27, 19, shell); ellipse(c, 4, -9, 14, 11, shell); ellipse(c, 29, -12, 16, 14, shell, -0.15);
  for (let i = 0; i < 3; i++) stroke(c, [[-40 + i * 9, -24], [-38 + i * 9, 8]], "rgba(40,28,20,0.32)", 1);
  ellipse(c, -36, -20, 12, 3, "rgba(255,230,184,0.45)", -0.1);
  disk(c, 34, -18, 3.5, "#121c22"); disk(c, 35, -19, 1.1, "#f2e6c7");
  stroke(c, [[41, -7], [48, -2], [50, -8]], "#30241b", 2);
  stroke(c, [[34, -25], [42, -42], [54, -43]], "#35271e", 2.2);
  stroke(c, [[24, -25], [23, -39], [32, -48]], "#35271e", 3);
  c.restore();
}
function seed(c, x, y, s = 1) {
  ellipse(c, x, y, 11 * s, 18 * s, "#f2cc7d", 0.5);
  stroke(c, [[x - 3 * s, y + 10 * s], [x + 4 * s, y - 10 * s]], "#b2864a", 2 * s);
}
function worm(c, x, y, t, s = 1) {
  const points = Array.from({ length: 35 }, (_, i) => [x + (i - 17) * 5 * s, y + Math.sin(i * 0.25 - t * 3) * 15 * s]);
  stroke(c, points, "#d89e95", 16 * s);
  for (let i = 2; i < 33; i += 3) disk(c, points[i][0], points[i][1], 3 * s, "#aa746c");
}
function mushroom(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const stem = c.createLinearGradient(-13, 0, 13, 0); stem.addColorStop(0, "#a69a76"); stem.addColorStop(0.6, "#e7d7ac"); stem.addColorStop(1, "#c3af83");
  stroke(c, [[0, 0], [6, -105]], stem, 19);
  const cap = c.createLinearGradient(0, -155, 0, -86); cap.addColorStop(0, "#e0a36d"); cap.addColorStop(0.55, "#bc7350"); cap.addColorStop(1, "#734835");
  c.fillStyle = cap; c.beginPath(); c.moveTo(-74, -91); c.bezierCurveTo(-60, -166, 58, -180, 77, -91); c.quadraticCurveTo(0, -70, -74, -91); c.fill();
  ellipse(c, 1, -90, 75, 12, "#debf90");
  for (let i = -6; i <= 6; i++) stroke(c, [[6, -82], [i * 11, -93 + Math.abs(i) * 0.3]], "rgba(111,81,56,0.5)", 1.5);
  for (let i = 0; i < 12; i++) ellipse(c, Math.sin(i * 2.4) * 54, -108 - (i % 4) * 10, 3 + i % 3, 2, "rgba(255,221,170,0.55)", i);
  c.restore();
}
function bird(c, x, y, s = 1, t = 0, flying = false) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (flying) {
    const wing = Math.sin(t * 7) * 45;
    stroke(c, [[-90, -50 - wing], [-35, -10], [0, 0], [45, -10], [95, -50 - wing]], "#d3c5a1", 18);
  } else {
    stroke(c, [[-10, 25], [-20, 60], [-5, 60]], "#c1a76b", 5); stroke(c, [[20, 25], [20, 60], [35, 60]], "#c1a76b", 5);
  }
  const breast = c.createLinearGradient(-35, -40, 38, 35); breast.addColorStop(0, "#77968c"); breast.addColorStop(0.45, "#d7cfb0"); breast.addColorStop(1, "#a78a65");
  c.fillStyle = "#355f5d"; c.beginPath(); c.moveTo(-35, 5); c.lineTo(-92, -38); c.lineTo(-75, 10); c.lineTo(-40, 22); c.fill();
  ellipse(c, 0, 0, 49, 35, breast); ellipse(c, -13, -6, 32, 22, "#62887e", -0.4);
  for (let i = 0; i < 6; i++) stroke(c, [[-35 + i * 5, -14], [-15 + i * 5, 11]], "rgba(216,222,184,0.45)", 1.8);
  disk(c, 43, -31, 25, "#a8bba2"); ellipse(c, 44, -22, 20, 12, "#d9d1b1");
  stroke(c, [[27, -38], [47, -42], [64, -35]], "#345a53", 6);
  disk(c, 51, -36, 4.5, "#112d2b"); disk(c, 52, -37, 1.5, "#ffefce");
  c.fillStyle = "#d9ad70"; c.beginPath(); c.moveTo(62, -32); c.lineTo(87, -25); c.lineTo(62, -18); c.fill();
  stroke(c, [[65, -25], [83, -25]], "#8e714a", 1);
  c.restore();
}
function caterpillar(c, x, y, s, t) {
  for (let i = 0; i < 7; i++) {
    const xx = x + i * 12 * s, yy = y + Math.sin(i - t * 4) * 5 * s;
    stroke(c, [[xx, yy], [xx - 3 * s, yy + 13 * s]], "#4a6342", 2 * s);
    const g = c.createRadialGradient(xx - 2 * s, yy - 5 * s, 0, xx, yy, 11 * s); g.addColorStop(0, "#d9e4a2"); g.addColorStop(1, "#6b8e4f");
    disk(c, xx, yy, 10 * s, g); disk(c, xx + 2 * s, yy + 2 * s, 1.6 * s, "#577143");
  }
  disk(c, x + 74 * s, y - 4 * s, 12 * s, "#d3ed9c"); disk(c, x + 78 * s, y - 7 * s, 2 * s, "#273e27");
}

function antScene(c, shot, t, p) {
  switch (shot.kind) {
    case "ant-world": {
      world(c, t); tree(c, 100, 620, 1.4, t); plant(c, 840, 620, 1.2, t); flower(c, 650, 620, 0.8, t);
      const vanish = 1 - ease((p - 0.25) / 0.45);
      for (let i = 0; i < 6; i++) ant(c, (i * 180 + t * 55) % 1100 - 50, 580 + (i % 3) * 28, 0.55, t + i, vanish);
      ant(c, 320 + p * 300, 740, 3.2, t, vanish);
      for (let i = 0; i < 20; i++) {
        c.save(); c.globalAlpha = Math.sin(clamp((p - 0.2) / 0.65) * Math.PI) * 0.65;
        disk(c, 360 + p * 300 + Math.sin(i * 2.4) * (20 + p * 120), 720 - p * 160 + Math.cos(i * 2.4) * 35, 2 + i % 3, C.amber); c.restore();
      }
      break;
    }
    case "ant-tunnels": {
      world(c, t, { ground: 240, underground: true }); plant(c, 800, 240, 0.8, t);
      c.strokeStyle = "#2b2422"; c.lineWidth = 66; c.lineCap = "round"; c.beginPath();
      c.moveTo(210, 240); c.bezierCurveTo(200, 420, 510, 380, 470, 610); c.bezierCurveTo(420, 820, 770, 750, 780, 950); c.stroke();
      c.beginPath(); c.moveTo(435, 460); c.bezierCurveTo(590, 430, 710, 500, 810, 540); c.stroke();
      const chamber = c.createRadialGradient(470, 640, 5, 470, 640, 100); chamber.addColorStop(0, "#18201c"); chamber.addColorStop(0.85, "#352920"); chamber.addColorStop(1, "#80573c");
      ellipse(c, 470, 635, 100, 55, chamber); ellipse(c, 810, 540, 90, 50, "#2b2422");
      for (let i = 0; i < 12; i++) disk(c, 100 + (i * 83) % 820, 280 + (t * 20 + i * 71) % 620, 2, "rgba(240,211,170,0.35)");
      stroke(c, [[800, 240], [770, 350], [850, 420]], "#b8aa78", 7); stroke(c, [[770, 350], [700, 390]], "#b8aa78", 4);
      break;
    }
    case "ant-seeds": {
      world(c, t, { ground: 620 }); plant(c, 100, 620, 1.35, t); plant(c, 600, 620, 1.35, t);
      stroke(c, [[500, 100], [500, 900]], "rgba(230,250,214,0.35)", 3);
      const move = (t * 0.28) % 1, xx = 120 + move * 280;
      ant(c, xx, 660, 2.1, t); seed(c, xx + 95, 640, 2.1);
      for (let i = 0; i < 5; i++) seed(c, 570 + i * 18, 640 + i % 2 * 20);
      label(c, "BEFORE", 250, 270, C.light, 35); label(c, "WITHOUT ANTS", 750, 270, C.amber, 35);
      arrow(c, [100, 780], [410, 780]); label(c, "SEEDS CARRIED", 250, 850, C.light, 25);
      stroke(c, [[610, 780], [890, 780]], "#b6aa8c", 4);
      label(c, "ONE ROUTE LOST", 750, 850, C.amber, 25);
      break;
    }
    case "ant-predators": {
      world(c, t, { ground: 700 }); tree(c, 880, 700, 1.4, t);
      const hop = Math.max(0, Math.sin(t * 3)) * 28;
      ellipse(c, 350, 735, 170, 23, "rgba(22,35,28,0.2)");
      bird(c, 330 + Math.sin(t * 0.8) * 75, 590 - hop, 3.2, t);
      c.save(); c.globalAlpha = 0.25; ant(c, 700, 690, 1.5, t, 1); c.restore();
      stroke(c, [[640, 620], [760, 750]], "#f3ba88", 8); stroke(c, [[760, 620], [640, 750]], "#f3ba88", 8);
      break;
    }
    case "ant-pests": {
      world(c, t, { ground: 850 });
      const stems = [[260, 850, 2.4], [650, 850, 2.7]];
      for (const [x, y, s] of stems) plant(c, x, y, s, t);
      const count = 1 + Math.floor(ease(p) * 4);
      for (let i = 0; i < count; i++) {
        const x = i % 2 ? 590 : 210, y = 420 + Math.floor(i / 2) * 140;
        c.save(); c.globalAlpha = clamp((p * 5 - i + 1) * 2); caterpillar(c, x + Math.sin(t + i) * 10, y, 1.3, t + i); c.restore();
      }
      break;
    }
    case "ant-habitats": {
      world(c, t, { ground: 690 }); tree(c, 170, 690, 1.4, t); tree(c, 340, 690, 0.8, t);
      for (let i = 0; i < 7; i++) plant(c, 600 + i * 55, 690, 0.3 + i % 3 * 0.2, t + i);
      stroke(c, [[500, 120], [500, 880]], "rgba(238,255,213,0.4)", 4);
      worm(c, 210 + Math.sin(t) * 20, 825, t); mushroom(c, 340, 710, 0.5);
      label(c, "FOREST", 250, 270, C.light, 35); label(c, "GRASSLAND", 750, 270, C.light, 35);
      break;
    }
    case "ant-decomposers": {
      world(c, t, { ground: 360, underground: true }); mushroom(c, 170, 360, 1.5);
      plant(c, 800, 360, 1.3, t);
      stroke(c, [[800, 360], [730, 620], [850, 820]], "#baa67b", 12);
      stroke(c, [[740, 590], [630, 700], [570, 740]], "#baa67b", 7);
      worm(c, 320 + Math.sin(t * 0.5) * 70, 650, t, 1.4);
      for (let i = 0; i < 18; i++) {
        const a = t * 0.4 + i * 2.3;
        ellipse(c, 540 + Math.cos(a) * (80 + i * 6), 610 + Math.sin(a) * (60 + i * 5), 9, 4, "#d6d789", a);
      }
      for (let i = 0; i < 5; i++) {
        const u = ((t * 0.22 + i * 0.2) % 1);
        disk(c, 430 + u * 300, 780 - u * 200, 4, C.amber);
      }
      label(c, "FUNGI", 170, 180, C.light, 31); label(c, "WORMS", 260, 780, C.light, 31); label(c, "BACTERIA", 650, 800, C.light, 31);
      break;
    }
  }
}

function genericScene(c, shot, t, p, actor) {
  const changing = shot.stage > 0 && shot.stage < 3;
  const removed = /disappear|extinct|vanish|lost|stop/i.test(shot.passage);
  switch (shot.kind) {
    case "pollination": {
      world(c, t); flower(c, 170, 700, 1.8, t); flower(c, 790, 700, 1.8, t + 1);
      const fly = (t * 0.2) % 1, alpha = changing && removed ? 1 - ease(p) : 1;
      c.save(); c.globalAlpha = alpha; actor(c, /bee|bat|bird|insect|mosquito/.test(shot.subject) ? shot.subject : "bees", 200 + fly * 580, 300 - Math.sin(fly * Math.PI) * 120, 0.65, t); c.restore();
      for (let i = 0; i < 9; i++) disk(c, 210 + ((fly + i * 0.07) % 1) * 550, 340 + Math.sin(t + i) * 35, 5, "#ffdb83");
      label(c, changing && removed ? "POLLINATION DISRUPTED" : "POLLEN MOVES BETWEEN FLOWERS", 500, 860, C.light, 28);
      break;
    }
    case "soil-cycle": {
      world(c, t, { ground: 330, underground: true }); plant(c, 750, 330, 1.3, t);
      mushroom(c, 200, 330, 1.1); worm(c, 350 + Math.sin(t) * 40, 650, t, 1.5);
      for (let i = 0; i < 5; i++) stroke(c, [[750, 330], [700 + i * 15, 490], [540 + i * 90, 820]], "#c8b48a", 5);
      for (let i = 0; i < 18; i++) { const u = (t * 0.1 + i / 18) % 1; disk(c, 300 + u * 430, 780 - u * 270, 4, C.amber); }
      label(c, "ROOTS, SOIL & NUTRIENT CYCLING", 500, 940, C.light, 28);
      break;
    }
    case "oxygen": {
      if (shot.topicId === 59 || shot.topicId === 48 || shot.topicId === 47 || shot.topicId === 58) {
        world(c, t, { night: true }); actor(c, shot.subject, 760, 320, 1.6, t); actor(c, "person", 300, 600, 2.5, t);
        label(c, "AIR + PRESSURE + LIFE SUPPORT", 500, 850, C.amber, 28);
      } else {
        world(c, t, { ground: 760 }); plant(c, 250, 760, 2, t);
        c.fillStyle = "#265b80"; c.fillRect(500, 520, 500, 480);
        for (let i = 0; i < 12; i++) disk(c, 550 + (i * 77) % 400, 610 + (i * 53) % 300, 5, C.leaf);
        for (let i = 0; i < 9; i++) {
          const u = (t * 0.2 + i / 9) % 1, x = i % 2 ? 230 : 730;
          c.save(); c.globalAlpha = changing && removed ? 0.25 : 1;
          label(c, "O2", x + Math.sin(i) * 80, 520 - u * 340, C.blue, 24); c.restore();
        }
        label(c, "PRODUCTION IS NOT THE SAME AS STORED OXYGEN", 500, 940, C.light, 23);
      }
      break;
    }
    case "food-web": {
      world(c, t, { ground: 780 });
      actor(c, shot.subject, 240 + Math.sin(t * 2) * 25, 520, 1.5, t);
      bird(c, 720, 500 - Math.max(0, Math.sin(t * 3)) * 35, 1.9, t);
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.3 + i / 4) % 1;
        c.save(); c.globalAlpha = changing && removed ? 1 - ease(p) : 1;
        disk(c, 340 + u * 290, 500 - Math.sin(u * Math.PI) * 60, 8, C.amber); c.restore();
      }
      label(c, "A CHANGE IN ONE FOOD SOURCE", 500, 220, C.light, 30);
      break;
    }
    case "habitat": {
      world(c, t); tree(c, 180, 620, 1.5, t); tree(c, 820, 620, 1.3, t);
      c.save(); c.globalAlpha = changing && removed ? 1 - ease(p) : 1;
      actor(c, shot.subject, 450 + Math.sin(t) * 70, 570, 1.65, t); c.restore();
      bird(c, (t * 65) % 1200 - 100, 220, 0.8, t, true); plant(c, 700, 620, 0.7, t);
      label(c, "HABITAT & ECOLOGICAL ROLES", 500, 850, C.light, 29);
      break;
    }
    case "climate": {
      world(c, t, { ground: 680 }); tree(c, 150, 680, 1.15, t);
      const drought = /dry|drought|stopped|stops|declin|shortage/i.test(shot.passage);
      const level = changing ? (drought ? 800 + p * 130 : 920 - p * 200) : 800;
      c.fillStyle = "#30798c"; c.fillRect(500, level, 500, 1000 - level);
      for (let i = 0; i < 15; i++) {
        const yy = ((t * 190 + i * 71) % 600);
        c.save(); c.globalAlpha = changing && drought ? 1 - p : 0.6;
        stroke(c, [[480 + i * 33, yy], [470 + i * 33, yy + 30]], "#9bcbd8", 3); c.restore();
      }
      if (/ice|melt/i.test(shot.passage)) {
        const s = changing ? 1 - p * 0.4 : 1;
        c.fillStyle = "#d8ece5"; c.beginPath(); c.moveTo(650, 770); c.lineTo(720, 770 - 300 * s); c.lineTo(820, 770); c.fill();
      }
      label(c, "SCHEMATIC CHANGE — NOT A FORECAST", 500, 940, C.light, 25);
      break;
    }
    case "orbit": {
      c.fillStyle = "#0b1d33"; c.fillRect(0, 0, 1000, 1000);
      for (let i = 0; i < 70; i++) disk(c, (i * 137) % 1000, (i * 73) % 1000, 1 + i % 2, "#80999d");
      const subjectSun = /sun|black hole/.test(shot.subject);
      const center = subjectSun ? shot.subject : "Earth";
      c.save(); c.globalAlpha = changing && removed && (shot.topicId === 41 || shot.topicId === 26) ? 1 - ease(p) : 1;
      actor(c, center, 500, 450, 2, shot.topicId === 21 && changing ? 0 : shot.topicId === 23 ? -t : t); c.restore();
      const a = t * 0.5;
      c.save(); c.strokeStyle = "#3b5d6a"; c.lineWidth = 4; c.beginPath(); c.ellipse(500, 450, 330, 190, 0, 0, Math.PI * 2); c.stroke(); c.restore();
      if (shot.topicId === 41 && changing) {
        actor(c, "Earth", 700 + p * 200, 350 + p * 300, 0.65, t);
      } else actor(c, subjectSun ? "Earth" : "moon", 500 + Math.cos(a) * 330, 450 + Math.sin(a) * 190, 0.65, t);
      if (shot.topicId === 25 || shot.topicId === 43) actor(c, shot.topicId === 25 ? "moon" : "sun", 200, 230, 0.7, t);
      label(c, "ILLUSTRATIVE MOTION • NOT TO SCALE", 500, 890, C.light, 25);
      break;
    }
    case "gravity": {
      world(c, t, { ground: 780 });
      const g = shot.topicId === 30 ? 0.5 : shot.topicId === 31 ? 2 : 1;
      const jump = Math.abs(Math.sin(t * Math.sqrt(g) * 1.5)) * (200 / g);
      actor(c, "person", 320, 650 - jump, 1.6, t);
      actor(c, "person", 720, 650 - Math.abs(Math.sin(t * 1.5)) * 200, 1.6, t);
      arrow(c, [320, 400], [320, 400 + 90 * g]);
      label(c, shot.topicId === 30 ? "HALF SURFACE GRAVITY" : shot.topicId === 31 ? "DOUBLE SURFACE GRAVITY" : "CHANGED CONDITIONS", 300, 900, C.amber, 23);
      label(c, "REFERENCE", 720, 900, C.light, 25);
      break;
    }
    case "scale": {
      world(c, t, { ground: 830 });
      for (let i = 0; i < 8; i++) stroke(c, [[100, 180 + i * 80], [140, 180 + i * 80]], "#bdd4b3", 4);
      stroke(c, [[100, 180], [100, 830]], "#bdd4b3", 5);
      actor(c, shot.subject, 580, 590, changing ? 1.2 + ease(p) * (shot.topicId === 75 ? -0.6 : 1.2) : 1.2, t);
      actor(c, "person", 250, 700, 1, t);
      label(c, "SIZE CHANGES THE DESIGN PROBLEM", 500, 940, C.light, 26);
      break;
    }
    case "body": {
      world(c, t, { night: true, ground: 840 }); actor(c, "person", 500, 580, 3.2, t);
      const brain = /brain|memory|thought|sleep|hear|see|vision|pain/i.test(shot.passage);
      const yy = brain ? 420 : 650;
      for (let i = 0; i < 7; i++) {
        const a = i * Math.PI * 2 / 7;
        const x = 500 + Math.cos(a) * 220, y = yy + Math.sin(a) * 130;
        stroke(c, [[500, yy], [x, y]], "#7dafa0", 3);
        const u = (t * 0.5 + i / 7) % 1;
        disk(c, 500 + (x - 500) * u, yy + (y - yy) * u, 8, C.amber); disk(c, x, y, 10, C.blue);
      }
      label(c, "A CHANGE IN BIOLOGY", 500, 180, C.light, 34);
      break;
    }
    case "network":
    case "city": {
      c.fillStyle = "#173c4a"; c.fillRect(0, 0, 1000, 1000);
      const outage = changing && /outage|lose|stop|lost|disrupt|vanish|fail/i.test(shot.passage);
      for (let i = 0; i < 7; i++) {
        const x = i * 150, h = 220 + i % 3 * 100;
        c.fillStyle = "#294f58"; c.fillRect(x, 800 - h, 125, h);
        for (let j = 0; j < 12; j++) {
          c.fillStyle = outage && j / 12 < p ? "#1a353e" : "#c3d48b";
          c.fillRect(x + 15 + j % 3 * 34, 820 - h + Math.floor(j / 3) * 48, 17, 24);
        }
      }
      c.fillStyle = "#243f43"; c.fillRect(0, 800, 1000, 200);
      for (let i = 0; i < 5; i++) {
        const x = (t * 40 + i * 240) % 1200 - 100;
        actor(c, "person", x, 850, 0.5, t + i);
      }
      if (shot.kind === "network") for (let i = 0; i < 8; i++) {
        const a = t * 0.2 + i * Math.PI / 4, u = (t * 0.4 + i / 8) % 1;
        stroke(c, [[500, 190], [150 + i * 100, 650]], "#547c80", 2);
        if (!outage || u > p) disk(c, 500 + ((150 + i * 100) - 500) * u, 190 + 460 * u, 7, C.amber);
      }
      label(c, outage ? "SERVICES LOSE THEIR CONNECTION" : "DAILY LIFE UNDER NEW RULES", 500, 130, C.light, 30);
      break;
    }
    default: throw new Error(`No animation for storyboard kind: ${shot.kind}`);
  }
}

function drawStoryScene(ctx, shot, box, time, actor) {
  const p = shot.progress;
  ctx.save(); ctx.translate(box.x, box.y);
  if (box.immersive) {
    const underground = /tunnel|decompos|soil/.test(shot.kind);
    const backdrop = ctx.createLinearGradient(0, 0, 0, box.height);
    const systems = shot.family === "systems";
    backdrop.addColorStop(0, systems ? "#10283c" : "#123c43"); backdrop.addColorStop(0.25, systems ? "#10283c" : "#123c43"); backdrop.addColorStop(0.5, systems ? "#234953" : underground ? "#80573c" : "#6b9274"); backdrop.addColorStop(1, systems ? "#0a1c29" : "#322820");
    ctx.fillStyle = backdrop; ctx.fillRect(0, 0, box.width, box.height);
    ctx.beginPath(); ctx.rect(0, 0, box.width, box.height); ctx.clip();
    const stageSize = Math.max(box.width * 1.08, box.height / 1.55);
    ctx.translate((box.width - stageSize) / 2, box.height * 0.19);
    ctx.scale(stageSize / 1000, stageSize / 1000);
  } else ctx.scale(box.width / 1000, box.height / 1000);
  ctx.beginPath(); ctx.rect(0, 0, 1000, 1000); ctx.clip();
  // A restrained moving camera complements the animated action. The action,
  // subject and setting themselves also change at each script-aligned cut.
  const zoom = 1 + ease(p) * 0.035;
  ctx.translate(500, 500); ctx.scale(zoom, zoom); ctx.translate(-500, -500);
  if (shot.family === "systems") drawSystemScene(ctx, shot, time, p);
  else if (shot.kind.startsWith("ant-")) antScene(ctx, shot, time, p);
  else genericScene(ctx, shot, time, p, actor);
  ctx.restore();
}
module.exports = { drawStoryScene };
