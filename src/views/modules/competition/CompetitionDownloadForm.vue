<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="文件上传" prop="file" :rules="[
                  {required: true, message:'文件上传不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="file" v-if="visible"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competitionDownload`"
                :headers="{token: $cookie.get('token')}"
                :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                :on-success="(response, file, fileList) => {
                      inputForm.size = file.size;
                      inputForm.title = file.name&&file.name.split('.')[0];
                      inputForm.type = file.name&&file.name.split('.')[1];
                      inputForm.file = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }" :on-remove="(file, fileList) => {
                      if(file&&file.status=='success'){
                          $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                            $message.success(data)
                          })
                          inputForm.file = fileList.map(item => item.url).join('|')
                      }
                    }" :before-remove="(file, fileList) => {
                      if(file&&file.status=='success'){
                        return $confirm(`确定移除 ${file.name}？`)
                      }
                    }" multiple :limit="1" :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }" :file-list="fileArra" :before-upload="beforeFileUpload">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">添加相关附件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="describe0" :rules="[
                 ]">
              <el-input v-model="inputForm.describe0" placeholder="请填写备注" maxlength="250"></el-input>
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
  import CompetitionDownloadService from '@/api/competition/CompetitionDownloadService'
  export default {
    props: {
      id: String
    },
    data() {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        fileArra: [],
        inputForm: {
          id: '',
          title: '',
          file: '',
          describe0: '',
          cid: this.id,
          size: '',
          type: ''
        }
      }
    },
    components: {},
    competitionDownloadService: null,
    created() {
      this.competitionDownloadService = new CompetitionDownloadService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建资源下载`
        } else if (method === 'edit') {
          this.title = '修改资源下载'
        } else if (method === 'view') {
          this.title = '查看资源下载'
        }
        this.fileArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionDownloadService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.file.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.fileArra.push({
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
            this.inputForm.cid = this.id;
            this.competitionDownloadService.save(this.inputForm).then(({
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
          if (file.size >= 1024*1024*1024) {
            // 限制文件大小
            this.$message({
              type: "error",
              message: "文件大小不能超出1G，请重新上传！",
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
