'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { getFocusable, handleModalKeydown } = require('../static-version/a11y.js');

// Minimal DOM fakes (no jsdom dependency). A "document" tracks activeElement;
// focus() updates it. A "modal" returns a preset focusable list.
function makeEnv(focusableEls) {
  const doc = { activeElement: null };
  const els = focusableEls.map((name) => ({
    name,
    focus() { doc.activeElement = this; }
  }));
  const modal = { querySelectorAll: () => els };
  return { doc, modal, els };
}

function keyEvent(key, shiftKey = false) {
  let prevented = false;
  return {
    key,
    shiftKey,
    preventDefault() { prevented = true; },
    get prevented() { return prevented; }
  };
}

test('getFocusable returns the container\'s focusable elements', () => {
  const { modal, els } = makeEnv(['a', 'b']);
  assert.deepStrictEqual(getFocusable(modal), els);
});

test('getFocusable is safe on null/invalid containers', () => {
  assert.deepStrictEqual(getFocusable(null), []);
  assert.deepStrictEqual(getFocusable({}), []);
});

test('Escape closes the active modal', () => {
  const { doc, modal } = makeEnv(['a']);
  let closed = null;
  const ev = keyEvent('Escape');
  handleModalKeydown(ev, { getActiveModal: () => modal, close: (m) => { closed = m; }, doc });
  assert.strictEqual(closed, modal);
  assert.strictEqual(ev.prevented, true);
});

test('does nothing when no modal is open', () => {
  let closed = false;
  handleModalKeydown(keyEvent('Escape'), { getActiveModal: () => null, close: () => { closed = true; }, doc: {} });
  assert.strictEqual(closed, false);
});

test('Tab from the last element wraps to the first', () => {
  const { doc, modal, els } = makeEnv(['first', 'mid', 'last']);
  doc.activeElement = els[2]; // last
  handleModalKeydown(keyEvent('Tab'), { getActiveModal: () => modal, close: () => {}, doc });
  assert.strictEqual(doc.activeElement, els[0]); // wrapped to first
});

test('Shift+Tab from the first element wraps to the last', () => {
  const { doc, modal, els } = makeEnv(['first', 'mid', 'last']);
  doc.activeElement = els[0]; // first
  handleModalKeydown(keyEvent('Tab', true), { getActiveModal: () => modal, close: () => {}, doc });
  assert.strictEqual(doc.activeElement, els[2]); // wrapped to last
});

test('Tab in the middle does not force-wrap focus', () => {
  const { doc, modal, els } = makeEnv(['first', 'mid', 'last']);
  doc.activeElement = els[1]; // middle
  const ev = keyEvent('Tab');
  handleModalKeydown(ev, { getActiveModal: () => modal, close: () => {}, doc });
  assert.strictEqual(doc.activeElement, els[1]); // unchanged
  assert.strictEqual(ev.prevented, false);
});
