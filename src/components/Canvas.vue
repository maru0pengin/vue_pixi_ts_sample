<template>
  <main id="campus">
    <!-- ここにPixiの描画領域(Canvas)が入る -->
    test
  </main>
</template>

<script lang="ts">

import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート
import { Options, Vue } from 'vue-class-component';

const WIDTH = 400;
const HEIGHT = 600;

export default class Canvas extends Vue {


  /** data */
  imgPath: string = require('@/assets/test.png');
  img1Path: string = require('@/assets/image1.png')
  img2Path: string = require('@/assets/image2.png');


  mounted(): void {
    console.log(typeof(this.imgPath));
    const app = new PIXI.Application({ width: WIDTH , height: HEIGHT });
    let el: any = document.getElementById("campus");
    el.appendChild(app.view);

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

    PIXI.Loader.shared.add(this.imgPath);
    PIXI.Loader.shared.add(this.img1Path);
    PIXI.Loader.shared.add(this.img2Path);

    let score = 0; // スコア
    let timmer = 0; // タイマー
    let displayTimmer = "";

    /**
     * ゲームのメインシーンを生成する関数
    */
    function createGameScene() {
      // スコアを初期化する
      score = 0;
      // タイマーを初期化する
      timmer = 0;
      // ゲーム用のシーンを生成
      const gameScene = new PIXI.Container();
      // ゲームシーンを画面に追加
      app.stage.addChild(gameScene);

    }

    PIXI.Loader.shared.load((loader, resources) => {
      console.log("test2")
      let image1 = new PIXI.Sprite(resources[this.imgPath]?.texture);
      image1.x = 50;
      image1.y = 70;
      app.stage.addChild(image1)
    })
    const textStyle = new PIXI.TextStyle({
      fontFamily: "Myriad", // フォント
      fontSize: 20,// フォントサイズ
      fill: 0xffffff, // 色(16進数で定義する これはオレンジ色)
    });

    const description = new PIXI.Text("下のイラストの間違えをタップしよう！", textStyle); //スコア表示テキスト
    description.y = 290;
    description.x = 15;
    app.stage.addChild(description); // スコア表示テキストを画面に追加する

    console.log("test1");
  }

/*
  setup(){
          console.log("test2")
    let image1 = new PIXI.Sprite(resources["test.png"]?.texture);
    image1.x = 50;
    image1.y = 70;
    app.stage.addChild(image1)
  }
*/

}

</script>