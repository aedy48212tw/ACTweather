import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalise,metar} from '../src/core.mjs';
import {hpaToInHg,hpaToMmHg,pressureValues,effectiveTime,modelName,cloudGuidance,cloudLines} from '../src/formatting.mjs';
import {fixture} from './fixture.mjs';
const w=()=>normalise(fixture(),Date.parse('2026-10-06T15:00Z'));
function cloud(rh,elevation=0){return {header:{elevation},cloudLayers:['925h','850h','700h','500h'].map(level=>({level,rh}))};}
test('hPa mmHg inHg conversion and codes use precise units',()=>{
 assert.ok(Math.abs(hpaToInHg(1013.25)-29.92125)<0.00001);
 assert.ok(Math.abs(hpaToMmHg(1013.25)-760)<0.001);
 assert.equal(pressureValues({pressure:1012}).a.toFixed(2),'29.88');
 assert.equal(pressureValues({pressure:1012}).aCode,'A2988');
 assert.equal(pressureValues({pressure:1012.9}).qCode,'Q1012');
 assert.equal(pressureValues({pressure:1012},{qnh:1000}).q,1000);
 assert.equal(pressureValues({}).aCode,'A////');
 assert.equal(hpaToInHg(0),undefined);
});
test('dual effective time exactly matches requested format across date boundary',()=>{
 assert.equal(effectiveTime(w()),'2026-10-06 23:00(LST地方時)；2026-10-06 15:00 (UTC)');
 assert.equal(effectiveTime({...w(),requestedTs:Date.parse('2026-10-06T18:00Z')}),'2026-10-07 02:00(LST地方時)；2026-10-06 18:00 (UTC)');
 assert.equal(modelName('gfs'),'GFS');assert.equal(modelName('ecmwf'),'ECMWF');
});
test('all four figure pressure levels use correct cloud amounts and base heights',()=>{
 for(const [rh,codes] of [[95,['BKN020','BKN040','BKN080','BKN150']],[80,['BKN–SCT025','BKN–SCT050','BKN–SCT100','BKN–SCT180']],[70,['SCT030','SCT060','SCT120','SCT200']]]){
  assert.deepEqual(cloudGuidance(cloud(rh)).rows.map(x=>x.code),codes);
 }
 assert.match(cloudGuidance(cloud(95)).ceiling,/2000呎/);
 assert.match(cloudGuidance(cloud(70)).ceiling,/未推定雲幕/);
});
test('RH boundaries, explicit gap treatment and missing data',()=>{
 assert.equal(cloudGuidance(cloud(89.9)).rows[0].amount,'BKN–SCT');
 assert.equal(cloudGuidance(cloud(79.9)).rows[0].amount,'SCT');
 assert.equal(cloudGuidance(cloud(69.9)).rows[0].status,'dry');
 assert.equal(cloudGuidance(cloud(undefined)).rows[0].status,'missing');
 assert.equal(cloudGuidance(cloud(101)).rows[0].status,'missing');
});
test('below-terrain excluded and reference ceilings shown in feet',()=>{
 const result=cloudGuidance(w());
 assert.equal(result.rows[0].status,'below');
 assert.equal(result.rows[1].status,'below');
 assert.equal(result.rows[2].code,'BKN080');
 assert.equal(result.ceiling,'8000呎（700 hPa）');
 assert.equal(result.rows[3].status,'missing');
 assert.equal(cloudGuidance(cloud(90)).rows[0].code,'BKN020');
 assert.match(cloudLines(cloud(80)).lines[0],/RH 80% → BKN–SCT025$/);
 assert.doesNotMatch(cloudLines(cloud(80)).lines[0],/AMSL|AGL/);
});
test('missing pressure remains unknown and cloud estimates are combined in forecast METAR',()=>{
 const p=fixture();delete p.data.pressure;
 assert.match(metar(normalise(p,w().ts)),/Q\/\/\/\//);
 assert.match(metar(w()),/BKN080/);
 assert.equal(w().cloudLayers.length,4);
});
