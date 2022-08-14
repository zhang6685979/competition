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
            <el-form-item label="您的姓名" prop="name"
                :rules="[
                  {required: true, message:'您的姓名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写您的姓名"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单位名称" prop="company"
                :rules="[
                  {required: true, message:'单位名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.company" placeholder="请填写单位名称"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="您的邮箱" prop="email"
                :rules="[
                  {required: true, message:'您的邮箱不能为空', trigger:'blur'},
                  {validator: validator.isEmail, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.email" placeholder="请填写您的邮箱"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile"
                :rules="[
                  {required: true, message:'手机号码不能为空', trigger:'blur'},
                  {validator: validator.isMobile, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.mobile" placeholder="请填写手机号码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone"
                :rules="[
                  {validator: validator.isTel, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.telephone" placeholder="请填写联系电话"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="您的职务" prop="jobtitle"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jobtitle" placeholder="请填写您的职务"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="单位地址" prop="address"
                :rules="[
                 ]">
              <el-input v-model="inputForm.address" placeholder="请填写单位地址"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
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
        </el-col> -->
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
  import MemberService from '@/api/member/MemberService'
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
          company: '',
          email: '',
          mobile: '',
          telephone: '',
          jobtitle: '',
          address: '',
          audited: ''
        }
      }
    },
    components: {
    },
    memberService: null,
    created () {
      this.memberService = new MemberService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建会员`
        } else if (method === 'edit') {
          this.title = '修改会员'
        } else if (method === 'view') {
          this.title = '查看会员'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.memberService.queryById(this.inputForm.id).then(({data}) => {
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
            this.memberService.save(this.inputForm).then(({data}) => {
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

  
