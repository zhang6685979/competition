<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="选项名称" prop="name" :rules="[
                  {required: true, message:'选项名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写选项名称" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选项图片" prop="image" :rules="[
                  {required: true, message:'选项图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image" v-if="visible" list-type="picture-card"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/vote/voteSubject`"
                :headers="{token: $cookie.get('token')}" :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }" :on-success="(response, file, fileList) => {
                       inputForm.image = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }" :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = fileList.map(item => item.url).join('|')
                    }" :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }" :limit="1" :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }" :file-list="imageArra">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选项详情" prop="describe0" :rules="[
                {required: true, message:'选项详情不能为空', trigger:'blur'}
               ]">
              <tiny-mce v-model="inputForm.describe0" :config="editorConfig" v-if="visible"></tiny-mce>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import VoteOptionService from '@/api/vote/VoteOptionService'
  import TinyMce from '@/components/editor/TinyMce'
  export default {
    data() {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          name: '',
          image: '',
          describe0: ''
        },
        imageArra: [],
        currIndex: '',
        editorConfig: {
          width: '100%',
          height: 300,
          menubar: false,
          language: 'zh_CN'
        }
      }
    },
    components: {
      TinyMce
    },
    voteOptionService: null,
    created() {
      this.voteOptionService = new VoteOptionService()
    },
    methods: {
      init(method, item, index) {
        this.method = method
        this.currIndex = index
        if (method === 'add') {
          this.title = `新建投票选项`
        } else if (method === 'edit') {
          this.title = '修改投票选项'
        } else if (method === 'view') {
          this.title = '查看投票选项'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.inputForm = this.recover(this.inputForm, item)
            this.imageArra = [];
            this.inputForm.image.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.imageArra.push({
                  name: decodeURIComponent(item.substring(item
                    .lastIndexOf('/') + 1)),
                  url: item
                })
              }
            })
          }
        })
      },
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.visible = false
            this.$emit('addDataList', Object.assign({},this.inputForm), this.currIndex)
          }
        })
      }
    }
  }
</script>
