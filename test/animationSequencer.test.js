import test from 'node:test';
import assert from 'node:assert/strict';
import { AnimationSequencer } from '../src/utils/animationSequencer.js';

test('import preserves a track volume of zero', () => {
  const sequence = new AnimationSequencer();
  sequence.createTrack('opacity', [
    { time: 0, properties: { opacity: 1 } }
  ]).volume = 0;

  const restored = new AnimationSequencer();
  restored.import(sequence.export());

  assert.equal(restored.getTrack('opacity').volume, 0);
});

test('batch sends one track update after successful operations', () => {
  const sequence = new AnimationSequencer();
  const updates = [];
  sequence.onTrackUpdate = tracks => updates.push(tracks.map(track => track.name));

  sequence.batch(() => {
    sequence.createTrack('first');
    sequence.createTrack('second');
  });

  assert.deepEqual(updates, [['first', 'second']]);
});

test('batch restores track updates when an operation throws', () => {
  const sequence = new AnimationSequencer();
  const updates = [];
  sequence.onTrackUpdate = tracks => updates.push(tracks.length);

  assert.throws(() => sequence.batch(() => {
    sequence.createTrack('first');
    throw new Error('batch failed');
  }), /batch failed/);

  sequence.createTrack('second');
  assert.deepEqual(updates, [2]);
});
