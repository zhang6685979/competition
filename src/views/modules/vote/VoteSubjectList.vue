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
                        <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)"></el-button>
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
        <vxe-toolbar :refresh="{query: refreshList}" export print custom>
          <template #buttons>
            <el-button v-if="hasPermission('vote:voteSubject:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-button v-if="hasPermission('vote:voteSubject:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.voteSubjectTable && $refs.voteSubjectTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button v-if="hasPermission('vote:voteSubject:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.voteSubjectTable && $refs.voteSubjectTable.getCheckboxRecords().length === 0" plain>删除</el-button>
          </template>
        </vxe-toolbar>
        <div style="height: calc(100% - 80px);">
        <vxe-table
            border="inner"
            auto-resize
            resizable
            height="auto"
            :loading="loading"
            size="small"
            ref="voteSubjectTable"
            show-header-overflow
            show-overflow
            highlight-hover-row
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            @sort-change="sortChangeHandle"
            :sort-config="{remote:true}"
            :data="dataList"
            :checkbox-config="{}">
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column type="checkbox"  width="40px"></vxe-column>
    <vxe-column
        field="title"
        sortable
        title="主题">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('vote:voteSubject:edit')" @click="edit(scope.row.id)">{{scope.row.title}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('vote:voteSubject:view')"  @click="view(scope.row.id)">{{scope.row.title}}</el-link>
              <span v-else>{{scope.row.title}}</span>
            </template>
      </vxe-column>
    <vxe-column
        field="image"

        sortable
        title="图片">
        <template slot-scope="scope" v-if="scope.row.image">
          <el-image
            style="height: 50px;width:50px;margin-right:10px;"
            :src="src" v-for="(src, index) in scope.row.image.split('|')" :key="index"
            :preview-src-list="scope.row.image.split('|')">
          </el-image>
        </template>
      </vxe-column>
    <vxe-column
        field="starttime"
        sortable
        title="开始时间">
      </vxe-column>
    <vxe-column
        field="jabEndtime"
        sortable
        title="结束时间">
      </vxe-column>
    <vxe-column
        field="describe0"
        sortable
        title="描述信息">
      </vxe-column>
    <vxe-column
        field="views"
        sortable
        title="访问量">
      </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('vote:voteSubject:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('vote:voteSubject:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('vote:voteSubject:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </vxe-column>
    </vxe-table>
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
        this.$refs.voteSubjectForm.init('add', '')
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

