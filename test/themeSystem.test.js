import test from 'node:test';
import assert from 'node:assert/strict';
import { ThemeManager, THEMES } from '../src/utils/themeSystem.js';

const stubAnimationFrames = t => {
  const frames = [];
  t.mock.timers.enable({ apis: ['Date'] });
  globalThis.requestAnimationFrame = callback => frames.push(callback);
  t.after(() => delete globalThis.requestAnimationFrame);

  return ms => {
    t.mock.timers.tick(ms);
    frames.shift()();
  };
};

test('transitionToTheme interpolates colors, then applies the theme object', t => {
  const advance = stubAnimationFrames(t);
  const manager = new ThemeManager();
  manager.applyTheme('gaming');

  manager.transitionToTheme('party', 1000);
  advance(500);

  assert.equal(manager.isTransitioning, true);
  assert.equal(manager.currentTheme, THEMES.gaming);
  assert.equal(manager.getCurrentColors()[0], 'rgb(134, 14, 85)');

  advance(500);

  assert.equal(manager.isTransitioning, false);
  assert.equal(manager.currentTheme, THEMES.party);
  assert.equal(manager.getCurrentThemeName(), 'Party');
  assert.deepEqual(manager.getCurrentColors(), THEMES.party.colorScheme.colors);
});

test('transitionToTheme accepts custom themes', t => {
  const advance = stubAnimationFrames(t);
  const manager = new ThemeManager();
  const brand = { name: 'Brand', colorScheme: { colors: ['#112233', '#445566'] } };
  manager.createCustomTheme('brand', brand);
  manager.applyTheme('wellness');

  manager.transitionToTheme('brand', 1000);
  assert.equal(manager.isTransitioning, true);
  advance(1000);

  assert.equal(manager.currentTheme, brand);
  assert.deepEqual(manager.getCurrentColors(), ['#112233', '#445566']);
});

test('transitionToTheme applies the theme at once when none is active', () => {
  const manager = new ThemeManager();

  manager.transitionToTheme('presentation');

  assert.equal(manager.isTransitioning, false);
  assert.equal(manager.currentTheme, THEMES.presentation);
  assert.equal(manager.getBackgroundColor(), 'rgba(168, 85, 247, 0.1)');
});
