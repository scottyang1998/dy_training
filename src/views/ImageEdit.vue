<template>
  <div>
    <el-container>
      <el-aside width="300px">
        <div class="logo">图片管理器</div>
        <div class="download-wrapper">
          <el-row>
            <el-button type="">保存图片</el-button>
            <el-button type="">使用示例图片</el-button>
          </el-row>
        </div>
        <div class="rotate-wrapper">
          <div class="rotate-word word">旋转</div>
          <div class="rotate-toolbar toolbar">
            <a><i class="icon el-icon-refresh-left"></i></a>
            <a><i class="icon el-icon-refresh-right"></i></a>
            <a><i class="icon el-icon-arrow-up"></i></a>
            <a><i class="icon el-icon-arrow-right"></i></a>
          </div>
        </div>
        <div class="clip-wrapper">
          <div class="clip-word word">裁剪</div>
          <div class="clip-toolbar toolbar">
            <span>
              宽度
              <el-input size="mini" type="number" class="clip-input" v-model="clipW" />
            </span>
            <span>
              高度
              <el-input size="mini" type="number" class="clip-input" v-model="clipH" />
            </span>
            <div class="textbut">
              <el-button type="text">确认</el-button>
              <el-button type="text">取消</el-button>
            </div>

          </div>
        </div>
        <div class="filter-wrapper">
          <div class="filter-word word">滤镜</div>
          <div class="filter-toolbar toolbar">
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="panel" :style="editSty">
          <canvas :width="canvasW" :height="canvasH" ref="canvas"></canvas>
          <div class="mask" :style="editSty" @drop.prevent="drop" @click="maskClick">
            <div class="drop-notice" v-show="!canPaint">
              <i class="icon icon-drop"></i>
              <p>拖放图片到此</p>
            </div>
            <textarea :class="textCla" class="textarea" :style="textSty" :readonly="!textContenteditable"
              @mousedown="textMouseDown" @dblclick="textDouble" @input="textInput" draggable="false" ref="text"
              v-model="textText"></textarea>
            <Box :show="showClip" :width="clipW" :height="clipH" :left="clipL" :top="clipT" :borderW="clipBorderW"
              :canvasW="canvasW" :canvasH="canvasH" :canDrag="clipCanDrag" :canvas="$refs.canvas" @change="boxChange">
              <div :style="clipSty"></div>
            </Box>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  import {
    getElemOffset,
    getPointerToElem,
    copy
  } from '../libs/utils.js'
  import Ctx from '../libs/Ctx.js'
  import TimeMachine from '../libs/TimeMachine.js'

  import List from '../components/select.vue'
  import Box from '../components/box.vue'
  import {
    Chrome
  }
    from 'vue-color'

  import demoImg from '../assets/img.png'
  import fmList from '../configs/fm-list.json'
  import figureList from '../configs/figure-list.json'
  import clipList from '../configs/clip-list.json'
  import mosaicList from '../configs/mosaic-list.json'
  import filterList from '../configs/filter-list.json'

  let DATA = {
    timeMachine: null,
    ctx: null,
    mosaicCtx: null,
    beforeBlur: null,
    beforeFilter: null
  }

  export default {

    name: 'ImageEditor',
    props: ['minWidth', 'maxWidth'],
    components: {
      'color-picker': Chrome,
      Box,
      List
    },

    data() {
      return {
        // init main style 
        toolWrapperMargin: 10,
        toolBarH: 40,
        enhanceBarH: 30,
        toolBarMargin: 10,
        minCanvasW: this.minWidth,
        minCanvasH: 500,
        canvasW: this.minWidth,
        canvasH: 500,
        maskOpacity: 0.5,
        maxCanvasW: this.maxWidth,

        // text style
        textL: 10,
        textT: 10,
        textW: 0,
        textFz: 28,
        textBorder: 2,
        textColors: {
          hex: "#ffffff"
        },
        shadowColors: {
          hex: '#000000'
        },
        textAlpha: 1,
        shadowBlur: 0,
        shadowX: 0,
        shadowY: 0,

        // clip style
        clipBorderW: 1,
        clipW: 200,
        clipH: 200,
        clipL: 10,
        clipT: 10,

        // mosaic style 
        mosaicBorderW: 1,
        mosaicW: 200,
        mosaicH: 200,
        mosaicL: 10,
        mosaicT: 10,

        // figure style 
        figureBorderW: 1,
        figureW: 200,
        figureH: 200,
        figureL: 10,
        figureT: 10,
        figureAlpha: 0.5,
        figureColors: {
          hex: "#9E4949"
        },

        // action state
        canPaint: false,
        showText: false,
        showClip: false,
        showBlur: false,
        showMosaic: false,
        showFigure: false,
        showFilter: false,

        //text state
        textContenteditable: false,
        textCanDrag: false,
        textTextGroup: [],
        textText: '双击编辑',
        textMinW: 130,
        textToPointer: null,
        textShowColorPicker: false,
        textShowShadowColorPicker: false,
        textFmList: fmList,
        textFmNow: 0,
        textLine: 1,

        // clip state
        clipCanDrag: false,
        clipList: clipList,
        clipNow: 0,

        // blur state
        blur: 0,
        blurRangeW: 100,
        blurMax: 10,

        // mosaic state
        mosaicCanDrag: false,
        mosaicList: mosaicList,
        mosaicNow: 0,

        // figure state
        figureCanDrag: false,
        figureShowShadowColorPicker: false,
        figureList: figureList,
        figureNow: 0,

        // filter state
        filterList: filterList,
        filterNow: 0,

        // data url
        url: null,
        mosaicUrl: null,
      }
    },

  }
