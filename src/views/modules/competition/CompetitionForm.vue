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
            <el-form-item label="比赛标题" prop="title"
                :rules="[
                  {required: true, message:'比赛标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写比赛标题"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="比赛类别" prop="type"
                :rules="[
                  {required: true, message:'比赛类别不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('jab_competition_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属租户" prop="tenantId">
                <el-select v-model="inputForm.tenantId" placeholder="请选择" filterable clearable style="width: 100%;">
                          <el-option
                            v-for="item in tenants"
                            :key="item.tenantId"
                            :label="item.deptName"
                            :value="item.tenantId">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="比赛图片" prop="image"
                :rules="[
                  {required: true, message:'比赛图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competition`"
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
                       inputForm.image = file.response.url;
                    }"
                    :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = ''
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    :on-change="(file, fileList)=>{imageArra = [file]}"
                    :file-list="imageArra">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，建议图片尺寸为680*380</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="banner图片" prop="banner"
                :rules="[
                  {required: true, message:'banner图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="banner"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competition`"
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
                       inputForm.banner = file.response.url
                    }"
                    :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.banner = ''
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    :on-change="(file, fileList)=>{bannerArra = [file]}"
                    :file-list="bannerArra">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，建议图片尺寸为1920*330</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="比赛描述" prop="describe0"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写比赛描述"     ></el-input>
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
  import CompetitionService from '@/api/competition/CompetitionService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        imageArra: [],
        bannerArra: [],
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          banner: '',
          describe0: '',
          tenantId:''
        },
        tenants:[]//比赛用户要同步的租户信息
      }
    },
    components: {
    },
    competitionService: null,
    created () {
      this.competitionService = new CompetitionService()
      this.getTenants()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建比赛`
        } else if (method === 'edit') {
          this.title = '修改比赛'
        } else if (method === 'view') {
          this.title = '查看比赛'
        }
        this.imageArra = []
        this.bannerArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.image.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.imageArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.inputForm.banner.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.bannerArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
            this.competitionService.save(this.inputForm).then(({data}) => {
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
      getTenants(){
        this.$http({
          url:'/competition/competition/tenants',
          method:'get'
        }).then(({data})=>{
          this.tenants = data
        })
      }
    }
  }
</script>
