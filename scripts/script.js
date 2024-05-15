let yourDeck = []; // 一開始玩家牌組為 空陣列
let dealerDeck = []; // 一開始莊家牌組為 空陣列
let yourPoint = 0; // 一開始玩家點數為0
let dealerPoint = 0; // 一開始莊家點數為0
let inGame = false; // 一開始 遊戲是否進行中 為 否
let winner = 0; //勝者為誰 0:未定 1:玩家贏 2:莊家贏 3:平手

//變數要放在 function 裡面還是外面，一個很簡單的判斷規則，就是「其它 function 會不會用到它」
// 會用到的話，就放在 function 外面，用不到的話，就放在 function 裡面(區域變數)。
// 如果放在 function 裡，當 newGame() 這個 function 執行完之後，這裡的 yourDeck 跟 dealerDeck 都會隨著消滅，那對整個遊戲來說，等於是什麼牌都沒有發了喔。
// 效能上會不會有差別? 可能會，但這影響非常小，所以選擇全域或區域變數的理由，通常不是因為效能，而是為了「隔離」，畢竟把東西放在全域，每個 function 都有機會污染它。

$(document).ready(function(){ // jQuery寫法 等 DOM元素都準備好（載入）後 再啟動JS
    initCards();
    initButtons();
});

// 卡牌初始化 函數
// 讓卡牌背面有㊖字
function initCards() {
    // 抓出所有卡牌 裝進DOM元素allCards
    // let allCards = document.querySelectorAll('.card div');
    // // ES6寫法 let作用範圍只在此程式碼區塊中
    // // 把抓出來的DOM元素的內容修改（用迴圈方法一次改好幾個元素）
    // allCards.forEach( card => {
    //     // ES6的方法 ForEach 迴圈（對陣列中每個元素做某一件事）
    //     card.innerHTML = '㊖';
    //     // ES6寫法 省略function，直接寫參數名稱（card），箭頭後面接 函數內容
    //     // ES5寫法：function(card) {card.innerHTML = '㊖';};
    //     // 把每一張卡牌元素裡面的內容都替換成㊖
    // }); 
    // // call back function 把函數當參數用（forEach的參數）
    // 先抓進變數後 再改變內容

    // jQuery簡寫寫法，把類別為card的HTML元素集合（陣列）的內容通通換成 字串㊖（不用用迴圈就可以一次替換掉一陀元素的內容）
    // 用$抓HTML元素
    // jQuery抓完直接改內容
    $('.card div').html('㊖');
    // card類別中 的 div標籤
}

// 初始化 動作按鈕 函數
function initButtons() {

    // 抓出「新的一局」按鈕，監聽click事件，事件發生後 執行 newGame函數

    // document.querySelector('#action-new-game').addEventListener('click', evt => { // addEventListener('要監聽的事件',事件發生後要做的動作）（UJS寫法）
    //     console.log('hi');
    // });
    // jQuery簡寫寫法：
    // 不用寫addEventListener，直接寫要監聽的事件，並接上事件發生後要執行的行為（此處為一ES6箭頭函數）
    // $('#action-new-game').click( evt => {
    //     newGame();
    // });
    // 箭頭函數內容只有一行的話 可省略大括弧
    $('#action-new-game').click( evt => newGame()); // 按下「新的一局」按鈕 呼叫newGame()函數
    // evt一定要加嗎？addEventListener 這個 function 顧名思義，就是要為某個元素加上「監聽器（Listener）」的功能，像上面的例子就是幫某個 DOM 元素加上了監聽 click 事件。當 click 事件觸發後就執行後面那個 function，例如在你的例子中就是印出 hi 字樣。而當 click 這件事發生的時候，你想要知道到底是「被按的人是誰（event.target）」，或是想要「變更點擊之後應該發生的事」（例如你點了一個超連結，原本應該會連到某個頁面，你可使用 event.preventDefault() 來中止原本的行為，然後做你想做的事），都是做得到的。這都是這個 event 能做的事關於。event，更多資訊可參閱這個頁面的說明 https://www.w3schools.com/jsref/dom_obj_event.asp

    // 抓出「再來一張！」按鈕，監聽click事件，事件發生後 執行 函數
    $('#action-hit').click( evt => {
        evt.preventDefault(); // 使用 event.preventDefault() 來中止原本的行為，然後做你想做的事
        yourDeck.push(deal()); // 從牌組拿一張牌 到 玩家牌組中
        renderGameTable(); // 顯示更新後的牌面與點數
    });

    // 抓出「不拿了」按鈕，監聽click事件，事件發生後 執行 函數
    $('#action-stand').click( evt => {
        dealerDeck.push(deal());
        dealerRound(); // 玩家點擊 不拿了（之後不能再拿） 進入 莊家回合 工人智慧（內含renderGameTable();）（決定莊家是否繼續拿牌）
    });

};

