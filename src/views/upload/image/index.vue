<template>
  <div class="app-container calendar-list-container">
    <p>demo1单图片上传</p>
    <div style="margin-bottom: 20px;">
      <Upload3 v-model="image_uri3"></Upload3>
    </div>
    <p>demo2单图片上传</p>
    <div style="margin-bottom: 20px;">
      <Upload2 v-model="image_uri2"></Upload2>
    </div>
    <p>demo3单图片上传</p>
    <div style="margin-bottom: 20px;">
      <Upload1 v-model="image_uri1"></Upload1>
    </div>
    <p>demo4多图片上传</p>
    <div style="margin-bottom: 20px;">
      <Upload4 color="#20a0ff" class="editor-upload-btn"></Upload4>
    </div>
  </div>
</template>

<script>
import Upload3 from '@/components/Upload/singleImage3'
import Upload2 from '@/components/Upload/singleImage2'
import Upload1 from '@/components/Upload/singleImage'
import Upload4 from '@/components/Upload/multipleImage'

export default {
  name: 'inlineEditTable',
  components: { Upload1, Upload2, Upload3, Upload4 },
  data() {
    return {
      image_uri3: '',
      image_uri2: '',
      image_uri1: ''
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}

.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
