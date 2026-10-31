// Each visual beat is tied to a specific passage in the narration, rather than
// displaying one subject diagram for the entire video. No language model needed.
const ANT_BEATS = [
  [{ kind: "ant-world", headline: "A tiny animal. A much bigger job.", action: "vanish" }],
  [
    { kind: "ant-tunnels", headline: "Empty tunnels. No maintenance.", action: "abandon" },
    { kind: "ant-seeds", headline: "Who carries the seeds now?", action: "stop" },
  ],
  [
    { kind: "ant-predators", headline: "One food source disappears.", action: "lose-food" },
    { kind: "ant-pests", headline: "Some insects face fewer hunters.", action: "increase" },
  ],
  [
    { kind: "ant-habitats", headline: "Different habitats. Different effects.", action: "compare" },
    { kind: "ant-decomposers", headline: "The other decomposers remain.", action: "continue" },
  ],
];

function splitPassage(text) {
  // Preserve literal source passages so visuals can be audited against the script.
  const parts = text.split(/(?<=;)\s+|,\s+(?=and |while |but )/).filter(Boolean);
  return parts.length > 1 ? parts : [text];
}
function chooseKind(text, scene) {
  if (/pollinat|flower|fruit|seed/i.test(text)) return "pollination";
  if (/soil|root|decompos|dead wood|leaf litter|nutrient recycl/i.test(text)) return "soil-cycle";
  if (/oxygen|breath|photosynthe/i.test(text)) return "oxygen";
  if (/gravity|weight|jump|lift|mass would/i.test(text)) return "gravity";
  if (/orbit|tide|rotat|spinning|axial|daylight|sunlight|sunrise|sun would/i.test(text)) return "orbit";
  if (/temperature|cool|warm|heat|ice|climate|rain|flood|water cycle/i.test(text)) return "climate";
  if (/predator|prey|food web|food chain|eat |feed|hunt|pest|food source/i.test(text)) return "food-web";
  if (/size|larger|height|scale|cross.section|wings|flight|enlarg/i.test(text)) return "scale";
  if (/shelter|habitat|forest|wildlife|landscape|coast|ecosystem/i.test(text)) return "habitat";
  if (/brain|memory|memories|thought|sleep|pain|health|body|muscle|bone|biolog/i.test(text)) return "body";
  if (/network|power|electric|internet|signal|satellite|communication|record|software|digital|device/i.test(text)) return "network";
  if (scene.family === "nature") return "habitat";
  if (scene.family === "space" || scene.family === "planet") return "orbit";
  if (scene.family === "body") return "body";
  return "city";
}

function planShots(scene) {
  const passages = splitPassage(scene.text);
  const explicit = scene.family === "nature" && scene.topicId === 1 ? ANT_BEATS[scene.stage] : null;
  if (explicit && explicit.length !== passages.length) {
    throw new Error("Ant storyboard must be revised to match the changed narration");
  }
  let word = 0;
  const shots = passages.map((passage, i) => {
    const count = passage.trim().split(/\s+/).length;
    const shot = {
      kind: scene.visual || (explicit ? explicit[i].kind : chooseKind(passage, scene)),
      headline: scene.headline || (explicit ? explicit[i].headline : passage),
      action: explicit ? explicit[i].action : scene.stage === 0 ? "setup" : scene.stage === 3 ? "qualify" : "change",
      passage, wordStart: word, wordEnd: word + count,
      subject: scene.subject, topicId: scene.topicId, stage: scene.stage, family: scene.family,
    };
    word += count;
    return shot;
  });
  return shots.map(shot => ({ ...shot, from: shot.wordStart / word, to: shot.wordEnd / word }));
}
function activeShot(scene, progress) {
  const shots = scene.shots || planShots(scene);
  const p = Math.max(0, Math.min(1, progress));
  const index = shots.findIndex(shot => p < shot.to);
  const shot = shots[index < 0 ? shots.length - 1 : index];
  return { ...shot, progress: Math.min(1, Math.max(0, (p - shot.from) / (shot.to - shot.from))) };
}
module.exports = { planShots, activeShot, chooseKind };
