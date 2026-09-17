// SPDX-License-Identifier: MIT-0
import test from 'node:test';
import assert from 'node:assert/strict';
import {numberValue, displayNumber, readingState, validSnapshot, parameterRows} from '../web/app.mjs';
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

test('parameter lists distinguish unsupported, no data and unknown support without changing zero or negatives',()=>{
 const rows=parameterRows({pm02:0,pm10:null,no2:17.2,o3:-0.001,pres:null,newSignal:12.3},'O-M-1PPSTON-CE');
 const get=key=>rows.find(row=>row.key===key);
 assert.equal(get('pm02').text,'0 µg/m³');assert.equal(get('pm10').text,'N/D');
 assert.equal(get('o3').status,'warning');assert.match(get('o3').text,/-0.001 ppb/);
 assert.equal(get('pres').text,'N/D');assert.equal(get('newSignal').text,'12.3 (unit unspecified)');
 assert.equal(parameterRows({},'O-1PS').find(r=>r.key==='no2').text,'N/A');
 assert.equal(parameterRows({},'O-M-1PPSTON-CE').find(r=>r.key==='no2').text,'N/D');
 assert.equal(parameterRows({},'O-1PS').find(r=>r.key==='pres').text,'—');
 assert.equal(parameterRows({},'unknown').find(r=>r.key==='pm02').text,'—');
});
test('parameter lists include every returned measurement, exclude metadata and do not invent units',()=>{
 const record={locationId:196780,timestamp:'2026-09-17T00:00:00Z',latitude:46,offline:false,pm02:1,pm01:2,pm10:3,pm003Count:100,rco2:500,no2:0,o3:2,atmp:21,rhum:65,pres:1012,batteryVoltage:'12.25',no2WorkingElectrode:306.5125,afeTemp:316.3375,custom:{value:1},customNull:null};
 const rows=parameterRows(record,'O-M-1PPSTON-CE'),keys=rows.map(r=>r.key);
 for(const key of ['locationId','timestamp','latitude','offline'])assert.ok(!keys.includes(key));
 for(const key of Object.keys(record).filter(k=>!['locationId','timestamp','latitude','offline'].includes(k)))assert.ok(keys.includes(key));
 assert.equal(rows.find(r=>r.key==='batteryVoltage').text,'12.25 V');
 assert.match(rows.find(r=>r.key==='afeTemp').text,/unit unspecified/);
 assert.equal(rows.find(r=>r.key==='custom').text,'{"value":1}');
 assert.equal(rows.find(r=>r.key==='customNull').text,'N/D');
 assert.equal(new Set(keys).size,keys.length);
});
