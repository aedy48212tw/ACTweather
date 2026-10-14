<div class="plugin__mobile-header">ACTweather</div>
<section class="plugin__content"><div bind:this={root}><p role="status">ACTweather 正在啟動…</p></div></section>
<script>
 import { onMount, onDestroy } from 'svelte';
 import store from '@windy/store';
 import bcast from '@windy/broadcast';
 import { singleclick } from '@windy/singleclick';
 import { getPointForecastData, getElevation } from '@windy/fetch';
 import { map } from '@windy/map';
 import {createWindyCapture} from './map-capture.mjs';
 import { mountACT } from './app.mjs';
 import config from './pluginConfig';
 import {createFullRenderingParams,getDataZoom} from '@windy/renderUtils';
 import {fetchImageBlob} from '@windy/tileLayerSource';
 import {rawDataToCanvasImageSource,getImageData} from '@windy/imageFetch';
 import {decodeHeader,processHeader,decodeImageBytesCompact} from '@windy/TileLayerUtils';
 import {createVisibilityTileLoader} from './visibility-tiles.mjs';
 import {createIndependentDataAPI} from './data-products.mjs';
 import {createVisibilityReader} from './windy-data.mjs';
 import {airPointProducts} from '@windy/rootScope';
 import products from '@windy/products';
 import overlays from '@windy/overlays';
 import {getGradientLegendHTML} from '@windy/renderLegend';
 import {createForecastModelSelector,visibilityModel} from './model-selection.mjs';
 import {browserOffsetSeconds} from './time.mjs';
 import {searchPlaces} from './locations.mjs';
 let root, app, marker, visibilityReader, tileLoader, dataAPI, captureAPI;
 const num=()=>Number(store.get('timestamp'));
 export const onopen = params => { if(app&&params?.lat!=null&&params?.lon!=null)app.select({lat:Number(params.lat),lon:Number(params.lon)}); };
 onMount(()=>{try{
 if(!store || typeof store.get !== 'function' || typeof store.on !== 'function') throw Error('Windy store 模組無法使用');
 tileLoader=createVisibilityTileLoader({fetchImageBlob,rawDataToCanvasImageSource,getImageData,decodeHeader,processHeader,decodeImageBytesCompact});
 visibilityReader=createVisibilityReader({createFullRenderingParams,getDataZoom,loadTile:tileLoader.loadTile,mapZoom:()=>map.getZoom()});
 dataAPI=createIndependentDataAPI({getElevation,createFullRenderingParams,getDataZoom,loadTile:tileLoader.loadTile,mapZoom:()=>map.getZoom()},products);
 const forecastModel=createForecastModelSelector(store,airPointProducts);
 captureAPI=createWindyCapture({store,bcast,map,products,legendAPI:{overlays,getGradientLegendHTML}});
 app=mountACT(root,{capture:captureAPI,
  field:(layer,model,point,ts)=>dataAPI.read(layer,layer==='waves'?['ecmwfWaves','gfsWaves']:layer==='currents'?['cmems']:layer==='sst'?['ecmwfAnalysis']:[model,'ecmwf','gfs'],point,ts),
  search:searchPlaces, visibility:async(model,point,timestamp)=>{const sourceModel=visibilityModel(model,products);return {value:await visibilityReader.read(sourceModel,point,timestamp),sourceModel};},
  timeOffset:browserOffsetSeconds,
  time:num, model:forecastModel, storage:localStorage,
  forecast:async(model,point)=>{const result=await getPointForecastData(model,{...point,days:7,step:3},{header:true,summary:true,celestial:true,meteogram:true,sounding:true});if(!result?.data)throw Error('Windy 未回傳資料');return result.data;},
  copy:async(text)=>{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return;}const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw Error('copy failed');},
  mark:point=>{if(marker)marker.remove();marker=L.marker([point.lat,point.lon]).addTo(map);},
  subscribe:handlers=>{const click=p=>handlers.point({lat:Number(p.lat),lon:Number(p.lon??p.lng)});singleclick.on(config.name,click);store.on('timestamp',handlers.time);store.on('product',handlers.model);store.on('overlay',handlers.visibility);bcast.on('redrawFinished',handlers.redraw);return()=>{singleclick.off(config.name,click);store.off('timestamp',handlers.time);store.off('product',handlers.model);store.off('overlay',handlers.visibility);bcast.off('redrawFinished',handlers.redraw);if(marker)marker.remove();};}
 });}catch(error){console.error('[ACTweather] 啟動失敗',error);root.textContent='ACTweather 啟動失敗：'+(error?.message??String(error));root.setAttribute('role','alert');}});
 onDestroy(()=>{captureAPI?.destroy();dataAPI?.destroy();visibilityReader?.destroy();tileLoader?.destroy();app?.destroy();});
</script>
<style lang="less">
 :global(.actweather){--bg:#373b40;--fg:#f5f7fa;--muted:#c5cbd4;--card:#44494f;--line:#60666e;--accent:#7cdbef;background:var(--bg);color:var(--fg);padding:20px;font:15px/1.6 system-ui,sans-serif;border-radius:12px;}
 :global(.actweather.light){--bg:#fff;--fg:#17212b;--muted:#526070;--card:#f3f5f7;--line:#ccd3db;--accent:#00677a;}
 :global(.actweather *){box-sizing:border-box;}
 :global(.actweather h1){font-size:30px;margin:0;letter-spacing:-1px;}
 :global(.actweather h2){font-size:14px;color:var(--muted);margin:0 0 4px;}
 :global(.actweather p){margin:4px 0 14px;white-space:pre-line;}
 :global(.actweather small){color:var(--accent);letter-spacing:1px;}
 :global(.actweather nav),:global(.actweather .controls),:global(.actweather footer){display:flex;flex-wrap:wrap;gap:10px;margin:15px 0;}
 :global(.actweather button),:global(.actweather select),:global(.actweather input){background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:7px;padding:8px;font:inherit;max-width:100%;}
 :global(.actweather button){cursor:pointer;}
 :global(.actweather button[aria-pressed=true]){background:var(--accent);color:var(--bg);font-weight:bold;}
 :global(.actweather button:disabled){opacity:.45;cursor:default;}
 :global(.actweather label){display:block;font-size:12px;color:var(--muted);}
 :global(.actweather label select),:global(.actweather label input:not([type=checkbox])){display:block;width:100%;}
 :global(.actweather section){padding:12px 0;border-bottom:1px solid var(--line);}
 :global(.actweather pre){white-space:pre-wrap;overflow-wrap:anywhere;padding:14px;background:var(--card);border-radius:8px;}
 :global(.actweather details){margin:12px 0;}
 :global(.actweather [data-sources]){width:100%;}
 :global(.actweather [data-sources] p){overflow-wrap:anywhere;}
 :global(.actweather summary){cursor:pointer;color:var(--accent);}
 :global(.actweather table){width:100%;font-size:12px;}
 :global(.actweather td),:global(.actweather th){padding:5px;border-bottom:1px solid var(--line);text-align:left;}
 :global(.actweather .act-card-preview){display:block;width:100%;height:auto;margin:12px 0;}
 :global(.actweather .act-export-progress){position:fixed;inset:0;z-index:100000;background:rgba(20,27,36,.94);color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;text-align:center;}
 :global(.actweather [data-card-results] a){color:var(--accent);display:inline-block;margin:10px;}
 :global(.actweather [role=alert]){color:#fb847c;}
:global(.actweather .act-language-row){display:flex;align-items:center;flex-wrap:wrap;gap:8px}:global(.actweather .act-language){font-size:12px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}:global(.actweather .act-language input){width:auto}
</style>
