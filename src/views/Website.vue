<template>
  <div>
    <img v-lazy="item" v-for="item in imgs" alt="">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgs: [
          "http://pic.pptbz.com/201506/2015070581208537.JPG",
          "http://pic.58pic.com/58pic/15/63/07/42Q58PIC42U_1024.jpg",
          "http://pic.58pic.com/58pic/14/62/50/62558PICxm8_1024.jpg",
          "http://txt25-2.book118.com/2017/0420/book99787/99786555.jpg",
          "http://5b0988e595225.cdn.sohucs.com/images/20170906/58cdb24be3624488ad3e8d3d00b4585f.jpeg"
        ]
      }
    }
  }
</script>

<style scoped>
  img {
    display: block;
  }
</style>