// SPDX-License-Identifier: MIT-0
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parameterRows} from '../web/app.mjs';
const html=readFileSync(new URL('../AirGradient-Test-API-App.html',import.meta.url),'utf8');
const script=html.slice(html.indexOf('const DEFAULTS='),html.indexOf('const prefs=loadPrefs();'));
const context=vm.createContext({structuredClone,localStorage:{getItem:()=>null}});
vm.runInContext(script,context);
const run=code=>JSON.parse(JSON.stringify(vm.runInContext(code,context)));
const defaults=run('DEFAULTS');
test('both editions use ESYair first and preserve the original device order',()=>{
  assert.deepEqual(defaults.map(d=>d.id),[196780,172350,189546,189917,76611]);
  assert.deepEqual(defaults.map(d=>d.slot),[1,2,3,4,5]);
  assert.deepEqual(JSON.parse(readFileSync(new URL('../web/devices.json',import.meta.url))).map(d=>d.id),defaults.map(d=>d.id));
});
test('migration retains custom settings and old device order, shifting replacement slot',()=>{
  const result=run("migratePrefs({parameter:'o3',interval:540,devices:[{id:172350,slot:1},{id:99,slot:2},{id:189917,slot:3},{id:76611,slot:4}]})");
  assert.deepEqual(result.devices.map(d=>d.id),[196780,172350,99,189917,76611]);
  assert.deepEqual(result.devices.map(d=>d.slot),[1,2,3,4,5]);
  assert.equal(result.parameter,'o3');assert.equal(result.interval,540);
  assert.deepEqual(run('migratePrefs({devices:[]}).devices').map(d=>d.id),[196780]);
});
test('migration moves an already-added ESYair to the front without duplication or losing forty old devices',()=>{
  assert.deepEqual(run('migratePrefs({devices:[{id:172350,slot:1},{id:196780}]}).devices').map(d=>d.id),[196780,172350]);
  assert.equal(run('migratePrefs({devices:Array.from({length:40},(_,i)=>({id:i+1}))}).devices.length'),41);
  assert.equal(run('migratePrefs({devices:[null,{id:0},{id:99}]}).devices.length'),2);
});
test('current saved preferences take priority so removed devices are not reinserted on every reload',()=>{
  context.localStorage.getItem=key=>key.endsWith('v2.3.0')?JSON.stringify({devices:[{id:99}],zone:'UTC'}):'{}';
  assert.deepEqual(run('loadPrefs()'),{devices:[{id:99}],zone:'UTC'});
});
test('concentration units remain distinct from raw electrodes and indices',()=>{
  assert.equal(run('FIELDS.no2[1]'),'ppb');assert.equal(run('FIELDS.o3[1]'),'ppb');
  assert.equal(run('FIELDS.no2WorkingElectrode[1]'),'mV');
  assert.equal(run('FIELDS.o3AuxiliaryElectrode[1]'),'mV');
  assert.equal(run('FIELDS.noxIndex[1]'),'');assert.equal(run('FIELDS.afeTemp[1]'),'');
});

test('main and supplementary lists have identical fields, units and absence rules',()=>{
 for(const model of ['O-M-1PPSTON-CE','O-M-1PPST-CE','O-1PST','O-1PS','unknown']){
  for(const record of [null,{}, {pm02:0,pm10:null,pm003Count:450,rco2:510,no2:null,o3:-6.8,atmp:20,rhum:60,pres:1013,newField:'<img src=x onerror=alert(1)>',timestamp:'2026-09-17'}]){
   assert.deepEqual(run(`parameterRows(${JSON.stringify(record)},${JSON.stringify(model)})`),parameterRows(record,model));
  }
 }
});
