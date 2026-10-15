// Forecast field keys remain stable across interface languages.
export const fieldProducts={
 '氣壓':{overlay:'pressure',label:'氣壓',en:'Pressure',note:'圖層為模式海平面氣壓；人工QNH與A值換算不會寫入Windy。',noteEn:'The layer shows model sea-level pressure; manual QNH and converted A values are not written to Windy.'},
 '氣溫':{overlay:'temp',label:'氣溫',en:'Temperature'},
 '雲量分布':{overlay:'rh',level:'925h',label:'相對濕度',en:'Relative humidity',note:'雲層依925、850、700、500 hPa的RH推估；目前顯示925 hPa。',noteEn:'Cloud layers are estimated from RH at 925, 850, 700 and 500 hPa; the map shows 925 hPa.'},
 '天空狀況':{overlay:'clouds',label:'雲',en:'Clouds',note:'天空狀況由模式天氣圖示判讀；雲圖層供參考。',noteEn:'Sky conditions are derived from the model weather icon; the clouds layer is a reference.'},
 '風向／風速':{overlay:'wind',label:'風速',en:'Wind'},
 '能見度':{overlay:'visibility',label:'能見度',en:'Visibility'},
 '降雨':{overlay:'rain',label:'降雨、雷暴',en:'Rain, thunder',acRange:3},
 '結冰高度':{overlay:'deg0',label:'結冰高度',en:'Freezing level'},
 '晴空亂流':{overlay:'turbulence',level:'500h',label:'晴空亂流',en:'Turbulence',note:'目前顯示500 hPa；欄位數值為850–300 hPa範圍最大值，兩者可能不同。',noteEn:'The map shows 500 hPa; the field is the maximum over 850–300 hPa and may differ.'},
 '風向／風速及浦福風級':{overlay:'wind',label:'風速',en:'Wind',note:'浦福風級由模式風速換算。',noteEn:'Beaufort force is calculated from model wind speed.'},
 '海溫':{overlay:'sst',label:'海溫',en:'Sea temperature',models:['ecmwfAnalysis'],analysis:true,note:'海溫為最新分析值，非逐時海溫預報。',noteEn:'Sea temperature is the latest analysis, not an hourly forecast.'},
 '波浪浪向／浪高':{overlay:'waves',label:'波浪',en:'Waves',models:['ecmwfWaves','gfsWaves']},
 '海流流向／流速':{overlay:'currents',label:'洋流',en:'Currents',models:['cmems']},
 'profile-rh':{overlay:'rh',label:'相對濕度',en:'Relative humidity'},
 'profile-wind':{overlay:'wind',label:'高空風',en:'Upper winds'}
};
const explanations={
 '日出／日沒':['SunCalc 天文估算','SunCalc astronomical calculations'],
 '月出／月沒':['SunCalc 天文估算（月出、月沒與月照）','SunCalc astronomical calculations (moonrise, moonset and illumination)'],
 '雲幕':['925、850、700、500 hPa相對濕度推估最低BKN雲層','the lowest estimated BKN layer from RH at 925, 850, 700 and 500 hPa'],
 '地點':['使用者所選地點資訊提供','the selected location information'],
 '經緯度':['使用者所選座標提供','the selected coordinates'],
 '預報時間':['Windy時間軸提供','the Windy timeline'],
 '參考模式':['Windy模式資料提供','Windy model metadata'],
 '海拔':['Windy地形資料提供','Windy terrain data'],
 '資料更新':['本機系統記錄的資料讀取時間提供','the system-recorded data retrieval time'],
 'FORECAST METAR':['模式預報及人工補充資料彙整，非正式METAR觀測','model forecasts and manual inputs; this is not an official METAR observation']
};
export function fieldExplanation(key,language='zh'){
 const source=explanations[key]??['模式資料彙整或換算','model data summarization or conversion'];
 return language==='en'?`No corresponding Windy product. Source: ${source[1]}.`:`該資料無 Windy 對應產品，由${source[0]}${['日出／日沒','月出／月沒','雲幕'].includes(key)?'而來':'。'}`.replace(/而來$/,'而來。');
}
export function createFieldNavigator({store,products},{timeoutMs=15000}={}){
 let active=false,closed=false;
 async function show(key,{model='ecmwf',level}={}){
  if(closed)throw Error('ACTweather 已關閉');if(active)throw Error('圖層正在切換，請稍候');
  const spec=fieldProducts[key];if(!spec)return {kind:'info',key};
  const candidates=spec.models??[model,'ecmwf','gfs'];
  const source=[...new Set(candidates)].find(name=>products?.[name]?.overlays?.includes(spec.overlay));
  if(!source)throw Error('Windy目前未提供此產品或可用模式');
  const old=Object.fromEntries(['overlay','product','level','timestamp','acRange'].map(k=>[k,store.get(k)]));
  const requestedLevel=level??spec.level??'surface';
  let timer;active=true;
  // Keep one transaction active until the underlying setters settle, even on timeout.
  let timedOut=false,changed=false;
  const work=(async()=>{
   try{
    if(closed||timedOut)throw Error('圖層切換已取消');
    const calendar=await products[source].getCalendar?.();
    if(closed||timedOut)throw Error('圖層切換已取消');
    if(!spec.analysis&&calendar?.timestamps?.length&&(old.timestamp<calendar.timestamps[0]||old.timestamp>calendar.timestamps.at(-1)))throw Error('所選時間超出此產品可用範圍');
    for(const [k,v] of [['overlay',spec.overlay],['product',source],['level',requestedLevel],...(spec.acRange?[['acRange',spec.acRange]]:[])]){
     if(closed||timedOut)throw Error('圖層切換已取消');changed=true;await store.set(k,v);
    }
    if(!spec.analysis&&old.timestamp!==undefined)await store.set('timestamp',old.timestamp);
    if(closed||timedOut)throw Error('圖層切換已取消');
    if(store.get('overlay')!==spec.overlay||store.get('product')!==source||store.get('level')!==requestedLevel)throw Error('此模式不支援所選產品或高度層');
    if(!spec.analysis&&store.get('timestamp')!==old.timestamp)throw Error('Windy調整了預報時間，請更換時段');
    return {kind:'layer',key,...spec,sourceModel:source,level:requestedLevel,timestamp:store.get('timestamp')};
   }catch(error){
    if(changed)for(const k of ['overlay','product','level','acRange','timestamp'])if(old[k]!==undefined)await store.set(k,old[k]);
    throw error;
   }finally{clearTimeout(timer);active=false;}
  })();
  return Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>{timedOut=true;reject(Error('圖層切換逾時，正在復原原設定'));},timeoutMs);})]);
 }
 return {show,busy:()=>active,destroy(){closed=true;}};
}
