import {pointTile,sampleVisibility} from './visibility-tiles.mjs';
import {sampleChannels,decodedLayer} from './extended.mjs';
const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function visibilityValue(raw){const value=Array.isArray(raw)||ArrayBuffer.isView(raw)?raw[0]:raw;return valid(value)?value:undefined;}
export async function visibilityFromWindy({createFullRenderingParams,getDataZoom,loadTile,mapZoom,spec},model,point,timestamp,abort=new AbortController()){
 if(typeof createFullRenderingParams!=='function'||typeof loadTile!=='function')throw Error('Windy 背景能見度介面不可用');
 const layer=spec?.layer??'visibility';
 const weather={product:model,overlay:layer,level:'surface',levelsRange:'850h-300h',acRange:3,isolinesOn:false,isolinesType:'pressure'};
 const params=await createFullRenderingParams(layer,weather,timestamp);
 if(abort.signal.aborted)throw Error('能見度請求已取消');
 if(!params||params.product!==model||params.layer!==layer||params.overlay!==layer||params.level!=='surface'||!params.fullPath)throw Error('能見度模式／圖層參數不符');
 const zoom=getDataZoom(params,Math.round(mapZoom?.()??5)+1);
 const location=pointTile(point,zoom);
 const url=params.fullPath.replace(/<z>|\{z\}/g,String(location.coords.z)).replace(/<x>|\{x\}/g,String(location.coords.x)).replace(/<y>|\{y\}/g,String(location.coords.y));
 const tile=await loadTile(url,abort.signal);
 if(abort.signal.aborted)throw Error('能見度請求已取消');
 if(!spec)return sampleVisibility(tile,location,params);
 const channels=sampleChannels(tile,location,{...params,PNGtransparency:params.PNGtransparency||spec.layer==='waves'},spec.channels);
 return {value:decodedLayer(layer,channels),sourceModel:model,refTime:params.refTime,path:params.path};
}
export function createVisibilityReader(deps,{timeoutMs=20000,retryMs=500}={}){
 let active=null,closed=false;
 function read(model,point,timestamp){
  if(closed)return Promise.reject(Error('ACTweather 已關閉'));
  const key=JSON.stringify([model,point.lat,point.lon,timestamp]);
  if(active?.key===key)return active.promise;
  active?.abort.abort();
  const abort=new AbortController(),job={key,abort,promise:null};active=job;
  job.promise=Promise.resolve().then(async()=>{
   let timer,wakeTimer,lastError='尚未取得資料',cancel;
   const pause=()=>new Promise(resolve=>{
    const done=()=>{clearTimeout(wakeTimer);abort.signal.removeEventListener('abort',done);resolve();};
    if(abort.signal.aborted)return resolve();abort.signal.addEventListener('abort',done,{once:true});wakeTimer=setTimeout(done,retryMs);
   });
   const work=async()=>{
    while(!abort.signal.aborted){
     try{return await visibilityFromWindy(deps,model,point,timestamp,abort);}catch(error){lastError=error.message;}
     await pause();
    }throw Error('能見度請求已取消');
   };
   const cancelled=new Promise((_,reject)=>{cancel=()=>reject(Error('能見度請求已取消'));abort.signal.addEventListener('abort',cancel,{once:true});if(abort.signal.aborted)cancel();});
   const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('能見度載入逾時：'+lastError)),timeoutMs);});
   try{return await Promise.race([work(),cancelled,deadline]);}
   finally{clearTimeout(timer);clearTimeout(wakeTimer);abort.signal.removeEventListener('abort',cancel);abort.abort();}
  }).finally(()=>{if(active===job)active=null;});
  return job.promise;
 }
 return {read,destroy(){closed=true;active?.abort.abort();active=null;}};
}
