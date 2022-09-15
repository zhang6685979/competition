<template>
  <div>
    <el-drawer :title="title" :visible.sync="visible" :wrapperClosable="false" size="70%">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px" v-if="visible">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="公告标题" prop="title" :rules="[
                  {required: true, message:'公告标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写公告标题" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告内容" prop="content" :rules="[
                  {required: true, message:'公告内容不能为空', trigger:'blur'}
                 ]">
              <tiny-mce v-model="inputForm.content" v-if="visible"></tiny-mce>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否最新" prop="latest" :rules="[
                  {required: true, message:'是否最新不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.latest" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in $dictUtils.getDictList('yes_no')" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="top" :rules="[
                  {required: true, message:'是否置顶不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.top" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in $dictUtils.getDictList('yes_no')" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="appendix">
              <el-upload ref="file" v-if="visible"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/announcement`"
                :headers="{token: $cookie.get('token')}" accept=".pdf,.doc,.docx"
                :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                :on-success="(response, file, fileList) => {
                       inputForm.appendix = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                     }" :on-remove="(file, fileList) => {
                       $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                         $message.success(data)
                       })
                       inputForm.appendix = fileList.map(item => item.url).join('|')
                     }" :before-remove="(file, fileList) => {
                       return $confirm(`确定移除 ${file.name}？`)
                     }" multiple :limit="5" :on-exceed="(files, fileList) =>{
                       $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                     }" :file-list="fileArra">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传word/pdf文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告描述" prop="describe0" :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写公告描述" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">

            <el-form-item label="">
              <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定
              </el-button>
              <el-button size="small" v-if="method != 'view'" @click="visible = false">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
  import AnnouncementService from '@/api/announcement/AnnouncementService'
  import TinyMce from '@/components/editor/TinyMce'
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
        inputForm: {
          id: '',
          title: '',
          content: '',
          latest: '',
          top: '',
          index0: '',
          describe0: '',
          appendix: '',
          cid: this.id
        },
        fileArra: []
      }
    },
    components: {
      TinyMce
    },
    announcementService: null,
    created() {
      this.announcementService = new AnnouncementService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建通知公告`
        } else if (method === 'edit') {
          this.title = '修改通知公告'
        } else if (method === 'view') {
          this.title = '查看通知公告'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.announcementService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.fileArra = [];
              this.inputForm.appendix.split('|').forEach((item) => {
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
            this.inputForm.cid = this.id
            this.announcementService.save(this.inputForm).then(({
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
      }
    }
  }
</script>
