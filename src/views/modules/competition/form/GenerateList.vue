<template>
  <div class="page">
    <div class="bg-white" style="height:100%">
      <vxe-toolbar :refresh="{query: getList}" export custom>
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-download" @click="patchDownload()"
            :disabled="($refs.table && ($refs.table.getCheckboxRecords().length == 0)) || fileFields.length==0" plain>
            批量下载</el-button>
        </template>
      </vxe-toolbar>
      <div>
        <vxe-table border="inner" auto-resize resizable height="500" size="small" ref="table" show-header-overflow
          show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}"
          :export-config="{filename:title}" :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column v-for="(option, index) in dataBindFields.filter((item)=>{
          return item.isShow
          })" :key="option.model" :field="option.model" show-overflow-tooltip :sortable="option.isSort?true:false"
            :title="option.name">
            <template slot-scope="scope">
              <div v-if="option.type === 'html'" v-html="scope.row[`${option.model}`]"></div>
              <div v-else-if="option.type === 'color'">
                <el-color-picker disabled v-model="scope.row[`${option.model}`]"></el-color-picker>
              </div>
              <div v-else-if="option.type === 'editor'">
                <p v-html="$utils.unescapeHTML(scope.row[`${option.model}`] || '')"></p>
              </div>
              <div v-else-if="option.type === 'imgupload'">
                <el-image style="height: 50px;width:50px;margin-right:10px;" :src="item.url"
                  v-for="(item, index) in JSON.parse(scope.row[`${option.model}`] || '[]')" :key="index"
                  :preview-src-list="JSON.parse(scope.row[`${option.model}`]).map((item)=>{return item.url})">
                </el-image>
              </div>
              <div v-else-if="option.type === 'fileupload'">
                <a @click="downloadFile(item)" style="cursor: pointer;display: block;" target="_blank" :key="index"
                  v-for="(item, index) in scope.row[`${option.model}`]?scope.row[`${option.model}`].split('|'):[]">
                  {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
                </a>
              </div>
              <div v-else-if="option.type === 'dict'">
                {{$dictUtils.getDictLabel(`${option.options.dictType}`, scope.row[`${option.model}`])}}
              </div>

              <div v-else-if="option.type === 'checkbox' && option.options.remote === 3">

                <span :key="index" v-for="(item, index) in JSON.parse(scope.row[`${option.model}`] || '[]')">
                  {{$dictUtils.getDictLabel(`${option.options.dictType}`, item)}}
                  <span v-if="index+1 !==  JSON.parse(scope.row[`${option.model}`] || '[]').length">
                    |
                  </span>
                </span>
              </div>

              <div v-else-if="option.type === 'select' && option.options.remote === 3 && option.options.multiple">
                <span :key="index" v-for="(item, index) in JSON.parse(scope.row[`${option.model}`] || '[]')">
                  {{$dictUtils.getDictLabel(`${option.options.dictType}`, item)}}
                  <span v-if="index+1 !==  JSON.parse(scope.row[`${option.model}`] || '[]').length">
                    |
                  </span>
                </span>
              </div>
              <div v-else-if="option.type === 'select' && option.options.remote === 3 && !option.options.multiple">
                {{$dictUtils.getDictLabel(`${option.options.dictType}`, scope.row[`${option.model}`])}}
              </div>

              <div v-else-if="option.type === 'radio' && option.options.remote === 3">
                {{$dictUtils.getDictLabel(`${option.options.dictType}`, scope.row[`${option.model}`])}}
              </div>
              <div v-else>
                <div v-if="index === 0">
                  <el-link type="primary" :underline="false"
                    v-if="$route.query.previewMode || hasPermission(`form:${tableName}:edit`)"
                    @click="edit(scope.row.id)">{{scope.row[`${option.model}`] || ''}} </el-link>
                  <el-link type="primary" :underline="false"
                    v-else-if="$route.query.previewMode || hasPermission(`form:${tableName}:view`)"
                    @click="view(scope.row.id)">{{scope.row[`${option.model}`] || ''}} </el-link>
                  <span v-else>{{scope.row[`${option.model}`] === undefined ? '' : scope.row[`${option.model}`]}}
                  </span>
                </div>
                <span v-else>{{scope.row[`${option.model}`] === undefined ? '' : scope.row[`${option.model}`]}} </span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="createTime" sortable title="填写日期">
          </vxe-column>

        </vxe-table>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    isURL
  } from '@/utils/validate'
  import {
    saveAs
  } from 'file-saver'
  import JSZip from 'jszip'
  export default {
    props: {
      tid: String,
      dataList: Array,
      title: String
    }, //模板id
    data() {
      return {
        tableName: '',
        options: {
          config: {
            actions: []
          },
          list: []
        },
        dataBindFields: [],
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.$http({
          url: '/competition/competitionSignup/queryById',
          method: 'get',
          params: {
            id: this.tid
          }
        }).then(({
          data
        }) => {
          if (data.content) {
            this.options = JSON.parse(data.content);
          }
          this.dataBindFields = []
          this.generateModel(this.options.list)
        })
      },
      generateModel(genList) {
        for (let i = 0; i < genList.length; i++) {
          if (genList[i].type === 'grid') {
            genList[i].columns.forEach(item => {
              this.generateModel(item.list)
            })
          } else if (genList[i].type === 'tabs') {
            genList[i].tabs.forEach(item => {
              this.generateModel(item.list)
            })
          } else if (genList[i].type === 'table') {
            this.generateModel(genList[i].tableColumns)
          } else if (genList[i].options && (genList[i].options.type || '').indexOf('signup-table') != -1) {
            this.generateModel(genList[i].columns || [])
          } else {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (genList[i].options.dataBind) {
              var index = this.dataBindFields.findIndex(item => {
                return item.model == genList[i].model;
              })
              if (index == -1) {
                this.dataBindFields.push({
                  'model': genList[i].model,
                  'options': genList[i].options,
                  'name': genList[i].name,
                  'type': genList[i].type,
                  'isShow': genList[i].options.isShow,
                  'isSort': genList[i].options.isSort,
                  'isSearch': genList[i].options.isSearch
                })
              }
            }
          }
        }

        return this.dataBindFields
      },
      //单个附件下载
      downloadFile(url) {
        var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
        const el = document.createElement('a');
        el.style.display = 'none';
        el.setAttribute('target', '_blank');
        /**
         * download的属性是HTML5新增的属性
         * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
         * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
         * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
         */
        fileName && el.setAttribute('download', fileName);
        el.href = url;
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
      },
      patchDownload() {
        var records = this.$refs.table.getCheckboxRecords()
        var fileFields = this.fileFields
        var files = [];
        records.forEach(record => {
          fileFields.forEach(field => {
            record[field.model].split('|').forEach(url => {
              var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
              files.push({name:fileName,url:url})
            })
          })
        })
        if(files.length>0){
          this.download(files,files.map(file=>file.name).join('、')+'.zip')
        }
      },
      download(files, filename) {
        let zip = new JSZip();
        let folder = zip.folder('files');
        // 异步操作
        Promise.resolve().then(() => {
          return files.reduce((accumulator, item) => {
            return accumulator.then(() => fetch(item.url, {
                method: 'GET',
                mode: "cors" //允许跨域  no-cors不允许跨域
              }).then(resp => resp.blob())
              .then(blob => folder.file(item.name, blob)))
          }, Promise.resolve())
        }).then(() => {
          folder.generateAsync({
            type: "blob"
          }).then(content => saveAs(content, filename));
        })
      }
    },
    computed: {
      fileFields() {
        return this.dataBindFields.filter(item => {
          return item.type == 'fileupload'
        })
      }
    }
  }
</script>
