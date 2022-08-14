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
        <el-col :span="12">
            <el-form-item label="姓名" prop="name"
                :rules="[
                  {required: true, message:'姓名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写姓名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="身份证号" prop="idcardno"
                :rules="[
                  {required: true, message:'身份证号不能为空', trigger:'blur'},
                  {validator: validator.isCardId, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.idcardno" placeholder="请填写身份证号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="性别" prop="sex"
                :rules="[
                 ]">
                <el-select v-model="inputForm.sex" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('sex')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="手机号" prop="mobile"
                :rules="[
                 ]">
              <el-input v-model="inputForm.mobile" placeholder="请填写手机号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email"
                :rules="[
                  {required: true, message:'电子邮箱不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.email" placeholder="请填写电子邮箱"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="职务" prop="jobtitle"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jobtitle" placeholder="请填写职务"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="角色，0：裁判，1：领队，2：指导老师，3：参赛选手" prop="role"
                :rules="[
                  {required: true, message:'角色，0：裁判，1：领队，2：指导老师，3：参赛选手不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.role" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('jab_player_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="额外属性" prop="props"
                :rules="[
                 ]">
              <el-input v-model="inputForm.props" placeholder="请填写额外属性"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="审核" prop="audited"
                :rules="[
                  {required: true, message:'审核不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.audited" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="比赛编号" prop="cid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cid" placeholder="请填写比赛编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="关联赛事" prop="ctid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.ctid" placeholder="请填写关联赛事"     ></el-input>
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
  import CompetitionPlayerService from '@/api/competition/CompetitionPlayerService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          name: '',
          idcardno: '',
          sex: '',
          mobile: '',
          email: '',
          jobtitle: '',
          role: '',
          props: '',
          audited: '',
          cid: '',
          ctid: ''
        }
      }
    },
    components: {
    },
    competitionPlayerService: null,
    created () {
      this.competitionPlayerService = new CompetitionPlayerService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建选手`
        } else if (method === 'edit') {
          this.title = '修改选手'
        } else if (method === 'view') {
          this.title = '查看选手'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.competitionPlayerService.queryById(this.inputForm.id).then(({data}) => {
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
            this.competitionPlayerService.save(this.inputForm).then(({data}) => {
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

  
