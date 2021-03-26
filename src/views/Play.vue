<template>
  <div class="play">
    <h1>This is an play page</h1>
  </div>
  <Canvas />
  <main id="campus">
    <!-- ここにPixiの描画領域(Canvas)が入る -->
    test
    <img alt="Vue logo" src="../assets/test.png" />
  </main>
</template>

<script lang="ts">

import { Options, Vue } from "vue-class-component";
import Canvas from "@/components/Canvas.vue"; // @ is an alias to /src

import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート
import * as PIXI_SOUND from "pixi-sound"; // node_modulesから PIXI_SOUNDをインポート



@Options({
  //アノテーション

  components: {
    Canvas,
  },

})
export default class Play extends Vue {

}
</script>

<style>
main {
  padding: 10px;
  background-color: red;
}
</style>