// 按下「新的一局」按鈕要進行的動作 函數
// 把洗好的牌 丟進 deck牌組陣列中
// 發給玩家一張牌，發給莊家一張牌，再發給玩家一張牌
function newGame() {
    
    // 初始化遊戲（牌組清空 點數歸零 牌面重整（蓋回去） 移除印章）
    resetGame ();

    // 遊戲是否進行中 改為 是
    inGame = true;

    deck = shuffle(buildDeck()); //按下「新的一局」按鈕時，就把洗好的牌 丟進 deck牌組陣列中
    // 的確這裡這樣的寫法可能會造成全域的污染，這樣不是個好的寫法。這裡應該要在最外面 var 或 let / const 來宣告變數或常數再來使用才是比較正確的寫法。

    yourDeck.push(deal()); // 呼叫 發牌函數（從deck牌組陣列中，取得第一個資料），並把 該函數回傳值 丟進 yourDeck玩家牌組 陣列
    dealerDeck.push(deal());
    yourDeck.push(deal());

    test(); //測試用函數，沒有要測試的話，要關起來

    newGameRenderGameTable(); // 點下「新的一局」時的 決定畫面呈現 之 函數（輸贏判斷函數使用newGameCheckWinner()）
};

// 測試用函數
function test() {
    // 直接控制牌組內容
    // yourDeck = [{suit: 1,number: 1}, {suit: 2,number: 2}];

    // 直接操控總點數
    // dealerPoint = 19;
    // yourPoint = 18;

    // 檢視牌組陣列內容
    console.log(yourDeck); //檢視玩家牌組
    // console.log(dealerDeck); //檢視莊家牌組
    // console.log(deck); //檢視荷官牌組
    console.log(countACards(yourDeck));
    console.log(calcPoint(yourDeck));
};

// 發牌 函數
function deal() {
    return deck.shift(); // 從deck牌組陣列中，取得第一個元素
}

// 卡牌模版
class Card { // ES6 物件導向的寫法 // 物件實字（用大括弧建立物件）
    constructor(suit,number) { //初始化卡牌要傳進的參數 suit,number 
        this.suit = suit; // 把 suit行為 傳進此class的 suit屬性（不一定要同名）
        this.number = number;
    }

    // 卡牌上的數字（顯示在畫面用）
    cardNumber() {
        switch (this.number) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.number;
        };
    };
    //其實 switch case 應該都要加上 break 的，但因為這裡使用了 return 回傳結果並結束了整個 function，所以沒有加也會中止 switch case 而得到一樣的結果。
    
    // 點數（計算用）
    cardPoint() {
        switch (this.number) {
            case 1: //  如果 number == 1，就回傳11 ('A')
                return 11;
            case 11:
            case 12:
            case 13:
                return 10; // J、Q、K 都算10點
            default:
                return this.number;
        }
    }

    // 花色
    cardSuit() {
        switch (this.suit) {
            case 1:
                return '♠';
            case 2:
                return '♥';
            case 3:
                return '♣';
            case 4:
                return '♦';
            }
        }
}

