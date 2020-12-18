<!-- 
<template>
  <div id="image-editor" :style="imageEditorSty">
    <a class=" hide" id="download-link"></a>
    <div class="toolbar-wrapper" :style="toolWrapperSty" style="color: rgb(31, 48, 48);">
      <div class="toolbar funcbar" :style="funcSty">
        <div class="menu">
          <a @click="toggleClip"><i class="el-icon-scissors"></i>裁剪</a>
          <a @click="toggleRotate"><i class="el-icon-refresh"></i>旋转</a>
          <a @click="toggleFilter"><i class="el-icon-film"></i>滤镜</a>
        </div>
        <a class="main-btn download" @click="download"><i class=" el-icon-download"></i>保存图片</a>
        <a class="main-btn reset" @click="reset"><i class="el-icon-close"></i>重置</a>
        <a class="main-btn restore" @click="stage('restore')"><i class="el-icon-arrow-right"></i></a>
        <a class="main-btn undo" @click="stage('undo')"><i class=" el-icon-arrow-left"></i></a>
        <a class="main-btn demo" @click="demo"><i class=" el-icon-picture-outline"></i>使用示例图片</a>
        <label class="main-btn open"><i class="el-icon-folder-opened"></i>打开
          <input type="file" style="visibility:hidden;display:block;width:1;height:0" @change="open">
        </label>
      </div>
      <div class="toolbar enhance clip-enhance" :style="enhanceSty" v-show="showClip">
        <div class="menu">
          <a class="main-btn" @click="downloadClip">裁剪并导出</a>
          <List :btns="clipList" v-model="clipNow"></List>
          <label>
            水平
            <input type="number" class="clip-input" v-model="clipL" />
          </label>
          <label>
            垂直
            <input type="number" class="clip-input" v-model="clipT" />
          </label>
          <label>
            宽度
            <input type="number" class="clip-input" v-model="clipW" />
          </label>
          <label>
            高度
            <input type="number" class="clip-input" v-model="clipH" />
          </label>
        </div>
      </div>
      <div class="toolbar enhance filter-enhance" :style="enhanceSty" v-show="showFilter">
        <div class="menu">
          <List :btns="filterList" v-model="filterNow" @change="filterSelect"></List>
        </div>
      </div>
    </div>
    <div class="panel" :style="editSty">
      <canvas :width="canvasW" :height="canvasH" ref="canvas"></canvas>
      <div class="mask" :style="editSty" @drop.prevent="drop" @click="maskClick">
        <Box :show="showClip" :width="clipW" :height="clipH" :left="clipL" :top="clipT" :borderW="clipBorderW"
          :canvasW="canvasW" :canvasH="canvasH" :canDrag="clipCanDrag" :canvas="$refs.canvas" @change="boxChange">
          <div :style="clipSty"></div>
        </Box>
      </div>
    </div>
  </div>
</template>


