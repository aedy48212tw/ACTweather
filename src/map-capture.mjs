import {screenshotRange} from './card-style.mjs';
import {windyLegend} from './card-legend.mjs';
// Real Windy canvas capture; never substitute a synthetic map on failure.
export const cardProducts=[
 {overlay:'rain',label:'降雨、雷暴',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'wind',label:'風速',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'clouds',label:'雲',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'visibility',label:'能見度',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'sst',label:'海溫',candidates:()=>['ecmwfAnalysis']},
 {overlay:'waves',label:'波浪',candidates:()=>['ecmwfWaves','gfsWaves']},
 {overlay:'currents',label:'洋流',candidates:()=>['cmems']},
 {overlay:'swell1',label:'湧浪',candidates:()=>['ecmwfWaves','gfsWaves']}
];
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
export function cardBounds(point,range=2){range=screenshotRange(range);if(!Number.isFinite(point.lat)||!Number.isFinite(point.lon)||Math.abs(point.lat)>90||Math.abs(point.lon)>180)throw Error('圖卡地點無效');if(Math.abs(point.lat)+range>85.05112878)throw Error('此極區無法完整擷取所設定範圍的Mercator地圖');return [[point.lon-range,point.lat-range],[point.lon+range,point.lat+range]];}
export function cropRectangle(gl,canvas,bounds){const [nw,se]=[gl.project([bounds[0][0],bounds[1][1]]),gl.project([bounds[1][0],bounds[0][1]])];const container=gl.getContainer(),size=container.getBoundingClientRect(),width=canvas.clientWidth||container.clientWidth||size.width,height=canvas.clientHeight||container.clientHeight||size.height,sx=canvas.width/width,sy=canvas.height/height;const r={x:nw.x*sx,y:nw.y*sy,width:(se.x-nw.x)*sx,height:(se.y-nw.y)*sy};if(!Object.values(r).every(Number.isFinite)||r.width<2||r.height<2||r.x<-.5||r.y<-.5||r.x+r.width>canvas.width+.5||r.y+r.height>canvas.height+.5)throw Error('指定範圍未完整呈現在地圖中');return r;}
// Windy 51.x public MapLibre style layers expose their custom implementation.
// Its switchable cache must have switched AND every renderable tile must be valid.
// redrawFinished alone also fires when renderer parameters change, before tiles load.
export function fitCaptureBounds(gl,bounds,attempt=0){
 gl.stop?.();gl.resize?.();gl.setPadding?.({top:0,bottom:0,left:0,right:0});
 const options={padding:24+attempt*16,duration:0,bearing:0,pitch:0,offset:[0,0],retainPadding:false};
 // cameraForBounds can carry previous host padding on mobile unless it is reset first.
 const camera=gl.cameraForBounds?.(bounds,options);
 if(camera)gl.jumpTo({...camera,bearing:0,pitch:0,padding:{top:0,bottom:0,left:0,right:0},retainPadding:false});
 else gl.fitBounds(bounds,options);
}
export function weatherCanvasReady(gl,overlay,product){
 const implementation=(gl.getLayersOrder?.()??[]).map(id=>gl.getLayer(id)?.implementation).find(layer=>layer?.switchableCache);
 if(!implementation)throw Error('Windy氣象圖層截圖介面不可用，請更新Windy後重試');
 const cache=implementation.switchableCache;
 if(implementation._currentOverlay!==overlay||implementation._latestParams?.product!==product||cache._nextCache)return false;
 const coords=cache.getRenderableCoords();return coords.length>0&&coords.every(c=>cache.hasTile(c)&&cache.getTile(c)?.valid===true);
}
export function createWindyCapture({store,bcast,map,products,legendAPI,document:doc=globalThis.document},{timeoutMs=25000}={}){
 let busy=false,closed=false,active=null;
 const status=()=>busy;
 async function capture(snapshot,{signal,onProgress=()=>{}}={}){
  if(closed)throw Error('ACTweather 已關閉');if(busy)throw Error('圖卡正在產生');
  const gl=map?.maplibreMap;if(!gl?.getCanvas||!gl?.fitBounds||!gl?.project)throw Error('目前Windy未提供可截圖的MapLibre地圖');
  const bounds=cardBounds(snapshot.point,snapshot.range);
  const controller=new AbortController();active=controller;const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
  const keys=['product','overlay','level','timestamp','animation','acRange','isolinesOn'];
  const saved=Object.fromEntries(keys.map(k=>[k,clone(store.get(k))]));
  const camera={center:clone(gl.getCenter()),zoom:gl.getZoom(),bearing:gl.getBearing(),pitch:gl.getPitch(),...(gl.getPadding?{padding:clone(gl.getPadding())}:{})},projection=gl.getProjection?.();
  const images=[];let completed=false;busy=true;
  async function set(key,value){if(value!==undefined)await store.set(key,value);}
  function check(){if(controller.signal.aborted)throw Error('已取消圖卡下載');}
  function renderCrop(item,sourceModel){return new Promise((resolve,reject)=>{
   let timer,fitAttempts=0,settled=0;const done=(error,value)=>{clearTimeout(timer);gl.off('render',render);controller.signal.removeEventListener('abort',cancel);error?reject(error):resolve(value);};
   const cancel=()=>done(Error('已取消圖卡下載'));
   const render=()=>{try{check();if(gl.areTilesLoaded?.()===false||gl.isStyleLoaded?.()===false||!weatherCanvasReady(gl,item.overlay,sourceModel))return;
    const original=gl.getCanvas();let r;
    try{r=cropRectangle(gl,original,bounds);}catch(error){
     if(fitAttempts++>=4)throw error;
     fitCaptureBounds(gl,bounds,fitAttempts);settled=0;gl.triggerRepaint();return;
    }
    // Host resize/progress updates can race with the first render. Require another stable frame.
    if(settled++===0){gl.triggerRepaint();return;}
    const canvas=doc.createElement('canvas');
    // Bound memory on mobile; no change to the geographic crop.
    const scale=Math.min(1,900/Math.max(r.width,r.height));canvas.width=Math.max(1,Math.round(r.width*scale));canvas.height=Math.max(1,Math.round(r.height*scale));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('瀏覽器無法建立圖卡畫布');
    ctx.drawImage(original,r.x,r.y,r.width,r.height,0,0,canvas.width,canvas.height);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let visible=0,variation=0;const first=pixels.slice(0,4);for(let i=0;i<pixels.length;i+=Math.max(4,Math.floor(pixels.length/4000/4)*4)){if(pixels[i+3]>0)visible++;if(Math.abs(pixels[i]-first[0])+Math.abs(pixels[i+1]-first[1])+Math.abs(pixels[i+2]-first[2])>8)variation++;}
    if(visible<10||variation<10)throw Error('Windy截圖是空白，請確認WebGL及圖層已載入');
    done(null,canvas);
   }catch(e){done(Error('無法擷取Windy圖片：'+e.message));}};
   gl.on('render',render);controller.signal.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>done(Error('Windy地圖截圖逾時')),timeoutMs);if(controller.signal.aborted)cancel();else gl.triggerRepaint();
  });}
  async function selectLayer(item,sourceModel){
   // Preload calendar before entering Windy's asynchronous store setter.
   let timer,cancel;
   const calendar=await Promise.race([Promise.resolve().then(()=>products[sourceModel].getCalendar?.()),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(item.label+'模式時間載入逾時')),timeoutMs);cancel=()=>reject(Error('已取消圖卡下載'));controller.signal.addEventListener('abort',cancel,{once:true});if(controller.signal.aborted)cancel();})]).finally(()=>{clearTimeout(timer);controller.signal.removeEventListener('abort',cancel);});
   if(item.overlay!=='sst'&&calendar?.timestamps?.length&&(snapshot.timestamp<calendar.timestamps[0]||snapshot.timestamp>calendar.timestamps.at(-1)))throw Error(item.label+'不支援所選預報時間，請更換時間後重試');
   let cleanup;const ready=new Promise((resolve,reject)=>{
    let timer;const finish=error=>{clearTimeout(timer);bcast.off('redrawFinished',loaded);controller.signal.removeEventListener('abort',cancel);error?reject(error):resolve();};
    const loaded=params=>{if(params?.overlay===item.overlay&&params?.product===sourceModel&&params?.level==='surface'&&store.get('overlay')===item.overlay&&store.get('product')===sourceModel)finish();};
    const cancel=()=>finish(Error('已取消圖卡下載'));cleanup=()=>finish(Error('圖層切換失敗'));
    bcast.on('redrawFinished',loaded);controller.signal.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>finish(Error(item.label+'圖層載入逾時')),timeoutMs);
    if(controller.signal.aborted)cancel();
   });ready.catch(()=>{});
   try{check();await set('overlay',item.overlay);await set('product',sourceModel);await set('level','surface');await set('timestamp',snapshot.timestamp);if(item.overlay!=='sst'&&store.get('timestamp')!==snapshot.timestamp)throw Error(item.label+'預報時間被Windy調整，請更換時間後重試');await set('acRange',3);await set('isolinesOn',false);bcast.emit('redrawLayers',{noCache:false});await ready;check();fitCaptureBounds(gl,bounds);return await renderCrop(item,sourceModel);}catch(error){cleanup?.();throw error;}
  }
  try{
   check();await set('animation',false);if(projection?.type&&projection.type!=='mercator')gl.setProjection({type:'mercator'});
   fitCaptureBounds(gl,bounds);
   for(let i=0;i<cardProducts.length;i++){
    check();const item=cardProducts[i],sourceModel=item.candidates(snapshot.model).find(m=>products?.[m]?.overlays?.includes(item.overlay));
    if(!sourceModel)throw Error('Windy未提供'+item.label+'圖層');
    onProgress({index:i,total:8,label:item.label});const canvas=await selectLayer(item,sourceModel);const layer=gl.getLayersOrder?.().map(id=>gl.getLayer(id)?.implementation).find(x=>x?.switchableCache),path=String(layer?._latestParams?.path??'');const ts=/^\d{10}$/.test(path)?Date.UTC(+path.slice(0,4),+path.slice(4,6)-1,+path.slice(6,8),+path.slice(8,10)):store.get('timestamp');let legend;try{legend=windyLegend(item.overlay,{...legendAPI,document:doc});}catch(e){canvas.width=canvas.height=1;throw e;}images.push({canvas,legend,label:item.label,overlay:item.overlay,sourceModel,timestamp:ts});
   }
   completed=true;return {images,bounds,attribution:doc.querySelector('.maplibregl-ctrl-attrib-inner,.leaflet-control-attribution')?.textContent?.trim()||'Windy.com'};
  }finally{
   let restoreError;
   // Always restore, including cancellation, unsupported products and canvas errors.
   for(const key of ['overlay','product','level','acRange','isolinesOn','timestamp'])try{await set(key,saved[key]);}catch(e){restoreError=e;}
   try{if(projection?.type&&projection.type!=='mercator')gl.setProjection(projection);gl.jumpTo(camera);}catch(e){restoreError=e;}
   try{await set('animation',saved.animation);}catch(e){restoreError=e;}
   if(!completed)for(const item of images)item.canvas.width=item.canvas.height=1;
   signal?.removeEventListener('abort',abort);busy=false;active=null;
   if(restoreError)throw Error('地圖恢復失敗，請重新選取原圖層：'+restoreError.message);
  }
 }
 return {capture,busy:status,destroy(){closed=true;active?.abort();}};
}
