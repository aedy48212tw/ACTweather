// Read-only QA of downloaded Windy data; never imported by the plugin.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {pointTile,sampleVisibility,createVisibilityTileLoader} from '../src/visibility-tiles.mjs';import {sampleChannels,decodedLayer} from '../src/extended.mjs';
const source=fs.readFileSync('/tmp/windy-current.js','utf8');
const headerCode=source.match(/function Y_\(e,t\)\{[\s\S]*?return c\}/)?.[0],processCode=source.match(/function X_\(e\)\{return\{[\s\S]*?\}\}/)?.[0];assert.ok(headerCode&&processCode,'official header implementation found');
const official=vm.runInNewContext(headerCode+';'+processCode+';({decodeHeader:Y_,processHeader:X_})');
const downloads=JSON.parse(fs.readFileSync('tests/live-data/downloads.json'));
const results=[];
for(const item of downloads){if(item.error)throw Error(item.error);const layer=item.layer==='turbulence-ecmwf'?'turbulence':item.layer,rgba=new Uint8Array(fs.readFileSync(`tests/live-data/${item.layer}.rgba`));
 const loader=createVisibilityTileLoader({fetchImageBlob:async()=>({valid:true,blob:{}}),rawDataToCanvasImageSource:async()=>({width:257,height:265,close(){}}),getImageData:async()=>rgba,...official,decodeImageBytesCompact:r=>r.slice(257*8*4)});
 const tile=await loader.loadTile(item.url),params={PNGtransparency:['waves','turbulence'].includes(layer),JPGtransparency:['currents','sst'].includes(layer)};
 const channels=['waves'].includes(layer)?['R','G','B']:['currents','wind'].includes(layer)?['R','G']:['R'];
 for(const point of [{name:'Taipei',lat:25.038,lon:121.514},{name:'Offshore',lat:25.5,lon:122}]){
  const location=pointTile(point,3);let value,raw,error;try{raw=sampleChannels(tile,location,params,channels);value=layer==='visibility'?sampleVisibility(tile,location,params):decodedLayer(layer,raw);
   // Independent four-corner weighted reference, without production sampler.
   const x0=Math.floor(location.x),y0=Math.floor(location.y),dx=location.x-x0,dy=location.y-y0;
   for(let j=0;j<channels.length;j++){const c=channels[j],index={R:0,G:1,B:2}[c];let check=0;for(const [x,y,weight] of [[x0,y0,(1-dx)*(1-dy)],[x0+1,y0,dx*(1-dy)],[x0,y0+1,(1-dx)*dy],[x0+1,y0+1,dx*dy]])check+=(tile.pixels[(y*257+x)*4+index]*tile.header['decoder'+c+'step']+tile.header['decoder'+c+'min'])*weight;assert.ok(Math.abs(check-raw[j])<1e-8);}
  }catch(e){error=e.message;if(point.name==='Offshore')throw e;}
  results.push({...item,point,header:tile.header,channels:raw,value,error});
 }
 loader.destroy();
}
fs.writeFileSync('tests/live-tile-check.json',JSON.stringify({checkedAt:new Date().toISOString(),client:'51.3.2.ind.81aa',method:'Pillow RGBA, official header decode, production CPU loader and sampler, independent bilinear reference',results},null,2));
console.log(JSON.stringify(results.map(x=>({layer:x.layer,point:x.point.name,value:x.value,error:x.error})),null,2));
