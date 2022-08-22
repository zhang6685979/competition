<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="cid">
                <el-input size="small" v-model="searchForm.cid" placeholder="比赛编号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="ctid">
                <el-input size="small" v-model="searchForm.ctid" placeholder="关联赛事" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>

     <div class="bg-white top">
        <vxe-toolbar :refresh="{query: refreshList}" export print custom>
          <template #buttons>
            <el-button v-if="hasPermission('competition:competitionPlayer:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-button v-if="hasPermission('competition:competitionPlayer:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.competitionPlayerTable && $refs.competitionPlayerTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button v-if="hasPermission('competition:competitionPlayer:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.competitionPlayerTable && $refs.competitionPlayerTable.getCheckboxRecords().length === 0" plain>删除</el-button>
          </template>
        </vxe-toolbar>
        <div style="height: 500px;">
        <vxe-table
            border="inner"
            auto-resize
            resizable
            height="auto"
            :loading="loading"
            size="small"
            ref="competitionPlayerTable"
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
        title="姓名">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('competition:competitionPlayer:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('competition:competitionPlayer:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </vxe-column>
    <vxe-column
        field="idcardno"
        sortable
        title="身份证号">
      </vxe-column>
    <vxe-column
        field="sex"
        sortable
        title="性别">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("sex", scope.row.sex, '-') }}
        </template>
      </vxe-column>
    <vxe-column
        field="mobile"
        sortable
        title="手机号">
      </vxe-column>
    <vxe-column
        field="email"
        sortable
        title="电子邮箱">
      </vxe-column>
    <vxe-column
        field="jobtitle"
        sortable
        title="职务">
      </vxe-column>
    <vxe-column
        field="role"
        sortable
        title="角色，0：裁判，1：领队，2：指导老师，3：参赛选手">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("jab_player_type", scope.row.role, '-') }}
        </template>
      </vxe-column>
    <vxe-column
        field="audited"
        sortable
        title="审核">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("yes_no", scope.row.audited, '-') }}
        </template>
      </vxe-column>
    <vxe-column
        field="cid"
        sortable
        title="比赛编号">
      </vxe-column>
    <vxe-column
        field="ctid"
        sortable
        title="关联赛事">
      </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('competition:competitionPlayer:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('competition:competitionPlayer:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('competition:competitionPlayer:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <CompetitionPlayerForm  ref="competitionPlayerForm" @refreshDataList="refreshList"></CompetitionPlayerForm>
  </div>
</template>

<script>
  import CompetitionPlayerForm from './CompetitionPlayerForm'
  import CompetitionPlayerService from '@/api/competition/CompetitionPlayerService'
  export default {
    data () {
      return {
        searchForm: {
          cid: '',
          ctid: ''
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
      CompetitionPlayerForm
    },
    competitionPlayerService: null,
    created () {
      this.competitionPlayerService = new CompetitionPlayerService()
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.competitionPlayerService.list({
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
        this.$refs.competitionPlayerForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.competitionPlayerTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.competitionPlayerForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.competitionPlayerForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.competitionPlayerTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.competitionPlayerService.delete(ids).then(({data}) => {
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

