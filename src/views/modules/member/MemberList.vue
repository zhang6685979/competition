<template>
  <div class="page">
      <div style="height: 200px;">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="memberTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
          :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
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
          <vxe-column field="telephone" sortable title="联系电话">
          </vxe-column>
          <vxe-column field="jobtitle" sortable title="您的职务">
          </vxe-column>
          <vxe-column field="address" sortable title="单位地址">
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
        :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="currentChangeHandle">
      </vxe-pager>
    <!-- 弹窗, 新增 / 修改 -->
    <MemberForm ref="memberForm" @refreshDataList="refreshList"></MemberForm>
  </div>
</template>

<script>
  import MemberForm from './MemberForm'
  import MemberService from '@/api/member/MemberService'
  export default {
    data() {
      return {
        searchForm: {},
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
