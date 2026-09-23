import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Playlist, formatTime } from '../src/playlist.js';

const tracks = ['a', 'b', 'c'].map((t) => ({ title: t }));

test('next and previous wrap around', () => {
  const p = new Playlist(tracks);
  assert.equal(p.next().title, 'b');
  assert.equal(p.next().title, 'c');
  assert.equal(p.next().title, 'a');
  assert.equal(p.previous().title, 'c');
});

test('auto-advance respects repeat modes', () => {
  const p = new Playlist(tracks);
  p.select(2);
  p.repeat = 'off';
  assert.equal(p.next({ auto: true }), null);
  p.repeat = 'one';
  assert.equal(p.next({ auto: true }).title, 'c');
  p.repeat = 'all';
  assert.equal(p.next({ auto: true }).title, 'a');
});

test('cycleRepeat goes off -> all -> one', () => {
  const p = new Playlist(tracks);
  p.repeat = 'off';
  assert.deepEqual([p.cycleRepeat(), p.cycleRepeat(), p.cycleRepeat()], ['all', 'one', 'off']);
});

test('shuffle keeps the current track and visits every track once', () => {
  const p = new Playlist(tracks, { random: () => 0 });
  p.select(1);
  p.setShuffle(true);
  assert.equal(p.order[0], 1);
  assert.deepEqual([...p.order].sort(), [0, 1, 2]);
  const seen = [p.current.title, p.next().title, p.next().title];
  assert.deepEqual([...seen].sort(), ['a', 'b', 'c']);
});

test('select rejects bad positions and empty playlists are rejected', () => {
  const p = new Playlist(tracks);
  assert.throws(() => p.select(3), RangeError);
  assert.throws(() => new Playlist([]));
});

test('formatTime', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(65.7), '1:05');
  assert.equal(formatTime(NaN), '0:00');
});
