## 簡介
- [Demo Link](https://tamytsai.github.io/Blackjack/)
- 本專案為一個21點撲克牌遊戲
- 以HTML、CSS及JavaScript撰寫，為一頁式靜態網頁
- 其中應用Normalize解決不同瀏覽器預設CSS樣式不同的問題
- 使用ES6、jQuery使JavaScript語法變得簡潔（箭頭函式、簡化DOM控制等）
- 採用UJS寫法，維持HTML簡潔

## 功能
- 遊戲規則
  - 點擊「新的一局」按鈕時，發2張牌給玩家，發1張牌給莊家
  - 玩家可決定點擊「再來一張!」或是「不拿了」按鈕
  - 玩家點擊「再來一張!」按鈕時，會再得到一張牌
  - 玩家點擊「不拿了」按鈕時，輪到莊家，且玩家不能再要牌
  - 玩家或莊家點數先到達 21 點者獲勝，遊戲結束
  - 點數超過 21 點者落敗，遊戲結束
  - 若雙方皆未到達21點，點數高者獲勝，遊戲結束
  - 若雙方同點數，平手，遊戲結束
  - 不論花色，1~10 點各表示其牌面上的數字，J、Q、K各表示10點，A表示1點或11點
- 初始畫面僅有「新的一局」按鈕可供點擊，且牌面皆為覆蓋狀態
- 點擊「新的一局」按鈕即進入遊戲進行狀態，「再來一張!」及「不拿了」變為可供點擊
- 遊戲結束後，回到僅有「新的一局」按鈕可供點擊之狀態

## 畫面
### 初始畫面（僅有「新的一局」按鈕可供點擊）
![截圖 2024-05-15初始畫面](https://github.com/TamyTsai/Blackjack/assets/97825677/dc169bc3-1687-4b40-a29e-d6aaf54f0c7a)

### 遊戲進行中（3按鈕皆可供點擊）
![截圖 2024-05-15 遊戲進行中](https://github.com/TamyTsai/Blackjack/assets/97825677/f5a07cf0-eff5-4925-82c9-7b672f88b9d4)

### 玩家獲勝
![截圖 2024-05-15 玩家獲勝](https://github.com/TamyTsai/Blackjack/assets/97825677/6aca3aff-498a-43af-b314-f0f89a4700e6)

### 平手
![截圖 2024-05-15 平手](https://github.com/TamyTsai/Blackjack/assets/97825677/db36ca36-19ea-471d-bcf3-704cda29d856)


## 安裝
### 取得專案
```bash
git clone https://github.com/TamyTsai/Blackjack.git
```
### 移動到專案內
```bash
cd Blackjack
```

## 資料夾及檔案說明
- scripts - JS檔案放置處
  - jquery-3.3.1.min.js - jQuery檔案
  - script.js - 頁面JS檔案，負責網頁功能
- styles - 樣式放置處
  - normalize.css - normalize檔案
  - style.css - 頁面樣式檔案
- index.html - 頁面HTML檔

## 專案技術
- HTML
- CSS
  - Normalize v8.0.1
- JavaScript
  - jQuery v3.3.1
  - ES6
