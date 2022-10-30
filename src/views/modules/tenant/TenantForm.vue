<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag width="70%" :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-steps :active="activeIndex" finish-status="success" simple style="margin-bottom: 20px">
          <el-step title="租户基本信息"></el-step>
          <el-step title="创建租户管理员"></el-step>
          <el-step title="设置访问权限"></el-step>
        </el-steps>
        <el-row :gutter="15" v-if="activeIndex==0">
          <el-col :span="24">
            <el-form-item label="租户名称" prop="name" :rules="[{required: true, message:'租户名称不能为空', trigger:'blur'}
                          ]">
              <el-input v-model="inputForm.name" placeholder="请填写租户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="绑定域名" prop="hostname" :rules="[{required: true, message:'绑定域名不能为空', trigger:'blur'}
                          ]">
              <el-input v-model="inputForm.hostname" placeholder="请填写租户域名"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="租户开始日期" prop="starttime" :rules="[
                          ]">
              <el-date-picker style="width: 100%;" v-model="inputForm.starttime" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租户结束日期" prop="endtime" :rules="[
                          ]">
              <el-date-picker style="width: 100%;" v-model="inputForm.endtime" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否可用" prop="enabled">
              <el-radio-group v-model="inputForm.enabled">
                <el-radio :label="item.value" :key="index" v-for="(item,index) in $dictUtils.getDictList('yes_no')">
                  {{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="15" v-if="activeIndex==1">
              <el-col :span="24">
                <el-form-item label="账号"  prop="loginName" :rules="[{required: true, message: '登录名不能为空', trigger: 'blur'}]">
                    <el-input v-model="inputForm.loginName" maxlength="50" placeholder=""></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="密码:" prop="newPassword" :rules="inputForm.id?[]:[{required: true, message:'密码不能为空', trigger:'blur'}]">
                    <el-input v-model="inputForm.newPassword" maxlength="50" placeholder="若不修改，请留空" show-password></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="确认密码" prop="confirmNewPassword" :rules="inputForm.id?[{validator: validatePass2, trigger: 'blur'}]:[{required: true, message:'确认密码不能为空', trigger:'blur'},{validator: validatePass2, trigger: 'blur'}]">
                  <el-input v-model="inputForm.confirmNewPassword" maxlength="50" placeholder="" show-password></el-input>
                </el-form-item>
              </el-col>
            <el-col :span="24">
                <el-form-item label="姓名" :rules="[{required: true, message: '姓名不能为空', trigger: 'blur'}]" prop="nickName">
                  <el-input v-model="inputForm.nickName" maxlength="50" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机" prop="mobile" :rules="[{validator:validator.isMobile, trigger:'blur'}]">
                <el-input v-model="inputForm.mobile" maxlength="50" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item label="邮箱" prop="email" :rules="[{type:'email', message:'请输入正确的邮箱地址', trigger:'blur'}]">
                <el-input v-model="inputForm.email" maxlength="50" placeholder=""></el-input>
               </el-form-item>
            </el-col>
        </el-row>
        <el-row >
          <el-col :span="24" v-if="activeIndex==2">
            <el-tree
              :data="menuList"
              show-checkbox
              node-key="id"
              ref="tree"
              :default-expanded-keys="['1']"
              highlight-current
              :props="{
                children: 'children',
                label: 'name'
              }"
              @check-change="checkChange"
              >
            </el-tree>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" :disabled="activeIndex==0" @click="activeIndex--">上一步</el-button>
        <el-button size="small" :disabled="activeIndex==2" @click="next()">下一步</el-button>
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import TenantService from '@/api/tenant/TenantService'
  import MenuService from '@/api/sys/MenuService'
  export default {
    data() {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          name: '',
          enabled: '1',
          starttime: '',
          endtime: '',
          hostname: '',
          loginName:'',
          newPassword:'',
          confirmNewPassword:'',
          nickName:'',
          mobile:'',
          email:'',
          authorities:[]
        },
        activeIndex: 0,
        menuList:[]
      }
    },
    components: {},
    tenantService: null,
    menuService: null,
    created() {
      this.tenantService = new TenantService()
      this.menuService = new MenuService()
    },
    methods: {
      init(method, id) {
        this.activeIndex==0
        this.getMenuList()
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建租户`
        } else if (method === 'edit') {
          this.title = '修改租户'
        } else if (method === 'view') {
          this.title = '查看租户'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.tenantService.queryById(this.inputForm.id).then(({
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
            if(this.inputForm.authorities.length==0){
              this.$message.warning('请为租户设置访问权限')
              return false
            }
            this.loading = true
            this.tenantService.save(this.inputForm).then(({
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
      validatePass2  (rule, value, callback) {
        if (value !== this.inputForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      // 获取菜单列表
      getMenuList () {
        this.menuService.treeData({isShowHide: 1}).then(({data}) => {
          this.menuList = data
        })
      },
      checkChange(){
        var checkedKeys = this.$refs.tree.getCheckedKeys()
        this.inputForm.authorities = checkedKeys;
      },
      next(){
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.activeIndex++
          }
        })
      }
    }
  }
</script>
