// Local editorial illustrations for banking, AI, digital life and infrastructure.
// Motion shows processes schematically; quantities and timing are not predictions.
const P = { bg: "#10283c", panel: "#1a3b50", edge: "#558795", cyan: "#8ce2df", gold: "#f2ca8b", ink: "#edf1e1", muted: "#9fb6b7", coral: "#ed9e88" };
function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
function circle(c, x, y, r, color) { c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
function path(c, points, color, width = 4) {
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
  points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
}
function label(c, value, x, y, size = 26, color = P.ink) {
  c.font = `bold ${size}px Arial`; c.textAlign = "center";
  c.strokeStyle = "#10283c"; c.lineWidth = 5; c.strokeText(value, x, y); c.fillStyle = color; c.fillText(value, x, y);
}
function arrow(c, a, b, color = P.cyan) {
  path(c, [a, b], color); const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  path(c, [[b[0] - Math.cos(angle - 0.5) * 17, b[1] - Math.sin(angle - 0.5) * 17], b, [b[0] - Math.cos(angle + 0.5) * 17, b[1] - Math.sin(angle + 0.5) * 17]], color);
}
function background(c, t) {
  const g = c.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, "#10283c"); g.addColorStop(0.65, "#234953"); g.addColorStop(1, "#0a1c29"); c.fillStyle = g; c.fillRect(0, 0, 1000, 1000);
  const light = c.createRadialGradient(700, 200, 0, 700, 200, 650); light.addColorStop(0, "rgba(134,211,197,0.13)"); light.addColorStop(1, "rgba(134,211,197,0)"); c.fillStyle = light; c.fillRect(0, 0, 1000, 1000);
  for (let i = 0; i < 13; i++) {
    const x = i * 83 - 30, h = 110 + i % 4 * 45;
    rect(c, x, 610 - h, 65, h, "rgba(26,60,74,0.7)");
    for (let j = 0; j < 6; j++) rect(c, x + 10 + j % 2 * 27, 625 - h + Math.floor(j / 2) * 34, 9, 13, "rgba(236,211,158,0.22)");
  }
  path(c, [[0, 780], [1000, 780]], "#3e626a", 2);
  for (let i = 0; i < 5; i++) circle(c, (i * 239 + t * 10) % 1000, 130 + i % 3 * 90, 2, "rgba(168,222,212,0.3)");
}
function person(c, x, y, s = 1, t = 0, color = P.gold) {
  c.save(); c.translate(x, y); c.scale(s, s); const step = Math.sin(t * 5) * 8;
  circle(c, 0, -78, 18, "#d4ad87"); path(c, [[-16, -86], [-10, -95], [8, -96], [16, -85]], "#263e43", 9);
  c.fillStyle = color; c.beginPath(); c.moveTo(-18, -54); c.quadraticCurveTo(0, -65, 18, -54); c.lineTo(23, 8); c.lineTo(-23, 8); c.fill();
  path(c, [[-12, 8], [-16 - step, 60]], "#132b3b", 13); path(c, [[12, 8], [18 + step, 60]], "#132b3b", 13);
  path(c, [[-19, -43], [-33 - step, -4]], color, 10); path(c, [[19, -43], [30 + step, -5]], color, 10);
  path(c, [[-16 - step, 60], [-30 - step, 60]], "#79918e", 7); path(c, [[18 + step, 60], [30 + step, 60]], "#79918e", 7); c.restore();
}
function bank(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = "#b0b6a2"; c.beginPath(); c.moveTo(-160, -140); c.lineTo(0, -225); c.lineTo(160, -140); c.fill();
  path(c, [[-145, -143], [0, -215], [145, -143]], "#e6d9b2", 5);
  rect(c, -150, -140, 300, 20, "#d3cdb4"); rect(c, -130, -120, 260, 180, "#2e4d54");
  for (let i = 0; i < 4; i++) {
    const xx = -115 + i * 76; const g = c.createLinearGradient(xx, 0, xx + 30, 0); g.addColorStop(0, "#839c94"); g.addColorStop(0.5, "#d0d3b9"); g.addColorStop(1, "#78928c"); rect(c, xx, -115, 28, 175, g);
    rect(c, xx - 5, -119, 38, 9, "#ded7bb"); rect(c, xx - 5, 54, 38, 10, "#d3cdb4");
  }
  rect(c, -158, 65, 316, 13, "#a5b2a1"); rect(c, -170, 78, 340, 14, "#738e87");
  label(c, "BANK", 0, -160, 26, "#244450"); c.restore();
}
function note(c, x, y, s = 1, rotation = 0) {
  c.save(); c.translate(x, y); c.rotate(rotation); c.scale(s, s);
  rect(c, -45, -25, 90, 50, "#89bba3"); c.strokeStyle = "#cee0b4"; c.lineWidth = 2; c.strokeRect(-39, -19, 78, 38);
  circle(c, 0, 0, 14, "#c9d5a6"); path(c, [[-31, 0], [-21, 0]], "#446d60", 3); path(c, [[21, 0], [31, 0]], "#446d60", 3); c.restore();
}
function document(c, x, y, s = 1, heading = "RECORD") {
  c.save(); c.translate(x, y); c.scale(s, s);
  rect(c, -68, -90, 136, 180, "#d3d5bb"); rect(c, -56, -75, 112, 32, "#a9bca4");
  label(c, heading, 0, -52, 16, "#213d42");
  for (let i = 0; i < 4; i++) path(c, [[-45, -15 + i * 24], [25 + i % 2 * 18, -15 + i * 24]], "#627e77", 5); c.restore();
}
function phone(c, x, y, s = 1, state = "PAY", t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rect(c, -79, -143, 158, 286, "#071c2b"); rect(c, -68, -123, 136, 245, "#345b65"); rect(c, -25, -134, 50, 5, "#759b9d");
  if (state === "PAY") {
    for (let i = 0; i < 49; i++) if ((i * 13 + i % 3) % 5 < 3) rect(c, -45 + i % 7 * 13, -80 + Math.floor(i / 7) * 13, 10, 10, "#d8e7c8");
    label(c, "PAY", 0, 74, 20, P.gold);
  } else {
    circle(c, 0, -20, 35, "#1c414c"); path(c, [[-15, -35], [15, -5]], P.coral, 5); path(c, [[15, -35], [-15, -5]], P.coral, 5);
    label(c, state, 0, 65, 15, P.gold);
  }
  circle(c, 0, 132, 6, "#6b9699"); c.restore();
}
function chip(c, x, y, s, t, dim = false) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 5; i++) for (const sign of [-1, 1]) {
    path(c, [[sign * 70, -48 + i * 24], [sign * 105, -48 + i * 24]], "#7faaa6", 5);
    path(c, [[-48 + i * 24, sign * 70], [-48 + i * 24, sign * 105]], "#7faaa6", 5);
  }
  rect(c, -70, -70, 140, 140, "#183846"); c.strokeStyle = dim ? "#62787b" : P.cyan; c.lineWidth = 3; c.strokeRect(-60, -60, 120, 120);
  label(c, "AI", 0, 17, 48, dim ? "#667b7c" : P.cyan);
  circle(c, 49, -48, 4, dim ? "#465a60" : (Math.sin(t * 4) > 0 ? P.gold : P.cyan)); c.restore();
}
function truck(c, x, y, s = 1, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rect(c, -110, -95, 155, 100, "#c8c8a3"); rect(c, 45, -70, 70, 75, "#d8ab77"); rect(c, 58, -57, 42, 30, "#335d66");
  for (const xx of [-65, 76]) { circle(c, xx, 11, 21, "#142b35"); circle(c, xx, 11, 11, "#9aaba2"); path(c, [[xx, 11], [xx + Math.cos(t * 7) * 9, 11 + Math.sin(t * 7) * 9]], "#d4d0b1", 2); }
  rect(c, -115, 0, 238, 9, "#607a7a"); c.restore();
}
function parcel(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); rect(c, -39, -33, 78, 66, "#c49c6b"); rect(c, -4, -33, 8, 66, "#e6c997"); path(c, [[-39, -15], [39, -15]], "#a27d58", 2); c.restore();
}
function packets(c, a, b, t, color = P.gold, count = 4) {
  path(c, [a, b], "rgba(137,183,184,0.25)", 3);
  for (let i = 0; i < count; i++) {
    const u = ((t * 0.22 + i / count) % 1 + 1) % 1;
    circle(c, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 6, color);
  }
}

