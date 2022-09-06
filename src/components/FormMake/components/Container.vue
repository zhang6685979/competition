<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="250px">
          <div class="components-list">
            <template v-if="basicFields.length">
              <div class="widget-cate">{{$t('fm.components.basic.title')}}</div>
              <draggable tag="ul" :list="basicComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
                <!--jeeplus定制-->
                <li @click="handleField(item)" v-if="basicFields.indexOf(item.type)>=0" class="form-edit-widget-label"
                  :class="{'no-put': item.type == 'divider'}" v-for="(item, index) in basicComponents" :key="index">
                  <a>
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </a>
                </li>
              </draggable>
            </template>

            <template v-if="advanceFields.length">
              <div class="widget-cate">{{$t('fm.components.advance.title')}}</div>
              <draggable tag="ul" :list="advanceComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
                <!--jeeplus定制-->
                <li @click="handleField(item)" v-if="advanceFields.indexOf(item.type) >= 0"
                  class="form-edit-widget-label" :class="{'no-put': item.type == 'table'}"
                  v-for="(item, index) in advanceComponents" :key="index">
                  <a>
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </a>
                </li>
              </draggable>
            </template>


            <template v-if="layoutFields.length">
              <div class="widget-cate">{{$t('fm.components.layout.title')}}</div>
              <draggable tag="ul" :list="layoutComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
                <!--jeeplus定制-->
                <li @click="handleField(item)" v-if="layoutFields.indexOf(item.type) >=0"
                  class="form-edit-widget-label no-put" v-for="(item, index) in layoutComponents" :key="index">
                  <a>
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </a>
                </li>
              </draggable>
            </template>

            <template v-if="customFields.length">
              <div class="widget-cate">{{$t('fm.components.custom.title')}}</div>
              <draggable tag="ul" :list="customComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
                <li @click="handleField(item)" class="form-edit-widget-label" v-for="(item, index) in customComponents"
                  :key="index">
                  <a>
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </a>
                </li>
              </draggable>
            </template>

          </div>

        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action">
            </slot>
            <el-button type="text" :disabled="!undo" size="medium" icon="el-icon-back" @click="handleUndo">
              {{$t('fm.actions.undo')}}
            </el-button>
            <el-button type="text" :disabled="!redo" size="medium" icon="el-icon-right" @click="handleRedo">
              {{$t('fm.actions.redo')}}
            </el-button>

            <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">
              {{$t('fm.actions.import')}}
            </el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">
              {{$t('fm.actions.clear')}}
            </el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">
              {{$t('fm.actions.preview')}}
            </el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">
              {{$t('fm.actions.json')}}
            </el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document"
              @click="handleGenerateCode">{{$t('fm.actions.code')}}</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect">
            </widget-form>
          </el-main>
        </el-container>

        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">
                {{$t('fm.config.widget.title')}}
              </div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">
                {{$t('fm.config.form.title')}}
              </div>
              <div class="config-tab" v-if="tabList" :class="{active: configTab=='list'}"
                @click="handleConfigSelect('list')">{{$t('fm.config.list.title')}}</div>
            </el-header>
            <el-main class="config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"
                :key="widgetFormSelect ? widgetFormSelect.key : 0"></widget-config>
              <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
              <list-config v-show="configTab=='list'" :data="widgetFormSelect"></list-config>
            </el-main>
          </el-container>

        </el-aside>

        <cus-dialog :visible="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" width="1000px" form
          :title="$t('fm.actions.preview')">
          <generate-form style="margin: 0 auto;" insite="true"
            v-if="previewVisible && (previewForm.config.ui == 'element' || !previewForm.config.ui)" :data="previewForm"
            :value="widgetModels" :remote="remoteFuncs" ref="generateForm">

            <template v-slot:blank="scope">
              Width<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
              Height：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
            </template>
          </generate-form>
          <template slot="action">
            <el-button type="primary" @click="handleTest">{{$t('fm.actions.getData')}}</el-button>
            <el-button @click="handleReset">{{$t('fm.actions.reset')}}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog :visible="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson"
          ref="uploadJson" width="800px" form :title="$t('fm.actions.import')">
          <el-alert type="info" :title="$t('fm.description.uploadJsonInfo')"></el-alert>
          <code-editor height="400px" mode="json" v-model="jsonEg"></code-editor>
        </cus-dialog>

        <cus-dialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form
          :title="$t('fm.actions.json')">

          <code-editor height="400px" mode="json" v-model="jsonTemplate"></code-editor>

          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">
              {{$t('fm.actions.copyData')}}
            </el-button>
          </template>
        </cus-dialog>

        <cus-dialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form
          :title="$t('fm.actions.code')">
          <el-tabs type="border-card" style="box-shadow: none;" v-model="codeActiveName">
            <el-tab-pane label="Vue Component" name="vue">
              <code-editor height="450px" mode="html" v-model="vueTemplate"></code-editor>
            </el-tab-pane>
            <el-tab-pane label="HTML" name="html">
              <code-editor height="450px" mode="html" v-model="htmlTemplate"></code-editor>
            </el-tab-pane>
          </el-tabs>

          <template slot="action">
            <el-button type="primary" class="code-btn" :data-clipboard-text="codeCopyValue">
              {{$t('fm.actions.copyData')}}
            </el-button>
          </template>
        </cus-dialog>
      </el-container>
    </el-main>
    <!-- <el-footer height="30px" style="font-weight: 600;">Powered by <a target="_blank" href="https://github.com/GavinZhuLei/vue-form-making">vue-form-making</a></el-footer> -->
  </el-container>

