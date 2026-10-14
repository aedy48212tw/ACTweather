import {test} from 'node:test';import assert from 'node:assert/strict';
import {normalise,metar,rainDescription} from '../src/core.mjs';
import {cloudGuidance} from '../src/clouds.mjs';
import {coordinates,searchPlaces,readFavorites,writeFavorites} from '../src/locations.mjs';
import {visibilityFromWindy} from '../src/windy-data.mjs';
import {fixture} from './fixture.mjs';
const t=Date.parse('2026-10-06T06:00Z');
const clouds=(a,b)=>({header:{elevation:12},cloudLayers:[{level:'925h',rh:a},{level:'850h',rh:b}]});
test('requested ceiling examples and METAR cloud group composition',()=>{
 const a=cloudGuidance(clouds(76,80));assert.equal(a.ceiling,'5000呎（850 hPa）');assert.equal(a.groups,'SCT030 BKN050');
 const b=cloudGuidance(clouds(90,95));assert.equal(b.ceiling,'2000呎（925 hPa）');assert.equal(b.groups,'BKN020 BKN040');
 const w={...normalise(fixture(),t),...clouds(76,80),visibility:15300};
 assert.match(metar(w),/9999 -RA SCT030 BKN050/);assert.doesNotMatch(metar(w),/BKN–SCT|NOSIG|RCTP/);
 assert.match(metar(w,{clouds:'FEW005 BKN020',visibility:8000}),/8000 -RA FEW005 BKN020/);
 assert.match(metar({...w,visibility:9999}),/9000 -RA/);assert.match(metar(w,{visibility:9999}),/9999 -RA/);
});
test('rain rates use actual segment duration, classifications and code boundaries',()=>{
 const w=normalise(fixture(),t);assert.equal(w.rainHours,3);assert.equal(w.rainRate,1.0999999999999999);
 for(const [rate,text,code] of [[0,'無降雨',''],[0.5,'偶小雨','-RA'],[1,'偶小雨','-RA'],[1.1,'小雨','-RA'],[3,'中雨','RA'],[15,'中雨','RA'],[39.9,'中雨','RA'],[40,'大雨','+RA']])assert.deepEqual(rainDescription(rate),{text,code});
 const hourly=fixture();hourly.data.ts=hourly.data.ts.map((_,i)=>Date.parse('2026-10-06T00:00Z')+i*3600000);const a=normalise(hourly,hourly.data.ts[2]);assert.equal(a.rainRate,3.3);assert.equal(a.rainHours,1);
 assert.equal(rainDescription(undefined).code,'');assert.equal(rainDescription(-1).code,'');
});
test('coordinates work offline and geocoder uses documented response with explicit failures',async()=>{
 assert.deepEqual(coordinates('25.038, 121.514'),{lat:25.038,lon:121.514,name:'25.038, 121.514'});assert.throws(()=>coordinates('121.514,25.038'),/緯度/);assert.equal(coordinates('臺北'),null);
 let called=false;assert.equal((await searchPlaces('25.038,121.514',()=>{called=true;}))[0].lat,25.038);assert.equal(called,false);
 const results=await searchPlaces('Kaohsiung',async url=>{assert.match(url,/name=Kaohsiung/);return {ok:true,json:async()=>({results:[{name:'高雄',latitude:22.63,longitude:120.3,country:'臺灣'}]})};});assert.equal(results[0].name,'高雄／臺灣');
 await assert.rejects(()=>searchPlaces('高雄',async()=>{throw Error('offline');}),/改用經緯度/);
 assert.equal((await searchPlaces('台北測站',async()=>{throw Error('offline');}))[0].lon,121.514);
});
test('favorites storage survives reload and rejects corrupted entries',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const p={name:'臺北',lat:25.038,lon:121.514};assert.equal(writeFavorites(storage,[p]),true);assert.deepEqual(readFavorites(storage),[p]);
 values.set('ACTweather.favorites','[{"name":"bad","lat":100,"lon":0}]');assert.deepEqual(readFavorites(storage),[]);
 assert.equal(writeFavorites({setItem(){throw Error();}},[p]),false);
});
