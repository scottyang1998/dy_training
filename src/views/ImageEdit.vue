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
              <el-input size="mini" type="number" class="clip-input" v-model='clipW' />
            </span>
            <span>
              高度
              <el-input size="mini" type="number" class="clip-input" v-model='clipH' />
            </span>
            <div class="textbut">
              <el-button type="text" size="medium" @click="initCropper()" :disabled="croppShow">裁剪</el-button>
              <el-button type="text" size="medium" @click="sureCropper()" v-show='cropper'>确认</el-button>
              <el-button type="text" size="medium" @click="cancelCropper()" v-show='cropper'>取消
              </el-button>
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
        <div class="panel" v-if='data.src'>
          <canvas :id="data.src" ref='canvas'></canvas>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'


  export default {
    name: 'ImageEditor',
    props: {
      data: {
        type: Object,
        required: true,
        default: () => { }
      }
    },
    data() {
      return {
        cropper: null,
        croppShow: false,
        clipW: '',
        clipH: ''

      }
    },
    mounted() {
      this.drawImg()
    },
    computed: {

    },
    methods: {
      // 在canvas上绘制图片
      drawImg(href) {
        this.$nextTick(() => {
          let canvas = document.getElementById(this.data.src)
          if (canvas) {
            canvas.width = 1000
            canvas.height = 700
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            let img = new Image()
            img.crossOrigin = 'Anonymous'
            img.src = href || this.data.src
            img.onload = function () {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
          }
        })
      },
      // 显示裁剪框
      initCropper() {
        this.drawImg()
        this.croppShow = true
        let cropper = new Cropper(this.$refs.canvas, {
          checkCrossOrigin: true,
          viewMode: 2,
          aspectRatio: 3 / 2,
          autoCropArea: 1
        })
        this.cropper = cropper
      },
      // 确认裁剪
      sureCropper() {
        let _this = this
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
          const href = window.URL.createObjectURL(blob)
          _this.drawImg(href)
        }, 'image/jpeg')
        this.cancelCropper()

      },
      // 销毁裁剪框
      cancelCropper() {
        this.cropper.destroy()
        this.croppShow = false
        this.cropper = null
      }
    }
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

    text-align: center;
    height: 858px;
    overflow-y: hidden;
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

  .el-tooltip .el-button {

    display: block;
    z-index: 10000;
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
    height: 700px;
    position: relative;
    float: left;
  }

  canvas {
    /* width: 100%; */
  }

  .el-main img {
    width: 100%;
    height: 100%;
  }
</style>