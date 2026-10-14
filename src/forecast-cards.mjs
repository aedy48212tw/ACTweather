import {translateOwned} from './language.mjs';
import {cardStyle} from './card-style.mjs';
import {clock} from './core.mjs';
export const safeName=name=>String(name||'指定地點').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,60);
export const cardFileNames=(name,ts,language='zh')=>{const base='ACTweather_'+safeName(name)+'_'+new Date(ts).toISOString().slice(0,16).replace(/[-:T]/g,'')+'UTC';return language==='en'?{images:[base+'_01_Weather.png',base+'_02_Marine_METAR.png'],zip:base+'_Forecast_Cards.zip'}:{images:[base+'_01_氣象.png',base+'_02_海象電碼.png'],zip:base+'_兩張預報圖卡.zip'};};
export function wrapLines(ctx,text,width){const result=[];for(const row of String(text).split('\n')){let line='';for(const char of Array.from(row)){if(line&&ctx.measureText(line+char).width>width){result.push(line);line=char;}else line+=char;}result.push(line);}return result;}
function blobOf(canvas){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('圖卡PNG編碼失敗')),'image/png'));}
export const coordinateLabel=(value,lat=false)=>`${Math.abs(lat?value:((value+180)%360+360)%360-180).toFixed(2)}°${(lat?value:((value+180)%360+360)%360-180)<0?(lat?'S':'W'):(lat?'N':'E')}`;
function textLayout(ctx,rows,width,style,initial='act'){
 let section=initial;const out=[];
 for(const row of rows){if(['海象預報','Marine Forecast'].includes(row))section='marine';if(['METAR預報電碼','Forecast METAR Code'].includes(row))section='metar';const size=style[section+'Font'];const title=['ACT預報','海象預報','METAR預報電碼','ACT Forecast','Marine Forecast','Forecast METAR Code'].includes(row);const label=String(row).match(/^\d+\.[^：:\n]+[：:]/)?.[0]??'';const text=String(row);let current=[],lineWidth=0;
  for(const [index,char] of Array.from(text).entries()){
   if(char==='\n'){out.push({runs:current,size});current=[];lineWidth=0;continue;}
   const bold=style.boldTitles&&(title||index<label.length);ctx.font=`${bold?'bold ':''}${size}px sans-serif`;const w=ctx.measureText(char).width;
   if(lineWidth+w>width&&current.length){let cut=current.length;if(/[A-Za-z0-9]/.test(char)){while(cut>0&&/[A-Za-z0-9]/.test(current[cut-1].char))cut--;if(cut===0)cut=current.length;}const rest=current.slice(cut);out.push({runs:current.slice(0,cut),size});current=rest;lineWidth=rest.reduce((a,r)=>{ctx.font=`${r.bold?'bold ':''}${size}px sans-serif`;return a+ctx.measureText(r.char).width;},0);}
   current.push({char,bold});lineWidth+=w;
  }out.push({runs:current,size});
 }return out;
}
function drawTextRows(ctx,rows,x,y,color){ctx.fillStyle=color;for(const row of rows){y+=row.size;let dx=x;for(const run of row.runs){ctx.font=`${run.bold?'bold ':''}${row.size}px sans-serif`;ctx.fillText(run.char,dx,y);dx+=ctx.measureText(run.char).width;}y+=Math.ceil(row.size*.32);}return y;}
function drawLegend(ctx,legend,x,y,w){
 if(!legend?.colors?.length||!legend?.labels?.length)throw Error('截圖缺少Windy產品色階');
 ctx.fillStyle='#fff';ctx.fillRect(x,y,w,30);const gradient=ctx.createLinearGradient(x,y,x+w,y);legend.colors.forEach((c,i)=>gradient.addColorStop(i/(legend.colors.length-1),c));ctx.fillStyle=gradient;ctx.fillRect(x,y,w,30);ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.strokeRect(x,y,w,30);
 ctx.textAlign='center';ctx.font='18px sans-serif';const segment=w/legend.labels.length;
 legend.labels.forEach((label,i)=>{const cx=x+segment*(i+.5);ctx.fillStyle='#fff';ctx.strokeStyle='#17212b';ctx.lineWidth=3;ctx.strokeText(label,cx,y+23,segment-2);ctx.fillText(label,cx,y+23,segment-2);});ctx.textAlign='left';
}
export async function composeCards(snapshot,capture,{document:doc=globalThis.document}={}){
 if(capture.images?.length!==8)throw Error('需完整取得八張Windy圖層截圖');await doc.fonts?.ready;
 const t=text=>translateOwned(text,snapshot.language,[snapshot.point.name]),style=cardStyle(snapshot.style),width=2400,pad=52+style.borderWidth*2,rightX=1260,rightW=width-rightX-pad;
 const measure=doc.createElement('canvas').getContext('2d');if(!measure)throw Error('瀏覽器無法建立圖卡');
 const groups=[snapshot.act.map(t),snapshot.second.map(t)],rows=groups.map(r=>textLayout(measure,r,rightW,style));
 measure.font=`${style.noteStyle==='normal'?'':style.noteStyle+' '}${style.noteSize}px sans-serif`;
 const note=style.note?wrapLines(measure,style.note,style.notePosition==='right'?rightW:width-pad*2):[];
 const noteH=note.length*Math.ceil(style.noteSize*1.35)+(note.length?20:0),headerY=Math.max(64,style.border==='none'?64:style.borderWidth*4+62),top=headerY+90+(style.notePosition==='top'?noteH:0),footerSpace=100+(style.notePosition==='bottom'?noteH:0)+pad;
 const textH=r=>r.reduce((a,b)=>a+Math.ceil(b.size*1.32),0);
 const height=Math.ceil(Math.max(1700,top+Math.max(...rows.map(textH))+(style.notePosition==='right'?noteH:0)+footerSpace));if(height>4800)throw Error('文字與字級超出圖卡限制，請減少文字或縮小字級');
 const result=[],names=cardFileNames(t(snapshot.point.name),snapshot.timestamp,snapshot.language);
 try{for(let page=0;page<2;page++){
  const canvas=doc.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('瀏覽器無法建立圖卡');
  ctx.globalAlpha=style.backgroundOpacity/100;let fill=style.background;if(style.gradient){fill=ctx.createLinearGradient(0,0,width,height);fill.addColorStop(0,style.background);fill.addColorStop(1,style.background2);}ctx.fillStyle=fill;ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;
  if(snapshot.backgroundImage){const image=snapshot.backgroundImage;ctx.save();ctx.globalAlpha=style.imageOpacity/100;ctx.drawImage(image,0,0,width,height);ctx.restore();}
  ctx.fillStyle=style.textColor;ctx.font=`${style.boldTitles?'bold ':''}42px sans-serif`;ctx.fillText(t(`ACTweather ${page===0?'氣象預報':'海象與航空預報'} ${page+1}/2`),pad,headerY);
  ctx.font='26px sans-serif';ctx.fillText(t(`${snapshot.point.name}　預報時間：${clock(snapshot.timestamp,snapshot.offset,true)} LST ／ ${clock(snapshot.timestamp,0,true)} UTC`),pad,headerY+46,width-pad*2);
  const leftW=1160-(pad-44),gap=30,tileW=(leftW-gap)/2,bottom=height-footerSpace,tileH=(bottom-top-gap)/2;
  for(let i=0;i<4;i++){
   const item=capture.images[page*4+i],x=pad+(i%2)*(tileW+gap),y=top+Math.floor(i/2)*(tileH+gap),mapAreaH=tileH-160;
   // Inner plot leaves margins for all four geographic frame labels.
   const scale=Math.min((tileW-90)/item.canvas.width,(mapAreaH-54)/item.canvas.height),w=item.canvas.width*scale,h=item.canvas.height*scale,ix=x+(tileW-w)/2,iy=y+28+(mapAreaH-54-h)/2;
   ctx.drawImage(item.canvas,ix,iy,w,h);ctx.strokeStyle=style.textColor;ctx.lineWidth=1;ctx.strokeRect(ix,iy,w,h);
   const [[west,south],[east,north]]=capture.bounds,merc=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
   ctx.fillStyle=style.textColor;ctx.font='17px sans-serif';ctx.textAlign='center';
   for(const [lon,p] of [[west,0],[(west+east)/2,.5],[east,1]]){ctx.textAlign=p===0?'left':p===1?'right':'center';ctx.fillText(coordinateLabel(lon),ix+p*w,iy-8);ctx.fillText(coordinateLabel(lon),ix+p*w,iy+h+23);}
   for(const lat of [north,(north+south)/2,south]){ctx.textAlign=lat===north?'right':lat===south?'left':'center';const py=iy+(merc(north)-merc(lat))/(merc(north)-merc(south))*h;ctx.save();ctx.translate(ix-16,py);ctx.rotate(-Math.PI/2);ctx.fillText(coordinateLabel(lat,true),0,0);ctx.restore();ctx.save();ctx.translate(ix+w+29,py);ctx.rotate(-Math.PI/2);ctx.fillText(coordinateLabel(lat,true),0,0);ctx.restore();}
   const px=ix+(snapshot.point.lon-west)/(east-west)*w,py=iy+(merc(north)-merc(snapshot.point.lat))/(merc(north)-merc(south))*h;
   ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fillStyle='#ff334f';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
   ctx.textAlign='center';ctx.fillStyle=style.textColor;ctx.font=`${style.boldTitles?'bold ':''}29px sans-serif`;ctx.fillText(t(item.label),x+tileW/2,y+mapAreaH+30);
   ctx.font='19px sans-serif';ctx.fillText(item.sourceModel+' · '+clock(item.timestamp,0,true)+' UTC',x+tileW/2,y+mapAreaH+59);ctx.textAlign='left';drawLegend(ctx,{...item.legend,labels:item.legend.labels.map(t)},x,y+mapAreaH+77,tileW);
  }
  const textEnd=drawTextRows(ctx,rows[page],rightX,top,style.textColor);
  if(note.length){ctx.font=`${style.noteStyle==='normal'?'':style.noteStyle+' '}${style.noteSize}px sans-serif`;ctx.fillStyle=style.noteColor;let ny=style.notePosition==='top'?headerY+81:style.notePosition==='right'?textEnd+30:height-footerSpace+25;const nx=style.notePosition==='right'?rightX:pad;for(const row of note){ctx.fillText(row,nx,ny+style.noteSize);ny+=Math.ceil(style.noteSize*1.35);}}
  ctx.font='20px sans-serif';ctx.fillStyle=style.textColor;ctx.fillText(`Windy.com　© OpenStreetMap contributors　|　${capture.attribution||'Windy.com'}`.slice(0,160),pad,height-pad-40,width-pad*2);
  ctx.fillText(t(`經度 ${capture.bounds[0][0].toFixed(3)}°～${capture.bounds[1][0].toFixed(3)}°　緯度 ${capture.bounds[0][1].toFixed(3)}°～${capture.bounds[1][1].toFixed(3)}°　|　FORECAST 模式預報`),pad,height-pad-10,width-pad*2);
  if(style.border!=='none'){ctx.strokeStyle=style.borderColor;ctx.lineWidth=style.borderWidth;ctx.setLineDash(style.border==='dashed'?[24,14]:style.border==='dotted'?[style.borderWidth,style.borderWidth*2]:[]);const inset=style.borderWidth*2;ctx.strokeRect(inset,inset,width-inset*2,height-inset*2);if(style.border==='double'){ctx.lineWidth=Math.max(1,style.borderWidth/3);ctx.strokeRect(inset+style.borderWidth*2,inset+style.borderWidth*2,width-inset*2-style.borderWidth*4,height-inset*2-style.borderWidth*4);}ctx.setLineDash([]);}
  const blob=await blobOf(canvas);result.push({blob,name:names.images[page],width,height});canvas.width=canvas.height=1;
 }}finally{for(const item of capture.images)item.canvas.width=item.canvas.height=1;}
 return {files:result,zipName:names.zip};
}
const crcTable=Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=(i&1)?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
export function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
export async function zipCards(files){
 const chunks=[],central=[];let offset=0,size=0;const encoder=new TextEncoder();
 const set=(view,pos,value,bytes)=>bytes===2?view.setUint16(pos,value,true):view.setUint32(pos,value,true);
 for(const file of files){const bytes=new Uint8Array(await file.blob.arrayBuffer()),name=encoder.encode(file.name),crc=crc32(bytes);const header=new Uint8Array(30+name.length),v=new DataView(header.buffer);set(v,0,0x04034b50,4);set(v,4,20,2);set(v,6,0x800,2);set(v,12,0x21,2);set(v,14,crc,4);set(v,18,bytes.length,4);set(v,22,bytes.length,4);set(v,26,name.length,2);header.set(name,30);chunks.push(header,bytes);
  const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);set(cv,0,0x02014b50,4);set(cv,4,20,2);set(cv,6,20,2);set(cv,8,0x800,2);set(cv,14,0x21,2);set(cv,16,crc,4);set(cv,20,bytes.length,4);set(cv,24,bytes.length,4);set(cv,28,name.length,2);set(cv,42,offset,4);c.set(name,46);central.push(c);offset+=header.length+bytes.length;size+=c.length;
 }
 const end=new Uint8Array(22),v=new DataView(end.buffer);set(v,0,0x06054b50,4);set(v,8,files.length,2);set(v,10,files.length,2);set(v,12,size,4);set(v,16,offset,4);return new Blob([...chunks,...central,end],{type:'application/zip'});
}
export const isMobile=nav=>/Android|iPhone|iPad|iPod/i.test(nav?.userAgent??'')||(nav?.platform==='MacIntel'&&nav?.maxTouchPoints>1);
export function downloadFile(doc,url,name){const a=doc.createElement('a');a.href=url;a.download=name;a.rel='noopener';doc.body.appendChild(a);a.click();a.remove();}
