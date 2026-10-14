# ACTweather v0.1.12 驗證紀錄

基底：ACTweather_v0.1.11_Preview_FavoriteStyles.zip。日期2026-10-13。

## 修改
面板末端備註，三個分頁及有圖卡預覽時都保持最後位置；Gmail compose連結預填aedy48212tw@gmail.com，新視窗noopener／noreferrer，不自動寄出。Word備註也加入外部Gmail超連結。

作者改航空技術學院陳智羿老師，private:false。增加手動GitHub發布工作流程與prepare-publish.mjs，先建立／測試再打包dist並上傳官方Windy端點；需要使用者帳號及WINDY_API_KEY secret，本次未執行HTTP上傳或送出審核申請。

## 依賴修復與全新安裝
檢查發現前版以全字串替換版本時誤改第三方版本及依賴範圍，包含@swc/counter、@swc/types、deep-is、errno、imurmurhash、jsdom。以實際已測套件版本、npm registry的tarball與integrity校正，並還原受影響依賴範圍。jsdom固定30.1.2，避免再次被插件版本修改污染。清空新目錄後執行npm ci，成功安裝514個套件；本版後續build/test使用這份全新依賴，不沿用舊node_modules。紀錄tests/clean-install-results.txt。

## 自動化
npm test執行官方Svelte/Rollup編譯與113項測試，113通過、0失敗、0跳過，紀錄tests/test-results.txt。保留109項既有測試，新增Gmail收件者連結／不寄出、所有分頁與圖卡預覽的末端備註、發布資料準備／版本與private防護、workflow手動觸發／先測後上傳等4項。

## 發布流程dry run
YAML解析核對manual workflow_dispatch、Node24與Secret引用。prepare-publish.mjs在本機臨時目錄合併repositoryName、commitSha、repositoryOwner，維持版本與built值；錯誤版本或private:true明確拒絕。另將真實dist封成plugin.tar，讀回確認plugin.min.js、plugin.json、版本0.1.12、private:false、作者及Gmail連結。此處repo資料為明示的example/ACTweather測試值，未寫入正式dist，未使用API金鑰或執行網路上傳。紀錄tests/publish-dry-run.json。

## 前版圖卡紀錄與限制
v0.1.11的5個真實Canvas／JSDOM／IndexedDB模擬情境保留於tests/card-download-check.v0.1.11.json；本次只修改備註與發布設定，未重做圖片合成或把歷史紀錄說成新實站測試。tests/live-tile-check.json為0.1.7歷史圖磚紀錄。

本版未完成真實Windy WebGL八圖層截圖、實體手機、Gmail已登入頁面的互動或GitHub託管runner／Windy上傳端到端驗收。Gmail檢查為連結結構與收件者；實際使用需登入Gmail。Windy官方插件公開清單需要另外審核。內部圖層快取介面、產品可用性、帳號權限與資料時段仍可能影響截圖。

## Word與套件
Word8頁，保留安裝／操作／風格，新增發布者、URL載入使用者、公開清單審核與更新流程，逐頁渲染查看。超連結關聯XML核對Gmail收件者。ZIP包含dist、獨立版本JS、Word、原始碼、發布workflow與輔助script、啟動器、測試紀錄與SHA256SUMS.json；不含node_modules、API金鑰或QA圖片。

## 核對來源
https://docs.windy-plugins.com/getting-started/publishing-plugin.html
https://docs.windy-plugins.com/getting-started/updating-plugin.html
https://docs.windy-plugins.com/api/interfaces/ExternalPluginConfig.html
https://github.com/windycom/windy-plugin-template
https://raw.githubusercontent.com/windycom/windy-plugin-template/main/.github/workflows/publish-plugin.yml
https://github.com/actions/checkout
https://github.com/actions/setup-node
