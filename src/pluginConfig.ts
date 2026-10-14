import type { ExternalPluginConfig } from '@windy/interfaces';
const config: ExternalPluginConfig = {
 name:'windy-plugin-actweather',version:'0.1.13',icon:'⛅',title:'ACTweather',
 description:'氣象人員單點預報與模式預報電碼摘要',author:'航空技術學院 陳智羿老師',
 desktopUI:'rhpane',mobileUI:'fullscreen',routerPath:'/actweather/:lat?/:lon?',
 repository:'https://github.com/aedy48212tw/ACTweather',private:false,listenToSingleclick:true,addToContextmenu:true
};
export default config;
