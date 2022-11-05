<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="租户名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="enabled">
                  <el-select v-model="searchForm.enabled" placeholder="请选择是否可用" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('yes_no')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
         <el-form-item prop="hostname">
                <el-input size="small" v-model="searchForm.hostname" placeholder="租户域名" clearable></el-input>
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
            <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.tenantTable && $refs.tenantTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.tenantTable && $refs.tenantTable.getCheckboxRecords().length === 0" plain>删除</el-button>
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
            ref="tenantTable"
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
        title="租户名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
            </template>
      </vxe-column>
    <vxe-column
        field="enabled"
        sortable
        title="是否可用">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("yes_no", scope.row.enabled, '-') }}
        </template>
      </vxe-column>
    <vxe-column
        field="starttime"
        sortable
        title="租户开始日期">
      </vxe-column>
    <vxe-column
        field="endtime"
        sortable
        title="租户结束日期">
      </vxe-column>
    <vxe-column
        field="hostname"
        sortable
        title="租户域名">
      </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <TenantForm  ref="tenantForm" @refreshDataList="refreshList"></TenantForm>
  </div>
</template>

<script>
  import TenantForm from './TenantForm'
  import TenantService from '@/api/tenant/TenantService'
  export default {
    data () {
      return {
        searchForm: {
          name: '',
          enabled: '',
          hostname: ''
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
      TenantForm
    },
    tenantService: null,
    created () {
      this.tenantService = new TenantService()
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.tenantService.list({
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
        this.$refs.tenantForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.tenantTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.tenantForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.tenantForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.tenantTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.tenantService.delete(ids).then(({data}) => {
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
