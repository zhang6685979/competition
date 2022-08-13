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
            <el-form-item label="直播标题" prop="title"
                :rules="[
                  {required: true, message:'直播标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写直播标题"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="直播图片" prop="iamge"
                :rules="[
                  {required: true, message:'直播图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="iamge"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competitionLive`"
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
                       inputForm.iamge = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.iamge = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="1"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="iamgeArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="直播地址" prop="url"
                :rules="[
                  {required: true, message:'直播地址不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.url" placeholder="请填写直播地址"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="直播描述" prop="describe0"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写直播描述"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="开始时间" prop="starttime"
                :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.starttime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
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
  import CompetitionLiveService from '@/api/competition/CompetitionLiveService'
  export default {
    props:{id:String},
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        iamgeArra: [],
        inputForm: {
          id: '',
          title: '',
          iamge: '',
          url: '',
          describe0: '',
          starttime: '',
          cid:this.id
        }
      }
    },
    components: {
    },
    competitionLiveService: null,
    created () {
      this.competitionLiveService = new CompetitionLiveService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建赛事直播`
        } else if (method === 'edit') {
          this.title = '修改赛事直播'
        } else if (method === 'view') {
          this.title = '查看赛事直播'
        }
        this.iamgeArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionLiveService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.iamge.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.iamgeArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
            this.competitionLiveService.save(this.inputForm).then(({data}) => {
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
