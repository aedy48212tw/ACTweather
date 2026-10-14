import {test} from 'node:test';import assert from 'node:assert/strict';
import {createVisibilityReader,visibilityFromWindy} from '../src/windy-data.mjs';
import {pointTile,sampleVisibility,createVisibilityTileLoader} from '../src/visibility-tiles.mjs';
const ts=Date.parse('2026-10-07T12:00Z'),point={lat:25.038,lon:121.514};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
export function tile(value=15300){const pixels=new Uint8Array(257*257*4);for(let i=3;i<pixels.length;i+=4)pixels[i]=255;return {pixels,header:{decoderRmin:value,decoderRstep:0}};}
function setup(load=async()=>tile(),extra={},options={}){
 const requests=[];const deps={createFullRenderingParams:async(layer,weather,timestamp)=>{requests.push({layer,weather,timestamp});return {...weather,layer,fullPath:`https://ims.windy.com/im/v3.0/forecast/${weather.product}/ref/${timestamp}/wm_grid_257/<z>/<x>/<y>/visibility-surface.jpg`};},getDataZoom:()=>3,loadTile:load,...extra};
 const reader=createVisibilityReader(deps,{timeoutMs:200,retryMs:5,...options});return {reader,deps,requests};
}
test('read while wind rain RH satellite or radar is displayed performs ZERO map writes',async()=>{
 for(const overlay of ['wind','rain','rh','satellite','radar','visibility']){
  const state={overlay,product:'icon',level:'850h',timestamp:ts};const before=JSON.stringify(state);let calls=0;
  const x=setup(async(url)=>{calls++;assert.match(url,/ecmwf.*visibility-surface.jpg/);return tile();},{store:{get:k=>state[k],set(){throw Error('map must not be changed');}}});
  try{assert.equal(await x.reader.read('ecmwf',point,ts),15300);assert.equal(JSON.stringify(state),before);assert.equal(calls,1);}finally{x.reader.destroy();}
 }
});
test('cold background download is started without waiting for map redraw',async()=>{
 let started=false;const x=setup(async()=>{started=true;await delay(10);return tile();});try{assert.equal(await x.reader.read('ecmwf',point,ts),15300);assert.equal(started,true);}finally{x.reader.destroy();}
});
test('failed network attempt retries and recovers automatically',async()=>{
 let n=0;const x=setup(async()=>{if(++n<3)throw Error('tiles delayed');return tile();});try{assert.equal(await x.reader.read('ecmwf',point,ts),15300);assert.equal(n,3);}finally{x.reader.destroy();}
});
test('redraw storms share a single background request',async()=>{
 let n=0;const x=setup(async()=>{n++;await delay(25);return tile();});try{const p=x.reader.read('ecmwf',point,ts);for(let i=0;i<10;i++)assert.equal(x.reader.read('ecmwf',point,ts),p);assert.equal(await p,15300);assert.equal(n,1);}finally{x.reader.destroy();}
});
test('new timestamp explicitly requests new data instead of using current renderer',async()=>{
 const x=setup(async url=>tile(url.includes(String(ts+3600000))?8000:15300));try{assert.equal(await x.reader.read('ecmwf',point,ts),15300);assert.equal(await x.reader.read('ecmwf',point,ts+3600000),8000);assert.deepEqual(x.requests.map(x=>x.timestamp),[ts,ts+3600000]);}finally{x.reader.destroy();}
});
test('selected forecast model is requested without switching the map model',async()=>{
 const x=setup();try{assert.equal(await x.reader.read('gfs',point,ts),15300);assert.equal(x.requests[0].weather.product,'gfs');assert.equal(x.requests[0].weather.level,'surface');}finally{x.reader.destroy();}
});
test('changed point cancels an old hung request',async()=>{
 let calls=0;const x=setup(async()=>{if(++calls===1)return new Promise(()=>{});return tile(8000);});try{const old=x.reader.read('ecmwf',point,ts);const check=assert.rejects(old,/取消/);await delay(5);assert.equal(await x.reader.read('ecmwf',{lat:22,lon:120},ts),8000);await check;}finally{x.reader.destroy();}
});
test('invalid data times out and leaves a reason instead of invented visibility',async()=>{
 const x=setup(async()=>tile(-1),{},{timeoutMs:25});try{await assert.rejects(x.reader.read('ecmwf',point,ts),/逾時.*無效/);}finally{x.reader.destroy();}
});
test('close cancels hung downloader and abort signal',async()=>{
 let signal;const x=setup(async(url,s)=>{signal=s;return new Promise(()=>{});});const p=x.reader.read('ecmwf',point,ts);const check=assert.rejects(p,/取消/);await delay(5);x.reader.destroy();await check;assert.equal(signal.aborted,true);await assert.rejects(x.reader.read('ecmwf',point,ts),/已關閉/);
});
test('mismatched rendering parameters cannot read another layer',async()=>{
 const x=setup(async()=>{throw Error('must not load');},{createFullRenderingParams:async()=>({product:'ecmwf',layer:'rh',fullPath:'x'})});await assert.rejects(visibilityFromWindy(x.deps,'ecmwf',point,ts),/不符/);x.reader.destroy();
});
test('Mercator coordinates match Taipei tile and wrap antimeridian',()=>{
 const p=pointTile(point,3);assert.deepEqual(p.coords,{x:6,y:3,z:3});assert.ok(p.x>0&&p.x<256);assert.deepEqual(pointTile({lat:0,lon:180},3).coords,{x:0,y:4,z:3});assert.throws(()=>pointTile({lat:90,lon:0},3),/涵蓋範圍/);
});
test('bilinear decode uses metadata scaling and transforms each corner before weighting',()=>{
 const data=tile(1000);data.header.decoderRstep=100;const set=(x,y,r)=>data.pixels[(y*257+x)*4]=r;set(0,0,0);set(1,0,1);set(0,1,2);set(1,1,3);
 assert.equal(sampleVisibility(data,{x:.5,y:.5},{}),1150);assert.equal(sampleVisibility(data,{x:.5,y:.5},{transformR:x=>x*2}),2300);
 data.pixels[3]=0;assert.throws(()=>sampleVisibility(data,{x:.5,y:.5},{PNGtransparency:true}),/缺值/);
});
test('CPU tile loader caches data and closes image without using WebGL',async()=>{
 let downloads=0,closed=0;const data=tile(),rgba=new Uint8Array(257*265*4);rgba.set(data.pixels,257*8*4);
 const loader=createVisibilityTileLoader({fetchImageBlob:async()=>{downloads++;return {valid:true,blob:{}};},rawDataToCanvasImageSource:async()=>({width:257,height:265,close:()=>closed++}),getImageData:async()=>rgba,decodeHeader:()=>[15300,15300],processHeader:()=>data.header,decodeImageBytesCompact:r=>r.slice(257*8*4)});
 try{assert.equal(sampleVisibility(await loader.loadTile('https://ims.windy.com/test',new AbortController().signal),{x:0,y:0},{}),15300);await loader.loadTile('https://ims.windy.com/test');assert.equal(downloads,1);assert.equal(closed,1);}finally{loader.destroy();}
});
test('CPU downloader exposes HTTP failure without attempting image decode',async()=>{
 const loader=createVisibilityTileLoader({fetchImageBlob:async()=>({valid:false,message:'Got status 404'})});try{await assert.rejects(loader.loadTile('x'),/404/);}finally{loader.destroy();}
});

import {createForecastModelSelector,visibilityModel} from '../src/model-selection.mjs';
import {normalise,metar} from '../src/core.mjs';import {fixture} from './fixture.mjs';
test('radar and satellite preserve previous forecast model without map writes',()=>{
 let product='gfs';const choose=createForecastModelSelector({get:()=>product},['ecmwf','gfs','icon']);assert.equal(choose(),'gfs');product='radar';assert.equal(choose(),'gfs');product='satellite';assert.equal(choose(),'gfs');product='icon';assert.equal(choose(),'icon');
 const first=createForecastModelSelector({get:()=> 'satellite'},['ecmwf','gfs']);assert.equal(first(),'ecmwf');
});
test('visibility unavailable in selected model uses supported ECMWF with explicit source',()=>{
 const products={gfs:{overlays:['wind']},ecmwf:{overlays:['visibility']},icon:{overlays:['visibility']}};assert.equal(visibilityModel('gfs',products),'ecmwf');assert.equal(visibilityModel('icon',products),'icon');
 const w={...normalise(fixture(),ts),visibility:15300,visibilitySource:'ecmwf'};assert.match(metar(w),/VIS_MODEL_ECMWF/);
});
