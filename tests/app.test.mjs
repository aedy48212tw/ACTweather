import {test} from 'node:test';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';import {mountACT} from '../src/app.mjs';import {fixture} from './fixture.mjs';
const tick=()=>new Promise(r=>setTimeout(r,120));
function setup(overrides={}){const dom=new JSDOM('<main></main>',{url:'https://example.test'});let handlers, copied='',now=Date.parse('2026-10-06T03:00:00Z');const root=dom.window.document.querySelector('main');const app=mountACT(root,{time:()=>now,model:()=> 'ecmwf',storage:dom.window.localStorage,forecast:async()=>fixture(),copy:async t=>{copied=t;},subscribe:h=>{handlers=h;return()=>{};},...overrides});return {dom,root,app,handlers,copy:()=>copied,setTime:t=>{now=t;handlers.time();}};}
function change(s,selector,value){const el=s.root.querySelector(selector);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new s.dom.window.Event('change'));}
test('forecast displayed, theme icons units persist, METAR and copy',async()=>{const s=setup();try{await tick();assert.match(s.root.textContent,/臺北測站/);assert.match(s.root.textContent,/19.0 °C/);change(s,'[data-setting=theme]','light');assert.ok(s.root.classList.contains('light'));change(s,'[data-setting=wind]','m/s');assert.match(s.root.textContent,/3.6 m\/s/);change(s,'[data-setting=icons]',false);assert.doesNotMatch(s.root.querySelector('article').textContent,/📍/);s.root.querySelector('[data-tab="2"]').click();s.root.querySelector('[data-action=copy]').click();await tick();assert.match(s.copy(),/FORECAST METAR/);assert.match(s.root.textContent,/已複製/);}finally{s.app.destroy();}});
test('point event loads, manual fields cleared on time/model/point change',async()=>{const s=setup();try{await tick();change(s,'[data-manual=qnh]','1012');assert.equal(s.app.state.manual.qnh,1012);s.setTime(Date.parse('2026-10-06T06:00:00Z'));assert.deepEqual(s.app.state.manual,{});s.handlers.point({lat:22,lon:120});await tick();await tick();assert.match(s.root.textContent,/22.0000000, 120.0000000/);assert.equal(s.app.state.name,'地圖所選地點');}finally{s.app.destroy();}});
test('untrusted point name escaped',async()=>{const s=setup();try{await tick();s.app.select({lat:22,lon:120},'<img src=x onerror=alert(1)>');await tick();await tick();assert.equal(s.root.querySelector('img'),null);assert.match(s.root.textContent,/<img src=x/);}finally{s.app.destroy();}});
test('backend failure disables copy and shows actionable error',async()=>{const s=setup({forecast:async()=>{throw Error('測試網路錯誤');}});try{await tick();assert.match(s.root.textContent,/測試網路錯誤/);assert.ok(s.root.querySelector('[data-action=copy]').disabled);}finally{s.app.destroy();}});
test('stale response cannot overwrite newer point',async()=>{let resolvers=[];const s=setup({forecast:()=>new Promise(r=>resolvers.push(r))});try{s.app.select({lat:23,lon:121});await tick();resolvers[1](fixture());await tick();const stale=fixture();stale.data.temperature=stale.data.temperature.map(()=>350);resolvers[0](stale);await tick();assert.doesNotMatch(s.root.textContent,/76.9 °C/);assert.match(s.root.textContent,/23.0000000/);}finally{s.app.destroy();}});
test('destroy unsubscribes and clears rendered DOM',async()=>{let cleaned=false;const s=setup({subscribe:()=>()=>{cleaned=true;}});s.app.destroy();await tick();assert.ok(cleaned);assert.equal(s.root.textContent,'');});
test('out-of-range time can recover when timeline returns',async()=>{const s=setup();try{await tick();s.setTime(Date.parse('2026-11-06T03:00:00Z'));assert.match(s.root.textContent,/超出/);s.setTime(Date.parse('2026-10-06T03:00:00Z'));assert.equal(s.root.querySelector('[role=alert]'),null);assert.match(s.root.textContent,/19.0 °C/);}finally{s.app.destroy();}});
test('v0.1.13 fields rendered and included in copied ACT forecast',async()=>{
 const p=fixture();p.header.model='gfs';const s=setup({forecast:async()=>p});
 try{await tick();s.setTime(Date.parse('2026-10-06T15:00Z'));
 assert.match(s.root.textContent,/v0.1.13/);
 assert.match(s.root.textContent,/2026-10-06 23:00\(LST地方時\)；2026-10-06 15:00 \(UTC\)/);
 assert.match(s.root.textContent,/參考模式GFS/);
 assert.match(s.root.textContent,/A2988（29.88 inHg）/);
 assert.match(s.root.textContent,/925 hPa：RH 96% → 低於地面/);
 assert.match(s.root.textContent,/700 hPa：RH 94% → BKN080/);
 s.root.querySelector('[data-action=copy]').click();await tick();
 assert.match(s.copy(),/參考模式： GFS/);assert.match(s.copy(),/雲幕/);
 change(s,'[data-manual=qnh]','1000');assert.match(s.root.textContent,/A2953（29.53 inHg）/);
 }finally{s.app.destroy();}
});
test('Taipei default, concise clouds, visibility, rain and numbered icon copying',async()=>{
 const p=fixture();p.header.elevation=12;p.sounding['rh-925h']=p.data.ts.map(()=>76);p.sounding['rh-850h']=p.data.ts.map(()=>80);
 const s=setup({forecast:async(model,point)=>{assert.equal(point.lat,25.038);assert.equal(point.lon,121.514);return p;},visibility:async()=>15300});
 try{await tick();assert.match(s.root.textContent,/中央氣象署 臺北測站/);assert.match(s.root.textContent,/15.3公里/);assert.doesNotMatch(s.root.textContent,/雲底／濕度|降雨機率|圖示雲底/);assert.match(s.root.textContent,/5000呎（850 hPa）/);
 s.root.querySelector('[data-action=copy]').click();await tick();assert.match(s.copy(),/^1.地點： 中央氣象署 臺北測站/);
 change(s,'[data-setting=copyIcons]',true);s.root.querySelector('[data-action=copy]').click();await tick();assert.match(s.copy(),/^1.🚩地點：/);assert.match(s.copy(),/2.🧭經緯度：/);
 s.setTime(Date.parse('2026-10-06T06:00Z'));await tick();assert.match(s.root.textContent,/小雨；3.3mm\/3小時預報；當日預報合計3.3mm/);
 s.root.querySelector('[data-tab="2"]').click();assert.match(s.root.querySelector('pre').textContent,/9999 -RA SCT030 BKN050/);
 }finally{s.app.destroy();}
});
test('search result selection, coordinates, favorite add select delete persist',async()=>{
 const storageValues=new Map(),storage={getItem:k=>storageValues.get(k),setItem:(k,v)=>storageValues.set(k,v)};
 const s=setup({storage,search:async q=>{assert.equal(q,'高雄');return [{name:'高雄',lat:22.63,lon:120.3}];}});
 const submit=query=>{const f=s.root.querySelector('[data-form=search]');f.elements.query.value=query;f.dispatchEvent(new s.dom.window.Event('submit',{cancelable:true}));};
 try{await tick();submit('高雄');await tick();s.root.querySelector('[data-search-result="0"]').click();await tick();await tick();assert.equal(s.app.state.lat,22.63);
 s.root.querySelector('[data-action=favorite-add]').click();assert.equal(s.app.state.favorites.length,1);assert.match(storageValues.get('ACTweather.favorites'),/高雄/);
 submit('25.038,121.514');await tick();s.root.querySelector('[data-search-result="0"]').click();await tick();await tick();assert.equal(s.app.state.lat,25.038);
 s.root.querySelector('[data-favorite="0"]').click();await tick();await tick();assert.equal(s.app.state.name,'高雄');
 s.root.querySelector('[data-favorite-delete="0"]').click();assert.equal(storageValues.get('ACTweather.favorites'),'[]');assert.equal(s.app.state.favorites.length,0);
 }finally{s.app.destroy();}
});
test('old visibility response cannot be reused for a new forecast time',async()=>{
 const resolvers=[];const s=setup({visibility:()=>new Promise(resolve=>resolvers.push(resolve))});
 try{await tick();s.setTime(Date.parse('2026-10-06T06:00Z'));await tick();resolvers[1](8000);await tick();assert.match(s.root.textContent,/8.0公里/);resolvers[0](15300);await tick();assert.doesNotMatch(s.root.textContent,/15.3公里/);
 }finally{s.app.destroy();}
});
test('visibility failure keeps forecast usable with unknown METAR visibility',async()=>{
 const s=setup({visibility:async()=>{throw Error('產品不可用');}});try{await tick();assert.match(s.root.textContent,/Windy 能見度未提供/);assert.equal(s.root.querySelector('[role=alert]'),null);s.root.querySelector('[data-tab="2"]').click();assert.match(s.root.querySelector('pre').textContent,/27007KT \/\/\/\/ BKN080/);}finally{s.app.destroy();}
});
test('background retry recovers visibility with no layer button',async()=>{
 let ready=false;
 const p=fixture();p.header.utcOffset=0;
 const s=setup({forecast:async()=>p,timeOffset:()=>28800,visibility:async()=>{if(!ready)throw Error('尚未載入');return 15300;}});
 try{await tick();assert.match(s.root.textContent,/Windy 能見度未提供/);assert.equal(s.root.querySelector('[data-action=visibility]'),null);
 ready=true;s.handlers.redraw();await tick();assert.match(s.root.textContent,/15.3公里/);
 s.setTime(Date.parse('2026-10-07T12:00Z'));s.handlers.redraw();await tick();assert.match(s.root.textContent,/2026-10-07 20:00\(LST地方時\)；2026-10-07 12:00 \(UTC\)/);
 s.root.querySelector('[data-action=copy]').click();await tick();assert.match(s.copy(),/2026-10-07 20:00\(LST地方時\)/);
 }finally{s.app.destroy();}
});
