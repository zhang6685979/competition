<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="证书分类" prop="type" :rules="[
                   {required: true, message:'证书分类不能为空', trigger:'change'}
                 ]">
              <SelectTree ref="type" :props="{
                          value: 'id',             // ID字段名
                          label: 'title',         // 显示名称
                          children: 'children'    // 子级字段名
                        }" url="/certificate/certificate/list" :value="inputForm.type" :clearable="true"
                :accordion="true" :disabled="!!type" @getValue="(value) => {inputForm.type=value}" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="证书图片" prop="image" :rules="[
                 ]">
              <el-upload ref="image" v-if="visible" list-type="picture-card"
                accept="image/png,image/jpeg,image/jpg"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/certificate/certificateRecord`"
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
                      if(file&&file.status=='success'){
                        $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                          $message.success(data)
                        })
                        inputForm.image = fileList.map(item => item.url).join('|')
                      }
                    }"
                    :before-remove="(file, fileList) => {
                       if(file&&file.status=='success'){
                         return $confirm(`确定移除 ${file.name}？`)
                       }
                     }" multiple :limit="method=='add'?100:1" :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 ${method=='add'?'100':'1'} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }" :before-upload="beforeFileUpload" :file-list="imageArra">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">一次最多只能上传100张证书，证书命名格式为：姓名-身份证号-证书编号，如张三-410182199011220123-001
                </div>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import CertificateRecordService from '@/api/certificate/CertificateRecordService'
  export default {
    props: {
      type: String
    }, //证书分类
    data() {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        imageArra: [],
        inputForm: {
          type: '',
          image: '',
        }
      }
    },
    components: {
      SelectTree
    },
    certificateRecordService: null,
    created() {
      this.certificateRecordService = new CertificateRecordService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建技能证书`
        } else if (method === 'edit') {
          this.title = '修改技能证书'
        } else if (method === 'view') {
          this.title = '查看技能证书'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.type = this.type
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.certificateRecordService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.image.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.imageArra.push({
                    name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
                    url: item
                  })
                }
              })
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.certificateRecordService[this.method == 'add' ? 'importFile' : 'save'](this.inputForm).then(({
              data
            }) => {
              this.visible = false
              this.$message.success(data)
              this.$emit('refreshDataList')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      beforeFileUpload(file) {
        return new Promise((resolve, reject) => {
           const isJPG = file.type === 'image/jpeg' ||             file.type === 'image/jpg' ||             file.type === 'image/png'
           //图片上传之前的校验
           if (!isJPG) {              // 限制文件类型校验             this.$message.error("证书格式只能是 JPG/JPEG/PNG 格式!");             return reject(false);
           } else if (file.name.split('-').length!=3) {
             this.$message.error("证书命名格式不正确!");
             return reject(false);
          } else {
            resolve(true);
          }
        });
      }
    }
  }
</script>
