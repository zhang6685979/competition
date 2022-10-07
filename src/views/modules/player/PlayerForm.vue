<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" :rules='[{ "required": true, "message": "请填写姓名" }]'>
              <el-input v-model="inputForm.name" placeholder="请填写姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idcardno" :rules='[{ "required": true, "message": "请填写身份证号" },{validator: validator.isCardId, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.idcardno" placeholder="请填写身份证号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex" :rules="[
                 ]">
              <el-select v-model="inputForm.sex" placeholder="请选择" style="width: 100%;">
                <el-option label="男" value="男">
                </el-option>
                <el-option label="女" value="女">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile" :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isMobile, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.mobile" placeholder="请填写手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email" :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isEmail, trigger:["blur","change"]}]'>
              <el-input v-model="inputForm.email" placeholder="请填写电子邮箱"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="职务" prop="jobtitle"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jobtitle" placeholder="请填写职务"     ></el-input>
           </el-form-item>
        </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="院系" prop="faculty"
                :rules="[
                 ]">
              <el-input v-model="inputForm.faculty" placeholder="请填写院系"     ></el-input>
           </el-form-item>
        </el-col> -->
          <el-col :span="12">
            <el-form-item label="地址" prop="address" :rules='[{ "required": true, "message": "请填写地址" }]'>
              <el-input v-model="inputForm.address" placeholder="请填写地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="school" :rules='[{ "required": true, "message": "请选择学校" }]'>
              <school-select v-model="inputForm.school"></school-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赛项" prop="module" :rules='[{ "required": true, "message": "请填写赛项" }]'>
              <el-input v-model="inputForm.module" placeholder="请填写赛项"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赛队" prop="teamName" :rules='[{ "required": true, "message": "请填写赛队" }]'>
              <el-input v-model="inputForm.teamName" placeholder="请填写赛队"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指导老师" prop="instructor">
              <el-input v-model="inputForm.instructor" placeholder="请填写指导老师"></el-input>
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
  import PlayerService from '@/api/player/PlayerService'
  import schoolSelect from '@/components/FormMake/components/SignupTable/schoolSelect'
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
          idcardno: '',
          sex: '',
          mobile: '',
          email: '',
          jobtitle: '',
          faculty: '',
          address: '',
          school: '',
          module: '',
          teamName:'',
          instructor:''
        }
      }
    },
    components: {
      schoolSelect
    },
    playerService: null,
    created() {
      this.playerService = new PlayerService()
    },
    methods: {
      init(method, id) {
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
            this.playerService.queryById(this.inputForm.id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
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
            this.inputForm.cid = this.cid;
            this.playerService.save(this.inputForm).then(({
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
