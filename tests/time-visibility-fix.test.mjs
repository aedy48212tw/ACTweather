import {test} from 'node:test';import assert from 'node:assert/strict';
import {normalise} from '../src/core.mjs';import {effectiveTime,rainLine} from '../src/formatting.mjs';
import {normaliseUtcOffset,browserOffsetSeconds} from '../src/time.mjs';
import {visibilityFromWindy,visibilityValue} from '../src/windy-data.mjs';
import {fixture} from './fixture.mjs';
const t=Date.parse('2026-10-07T12:00Z');
test('screenshot regression: timeline 20:00 LST / 12:00 UTC despite zero payload offset',()=>{
 const p=fixture();p.header.utcOffset=0;const w=normalise(p,t,28800);
 assert.equal(effectiveTime(w),'2026-10-07 20:00(LST地方時)；2026-10-07 12:00 (UTC)');
 for(const offset of [8,'8',480,'480',28800]){p.header.utcOffset=offset;assert.equal(normalise(p,t).offset,28800);}
 assert.equal(normaliseUtcOffset(undefined),undefined);assert.equal(normaliseUtcOffset('bad'),undefined);
});
test('timeline exact minute preserved while model sample timestamp is recorded separately',()=>{
 const w=normalise(fixture(),t+3600000,28800);assert.equal(w.ts,t);assert.equal(w.requestedTs,t+3600000);
 assert.match(effectiveTime(w),/21:00\(LST地方時\)；2026-10-07 13:00 \(UTC\)/);
 const midnight=normalise(fixture(),Date.parse('2026-10-07T16:00Z'),28800);assert.match(effectiveTime(midnight),/2026-10-08 00:00/);
});
test('browser local time follows Windy Date formatter in Taiwan',()=>{
 const old=process.env.TZ;process.env.TZ='Asia/Taipei';try{assert.equal(browserOffsetSeconds(t),28800);}finally{if(old===undefined)delete process.env.TZ;else process.env.TZ=old;}
});
test('rain description order exactly matches user example',()=>{
 assert.equal(rainLine({rain:1.3,rainHours:3,rainRate:1.3/3,rainDaily:2.3}),'偶小雨；1.3mm/3小時預報；當日預報合計2.3mm');
 assert.equal(rainLine({rain:0,rainHours:3,rainRate:0,rainDaily:0}),'無降雨；0.0mm/3小時預報；當日預報合計0.0mm');
});
test('scalar tuple and typed array conversion rejects missing values',()=>{
 for(const raw of [15300,[15300,0,0],new Float32Array([15300,0,0])])assert.equal(visibilityValue(raw),15300);
 for(const raw of [null,-1,NaN,undefined,[NaN,0,0]])assert.equal(visibilityValue(raw),undefined);
});
