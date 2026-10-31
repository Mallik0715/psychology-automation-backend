const test = require("node:test");
const assert = require("node:assert/strict");
const { voiceConfig, offsetWords, alignShots } = require("../services/voiceService");
const { timedWordChunks } = require("../services/subtitleService");

test("neural narration is the default and offline speech requires explicit selection", () => {
  assert.deepEqual(voiceConfig({}), { provider:"edge", voice:"en-US-AndrewMultilingualNeural", rate:"+8%" });
  assert.equal(voiceConfig({TTS_PROVIDER:"offline"}).provider,"offline");
  assert.equal(voiceConfig({TTS_VOICE:"en-IN-PrabhatNeural",TTS_RATE:"-5%"}).voice,"en-IN-PrabhatNeural");
  assert.throws(()=>voiceConfig({TTS_PROVIDER:"unknown"}),/TTS_PROVIDER/);
  assert.throws(()=>voiceConfig({TTS_VOICE:"Microsoft David"}),/neural voice/);
  assert.throws(()=>voiceConfig({TTS_RATE:"quickly"}),/TTS_RATE/);
});

test("service word timings are offset into the full narration and bounded by the scene", () => {
  assert.deepEqual(offsetWords([{text:"First",start:0.1,end:0.4},{text:"word",start:0.7,end:1.2}],3,1), [
    {text:"First",start:3.1,end:3.4},{text:"word",start:3.7,end:4},
  ]);
  for(const words of [[],[{text:"bad",start:1,end:0.5}],[{text:"a",start:0.5,end:0.6},{text:"b",start:0.1,end:0.2}]]) {
    assert.throws(()=>offsetWords(words,0,2),/timing/);
  }
});

test("captions retain real speech gaps instead of assigning equal time to words", () => {
  assert.deepEqual(timedWordChunks([
    {text:"Wait",start:0.2,end:0.5},{text:"for",start:1,end:1.1},{text:"this",start:1.3,end:1.6},
  ],2),[
    {text:"WAIT FOR",start:0.2,end:1.1},{text:"THIS",start:1.3,end:1.6},
  ]);
});

test("visual cuts follow service word boundaries, with an explicit estimate on text mismatch", () => {
  const scene={text:"First part, and next part.",shots:[{wordStart:0,from:0,to:0.4},{wordStart:2,from:0.4,to:1}]};
  const words=[{text:"First",start:2.1,end:2.3},{text:"part",start:2.4,end:2.7},{text:"and",start:3.6,end:3.8},{text:"next",start:3.9,end:4.1},{text:"part",start:4.2,end:4.4}];
  const aligned=alignShots(scene,words,2,3);
  assert.equal(aligned.shotTiming,"service");
  assert.equal(aligned.shots[0].to,(3.6-2)/3);
  assert.equal(aligned.shots[1].from,aligned.shots[0].to);
  assert.equal(aligned.shots[1].to,1);
  const estimate=alignShots(scene,[{text:"different",start:2.1,end:2.5}],2,3);
  assert.equal(estimate.shotTiming,"estimated");
  assert.equal(estimate.shots,scene.shots);
});
