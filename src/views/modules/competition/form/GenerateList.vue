<template>
  <div class="page">
    <div class="bg-white" style="height:100%">
      <vxe-toolbar export custom></vxe-toolbar>
      <div>
        <vxe-table border="inner" auto-resize resizable height="500" size="small" ref="table"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{filename:title}"
          :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
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
                <a :href="item.url" target="_blank" :key="index"
                  v-for="(item, index) in JSON.parse(scope.row[`${option.model}`] || '[]')">
                  {{decodeURIComponent(item.url.substring(item.url.lastIndexOf("/")+1))}}
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

        </vxe-table>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    isURL
  } from '@/utils/validate'
  export default {
    props: {
      tid: String,
      dataList:Array,
      title:String
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
    methods: {
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
          } else if(genList[i].options&&(genList[i].options.type||'').indexOf('signup-table')!=-1){
            this.generateModel(genList[i].columns||[])
          }else {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (genList[i].options.dataBind) {
              var index = this.dataBindFields.findIndex(item=>{
                return item.model == genList[i].model;
              })
              if(index==-1){
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
      }
    }
  }
</script>
