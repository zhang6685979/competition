<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
      @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="participate0">
        <el-select v-model="searchForm.participate0" placeholder="请选择参与方式" size="small" style="width: 100%;" clearable>
          <el-option v-for="item in ['线上参会', '线下参会']" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}" export print custom>
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
            :disabled="$refs.refereeTable && $refs.refereeTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
            :disabled="$refs.refereeTable && $refs.refereeTable.getCheckboxRecords().length === 0" plain>删除</el-button>
        </template>
      </vxe-toolbar>
      <div style="height: 500px;">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="refereeTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
          :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>

          <vxe-column field="name" sortable title="姓名">
          </vxe-column>
          <vxe-column field="sex" sortable title="性别">
          </vxe-column>
          <vxe-column field="idcardno" sortable title="身份证号">
          </vxe-column>
          <vxe-column field="jobtitle" sortable title="职务">
          </vxe-column>
          <vxe-column field="school" sortable title="所在学院">
          </vxe-column>
          <vxe-column field="participate0" sortable title="参与方式">
          </vxe-column>
          <vxe-column field="mobile" sortable title="手机号码">
          </vxe-column>
          <vxe-column field="email" sortable title="电子邮箱">
          </vxe-column>
          <vxe-column fixed="right" align="center" width="200" title="操作">
            <template slot-scope="scope">
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
    <RefereeForm ref="refereeForm" :cid="cid" @refreshDataList="refreshList"></RefereeForm>
  </div>
</template>

<script>
  import RefereeForm from './RefereeForm'
  import RefereeService from '@/api/referee/RefereeService'
  export default {
    props: {
      cid: String
    },
    data() {
      return {
        searchForm: {
          participate0: '',
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
      RefereeForm
    },
    refereeService: null,
    created() {
      this.refereeService = new RefereeService()
    },
    mounted() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.refereeService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid': this.cid,
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
        this.$refs.refereeForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.refereeTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.refereeForm.init('edit', id)
      },
      // 查看
      view(id) {
        this.$refs.refereeForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.refereeTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.refereeService.delete(ids).then(({
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

