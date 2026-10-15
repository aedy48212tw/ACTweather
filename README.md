# ACTweather v0.1.14

以v0.1.13新增氣象標題切換Windy圖層、估算來源訊息、Air Force Institute of Technology英文名稱及快速更新工具。

## 快速更新

將ZIP完整解壓至與原Git專案不同的資料夾，雙擊Update_ACTweather.cmd。輸入原Git專案根目錄，核對路徑、版本及備份位置後輸入Y。

工具會驗證SHA256、檢查main分支與乾淨狀態、pull --ff-only、備份、複製、提交與推送。原檔備份在專案旁ACTweather-backups日期資料夾；.git與未被新版取代的實際截圖保持原狀。

main的package.json版本變更會自動觸發publish-plugin。GitHub先npm ci、編譯與測試，再上傳Windy；也保留手動Run workflow。需沿用已建立的WINDY_API_KEY Secret。不需要GitHub CLI。

推送成功不代表Windy發布成功，請在Actions成功紀錄取得實際官方安裝網址。公開清單核准仍需通知Windy。

完整安裝、操作與備用更新方式：ACTweather_v0.1.14_使用說明.docx。

## 本機開發

npm ci
npm test

132項自動化測試通過，包含編譯後插件與本機Git端到端更新流程。未做Windy實站、實體iPhone與Windows雙擊入口驗收，詳見TEST_REPORT.md。
