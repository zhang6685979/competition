<template>
  <div>
    <el-dialog title="赛队选择" width="1000px" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag
      class="userDialog" :visible.sync="visible">
      <el-container style="height: 500px">
        <div class="team-table">
          <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
                <!-- 搜索框-->
             <el-form-item prop="module" label="赛队名称">
                    <el-input size="small" v-model="searchForm.module" placeholder="请输入赛队名称" clearable></el-input>
             </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
                <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
              </el-form-item>
          </el-form>
          <vxe-table border="inner" auto-resize resizable height="400" :loading="loading" size="small" ref="teamTable"
            show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
            :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
            :data="dataList" :checkbox-config="{}" @checkbox-change="checkboxChange"  @checkbox-all="checkboxChange"
            :tree-config="{transform: true, rowField: 'id', parentField: 'pid'}">
            <vxe-column type="checkbox" width="40px"></vxe-column>

            <vxe-column field="name" tree-node title="团队名称">
            </vxe-column>
          </vxe-table>
        </div>
        <el-aside width="300px">
          <el-tag :key="tag.id" class="el-tag" v-for="tag in dataListAllSelections" closable :disable-transitions="false"
            @close="del(tag)">
            {{tag.school+'-'+tag.module+'-'+tag.teamName}}
          </el-tag>
        </el-aside>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="doSubmit()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import CompetitionExamService from '@/api/exam/CompetitionExamService'
  export default {
    data() {
      return {
        dataListAllSelections: [], // 所有选中的数据包含跨页数据
        dataListSelections: [],
        idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        searchForm:{
          module:''
        },
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 1,
          orders: []
        },
        dynamicTags: [],
        loading: false,
        visible: false
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
      },
      cid: String,
      crid: String
    },
    competitionExamService: null,
    created() {
      this.competitionExamService = new CompetitionExamService()
    },
    methods: {
      init() {
        this.visible = true
        this.$nextTick(() => {
          this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData))
          this.resetSearch()
        })
      },
      flat(arr) {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) { //childrens存在
            newArr.push(...this.flat(arr[i].children));
            delete arr[i].children;
          }
          newArr.push({
            ...arr[i]
          });
        }
        return newArr;
      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
          this.$refs.teamTable.clearCheckboxRow()
          return
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        this.$refs.teamTable.clearCheckboxRow()
        for (var i = 0; i < this.dataList.length; i++) {
          if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.teamTable.setCheckboxRow(this.dataList[i], true)
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
        this.competitionExamService.getTeamsByCid({
          'cid': this.cid,
          'crid': this.crid,
          ...this.searchForm
        }).then(({
          data
        }) => {
          this.dataList = this.flat(data)
          // this.tablePage.total = data.total
          this.loading = false
          this.$nextTick(() => {
            this.setSelectRow()
          })
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
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      doSubmit() {
        this.visible = false
        this.$emit('doSubmit', this.dataListAllSelections)
      },
      checkboxChange() {
        const selectRecords = this.$refs.teamTable.getCheckboxRecords();
        var records = selectRecords.filter(record => {
          return record.leaf == true
        });
        this.selectionChangeHandle(records);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .team-table {
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
    .el-tag{
      margin-left: 5px!important;
      margin-bottom: 5px!important;
    }

    .el-main {
      padding: 20px 20px 5px 20px;

      .el-pagination {
        margin-top: 5px;
      }
    }
  }
</style>
