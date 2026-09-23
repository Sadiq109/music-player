# Music Player

[![CI](https://github.com/Sadiq109/music-player/actions/workflows/ci.yml/badge.svg)](https://github.com/Sadiq109/music-player/actions/workflows/ci.yml)

I built this music player in plain HTML, CSS and JavaScript. It plays a playlist of sample tracks in the browser.

## Features

- Play/pause, next and previous (previous restarts the song if you're more than 3 seconds in)
- Seek bar with elapsed and total time
- Shuffle (keeps the current song playing and plays each song once per cycle)
- Repeat modes: off, all, one
- Volume slider that remembers your setting
- Keyboard shortcuts: Space to play/pause, arrow keys to seek 5 seconds, `n` and `p` for next and previous
- Animated equalizer while music is playing, which respects reduced-motion settings
- A clear message if a track can't load

## Run it

ES modules need to be served over HTTP, so start a local server in the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

The playlist logic (ordering, shuffle, repeat, wraparound) lives in `src/playlist.js` with no DOM code, so it runs under Node's built-in test runner:

```bash
npm test
```

## Layout

```text
index.html          markup
src/playlist.js     playlist state: next/previous, shuffle, repeat
src/app.js          wires the playlist to the <audio> element and the controls
src/style.css       styles
tests/              unit tests for playlist.js
```

The sample songs are by T. Schürger from [SoundHelix](https://www.soundhelix.com/audio-examples).
