<template>
  <div class="page">
    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}">
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
            :disabled="$refs.competitionAnnouncementTable && $refs.competitionAnnouncementTable.getCheckboxRecords().length !== 1"
            plain>修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
            :disabled="$refs.competitionAnnouncementTable && $refs.competitionAnnouncementTable.getCheckboxRecords().length === 0"
            plain>删除</el-button>
        </template>
      </vxe-toolbar>
      <div style="height: calc(100% - 80px);">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small"
          ref="competitionAnnouncementTable" show-header-overflow show-overflow highlight-hover-row :menu-config="{}"
          :print-config="{}" :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle"
          :sort-config="{remote:true}" :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column field="title" sortable title="公告标题">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false"
                v-if="hasPermission('competition:competitionAnnouncement:edit')" @click="edit(scope.row.id)">
                {{scope.row.title}}</el-link>
              <el-link type="primary" :underline="false"
                v-else-if="hasPermission('competition:competitionAnnouncement:view')" @click="view(scope.row.id)">
                {{scope.row.title}}</el-link>
              <span v-else>{{scope.row.title}}</span>
            </template>
          </vxe-column>
          <vxe-column field="latest" sortable title="是否最新">
            <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("yes_no", scope.row.latest, '-') }}
            </template>
          </vxe-column>
          <vxe-column field="top" sortable title="是否置顶">
            <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("yes_no", scope.row.top, '-') }}
            </template>
          </vxe-column>
          <vxe-column field="describe0" sortable title="公告描述">
          </vxe-column>
          <vxe-column field="createDate" sortable title="发布时间">
          </vxe-column>
          <vxe-column fixed="right" align="center" width="200" title="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
              <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
          :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle">
        </vxe-pager>
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <CompetitionAnnouncementForm ref="competitionAnnouncementForm" @refreshDataList="refreshList">
    </CompetitionAnnouncementForm>
  </div>
</template>

<script>
  import CompetitionAnnouncementForm from './CompetitionAnnouncementForm'
  import CompetitionAnnouncementService from '@/api/competition/CompetitionAnnouncementService'
  export default {
    props: {
      id: String
    },
    data() {
      return {
        searchForm: {
          cid: ''
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
      CompetitionAnnouncementForm
    },
    competitionAnnouncementService: null,
    created() {
      this.competitionAnnouncementService = new CompetitionAnnouncementService()
    },
    activated() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.competitionAnnouncementService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid': this.id
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
      // 排序
      sortChangeHandle(column) {
        this.tablePage.orders = []
        if (column.order != null) {
          this.tablePage.orders.push({
            column: this.$utils.toLine(column.property),
            asc: column.order === 'asc'
          })
        }
        this.refreshList()
      },
      // 新增
      add() {
        this.$refs.competitionAnnouncementForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.competitionAnnouncementTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.competitionAnnouncementForm.init('edit', id)
      },
      // 查看
      view(id) {
        this.$refs.competitionAnnouncementForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.competitionAnnouncementTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.competitionAnnouncementService.delete(ids).then(({
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
        this.refreshList()
      }
    }
  }
</script>
