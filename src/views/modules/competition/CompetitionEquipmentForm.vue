<template>
  <div>
    <el-drawer :title="title" :visible.sync="visible" :wrapperClosable="false" size="70%">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="设备名称" prop="title" :rules="[
                  {required: true, message:'设备名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写设备名称" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备图片" prop="image" :rules="[
                  {required: true, message:'设备图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="image" v-if="visible" list-type="picture-card"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competitionEquipment`"
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
                    }" multiple :limit="1" :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }" :file-list="imageArra">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备描述" prop="describe0" :rules="[
                  {required: true, message:'设备描述不能为空', trigger:'blur'}
                 ]">
              <tiny-mce v-model="inputForm.describe0" v-if="visible"></tiny-mce>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" >
              <el-button size="small" v-if="method != 'view'" @click="visible = false">关闭</el-button>
              <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
  import TinyMce from '@/components/editor/TinyMce'
  import CompetitionEquipmentService from '@/api/competition/CompetitionEquipmentService'
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
          image: '',
          describe0: '',
          cid: this.id
        }
      }
    },
    components: {
      TinyMce
    },
    competitionEquipmentService: null,
    created() {
      this.competitionEquipmentService = new CompetitionEquipmentService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建大赛设备`
        } else if (method === 'edit') {
          this.title = '修改大赛设备'
        } else if (method === 'view') {
          this.title = '查看大赛设备'
        }
        this.imageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionEquipmentService.queryById(this.inputForm.id).then(({
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
            this.competitionEquipmentService.save(this.inputForm).then(({
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
