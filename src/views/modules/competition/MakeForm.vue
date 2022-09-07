<template>
  <div>
    <el-dialog :title="title" fullscreen :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <fm-making-form :bindDataTable="inputForm.autoCreate !=='1'" ref="formDesign" style="height:700px"
          :data="options" v-if="visible"
          :uploadPath="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/formbuilder`" preview
          :custom-fields="customFields" :ds="inputForm.dataSource" :tableName="inputForm.tableName" tab-list
          generate-json clearable>

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
    props: {
      cid: String
    },
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
          "content": ""
        },
        customFields: [{
          name: '下载组件',
          el: 'download',
          icon: 'el-icon-download',
          options: {
            type: 'download',
            defaultValue: {},
            customClass: '',
            labelWidth: 100,
            isLabelWidth: false,
            hidden: false,
            dataBind: true,
            required: false,
            dataType: '',
            pattern: '',
            btnText: '下载模板', //按钮文字
            downloadDesc: '', //下载描述
            downloadUrl: '', //下载地址
          }
        }, {
          name: '领队报名',
          el: 'signup-table',
          icon: 'icon iconfont icon-table',
          model: 'instructor-signup',
          tableColumns: [{
            model: 'role',
            name: '角色',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'name',
            name: '姓名',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'caculty',
            name: '院系',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'jobtitle',
            name: '职务/职称',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'sex',
            name: '性别',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'mobile',
            name: '联系方式',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'email',
            name: '邮箱',
            options: {
              dataBind: true,
              isShow: true
            }
          }],
          options: {
            type: 'signup-table',
            defaultValue: [{
              role: '领队',
              name: '',
              caculty: '',
              module: '',
              jobtitle: '',
              sex: '男',
              mobile: '',
              email:'',
              idcardno: ''
            }],
            customClass: '',
            labelWidth: 100,
            isLabelWidth: false,
            hidden: false,
            dataBind: true,
            required: false,
            dataType: '',
            pattern: '',
            rows: 1,
            modules: [{
              value: '模块1'
            }]
          }
        }, {
          name: '指导老师报名',
          el: 'signup-table',
          icon: 'icon iconfont icon-table',
          model: 'referee-signup',
          tableColumns: [{
            model: 'role',
            name: '角色',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'name',
            name: '姓名',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'module',
            name: '赛项',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'jobtitle',
            name: '职务/职称',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'sex',
            name: '性别',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'mobile',
            name: '联系方式',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'email',
            name: '邮箱',
            options: {
              dataBind: true,
              isShow: true
            }
          }],
          options: {
            type: 'signup-table',
            defaultValue: [{
              role: '指导老师',
              name: '',
              caculty: '',
              module: '',
              jobtitle: '',
              sex: '男',
              mobile: '',
              email:'',
              idcardno: ''
            }],
            customClass: '',
            labelWidth: 100,
            isLabelWidth: false,
            hidden: false,
            dataBind: true,
            required: false,
            dataType: '',
            pattern: '',
            rows: 1,
            modules: [{
              value: '模块1'
            }]
          }
        }, {
          name: '选手报名',
          el: 'signup-table',
          icon: 'icon iconfont icon-table',
          model: 'player-signup',
          tableColumns: [{
            model: 'role',
            name: '角色',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'name',
            name: '姓名',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'module',
            name: '赛项',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'idcardno',
            name: '身份证号',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'sex',
            name: '性别',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'mobile',
            name: '联系方式',
            options: {
              dataBind: true,
              isShow: true
            }
          },{
            model: 'email',
            name: '邮箱',
            options: {
              dataBind: true,
              isShow: true
            }
          }],
          options: {
            type: 'signup-table',
            defaultValue: [{
              role: '参赛选手',
              name: '',
              caculty: '',
              module: '',
              jobtitle: '',
              sex: '男',
              mobile: '',
              email:'',
              idcardno: ''
            }],
            customClass: '',
            labelWidth: 100,
            isLabelWidth: false,
            hidden: false,
            dataBind: true,
            required: false,
            dataType: '',
            pattern: '',
            rows: 1,
            modules: [{
              value: '模块1'
            }]
          }
        }]
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
        this.inputForm.cid = this.cid
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
