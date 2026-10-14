import {valid,fmt,windCode,clock} from './core.mjs';
export const compassNames=['北','北北東','東北','東北東','東','東南東','東南','南南東','南','南南西','西南','西南西','西','西北西','西北','北北西'];
export const compass=deg=>valid(deg)?compassNames[Math.floor((((deg%360)+360)%360+11.25)/22.5)%16]:'未提供';
export const windDirection=(deg,speed)=>valid(speed)&&speed<0.257222?'靜風':valid(deg)?`${compass(deg)}風（${fmt(((deg%360)+360)%360,0)}°）`:'風向未提供';
export function beaufort(speed){if(!valid(speed)||speed<0)return undefined;return [0.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7].filter(x=>speed>=x).length;}
export const speedText=(value,unit)=>valid(value)&&value>=0?`${fmt(value*({kt:1.943844,'m/s':1,'km/h':3.6}[unit]??1),unit==='m/s'?2:1)} ${unit}`:'未提供';
export const upperWind=x=>windCode(x.wind,x.dir);
export const catText=value=>!valid(value)||value<0?'未提供':`${value>=79?'極強':value>=44?'強':value>=20?'中度':value>=15?'輕度':'未達輕度門檻'}`;
export function sampleChannels({pixels,width=257,height=257,header},position,params,channels=['R']){
 if(width!==257||height!==257||pixels?.length!==257*257*4)throw Error('Windy 資料圖磚格式無效');
 const x=Math.min(256,Math.max(0,position.x)),y=Math.min(256,Math.max(0,position.y)),x0=Math.floor(x),y0=Math.floor(y),dx=x-x0,dy=y-y0;
 return channels.map(channel=>{
  const min=header?.['decoder'+channel+'min'],step=header?.['decoder'+channel+'step'],index={R:0,G:1,B:2}[channel],transform=params['transform'+channel];
  if(!valid(min)||!valid(step)||step<0)throw Error('Windy 圖磚通道無效');
  const value=(px,py)=>{const i=(py*257+px)*4;if((params.JPGtransparency&&pixels[i+2]>=192)||(params.PNGtransparency&&pixels[i+3]<1))throw Error('此地點無可用資料（陸地／海岸遮罩或資料缺值）');const raw=pixels[i+index]*step+min,result=transform?transform(raw):raw;if(!valid(result))throw Error('Windy 數值無效');return result;};
  // Do not reject masked corners with zero weight at exact grid locations.
  let result=0;for(const [px,py,weight] of [[x0,y0,(1-dx)*(1-dy)],[Math.min(256,x0+1),y0,dx*(1-dy)],[x0,Math.min(256,y0+1),(1-dx)*dy],[Math.min(256,x0+1),Math.min(256,y0+1),dx*dy]])if(weight>0)result+=value(px,py)*weight;
  return result;
 });
}
const directionFrom=(u,v)=>((Math.atan2(u,v)*180/Math.PI+180)%360+360)%360;
export function decodedLayer(layer,channels){
 if(layer==='waves'){const [u,v,height]=channels;if(!valid(height)||height<0)throw Error('浪高無效');return {height,dir:Math.hypot(u,v)>1e-6?directionFrom(u,v):undefined};}
 if(layer==='currents'||layer==='wind'){const [u,v]=channels;return {speed:Math.hypot(u,v),dir:Math.hypot(u,v)>1e-6?(directionFrom(u,v)+(layer==='currents'?180:0))%360:undefined};}
 const [value]=channels;if(!valid(value)||(layer!=='sst'&&value<0))throw Error('Windy 數值無效');return layer==='sst'?value-273.15:value;
}
export function sourceText(record,offset=0){if(!record)return '正在載入…';if(record.error)return '未提供：'+record.error;return `${record.sourceModel}；資料時間 ${record.path?/^\d{10}$/.test(record.path)?record.path.slice(0,4)+'-'+record.path.slice(4,6)+'-'+record.path.slice(6,8)+' '+record.path.slice(8,10)+':00 UTC':record.path+' UTC':'未提供'}；起報 ${record.refTime??'未提供'}`;}
export function marineLines(state,timestamp,offset=0){
 const records=state.marine??{},r=key=>records[key],v=key=>r(key)?.value,withSource=(key,text)=>text,wind=v('wind'),waves=v('waves'),current=v('currents');
 return [['🚩','地點',state.name],['🧭','經緯度',`${state.lat.toFixed(7)}, ${state.lon.toFixed(7)}`],['🕒','預報時間',`${clock(timestamp,offset,true)}(LST地方時)；${clock(timestamp,0,true)} (UTC)`],['➤','風向／風速及浦福風級',withSource('wind',wind?`${windDirection(wind.dir,wind.speed)}；${speedText(wind.speed,state.seaWind)}；${beaufort(wind.speed)} 級`:'未提供')],['🌡','海溫',withSource('sst',valid(v('sst'))?`${fmt(v('sst'))} °C`:'未提供')],['🌊','波浪浪向／浪高',withSource('waves',waves?`${valid(waves.dir)?compass(waves.dir)+'方來浪（'+fmt(waves.dir,0)+'°）':'浪向未提供'}；有效波高 ${fmt(waves.height)} m`:'未提供')],['🌊','海流流向／流速',withSource('currents',current?`${valid(current.dir)?'流向'+compass(current.dir)+'方（'+fmt(current.dir,0)+'°）':'靜流／流向未提供'}；${speedText(current.speed,state.seaCurrent)}`:'未提供')]];
}

// Nominal pressure-altitude labels, independent of forecast geopotential height.
const levelReferences={1000:'400ft',975:'1100ft',950:'1800ft',925:'2500ft',900:'3200ft',850:'5000ft',800:'6500ft',750:'8100ft',700:'10000ft',650:'11800ft',600:'14000ft',550:'16000ft',500:'FL180',450:'FL210',400:'FL240',350:'FL270',300:'FL300',250:'FL340',200:'FL390',150:'FL450'};
export function sortedLevels(levels=[]){return [...levels].filter(x=>/^\d+h$/.test(x.level)&&parseInt(x.level)>=150&&parseInt(x.level)<=1000).sort((a,b)=>parseInt(a.level)-parseInt(b.level));}
export function pressureLevelLine(x){const pressure=parseInt(x.level),alt=levelReferences[pressure];return `${pressure}hPa${alt?'('+alt+')':''}：RH ${valid(x.rh)?fmt(x.rh,0)+'%':'未提供'}；高空風 ${upperWind(x)}`;}
