import { Playlist, formatTime } from './playlist.js';

const TRACKS = [
  { title: 'SoundHelix Song 1', artist: 'T. Schürger', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'SoundHelix Song 2', artist: 'T. Schürger', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'SoundHelix Song 3', artist: 'T. Schürger', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'SoundHelix Song 4', artist: 'T. Schürger', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'SoundHelix Song 5', artist: 'T. Schürger', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
];

const $ = (id) => document.getElementById(id);
const audio = $('audio');
const list = new Playlist(TRACKS);
const volumeKey = 'player-volume';

function renderPlaylist() {
  const ul = $('playlist');
  ul.innerHTML = '';
  TRACKS.forEach((track, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<span class="num">${i + 1}</span><span class="t"></span><span class="a"></span>`;
    btn.querySelector('.t').textContent = track.title;
    btn.querySelector('.a').textContent = track.artist;
    btn.addEventListener('click', () => load(list.select(i), true));
    if (i === list.index) li.classList.add('active');
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function load(track, play) {
  audio.src = track.src;
  $('title').textContent = track.title;
  $('artist').textContent = track.artist;
  $('seek').value = 0;
  $('current').textContent = '0:00';
  $('duration').textContent = '0:00';
  renderPlaylist();
  if (play) audio.play().catch(showError);
}

function showError() {
  $('status').textContent = "Couldn't play this track. Check your connection and try again.";
}

function togglePlay() {
  if (audio.paused) audio.play().catch(showError);
  else audio.pause();
}

audio.addEventListener('play', () => { document.body.classList.add('playing'); $('status').textContent = ''; });
audio.addEventListener('pause', () => document.body.classList.remove('playing'));
audio.addEventListener('loadedmetadata', () => {
  $('seek').max = Math.floor(audio.duration);
  $('duration').textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  $('seek').value = Math.floor(audio.currentTime);
  $('current').textContent = formatTime(audio.currentTime);
});
audio.addEventListener('ended', () => {
  const next = list.next({ auto: true });
  if (next) load(next, true);
});
audio.addEventListener('error', showError);

$('play').addEventListener('click', togglePlay);
$('next').addEventListener('click', () => load(list.next(), !audio.paused));
$('prev').addEventListener('click', () => {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  load(list.previous(), !audio.paused);
});
$('seek').addEventListener('input', (e) => { audio.currentTime = Number(e.target.value); });
$('shuffle').addEventListener('click', (e) => {
  list.setShuffle(!list.shuffle);
  e.currentTarget.setAttribute('aria-pressed', String(list.shuffle));
});
$('repeat').addEventListener('click', (e) => {
  const mode = list.cycleRepeat();
  e.currentTarget.dataset.mode = mode;
  e.currentTarget.setAttribute('aria-label', `Repeat: ${mode}`);
  e.currentTarget.title = `Repeat: ${mode}`;
});

const volume = $('volume');
volume.value = localStorage.getItem(volumeKey) ?? 0.8;
audio.volume = Number(volume.value);
volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
  localStorage.setItem(volumeKey, volume.value);
});

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  else if (e.code === 'ArrowRight') audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
  else if (e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  else if (e.key === 'n') $('next').click();
  else if (e.key === 'p') $('prev').click();
});

load(list.current, false);
