<template>
    <div class="page">
     <div class="bg-white top">
        <vxe-toolbar :refresh="{query: refreshList}" export custom>
          <template #buttons>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.competitionExamTable && $refs.competitionExamTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.competitionExamTable && $refs.competitionExamTable.getCheckboxRecords().length === 0" plain>删除</el-button>
          </template>
        </vxe-toolbar>
        <div style="height:500px">
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
        title="考试名称">
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
        width="300"
        title="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="importScore(scope.row.id)">查看成绩</el-button>
          <el-button type="text" icon="el-icon-user" size="small" @click="showDistribution(scope.row.id)">查看执裁分配</el-button>
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
    <CompetitionExamForm  ref="competitionExamForm" :cid="cid" :crid="crid" @refreshDataList="refreshList"></CompetitionExamForm>
    <el-dialog title="执裁分配表" :visible.sync="dialogVisible" :append-to-body="true" width="80%">
      <distributionTable @refreshList="(redo)=>{
        this.showDistribution(currId,redo)
      }" :list="distribution.distributed||[]" :surplusTeams="distribution.undistributedTeams||[]" :surplusReferees="distribution.undistributedReferees||[]" v-if="dialogVisible"></distributionTable>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        <el-button size="small" type="primary"  @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入成绩"
      :close-on-click-modal="false"
      :append-to-body="true"
       v-dialogDrag
      :visible.sync="visible"
      width="60%"
    >
      <CompetitionScoreList :cid="id" :crid="crid" :ceid="currId" v-if="visible"></CompetitionScoreList>
    </el-dialog>
  </div>
</template>

<script>
  import CompetitionExamForm from './CompetitionExamForm'
  import CompetitionExamService from '@/api/exam/CompetitionExamService'
  import distributionTable from './distributionTable'
  import CompetitionScoreList from './CompetitionScoreList'
  export default {
    props: {
      cid: String,
      crid: String,
    },
    data () {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false,
        dialogVisible:false,
        distribution:{},
        currId:'',
        visible:false
      }
    },
    components: {
      CompetitionExamForm,
      distributionTable,
      CompetitionScoreList
    },
    competitionExamService: null,
    created () {
      this.competitionExamService = new CompetitionExamService()
    },
    mounted () {
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
          'cid': this.cid,
          'crid': this.crid
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
      showDistribution(id,redo=false){
        this.currId = id;
        this.$http({
          url:'/exam/competitionExam/preview/distribute',
          method:'get',
          params:{id,redo}
        }).then(({data})=>{
          if(data.status){
            //不满足匹配条件的赛队和裁判
            var undistributedReferees = data.data.undistributedReferees||[];
            var undistributedTeams = data.data.undistributedTeams||[];
            var distributed = data.data.distributed;
            // if(undistributedReferees.length>0||undistributedTeams.length>0){
            //   distributed.push({
            //     code:'未匹配到考场的裁判和赛队',
            //     teams:undistributedTeams,
            //     refereees:undistributedReferees
            //   })
            // }
            this.distribution = data.data;
            this.dialogVisible = true;
          }else{
            this.$message.error(data.message)
          }

        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      doSubmit(){
        this.$http({
          url:'/exam/competitionExam/preview/distribute',
          method:'post',
          params:{id:this.currId},
          data:this.distribution
        }).then(({data})=>{
          this.$message.success(data);
          this.dialogVisible = false;
        })
      },
      // 导入成绩
      importScore(id) {
         this.currId = id;
         this.visible = true;
      },
    }
  }
</script>
