<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="名称" prop="name" :rules="[
                  {required: true, message:'名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写名称" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报名时间" prop="time" :rules="[
                  {required: true, message:'报名时间不能为空', trigger:'blur'}
                 ]">
              <el-date-picker v-model="inputForm.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
             <el-form-item label="是否启用" prop="enabled">
                <el-switch v-model="inputForm.enabled"  active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报名说明" prop="describe0" :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写报名说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="method=='copy'">
            <el-form-item label="应用于" prop="cid" :rules="[
                  {required: true, message:'请选择比赛', trigger:'blur'}
                 ]">
             <el-select v-model="inputForm.cid" filterable clearable placeholder="请选择比赛" style="width: 100%;">
                <el-option
                  v-for="(item,index) in dataList"
                  :key="index"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
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
  import CompetitionService from '@/api/competition/CompetitionService'
  export default {
    props: {
      cid: String
    },
    data() {
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
          describe0: '',
          time: '',
          cid: '',
          enabled:false,
          content:''
        },
        dataList:[]
      }
    },
    competitionSignupService: null,
    competitionService:null,
    created() {
      this.competitionSignupService = new CompetitionSignupService()
      this.competitionService = new CompetitionService()
    },
    methods: {
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建信息填报模板`
        } else if (method === 'edit') {
          this.title = '修改信息填报模板'
        } else if(method === 'copy'){
          this.title = '复制信息填报模板'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view' || method === 'copy') { // 修改或者查看
            this.loading = true
            this.competitionSignupService.queryById(this.inputForm.id).then(({
              data
            }) => {
              data.time = [data.starttime, data.endtime];
              this.inputForm = this.recover(this.inputForm, data)
              this.loading = false
            })
          }
          if(method === 'copy'){
            this.getCompetitionList()
          }
        })
      },
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            var time = this.inputForm.time;
            this.inputForm.starttime = time[0];
            this.inputForm.endtime = time[1];
            if(this.method=='copy'){
              this.inputForm.id = '';
            }else{
              this.inputForm.cid = this.cid;
            }
            this.competitionSignupService.save(this.inputForm).then(({
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
      getCompetitionList() {
        this.competitionService.list({
          'current': 1,
          'size': 9999,
        }).then(({
          data
        }) => {
          this.dataList = data.records;
        })
      }
    }
  }
</script>
