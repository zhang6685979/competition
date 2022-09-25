<template>
  <div class="page">
    <div class="bg-white top">
     <el-upload
       class="upload"
       :action="`${$http.BASE_URL}/competition/competitionRounds/score/import`"
       :show-file-list="false"
       :data="{cid:cid,crid:crid,ceid:ceid}"
       :headers="{token: $cookie.get('token')}"
       :on-success="uploadSuccess"
       >
       <el-button slot="trigger" size="small" type="primary">导入成绩</el-button>
     </el-upload>
      <div >
        <vxe-table border="inner" auto-resize resizable height="400" :loading="loading" size="small"
          ref="competitionPlayerTable" show-header-overflow show-overflow highlight-hover-row :menu-config="{}"
          :print-config="{}" :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle"
          :sort-config="{remote:true}" :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column field="name" sortable title="姓名">
          </vxe-column>
          <vxe-column field="company" sortable title="单位">
          </vxe-column>
          <vxe-column field="idcardno" sortable title="身份证号">
          </vxe-column>
          <vxe-column field="score" sortable title="总成绩">
          </vxe-column>
          <vxe-column field="describe0" sortable title="成绩详情">
          </vxe-column>



        </vxe-table>
        <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
          :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle">
        </vxe-pager>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cid: String,
      crid: String,
      ceid:String,
    },
    data() {
      return {
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
    mounted() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.$http({
          url: '/competition/competitionRounds/score/list',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'orders': this.tablePage.orders,
            'cid': this.cid,
            'crid': this.crid
          }
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
      uploadSuccess(){
         this.refreshList();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .upload{margin-bottom:10px;}
</style>
