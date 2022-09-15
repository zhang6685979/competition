<template>
  <div style="height:100%;overflow: auto;">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" label-width="120px">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="设备名称" prop="title" :rules="[
                  {required: true, message:'设备名称不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.title" placeholder="请填写设备名称" maxlength="250"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="设备图片" prop="image" :rules="[
                  {required: true, message:'设备图片不能为空', trigger:'blur'}
                 ]">
            <el-upload ref="image" list-type="picture-card"
              :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/competition/competitionEquipment`"
              :headers="{token: $cookie.get('token')}" :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }" :on-success="(response, file, fileList) => {
                       inputForm.image = file.response.url;
                    }" :on-remove="(file, fileList) => {
                      $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data)
                      })
                      inputForm.image = ''
                    }" :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    :on-change="(file, fileList)=>{imageArra = [file]}"
                    :file-list="imageArra">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="设备描述" prop="describe0" :rules="[
                  {required: true, message:'设备描述不能为空', trigger:'blur'}
                 ]">
            <tiny-mce v-model="inputForm.describe0"></tiny-mce>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="">
            <el-button size="small" type="primary" @click="doSubmit()" v-noMoreClick>确定</el-button>
            <el-button size="small" @click="$refs.inputForm.resetFields()">重置</el-button>

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
        loading: false,
        imageArra: [],
        inputForm: {
          id: '',
          title: '',
          describe0: ''
        }
      }
    },
    components: {
      TinyMce
    },
    competitionEquipmentService: null,
    created() {
      this.competitionEquipmentService = new CompetitionEquipmentService();
      this.getDeviceInfo();
    },
    methods: {
      getDeviceInfo() {
        this.loading = true;
        this.competitionEquipmentService.list({
          'cid': this.id
        }).then(({
          data
        }) => {
          this.loading = false;
          this.$refs.inputForm.resetFields()
          var records = data.records;
          if (records && records.length > 0) {
            var item = records[0];
            this.inputForm = this.recover(this.inputForm, item)
            // this.inputForm.image.split('|').forEach((item) => {
            //   if (item.trim().length > 0) {
            //     this.imageArra.push({
            //       name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
            //       url: item
            //     })
            //   }
            // })
          }
        })
      },
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.cid = this.id;
            this.competitionEquipmentService.save(this.inputForm).then(({
              data
            }) => {
              this.$message.success(data);
              this.getDeviceInfo();
            }).catch(() => {})
          }
        })
      }
    }
  }
</script>