const SYSTEM_KINDS = new Set(["bank-queue", "bank-ledger", "bank-cash", "bank-support", "shop-payment", "shop-demand", "payment-phone", "phone-access", "ai-core", "ai-services", "human-work", "delivery", "network-outage", "network-recovery", "records-loss", "records-recovery", "paper-records", "gps-satellite", "gps-map", "gps-clock", "factory", "street-traffic", "power-outage", "cold-storage", "water-pumps", "weather-data", "city-building"]);
function drawSystemScene(c, shot, t, p) {
  if (!SYSTEM_KINDS.has(shot.kind)) throw new Error("Missing systems illustration: " + shot.kind);
  background(c, t);
  const fading = Math.max(0.12, 1 - p);
  switch (shot.kind) {
    case "bank-queue":
      bank(c, 680, 500, 1.5);
      for (let i = 0; i < 6; i++) person(c, 100 + i * 79 + Math.sin(t * 0.4 + i) * 8, 690 + i % 2 * 12, 0.85, t + i, i % 2 ? P.cyan : P.gold);
      label(c, "MANY REQUESTS AT THE SAME TIME", 500, 170, 30); break;
    case "bank-ledger":
      document(c, 240, 440, 1.65, "ACCOUNT"); document(c, 740, 400, 1.25, "LOANS"); note(c, 730, 635, 1.5);
      packets(c, [365, 450], [600, 450], t); label(c, "RECORDED CLAIM", 240, 680, 25); label(c, "DIFFERENT ASSETS", 730, 750, 25); break;
    case "bank-cash":
      bank(c, 230, 455, 1); phone(c, 780, 460, 0.9, "WAIT", t);
      for (let i = 0; i < 5; i++) { const u = (t * 0.16 + i / 5) % 1; note(c, 350 + u * 280, 510 - Math.sin(u * Math.PI) * 70, 0.65, Math.sin(t + i) * 0.08); }
      label(c, "PHYSICAL CASH NEEDS A ROUTE", 500, 740, 28); break;
    case "bank-support":
      bank(c, 500, 480, 1.25); document(c, 180, 370, 0.8, "CHECKS"); document(c, 830, 370, 0.8, "SUPPORT");
      packets(c, [240, 400], [370, 400], t, P.cyan); packets(c, [760, 400], [650, 400], t + 1);
      label(c, "THE RESPONSE MATTERS", 500, 750, 32); break;
    case "shop-payment":
    case "shop-demand":
      rect(c, 400, 330, 430, 340, "#44676a"); rect(c, 430, 420, 370, 165, "#183a48");
      for (let i = 0; i < 8; i++) rect(c, 390 + i * 56, 300, 56, 58, i % 2 ? "#c8be94" : "#ad715e");
      rect(c, 375, 600, 480, 50, "#bea67d"); parcel(c, 540, 570, 0.8); phone(c, 735, 505, 0.48, shot.topicId === 3 ? "WAIT" : "PAY", t);
      person(c, 255 + Math.sin(t) * 10, 640, 1.2, t, P.gold); person(c, 645, 540, 0.85, 0, P.cyan);
      label(c, shot.kind === "shop-demand" ? "DEMAND CONNECTS CUSTOMERS AND WORK" : "PAYMENT IS ONE PART OF THE PURCHASE", 500, 780, 25); break;
    case "payment-phone":
    case "phone-access":
      phone(c, 450, 450, 1.55, shot.kind === "phone-access" ? "VERIFY" : "OFFLINE", t);
      document(c, 820, 540, 0.7, "BACKUP"); person(c, 160, 630, 0.95, t, P.gold);
      packets(c, [580, 420], [760, 420], t, P.coral, 2); label(c, "ACCESS NEEDS A WORKING METHOD", 500, 790, 27); break;
    case "ai-core":
      chip(c, 500, 430, 1.8, t, p > 0.35);
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3; const target = [500 + Math.cos(a) * 330, 430 + Math.sin(a) * 230];
        packets(c, [500, 430], target, t + i, p > 0.35 ? P.muted : P.cyan, p > 0.35 ? 1 : 3);
      } label(c, "AI OUTPUT STOPS • OTHER SYSTEMS REMAIN", 500, 790, 24); break;
    case "ai-services":
      ["LANGUAGE", "SEARCH", "DOCUMENTS"].forEach((name, i) => {
        c.save(); c.translate(0, Math.sin(t * 1.4 + i) * 9);
        const x = 190 + i * 310; rect(c, x - 115, 300, 230, 300, P.panel); chip(c, x, 395, 0.55, t, true); label(c, name, x, 530, 21);
        path(c, [[x - 55, 560], [x + 55, 560]], P.coral, 4);
        circle(c, x - 55 + ((t * 30 + i * 35) % 110), 560, 5, P.gold);
        c.restore();
      }); label(c, "WHICH TOOLS DOES THE WORK NEED?", 500, 760, 29); break;
    case "human-work":
      rect(c, 230, 540, 600, 28, "#a9a784"); path(c, [[270, 570], [255, 730]], "#5c7b78", 18); path(c, [[790, 570], [805, 730]], "#5c7b78", 18);
      rect(c, 500, 330, 230, 155, "#172f3f"); rect(c, 515, 345, 200, 123, "#3d686e"); path(c, [[615, 485], [615, 535]], "#8fa7a1", 10);
      for (let i = 0; i < 4; i++) path(c, [[540, 370 + i * 24], [650 + Math.sin(t + i) * 15, 370 + i * 24]], P.cyan, 4);
      person(c, 360, 555, 1.2, Math.sin(t) * 0.1, P.gold); document(c, 790, 470, 0.52, "PLAN"); label(c, "PEOPLE, SKILLS AND USABLE BACKUPS", 500, 800, 27); break;
    case "delivery":
      rect(c, 80, 320, 230, 300, "#4d6d6d"); rect(c, 120, 420, 150, 200, "#173747"); label(c, "SUPPLIER", 190, 360, 23);
      for (let i = 0; i < 3; i++) parcel(c, 150 + i * 35, 590 - i % 2 * 65, 0.7);
      truck(c, 420 + (t * 45) % 320, 640, 1.1, t);
      arrow(c, [160, 755], [850, 755]); label(c, "GOODS NEED COORDINATION TOO", 500, 820, 28); break;
    case "network-outage":
    case "network-recovery":
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3, x = 500 + Math.cos(a) * 330, y = 430 + Math.sin(a) * 220;
        rect(c, x - 55, y - 38, 110, 76, P.panel); path(c, [[x - 40, y], [x + 40, y]], P.cyan, 4);
        if (shot.kind === "network-recovery") packets(c, [500, 430], [x, y], t + i, P.cyan);
        else { path(c, [[500, 430], [x, y]], "#54727a", 3); circle(c, 500 + (x - 500) * fading, 430 + (y - 430) * fading, 6, P.coral); }
      }
      circle(c, 500, 430, 70, "#163744"); label(c, shot.kind === "network-outage" ? "OFFLINE" : "RECONNECT", 500, 440, 23, P.gold);
      label(c, "CONNECTION IS NOT THE SAME AS STORED DATA", 500, 790, 25); break;
    case "records-loss":
    case "records-recovery":
    case "paper-records":
      for (let i = 0; i < 4; i++) {
        c.save(); c.globalAlpha = shot.kind === "records-loss" ? Math.max(0.1, 1 - p * (i + 1) / 3) : 1;
        document(c, 170 + i * 220, 400 + i % 2 * 130 + Math.sin(t * 1.3 + i) * 8, 1, shot.kind === "paper-records" ? "PAPER" : "RECORD"); c.restore();
      }
      if (shot.kind === "records-recovery") arrow(c, [200, 710], [810, 710]);
      label(c, shot.kind === "records-loss" ? "MISSING EVIDENCE MUST BE RECONSTRUCTED" : "COMPARE, CHECK AND RECONCILE", 500, 800, 25); break;
    case "gps-satellite":
      circle(c, 500, 640, 170, "#477d85");
      for (let i = 0; i < 5; i++) path(c, [[365 + i * 60, 560], [390 + i * 45, 725]], "rgba(161,208,186,0.35)", 12);
      c.save(); c.translate(Math.sin(t * 0.6) * 40, 0);
      rect(c, 450, 200, 100, 80, "#c4c6a4"); rect(c, 300, 210, 130, 60, "#3b7181"); rect(c, 570, 210, 130, 60, "#3b7181"); c.restore();
      packets(c, [500, 300], [500, 470], t, P.coral, 2); label(c, "POSITION • NAVIGATION • TIME", 500, 850, 29); break;
    case "gps-map":
      rect(c, 100, 210, 800, 520, "#345f64");
      for (let i = 0; i < 5; i++) { path(c, [[120, 260 + i * 92], [880, 290 + i * 92]], "#79918a", 13); path(c, [[180 + i * 145, 230], [210 + i * 145, 710]], "#7f9c90", 15); }
      const xx = 230 + ((t * 80) % 500); circle(c, xx, 490, 22, P.gold); circle(c, xx, 490, 9, P.bg);
      label(c, "THE MAP AND THE LOCATION ARE SEPARATE", 500, 820, 24); break;
    case "gps-clock":
      circle(c, 500, 430, 185, P.edge); circle(c, 500, 430, 172, P.bg);
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; path(c, [[500 + Math.sin(a) * 145, 430 - Math.cos(a) * 145], [500 + Math.sin(a) * 160, 430 - Math.cos(a) * 160]], P.ink, 5); }
      path(c, [[500, 325], [500, 430], [500 + Math.cos(t) * 115, 430 + Math.sin(t) * 115]], P.gold, 8);
      label(c, "PRECISE TIMING IS A HIDDEN DEPENDENCY", 500, 790, 25); break;
    case "factory":
      rect(c, 90, 340, 820, 300, "#31565f");
      path(c, [[90, 340], [230, 265], [230, 340], [370, 265], [370, 340]], "#8ba39c", 12);
      path(c, [[140, 640], [860, 640]], "#a7b6a8", 24);
      for (let i = 0; i < 5; i++) parcel(c, 170 + ((t * 55 + i * 145) % 670), 595, 0.65);
      path(c, [[570, 530], [600 + Math.sin(t) * 40, 390], [730, 460 + Math.sin(t) * 35]], P.gold, 26);
      circle(c, 600 + Math.sin(t) * 40, 390, 22, "#708c8d"); person(c, 320, 540, 0.8, t, P.cyan);
      label(c, "CAPACITY NEEDS PEOPLE AND A WORKABLE PROCESS", 500, 800, 23); break;
    case "street-traffic":
      rect(c, 0, 520, 1000, 250, "#233f4c");
      for (let i = 0; i < 6; i++) rect(c, i * 190, 640, 100, 7, "#bcba98");
      truck(c, (t * 70) % 1200 - 100, 600, 0.7, t); truck(c, 850 - (t * 40) % 1000, 735, 0.6, -t);
      path(c, [[800, 510], [800, 200]], "#8aa49b", 12); rect(c, 765, 200, 70, 170, "#152c36");
      for (let i = 0; i < 3; i++) circle(c, 800, 230 + i * 50, 17, i === Math.floor(t) % 3 ? P.gold : "#3e5b62");
      label(c, "COORDINATION KEEPS THE STREET MOVING", 500, 850, 26); break;
    case "power-outage":
      for (let i = 0; i < 5; i++) {
        const x = 100 + i * 180; rect(c, x, 290 + i % 2 * 70, 130, 380, "#294c58");
        for (let j = 0; j < 12; j++) rect(c, x + 15 + j % 3 * 35, 320 + i % 2 * 70 + Math.floor(j / 3) * 55, 18, 25, j / 12 > p ? P.gold : "#17313e");
      } label(c, "BACKUP ENERGY HAS LIMITS", 500, 820, 30); break;
    case "cold-storage":
      rect(c, 260, 200, 480, 490, "#8aa6a2"); rect(c, 280, 220, 440, 450, "#213f4b");
      for (let i = 0; i < 3; i++) { path(c, [[290, 350 + i * 130], [710, 350 + i * 130]], "#91aaa0", 8); for (let j = 0; j < 3; j++) parcel(c, 350 + j * 140, 315 + i * 130, 0.6); }
      path(c, [[795, 320], [795, 600]], P.edge, 13); circle(c, 795, 600, 32 + Math.sin(t * 3) * 10, P.coral);
      path(c, [[795, 590], [795, 410 - Math.sin(t) * 55]], P.coral, 6);
      label(c, "TEMPERATURE HISTORY MATTERS", 500, 820, 28); break;
    case "water-pumps":
      rect(c, 140, 260, 250, 370, "#4a7c85"); rect(c, 150, 410 + Math.sin(t) * 30, 230, 210, "#8bbabc");
      path(c, [[390, 550], [650, 550], [650, 350], [840, 350]], "#789c9c", 28);
      packets(c, [400, 550], [630, 550], t, P.cyan); circle(c, 650, 550, 55, P.panel); label(c, "PUMP", 650, 558, 19);
      label(c, "STORAGE, PRESSURE AND ENERGY", 500, 800, 28); break;
    case "weather-data":
      circle(c, 720, 280, 75, P.gold);
      for (let i = 0; i < 4; i++) circle(c, 300 + i * 90, 330 + Math.sin(t + i) * 12, 75, "#72989b");
      for (let i = 0; i < 12; i++) { const y = 430 + ((t * 100 + i * 37) % 230); path(c, [[230 + i * 42, y], [220 + i * 42, y + 25]], P.cyan, 4); }
      document(c, 800, 600, 0.65, "FORECAST"); label(c, "OBSERVATION AND PREPARATION", 500, 820, 28); break;
    case "city-building":
      rect(c, 250, 180, 500, 510, "#40636b");
      for (let i = 0; i < 20; i++) rect(c, 290 + i % 4 * 115, 230 + Math.floor(i / 4) * 80, 65, 40, i % 3 ? P.gold : "#214650");
      person(c, 180 + Math.sin(t) * 15, 700, 1, t, P.gold); phone(c, 820, 540, 0.6, "OFFLINE", t);
      label(c, "ESSENTIAL FUNCTIONS NEED ACCESS", 500, 820, 27); break;
  }
}
module.exports = { drawSystemScene, SYSTEM_KINDS };
