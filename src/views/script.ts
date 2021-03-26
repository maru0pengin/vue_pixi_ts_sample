import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート
import * as PIXI_SOUND from "pixi-sound";// node_modulesから PIXI_SOUNDをインポート
import { SceneManager } from "./scene_manager"; // シーン管理を行うクラスをインポート
import { createButton } from "./create_button"; // ボタン生成関数をインポート

// package.jsonより、pixi.jsのバージョンはv.5.3.2
// javascriptによるpixi.js講座で扱ったバージョンはv.4.5.5
// 書き方結構変わっているみたい！だけどtypescriptならエラーで指摘してくれるし、
// 入力補完で正しい書き方も教えてくれる！これは助かりますね！

// PIXI_SOUNDを有効にするためには必ずこの初期化命令を実行すること
PIXI_SOUND.default.init();

// PIXI.JSアプリケーションを呼び出す (この数字はゲーム内の画面サイズ)
const app = new PIXI.Application({ width: 400, height: 600 });

// index.htmlのbodyにapp.viewを追加する (app.viewはcanvasのdom要素)
document.body.appendChild(app.view);

// ゲームcanvasのcssを定義する
// ここで定義した画面サイズ(width,height)は実際に画面に表示するサイズ
app.renderer.view.style.position = "relative";
app.renderer.view.style.width = "400px";
app.renderer.view.style.height = "600px";
app.renderer.view.style.display = "block";

// canvasの周りを点線枠で囲う (canvasの位置がわかりやすいので入れている)
app.renderer.view.style.border = "3px dashed #ffcccc";

// canvasの背景色
app.renderer.backgroundColor = 0xdeb887;

// ゲームで使用する画像をあらかじめ読み込んでおく(プリロードという)
// v5.3.2　だと PIXI.Loader.shared.addでプリロードする
PIXI.Loader.shared.add("../sound/hit.mp3");
PIXI.Loader.shared.add("../sound/crear.mp3");
PIXI.Loader.shared.add("../image/1.png");
PIXI.Loader.shared.add("../image/2.png");
const sceneManager = new SceneManager(app);


// 一座標確認に使用
app.view.addEventListener('pointermove', (ev) => {
    console.log(ev.clientX, ev.clientY);
});



