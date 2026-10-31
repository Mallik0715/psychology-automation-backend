"""Generate scene narration with Microsoft's online neural speech and word timing.

The manifest contains narration and output paths; no credentials are required.
Local dependencies may be installed in the project's ignored storage directory.
"""
import asyncio
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "storage" / "python-deps"))
import edge_tts


async def synthesize(segment, voice, rate):
    destination = Path(segment["file"])
    partial = destination.with_suffix(".partial.mp3")
    for attempt in range(3):
        words = []
        try:
            stream = edge_tts.Communicate(
                segment["text"], voice, rate=rate, boundary="WordBoundary",
                connect_timeout=15, receive_timeout=60,
            )
            with partial.open("wb") as audio:
                async for chunk in stream.stream():
                    if chunk["type"] == "audio":
                        audio.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        words.append({
                            "text": html.unescape(chunk["text"]),
                            "start": chunk["offset"] / 10_000_000,
                            "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                        })
            if not partial.stat().st_size or not words:
                raise RuntimeError("Speech service returned no usable audio or word timings")
            partial.replace(destination)
            Path(segment["wordsFile"]).write_text(json.dumps(words), encoding="utf-8")
            return
        except Exception:
            partial.unlink(missing_ok=True)
            if attempt == 2:
                raise
            await asyncio.sleep(attempt + 1)


async def main():
    manifest = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    for segment in manifest["segments"]:
        await synthesize(segment, manifest["voice"], manifest["rate"])


if __name__ == "__main__":
    asyncio.run(main())
