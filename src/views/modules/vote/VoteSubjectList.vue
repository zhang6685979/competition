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
              <el-tree
                class="filter-tree"
                :data="voteCategoryTreeData"
                :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                default-expand-all
                highlight-current
                node-key="id"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                ref="voteCategoryTree">
                   <span class="custom-tree-node" slot-scope="{ node, data}">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)"></el-button>
                        <el-button type="text" class="red tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)"></el-button>
                    </span>
                  </span>
              </el-tree>
            </div>
          </div>
         </div>
     </div>
     <div class="jp-common-layout-center jp-flex-main">
        <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="jabType.id">
                 <SelectTree
                  ref="jabType"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  size="small"
                  url="/vote/voteCategory/treeData"
                  :value="searchForm.jabType.id"
                  :clearable="true"
                  :accordion="true"
                  @getValue="(value) => {searchForm.jabType.id=value}"/>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>

     <div class="bg-white top">
        <div style="height: calc(100% - 80px);">
        <div class="el-scrollbar__wrap" style="height: calc(100% - 110px);">
          <div class="el-scrollbar__view">
            <el-row>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
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
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in dataList" :key="index">
                <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                  <img class="image" :src="item.image?item.image:require('@/assets/images/99d0.png')">
                  <div class="jp-card-label">
                    <p>{{item.name}}</p>
                    <el-tag size="small" :type="getStatusColorStyle(item.status).type">
                      {{getStatusColorStyle(item.status).name}}</el-tag>
                  </div>
                  <p class="create-time">创建时间：{{ item.createTime | formatDate }}</p>
                  <ul class="jp-card-actions">
                    <li>
                      <el-link :underline="false" @click="toProjectHandle(item.key,'editor')"><i
                          class="el-icon-edit-outline"></i> 编辑
                      </el-link>
                    </li>
                    <li v-if="item.status!=1">
                      <el-link :underline="false" @click="toProjectHandle(item.key,'statistics')"><i
                          class="el-icon-delete"></i> 统计</el-link>
                    </li>
                    <li v-if="item.status==2">
                      <el-link :underline="false" @click="stopProject(item.key)"><i class="el-icon-delete"></i> 停止
                      </el-link>
                    </li>
                    <li v-if="item.status!=2">
                      <el-link :underline="false" @click="deleteProject(item.key)"><i class="el-icon-delete"></i> 删除
                      </el-link>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>
          </div>`
        </div>
    <vxe-pager
      background
      size="small"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="currentChangeHandle">
    </vxe-pager>
   </div>
        <!-- 弹窗, 新增 / 修改 -->
    <VoteSubjectForm  ref="voteSubjectForm" @refreshDataList="refreshList"></VoteSubjectForm>
    <VoteCategoryForm  ref="voteCategoryForm" @refreshTree="refreshTree"></VoteCategoryForm>
   </div>
   </div>
  </div>
</template>

<script>
  import VoteSubjectForm from './VoteSubjectForm'
  import VoteCategoryForm from './VoteCategoryForm'
  import VoteSubjectService from '@/api/vote/VoteSubjectService'
  import VoteCategoryService from '@/api/vote/VoteCategoryService'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        searchForm: {
          jabType: {
            id: ''
          }
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
        loading: false
      }
    },
    components: {
      SelectTree,
      VoteSubjectForm,
      VoteCategoryForm
    },
    voteSubjectService: null,
    VoteCategoryService: null,
    created () {
      this.voteSubjectService = new VoteSubjectService()
      this.VoteCategoryService = new VoteCategoryService()
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    computed: {
    },
    watch: {
      filterText (val) {
        this.$refs.voteCategoryTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      refreshTree () {
        this.VoteCategoryService.treeData().then(({data}) => {
          this.voteCategoryTreeData = data
        })
      },
      handleNodeClick (data) {
        this.searchForm.jabType.id = data.id
        this.refreshList()
      },
      addChildTreeNode (node) {
        this.$refs.voteCategoryForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
      },
       // 新增
      addTreeNode () {
        this.$refs.voteCategoryForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      editTreeNode (data) {
        this.$refs.voteCategoryForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
      },
      delTreeNode (data) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.VoteCategoryService.delete(data.id).then(({data}) => {
            this.$message.success(data)
            this.loading = false
            this.refreshTree()
            this.refreshList()
          })
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.voteSubjectService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          ...this.searchForm
        }).then(({data}) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.loading = false
        })
      },
      // 当前页
      currentChangeHandle ({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.refreshList()
      },
      // 排序
      sortChangeHandle (column) {
        this.tablePage.orders = []
        if (column.order != null) {
          this.tablePage.orders.push({column: this.$utils.toLine(column.property), asc: column.order === 'asc'})
        }
        this.refreshList()
      },
      // 新增
      add () {
        //this.$refs.voteSubjectForm.init('add', '')

        this.$router.push('/vote/VoteSubjectForm')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.voteSubjectTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.voteSubjectForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.voteSubjectForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.voteSubjectTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.voteSubjectService.delete(ids).then(({data}) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.filterText = ''
        this.$refs.voteCategoryTree.setCurrentKey(null)
        this.refreshList()
      }
    }
  }
</script>
<style scoped="">
  .jp-card {
    height: 254px;
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
    p{
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
</style>
