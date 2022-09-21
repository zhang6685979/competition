<template>
  <div class="page">
    <div class="bg-white top">
      <vxe-toolbar>
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建一条</el-button>
        </template>
      </vxe-toolbar>
      <div style="height: 400px;">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small"
          ref="voteOptionTable" show-header-overflow show-overflow highlight-hover-row :data="dataList" >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column field="name" sortable title="选项名称">
          </vxe-column>
          <vxe-column field="image" sortable title="选项图片">
            <template slot-scope="scope" v-if="scope.row.image">
              <el-image style="height: 50px;width:50px;margin-right:10px;" :src="src"
                v-for="(src, index) in scope.row.image.split('|')" :key="index"
                :preview-src-list="scope.row.image.split('|')">
              </el-image>
            </template>
          </vxe-column>
          <vxe-column fixed="right" align="center" width="200" title="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row,scope.rowIndex)">详情</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.rowIndex)">删除</el-button>
            </template>
          </vxe-column>
        </vxe-table>

      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <VoteOptionForm ref="voteOptionForm" @addDataList="addDataList"></VoteOptionForm>
  </div>
</template>

<script>
  import VoteOptionForm from './VoteOptionForm'
  export default {
    props:{
      value:{
        type:Array,
        default:()=>{
          return []
        }
      }
    },
    data() {
      return {
        searchForm: {
          subject: ''
        },
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false
      }
    },
    watch: {
      dataList:{
        hanler:function(val){
          if(val){
            this.$emit('input', val)
          }
        },
        deep:true
      },
      value(val) {
        this.dataList = val;
      }
    },
    components: {
      VoteOptionForm
    },
    methods: {
      // 新增
      add() {
        this.$refs.voteOptionForm.init('add', '')
      },
      addDataList(data,index){
        if(index||index===0){
          this.$set(this.dataList,index,data)
        }else{
          this.dataList.push(data)
        }
      },
      // 修改
      edit(item,index) {
        this.$refs.voteOptionForm.init('edit', Object.assign({},item), index)
      },
      // 删除
      del(index) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.dataList.splice(index,1)
        })
      }
    }
  }
</script>