// 建立牌組（52張牌）（按花色、大小裝進陣列，整齊的牌組陣列）
function buildDeck() {
    let deck = []; // 牌組 空陣列

    // 兩層迴圈，第一層迴圈跑花色suit，第二層跑數字，跑出 4*13=52種 花色與數字之組合
    for(let suit = 1; suit <= 4; suit++) { // suit起始值為1，在suit<=4時進行此程式碼區塊，每次執行完都指定suit+1的數字給suit（中間用分號隔開）
        for(let number = 1; number <= 13; number++) {
            let c = new Card(suit, number); // 底下有一個Card模版 這裡用該模版蓋出一個變數c，一出生就有suit與number屬性
            deck.push(c); // 用陣列的push方法，把 變數c的內容 塞進 deck這個牌組空陣列（加到最後面）
        }
    }

    return deck; // 讓此函數 回傳 牌組（陣列）
}

// 洗牌（打亂陣列的方法）
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

// 決定畫面呈現 之 函數
// 顯示 玩家與莊家拿到的牌（花色、數字）
// 顯示 玩家與莊家的點數 並依是否有人大於等於21點 判斷是否結束遊戲
// 啟動 「再來一張！」與「不拿了」按鈕
function renderGameTable () {

    //抓出玩家卡片DOM元素，更改牌面及花色內容
    yourDeck.forEach((card, i) => { //card為參數（目前的值），i為索引 //forEach 後面接的是一個 function，根據 forEach 的手冊的說明，這個 function 的第一個參數是「目前的值」，第二個參數是 index。所以這個 card 就是代表「目前的值」，因為這是從一整疊牌（yourDeck）開始跑 forEach 迴圈，所以我就把「目前的值」命名為「card」，如果你想換 abc 或 xyz 也都沒問題的，但為了程式碼的可讀性，建議最好可以用一眼就知道是什麼用途的名字。不過，就以這個例子來說，這裡這個 card 剛好在 function 裡面沒用到，只有用到 i 而已，所以像這種 沒用到但又必須得要帶進來的參數，通常會用底線來取代它，例如：yourDeck.forEach(( _, i) => {// }); 關於 forEach 方法可參考 https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

        let theCard = $(`#yourCard${i + 1}`); 
        //用jQuery寫法抓出id為yourCard1~5的元素（玩家桌上的五張牌） 指定給變數theCard成為DOM元素 （陣列）
        //`${}`為ES6 字串 與 變數 串接 之 寫法  //這個 `....`  包起來的意思，在 ES6 的寫法，表示會把這個符號包起來的東西進行「翻譯」
        //i為0~4，為了變成1~5，所以要+1

        theCard.html(card.cardNumber()); // cardValue()為Card類別中的函數
        //jQuery寫法 替換掉DOM元素（玩家桌上的五張牌）對應的HTML內容
        theCard.prev().html(card.cardSuit());
        //jQuery方法，prev為previous，會抓到該DOM元素對應的HTML元素 的 前一個元素（不是外面一個元素）
        //HTML：<span></span><div class="yourCard" id="yourCard1">，yourCard1 前一個元素 為 span （裝花色用的）
        // $(`#yourCard${i + 1}`).html('A');
    });
    // ES5寫法：function(card,i) {.....;};

    //抓出莊家卡片DOM元素，更改牌面及花色內容
    dealerDeck.forEach((card, i) => { //card為參數，i為索引
        let theCard = $(`#dealerCard${i + 1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());
    });

    // 將計算好的點數 顯示出來 並判定是否結束遊戲
    yourPoint = calcPoint(yourDeck); //把玩家牌組 放進 calcPoint中算總點數 將回傳之數值 指定給 yourPoint //let??
    dealerPoint = calcPoint(dealerDeck);

        //判定是否結束遊戲
    if (yourPoint >= 21 || dealerPoint >= 21) { // 玩家 或 莊家 點數大於等於21點
        inGame = false;
    };

        // 判斷輸贏
    checkWinner();

        // 依據輸贏結果，決定把勝利效果呈現在哪
    showWinStamp();

        //抓HTML元素（「玩家」、「莊家」），改其內容（「玩家（？點）」、「莊家（?點）」）
    $('.your-cards h1').html(`玩家（${yourPoint}點）`);
    $('.dealer-cards h1').html(`莊家（${dealerPoint}點）`);

    // 啟動 「再來一張！」與「不拿了」按鈕
    // if (inGame) { //inGame為true的話 就執行這個程式碼區塊
    //     $('#action-hit').attr('disabled',false); //attr為jQuery方法，更改DOM元素屬性 
    //     $('#action-stand').attr('disabled',false);
    //     //原HTML： <input type="button" id="action-hit" class="action-button" value="再來一張!" disabled>
    // }
    // else 
    // {
    //     $('#action-hit').attr('disabled',true);
    //     $('#action-stand').attr('disabled',true);
    // };
    $('#action-hit').attr('disabled', !inGame); //遊戲進行中時（inGame為true），按鈕要可以按（disabled 要為 false），所以disabled 要被 改為 inGame狀態的相反（!inGame）
    $('#action-stand').attr('disabled', !inGame);
    //簡短寫法
};

// 點下「新的一局」時的 決定畫面呈現 之 函數（輸贏判斷函數使用newGameCheckWinner()）
function newGameRenderGameTable () {

    //抓出玩家卡片DOM元素，更改牌面及花色內容
    yourDeck.forEach((card, i) => { //card為參數（目前的值），i為索引 //forEach 後面接的是一個 function，根據 forEach 的手冊的說明，這個 function 的第一個參數是「目前的值」，第二個參數是 index。所以這個 card 就是代表「目前的值」，因為這是從一整疊牌（yourDeck）開始跑 forEach 迴圈，所以我就把「目前的值」命名為「card」，如果你想換 abc 或 xyz 也都沒問題的，但為了程式碼的可讀性，建議最好可以用一眼就知道是什麼用途的名字。不過，就以這個例子來說，這裡這個 card 剛好在 function 裡面沒用到，只有用到 i 而已，所以像這種 沒用到但又必須得要帶進來的參數，通常會用底線來取代它，例如：yourDeck.forEach(( _, i) => {// }); 關於 forEach 方法可參考 https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

        let theCard = $(`#yourCard${i + 1}`); 
        //用jQuery寫法抓出id為yourCard1~5的元素（玩家桌上的五張牌） 指定給變數theCard成為DOM元素 （陣列）
        //`${}`為ES6 字串 與 變數 串接 之 寫法  //這個 `....`  包起來的意思，在 ES6 的寫法，表示會把這個符號包起來的東西進行「翻譯」
        //i為0~4，為了變成1~5，所以要+1

        theCard.html(card.cardNumber()); // cardValue()為Card類別中的函數
        //jQuery寫法 替換掉DOM元素（玩家桌上的五張牌）對應的HTML內容
        theCard.prev().html(card.cardSuit());
        //jQuery方法，prev為previous，會抓到該DOM元素對應的HTML元素 的 前一個元素（不是外面一個元素）
        //HTML：<span></span><div class="yourCard" id="yourCard1">，yourCard1 前一個元素 為 span （裝花色用的）
        // $(`#yourCard${i + 1}`).html('A');
    });
    // ES5寫法：function(card,i) {.....;};

    //抓出莊家卡片DOM元素，更改牌面及花色內容
    dealerDeck.forEach((card, i) => { //card為參數，i為索引
        let theCard = $(`#dealerCard${i + 1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());
    });

    // 將計算好的點數 顯示出來 並判定是否結束遊戲
    yourPoint = calcPoint(yourDeck); //把玩家牌組 放進 calcPoint中算總點數 將回傳之數值 指定給 yourPoint //let??
    dealerPoint = calcPoint(dealerDeck);

        //判定是否結束遊戲
    if (yourPoint >= 21 || dealerPoint >= 21) { // 玩家 或 莊家 點數大於等於21點
        inGame = false;
    };

        // 點下「新的一局」時的 輸贏判斷 函數（只判斷玩家是否一開始就21點 並讓玩家直接獲勝）
    newGameCheckWinner();

        // 依據輸贏結果，決定把勝利效果呈現在哪
    showWinStamp();

        //抓HTML元素（「玩家」、「莊家」），改其內容（「玩家（？點）」、「莊家（?點）」）
    $('.your-cards h1').html(`玩家（${yourPoint}點）`);
    $('.dealer-cards h1').html(`莊家（${dealerPoint}點）`);

    // 啟動 「再來一張！」與「不拿了」按鈕
    // if (inGame) { //inGame為true的話 就執行這個程式碼區塊
    //     $('#action-hit').attr('disabled',false); //attr為jQuery方法，更改DOM元素屬性 
    //     $('#action-stand').attr('disabled',false);
    //     //原HTML： <input type="button" id="action-hit" class="action-button" value="再來一張!" disabled>
    // }
    // else 
    // {
    //     $('#action-hit').attr('disabled',true);
    //     $('#action-stand').attr('disabled',true);
    // };
    $('#action-hit').attr('disabled', !inGame); //遊戲進行中時（inGame為true），按鈕要可以按（disabled 要為 false），所以disabled 要被 改為 inGame狀態的相反（!inGame）
    $('#action-stand').attr('disabled', !inGame);
    //簡短寫法
};

// 重新開始遊戲（初始化） 函數
// 牌組清空 點數歸零 牌面重整（蓋回去） 移除印章
function resetGame () {
        deck = []; // 把牌組清為空陣列
        yourDeck = []; // 玩家牌組清為空陣列
        dealerDeck = []; // 莊家牌組清為空陣列
        yourPoint = 0; //玩家點數歸零
        dealerPoint = 0; //莊家點數歸零
        winner = 0; //回到 勝負未定 狀態
        initCards(); //牌面重整（蓋回去）（顯示財字）
        $('.card span').html(''); //移除花色
        $('.zone').removeClass('win'); //移除勝利印章
        $('.zone').removeClass('deuce'); //移除平手印章
};

// 莊家回合 工人智慧（前提：玩家點擊 不拿了（之後不能再拿））
// 決定莊家是否繼續拿牌
// 如果因為點數 >= 玩家而停止要牌，則讓遊戲結束，並重新呈現牌桌
function dealerRound() {
    // 1. 拿牌
    // 2. 如果 點數 >= 玩家，遊戲結束，莊家贏(或平手)
    // 3. 如果 點數 < 玩家，繼續拿牌，重複1.
    // 4. 點數爆掉，遊戲結束，玩家贏

    while(true) {
        dealerPoint = calcPoint(dealerDeck); //因為 dealerDeck 可能會不斷的被改變（被 push 新的牌進去），所以在每回合都需要呼叫 calcPoint 來重新計算一次點數
        if (dealerPoint < yourPoint) {
            dealerDeck.push(deal()); // 如果點數<玩家就 要牌
        } 
        else {
            break; //離開迴圈
        };
    };

    inGame = false; //莊家點數大於玩家，且因為玩家是已經不拿牌了才換莊家要牌，玩家之後不能再拿牌，所以現在這個情況必定是莊家贏，遊戲結束
    renderGameTable(); //重新渲染畫面（呈現牌桌）
};

// 計算點數 函數
function calcPoint(deck) { //計算莊家或玩家手上牌組的 點數
    let point = 0; // 莊家或玩家 初始點數為0

    // 把牌組丟進迴圈跑，指定 點數（計算用）回傳的值 給 point變數
    deck.forEach(card => { //deck為此函數calcPoint(deck)之 參數 
        point += card.cardPoint(); //card為此函數forEach裡匿名函數之參數 //把point加上card.cardPoint()的值 指定回給 變數point
    }) // 把 參數為card的匿名函數 當成 forEach的參數在用 所以參數為card的匿名函數是callback function
    // 判斷是否有人有A 且 點數爆掉，A改成以1點計算
    if (point > 21) {
        deck.forEach(card => {
            if (card.cardNumber() === 'A') {
                point -= 10; //將point的值-10後 指定回給point
            } // cardNumber()（顯示在畫面上的卡牌上的數字）如果為A ，就將點數-10點（A為1或11，原本算11，但這裡點數已超過21點爆掉，所以-10變1）
            // 現況（待優化）：會依據A的擁有數決定減幾次10，也就是多張A時會全部被當1點（如兩張A會變22點，所以就進入此流程控制，被減20，剩2，但一般來說，會想把一張A當11，一張當1，共12點）
        })
    }

    return point;
};


// 計算牌組有幾張A
function countACards(countDeck) {
    //把 牌 的 屬性number 的 值 放到 變數FiveCards，形成陣列
    let FiveCards = [countDeck[0].number, countDeck[1].number];
    if (countDeck.length >= 3) {
        FiveCards.push(countDeck[2].number);
    } else if (countDeck.length >= 4) {
        FiveCards.push(countDeck[3].number);
    } else if (countDeck.length >= 5) {
        FiveCards.push(countDeck[4].number);
    };

    //篩選 陣列FiveCards 中 等於1的元素，形成新陣列，並回傳此新陣列之長度（即為牌組中A的張數）
    return FiveCards.filter(function(value) {return value == 1;}).length;
};

// 計算牌組中除掉A後的分數
// function calcPointRemoveA(deckRemoveA) {
//     if (1 in FiveCards) {
//         //將陣列去除A，然後計算分數
//     };
// };

// 修正後 計算點數 函數（可應對多張A的狀況）
// function calcPoint(deck) { //計算莊家或玩家手上牌組的 點數
//     let point = 0; // 莊家或玩家 初始點數為0

//     // 把牌組丟進迴圈跑，指定 點數（計算用）回傳的值 給 point變數
//     deck.forEach(card => { //deck為此函數calcPoint(deck)之 參數 
//         point += card.cardPoint(); //card為此函數forEach裡匿名函數之參數 //把point加上card.cardPoint()的值 指定回給 變數point
//     }) // 把 參數為card的匿名函數 當成 forEach的參數在用 所以參數為card的匿名函數是callback function

//     if (countACards(yourDeck) == 1) {
//         if (point > 21) {
//             deck.forEach(card => {
//                 if (card.cardNumber() === 'A') {
//                     point -= 10;
//                 }
//             })
//         };
//     } else if (countACards(yourDeck) == 2) {
//         if (point > 31) {
//             deck.forEach(card => {
//                 if (card.cardNumber() === 'A') {
//                     point -= 20;
//                 }
//             })
//         };
//     } else if (countACards(yourDeck) == 3) {
//         if (point > 41) {
//             deck.forEach(card => {
//                 if (card.cardNumber() === 'A') {
//                     point -= 30;
//                 }
//             })
//         };
//     } else if (countACards(yourDeck) == 4)  {
//         if (point > 51) {
//             deck.forEach(card => {
//                 if (card.cardNumber() === 'A') {
//                     point -= 30;
//                 }
//             })
//         };
//     };

//     return point;
// };

// 修正後 計算點數 函數（可應對多張A的狀況）
// function calcPoint(deck) { //計算莊家或玩家手上牌組的 點數
//     let point = 0; // 莊家或玩家 初始點數為0

//     // 把牌組丟進迴圈跑，指定 點數（計算用）回傳的值 給 point變數
//     deck.forEach(card => { //deck為此函數calcPoint(deck)之 參數 
//         point += card.cardPoint(); //card為此函數forEach裡匿名函數之參數 //把point加上card.cardPoint()的值 指定回給 變數point
//     }) // 把 參數為card的匿名函數 當成 forEach的參數在用 所以參數為card的匿名函數是callback function

//     if (countACards(yourDeck) == 1) {
//         if (point > 21) {
//             point -= 10;
//         };
//     } else if (countACards(yourDeck) == 2) {
//         if (point > 31) {
//             point -= 20;
//         };
//     } else if (countACards(yourDeck) == 3) {
//         if (point > 41) {
//             point -= 30;
//         };
//     } else if (countACards(yourDeck) == 4)  {
//         if (point > 51) {
//             point -= 40;
//         };
//     };

//     return point;
// };

// 普通 輸贏判斷 函數
function checkWinner() {
    switch(true) {
        // 1. 如果玩家 21 點，玩家贏（玩家一開始就拿到兩張牌，所以有可能一開始就21點，但莊家一開始只有拿一張，所以不可能一開始就21點，在此狀況下，莊家獲勝條件只有點數大於玩家，而此條件也順便包含莊家21點）
        case yourPoint == 21: // 有可能「一開始」玩家就21點，但此時直接獲勝結束遊戲也沒關係
          winner = 1;
          break;
    
        // 2. 如果有人點數爆掉，對方贏
        case yourPoint > 21: // 玩家一開始只有兩張牌，所以不可能「一開始」玩家就>21
          winner = 2;
          break;
    
        case dealerPoint > 21: // 莊家一開始只有一張牌，所以不可能「一開始」莊家就>21
          winner = 1;
          break;
    
        // 3. 平手
        case dealerPoint == yourPoint: // 有可能「一開始」雙方點數相等，所以要做另外處理
          winner = 3;
          break;
    
        // 0. 比點數 //不能放在最前面！因為前面情況只要有符合，就不會再判斷是否符合後面其他情況，這個情況放最前面，會導致 莊家即使點數爆掉，但因為先判斷到了 莊家點數大於玩家，所以還是會判斷贏家為莊家
        case dealerPoint > yourPoint: // 有可能「一開始」莊家點數大於玩家，所以要做另外處理
          winner = 2;
          break;

        // 預設 勝負未定 繼續遊戲
        default:
          winner = 0;
          break;
      };
};

// 點下「新的一局」時的 輸贏判斷 函數（只判斷玩家是否一開始就21點 並讓玩家直接獲勝）
function newGameCheckWinner() {
    switch(true) {
        // 1. 如果玩家 21 點，玩家贏（玩家一開始就拿到兩張牌，所以有可能一開始就21點，但莊家一開始只有拿一張，所以不可能一開始就21點，在此狀況下，莊家獲勝條件只有點數大於玩家，而此條件也順便包含莊家21點）
        case yourPoint == 21: // 有可能「一開始」玩家就21點，但此時直接獲勝結束遊戲也沒關係
          winner = 1;
          break;

        // 預設 勝負未定 繼續遊戲
        default:
          winner = 0;
          break;
      }; 
}

// 依據輸贏結果，決定把勝利效果呈現在哪
function showWinStamp() {
    switch(winner) {
      case 1: // winner == 1 玩家贏
          $('.your-cards').addClass('win'); //用jQuery的方式把class為your-cards的DOM元素 添加win的class（win為寫在css裡的勝利效果）
          break;
      case 2: // winner == 2 莊家贏
          $('.dealer-cards').addClass('win');
          break;
      case 3: // winner == 3 平手
          $('.dealer-cards').addClass('deuce');
          break;
      default: //可寫可不寫
          break;
    };
};




