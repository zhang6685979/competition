<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
     :append-to-body="true"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="考试课目" prop="name"
                :rules="[
                  {required: true, message:'考试课目不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写考试课目"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
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
        <el-col :span="12">
            <el-form-item label="结束时间" prop="endtime"
                :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.endtime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="考场数量" prop="rooms"
                :rules="[
                 ]">
              <el-input v-model="inputForm.rooms" placeholder="请填写考场数量"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="比赛裁判" prop="referees"
                :rules="[
                 ]">
                <referee-select :cid="cid" :value="inputForm.referees" @getValue='(value) => {inputForm.referees=value}'></referee-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="参赛团队" prop="teams"
                :rules="[
                 ]">
                <user-select :limit='1' :value="inputForm.teams" @getValue='(value) => {inputForm.teams=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="考试描述" prop="describe0"
                :rules="[
                 ]">
              <el-input v-model="inputForm.describe0" placeholder="请填写考试描述"></el-input>
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
  import UserSelect from '@/components/userSelect'
  import RefereeSelect from './refereeSelect'
  import CompetitionExamService from '@/api/exam/CompetitionExamService'
  export default {
    props:{cid:String},
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
          rooms: '',
          referees: [],
          teams: '',
          describe0: ''
        }
      }
    },
    components: {
      UserSelect,
      RefereeSelect
    },
    competitionExamService: null,
    created () {
      this.competitionExamService = new CompetitionExamService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建考试信息`
        } else if (method === 'edit') {
          this.title = '修改考试信息'
        } else if (method === 'view') {
          this.title = '查看考试信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionExamService.queryById(this.inputForm.id).then(({data}) => {
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
            this.competitionExamService.save(this.inputForm).then(({data}) => {
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
