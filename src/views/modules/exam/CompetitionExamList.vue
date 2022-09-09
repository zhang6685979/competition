<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="cid">
                <el-input size="small" v-model="searchForm.cid" placeholder="关联赛事" clearable></el-input>
         </el-form-item>
         <el-form-item prop="crid">
                <el-input size="small" v-model="searchForm.crid" placeholder="比赛轮次" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>

     <div class="bg-white top">
        <vxe-toolbar :refresh="{query: refreshList}" export print custom>
          <template #buttons>
            <el-button v-if="hasPermission('exam:competitionExam:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-button v-if="hasPermission('exam:competitionExam:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.competitionExamTable && $refs.competitionExamTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button v-if="hasPermission('exam:competitionExam:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.competitionExamTable && $refs.competitionExamTable.getCheckboxRecords().length === 0" plain>删除</el-button>
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
            ref="competitionExamTable"
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
        field="name"
        sortable
        title="考试课目">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('exam:competitionExam:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('exam:competitionExam:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </vxe-column>
    <vxe-column
        field="starttime"
        sortable
        title="开始时间">
      </vxe-column>
    <vxe-column
        field="endtime"
        sortable
        title="结束时间">
      </vxe-column>
    <vxe-column
        field="rooms"
        sortable
        title="考场数量">
      </vxe-column>
    <vxe-column
        field="describe0"
        sortable
        title="考试描述">
      </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('exam:competitionExam:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('exam:competitionExam:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('exam:competitionExam:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    </div>
        <!-- 弹窗, 新增 / 修改 -->
    <CompetitionExamForm  ref="competitionExamForm" @refreshDataList="refreshList"></CompetitionExamForm>
  </div>
</template>

<script>
  import CompetitionExamForm from './CompetitionExamForm'
  import CompetitionExamService from '@/api/exam/CompetitionExamService'
  export default {
    data () {
      return {
        searchForm: {
          cid: '',
          crid: ''
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
    components: {
      CompetitionExamForm
    },
    competitionExamService: null,
    created () {
      this.competitionExamService = new CompetitionExamService()
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.competitionExamService.list({
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
        this.$refs.competitionExamForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.competitionExamTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.competitionExamForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.competitionExamForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.competitionExamTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.competitionExamService.delete(ids).then(({data}) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>

