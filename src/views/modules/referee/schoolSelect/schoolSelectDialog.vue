<template>
  <div>
    <el-dialog title="学校选择" width="1000px" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag
      class="userDialog" :visible.sync="visible">
      <el-row>
        <el-col :span="18">
          <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
            @keyup.enter.native="refreshList()" @submit.native.prevent>
            <el-form-item prop="school">
              <el-input size="small" v-model="searchForm.school" placeholder="学校名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="city">
              <el-input size="small" v-model="searchForm.city" placeholder="省份" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
              <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
            </el-form-item>
          </el-form>
          <vxe-table border="inner" height="400" :loading="loading" size="small" ref="schoolTable" show-header-overflow
            show-overflow highlight-hover-row @sort-change="sortChangeHandle" :sort-config="{remote:true}"
            :data="dataList" @checkbox-change="checkboxChange"  @checkbox-all="checkboxChange">
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column type="checkbox" width="50px"></vxe-column>
            <vxe-column field="school" sortable title="学校名称">
            </vxe-column>
            <vxe-column field="city" sortable title="所属省份">
            </vxe-column>
          </vxe-table>
          <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
            :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
            @page-change="currentChangeHandle">
          </vxe-pager>
        </el-col>
        <el-col :span="6">
          <el-tag :key="index" v-for="(tag,index) in dataListAllSelections" closable :disable-transitions="false"
            @close="del(tag)">
            {{tag.school}}
          </el-tag>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="doSubmit()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import SchoolService from '@/api/school/SchoolService'
  export default {
    data() {
      return {
        cid:'',
        dataListAllSelections: [], // 所有选中的数据包含跨页数据
        dataListSelections: [],
        idKey: 'school', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        dynamicTags: [],
        loading: false,
        visible: false,
        searchForm: {
          school: '',
          city: ''
        }
      }
    },
    props: {
      selectData: {
        type: Array,
        default: () => {
          return []
        }
      },
      limit: {
        type: Number,
        default: 999999
      }
    },
    components: {},
    schoolService: null,
    created() {
      this.schoolService = new SchoolService()
    },
    methods: {
      init(cid) {
        this.cid = cid;
        this.visible = true
        this.$nextTick(() => {
          this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData))
          this.resetSearch()
        })
      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
          this.$refs.schoolTable.clearCheckboxRow()
          return
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        this.$refs.schoolTable.clearCheckboxRow()
        for (var i = 0; i < this.dataList.length; i++) {
          if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.schoolTable.setCheckboxRow(this.dataList[i], true)
          }
        }
      },
      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let that = this
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.dataListAllSelections.length <= 0) {
          this.dataListSelections.forEach(row => {
            that.dataListAllSelections.push(row)
          })
          return
        }
        // 总选择里面的key集合
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        let selectIds = []
        // 获取当前页选中的id
        this.dataListSelections.forEach(row => {
          selectIds.push(row[idKey])
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.dataListAllSelections.push(row)
          }
        })
        let noSelectIds = []
        // 得到当前页没有选中的id
        this.dataList.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey])
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.dataListAllSelections.length; i++) {
              if (that.dataListAllSelections[i][idKey] === id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.dataListAllSelections.splice(i, 1)
                break
              }
            }
          }
        })
      },
      del(tag) {
        this.dataListAllSelections.splice(this.dataListAllSelections.indexOf(tag), 1)
        this.$nextTick(() => {
          this.setSelectRow()
        })
      },
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.$http({
          url: '/team/team/list',
          method: 'get',
          params: {
            cid:this.cid,
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'orders': this.tablePage.orders,
            ...this.searchForm
          }
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.loading = false
          this.$nextTick(() => {
            this.setSelectRow()
          })
        })
        // this.schoolService.page({
        //   'current': this.tablePage.currentPage,
        //   'size': this.tablePage.pageSize,
        //   'orders': this.tablePage.orders,
        //   ...this.searchForm
        // }).then(({
        //   data
        // }) => {
        //   this.dataList = data.records
        //   this.tablePage.total = data.total
        //   this.loading = false
        //   this.$nextTick(() => {
        //     this.setSelectRow()
        //   })
        // })
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
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 排序
      sortChangeHandle(column) {
        this.tablePage.orders = []
        if (column.order != null) {
          this.tablePage.orders.push({
            column: this.$utils.toLine(column.prop),
            asc: column.order === 'ascending'
          })
        }
        this.refreshList()
      },
      resetSearch() {
        this.refreshList()
      },
      doSubmit() {
        this.visible = false
        this.$emit('doSubmit', this.dataListAllSelections)
      },
      checkboxChange() {
        const selectRecords = this.$refs.schoolTable.getCheckboxRecords()
        this.selectionChangeHandle(selectRecords);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .school-table {
    flex: 1;
  }

  .org {
    height: 100%;

    .el-card__header {
      padding: 10px;
    }

    .el-card__body {
      padding: 10px;
      max-height: 520px;
      overflow: auto;
    }
  }

  .userDialog {
    .el-dialog__body {
      padding: 10px 0px 0px 10px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }

    .el-main {
      padding: 20px 20px 5px 20px;

      .el-pagination {
        margin-top: 5px;
      }
    }
  }
</style>