</template>

<script>
  import Draggable from 'vuedraggable'
  import WidgetConfig from './WidgetConfig'
  import ListConfig from './ListConfig'
  import FormConfig from './FormConfig'
  import WidgetForm from './WidgetForm'
  import CusDialog from './CusDialog'
  import GenerateForm from './GenerateForm'
  import Clipboard from 'clipboard'
  import CodeEditor from '../components/CodeEditor'
  import {
    basicComponents,
    layoutComponents,
    advanceComponents
  } from './componentsConfig.js'
  import {
    loadJs,
    loadCss
  } from '../util/index.js'
  import {
    EventBus
  } from '../util/event-bus.js'
  import request from '../util/request.js'
  import generateCode from './generateCode.js'
  import historyManager from '../util/history-manager.js'
  import _ from 'lodash'
  import Vue from 'vue'
  export default {
    name: 'fm-making-form',
    components: {
      Draggable,
      WidgetConfig,
      FormConfig,
      WidgetForm,
      ListConfig,
      CusDialog,
      GenerateForm,
      CodeEditor
    },
    props: {
      preview: {
        type: Boolean,
        default: false
      },
      generateCode: {
        type: Boolean,
        default: false
      },
      uploadPath: {
        type: String,
        default: ''
      },
      tabList: {
        type: Boolean,
        default: false
      },
      generateJson: {
        type: Boolean,
        default: false
      },
      upload: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      basicFields: {
        type: Array,
        default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select',
          'switch', 'slider', 'text', 'html'
        ]
      },
      advanceFields: {
        type: Array,
        default: () => ['fileupload', 'imgupload', 'editor', 'table']
      },
      layoutFields: {
        type: Array,
        default: () => ['grid', 'tabs', 'divider']
      },
      customFields: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        basicComponents,
        layoutComponents,
        advanceComponents,
        customComponents: [],
        resetJson: false,
        widgetForm: {
          list: [],
          config: {
            labelWidth: 100,
            labelPosition: 'right',
            size: 'small',
            customClass: '',
            ui: 'element',
            layout: 'horizontal',
            labelCol: 3,
            width: '100%'
          },
        },
        previewForm: {},
        configTab: 'widget',
        widgetFormSelect: null,
        previewVisible: false,
        jsonVisible: false,
        codeVisible: false,
        uploadVisible: false,
        remoteFuncs: {
          func_test(resolve) {
            setTimeout(() => {
              const options = [{
                  id: '1',
                  name: '1111'
                },
                {
                  id: '2',
                  name: '2222'
                },
                {
                  id: '3',
                  name: '3333'
                }
              ]

              resolve(options)
            }, 2000)
          },
          funcGetToken(resolve) {
            request.get('http://tools-server.making.link/api/uptoken').then(res => {
              resolve(res.uptoken)
            })
          },
          upload_callback(response, file, fileList) {
            // console.log('callback', response, file, fileList)
          },
        },
        widgetModels: {},
        blank: '',
        htmlTemplate: '',
        jsonTemplate: '',
        vueTemplate: '',
        uploadEditor: null,
        jsonCopyValue: '',
        jsonClipboard: null,
        jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "right",
    "size": "small",
    "customClass": "",
    "ui": "element",
    "layout": "horizontal",
    "labelCol": 3,
    "width": "100%"
  }
}`,
        codeCopyValue: '',
        codeClipboard: null,
        codeActiveName: 'vue',
        undo: false,
        redo: false
      }
    },
    created() {
      advanceComponents[1].options.action = this.uploadPath
      advanceComponents[2].options.action = this.uploadPath
      this._loadComponents()
    },
    mounted() {
      const _this = this

      historyManager.clear().then(() => {
        EventBus.$on('on-history-add', () => {
          console.log('xxx', this.widgetFormSelect)
          historyManager.add(this.widgetForm, (this.widgetFormSelect && this.widgetFormSelect.key) ? this
            .widgetFormSelect.key : '').then(() => {
            _this.undo = true
            _this.redo = false
          })
        })
      })
    },
    methods: {
      handleGoGithub() {
        window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
      },
      handleConfigSelect(value) {
        this.configTab = value
      },
      handleMoveEnd(evt) {
        // console.log('end', evt)
      },
      handleMoveStart({
        oldIndex
      }) {
        // console.log('start', oldIndex, this.basicComponents)
      },
      handleMove() {
        return true
      },
      handlePreview() {
        // console.log(this.widgetForm)
        this.previewForm = _.cloneDeep(this.widgetForm)
        this.previewVisible = true
      },
      handleReset() {
        const $form = this.previewForm.config.ui == 'element' ?
          this.$refs.generateForm : this.$refs.generateAntForm

        $form.reset()
      },
      handleTest() {
        const $form = this.previewForm.config.ui == 'element' ?
          this.$refs.generateForm : this.$refs.generateAntForm

        $form.getData().then(data => {
          this.jsonVisible = true
          this.jsonTemplate = data
          this.$nextTick(() => {

            if (!this.jsonClipboard) {
              this.jsonClipboard = new Clipboard('.json-btn')
              this.jsonClipboard.on('success', (e) => {
                this.$message.success(this.$t('fm.message.copySuccess'))
              })
            }
            this.jsonCopyValue = JSON.stringify(data)
          })
          this.$refs.widgetPreview.end()
        }).catch(e => {
          this.$message.error(e)
          this.$refs.widgetPreview.end()
        })
      },
      handleGenerateJson() {
        this.jsonVisible = true
        this.jsonTemplate = this.widgetForm
        // console.log(JSON.stringify(this.widgetForm))
        this.$nextTick(() => {

          if (!this.jsonClipboard) {
            this.jsonClipboard = new Clipboard('.json-btn')
            this.jsonClipboard.on('success', (e) => {
              this.$message.success(this.$t('fm.message.copySuccess'))
            })
          }
          this.jsonCopyValue = JSON.stringify(this.widgetForm)
        })
      },
      handleGenerateCode() {
        this.codeVisible = true
        this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html', this.widgetForm.config.ui)
        this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue', this.widgetForm.config.ui)
        this.$nextTick(() => {

          if (!this.codeClipboard) {
            this.codeClipboard = new Clipboard('.code-btn')
            this.codeClipboard.on('success', (e) => {
              this.$message.success(this.$t('fm.message.copySuccess'))
            })
          }
          this.codeCopyValue = this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate
        })
      },
      handleUpload() {
        this.uploadVisible = true
      },
      handleUploadJson() {
        try {
          this.setJSON(this.jsonEg)
          this.uploadVisible = false
        } catch (e) {
          this.$message.error(e.message)
          this.$refs.uploadJson.end()
        }
      },
      handleClear() {
        this.widgetForm = {
          ...this.widgetForm,
          list: [],
        }

        this.widgetFormSelect = {}

        this.$nextTick(() => {
          EventBus.$emit('on-history-add')
        })
      },
      clear() {
        this.handleClear()
      },
      getJSON() {
        return this.widgetForm
      },
      getHtml() {
        return generateCode(JSON.stringify(this.widgetForm))
      },
      setJSON(json) {
        if (typeof json === 'string') {
          json = JSON.parse(json)
        }

        this.widgetForm = json

        if (json.list.length > 0) {
          this.widgetFormSelect = json.list[0]
        } else {
          this.widgetFormSelect = {}
        }
        this.$nextTick(() => {
          EventBus.$emit('on-history-add')
        })
      },
      handleInput(val) {
        // console.log(val)
        this.blank = val
      },
      handleField(item) {
        // console.log(item)
        EventBus.$emit('on-field-add', item)
      },
      handleUndo() {
        historyManager.updateLatest(this.widgetForm, (this.widgetFormSelect && this.widgetFormSelect.key) ? this
          .widgetFormSelect.key : '').then(() => {
          historyManager.undo().then((data) => {
            this.widgetForm = {
              ...data.data
            }
            this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key)
            this.undo = data.undo
            this.redo = data.redo
          })
        })
      },
      handleRedo() {
        historyManager.redo().then((data) => {
          this.widgetForm = {
            ...data.data
          }
          this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key)

          this.undo = data.undo
          this.redo = data.redo
        })
      },
      _findWidgetItem(list, key) {
        const index = list.findIndex(item => item.key == key)

        if (index >= 0) {
          return list[index]
        } else {
          for (let m = 0; m < list.length; m++) {
            const item = list[m]

            if (item.type === 'grid') {

              for (let i = 0; i < item.columns.length; i++) {
                return this._findWidgetItem(item.columns[i].list, key)
              }
            }
            if (item.type === 'table') {
              return this._findWidgetItem(item.tableColumns, key)
            }
            if (item.type === 'tabs') {

              for (let i = 0; i < item.tabs.length; i++) {
                return this._findWidgetItem(item.tabs[i].list, key)
              }
            }
          }

          return {}
        }
      },
      _loadComponents() {
        this.basicComponents = this.basicComponents.map(item => {
          return {
            ...item,
            name: this.$t(`fm.components.fields.${item.type}`)
          }
        })
        this.advanceComponents = this.advanceComponents.map(item => {
          return {
            ...item,
            name: this.$t(`fm.components.fields.${item.type}`)
          }
        })
        this.layoutComponents = this.layoutComponents.map(item => {
          return {
            ...item,
            name: this.$t(`fm.components.fields.${item.type}`)
          }
        })

        this.customComponents = this.customFields.map(item => {
          return {
            type: 'custom',
            icon: 'icon iconfont icon-table',
            ...item,
            options: {
              ...item.options
            }
          }
        })
      }
    },
    watch: {
      '$lang': function(val) {
        this._loadComponents()
      },
      codeActiveName(val) {
        this.codeCopyValue = this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate
      }
    }
  }
</script>

<style lang="scss">
  .widget-empty {
    background-position: 50%;
  }

  .custom1 .el-col {
    border: 1px solid #ccc;
    overflow: hidden;
    padding: 5px;
    // margin-right:-1px;
    // margin-bottom:-1px;
    margin-right: -1px;
    margin-bottom: -1px;
  }

  .custom .el-col {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
</style>
