const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { catalog, findScenario, CATALOG_VERSION } = require("../content/whatIfCatalog");
const { generateScript, scenarioScenes } = require("../services/scriptService");
const { generateSEO } = require("../services/seoService");
const { getNextTopic, markTopicPublished, loadIndex } = require("../services/topicService");
const { createFrameCanvas, drawFrame } = require("../services/animationService");
const { activeShot } = require("../services/storyboardService");
const { SYSTEM_KINDS, drawSystemScene } = require("../services/systemSceneService");
const { runPipeline, MAX_SHORT_SECONDS } = require("../services/whatIfPipeline");
const { ciOptions } = require("../scripts/run-ci-short");

test("exactly 100 distinct systems topics have authored Shorts narration and metadata", async () => {
  assert.equal(catalog.length, 100);
  assert.equal(new Set(catalog.map(e => e.title)).size, 100);
  assert.deepEqual(catalog.map(e => e.id), Array.from({length:100}, (_, i) => i + 1));
  assert.match(catalog[0].title, /withdraw/);
  assert.match(catalog[1].title, /AI/);
  const scripts = new Set();
  for (const entry of catalog) {
    assert.equal(entry.format, "short");
    assert.equal(entry.family, "systems");
    assert.equal(findScenario(entry.id), entry);
    const script = await generateScript(entry.title);
    const scenes = scenarioScenes(entry);
    assert.ok(scenes.length >= 5 && scenes.length <= 6);
    assert.equal(script, scenes.map(s => s.text).join("\n"));
    const words = script.split(/\s+/).length;
    assert.ok(words >= 60 && words <= 180, entry.title + ": " + words);
    assert.equal(scenes.at(-1).label, "THE TAKEAWAY");
    assert.ok(!/undefined|TODO|25 facts|psychology facts/.test(script));
    scripts.add(script);
    const seo = await generateSEO(entry.title);
    assert.ok(seo.title.length <= 100 && seo.description.length <= 5000);
    assert.ok(seo.title.endsWith("#Shorts"));
    assert.ok(seo.description.includes(entry.first));
  }
  assert.equal(scripts.size, 100);
  assert.throws(() => findScenario(101), /Unknown/);
  await assert.rejects(generateScript("new unconfigured scenario"), /Unknown/);
});

test("long-form generation is disabled before any credential or publication work", async () => {
  await assert.rejects(runPipeline({ long:true, preview:true }), /Shorts-only/);
  assert.equal(MAX_SHORT_SECONDS, 90);
  const result = spawnSync(process.execPath, ["pipeline-long.js"], { cwd: path.join(__dirname, ".."), encoding:"utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Long-form is disabled/);
  const pkg = require("../package.json");
  assert.ok(!pkg.scripts["start:long"] && !pkg.scripts["preview:long"]);
});

test("old and invalid queue states cannot skip the start of the new series", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "systems-queue-"));
  const file = path.join(dir, "progress.json");
  try {
    for (const [value, expected] of [
      [{ index:146 },0], [{ catalog:"what-if-v1", index:80 },0],
      [{ catalog:CATALOG_VERSION,index:-1 },0], [{ catalog:CATALOG_VERSION,index:1.5 },0],
      [{ catalog:CATALOG_VERSION,index:99 },99], [{ catalog:CATALOG_VERSION,index:100 },0],
    ]) {
      fs.writeFileSync(file,JSON.stringify(value)); assert.equal(loadIndex(file),expected);
    }
    fs.writeFileSync(file,"bad json"); assert.equal(loadIndex(file),0);
    assert.equal(loadIndex(path.join(dir,"missing.json")),0);
  } finally { fs.unlinkSync(file); fs.rmdirSync(dir); }
});

test("preview selection never advances progress; successful publication wraps after topic 100", t => {
  const states = new Map();
  t.mock.method(fs,"readFileSync",file => states.get(String(file)) || JSON.stringify({catalog:CATALOG_VERSION,index:0}));
  t.mock.method(fs,"writeFileSync",(file,value) => states.set(String(file),value));
  t.mock.method(fs,"renameSync",(from,to) => { states.set(String(to),states.get(String(from))); states.delete(String(from)); });
  assert.equal(getNextTopic(),catalog[0].title);
  assert.equal(getNextTopic(),catalog[0].title);
  assert.equal(states.size,0);
  markTopicPublished(catalog[0].title);
  assert.equal(getNextTopic(),catalog[1].title);
  markTopicPublished(catalog[99].title);
  assert.equal(getNextTopic(),catalog[0].title);
  assert.throws(() => markTopicPublished("unknown"),/unknown/);
});

