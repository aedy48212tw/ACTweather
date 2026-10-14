// Use Windy's own overlay, selected legend, colors and legend renderer.
// Asking for kt here does not mutate the user's unit preference.
export function windyLegend(overlay,{overlays,getGradientLegendHTML,document:doc=globalThis.document}){
 const o=overlays?.[overlay],legend=o?.alternativeLegend??o?.overlayMetric?.legend;
 const color=o?.overlayColor;
 if(!legend||legend.isDiscrete||!color?.getColor||!getGradientLegendHTML)throw Error(`Windy ${overlay} 色階介面不可用，未生成圖卡`);
 const metric=overlay==='wind'?'kt':o.overlayMetric?.metric;
 if(!legend.description?.includes(metric))throw Error(`Windy ${overlay} 色階單位不可用`);
 const rendered=getGradientLegendHTML(color.getColor(),legend,metric);
 const colors=rendered.background.match(/rgba?\([^)]*\)/g);
 const el=doc.createElement('div');el.innerHTML=rendered.content;
 const labels=[...el.querySelectorAll('span')].map(e=>e.textContent);
 if(!colors?.length||labels.length!==legend.lines.length+1)throw Error(`Windy ${overlay} 色階格式已變更`);
 return {colors,labels,unit:metric};
}
