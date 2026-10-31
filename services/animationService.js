const { createCanvas } = require("canvas");
const { activeShot } = require("./storyboardService");
const { drawStoryScene } = require("./storySceneService");

const COLORS = { ink: "#edf4ff", muted: "#8ca2c3", cyan: "#69e7ff", lime: "#d7ff77", orange: "#ff9c73" };
function circle(ctx, x, y, r, color) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}
function line(ctx, points, color = COLORS.cyan, width = 5) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function text(ctx, value, x, y, size = 26, color = COLORS.ink, align = "center") {
  ctx.fillStyle = color; ctx.font = `bold ${size}px Arial`; ctx.textAlign = align; ctx.fillText(value, x, y);
}
function wrap(ctx, value, width, size) {
  ctx.font = `bold ${size}px Arial`;
  const lines = []; let current = "";
  for (const word of value.split(/\s+/)) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > width) { lines.push(current); current = word; }
    else current = test;
  }
  if (current) lines.push(current);
  return lines;
}
function title(ctx, value, x, y, width, size, maxLines = 3) {
  while (wrap(ctx, value, width, size).length > maxLines && size > 18) size -= 2;
  wrap(ctx, value, width, size).forEach((s, i) => text(ctx, s, x, y + i * size * 1.15, size));
}

// All artwork uses local paths and geometric primitives. No remote fonts or images.
function entity(ctx, subject, x, y, scale = 1, time = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  const name = subject.toLowerCase();
  if (/^(ants?|mosquitoes?|bees?|insects?|spiders?)$/.test(name)) {
    const spider = name.includes("spider");
    const bee = name.includes("bee");
    if (!spider && !name.includes("ant")) {
      ctx.save(); ctx.globalAlpha *= 0.55;
      ctx.fillStyle = COLORS.cyan;
      for (const sign of [-1, 1]) {
        ctx.beginPath(); ctx.ellipse(sign * 42, -32, 28, 55 + Math.sin(time * 16) * 9, sign * 0.7, 0, Math.PI * 2); ctx.fill();
      } ctx.restore();
    }
    for (let i = 0; i < (spider ? 4 : 3); i++) for (const sign of [-1, 1]) {
      line(ctx, [[sign * 12, i * 19 - 25], [sign * 55, i * 28 - 45], [sign * 75, i * 28 - 30 + Math.sin(time * 4 + i) * 5]], COLORS.orange, 6);
    }
    circle(ctx, 0, 28, 34, bee ? COLORS.lime : COLORS.orange);
    circle(ctx, 0, -8, 24, bee ? COLORS.lime : COLORS.orange);
    circle(ctx, 0, -40, 20, COLORS.ink);
    circle(ctx, -7, -43, 4, "#071326"); circle(ctx, 7, -43, 4, "#071326");
    if (bee) for (const yy of [10, 28, 46]) line(ctx, [[-23, yy], [23, yy]], "#17243a", 8);
  } else if (/tree|plant|sunlight/.test(name)) {
    line(ctx, [[0, 65], [0, -30]], COLORS.orange, 15);
    for (const [xx, yy] of [[-30, -20], [30, -30], [0, -55]]) circle(ctx, xx, yy, 36, COLORS.lime);
    for (const sign of [-1, 1]) line(ctx, [[0, 65], [sign * 45, 85]], COLORS.orange, 4);
  } else if (/fung/.test(name)) {
    ctx.fillStyle = COLORS.ink; ctx.fillRect(-12, -15, 24, 80);
    ctx.beginPath(); ctx.arc(0, -15, 65, Math.PI, 0); ctx.closePath(); ctx.fillStyle = COLORS.orange; ctx.fill();
    for (const [xx, yy] of [[-30, -35], [10, -55], [35, -28]]) circle(ctx, xx, yy, 8, COLORS.ink);
    for (const sign of [-1, 1]) line(ctx, [[0, 65], [sign * 45, 85], [sign * 65, 70]], COLORS.cyan, 3);
  } else if (/worm|snake/.test(name)) {
    const points = Array.from({ length: 30 }, (_, i) => [i * 6 - 85, Math.sin(i * 0.28 + time * 2) * 28]);
    line(ctx, points, COLORS.orange, 20); circle(ctx, 86, points.at(-1)[1] - 4, 4, "#071326");
  } else if (/bird|bat|wing/.test(name)) {
    const wing = Math.sin(time * 4) * 20;
    line(ctx, [[-95, -30 - wing], [-45, 0], [0, 20], [45, 0], [95, -30 - wing]], COLORS.cyan, 15);
    circle(ctx, 0, 6, 18, COLORS.ink);
  } else if (/shark|coral|plankton|ocean/.test(name)) {
    if (/coral/.test(name)) {
      for (let i = -2; i <= 2; i++) line(ctx, [[0, 65], [i * 22, 0], [i * 32, -50]], COLORS.orange, 12);
    } else if (/plankton/.test(name)) {
      for (let i = 0; i < 7; i++) circle(ctx, Math.sin(i * 3) * 65, Math.cos(i * 2) * 50, 12 + i, i % 2 ? COLORS.lime : COLORS.cyan);
    } else {
      ctx.fillStyle = COLORS.cyan; ctx.beginPath(); ctx.ellipse(0, 0, 75, 33, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-55, 0); ctx.lineTo(-100, -40); ctx.lineTo(-100, 40); ctx.closePath(); ctx.fill();
      circle(ctx, 45, -8, 5, "#071326");
    }
  } else if (/sun|suns/.test(name)) {
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + time * 0.1; line(ctx, [[Math.cos(a) * 70, Math.sin(a) * 70], [Math.cos(a) * 92, Math.sin(a) * 92]], COLORS.orange, 6); }
    circle(ctx, 0, 0, 55, COLORS.lime);
  } else if (/black hole/.test(name)) {
    ctx.strokeStyle = COLORS.orange; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.ellipse(0, 0, 95, 33, -0.2, 0, Math.PI * 2); ctx.stroke();
    circle(ctx, 0, 0, 50, "#000207");
    ctx.strokeStyle = COLORS.lime; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 54, 0, Math.PI * 2); ctx.stroke();
  } else if (/earth|moon|mars|venus|jupiter|europa|ring|ice|gravity/.test(name)) {
    const earth = /earth|gravity|ring|ice/.test(name);
    circle(ctx, 0, 0, 75, earth ? "#247ab4" : /mars|venus/.test(name) ? "#c7784f" : "#8b9eb9");
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 75, 0, Math.PI * 2); ctx.clip();
    for (let i = 0; i < 6; i++) {
      const xx = ((i * 55 + time * 9) % 195) - 100;
      ctx.fillStyle = earth ? "#91ba75" : "#63728b"; ctx.beginPath(); ctx.ellipse(xx, i * 26 - 65, 30, 15, i * 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(10, -80, 80, 160); ctx.restore();
    if (/ring/.test(name)) { ctx.strokeStyle = COLORS.orange; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(0, 0, 115, 28, -0.3, 0, Math.PI * 2); ctx.stroke(); }
  } else if (/rain/.test(name)) {
    for (const [xx, yy, rr] of [[-35, -25, 35], [0, -40, 40], [40, -20, 30]]) circle(ctx, xx, yy, rr, COLORS.muted);
    for (let i = 0; i < 5; i++) { const yy = (time * 70 + i * 19) % 75; line(ctx, [[i * 25 - 55, yy], [i * 25 - 63, yy + 18]], COLORS.cyan, 5); }
  } else if (/volcano|asteroid/.test(name)) {
    ctx.fillStyle = COLORS.muted; ctx.beginPath(); ctx.moveTo(-90, 65); ctx.lineTo(0, -45); ctx.lineTo(90, 65); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 7; i++) circle(ctx, Math.sin(i * 3 + time) * 40, -45 - ((time * 40 + i * 19) % 90), 5, COLORS.orange);
  } else if (/clock/.test(name)) {
    circle(ctx, 0, 0, 78, COLORS.cyan); circle(ctx, 0, 0, 69, "#101e35");
    line(ctx, [[0, -48], [0, 0], [Math.cos(time) * 43, Math.sin(time) * 43]], COLORS.ink, 6);
  } else if (/rocket|station|satellite/.test(name)) {
    ctx.fillStyle = COLORS.ink; ctx.fillRect(-22, -55, 44, 110);
    ctx.fillStyle = COLORS.cyan; ctx.fillRect(-95, -20, 65, 45); ctx.fillRect(30, -20, 65, 45);
    circle(ctx, 0, -15, 12, "#247ab4");
    line(ctx, [[0, 55], [0, 85 + Math.sin(time * 8) * 10]], COLORS.orange, 15);
  } else if (/phone|records|digital|AI|robot|network|identity|power|car|farm/i.test(name)) {
    ctx.strokeStyle = COLORS.cyan; ctx.lineWidth = 6; ctx.strokeRect(-55, -65, 110, 130);
    for (let i = 0; i < 3; i++) line(ctx, [[-35, i * 28 - 35], [35, i * 28 - 35]], i % 2 ? COLORS.lime : COLORS.muted, 7);
    circle(ctx, 0, 48, 6, COLORS.ink);
  } else if (/animal|dinosaur/.test(name)) {
    ctx.fillStyle = COLORS.cyan; ctx.beginPath(); ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 63, -28, 24, COLORS.ink); circle(ctx, 70, -33, 4, "#071326");
    for (const xx of [-40, -15, 20, 42]) line(ctx, [[xx, 15], [xx + Math.sin(time * 3 + xx) * 8, 65]], COLORS.cyan, 9);
    line(ctx, [[-55, 0], [-95, -35]], COLORS.cyan, 10);
  } else if (/brain|memory|thought|hearing|vision|pain|sleep|aging|lung|limb|skeleton|scale|person|navigation/.test(name)) {
    circle(ctx, 0, -50, 26, COLORS.ink); line(ctx, [[0, -20], [0, 40]], COLORS.cyan, 13);
    line(ctx, [[-48, 12], [0, -5], [48, 12 + Math.sin(time * 2) * 10]], COLORS.cyan, 10);
    line(ctx, [[-32, 85], [0, 40], [32, 85]], COLORS.cyan, 11);
    if (/brain|memory|thought/.test(name)) for (let i = 0; i < 5; i++) circle(ctx, Math.sin(i * 2) * 55, -100 + Math.cos(i * 2) * 20, 5, COLORS.lime);
  } else {
    // Abstract social concepts use an explicitly labeled connected system.
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5 + time * 0.08;
      line(ctx, [[0, 0], [Math.cos(a) * 80, Math.sin(a) * 80]], COLORS.muted, 3);
      circle(ctx, Math.cos(a) * 80, Math.sin(a) * 80, 16, COLORS.cyan);
    } circle(ctx, 0, 0, 25, COLORS.lime);
  }
  ctx.restore();
}

