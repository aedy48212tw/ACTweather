// Non-forecast map products (radar, satellite, etc.) do not define the ACT model.
export function createForecastModelSelector(store,pointProducts){
 const supported=new Set(Array.isArray(pointProducts)?pointProducts:['ecmwf','gfs','icon']);
 let last='ecmwf';
 return ()=>{const current=store.get('product');if(supported.has(current))last=current;return last;};
}
export function visibilityModel(model,products){
 if(products?.[model]?.overlays?.includes('visibility'))return model;
 if(products?.ecmwf?.overlays?.includes('visibility'))return 'ecmwf';
 throw Error('目前未找到可用的 Windy 能見度模式');
}