<script>
  export default {

    data() {
      return {
        // init main style 
        toolWrapperMargin: 10,
        toolBarH: 40,
        enhanceBarH: 30,
        toolBarMargin: 10,
        minCanvasW: 800,
        minCanvasH: 500,
        canvasW: 800,
        canvasH: 500,
        maskOpacity: 0.5,
        maxCanvasW: 1000,

        // clip style
        clipBorderW: 1,
        clipW: 200,
        clipH: 200,
        clipL: 10,
        clipT: 10,

        // action state
        canPaint: false,
        showClip: false,
        showFilter: false,

        // clip state
        clipCanDrag: false,
        clipList: clipList,
        clipNow: 0,

        // filter state
        filterList: filterList,
        filterNow: 0,

        // data url
        url: null,
        mosaicUrl: null,
      }
    },

    watch: {
      textFz(val, old) {
        this.backToOld(val, old, 'fz')
      },

      textFmNow(val, old) {
        this.backToOld(val, old, 'fm')
      }
    },

    computed: {
      // style 
      // style outer
      imageEditorSty() {
        return {
          width: this.canvasW < this.minCanvasW ? this.minCanvasW + 'px' : this.canvasW + 'px',
          height: ((this.canvasH < this.minCanvasH ? this.minCanvasH : this.canvasH) + this.toolWrapperMargin + this.toolBarH + this.enhanceBarH + this.toolBarMargin) + 'px'
        }
      },

      toolWrapperSty() {
        return {
          height: this.toolBarH + this.enhanceBarH + this.toolBarMargin + 'px',
          marginBottom: this.canvasH < this.minCanvasH ? (this.minCanvasH - this.canvasH + this.toolWrapperMargin) / 2 + 'px' : this.toolWrapperMargin + 'px'
        }
      },

      funcSty() {
        return {
          height: this.toolBarH + 'px',
          marginBottom: this.toolBarMargin + 'px'
        }
      },

      enhanceSty() {
        return {
          height: this.enhanceBarH + 'px'
        }
      },

      editSty() {
        return {
          width: this.canvasW + 'px',
          height: this.canvasH + 'px',
          backgroundColor: (this.showClip) ? 'rgba(0,0,0,' + this.maskOpacity + ')' : 'transparent'
        }
      },

      // style clip
      clipSty() {
        return {
          width: this.clipW - this.clipBorderW * 2 + 'px',
          height: this.clipH - this.clipBorderW * 2 + 'px',
          backgroundImage: this.url == null ? 'none' : 'url(' + this.url + ')',
          backgroundPosition: (-this.clipL - this.clipBorderW) + 'px ' + (-this.clipT - this.clipBorderW) + 'px',
          borderRadius: this.clipNow == 0 ? '0' : '50%'
        }
      },
    },

    methods: {
      // upload image
      init(url) {
        let img = new Image()
        img.crossOrigin = "Anonymous";
        let natureW, natureH, scale = 1
        img.onload = () => {
          natureW = img.width
          natureH = img.height
          if (natureW > this.maxCanvasW) scale = natureW / this.maxCanvasW
          this.canvasW = natureW / scale
          this.canvasH = natureH / scale
          this.$nextTick(function () {
            DATA.ctx = new Ctx(this.$refs.canvas);
            DATA.ctx.ctx.save()
            DATA.ctx.ctx.scale(1 / scale, 1 / scale);
            DATA.ctx.put(img)
            DATA.ctx.ctx.restore()
            DATA.timeMachine = new TimeMachine(DATA.ctx)
            DATA.timeMachine.add()
            this.reset()
            this.canPaint = true
          })
        }
        img.src = url
      },

      drop(e) {
        let url = URL.createObjectURL(e.dataTransfer.files[0])
        this.init(url)
      },

      open(e) {
        let url = URL.createObjectURL(e.target.files[0])
        this.init(url)
      },

      demo() {
        this.init(demoImg)
      },

      // clip
      toggleClip() {
        if (!this.canPaint) return false
        this.url = DATA.ctx.url()
        if (this.showFigure) this.paintFigure()
        this.resetFunc()
        this.showClip = true
      },
      boxChange(status) {
        this.clipW = status.width
        this.clipH = status.height
        this.clipL = status.left
        this.clipT = status.top
      },

      downloadClip() {
        if (this.clipNow == 0) DATA.ctx.downloadRect(this.clipL, this.clipT, this.clipW, this.clipH)
        if (this.clipNow == 1) DATA.ctx.downloadArc(this.clipW, this.clipH, this.clipL, this.clipT)
      },

      resetClip() {
        this.showClip = false
        this.clipL = 10
        this.clipT = 10
        this.clipW = 200
        this.clipH = 200
        this.clipNow = 0
        this.showClipSelect = false
      },



      // filter
      toggleFilter() {
        if (!this.canPaint) return false
        if (this.showText && this.textContenteditable) this.paintText()
        if (this.showBlur) this.paintBlur()
        if (this.showFigure) this.paintFigure()
        if (this.showMosaic) this.paintMosaic()
        this.resetFunc()
        this.showFilter = true
        DATA.beforeFilter = DATA.ctx.get()
      },

      paintFilter() {
        this.url = DATA.ctx.url()
        DATA.timeMachine.add()
      },

      resetFilter() {
        this.showFilter = false
        this.filterNow = 0
      },

      filterSelect() {
        let coped
        this.$nextTick(function () {
          coped = copy(DATA.beforeFilter)
          if (this.filterNow == 0) {
            DATA.ctx.put(DATA.beforeFilter)
          } else {
            DATA.ctx.put(coped)
            DATA.ctx[this.filterList[this.filterNow].name]()
          }
        })
      },

      // mask
      maskClick(e) {
        if (e.target.className !== 'mask') return false
        if (this.showText) {
          this.paintText()
          this.resetText()
        }
        if (this.showMosaic) {
          this.paintMosaic()
          this.resetMosaic()
        }
        if (this.showFigure) {
          this.paintFigure()
          this.resetFigure()
        }
      },

      // reset and download
      resetFunc() {
        if (this.showText) this.resetText()
        if (this.showClip) this.resetClip()
        if (this.showBlur) this.resetBlur()
        if (this.showMosaic) this.resetMosaic()
        if (this.showFigure) this.resetFigure()
        if (this.showFilter) this.resetFilter()
      },

      stage(name) {
        if (!this.canPaint) return false
        if (this.showBlur) DATA.ctx.put(DATA.beforeBlur)
        if (this.showFilter) DATA.ctx.put(DATA.beforeFilter)
        if (this.showText || this.showClip || this.showBlur || this.showMosaic || this.showFigure || this.showFilter) {
          this.resetFunc()
          return
        }
        if (name == 'undo') {
          DATA.ctx.put(DATA.timeMachine.undo())
        } else {
          DATA.ctx.put(DATA.timeMachine.restore())
        }
      },

      reset() {
        if (!this.canPaint) return false
        this.resetFunc()
        this.url = null
        this.mosaicUrl = null
        DATA.ctx.put(DATA.timeMachine.init())
        DATA.timeMachine.reset()
        DATA.mosaicCtx = null
        DATA.beforeBlur = null
        DATA.beforeFilter = null
      },

      download() {
        if (!this.canPaint) return false
        if (this.showMosaic) this.paintMosaic()
        if (this.showFigure) this.paintFigure()
        DATA.ctx.downloadRect()
      }
    },

    mounted() {
      let d = document
      let offset, left, top, moveT, moveL;

      ['dragleave', 'drop', 'dragenter', 'dragover'].forEach((name) => document.body.addEventListener(name, (e) => e.preventDefault()))

      d.addEventListener('mousemove', (e) => {
        if (this.textCanDrag) {
          offset = getPointerToElem(e, this.$refs.canvas)
          left = offset.left - this.textToPointer.left
          top = offset.top - this.textToPointer.top
          moveL = this.canvasW - parseFloat(this.textSty.width)
          moveT = this.canvasH - parseFloat(this.textSty.height)
          if (left >= 0 && left <= moveL) {
            this.textL = left
          } else {
            if (left < 0) {
              this.textL = 0
            } else {
              this.textL = moveL
            }
          }
          if (top >= 0 && top <= moveT) {
            this.textT = top
          } else {
            if (top < 0) {
              this.textT = 0
            } else {
              this.textT = moveT
            }
          }
        }
      })

      d.addEventListener('mouseup', () => {
        this.textCanDrag = false
      })
    }
  }
