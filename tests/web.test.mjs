// SPDX-License-Identifier: MIT-0
import test from 'node:test';
import assert from 'node:assert/strict';
import {numberValue, displayNumber, readingState, validSnapshot} from '../web/app.mjs';
const now = Date.parse('2026-09-13T12:00:00Z');
const fresh = {id: 1, fetchedAt: '2026-09-13T11:59:00Z', error: null, retained: false,
  record: {locationId: 1, pm02: 0, timestamp: '2026-09-13T11:58:00Z'}};
test('zero remains visible and null is not coerced to zero', () => {
  assert.equal(numberValue(0), 0); assert.equal(displayNumber(0), '0');
  for (const value of [null, undefined, '', false, NaN, Infinity]) assert.equal(numberValue(value), null);
  assert.equal(displayNumber(null), '—');
});
test('measurement age, collection delay, offline and retained failures are visible', () => {
  assert.equal(readingState(fresh, now).tone, '');
  assert.match(readingState({...fresh, record: {...fresh.record, timestamp: '2026-09-13T10:00:00Z'}}, now).label, /Stale/);
  assert.match(readingState({...fresh, fetchedAt: '2026-09-13T10:00:00Z'}, now).label, /45 minutes/);
  assert.match(readingState({...fresh, retained: true, error: 'failed'}, now).label, /retained/);
  assert.match(readingState({...fresh, record: {...fresh.record, offline: true}}, now).label, /offline/);
  assert.equal(readingState({...fresh, record: null}, now).label, 'Unavailable');
});
test('missing and future timestamps are not presented as fresh', () => {
  assert.equal(readingState({...fresh, record: {...fresh.record, timestamp: null}}, now).tone, 'warn');
  assert.match(readingState({...fresh, record: {...fresh.record, timestamp: '2099-01-01T00:00:00Z'}}, now).label, /future/);
});
test('rejects malformed published snapshots', () => {
  const snapshot = {schemaVersion: 1, generatedAt: '2026-09-13T12:00:00Z', devices: [1,2,3,4,5].map(id => ({...fresh, id, record: {...fresh.record, locationId: id}}))};
  assert.ok(validSnapshot(snapshot)); assert.ok(!validSnapshot({}));
  assert.ok(!validSnapshot({...snapshot, devices: [fresh]}));
  assert.ok(!validSnapshot({...snapshot, devices: Array(5).fill(fresh)}));
  assert.ok(!validSnapshot({...snapshot, devices: snapshot.devices.slice(0,4)}));
  assert.ok(!validSnapshot({...snapshot, generatedAt: 'bad'}));
});

test('negative gas readings stay negative, and missing readings stay unavailable', () => {
  assert.equal(displayNumber(-6.8), (-6.8).toLocaleString(undefined, {maximumFractionDigits:1}));
  assert.equal(numberValue(-6.8), -6.8);
  assert.equal(displayNumber(0), '0');
  assert.equal(displayNumber(undefined), '—');
});
