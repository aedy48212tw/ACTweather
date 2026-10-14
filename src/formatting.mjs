import {valid,fmt,clock,rainDescription} from './core.mjs';
export const hpaToInHg=q=>valid(q)&&q>0?q/33.863886666667:undefined;
export const hpaToMmHg=q=>valid(q)&&q>0?q/1.33322387415:undefined;
export function pressureValues(w,manual={}) {
 const artificial=valid(manual.qnh)&&manual.qnh>=800&&manual.qnh<=1100;
 const q=artificial?manual.qnh:w.pressure;
 const a=hpaToInHg(q);
 return {q,a,manual:artificial,qCode:valid(a)?'Q'+String(Math.floor(q)).padStart(4,'0'):'Q////',aCode:valid(a)?'A'+String(Math.round(a*100)).padStart(4,'0'):'A////'};
}
export const effectiveTime=w=>`${clock(w.requestedTs??w.ts,w.offset,true)}(LST地方時)；${clock(w.requestedTs??w.ts,0,true)} (UTC)`;
export const modelName=model=>({gfs:'GFS',ecmwf:'ECMWF',icon:'ICON',mblue:'METEOBLUE'}[model]??String(model??'未提供').toUpperCase());
export function rainLine(w){return `${rainDescription(w.rainRate,w.icon).text}；${fmt(w.rain)}mm/${valid(w.rainHours)?w.rainHours+'小時預報':'預報時段未提供'}；當日預報合計${fmt(w.rainDaily)}mm`;}
export {cloudReference,cloudGuidance,cloudLines} from './clouds.mjs';
