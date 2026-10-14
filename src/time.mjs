const finite=x=>typeof x==='number'&&Number.isFinite(x);
// Matches Windy's normal timeline formatter: new Date(timestamp).getHours().
export const browserOffsetSeconds=timestamp=>-new Date(timestamp).getTimezoneOffset()*60;
export function normaliseUtcOffset(value){
 const x=typeof value==='string'&&value.trim()!==''?Number(value):value;
 if(!finite(x))return undefined;
 if(Math.abs(x)<=14)return x*3600;
 if(Math.abs(x)<=840)return x*60;
 return Math.abs(x)<=50400?x:undefined;
}
export function forecastOffset(payload,t,localOffset){
 if(finite(localOffset)&&Math.abs(localOffset)<=50400)return localOffset;
 return normaliseUtcOffset(payload.header?.utcOffset)??browserOffsetSeconds(t);
}
