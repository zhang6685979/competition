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
            <el-form-item label="轮播图片" prop="image"
                :rules="[
                  {required: true, message:'轮播图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/carousel/carousel`"
                    :headers="{token: $cookie.get('token')}"
                    accept="image/png,image/jpeg"
                    :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                    :on-success="(response, file, fileList) => {
                       inputForm.image = file.response.url
                    }"
                    :on-change="(file, fileList)=>{imageArra = [file]}"
                    :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = ''
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    :file-list="imageArra">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，建议图片尺寸为1920*760</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="轮播描述" prop="describe0"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写轮播描述"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="链接地址" prop="url"
                :rules="[
                  {required: true, message:'链接地址不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.url" placeholder="请填写链接地址"     ></el-input>
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
  import CarouselService from '@/api/carousel/CarouselService'
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
          image: '',
          describe0: '',
          url: ''
        }
      }
    },
    components: {
    },
    carouselService: null,
    created () {
      this.carouselService = new CarouselService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建轮播图管理`
        } else if (method === 'edit') {
          this.title = '修改轮播图管理'
        } else if (method === 'view') {
          this.title = '查看轮播图管理'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.carouselService.queryById(this.inputForm.id).then(({data}) => {
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
            this.carouselService.save(this.inputForm).then(({data}) => {
              this.visible = false
              this.$message.success(data)
              this.$emit('refreshDataList')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>
