<template>
    <div class="app-container">
        <quill-editor ref="myTextEditor"
            v-model="content"
            :config="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)">
        </quill-editor>
         <div class="html ql-editor" v-html="content"></div>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
  components: { quillEditor },
  data() {
    return {
      content: '<h2> quillEditor富文本编辑器，你可以随意的使用并编辑它</h2>',
      editorOption: {}
    }
  },
  methods: {
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    }
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