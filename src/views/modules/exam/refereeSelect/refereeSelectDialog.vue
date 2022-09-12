<template>
  <div>
    <el-dialog title="裁判选择" width="1000px" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag
      class="userDialog" :visible.sync="visible">
      <el-container style="height: 500px">

        <vxe-table class="referee-table" border="inner" auto-resize resizable height="500" :loading="loading" size="small" ref="refereeTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
          :data="dataList" :checkbox-config="{}" @checkbox-change="checkboxChange">
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
        </vxe-table>
        <el-aside width="200px">
          <el-tag :key="tag.id" v-for="tag in dataListAllSelections" closable :disable-transitions="false"
            @close="del(tag)">
            {{tag.name}}
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
  import RefereeForm from '@/views/modules/referee/RefereeForm'
  import CompetitionExamService from '@/api/exam/CompetitionExamService'
  export default {
    data() {
      return {
        searchForm: {
          loginName: '',
          companyDTO: {
            id: ''
          },
          officeDTO: {
            id: ''
          },
          name: ''
        },
        filterText: '',
        dataListAllSelections: [], // 所有选中的数据包含跨页数据
        dataListSelections: [],
        idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        dataList: [],
        dynamicTags: [],
        officeTreeData: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orders: [],
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
      cid:String
    },
    components: {
      RefereeForm
    },
    watch: {
      filterText(val) {
        this.$refs.officeTree.filter(val)
      }
    },
    competitionExamService: null,
    created () {
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
      renderContent(h, {
        node,
        data,
        store
      }) {
        return ( <
          span class = "custom-tree-node" > {
            data.type === '1' ? < i class = "fa fa-sitemap" > < /i> : <i class="fa fa-users"></i >
          } <
          span class = "text" > {
            node.label
          } < /span> < /
          span >
        )
      },
      getTemplateRow(index, row) { // 获取选中数据
        this.dataListSelections = [row]
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
          this.$refs.userTable.clearSelection()
          return
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        this.$refs.userTable.clearSelection()
        for (var i = 0; i < this.dataList.length; i++) {
          if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.userTable.toggleRowSelection(this.dataList[i], true)
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
      // 得到选中的所有数据
      getAllSelectionData() {
        // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
        this.changePageCoreRecordData()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
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
        this.competitionExamService.getRefereesByCid({cid:this.cid}).then(({
          data
        }) => {
          this.dataList = data
          this.loading = false
          this.$nextTick(() => {
            //this.setSelectRow()
          })
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageNo = val
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
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
        if (column.prop === 'officeDTO.name') {
          column.prop = 'o.name'
        }
        if (column.prop === 'companyDTO.name') {
          column.prop = 'c.name'
        }
        this.orders = []
        if (column.order != null) {
          this.orders.push({
            column: this.$utils.toLine(column.prop),
            asc: column.order === 'ascending'
          })
        }
        this.refreshList()
      },
      handleNodeClick(data) {
        if (data.type === '1') {
          this.searchForm.companyDTO.id = data.id
          this.searchForm.officeDTO.id = ''
        } else {
          this.searchForm.companyDTO.id = ''
          this.searchForm.officeDTO.id = data.id
        }
        this.refreshList()
      },
      resetSearch() {
        this.refreshList()
      },
      doSubmit() {
        if (this.limit < this.dataListAllSelections.length) {
          this.$message.error(`你最多只能选择${this.limit}个用户`)
          return
        }
        this.visible = false
        this.$emit('doSubmit', this.dataListAllSelections)
      },
      checkboxChange(){
        const selectRecords = this.$refs.refereeTable.getCheckboxRecords()
        this.selectionChangeHandle(selectRecords);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .referee-table{flex:1;}
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
