<template>
  <div>
    <el-dialog :title="title" fullscreen :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <fm-making-form :bindDataTable="inputForm.autoCreate !=='1'" ref="formDesign" style="height:700px"
          :data="options" v-if="visible"
          :uploadPath="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/formbuilder`" preview
          :ds="inputForm.dataSource" :tableName="inputForm.tableName" tab-list generate-json clearable>

        </fm-making-form>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
        <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" icon="el-icon-circle-check"
          v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import CompetitionSignupService from '@/api/competition/CompetitionSignupService'
  export default {
    data() {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        options: {},
        inputForm: {
          "id": "",
          "createDate": "",
          "createBy": {},
          "updateDate": "",
          "updateBy": {},
          "delFlag": 0,
          "name": "",
          "starttime": "",
          "endtime": "",
          "describe0": "",
          "cid": "",
          "content":""
        }
      }
    },
    components: {},
    makeFormService: null,
    created() {
      this.competitionSignupService = new CompetitionSignupService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建数据表单`
        } else if (method === 'edit') {
          this.title = '修改数据表单'
        } else if (method === 'view') {
          this.title = '查看数据表单'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          if (method === 'add') {
            // this.$refs.formDesign.setJSON({'list': [], 'config': {'labelWidth': 100, 'labelPosition': 'right', 'size': 'small', 'customClass': ''}})
          }
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionSignupService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
              if (this.inputForm.content) {
                this.options = JSON.parse(this.inputForm.content)
                this.$refs.formDesign.setJSON(this.options)
              } else {
                // this.$refs.formDesign.setJSON({'list': [], 'config': {'labelWidth': 100, 'labelPosition': 'right', 'size': 'small', 'customClass': ''}})
              }
              this.loading = false
            })
          }
        })
      },
      handleSubmit() {

      },
      // 表单提交
      doSubmit() {
        this.inputForm.content = JSON.stringify(this.$refs.formDesign.getJSON())
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.competitionSignupService.save(this.inputForm).then(({
              data
            }) => {
              this.visible = false
              this.$message.success(data)
              this.$emit('refreshDataList')
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>
