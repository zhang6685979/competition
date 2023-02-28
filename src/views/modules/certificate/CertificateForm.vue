<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="证书分类名称" prop="title"
                :rules="[
                  {required: true, message:'证书分类名称不能为空', trigger:'blur'}
                 ]">
          <el-input v-model="inputForm.title" placeholder="请填写证书名称"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="证书分类名称" prop="title"
                :rules="[
                  {required: true, message:'证书分类名称不能为空', trigger:'blur'}
                 ]">
          <el-input v-model="inputForm.title" placeholder="请填写证书名称"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="证书分类图片" prop="image"
                :rules="[
                  {required: true, message:'证书分类图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/certificate/certificate`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                    :on-success="(response, file, fileList) => {
                       inputForm.image = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="1"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="imageArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
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
  import CertificateService from '@/api/certificate/CertificateService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        imageArra: [],
        inputForm: {
          id: '',
          title: '',
          image: '',
          name: '',
          idcardno: '',
          describe0: '',
          sort: '',
          parent: {
            id: ''
          }
        }
      }
    },
    certificateService: null,
    created () {
      this.certificateService = new CertificateService()
    },
    methods: {
      init (method, obj) {
        this.method = method
        this.inputForm.id = obj.id
        if (method === 'add') {
          this.title = '新建证书分类'
        } else if (method === 'edit') {
          this.title = '修改证书分类'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.parent.id = obj.parent.id
          this.inputForm.parent.name = obj.parent.name
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.certificateService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.image.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.imageArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.certificateService.save(this.inputForm).then(({data}) => {
              this.loading = false
              this.visible = false
              this.$message.success('证书分类保存成功')
              this.$emit('refreshTree')
            })
          }
        })
      }
    }
  }
</script>
