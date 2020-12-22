<template>
  <div>
    <ImageEdit></ImageEdit>
  </div>
</template>
<script>
  import ImageEdit from './ImageEdit.vue'
  export default {
    name: 'ImageEditorview',
    data() {
      return {
        // slide: {
        //   src: 'https://avatars0.githubusercontent.com/u/26196557?s=460&v=40' // 图片地址
        // },
      }
    },
    components: {
      'ImageEdit': ImageEdit
    }
  }
</script>