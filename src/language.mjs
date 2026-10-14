// Translate application-owned text only. User values remain verbatim.
const pairs=`
喜愛風格儲存空間被其他視窗占用|Favorite style storage is in use by another window
喜愛風格底圖資料無效或過大|Favorite background is invalid or too large
喜愛風格儲存空間開啟逾時|Opening favorite style storage timed out
瀏覽器未允許儲存喜愛風格|Browser denied saving favorite styles
瀏覽器未允許刪除喜愛風格|Browser denied deleting favorite styles
請檢查瀏覽器儲存空間|Check browser storage
喜愛風格清單無效|Invalid favorite style list
喜愛風格資料無效|Invalid favorite style data
無法開啟喜愛風格|Cannot open favorite styles
背景能見度介面不可用|Background visibility interface unavailable
能見度請求已取消|Visibility request cancelled
能見度載入逾時|Visibility loading timed out
圖層參數不符|Layer parameters do not match
尚未取得資料|No data received yet
無法確認此點海象適用性|Cannot verify marine data availability at this point
模式時間資料載入逾時|Model time data loading timed out
地形檢查介面不可用|Terrain-check interface unavailable
此點地形高度非零|Nonzero terrain elevation at this point
地形檢查已取消|Terrain check cancelled
未取得地形資料|Terrain data unavailable
海象數值不適用|Marine values not applicable
請選擇外海地點|Select an offshore location
資料請求已取消|Data request cancelled
所選時間超出|Selected time is outside
資料範圍|data range
已關閉|Closed
Windy氣象圖層截圖介面不可用，請更新Windy後重試|Windy weather capture interface unavailable. Update Windy and retry.
目前Windy未提供可截圖的MapLibre地圖|Windy has not provided a capturable MapLibre map
圖卡正在產生|Cards are being generated
此極區無法完整擷取所設定範圍的Mercator地圖|Cannot capture the full Mercator extent in this polar region
圖卡地點無效|Invalid card location
瀏覽器無法建立圖卡畫布|Browser cannot create a card canvas
模式時間載入逾時|Model time loading timed out
不支援所選預報時間，請更換時間後重試|does not support the selected forecast time; choose another time
圖層載入逾時|Layer loading timed out
圖層切換失敗|Layer switch failed
預報時間被Windy調整，請更換時間後重試|Forecast time was adjusted by Windy; choose another time
需完整取得八張Windy圖層截圖|All eight Windy layer captures are required
Windy未提供|Windy does not provide
圖層|layer
底圖|background
逾時|timed out
至|to
度|degrees
海象|Marine
製作|Generate
請先預覽|Preview first
請按製作按鈕更新預覽|Generate cards to update the previews
天文估算|Astronomical calculation

波浪|Waves

當日逐時預報|Hourly Forecast
電碼|Code
日出|Sunrise
日沒|Sunset

人工|manual
高空風|Upper wind
流速|Speed
 及 | and 

POINT FORECAST · 單點預報|POINT FORECAST
點選 Windy 地圖，即可更新預報|Tap the Windy map to update the forecast
中央氣象署 臺北測站|CWA Taipei Weather Station
地圖所選地點|Selected map location
ACT 預報|ACT Forecast
ACT預報|ACT Forecast
海象預報|Marine Forecast
METAR 電碼|METAR Code
METAR預報電碼|Forecast METAR Code
氣象模式|Forecast model
跟隨 Windy|Follow Windy
段落圖示|Section icons
一併複製圖例|Include icons when copying
灰底白字|Dark background
白底黑字|Light background
喜愛地點／搜尋地名或經緯度|Favorite locations / Search by name or coordinates
地名或緯度、經度|Place name or latitude, longitude
將目前地點加入喜愛|Add current location to favorites
尚無喜愛地點|No favorite locations yet
指定地點／人工補充電碼資料|Specified location / Manual METAR inputs
補充值僅用於目前地點、模式與預報時間，切換後自動清除。|Manual inputs apply only to this location, model and forecast time; they are cleared when these change.
能見度（人工 m；9999=10 km以上）|Visibility (manual, m; 9999 = 10 km or more)
雲層（人工 AGL 百呎）|Cloud layers (manual, hundreds of feet AGL)
當日逐時預報／降雨時段|Hourly forecast / Precipitation periods
壓力層、RH、高空風|Pressure Levels, RH, Upper Winds
風向／風速及浦福風級|Wind Direction / Speed / Beaufort Force
波浪浪向／浪高|Wave Direction / Height
海流流向／流速|Current Direction / Speed
風向／風速|Wind Direction / Speed
日出／日沒|Sunrise / Sunset
月出／月沒|Moonrise / Moonset
圖卡風格設計|Forecast Card Design
設定套用於下次製作的兩張圖卡。底圖拉伸滿版，保留全部圖案；可與風格一起儲存到我的最愛。|These settings apply to the next two cards. Background images stretch to fill the card without cropping and can be saved with your favorite style.
截圖範圍 度數（上下左右各）|Capture radius in degrees (each direction)
邊框線條|Border style
邊框顏色|Border color
邊框粗細|Border width
雙色漸層|Two-color gradient
漸層第二色|Second gradient color
底色透明度|Background transparency
上傳底圖（PNG/JPEG/WebP，8MB以內）|Upload background (PNG/JPEG/WebP, up to 8 MB)
圖片透明度|Image transparency
尚未選擇底圖|No background selected
移除底圖|Remove background
ACT預報字級|ACT forecast font size
海象預報字級|Marine forecast font size
METAR預報電碼字級|METAR font size
標題粗體（含段落欄位名稱）|Bold headings (including field labels)
預報文字顏色|Forecast text color
插入文字字級|Note font size
插入文字位置|Note position
插入文字風格|Note style
插入文字顏色|Note color
頂部（預報時間下方）|Top (below forecast time)
底部（來源說明上方）|Bottom (above attribution)
右側預報文字下方|Below the right-hand forecast
喜愛風格名稱|Favorite style name
將此風格儲存為我的最愛|Save this style to favorites
喜愛風格包含截圖範圍、樣式、文字與底圖。套用後按製作按鈕即可預覽。|Favorite styles include the capture radius, design, note and background. Apply a style, then generate cards to preview.
套用此風格|Apply style
刪除此風格|Delete style
恢復預設圖卡風格|Reset card design
製作/預覽/下載圖卡|Generate / Preview / Download Cards
兩張預報圖卡|Two forecast cards
請先確認兩張預覽；確認沒問題後，再逐張下載PNG，或下載包含兩張PNG的ZIP。手機可使用分享儲存到照片或檔案；圖卡不會自動傳送。|Review both previews before downloading each PNG or the ZIP containing both. On mobile, use Share to save to Photos or Files. Cards are not sent automatically.
開啟大圖／長按儲存|Open full image / Touch and hold to save
下載兩張圖卡 ZIP|Download both cards as ZIP
分享／儲存兩張圖卡|Share / Save both cards
關閉圖卡預覽|Close card previews
已製作兩張預報圖卡，請先預覽，確認後再點選下載|Both cards are ready. Review the previews, then download.
正在取得完整氣象與海象資料|Loading weather and marine data
正在合成兩張預報圖卡|Composing both forecast cards
正在準備預報圖卡|Preparing forecast cards
正在產生預報圖卡|Generating forecast cards
此環境尚未提供Windy截圖介面|Windy capture is unavailable in this environment
圖卡未產生|Cards could not be generated
已取消圖卡下載|Card generation cancelled
分享未完成，請改用PNG下載或開啟大圖|Sharing did not complete. Download the PNG or open the full image.
已複製，可貼到手機訊息|Copied; you can paste into a message
瀏覽器未允許複製；請選取頁面文字手動複製|Clipboard access denied; select and copy the text manually
此模式未提供剖面資料|Profile data unavailable for this model
預報時間序列為空|Forecast time series is empty
Windy 回傳格式不符：缺少有效的 data.ts|Invalid Windy response: missing valid data.ts
所選時間超出此模式可用的預報範圍，請調整 Windy 時間軸|Selected time is outside this model's forecast range. Adjust the Windy timeline.
當日無事件／未提供|No event today / Unavailable
低於地面，排除判讀|Below ground; excluded
RH 未提供，無法判讀|RH unavailable; cannot estimate
未達雲量判讀門檻|Below cloud-estimation threshold
未推定雲幕|No ceiling estimated
未提供雨勢|Rain intensity unavailable
偶小雷雨|Occasional light thunderstorm rain
中雷雨|Moderate thunderstorm rain
小雷雨|Light thunderstorm rain
大雷雨|Heavy thunderstorm rain
偶小雨|Occasional light rain
無降雨|No precipitation
中雨|Moderate rain
小雨|Light rain
大雨|Heavy rain
晴時多雲有雨雪|Partly cloudy with rain and snow
多雲有雨雪|Cloudy with rain and snow
陰天有雨雪|Overcast with rain and snow
晴時多雲有陣雨|Partly cloudy with showers
多雲有陣雨|Cloudy with showers
陰天有陣雨|Overcast with showers
陰天有雷暴|Overcast with thunderstorms
多雲有雷暴|Cloudy with thunderstorms
陰天有雷雨|Overcast with thunderstorm rain
多雲有雷雨|Cloudy with thunderstorm rain
陰天有雷雪|Overcast with thundersnow
晴時多雲有雨|Partly cloudy with rain
多雲有雨|Cloudy with rain
陰天有雨|Overcast with rain
晴時多雲有雪|Partly cloudy with snow
多雲有雪|Cloudy with snow
陰天有雪|Overcast with snow
雷雨雪|Thunderstorms with rain and snow
晴、有霧|Clear with fog
晴時多雲|Partly cloudy
晴朗|Clear
多雲|Cloudy
陰天|Overcast
未達輕度門檻|Below light threshold
靜流／流向未提供|Calm current / Direction unavailable
風向未提供|Wind direction unavailable
浪向未提供|Wave direction unavailable
當日預報合計|Daily forecast total 
小時預報|h forecast
預報時段未提供|Forecast period unavailable
當日最高|Daily high
最低|Low
陣風|Gusts
未提供|Unavailable
LST地方時|LST local time
預報時間|Forecast Time
參考模式|Reference Model
雲量分布|Cloud Distribution
天空狀況|Sky Conditions
晴空亂流|Clear-air Turbulence
結冰高度|Freezing Level
資料更新|Last Updated
資料來源|Data Sources
有效波高|Significant wave height
海象風速|Marine wind speed
海流流速|Current speed
地點名稱|Location name
搜尋地點|Search location
搜尋中|Searching
更新地點|Update location
複製內容|Copy Content
重新讀取|Reload
雲幕|Ceiling
氣溫|Temperature
氣壓|Pressure
海拔|Elevation
露點|Dew point
能見度|Visibility
海溫|Sea Temperature
經緯度|Coordinates
經度|Longitude
緯度|Latitude
地點|Location
時間|Time
天氣|Weather
溫度|Temperature
風速|Wind speed
雨量 mm/段|Rain mm/period
降雨|Precipitation
高度|Height
主題|Theme
呎|ft
公尺/秒|m/s
公里/時|km/h
公里| km
公尺|m
節 kt|kt
粗斜體|Bold italic
粗體|Bold
斜體|Italic
一般|Normal
實線|Solid
虛線|Dashed
點線|Dotted
雙線|Double
無|None
底圖顏色|Background color
插入文字|Custom note
注意天雨路滑小心開車|Wet roads: drive carefully
例如：海象簡報|Example: Marine briefing
臺北|Taipei
刪除|Delete
取消|Cancel
下載圖卡|Download card
預報圖卡|Forecast card
圖卡|Card
預覽|Preview
月出|Moonrise
月沒|Moonset
月照|Illumination
農曆|Lunar date
極強|Extreme
中度|Moderate
輕度|Light
強|Severe
備註|Note
此擴充套件由航空技術學院 陳智羿老師開發，歡迎大家多加使用！預報內容以 Windy 預報為主，本人僅負責使用介面開發。如有任何建議，或想要擴充的功能，歡迎寄信至 |Developed by instructor Chen Chih-Yi of the Aviation Technology Academy. Everyone is welcome to use it! Forecasts are provided by Windy; the author develops the user interface. For suggestions or feature requests, email 
，一起為氣象預報盡一份力！|. Let's contribute to weather forecasting together!
氣象預報、能見度、結冰高度、亂流與海象：Windy。單點資料以背景讀取；下載圖卡時暫時切換圖層，完成後復原。|Weather, visibility, freezing level, turbulence and marine data: Windy. Point data load in the background. Card capture temporarily switches map layers and restores them afterwards.
日出／日沒、月出／月沒與月照：SunCalc 天文估算；地名搜尋：Open-Meteo／GeoNames。|Sunrise, sunset, moonrise, moonset and illumination: SunCalc astronomical calculations. Place search: Open-Meteo / GeoNames.
壓力層、RH、高空風：模式探空；依hPa數值升序排列。括號為近似標準高度，非當時模式位勢高度；950 hPa約1800ft、925 hPa約2500ft、500 hPa約FL180。標準高度參考：|Pressure levels, RH and upper winds: model sounding in ascending hPa order. Parentheses show approximate standard altitudes, not forecast geopotential heights; 950 hPa ~1800ft, 925 hPa ~2500ft, 500 hPa ~FL180. Standard altitude references: 
。高空風以來向與節表示，地面以下層排除。|. Upper winds indicate direction FROM and speed in knots; below-ground levels are excluded.
天空狀況：模式天氣圖示。雲層依925、850、700、500 hPa的RH規則推估，最低含BKN層作為雲幕；BKN–SCT組入電碼時採BKN。|Sky conditions: model weather icon. Clouds are estimated from RH at 925, 850, 700 and 500 hPa. The lowest BKN layer is the ceiling; BKN-SCT is encoded as BKN.
海象：風向與浪向為來向，海流為去向；浦福風級由原始m/s值計算。陸地或海岸遮罩缺值時，請選擇外海地點。|Marine: wind and wave directions indicate FROM; currents indicate TO. Beaufort force is calculated from original m/s values. Select an offshore point when land or coastal masks produce missing values.
模式起報|Model run
實際模式資料預報時間|Actual model valid time
模式地形|Model terrain
人工 QNH|Manual QNH
模式氣壓換算，QNH 需核對|Converted model pressure; verify QNH
當日高低溫僅取可用時段|Daily extrema use available periods only
雲幕判讀層|Ceiling estimation layer
人工補充|Manual override
來源模式|Source model
此模式未提供能見度|Visibility unavailable for this model
依累積雨量及時段長度計算雨勢，當日合計僅含可用時段。|Intensity calculated from accumulation and period length; daily totals include available periods only.
模式預報摘要，非正式METAR／TAF；斜線代表缺漏，未自動產生NOSIG或CAVOK。來源註記：|Model forecast summary, not an official METAR/TAF. Slashes indicate missing data; NOSIG and CAVOK are not generated automatically. Source notes: 
固定以ft AMSL顯示|Always displayed in ft AMSL
0°C高度|0°C altitude
Windy 指標刻度|Windy index scale
範圍最大值|Maximum over the range
對應輕度|correspond to light
缺值不表示沒有亂流|Missing data do not mean no turbulence
海象風場|Marine wind field
地面風|Surface wind
最新分析值，非逐時海溫預報|Latest analysis, not an hourly SST forecast
表層海流，不含獨立潮流產品|Surface currents; no separate tidal-current product
海浪|Waves
海流|Currents
來源註記|Source notes
以 1 inHg＝33.863886666667 hPa 換算|converted using 1 inHg = 33.863886666667 hPa
資料時間|Data time
起報|Run
地形遮罩|Terrain mask
模式資料|Model data
已更新|Updated
已複製|Copied
正在載入 Windy 預報|Loading Windy forecast
正在載入海象資料|Loading marine data
正在自動載入 Windy 能見度|Loading Windy visibility automatically
正在擷取Windy|Capturing Windy
請重新讀取|Please reload
此模式／地點未取得能見度|Visibility unavailable for this model / location
Windy 能見度未提供|Windy visibility unavailable
無法取得預報|Unable to load forecast
雲層格式無效，請使用 FEW016 BKN100 等格式|Invalid cloud format; use FEW016 BKN100
人工補充已更新|Manual inputs updated
補充值超出允許範圍|Manual input outside allowed range
請選擇搜尋結果，再加入喜愛|Select a search result, then add it to favorites
找不到地名，可改用經緯度|Place not found; try coordinates
此地點已在喜愛清單|Location already in favorites
喜愛清單最多100個地點|Up to 100 favorite locations
已加入喜愛地點|Added to favorite locations
已加入本次清單，但瀏覽器未允許儲存|Added for this session; browser storage denied
已刪除喜愛地點|Favorite location deleted
請先輸入喜愛風格名稱|Enter a favorite style name first
已儲存喜愛風格（含底圖與截圖範圍）|Favorite style saved (including background and capture range)
喜愛風格清單無法讀取|Cannot read favorite styles
喜愛風格未儲存|Favorite style not saved
已刪除喜愛風格|Favorite style deleted
風格未刪除|Style not deleted
風格未套用|Style not applied
已套用風格，請按製作按鈕更新預覽|Style applied; generate cards to update the previews
底圖已載入|Background loaded
經緯度範圍無效|Invalid coordinates
背景資料介面不可用|Background data interface unavailable
無法擷取Windy圖片|Unable to capture Windy image
指定範圍未完整呈現在地圖中|Requested extent is not fully visible on the map
Windy地圖截圖逾時|Windy map capture timed out
Windy截圖是空白，請確認WebGL及圖層已載入|Windy capture is blank. Check WebGL and layer loading.
地圖恢復失敗，請重新選取原圖層|Map restoration failed; reselect the original layer
圖卡PNG編碼失敗|Card PNG encoding failed
瀏覽器無法建立圖卡|Browser cannot create the card canvas
文字與字級超出圖卡限制，請減少文字或縮小字級|Card text exceeds size limits; reduce text or font size
截圖缺少Windy產品色階|Windy product legend missing
降雨、雷暴|Rain, Thunder
氣象預報|Weather Forecast
海象與航空預報|Marine and Aviation Forecast
雲|Clouds
洋流|Ocean Currents
湧浪|Swell
FORECAST 模式預報|FORECAST Model Forecast
截圖範圍請輸入|Enter a capture radius of
喜愛風格底圖無法解碼|Cannot decode favorite background image
底圖無法解碼|Cannot decode background image
底圖請使用|Use a background image in
以內的圖片|or smaller
喜愛風格最多|Maximum favorite styles: 
本次已刪除|Deleted for this session
`;
const dictionary=Object.fromEntries(pairs.trim().split('\n').map(row=>{const i=row.indexOf('|');return [row.slice(0,i),row.slice(i+1)];}));
const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
const pattern=new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
const directions={'北北東':'NNE','東北東':'ENE','東南東':'ESE','南南東':'SSE','南南西':'SSW','西南西':'WSW','西北西':'WNW','北北西':'NNW','東北':'NE','東南':'SE','西南':'SW','西北':'NW','北':'N','東':'E','南':'S','西':'W'};
export function english(value){
 let text=String(value??'').replace(/(\d+)日/g,' $1');
 text=text.replace(/(北北東|東北東|東南東|南南東|南南西|西南西|西北西|北北西|東北|東南|西南|西北|北|東|南|西)(風|方來浪|方)/g,(_,d,type)=>type==='風'?`${directions[d]} wind`:type==='方來浪'?`from ${directions[d]}`:`towards ${directions[d]}`);
 text=text.replace(/靜風/g,'Calm').replace(/流向(?=towards)/g,'Flow ').replace(/(\d+) 級/g,'Beaufort $1');
 // Intl Chinese calendar returns month names; preserve the date in English lunar notation.
 text=text.replace(/(正月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月|冬月|臘月|腊月|闰月|閏月)/g,m=>({正月:'Month 1',二月:'Month 2',三月:'Month 3',四月:'Month 4',五月:'Month 5',六月:'Month 6',七月:'Month 7',八月:'Month 8',九月:'Month 9',十月:'Month 10',十一月:'Month 11',十二月:'Month 12',冬月:'Month 11',臘月:'Month 12',腊月:'Month 12',闰月:'Leap month',閏月:'Leap month'}[m]));
 return text.replace(pattern,k=>dictionary[k]).replace(/mm\/段/g,'mm/period').replace(/（/g,' (').replace(/）/g,')').replace(/：/g,': ').replace(/；/g,'; ').replace(/／/g,' / ').replace(/、/g,', ').replace(/。/g,'. ').replace(/！/g,'!');
}
export function localizeDOM(root,enabled,protectedValues=[]){
 root.setAttribute('lang',enabled?'en':'zh-Hant');if(!enabled)return;
 const preserve=protectedValues.filter(Boolean).filter(x=>!['中央氣象署 臺北測站','地圖所選地點'].includes(x));
 const translate=text=>{const slots=[];for(const value of preserve){if(text.includes(value)){const token=`\uE000${slots.length}\uE001`;slots.push(value);text=text.split(value).join(token);}}text=english(text);return text.replace(/\uE000(\d+)\uE001/g,(_,i)=>slots[+i]);};
 const walker=root.ownerDocument.createTreeWalker(root,4);let node;while(node=walker.nextNode()){if(!['TEXTAREA','SCRIPT','STYLE'].includes(node.parentElement?.tagName))node.nodeValue=translate(node.nodeValue);}
 for(const el of root.querySelectorAll('[placeholder],[alt],[aria-label]'))for(const key of ['placeholder','alt','aria-label'])if(el.hasAttribute(key))el.setAttribute(key,translate(el.getAttribute(key)));
}
export function translateOwned(text,language='zh',protectedValues=[]){
 if(language!=='en')return String(text);
 const slots=[];for(const value of protectedValues.filter(Boolean)){if(!['中央氣象署 臺北測站','地圖所選地點'].includes(value)&&text.includes(value)){const token=`\uE000${slots.length}\uE001`;slots.push(value);text=text.split(value).join(token);}}
 return english(text).replace(/\uE000(\d+)\uE001/g,(_,i)=>slots[+i]);
}
