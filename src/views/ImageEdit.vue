<template>
  <div>
    <el-container>
      <el-aside width="300px">
        <div class="logo">图片管理器</div>
        <div class="download-wrapper">
          <el-row>
            <el-button size='small' type="" @click="down(type)">保存</el-button>
            <el-button size='small' type="" @click="refreshCrop()">重置</el-button>
            <el-button size='small' type="" @click="changeImg()">换图</el-button>
            <input type="file" id="uploads" accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="uploadImg($event, 1)" ref="uploadImg"></input>
            <div class="c-item">
              <label>jpg
                <input type="radio" name="type" value="jpeg" v-model="option.outputType">
              </label>
              <label>png
                <input type="radio" name="type" value="png" v-model="option.outputType">
              </label>
              <label>webp
                <input type="radio" name="type" value="webp" v-model="option.outputType">
              </label>
            </div>
          </el-row>
        </div>
        <div class="rotate-wrapper">
          <div class="rotate-word word">旋转</div>
          <div class="rotate-toolbar toolbar">
            <a @click="rotateCropperleft()"><i class="icon el-icon-refresh-left"></i></a>
            <a @click="rotateCropperright()"><i class="icon el-icon-refresh-right"></i></a>
            <a><i class="icon el-icon-arrow-up"></i></a>
            <a @click="mirrorhorizon()"><i class="icon el-icon-arrow-right"></i></a>
          </div>
        </div>
        <div class="clip-wrapper">
          <div class="clip-word word">裁剪</div>
          <div class="clip-toolbar toolbar">
            <span>
              宽度
              <el-input size="mini" type="number" class="clip-input" v-model="option.autoCropWidth" />
            </span>
            <span>
              高度
              <el-input size="mini" type="number" class="clip-input" v-model="option.autoCropHeight" />
            </span>
            <div class="textbut">
              <el-button type="" size="medium" @click="initCropper()">裁剪</el-button>
              <el-button type="" size="medium" @click="">确认</el-button>
              <el-button type="" size="medium" @click="clearCrop()">取消
              </el-button>
            </div>

          </div>
        </div>
        <div class="scale-wrapper">
          <div class="scale-word word">缩放</div>
          <div class="scale-toolbar toolbar">
            <a @click="changeScale(1)"><i class="icon el-icon-plus"></i></a>
            <a @click="changeScale(-1)"><i class="icon el-icon-minus"></i></a>
          </div>
        </div>
        <div class="filter-wrapper" style="visibility: hidden;">
          <div class="filter-word word">滤镜</div>
          <div class="filter-toolbar toolbar">
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
            <a><img class="filterimg" src="../assets/filter.png" alt=""></a>
          </div>
        </div>

      </el-aside>
      <el-main>
        <div class="panel">
          <vueCropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType"
            :info="true" :full="option.full" :fixed="fixed" :can-move="option.canMove" :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox" :original="option.original" :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :high="option.high" mode="cover" :max-img-size="option.max">
          </vueCropper>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'
  import { VueCropper } from 'vue-cropper'


  export default {
    components: {
      VueCropper,
    },
    name: 'ImageEditor',

    data() {
      return {
        model: false,
        modelSrc: '',
        crap: false,
        previews: {},
        // uploadAccept: ['jpeg', 'jpg', 'png'],
        lists: [

          {
            img: "https://avatars2.githubusercontent.com/u/15681693?s=460&v=4"
          },
          {
            img: "http://cdn.xyxiao.cn/Landscape_1.jpg"
          }


        ],
        option: {
          img: "http://cdn.xyxiao.cn/Landscape_1.jpg",
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: false,
          autoCropWidth: 160,
          autoCropHeight: 150,
          centerBox: false,
          high: false,
          max: 99999
        },
        show: true,
        fixed: false,
        // fixedNumber: [16, 9]
      }
    },
    mounted() {
      this.changeImg();
      // hljs.configure({useBR: true})
      var list = [].slice.call(document.querySelectorAll("pre code"));
      list.forEach((val, index) => {
        hljs.highlightBlock(val);
      });
    },
    computed: {

    },
    methods: {
      // open() {
      //   MessageBox.confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
      //     distinguishCancelAndClose: true,
      //     confirmButtonText: '保存',
      //     cancelButtonText: '放弃修改'
      //   })
      //     .then(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '保存修改'
      //       });
      //     })
      //     .catch(action => {
      //       this.$message({
      //         type: 'info',
      //         message: action === 'cancel'
      //           ? '放弃保存并离开页面'
      //           : '停留在当前页面'
      //       })
      //     });
      // },
      finish(type) {
        // 输出
        // var test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
        if (type === "blob") {
          this.$refs.cropper.getCropBlob(data => {
            var img = window.URL.createObjectURL(data);
            this.model = true;
            this.modelSrc = img;
          });
        } else {
          this.$refs.cropper.getCropData(data => {
            this.model = true;
            this.modelSrc = data;
          });
        }
      },
      down(type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'demo'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },
      changeImg() {
        this.option.img = this.lists[~~(Math.random() * this.lists.length)].img;
      },
      initCropper() {
        this.$refs.cropper.goAutoCrop()
      },
      rotateCropperright() {
        this.$refs.cropper.rotateRight()
      },
      rotateCropperleft() {
        this.$refs.cropper.rotateLeft()
      },
      sureclip() {
        this.$refs.cropper.stopCrop()
      },
      mirrorhorizon() {

      },
      mirrorverti() {

      },
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      refreshCrop() {
        // clear
        this.$refs.cropper.refresh()
      },
      clearCrop() {
        // clear
        this.$refs.cropper.clearCrop()
      },
      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
          return false;
        }
        var reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          if (num === 1) {
            this.option.img = data;
          } else if (num === 2) {
            this.example2.img = data;
          }
          this.$refs.uploadImg.value = ''
        };
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },

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
    width: 90px;
  }

  input {
    width: 70px;
  }

  .c-item {
    height: 70px;
    line-height: 50px;
    color: #D3DCE6;
  }

  .c-item input {
    width: 10px;
    margin-right: 20px;
  }

  .el-row .el-input>>>.el-input__inner {
    background-color: #2b4064;
    border-color: #2b4064;
  }

  span .el-input>>>.el-input__inner {
    background-color: #223756;
    border-color: #223756;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 20px;
    height: 858px;
    background-color: #2d4a76;
    /* overflow-y: hidden; */
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

  .el-button {
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
    height: 160px;
    background-color: #2c4065;

  }

  .scale-toolbar {
    line-height: 100px;
  }

  .scale-wrapper {
    height: 100px;
    background-color: #2c4065;

  }

  .filter-toolbar {
    line-height: 200px;
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
    width: 100%;
    height: 700px;
    position: relative;
    float: left;
  }
</style>