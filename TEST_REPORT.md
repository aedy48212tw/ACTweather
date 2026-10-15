# ACTweather v0.1.14 驗證

日期：2026-10-15；基礎版本v0.1.13。

- 全新npm ci與官方Rollup/Svelte編譯成功。
- npm test：132項通過，0失敗；結果見tests/test-results.txt。
- 氣象標題對照：rain、temp、rh925h、pressure、wind、visibility、deg0、turbulence500h、clouds，以及sst／waves／currents專屬模式。
- 日月、雲幕及模式摘要提供中英文來源說明；無對應產品時不修改地圖。
- 檢查時間範圍、高度層、產品支援、失敗復原與快速連點；氣象優先使用所選模式。晴空亂流註明500hPa與850–300hPa最大值差異。
- 編譯後插件在模擬Windy宿主實際點擊降雨、氣溫、雲量標題及日出來源，驗證store變更、時間保留與清理事件。
- 中英文介面與Air Force Institute of Technology名稱檢查通過。
- 更新器：SHA256、路徑與來源完整性、備份與取代、保留.git／實際截圖、錯誤儲存庫拒絕。完整CLI流程在本機測試Git儲存庫完成copy／commit／push，未連線GitHub。
- GitHub工作流程：版本變更才自動發布、相同版本略過、手動入口保留；測試發布摘要從實際回應格式擷取官方URL。沒有真實雲端發布驗收。
- Word共8頁渲染並逐頁目視核對。
- 圖卡合成未修改，保留v0.1.13的6種原生Canvas測試紀錄作為歷史參考，未宣稱本版重做即時Windy截圖。

## 限制

尚未完成真實Windy網站、實體iPhone與Windows CMD雙擊驗收。Linux上的Node／Git更新流程測試，不等同Windows與GitHub Actions真實發布成功。未操作使用者的GitHub儲存庫或Windy金鑰。

使用者需依Word第5頁操作新解壓套件的Update_ACTweather.cmd，並在Actions查看實際結果。Windy對公開插件清單的核准與更新仍由官方處理。
