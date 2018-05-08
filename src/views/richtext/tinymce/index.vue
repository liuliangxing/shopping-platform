<template>
    <div class="app-container">
        <tinymce :height=360 ref="editor" v-model="articleForm.articleContent"></tinymce>
    </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      articleForm: {
        articleContent: ''
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.el-col{
    margin-bottom:16px;
}
.material-icons{
    font-size:80px;
    color:#ddd;
}

.ql-container .ql-editor {
    min-height: 30em;
    padding-bottom: 1em;
    max-height: 25em;
    
}
.html {
    height: 9em;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-top: none;
    resize: vertical;
    background-color:#fff;
}  
</style>