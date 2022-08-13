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
            <el-form-item label="名称" prop="name"
                :rules="[
                  {required: true, message:'名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写名称"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开始时间" prop="starttime"
                :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.starttime" placeholder="请填写开始时间"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结束时间" prop="endtime"
                :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.endtime" placeholder="请填写结束时间"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="报名说明" prop="describe0"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写报名说明"></el-input>
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
  import CompetitionSignupService from '@/api/competition/CompetitionSignupService'
  export default {
    props:{id:String},
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          name: '',
          starttime: '',
          endtime: '',
          describe0: ''
        }
      }
    },
    components: {
    },
    competitionSignupService: null,
    created () {
      this.competitionSignupService = new CompetitionSignupService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建比赛报名`
        } else if (method === 'edit') {
          this.title = '修改比赛报名'
        } else if (method === 'view') {
          this.title = '查看比赛报名'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionSignupService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
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
            this.competitionSignupService.save(this.inputForm).then(({data}) => {
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
