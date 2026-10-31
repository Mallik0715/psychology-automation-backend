# What If Systems — Shorts only

A 100-topic series about banking, money, AI, automation, the internet, digital identity, and everyday infrastructure. Scripts, artwork, captions, and video rendering run locally. Narration uses Microsoft's online neural speech through edge-tts, without a separate API key. No AI image or stock-footage service is used.

## Review the topics

See [all 100 topics](content/TOPICS.md). Narration for the first ten is in `content/systemShorts.js`; the other ninety are in `content/moreSystemShorts.js`. Each entry contains its own scenario, consequences, qualifications, takeaway, and explicit scene types. The previous nature/space catalog is archived in `content/archive/nature-and-science.js` and is not used by the active queue.

Scripts have five or six narrated beats. Runtime follows actual speech, and this project rejects narration longer than 90 seconds before publishing. Videos are vertical 1080×1920 at 24 fps. There is no weekly long-form job or active long-form generation.

## Local setup and previews

- Node.js 20 or newer: `npm ci`.
- Install FFmpeg and FFprobe with libass/subtitle support.
- Install Python and the neural speech dependency: `python -m pip install -r requirements-voice.txt`.
- Ubuntu/Debian: `sudo apt-get install ffmpeg fonts-dejavu-core`.
- Default voice: `en-US-AndrewMultilingualNeural`, with `TTS_RATE=+8%`. Configure `TTS_VOICE` and `TTS_RATE` to select another supported neural voice or pace. `PYTHON_PATH` can point to a specific Python executable.
- Narration text is sent to Microsoft's online speech service. An internet connection is required; a failed neural request stops the run rather than substituting a system voice.
- For development only, `TTS_PROVIDER=offline` explicitly selects the previous Windows System.Speech / Linux espeak-ng engine. It is not an automatic fallback, and CI uses neural speech.
- Copy `.env.example` to `.env` for optional executable paths or publishing credentials.

```sh
npm run preview
npm run preview -- --topic 2
npm run preview:visuals
npm test
```

Previews never upload or advance progress. Output is in `storage/finalVideo.mp4`, with `script.txt`, `storyboard.json`, narration, timings, and captions. The visuals-only command reuses matching narration and writes `storage/finalVideo_polished.mp4`. Run one rendering process at a time.

## Branch testing and public uploads

Development branch: `feature/what-if-system-shorts`. A push to this branch runs tests and renders a preview on GitHub Actions. Download the resulting `what-if-short-...` artifact to inspect the video.

To test the real YouTube integration, open Actions → **What If Systems Shorts** → **Run workflow**, select this branch, keep **publish** enabled, and optionally enter a topic ID from 1 to 100. This publishes publicly using the existing `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, and `YOUTUBE_REFRESH_TOKEN` repository secrets. No unlisted upload mode is added. A push or pull-request check never publishes.

Local public publishing uses `npm start` with those same credentials configured. The old `pipeline-long.js` command exits with a Shorts-only message.

The three daily schedule slots remain 09:00, 13:00, and 20:00 IST. GitHub scheduled runs use the default branch: changes on this feature branch do not replace the production schedule until merged. Topic progress advances only after a successful upload, is committed back to the publishing branch, and wraps after topic 100. A new catalog version starts at topic 1 rather than reusing an old queue index.

## Visuals and editorial scope

System-specific animated settings include bank queues, ledgers, cash flows, payment counters, AI tools, human fallback work, deliveries, networks, records, satellites, timing, factories, transport, energy, cold storage, water pumps, and buildings. Scenes are moving schematic illustrations, not live footage or numerical forecasts. The soundtrack is the normalized narration, without the old generated background drone.

Update shot selection in `services/storyboardService.js`, systems artwork in `services/systemSceneService.js`, and composition in `services/animationService.js`. Scene durations are measured from decoded audio. Neural captions use word timestamps returned by the speech service; shot boundaries use those timestamps when the service text matches the source, otherwise cuts retain proportional estimates. Voice settings are recorded in `storage/audio/voice-info.json`. Audio is normalized to a consistent loudness before rendering.

These are conditional thought experiments, not claims that an outage is happening. Financial scripts distinguish access, liquidity, solvency, records, and payment methods, and do not predict universal bank failure. The first banking, payment, and GPS scripts include primary-source background links; references are not comprehensive verification of all hypothetical outcomes. Other entries are authored scenarios that still require editorial judgment. No AI fact checker is called.

No code is merged into main or production-tested merely by creating the branch. Public upload testing is an explicit manual workflow run.