test("every authored passage selects a supported scene and covers its complete narration", () => {
  for (const entry of catalog) for (const scene of scenarioScenes(entry)) {
    assert.equal(scene.shots[0].from,0);
    assert.equal(scene.shots.at(-1).to,1);
    for (let i=0;i<scene.shots.length;i++) {
      const shot=scene.shots[i];
      assert.ok(SYSTEM_KINDS.has(shot.kind),shot.kind);
      assert.equal(shot.family,"systems");
      assert.ok(shot.to>shot.from);
      if(i) assert.equal(shot.from,scene.shots[i-1].to);
      assert.equal(activeShot(scene,(shot.from+shot.to)/2).kind,shot.kind);
    }
    assert.equal(scene.shots.map(s=>s.passage).join(" ").replace(/[^a-z0-9]/gi,""),scene.text.replace(/[^a-z0-9]/gi,""));
  }
});

test("all 100 Shorts render every shot in portrait without missing artwork", () => {
  const canvas=createFrameCanvas(270,480), ctx=canvas.getContext("2d");
  for(const entry of catalog) for(const scene of scenarioScenes(entry)) for(const shot of scene.shots) {
    drawFrame(ctx,270,480,scene,2,(shot.from+shot.to)/2,0.5);
  }
  assert.ok(canvas.toBuffer("image/png").length>1000);
});

test("every systems illustration has visible motion independent of captions", () => {
  for(const kind of SYSTEM_KINDS) {
    const frames=[0.2,2].map((time,i)=>{
      const canvas=createFrameCanvas(300,300), ctx=canvas.getContext("2d");
      ctx.scale(0.3,0.3);
      drawSystemScene(ctx,{kind,topicId:1},time,i?0.8:0.15);
      return canvas.toBuffer("raw");
    });
    let changed=0;
    for(let i=0;i<frames[0].length;i+=4) if(Math.abs(frames[0][i]-frames[1][i])>8||Math.abs(frames[0][i+1]-frames[1][i+1])>8) changed++;
    assert.ok(changed>120,kind+" must visibly animate: "+changed);
  }
});

test("CI publishes only when explicitly requested and rejects bad topic IDs", () => {
  assert.deepEqual(ciOptions({}),{preview:true,topicId:undefined});
  assert.deepEqual(ciOptions({PUBLISH_SHORT:"false",TOPIC_ID:"2"}),{preview:true,topicId:2});
  assert.deepEqual(ciOptions({PUBLISH_SHORT:"true",TOPIC_ID:"100"}),{preview:false,topicId:100});
  assert.equal(ciOptions({PUBLISH_SHORT:"yes"}).preview,true);
  for(const value of ["0","101","1.5","abc","1;exit"]) assert.throws(()=>ciOptions({TOPIC_ID:value}),/TOPIC_ID/);
  const workflow=fs.readFileSync(path.join(__dirname,"../.github/workflows/upload.yml"),"utf8");
  assert.ok(!/weekly|pipeline-long|video_type|unlisted/i.test(workflow));
  assert.match(workflow,/workflow_dispatch/);
  assert.match(workflow,/actions\/upload-artifact/);
  const uploader=fs.readFileSync(path.join(__dirname,"../services/uploadService.js"),"utf8");
  assert.match(uploader,/privacyStatus: "public"/);
});

test("preparing a preview does not load remote content generation or the YouTube client", () => {
  const visited=new Set();
  function walk(mod) { if(visited.has(mod.id))return; visited.add(mod.id); mod.children.forEach(walk); }
  walk(require.cache[require.resolve("../services/whatIfPipeline")]);
  assert.ok(![...visited].some(id=>/groq|axios|googleapis|uploadService|scriptLong/.test(id)));
});
