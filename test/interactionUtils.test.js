import test from 'node:test';
import assert from 'node:assert/strict';
import { createInteractionHandler } from '../src/utils/interactionUtils.js';

const createCanvas = () => {
  const listeners = new Map();
  return {
    width: 200,
    height: 100,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 100 }),
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: type => listeners.delete(type),
    dispatch: (type, event) => listeners.get(type)({ type, ...event })
  };
};

test('updateConfig changes the interaction force', () => {
  const handler = createInteractionHandler(createCanvas(), { effect: 'attract', strength: 1 });
  const particle = { x: 0, y: 0 };
  const point = { x: 50, y: 0, force: 1 };

  assert.equal(handler.calculateInteractionForce(particle, point).fx, 0.5);

  handler.updateConfig({ effect: 'repel' });
  assert.equal(handler.calculateInteractionForce(particle, point).fx, -0.5);

  handler.updateConfig({ radius: 40 });
  assert.equal(handler.calculateInteractionForce(particle, point).fx, 0);
});

test('updateConfig leaves the caller config untouched', () => {
  const config = { effect: 'attract' };
  const handler = createInteractionHandler(createCanvas(), config);

  handler.updateConfig({ effect: 'repel' });

  assert.deepEqual(config, { effect: 'attract' });
});

test('updateConfig can switch continuous tracking on', () => {
  const canvas = createCanvas();
  const handler = createInteractionHandler(canvas);
  handler.attachListeners();

  canvas.dispatch('mousemove', { clientX: 20, clientY: 10 });
  assert.deepEqual(handler.getInteractionPoints(), []);

  handler.updateConfig({ continuous: true });
  canvas.dispatch('mousemove', { clientX: 20, clientY: 10 });
  assert.deepEqual(handler.getInteractionPoints(), [{ x: 20, y: 10, force: 0.5, type: 'mouse' }]);
});
