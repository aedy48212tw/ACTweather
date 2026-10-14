import {createVisibilityReader} from './windy-data.mjs';
export function createOceanPointChecker(getElevation,{timeoutMs=8000}={}){
 let active=null,closed=false;
 function check(point){
  if(closed)return Promise.reject(Error('ACTweather 已關閉'));
  const key=JSON.stringify([point.lat,point.lon]);
  if(active?.key===key)return active.promise;
  active?.abort.abort();const abort=new AbortController();let timer;
  const job={key,abort,promise:null};active=job;
  job.promise=Promise.resolve().then(async()=>{
   if(closed||abort.signal.aborted)throw Error('地形檢查已取消');
   if(typeof getElevation!=='function')throw Error('Windy 地形檢查介面不可用');
   const cancelled=new Promise((_,reject)=>abort.signal.addEventListener('abort',()=>reject(Error('地形檢查已取消／逾時')),{once:true}));
   timer=setTimeout(()=>abort.abort(),timeoutMs);
   const result=await Promise.race([getElevation(point.lat,point.lon,{abortSignal:abort.signal}),cancelled]);
   if(typeof result?.data!=='number'||!Number.isFinite(result.data))throw Error('未取得地形資料，無法確認此點海象適用性');
   if(result.data!==0)throw Error('此點地形高度非零，海象數值不適用；請選擇外海地點');
   return true;
  }).finally(()=>clearTimeout(timer));
  job.promise.catch(()=>{if(active===job)active=null;});
  return job.promise;
 }
 return {check,destroy(){closed=true;active?.abort.abort();active=null;}};
}
export function chooseProduct(products,layer,preferred){
 for(const name of preferred)if(products?.[name]?.overlays?.includes(layer))return name;
 throw Error('Windy 未提供 '+layer+' 產品');
}
export function createIndependentDataAPI(deps,products,{metadataTimeoutMs=12000}={}){
 const readers=new Map(),generations=new Map();let closed=false;
 const ocean=createOceanPointChecker(deps.getElevation);
 const specs={deg0:{channels:['R']},turbulence:{channels:['R']},wind:{channels:['R','G']},sst:{channels:['R']},waves:{channels:['R','G','B']},currents:{channels:['R','G']}};
 async function read(layer,preferred,point,timestamp){
  if(closed)throw Error('ACTweather 已關閉');const generation=(generations.get(layer)??0)+1;generations.set(layer,generation);
  const source=chooseProduct(products,layer,preferred),product=products[source];
  if(['sst','waves','currents'].includes(layer))await ocean.check(point);
  let metadataTimer;const calendar=await Promise.race([Promise.resolve().then(()=>product.getCalendar?.()),new Promise((_,reject)=>{metadataTimer=setTimeout(()=>reject(Error('Windy 模式時間資料載入逾時')),metadataTimeoutMs);})]).finally(()=>clearTimeout(metadataTimer));
  if(closed||generation!==generations.get(layer))throw Error('資料請求已取消');
  if(layer!=='sst'&&calendar?.timestamps?.length&&(timestamp<calendar.timestamps[0]||timestamp>calendar.timestamps.at(-1)))throw Error('所選時間超出 '+source+' 的 '+layer+' 資料範圍');
  let reader=readers.get(layer);if(!reader){reader=createVisibilityReader({...deps,spec:{layer,...specs[layer]}},{timeoutMs:12000,retryMs:1000});readers.set(layer,reader);}
  return reader.read(source,point,timestamp).catch(e=>{throw Error(e.message.replaceAll('能見度',layer));});
 }
 return {read,destroy(){closed=true;ocean.destroy();for(const reader of readers.values())reader.destroy();readers.clear();}};
}