function drawFrame(ctx, width, height, scene, time, progress, overall = 0) {
  const vertical = height > width;
  const unit = Math.min(width, height);
  const shot = activeShot(scene, progress);
  if (vertical) {
    drawStoryScene(ctx, shot, { x: 0, y: 0, width, height, immersive: true }, time, entity);
    const shade = ctx.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, "rgba(5,18,20,0.87)"); shade.addColorStop(0.21, "rgba(5,18,20,0.35)");
    shade.addColorStop(0.36, "rgba(5,18,20,0)"); shade.addColorStop(0.64, "rgba(5,18,20,0)");
    shade.addColorStop(0.82, "rgba(5,18,20,0.79)"); shade.addColorStop(1, "rgba(5,18,20,0.96)");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, width, height);
    text(ctx, "WHAT IF", width * 0.08, height * 0.062, unit * 0.03, "#f1c48a", "left");
    text(ctx, scene.label, width * 0.92, height * 0.062, unit * 0.023, "#c6cfb8", "right");
    const headline = scene.stage === 0 ? scene.title : shot.headline.split(/\s+/).slice(0, 11).join(" ") + (shot.headline.split(/\s+/).length > 11 ? "..." : "");
    title(ctx, headline, width / 2, height * 0.125, width * 0.85, unit * 0.073, 3);
    text(ctx, "THE WHAT IF LAB", width * 0.08, height * 0.94, unit * 0.025, "#c6cfb8", "left");
    text(ctx, `${String(scene.topicId || 1).padStart(3, "0")} / 100`, width * 0.92, height * 0.94, unit * 0.025, "#c6cfb8", "right");
    ctx.fillStyle = "rgba(220,224,191,0.15)"; ctx.fillRect(width * 0.08, height * 0.96, width * 0.84, unit * 0.004);
    ctx.fillStyle = "#f1c48a"; ctx.fillRect(width * 0.08, height * 0.96, width * 0.84 * Math.max(0, Math.min(1, overall)), unit * 0.004);
    return;
  }
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#081323"); bg.addColorStop(1, "#152843"); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(140,162,195,0.07)"; ctx.lineWidth = 1;
  for (let xx = 0; xx < width; xx += unit / 9) line(ctx, [[xx, 0], [xx, height]], "rgba(140,162,195,0.07)", 1);
  text(ctx, "THE WHAT IF LAB", width * 0.08, height * 0.052, unit * 0.029, COLORS.cyan, "left");
  text(ctx, scene.label, width * 0.92, height * 0.052, unit * 0.025, COLORS.orange, "right");
  const headline = scene.stage === 0 ? scene.title : shot.headline.split(/\s+/).slice(0, 11).join(" ") + (shot.headline.split(/\s+/).length > 11 ? "..." : "");
  title(ctx, headline, width / 2, height * (vertical ? 0.115 : 0.15), width * 0.86, unit * 0.065, vertical ? 3 : 2);
  const size = vertical ? Math.min(width * 0.92, height * 0.44) : height * 0.57;
  drawStoryScene(ctx, shot, { x: (width - size) / 2, y: height * (vertical ? 0.235 : 0.27), width: size, height: size }, time, entity);
  // Reserve the lower third for narration captions, composed by FFmpeg.
  if (vertical) title(ctx, scene.title, width / 2, height * 0.87, width * 0.84, unit * 0.032, 2);
  text(ctx, "ANIMATED THOUGHT EXPERIMENT", width * 0.08, height * 0.94, unit * 0.022, COLORS.muted, "left");
  text(ctx, `${String(scene.topicId || 1).padStart(3, "0")} / 100`, width * 0.92, height * 0.94, unit * 0.023, COLORS.muted, "right");
  ctx.fillStyle = "#253952"; ctx.fillRect(width * 0.08, height * 0.96, width * 0.84, Math.max(2, unit * 0.005));
  ctx.fillStyle = COLORS.cyan; ctx.fillRect(width * 0.08, height * 0.96, width * 0.84 * Math.max(0, Math.min(1, overall)), Math.max(2, unit * 0.005));
}
function createFrameCanvas(width, height) { return createCanvas(width, height); }
module.exports = { createFrameCanvas, drawFrame, entity, title, COLORS };
