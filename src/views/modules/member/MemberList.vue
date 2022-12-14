<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
      @keyup.enter.native="refreshList()" @submit.native.prevent  v-if="!readonly">
      <!-- 搜索框-->
      <el-form-item prop="name">
        <el-input size="small" v-model="searchForm.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input size="small" v-model="searchForm.mobile" placeholder="手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input size="small" v-model="searchForm.email" placeholder="邮箱" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}" export print custom v-if="!readonly">
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
            :disabled="$refs.memberTable && $refs.memberTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
            :disabled="$refs.memberTable && $refs.memberTable.getCheckboxRecords().length === 0" plain>删除</el-button>
        </template>
      </vxe-toolbar>
      <div  :style="{height: readonly?'calc(100% - 20px)':'calc(100% - 80px)'}">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="memberTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}"
          :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}" :data="dataList"
          :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="50px"  v-if="!readonly"></vxe-column>
          <vxe-column field="name" sortable title="您的姓名">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="view(scope.row.id)">{{scope.row.name}}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="company" sortable title="单位名称">
          </vxe-column>
          <vxe-column field="email" sortable title="您的邮箱">
          </vxe-column>
          <vxe-column field="mobile" sortable title="手机号码">
          </vxe-column>
          <vxe-column field="tags" sortable title="用户标签">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.tags" v-for="(item,index) in (scope.row.tags||'').split(',')"
                :key="index" class="user-tag">{{item}}</el-tag>
            </template>
          </vxe-column>
          <vxe-column fixed="right" align="center" width="100" title="操作" v-if="!readonly">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">编辑</el-button>
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
    <MemberForm ref="memberForm" @refreshDataList="refreshList"></MemberForm>
  </div>
</template>

<script>
  import MemberForm from './MemberForm'
  import MemberService from '@/api/member/MemberService'
  export default {
    props:{readonly:false},
    data() {
      return {
        searchForm: {
          name: '',
          email: '',
          mobile: ''
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
      MemberForm
    },
    memberService: null,
    created() {
      this.memberService = new MemberService()
    },
    activated() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.memberService.list({
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
        this.$refs.memberForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.memberTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.memberForm.init('edit', id)
      },
      // 查看
      view(id) {
        this.$refs.memberForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.memberTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.memberService.delete(ids).then(({
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
