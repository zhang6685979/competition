<template>
  <div class="page">
      <el-tabs v-model="activeName" class="tabs" tab-position="left" type="border-card">
        <el-tab-pane :label="type==1?'用户通知模板':'裁判通知模板'" :name="type" :key="type" v-for="type in types">
          <el-form :model="inputForm" size="small" ref="inputForm" label-width="120px">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-form-item label="模板设置说明：">
                  <p class="no-margin">
                    消息通知内容中存在动态替换的内容，在模板配置时需要通过占位符的形式进行占位，系统提供的占位符如下：<br>
                    用户列表：$userlist$ 考试名称：$exam$ 裁判分配列表：$examlist$<br>
                    <font style="color: red;">注意：占位符为固定标识，不能进行修改，否则在邮件里将作为为本进行发送。</font>
                  </p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="模板标题" prop="title" :rules="[
                  {required: true, message:'标题不能为空', trigger:'blur'}
                 ]">
                  <el-input v-model="inputForm.title" placeholder="请填写标题" maxlength="250"></el-input>
                </el-form-item>
              </el-col>


              <el-col :span="24">
                <el-form-item label="模板内容" prop="content" :rules="[
                  {required: true, message:'模板内容不能为空', trigger:'blur'}
                 ]">
                  <tiny-mce v-model="inputForm.content" :config="{
          width: '100%',
          height: 300,
          menubar: false,
          language: 'zh_CN'
        }" v-if="visible"></tiny-mce>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="附件" prop="appendix">
                  <el-upload ref="file"
                    :action="`${$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/emailTemplate`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                           inputForm.appendix = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                         }" :on-remove="(file, fileList) => {
                           if(file&&file.status=='success'){
                             $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                               $message.success(data)
                             })
                             inputForm.appendix = fileList.map(item => item.url).join('|')
                           }
                         }" :before-remove="(file, fileList) => {
                           if(file&&file.status=='success'){
                             return $confirm(`确定移除 ${file.name}？`)
                           }
                         }" multiple :limit="5" :on-exceed="(files, fileList) =>{
                           $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                         }" :file-list="fileArra" :before-upload="beforeFileUpload">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">附件格式不限,文件大小不能超过50M</div>
                  </el-upload>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item>
                  <el-button size="small" type="primary" @click="doSubmit()" v-noMoreClick>保存
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  import TinyMce from '@/components/editor/TinyMce'
  export default {
    props:{
      cid:String
    },
    data() {
      return {
        inputForm: {
          id: '',
          title: '',
          content: '',
          type: '1', //用户通知为1，裁判通知为2
          appendix:''
        },
        activeName: '1',
        types: ['1', '2'], //用户通知为1，裁判通知为2
        templateList: [],
        fileArra:[],
        visible:false
      }
    },
    components: {
      TinyMce
    },
    watch: {
      activeName: function(newVal, oldVal) {
        if (newVal != oldVal) {
          var template = this.templateList.find(item => {
            return item.type == newVal
          })
          this.fileArra = []
          if (template) {
            this.inputForm = this.recover(this.inputForm, template)
            this.inputForm.appendix.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.fileArra.push({
                  name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
                  url: item
                })
              }
            })
          } else {
            this.inputForm = {
              id: '',
              title: '',
              content: '',
              type: newVal,
              appendix:''
            }
          }

        }
      }
    },
    activated() {
      this.getTemplateList();
      this.visible = true
    },
    deactivated(){
      this.visible = false
    },
    methods: {
      getTemplateList() {
        this.$http({
          url: '/email/template/list',
          method: 'get',
          params:{cid:this.cid}
        }).then(({
          data
        }) => {
          var template = data.find(item => {
            return item.type == this.activeName
          })
          this.templateList = data;
          this.fileArra = [];
          if (template) {
            this.inputForm = this.recover(this.inputForm, template)
            this.inputForm.appendix.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.fileArra.push({
                  name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
                  url: item
                })
              }
            })
          }else{
            this.inputForm = this.recover(this.inputForm, {
              id: '',
              title: '',
              content: '',
              type: this.activeName,
              appendix:''
            })
          }
        })
      },
      doSubmit() {
        this.inputForm.cid = this.cid
        this.$http({
          url: '/email/template',
          method: 'post',
          data: this.inputForm
        }).then(({
          data
        }) => {
          this.$message.success(data);
          this.getTemplateList()
        })
      },
      beforeFileUpload(file) {
        return new Promise((resolve, reject) => {
          if (file.size >= 1024*1024*50) {
            // 限制文件大小
            this.$message({
              type: "error",
              message: "文件大小不能超出50M，请重新上传！",
            });
            return reject(false);
          } else {
            resolve(true);
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .tabs {
    height: 100%;

    .el-tabs__content {
      overflow: auto !important;
    }
  }
</style>
