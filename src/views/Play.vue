<template>
  <div class="play">
    <h1>This is an play page</h1>
  </div>
  <main id="campus">
    <!-- ここにPixiの描画領域(Canvas)が入る -->
    test
    <img alt="Vue logo" src="../assets/test.png" />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { SceneManager } from "./scene_manager"; // シーン管理を行うクラスをインポート

import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート
import * as PIXI_SOUND from "pixi-sound"; // node_modulesから PIXI_SOUNDをインポート

@Options({
  //アノテーション
  components: {
    HelloWorld,
  },
})
export default class Play extends Vue {
  mounted() {
    console.log("aiueo");
    PIXI_SOUND.default.init();

    // PIXI.JSアプリケーションを呼び出す (この数字はゲーム内の画面サイズ)
    const app = new PIXI.Application({
      width: 400,
      height: 600,
    });

    // HTMLの<main id="app"></main>の中に上で作ったPIXIアプリケーション(app)のビュー(canvas)を突っ込む(app.viewはcanvasのdom要素)
    let el: any = document.getElementById("campus");
    el.appendChild(app.view);
    //document.body.appendChild(app.view);

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

    PIXI.Loader.shared.add("../assets/test.png");

    // 一座標確認に使用
    app.view.addEventListener("pointermove", (ev) => {
      console.log(ev.clientX, ev.clientY);
    });

    console.log("test0");
    // プリロード処理が終わったら呼び出されるイベント
    PIXI.Loader.shared.load((loader, resources) => {
      console.log("test1");
      function createGameScene() {
        // ゲーム用のシーンを生成
        const gameScene = new PIXI.Container();
        // ゲームシーンを画面に追加
        console.log(resources);
        app.stage.addChild(gameScene);

        const image1 = new PIXI.Sprite(
          resources["../assets/test.png"]?.texture
        );
        console.log(resources["../assets/test.png"]?.texture);
        image1.x = 50;
        image1.y = 70;
        console.log("test2");
        gameScene.addChild(image1); // ボールをシーンに追加

        // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
        const textStyle = new PIXI.TextStyle({
          fontFamily: "Myriad", // フォント
          fontSize: 20, // フォントサイズ
          fill: 0xffffff, // 色(16進数で定義する これはオレンジ色)
        });
        const description = new PIXI.Text(
          "下のイラストの間違えをタップしよう！",
          textStyle
        ); //スコア表示テキスト
        description.y = 290;
        description.x = 15;
        gameScene.addChild(description); // スコア表示テキストを画面に追加する
      }
      // 起動直後はゲームシーンを追加する
      createGameScene();
    });
  }
}
</script>

<style>
main {
  background-color: red;
}
</style>