<template>
  <div>

    <el-drawer :title="title" :visible.sync="visible" :wrapperClosable="false" size="70%">

      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="新闻标题" prop="title" :rules="[
                  {required: true, message:'新闻标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写新闻标题" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新闻类别" prop="type" :rules="[
                  {required: true, message:'新闻类别不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.type" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in $dictUtils.getDictList('jab_new_type')" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新闻图片" prop="image" :rules="[
                  {required: true, message:'新闻图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image" v-if="visible" list-type="picture-card" accept="image/png,image/jpeg"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/news/news`"
                :headers="{token: $cookie.get('token')}" :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }" :on-success="(response, file, fileList) => {
                       inputForm.image = file.response.url
                    }" :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = ''
                    }" :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }" :on-change="(file, fileList)=>{imageArra = [file]}" :file-list="imageArra">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，建议图片尺寸为700*400</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新闻内容" prop="content" :rules="[
                  {required: true, message:'新闻内容不能为空', trigger:'blur'}
                 ]">
              <tiny-mce v-model="inputForm.content" v-if="visible"></tiny-mce>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为最新" prop="latest" :rules="[
                  {required: true, message:'是否为最新不能为空', trigger:'blur'}
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
            <el-form-item label="新闻描述" prop="describe0" :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写新闻描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
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
  import WangEditor from '@/components/editor/WangEditor'
  import TinyMce from '@/components/editor/TinyMce'
  import NewsService from '@/api/news/NewsService'
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
        imageArra: [],
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          content: '',
          latest: '',
          top: '',
          describe0: '',
          cid: this.id,
          appendix: '',
        },
        fileArra: []
      }
    },
    components: {
      WangEditor,
      TinyMce
    },
    newsService: null,
    created() {
      this.newsService = new NewsService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建新闻`
        } else if (method === 'edit') {
          this.title = '修改新闻'
        } else if (method === 'view') {
          this.title = '查看新闻'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.newsService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.fileArra = [], this.imageArra = [];
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.image.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.imageArra.push({
                    name: decodeURIComponent(item.substring(item
                      .lastIndexOf('/') + 1)),
                    url: item
                  })
                }
              })

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
            this.inputForm.cid = this.id;
            this.newsService.save(this.inputForm).then(({
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
