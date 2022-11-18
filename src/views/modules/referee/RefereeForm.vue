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
            <el-form-item label="所在学院" prop="school"
                :rules='[{ "required": true, "message": "请选择所在院校" }]'>
              <school-select v-model="inputForm.school" @getSchool="getSchool"></school-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="参与方式" prop="participate"
                :rules="[
                 ]">
                <el-select v-model="inputForm.participate" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('jab_participate')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="姓名" prop="name"
                :rules='[{ "required": true, "message": "请填写姓名" }]'>
              <el-input v-model="inputForm.name" placeholder="请填写姓名"     ></el-input>
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
            <el-form-item label="身份证号" prop="idcardno"
                :rules='[{ "required": true, "message": "请填写身份证号" },{validator: validator.isCardId, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.idcardno" placeholder="请填写身份证号"     ></el-input>
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
            <el-form-item label="手机号码" prop="mobile"
                :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isMobile, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.mobile" placeholder="请填写手机号码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email"
                :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isEmail, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.email" placeholder="请填写电子邮箱"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="航班/车次" prop="flightNumber"
                :rules="[
                 ]">
              <el-input v-model="inputForm.flightNumber" placeholder="请填写航班/车次"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="describe0"
                :rules="[
                 ]">
              <el-input v-model="inputForm.describe0" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="住宿方式" prop="stay"
                :rules="[
                 ]">
                <el-select v-model="inputForm.stay" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('jab_stay')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
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
  import RefereeService from '@/api/referee/RefereeService'
  import schoolSelect from '@/components/FormMake/components/SignupTable/schoolSelect'
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
          city: '',
          school: '',
          participate: '',
          name: '',
          sex: '',
          idcardno: '',
          jobtitle: '',
          mobile: '',
          email: '',
          flightNumber: '',
          describe0: '',
          stay: '',
          cid: ''
        }
      }
    },
    components: {
      schoolSelect
    },
    refereeService: null,
    created () {
      this.refereeService = new RefereeService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建裁判信息`
        } else if (method === 'edit') {
          this.title = '修改裁判信息'
        } else if (method === 'view') {
          this.title = '查看裁判信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.refereeService.queryById(this.inputForm.id).then(({data}) => {
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
            this.inputForm.cid = this.cid;
            this.refereeService.save(this.inputForm).then(({data}) => {
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
      getSchool(school){
        this.inputForm.city = school?school.city:''
      }
    }
  }
</script>
