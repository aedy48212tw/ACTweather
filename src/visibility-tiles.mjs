const finite=x=>typeof x==='number'&&Number.isFinite(x);
// Same Mercator coordinates and 257-point tile grid used by Windy.
export function pointTile(point,zoom){
 if(!finite(point.lat)||!finite(point.lon)||Math.abs(point.lat)>85.05112878||Math.abs(point.lon)>180)throw Error('地點超出能見度圖磚涵蓋範圍');
 if(!Number.isInteger(zoom)||zoom<0||zoom>8)throw Error('能見度圖磚解析度無效');
 const n=2**zoom,lon=(point.lon+180)/360,x=((lon%1)+1)%1*n;
 const sin=Math.sin(point.lat*Math.PI/180),y=Math.min(n-Number.EPSILON,Math.max(0,(0.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*n));
 const tx=Math.floor(x),ty=Math.min(n-1,Math.floor(y));
 return {coords:{x:tx,y:ty,z:zoom},x:(x-tx)*256,y:Math.min(256,(y-ty)*256)};
}
export function sampleVisibility({pixels,width=257,height=257,header},position,params){
 if(width!==257||height!==257||pixels?.length!==257*257*4||!finite(header?.decoderRstep)||!finite(header?.decoderRmin)||header.decoderRstep<0)throw Error('Windy 能見度圖磚格式無效');
 const x=Math.min(256,Math.max(0,position.x)),y=Math.min(256,Math.max(0,position.y));
 const x0=Math.floor(x),x1=Math.min(256,x0+1),y0=Math.floor(y),y1=Math.min(256,y0+1),dx=x-x0,dy=y-y0;
 const value=(px,py)=>{
  const i=(py*257+px)*4;
  if((params.JPGtransparency&&pixels[i+2]>=192)||(params.PNGtransparency&&pixels[i+3]<1))throw Error('此點／時間的能見度缺值');
  const raw=pixels[i]*header.decoderRstep+header.decoderRmin;
  const result=params.transformR?params.transformR(raw):raw;
  if(!finite(result)||result<0)throw Error('Windy 能見度數值無效');return result;
 };
 const a=value(x0,y0),b=value(x1,y0),c=value(x0,y1),d=value(x1,y1);
 const top=a+(b-a)*dx,bottom=c+(d-c)*dx;return top+(bottom-top)*dy;
}
// Download weather data, not the colored screen image. No map renderer required.
export function createVisibilityTileLoader({fetchImageBlob,rawDataToCanvasImageSource,getImageData,decodeHeader,processHeader,decodeImageBytesCompact}){
 const cache=new Map();
 async function loadTile(url,signal){
  const saved=cache.get(url);if(saved&&Date.now()-saved.loaded<60000){cache.delete(url);cache.set(url,saved);return saved.tile;}
  if(signal?.aborted)throw Error('能見度請求已取消');
  const fetched=await fetchImageBlob(url,signal);
  if(!fetched?.valid)throw Error('能見度圖磚下載失敗：'+(fetched?.message??'未回傳資料'));
  let image;
  try{
   image=await rawDataToCanvasImageSource(fetched.blob);
   if(image.width!==257||image.height!==265)throw Error('Windy 能見度資料圖磚尺寸不符');
   const rgba=await getImageData(image);
   if(signal?.aborted)throw Error('能見度請求已取消');
   const header=processHeader(decodeHeader(rgba,image.width));
   const pixels=decodeImageBytesCompact(rgba);
   const tile={pixels,width:257,height:257,header};
   // Validate decoded metadata before caching it.
   if(!finite(header.decoderRmin)||!finite(header.decoderRstep)||header.decoderRstep<0)throw Error('Windy 資料圖磚標頭無效');
   cache.set(url,{tile,loaded:Date.now()});while(cache.size>12)cache.delete(cache.keys().next().value);
   return tile;
  }finally{image?.close?.();}
 }
 return {loadTile,destroy(){cache.clear();}};
}