</script>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: #20a0ff;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="range"] {
    -webkit-appearance: none;
    height: 0;
    background: #20a0ff;
  }

  /* @font-face {
    font-family: "icon";
    src: url("../assets/iconfont.ttf");
  } */

  .icon {
    font-family: "icon" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  .hide {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .main-btn,
  .menu a {
    position: relative;
    display: inline-block;
    border: none;
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    margin-left: 5px;
    background: #20a0ff;
    border-radius: 4px;
    padding: 2px 14px;
    transition: opacity 300ms;
  }

  .main-btn:hover,
  .menu a:hover {
    opacity: 0.8;
  }

  input {
    outline: none;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    width: 30px;
    text-align: center;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  }

  .select {
    position: relative;
    display: inline-block;
    height: 25px;
    width: 130px;
  }

  .select * {
    margin: 0;
    padding: 0;
  }

  .select a {
    display: block;
    background: #f5f6fa;
    color: #747272;
    width: 100%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #ccc;
    padding: 0;
    margin: 0;
    padding-left: 10px;
    border-radius: 6px;
    text-align: left;
  }

  .select a:hover {
    opacity: 1;
  }

  .select a .icon {
    position: absolute;
    right: 0;
  }

  .select div {
    position: absolute;
    z-index: 100;
    top: 25px;
    left: 0;
    width: 100%;
  }

  .select div a {
    border: none;
    border-radius: 0;
  }

  .select div a:last-of-type {
    border-radius: 0 0 6px 6px;
  }

  #image-editor {
    font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC",
      "Microsoft YaHei", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    user-select: none;
    position: relative;
    margin: 40px auto;
  }

  #image-editor .toolbar-wrapper {
    font-size: 11px;
  }

  #image-editor .toolbar-wrapper .toolbar .menu {
    float: left;
    height: 100%;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border: 1px solid #eaeaea;
    background: #f5f7f9;
    border-radius: 6px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .icon {
    font-size: 12px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar a {
    margin-left: 10px;
    font-size: 13px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .main-btn {
    color: #fff;
    margin-top: 9px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .main-btn:nth-of-type(1) {
    margin-right: 7px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .menu {
    line-height: 38px;
    margin-left: 7px;
    color: #000;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .menu a {
    margin-top: 0;
    background: transparent;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .menu a:first-of-type {
    margin-left: 0;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .main-btn {
    padding: 2px 14px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .open {
    cursor: pointer;
    font-size: 13px;
    padding: 1px 15px;
  }

  #image-editor .toolbar-wrapper .toolbar.funcbar .download,
  #image-editor .toolbar-wrapper .toolbar.funcbar .reset,
  #image-editor .toolbar-wrapper .toolbar.funcbar .undo,
  #image-editor .toolbar-wrapper .toolbar.funcbar .restore,
  #image-editor .toolbar-wrapper .toolbar.funcbar .demo,
  #image-editor .toolbar-wrapper .toolbar.funcbar .open {
    float: right;
  }

  #image-editor .toolbar-wrapper .toolbar.enhance {
    background: #f5f6fa;
    border-radius: 4px;
    color: #747272;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  }

  #image-editor .toolbar-wrapper .toolbar.enhance label {
    margin-left: 7px;
    position: relative;
  }

  #image-editor .toolbar-wrapper .toolbar.text-enhance {
    line-height: 33px;
  }

  #image-editor .toolbar-wrapper .toolbar.text-enhance .color-picker-input {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    border: 1px solid #ccc;
    text-align: center;
  }

  #image-editor .toolbar-wrapper .toolbar.text-enhance .color-picker {
    position: absolute;
    z-index: 100;
    left: 0;
  }

  #image-editor .toolbar-wrapper .toolbar.clip-enhance {
    line-height: 25px;
  }

  #image-editor .toolbar-wrapper .toolbar.clip-enhance .menu .main-btn {
    height: 25px;
    margin-top: 2px;
    color: #fff;
  }

  #image-editor .toolbar-wrapper .toolbar.clip-enhance input.clip-input {
    width: 50px;
  }

  #image-editor .toolbar-wrapper .toolbar.blur-enhance .menu:first-of-type {
    line-height: 33px;
  }

  #image-editor .toolbar-wrapper .toolbar.blur-enhance .menu:nth-of-type(2) {
    line-height: 27px;
  }

  #image-editor .toolbar-wrapper .toolbar.blur-enhance .menu:nth-of-type(2) input.blur-input {
    box-shadow: none;
  }

  #image-editor .toolbar-wrapper .toolbar.blur-enhance .menu {
    line-height: 33px;
  }

  #image-editor .toolbar-wrapper .toolbar.mosaic-enhance .menu {
    line-height: 33px;
  }

  #image-editor .toolbar-wrapper .toolbar.figure-enhance {
    line-height: 33px;
  }

  #image-editor .toolbar-wrapper .toolbar.figure-enhance .color-picker-input {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    border: 1px solid #ccc;
    text-align: center;
  }

  #image-editor .toolbar-wrapper .toolbar.figure-enhance .color-picker {
    position: absolute;
    z-index: 100;
    left: 0;
  }

  #image-editor .panel {
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  #image-editor .panel * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  #image-editor .panel canvas,
  #image-editor .panel .mask,
  #image-editor .panel .loading {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2px;
  }

  #image-editor .panel .loading {
    z-index: 300;
    top: 0;
    left: 0;
    font-size: 30px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  #image-editor .panel .mask {
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

  #image-editor .panel .mask .drop-notice {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 30px;
    text-align: center;
    transform: translateX(-50%) translateY(-50%);
    color: #ada4a4;
  }

  #image-editor .panel .mask .drop-notice .icon-drop::before {
    font-size: 60px;
  }

  #image-editor .panel .mask .textarea {
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

  #image-editor .panel .mask .textarea.disabled {
    text-align: center;
    cursor: pointer;
    cursor: -webkit-grab;
  }

  #image-editor .panel .mask .textarea.abled {
    text-align: left;
    cursor: text;
  }

  #image-editor .panel .mask .box {
    position: absolute;
    cursor: pointer;
    cursor: -webkit-grab;
    border-style: dashed;
    border-color: #fff;
    border-radius: 2px;
  }

  #image-editor .panel .mask .box .point {
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
</style> -->