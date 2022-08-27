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
                var json = {
                  "list": [{
                    "key": "1603881749832",
                    "icon": "icon-component",
                    "name": "自定义组件",
                    "type": "component",
                    "model": "component_1603881749832",
                    "rules": [],
                    "options": {
                      "hidden": false,
                      "dataBind": true,
                      "required": false,
                      "template": "<h3 style=\"text-align: center;\">人员履历表</h3>",
                      "hideLabel": true,
                      "labelWidth": 100,
                      "remoteFunc": "func_1603881749832",
                      "customClass": "",
                      "isLabelWidth": false,
                      "remoteOption": "option_1603881749832"
                    }
                  }, {
                    "key": "1603881789532",
                    "icon": "icon-table1",
                    "name": "表格布局",
                    "rows": [{
                      "columns": [{
                        "key": "92gwq6om",
                        "list": [{
                          "key": "1603881804033",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component_1603881804033",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">姓    名</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "nlquhjx6",
                        "list": [{
                          "key": "1603882439538",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input_1603882439538",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "gzo9gq1t",
                        "list": [{
                          "key": "1603881824461",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603881822912",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">性别</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "al044fon",
                        "list": [{
                          "key": "1603882447784",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882443232",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "6jc6346e",
                        "list": [{
                          "key": "1603881842480",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603881840865",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">出生年月</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "8s3z75os",
                        "list": [{
                          "key": "1603882451603",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882449017",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "las95in4",
                        "list": [{
                          "key": "1603881856533",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603881853771",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">民族</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "iwdmm65e",
                        "list": [{
                          "key": "1603882454996",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882452706",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "1kulg73o",
                        "list": [{
                          "key": "1603881869949",
                          "icon": "icon-tupian",
                          "name": "图片",
                          "type": "imgupload",
                          "model": "imgupload_1603881869949",
                          "rules": [],
                          "options": {
                            "min": 0,
                            "size": {
                              "width": 100,
                              "height": 100
                            },
                            "limit": 8,
                            "token": "",
                            "width": "100px",
                            "action": "http://tools-server.making.link/api/transfer",
                            "domain": "http://tcdn.form.xiaoyaoji.cn/",
                            "hidden": false,
                            "isEdit": false,
                            "headers": [],
                            "isQiniu": false,
                            "dataBind": true,
                            "disabled": false,
                            "isDelete": false,
                            "multiple": false,
                            "readonly": false,
                            "required": false,
                            "hideLabel": true,
                            "tokenFunc": "funcGetToken",
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881869949",
                            "customClass": "",
                            "defaultValue": [],
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881869949"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "120px",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 3,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "4n7h5ps9",
                        "list": [{
                          "key": "1603881986692",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603881985297",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">政治面目</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "g1vgto26",
                        "list": [{
                          "key": "1603882468150",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882465750",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "zpbww9wf",
                        "list": [{
                          "key": "1603881998705",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603881997301",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">职称</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "2dd82158",
                        "list": [{
                          "key": "1603882464635",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882462934",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "llu9b4ol",
                        "list": [{
                          "key": "1603882015200",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882013238",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">文化程度</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "vuk96ylw",
                        "list": [{
                          "key": "1603882460697",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882459037",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "ykpzm7ar",
                        "list": [{
                          "key": "1603882031244",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882029825",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">联系电话</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "e1h4pt0h",
                        "list": [{
                          "key": "1603882457916",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882456060",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "olwnziqh",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "vt7lmxe8",
                        "list": [{
                          "key": "1603882055330",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882052890",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">参加工作时间</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "uvj0p2bj",
                        "list": [{
                          "key": "1603882470762",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882469104",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 3,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "7oza1a37",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "p0humqrr",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "bfm7kvv4",
                        "list": [{
                          "key": "1603882073693",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882072313",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">身份证号</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "aiv529ba",
                        "list": [{
                          "key": "1603882473797",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882471943",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 3,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "suvq68rc",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "7b9mllkr",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "657aqphi",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "n1tnab9y",
                        "list": [{
                          "key": "1603882128238",
                          "icon": "icon-RectangleCopy",
                          "name": "栅格布局",
                          "type": "grid",
                          "model": "grid_1603882128238",
                          "rules": [],
                          "columns": [{
                            "lg": 12,
                            "md": 12,
                            "sm": 12,
                            "xl": 12,
                            "xs": 12,
                            "list": [{
                              "key": "1603882139608",
                              "icon": "icon-radio-active",
                              "name": "现任职务属：",
                              "type": "radio",
                              "model": "radio_1603882139608",
                              "rules": [],
                              "novalid": {},
                              "options": {
                                "props": {
                                  "label": "label",
                                  "value": "value"
                                },
                                "width": "",
                                "hidden": false,
                                "inline": true,
                                "remote": false,
                                "options": [{
                                  "label": "Option 1",
                                  "value": "任命"
                                }, {
                                  "label": "Option 2",
                                  "value": "聘任"
                                }, {
                                  "label": "Option 3",
                                  "value": "其他"
                                }],
                                "dataBind": true,
                                "disabled": false,
                                "required": false,
                                "showLabel": false,
                                "labelWidth": 140,
                                "remoteFunc": "func_1603882139608",
                                "remoteType": "option",
                                "customClass": "",
                                "defaultValue": "",
                                "isLabelWidth": true,
                                "remoteOption": "option_1603882139608",
                                "remoteOptions": [],
                                "requiredMessage": ""
                              }
                            }],
                            "span": 12
                          }, {
                            "lg": 12,
                            "md": 12,
                            "sm": 12,
                            "xl": 12,
                            "xs": 12,
                            "list": [{
                              "key": "1603882185236",
                              "icon": "icon-radio-active",
                              "name": "现任职务：",
                              "type": "radio",
                              "model": "radio1603882183351",
                              "rules": [],
                              "novalid": {},
                              "options": {
                                "props": {
                                  "label": "label",
                                  "value": "value"
                                },
                                "width": "",
                                "hidden": false,
                                "inline": true,
                                "remote": false,
                                "options": [{
                                  "label": "Option 1",
                                  "value": "经理"
                                }, {
                                  "label": "Option 2",
                                  "value": "副经理"
                                }],
                                "dataBind": true,
                                "disabled": false,
                                "required": false,
                                "showLabel": false,
                                "labelWidth": 90,
                                "remoteFunc": "func_1603882139608",
                                "remoteType": "option",
                                "customClass": "",
                                "defaultValue": "",
                                "isLabelWidth": true,
                                "remoteOption": "option_1603882139608",
                                "remoteOptions": [],
                                "requiredMessage": ""
                              }
                            }],
                            "span": 12
                          }],
                          "options": {
                            "flex": true,
                            "align": "top",
                            "gutter": 30,
                            "hidden": false,
                            "justify": "start",
                            "remoteFunc": "func_1603882128238",
                            "responsive": false,
                            "customClass": "",
                            "remoteOption": "option_1603882128238"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 9,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "tvve7mla",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "78tk85y9",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "bx2oe9yq",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "a46qe09l",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "eo7yvqoh",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "8ughrp0q",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "mevbt384",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "v7h9l6al",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "5et43tgh",
                        "list": [{
                          "key": "1603882226165",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882224600",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">工作简历</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 4,
                          "customClass": ""
                        },
                        "rules": []
                      }, {
                        "key": "hhazkzdh",
                        "list": [{
                          "key": "1603882256586",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882254953",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">起 止 年 月</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "bpetdh5t",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "7u681ozh",
                        "list": [{
                          "key": "1603882268296",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882266434",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">工 作 单 位</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "8vrf9see",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "4raxeq9y",
                        "list": [{
                          "key": "1603882281799",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882279574",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">职  务</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "427b29zg",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "xo9mc2cn",
                        "list": [{
                          "key": "1603882295684",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882294040",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">职  称</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "k47hea2r",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "0u9u5qij",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "t7ilvkys",
                        "list": [{
                          "key": "1603882478867",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882476244",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "11ux44dg",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "lk2ts02l",
                        "list": [{
                          "key": "1603882487527",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882485695",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "qpxuv3ed",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "zyvhx54b",
                        "list": [{
                          "key": "1603882495079",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882493718",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "x6se46e9",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "u8toi1t5",
                        "list": [{
                          "key": "1603882499517",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882496140",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "ndg7r31g",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "yzjul899",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "zr1z7dni",
                        "list": [{
                          "key": "1603882481478",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882480095",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "go5np95g",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "hnxnt7oo",
                        "list": [{
                          "key": "1603882489972",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882488520",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "67d7upqg",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "ec59ypq8",
                        "list": [{
                          "key": "1603882502088",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882500553",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "mqkko5pw",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "p50xkeyv",
                        "list": [{
                          "key": "1603882507527",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882506074",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "ls50atfr",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "s6c0tp5g",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "jjck2sku",
                        "list": [{
                          "key": "1603882484102",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882482599",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "pcfjsycq",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "kxouqt0o",
                        "list": [{
                          "key": "1603882492121",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882490853",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "2ukvhn0z",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "kpxh6mqk",
                        "list": [{
                          "key": "1603882504548",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882503074",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "5ray0hk5",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "kwxl0qri",
                        "list": [{
                          "key": "1603882510149",
                          "icon": "icon-input",
                          "name": "单行文本",
                          "type": "input",
                          "model": "input1603882508439",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "dataType": "",
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882439538",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "patternCheck": false,
                            "remoteOption": "option_1603882439538",
                            "showPassword": false,
                            "dataTypeCheck": false,
                            "patternMessage": "",
                            "dataTypeMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 2,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "1l6tnvhs",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }, {
                      "columns": [{
                        "key": "2i93wuwl",
                        "list": [{
                          "key": "1603882348150",
                          "icon": "icon-component",
                          "name": "自定义组件",
                          "type": "component",
                          "model": "component1603882346493",
                          "rules": [],
                          "options": {
                            "hidden": false,
                            "dataBind": false,
                            "required": false,
                            "template": "<div style=\"text-align: center;\">工作简历</div>",
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603881804033",
                            "customClass": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603881804033"
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "51xbytkn",
                        "list": [{
                          "key": "1603882381107",
                          "icon": "icon-diy-com-textarea",
                          "name": "多行文本",
                          "type": "textarea",
                          "model": "textarea_1603882381107",
                          "rules": [],
                          "options": {
                            "width": "100%",
                            "hidden": false,
                            "pattern": "",
                            "dataBind": true,
                            "disabled": false,
                            "required": false,
                            "hideLabel": true,
                            "labelWidth": 100,
                            "remoteFunc": "func_1603882381107",
                            "customClass": "",
                            "placeholder": "",
                            "defaultValue": "",
                            "isLabelWidth": false,
                            "remoteOption": "option_1603882381107",
                            "patternMessage": "",
                            "requiredMessage": ""
                          }
                        }],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 8,
                          "rowspan": 1,
                          "customClass": ""
                        }
                      }, {
                        "key": "exqzr09p",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "8fqafoh8",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 6,
                          "rowspan": 1,
                          "customClass": "",
                          "invisible": true
                        }
                      }, {
                        "key": "w68ah0jo",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "libraja7",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "872cd0g9",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "ikw4rjwp",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }, {
                        "key": "xu8ouvw6",
                        "list": [],
                        "type": "td",
                        "options": {
                          "align": "left",
                          "width": "",
                          "height": "",
                          "valign": "top",
                          "colspan": 1,
                          "rowspan": 1,
                          "invisible": true,
                          "customClass": ""
                        }
                      }]
                    }],
                    "type": "report",
                    "model": "report_1603881789532",
                    "rules": [],
                    "options": {
                      "hidden": false,
                      "remoteFunc": "func_1603881789532",
                      "borderColor": "#999",
                      "borderWidth": 1,
                      "customClass": "",
                      "remoteOption": "option_1603881789532"
                    }
                  }],
                  "config": {
                    "ui": "element",
                    "size": "small",
                    "width": "100%",
                    "layout": "horizontal",
                    "labelCol": 3,
                    "hideLabel": false,
                    "labelWidth": 100,
                    "customClass": "",
                    "labelPosition": "right",
                    "hideErrorMessage": false
                  }
                }
                this.$refs.formDesign.setJSON(json)
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