// プリロード処理が終わったら呼び出されるイベント
PIXI.Loader.shared.load((loader, resources) => {
    /**
     * 状態が変化する変数一覧
     */

    let score = 0; // スコア
    let timmer = 0; // タイマー
    let displayTimmer = "";

    // このあたりに書いていた、ボタン生成関数やシーン移行関数は別ファイルにまとめてモジュール化しました
    // このファイル先頭でimportしてファイルを引っ張ってきています。便利！


    /**
     * ゲームのメインシーンを生成する関数
     */
    function createGameScene() {
        // 他に表示しているシーンがあれば削除
        sceneManager.removeAllScene();
        // 毎フレームイベントを削除
        sceneManager.removeAllGameLoops();

        // スコアを初期化する
        score = 0;
        // タイマーを初期化する
        timmer = 0;

        // ゲーム用のシーンを生成
        const gameScene = new PIXI.Container();
        // ゲームシーンを画面に追加
        app.stage.addChild(gameScene);

        const image1 = new PIXI.Sprite(resources["../image/1.png"].texture);
        image1.x = 50;
        image1.y = 70;
        gameScene.addChild(image1); // ボールをシーンに追加

        const image2 = new PIXI.Sprite(resources["../image/2.png"].texture);

        image2.x = 50;
        image2.y = 350;
        gameScene.addChild(image2); // ボールをシーンに追加

        //ヒットエリアの描画
        const length = 30;//ヒットエリアの幅
        const radius = 20;//正解時に出す縁の半径


        const differences = [
            { x: 104, y: 394, status: 0, obj: null },
            { x: 110, y: 425, status: 0, obj: null },
            { x: 270, y: 405, status: 0, obj: null },
        ];

        const correctCircle = [
            { x: 104, y: 394, status: 0, obj: null },
            { x: 110, y: 425, status: 0, obj: null },
            { x: 270, y: 405, status: 0, obj: null },
        ];

        differences.forEach((difference, i) => {
            difference.obj = new PIXI.Graphics();
            let rect = new PIXI.Rectangle(difference.x - length / 2, difference.y - length / 2, length, length);
            difference.obj.beginFill(0xfff000, 0); //ヒットエリアは透明
            difference.obj.drawShape(rect);
            difference.obj.endFill();

            difference.obj.interactive = true; // クリック可能にする
            difference.obj.hitArea = rect;

            difference.obj.on('pointerdown', function () { // クリック時に発動する関数
                if (difference.status === 0) {
                    //正解を示す円を表示させる
                    correctCircle[i].obj = new PIXI.Graphics();
                    correctCircle[i].obj.lineStyle(5, 0xec6d71, 1);
                    correctCircle[i].obj.drawCircle(difference.x, difference.y - radius / 2, radius, radius);
                    gameScene.addChild(correctCircle[i].obj);

                    //正解数を増やす
                    score++
                    //正解済みの間違えに設定
                    difference.status = 1
                    resources["../sound/hit.mp3"].sound.play(); // クリックで音が鳴る
                }
            });
            gameScene.addChild(difference.obj) //間違い範囲の図形をシーンに追加
        });

        // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
        const textStyle = new PIXI.TextStyle({
            fontFamily: "Myriad", // フォント
            fontSize: 20,// フォントサイズ
            fill: 0xffffff, // 色(16進数で定義する これはオレンジ色)
        });
        const text = new PIXI.Text(`間違い:0/${differences.length}`, textStyle); //スコア表示テキスト
        text.y = 3;
        text.x = 3;
        gameScene.addChild(text); // スコア表示テキストを画面に追加する

        const textTimer = new PIXI.Text("Timer:0", textStyle); //スコア表示テキスト
        textTimer.y = 3;
        textTimer.x = 150;
        gameScene.addChild(textTimer); // スコア表示テキストを画面に追加する

        const mihon = new PIXI.Text("見本", textStyle); //スコア表示テキスト
        mihon.y = 40;
        mihon.x = 50;
        gameScene.addChild(mihon); // スコア表示テキストを画面に追加する


        const description = new PIXI.Text("下のイラストの間違えをタップしよう！", textStyle); //スコア表示テキスト
        description.y = 290;
        description.x = 15;
        gameScene.addChild(description); // スコア表示テキストを画面に追加する

        function gameLoop() // 毎フレームごとに処理するゲームループ
        {
            // スコアテキストを毎フレームアップデートする
            text.text = `間違い:${score}/${differences.length}`;

            timmer += 1 / 60;
            displayTimmer = timmer.toFixed(2);

            textTimer.text = `Timer:${displayTimmer}`;

            if (score === differences.length) {
                createEndScene() // 結果画面を表示する
                resources["../sound/crear.mp3"].sound.play(); // クリックで音が鳴る
            }
        }

        // ゲームループ関数を毎フレーム処理の関数として追加
        sceneManager.addGameLoop(gameLoop);
    }

    /**
     * ゲームの結果画面シーンを生成する関数
     */
    function createEndScene() {
        // 他に表示しているシーンがあれば削除
        sceneManager.removeAllScene();
        // 毎フレームイベントを削除
        sceneManager.removeAllGameLoops();

        // ゲーム用のシーン表示
        const endScene = new PIXI.Container();
        // シーンを画面に追加する
        app.stage.addChild(endScene);

        // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
        const textStyle = new PIXI.TextStyle({
            fontFamily: "Myriad", // フォント
            fontSize: 28,// フォントサイズ
            fill: 0xffffff, // 色(16進数で定義する これはオレンジ色)
        });

        // テキストオブジェクトの定義
        const text = new PIXI.Text(`${displayTimmer}秒で間違えを\n見つけられました！`, textStyle); // 結果画面のテキスト
        text.anchor.x = 0.5; // アンカーのxを中央に指定
        text.x = 200; // 座標指定 (xのアンカーが0.5で中央指定なので、テキストのx値を画面中央にすると真ん中にテキストが表示される)
        text.y = 100; // 座標指定 (yのアンカーはデフォルトの0なので、画面上から200の位置にテキスト表示)
        endScene.addChild(text); // 結果画面シーンにテキスト追加

        /**
         * 自作のボタン生成関数を使って、もう一度ボタンを生成
         * 引数の内容はcreateButton関数を参考に
         */
        const retryButton = createButton("もう一度", 120, 60, 0xf09199, () => {
            // クリックした時の処理
            createGameScene(); // ゲームシーンを生成する
        });
        retryButton.x = 40; // ボタンの座標指定
        retryButton.y = 500; // ボタンの座標指定
        endScene.addChild(retryButton);　// ボタンを結果画面シーンに追加

        /**
         * 自作のボタン生成関数を使って、ツイートボタンを生成
         * 引数の内容はcreateButton関数を参考に
         */
        const tweetButton = createButton("ツイート", 120, 60, 0x82cddd, () => {
            //ツイートＡＰＩに送信
            //結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
            const url = encodeURI("https://machigae-game.web.app/"); // ツイートに載せるURLを指定(文字はエンコードする必要がある)
            window.open(`http://twitter.com/intent/tweet?text=${displayTimmer}秒で間違えを\n見つけられました！&url=${url}`); //ハッシュタグをsampleにする
        });
        tweetButton.x = 240; // ボタンの座標指定
        tweetButton.y = 500; // ボタンの座標指定
        endScene.addChild(tweetButton); // ボタンを結果画面シーンに追加
    }

    // 起動直後はゲームシーンを追加する
    createGameScene();
});
