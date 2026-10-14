import {cardStyle,defaultCardStyle,screenshotRange} from './card-style.mjs';
const key='ACTweather.cardStyleFavorites';
export function cleanFavorite(value){
 if(!value||typeof value.id!=='string'||!value.id||typeof value.name!=='string'||!value.name.trim())throw Error('喜愛風格資料無效');
 const style=cardStyle(value.style);const background=value.background;
 if(background&&(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(background.data??'')||background.data.length>32*1024*1024))throw Error('喜愛風格底圖資料無效或過大');
 return {id:value.id.slice(0,100),name:value.name.trim().slice(0,60),range:screenshotRange(value.range),style:Object.fromEntries(Object.keys(defaultCardStyle).map(k=>[k,style[k]])),background:background?{name:String(background.name??'喜愛底圖').slice(0,150),data:background.data}:null};
}
export function createStyleFavorites({storage,indexedDB}={}){
 async function transact(mode,operation){const db=await new Promise((resolve,reject)=>{let settled=false;const request=indexedDB.open('ACTweather-card-styles',1);const timer=setTimeout(()=>{settled=true;reject(Error('喜愛風格儲存空間開啟逾時'));},5000);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('styles'))request.result.createObjectStore('styles',{keyPath:'id'});};request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}resolve(request.result);};request.onerror=()=>{clearTimeout(timer);reject(request.error??Error('無法開啟喜愛風格'));};request.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('喜愛風格儲存空間被其他視窗占用'));};});
  return new Promise((resolve,reject)=>{let result;try{const tx=db.transaction('styles',mode);tx.oncomplete=()=>{db.close();resolve(result);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error??Error('喜愛風格未儲存，請檢查瀏覽器儲存空間'));};const req=operation(tx.objectStore('styles'));req.onsuccess=()=>{result=req.result;};}catch(e){db.close();reject(e);}});
 }
 function localList(){if(!storage?.getItem)return [];const rows=JSON.parse(storage.getItem(key)??'[]');if(!Array.isArray(rows))throw Error('喜愛風格清單無效');return rows.map(cleanFavorite);}
 return {async list(){return (indexedDB?await transact('readonly',s=>s.getAll()):localList()).map(cleanFavorite);},async put(value){const record=cleanFavorite(value);if(indexedDB)await transact('readwrite',s=>s.put(record));else{if(!storage?.setItem)throw Error('瀏覽器未允許儲存喜愛風格');const rows=localList().filter(r=>r.id!==record.id);rows.push(record);storage.setItem(key,JSON.stringify(rows));}return record;},async remove(id){if(indexedDB)await transact('readwrite',s=>s.delete(id));else{if(!storage?.setItem)throw Error('瀏覽器未允許刪除喜愛風格');storage.setItem(key,JSON.stringify(localList().filter(r=>r.id!==id)));}}};
}