</script>
<style scoped lang='css'>
  /deep/.el-input input::-webkit-outer-spin-button,
  /deep/.el-input input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /deep/.el-input input[type="number"] {
    -moz-appearance: textfield;
  }

  .el-header,
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-input {
    width: 80px;
  }

  .el-input>>>.el-input__inner {
    background-color: #223756;
    border-color: #223756;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 20px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 700px;
    height: 858px;
    overflow-y: hidden;
    position: relative;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .icon {
    color: #96b0cf;
    font-size: 25px;
    margin-left: 40px;
    margin-top: 15px;
  }

  .logo {
    line-height: 50px;
    background-color: #2c3049;
    color: #96b0cf;
  }

  .download-wrapper {
    background-color: #2c4065;
    line-height: 150px;
  }

  .el-row .el-button {
    background: #f88753;
    border-color: #f88753;
    color: white;
  }

  .rotate-wrapper {
    line-height: 50px;
    background-color: #2a4067;
    color: #96b0cf;
    text-align: start
  }

  .word {
    text-align: start;
    padding-left: 20px;
    background-color: #2c4065;
    color: #96b0cf;
    line-height: 30px;
  }

  .toolbar {
    background-color: #2d4a76;
  }

  .rotate-toolbar {
    line-height: 50px;
  }

  .clip-toolbar {
    line-height: 70px;
  }

  .filter-wrapper {
    height: 400px;
    background-color: #2c4065;

  }

  .filter-toolbar {
    line-height: 100px;
  }

  .filterimg {
    margin: 0 20px;
  }

  span {
    color: #96b0cf;
  }

  .textbut .el-button {
    color: #96b0cf;
    line-height: 10px;
  }

  .panel {
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .panel * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  .panel canvas,
  .panel .mask,
  .panel .loading {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2px;
  }

  .panel .loading {
    z-index: 300;
    top: 0;
    left: 0;
    font-size: 30px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  .panel .mask {
    z-index: 50;
    /*
      .loading {
        z-index: 50;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        background: rgba(0, 0, 0, .5);
        color: #ada4a4;
        .loading-icon {
          font-size: 60px;
        }
      }*/
  }

  .panel .mask .drop-notice {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 30px;
    text-align: center;
    transform: translateX(-50%) translateY(-50%);
    color: #ada4a4;
  }

  .panel .mask .drop-notice .icon-drop::before {
    font-size: 60px;
  }

  .panel .mask .textarea {
    position: absolute;
    overflow: hidden;
    background: transparent;
    border-radius: 2px;
    border: 2px dashed #fff;
    resize: none;
    outline: none;
    user-select: none;
    line-height: 100%;
  }

  .panel .mask .textarea.disabled {
    text-align: center;
    cursor: pointer;
    cursor: -webkit-grab;
  }

  .panel .mask .textarea.abled {
    text-align: left;
    cursor: text;
  }

  .panel .mask .box {
    position: absolute;
    cursor: pointer;
    cursor: -webkit-grab;
    border-style: dashed;
    border-color: #fff;
    border-radius: 2px;
  }

  .panel .mask .box .point {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: #20a0ff;
    cursor: move;
    z-index: 200;
  }

  #image-editor .panel .mask .box .point:first-of-type {
    left: 0;
    top: 0;
    transform: translateX(-50%) translateY(-50%);
    cursor: move;
  }

  #image-editor .panel .mask .box .point:nth-of-type(2) {
    right: 0;
    top: 0;
    transform: translateX(50%) translateY(-50%);
  }

  #image-editor .panel .mask .box .point:nth-of-type(3) {
    bottom: 0;
    left: 0;
    transform: translateX(-50%) translateY(50%);
  }

  #image-editor .panel .mask .box .point:nth-of-type(4) {
    right: 0;
    bottom: 0;
    transform: translateX(50%) translateY(50%);
  }
</style>