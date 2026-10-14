export const defaultPoint={lat:25.038,lon:121.514,name:'中央氣象署 臺北測站'};
export const validPoint=p=>p&&typeof p.lat==='number'&&Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&typeof p.lon==='number'&&Number.isFinite(p.lon)&&Math.abs(p.lon)<=180;
export function coordinates(text){const m=String(text).trim().match(/^([+-]?\d+(?:\.\d+)?)\s*[,，\s]\s*([+-]?\d+(?:\.\d+)?)$/);if(!m)return null;const p={lat:Number(m[1]),lon:Number(m[2]),name:String(text).trim()};if(!validPoint(p))throw Error('請按緯度、經度輸入；緯度 −90～90，經度 −180～180');return p;}
export async function searchPlaces(query,request=globalThis.fetch){
 const coord=coordinates(query);if(coord)return [coord];
 const input=String(query).trim();if(input.length<2)throw Error('請輸入至少兩個字的地名，或緯度、經度');
 const taipei=defaultPoint.name.includes(input.replace('台北','臺北'))||['台北測站','臺北測站','中央氣象署'].includes(input);
 const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:input,count:'8',language:'zh',format:'json'});
 let timer;const controller=new AbortController();
 try{timer=setTimeout(()=>controller.abort(),10000);const response=await request(url.toString(),{signal:controller.signal});if(!response.ok)throw Error('地名服務 HTTP '+response.status);const data=await response.json();const found=(data.results??[]).map(x=>({lat:x.latitude,lon:x.longitude,name:[x.name,x.admin1,x.country].filter(Boolean).join('／')})).filter(validPoint);return taipei?[defaultPoint,...found]:found;}
 catch(error){if(taipei)return [defaultPoint];throw Error('地名搜尋失敗，可改用經緯度：'+error.message);}
 finally{clearTimeout(timer);}
}
export function readFavorites(storage){try{const data=JSON.parse(storage?.getItem('ACTweather.favorites')??'[]');return Array.isArray(data)?data.filter(p=>validPoint(p)&&typeof p.name==='string').slice(0,100):[];}catch{return [];}}
export function writeFavorites(storage,favorites){try{storage?.setItem('ACTweather.favorites',JSON.stringify(favorites));return true;}catch{return false;}}
