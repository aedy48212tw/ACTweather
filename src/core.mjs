import {forecastOffset} from './time.mjs';
import {cloudGuidance} from './clouds.mjs';
import * as SunCalc from 'suncalc';
export const valid = x => typeof x === 'number' && Number.isFinite(x);
export const fmt = (x, n=1) => valid(x) ? x.toFixed(n) : '未提供';
export function nearest(ts, t) { if (!ts?.length) throw Error('預報時間序列為空'); return ts.reduce((b,x,i)=>Math.abs(x-t)<Math.abs(ts[b]-t)?i:b,0); }
export function normalise(payload, t, localOffset) {
 const d=payload.data, ts=d?.ts;
 if(!Array.isArray(ts)||!ts.length||!ts.every(valid)) throw Error('Windy 回傳格式不符：缺少有效的 data.ts');
 if(t<ts[0]||t>ts.at(-1)) throw Error('所選時間超出此模式可用的預報範圍，請調整 Windy 時間軸');
 const i=nearest(ts,t), m=payload.meteogram, s=payload.sounding;
 const read=(o,k)=>o?.ts?.length ? o[k]?.[nearest(o.ts,ts[i])] : undefined;
 const kelvin=x=>valid(x)?x-273.15:undefined;
 const offset=forecastOffset(payload,t,localOffset);
 const day=x=>new Date(x+offset*1000).toISOString().slice(0,10);
 const ids=ts.map((x,j)=>day(x)===day(t)?j:-1).filter(j=>j>=0);
 const temps=ids.map(j=>kelvin(d.temperature?.[j])).filter(valid);
 const daily=Array.isArray(payload.summary)?payload.summary.find(x=>day(x.timestamp)===day(t)):undefined;
 const stepHours=j=>{const hours=((j>0?ts[j]-ts[j-1]:ts[1]-ts[0])/3600000);return valid(hours)&&hours>0?hours:undefined;};
 const rows=ids.map(j=>({hours:stepHours(j),ts:ts[j],temp:kelvin(d.temperature?.[j]),wind:d.wind?.[j],dir:d.windDir?.[j],rain:d.precipAmount?.[j],icon:d.icon?.[j]}));
 const rh=read(s,'rh-surface');
 const dew=kelvin(read(m,'dewPoint')??read(s,'dewPoint-surface'));
 const temp=kelvin(d.temperature?.[i]);
 const humidity=valid(rh)?rh:valid(temp)&&valid(dew)?Math.min(100,100*Math.exp(17.625*dew/(243.04+dew)-17.625*temp/(243.04+temp))):undefined;
 return {requestedTs:t,ts:ts[i],offset,day:day(t),temp,dew,humidity,wind:d.wind?.[i],dir:d.windDir?.[i],gust:d.windGust?.[i],pressure:valid(d.pressure?.[i])?d.pressure[i]/100:undefined,cloudBase:read(m,'cloudBase'),icon:d.icon?.[i],rain:d.precipAmount?.[i],rainHours:stepHours(i),rainRate:valid(d.precipAmount?.[i])&&valid(stepHours(i))?d.precipAmount[i]/stepHours(i):undefined,visibility:valid(d.visibility?.[i])?d.visibility[i]:read(m,'visibility'),rainDaily:rows.every(x=>valid(x.rain))?rows.reduce((a,x)=>a+x.rain,0):undefined,max:valid(daily?.tempMax)?kelvin(daily.tempMax):temps.length?Math.max(...temps):undefined,min:valid(daily?.tempMin)?kelvin(daily.tempMin):temps.length?Math.min(...temps):undefined,hasSummary:!!daily,rows,header:payload.header??{},cloudLayers:['925h','850h','700h','500h'].map(level=>({level,rh:read(s,'rh-'+level),height:read(s,'gh-'+level)??read(m,'gh-'+level)})),levels:Object.keys(s??{}).filter(k=>/^rh-\d+h$/.test(k)).map(k=>({level:k.slice(3),rh:read(s,k),height:read(s,k.replace('rh-','gh-')),wind:read(s,k.replace('rh-','wind-')),dir:read(s,k.replace('rh-','windDir-'))})).filter(x=>valid(x.height)&&valid(x.rh)&&x.height>=(payload.header?.elevation??0))};
}
export function clock(t, offset=0, date=false) { if(!valid(t))return '當日無事件／未提供'; return new Date(t+offset*1000).toISOString().slice(date?0:11,date?16:16).replace('T',' '); }
export function astronomy(day,offset,lat,lon,timestamp) {
 const noon=new Date(Date.parse(day+'T12:00:00Z')-offset*1000);
 const sun=SunCalc.getTimes(noon,lat,lon);
 const start=Date.parse(day+'T00:00:00Z')-offset*1000,end=start+86400000;
 const moons=[-1,0,1,2].map(n=>SunCalc.getMoonTimes(new Date(start+n*86400000),lat,lon));
 const event=k=>moons.map(m=>m[k]?.getTime()).find(t=>valid(t)&&t>=start&&t<end);
 let lunar='未提供';try {lunar=new Intl.DateTimeFormat('zh-TW-u-ca-chinese',{timeZone:'UTC',month:'long',day:'numeric'}).format(new Date(noon.getTime()+offset*1000));}catch{}
 return {sun:`${clock(sun.sunrise?.getTime(),offset)} – ${clock(sun.sunset?.getTime(),offset)}`,moon:`月出 ${clock(event('rise'),offset)}；月沒 ${clock(event('set'),offset)}；農曆 ${lunar}；月照 ${fmt(SunCalc.getMoonIllumination(new Date(valid(timestamp)?timestamp:noon.getTime())).fraction*100)}%`};
}
export function windCode(speed,dir,gust) {
 if(!valid(speed))return '/////KT'; const kt=Math.round(speed*1.943844); if(kt===0)return '00000KT';
 const direction=valid(dir)?String(Math.round(((dir%360)+360)%360/10)*10||360).padStart(3,'0'):'///';
 return `${direction}${String(kt).padStart(2,'0')}${valid(gust)&&gust-speed>=5.14444?'G'+String(Math.round(gust*1.943844)).padStart(2,'0'):''}KT`;
}
const tc=x=>valid(x)?(Math.round(x)<0?'M':'')+String(Math.abs(Math.round(x))).padStart(2,'0'):'//';
export function metar(w,manual={}) {
 const stamp=new Date(w.ts).toISOString().slice(8,16).replace(/[-T:]/g,'')+'Z';
 const manualQ=valid(manual.qnh)&&manual.qnh>=800&&manual.qnh<=1100;
 const q=manualQ?manual.qnh:valid(w.pressure)&&w.pressure>0?w.pressure:undefined;
 const manualVisibility=valid(manual.visibility)&&manual.visibility>=0&&manual.visibility<=9999;
 const visibilityValue=manualVisibility?manual.visibility:w.visibility;
 const vis=valid(visibilityValue)&&visibilityValue>=0?String(Math.floor(visibilityValue/ (visibilityValue<800?50:visibilityValue<5000?100:1000))*(visibilityValue<800?50:visibilityValue<5000?100:1000)).padStart(4,'0'): '////';
 const visibility=(manualVisibility&&visibilityValue===9999)||visibilityValue>=10000?'9999':vis;
 const manualClouds=/^(?:(?:FEW|SCT|BKN|OVC)\d{3}|VV\d{3})(?: (?:FEW|SCT|BKN|OVC)\d{3})*$/.test(manual.clouds??'');
 const clouds=manualClouds?manual.clouds:cloudGuidance(w).groups||'//////';
 const rain=rainDescription(w.rainRate,w.icon);
 const station=/^[A-Z]{4}$/.test(manual.station??'')?manual.station:'////';
 return `FORECAST METAR ${station} ${stamp} ${windCode(w.wind,w.dir,w.gust)} ${visibility}${rain.code?' '+rain.code:''} ${clouds} ${tc(w.temp)}/${tc(w.dew)} ${valid(q)?'Q'+String(Math.floor(q)).padStart(4,'0'):'Q////'} RMK MODEL FORECAST NOT OBSERVATION${valid(q)&&!manualQ?' Q_FROM_MODEL_PRESSURE':''}${!manualClouds&&cloudGuidance(w).estimated?' CLOUD_FROM_RH':''}${!manualVisibility&&valid(w.visibility)?' VIS_FROM_WINDY'+(w.visibilitySource&&/^[a-zA-Z0-9]+$/.test(w.visibilitySource)?' VIS_MODEL_'+w.visibilitySource.toUpperCase():''):''}${valid(w.rainRate)?' RAIN_RATE_'+w.rainRate.toFixed(1)+'MMH':''}${valid(q)?' A'+String(Math.round(q/33.863886666667*100)).padStart(4,'0'):''}`;
}
export const sky=icon=>({1:'晴朗',2:'晴時多雲',3:'多雲',4:'陰天',5:'晴時多雲有雨',6:'多雲有雨',7:'陰天有雨',8:'晴時多雲有雪',9:'多雲有雪',10:'陰天有雪',11:'晴時多雲有雨雪',12:'多雲有雨雪',13:'陰天有雨雪',14:'陰天有雷雨',15:'陰天有雷雪',16:'雷雨雪',17:'霧',18:'晴時多雲有陣雨',19:'多雲有陣雨',20:'陰天有陣雨',21:'多雲有雷雨',22:'晴、有霧',23:'陰天有雷暴',24:'多雲有雷暴'}[icon]??'未提供');

export function rainDescription(rate,icon){
 if(!valid(rate)||rate<0)return {text:'未提供雨勢',code:''};
 if(rate===0)return {text:'無降雨',code:''};
 const thunder=[14,16,21,23,24].includes(icon);
 const rain=thunder?'雷雨':'雨',code=thunder?'TSRA':'RA';
 if(rate<=1)return {text:'偶小'+rain,code:'-'+code};
 if(rate<3)return {text:'小'+rain,code:'-'+code};
 if(rate<40)return {text:'中'+rain,code};
 return {text:'大'+rain,code:'+'+code};
}
