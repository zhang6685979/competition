<template>
  <div class="jp-common-layout page">
    <div class="jp-common-layout-left">
      <div class="jp-common-title">
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addTreeNode" size="small" icon="el-icon-plus" circle></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <el-tree class="filter-tree" :data="voteCategoryTreeData" :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }" default-expand-all highlight-current node-key="id" :filter-node-method="filterNode"
              :expand-on-click-node="false" @node-click="handleNodeClick" ref="voteCategoryTree">
              <span class="custom-tree-node" slot-scope="{ node, data}">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline"
                    @click="() => editTreeNode(data)"></el-button>
                  <el-button type="text" class="red tree-item-button" icon="el-icon-delete"
                    @click="() => delTreeNode(data)"></el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="jp-common-layout-center jp-flex-main">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
        @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="title">
          <el-input size="small" v-model="searchForm.title" placeholder="投票名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
          <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="bg-white top">
        <div class="el-scrollbar__wrap" style="height: calc(100% - 40px);">
          <div class="el-scrollbar__view">
            <el-row>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                  <div class="jp-card jp-card-bordered">
                    <div class="add-border">
                      <a @click="add()">
                        <i class="el-icon-plus"></i>
                        <p>新建投票</p>
                      </a>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="(item, index) in dataList" :key="index">
                <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always" class="vote-item">
                  <img class="image" :src="item.image?item.image:require('@/assets/images/99d0.png')">
                  <div class="jp-card-label">
                    <p>{{item.title}}</p>
                    <el-tag size="small" :type="getStatusColorStyle(item.status).type">
                      {{getStatusColorStyle(item.status).name}}
                    </el-tag>
                  </div>
                  <div class="vote-info">
                    <p>分类：{{item.typeName}}</p>
                    <p>起始时间：{{item.starttime}}~{{item.endtime}}</p>
                    <p>投票模式：{{item.mode}}可投{{item.everydayTimes}}票</p>
                    <p>已投票数：{{item.views}}</p>
                    <p>创建时间：{{ item.createTime | formatDate }}</p>
                  </div>

                  <ul class="jp-card-actions">
                    <li>
                      <vxe-button type="text" content="编辑" @click="edit(item.id)"></vxe-button>
                    </li>
                    <li>
                      <vxe-button type="text" content="投票数据"></vxe-button>
                    </li>
                    <li>
                      <vxe-button type="text" transfer>
                        <template #default>状态管理</template>
                        <template #dropdowns>
                          <vxe-button type="text" @click="setStatus(item.id,1)">启用</vxe-button>
                          <vxe-button type="text" @click="setStatus(item.id,2)">停用</vxe-button>
                          <vxe-button type="text" @click="clearData(item.id)">清空投票数据</vxe-button>
                        </template>
                      </vxe-button>
                    </li>
                    <li>
                      <vxe-button type="text" transfer>
                        <template #default>更多...</template>
                        <template #dropdowns>
                          <vxe-button type="text">预览</vxe-button>
                          <vxe-button type="text">生成二维码</vxe-button>
                          <vxe-button type="text" @click="del(item.id)">删除</vxe-button>
                        </template>
                      </vxe-button>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>
          </div>`
        </div>
        <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
          :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle">
        </vxe-pager>
        <!-- 弹窗, 新增 / 修改 -->
        <VoteCategoryForm ref="voteCategoryForm" @refreshTree="refreshTree"></VoteCategoryForm>
      </div>
    </div>
  </div>
</template>

<script>
  import VoteCategoryForm from './VoteCategoryForm'
  import VoteSubjectService from '@/api/vote/VoteSubjectService'
  import VoteCategoryService from '@/api/vote/VoteCategoryService'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data() {
      return {
        searchForm: {
          type: '',
          title: ''
        },
        filterText: '',
        voteCategoryTreeData: [],
        selectVoteCategoryName: '',
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false,
        statusList: [{
            code: 0,
            name: '未启用',
            type: 'primary'
          },
          {
            code: 1,
            name: '进行中',
            type: 'success'
          },
          {
            code: 2,
            name: '已停用',
            type: 'warning'
          }
        ],
      }
    },
    components: {
      SelectTree,
      VoteCategoryForm
    },
    voteSubjectService: null,
    VoteCategoryService: null,
    created() {
      this.voteSubjectService = new VoteSubjectService()
      this.VoteCategoryService = new VoteCategoryService()
    },
    activated() {
      this.refreshTree()
      this.refreshList()
    },
    computed: {
      getStatusColorStyle() {
        return function(code) {
          let item = this.statusList.find(item => item.code == code)
          return item;
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.voteCategoryTree.filter(val)
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      refreshTree() {
        this.VoteCategoryService.treeData().then(({
          data
        }) => {
          this.voteCategoryTreeData = data
        })
      },
      handleNodeClick(data) {
        this.searchForm.type = data.id
        this.refreshList()
      },
      addChildTreeNode(node) {
        this.$refs.voteCategoryForm.init('addChild', {
          id: '',
          parent: {
            id: node.id,
            name: node.name
          }
        })
      },
      // 新增
      addTreeNode() {
        this.$refs.voteCategoryForm.init('add', {
          id: '',
          parent: {
            id: '',
            name: ''
          }
        })
      },
      // 修改
      editTreeNode(data) {
        this.$refs.voteCategoryForm.init('edit', {
          id: data.id,
          parent: {
            id: '',
            name: ''
          }
        })
      },
      delTreeNode(data) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.VoteCategoryService.delete(data.id).then(({
            data
          }) => {
            this.$message.success(data)
            this.loading = false
            this.refreshTree()
            this.refreshList()
          })
        })
      },
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.voteSubjectService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          ...this.searchForm
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.loading = false
        })
      },
      // 当前页
      currentChangeHandle({
        currentPage,
        pageSize
      }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.refreshList()
      },
      // 新增
      add() {
        this.$router.push('/vote/VoteSubjectForm')
      },
      // 修改
      edit(id) {
        this.$router.push('/vote/VoteSubjectForm?id=' + id)
      },
      // 删除
      del(id) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.voteSubjectService.delete(id).then(({
            data
          }) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
      },
      resetSearch() {
        this.$refs.searchForm.resetFields()
        this.filterText = ''
        this.$refs.voteCategoryTree.setCurrentKey(null)
        this.refreshList()
      },
      setStatus(id,status){
        this.$http({
          url:'/vote/voteSubject/setstatus',
          method:'patch',
          params:{id,status}
        }).then(({data})=>{
          this.$message.success(data)
          this.refreshList()
        })
      },
      clearData(id){
        this.$http({
          url:'/vote/voteSubject/cleandata',
          method:'patch',
          params:{id}
        }).then(({data})=>{
          this.$message.success(data)
        })
      }
    }
  }
</script>
<style scoped="" lang="scss">
  .jp-card {
    height: 350px;
    cursor: pointer;
  }

  .jp-card-actions {
    display: flex;

    li {
      flex: 1;
    }
  }

  .jp-card-label {

    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      color: #1890FF;
      font-size: 14px;
      margin: 8px 0;
    }

  }

  .create-time {
    padding: 0 10px;
    font-weight: 400;
    color: #707070;
    line-height: 0px;
    font-size: 12px;
  }

  .vote-item {
    .image {
      width: 100%;
      height: 160px;
    }

    .vote-info {
      padding: 0 10px;

      p {
        font-size: 13px;
        font-weight: 400;
        color: #606266;
        line-height: 22px;
        margin: 0;
      }

    }
  }
</style>
