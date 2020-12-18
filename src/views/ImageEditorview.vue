<template>
  <div>
    <!-- <ImageEditor :minWidth="800" :maxWidth="1000"></ImageEditor> -->
    <ImageEdit></ImageEdit>
  </div>
</template>
<script>
  import ImageEdit from './ImageEdit.vue'
  import ImageEditor from './image-editor.vue'
  export default {
    name: 'ImageEditorview',
    components: {
      // 'ImageEditor': ImageEditor
      'ImageEdit': ImageEdit
    }
  }
</script>