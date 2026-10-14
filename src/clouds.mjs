// 使用者 RH 圖示規則；0.1.3 依 RH90→BKN020 範例調整門檻。
const finite=x=>typeof x==='number'&&Number.isFinite(x);
export const cloudReference=[
 {level:'925h',pressure:925,levelFt:2500,bases:[2000,2500,3000]},
 {level:'850h',pressure:850,levelFt:5000,bases:[4000,5000,6000]},
 {level:'700h',pressure:700,levelFt:10000,bases:[8000,10000,12000]},
 {level:'500h',pressure:500,levelFt:18000,bases:[15000,18000,20000]}
];
export function cloudGuidance(w){
 const rows=cloudReference.map(ref=>{
  const input=w.cloudLayers?.find(x=>x.level===ref.level)??w.levels?.find(x=>x.level===ref.level);
  const rh=input?.rh,terrain=w.header?.elevation;
  const height=finite(input?.height)?input.height:ref.levelFt/3.28084;
  if(finite(terrain)&&height<terrain)return {...ref,rh,status:'below',text:'低於地面，排除判讀'};
  if(!finite(rh)||rh<0||rh>100)return {...ref,status:'missing',text:'RH 未提供，無法判讀'};
  if(rh<70)return {...ref,rh,status:'dry',text:'未達雲量判讀門檻'};
  const category=rh>=90?0:rh>=80?1:2,amount=['BKN','BKN–SCT','SCT'][category],baseFt=ref.bases[category];
  return {...ref,rh,status:'estimated',amount,baseFt,code:amount+String(baseFt/100).padStart(3,'0'),metarCode:(amount.includes('BKN')?'BKN':'SCT')+String(baseFt/100).padStart(3,'0')};
 });
 const estimates=rows.filter(x=>x.status==='estimated');
 const lowest=estimates.filter(x=>x.amount.includes('BKN')).sort((a,b)=>a.baseFt-b.baseFt)[0];
 const groups=[...new Set(estimates.sort((a,b)=>a.baseFt-b.baseFt).map(x=>x.metarCode))];
 return {rows,ceiling:lowest?`${lowest.baseFt}呎（${lowest.pressure} hPa）`:'未推定雲幕',ceilingFt:lowest?.baseFt,groups:groups.join(' '),estimated:estimates.length>0};
}
export function cloudLines(w){const g=cloudGuidance(w);return {lines:g.rows.map(r=>`${r.pressure} hPa：RH ${finite(r.rh)?r.rh.toFixed(0):'未提供'}% → ${r.status==='estimated'?r.code:r.text}`),ceiling:g.ceiling};}
