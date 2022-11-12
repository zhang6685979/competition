<template>
  <el-dialog title="投票结果" :visible.sync="visible" custom-class="my-dialog" :append-to-body="true">
    <div class="page">
      <div class="bg-white top">
        <el-tabs v-model="activeName">
          <el-tab-pane label="投票统计" name="first">
            <vxe-toolbar :refresh="{query: getResult}">
              <template #buttons>
                <el-button type="primary" size="small" icon="el-icon-download" @click="exportExcel('result','投票统计.xls')">导出</el-button>
              </template>
            </vxe-toolbar>
            <div style="height: 400px;">
              <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small"
                ref="voteOptionTable" show-header-overflow show-overflow highlight-hover-row :export-config="{filename: '投票统计.xls',
                type: 'xls'}" :data="dataList">
                <vxe-column field="sid" sortable title="编号">
                  <template slot-scope="scope">
                    {{scope.row.sid}}号
                  </template>
                </vxe-column>
                <vxe-column type="seq" title="名次"></vxe-column>
                <vxe-column field="name" sortable title="选项名称">
                </vxe-column>
                <vxe-column field="image" sortable title="选项图片">
                  <template slot-scope="scope" v-if="scope.row.image">
                    <el-image style="height: 50px;width:50px;margin-right:10px;" :src="src"
                      v-for="(src, index) in scope.row.image.split('|')" :key="index"
                      :preview-src-list="scope.row.image.split('|')">
                    </el-image>
                  </template>
                </vxe-column>
                <vxe-column field="votes" sortable title="票数">
                  <template slot-scope="scope">
                    {{scope.row.votes}}票({{scope.row.percent}}%)
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="投票明细" name="second">
            <vxe-toolbar :refresh="{query: getRecords}">
              <template #buttons>
                <el-button type="primary" size="small" icon="el-icon-download" @click="exportExcel('details','投票明细')">导出</el-button>
              </template>
            </vxe-toolbar>
            <div style="height: 400px;">
              <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small"
                ref="voteOptionTable" show-header-overflow show-overflow highlight-hover-row :export-config="{filename: '投票明细',
                type: 'xls'}" :data="recordList">
                <vxe-column field="optionName" title="选项名称">
                </vxe-column>
                <vxe-column field="image" title="选项图片">
                  <template slot-scope="scope" v-if="scope.row.optionImage">
                    <el-image style="height: 50px;width:50px;margin-right:10px;" :src="scope.row.optionImage"
                      :preview-src-list="scope.row.optionImage.split('|')">
                    </el-image>
                  </template>
                </vxe-column>
                <vxe-column field="personId" title="投票ip">
                </vxe-column>
                <vxe-column field="created" sortable title="投票时间">
                </vxe-column>
                <vxe-column field="equiment" sortable title="数据来源">
                </vxe-column>
              </vxe-table>
            </div>
            <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
              :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
              :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
              @page-change="currentChangeHandle">
            </vxe-pager>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
  </el-dialog>

</template>

<script>
  export default {
    data() {
      return {
        id: '',
        searchForm: {
          subject: ''
        },
        dataList: [],
        loading: false,
        visible: false,
        activeName: 'first',
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        recordList: []
      }
    },
    methods: {
      init(id) {
        this.id = id;
        this.getResult();
        this.getRecords();
      },
      getResult() {
        var id = this.id;
        this.loading = true;
        this.sumVotes = 0;
        this.$http({
          url: '/vote/voteSubject/result',
          method: 'get',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.loading = false;
          this.dataList = data;
          this.visible = true;
        })
      },
      // 当前页
      currentChangeHandle({
        currentPage,
        pageSize
      }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.getRecords()
      },
      //获取明细数据
      getRecords() {
        var id = this.id;
        this.loading = true;
        this.$http({
          url: '/vote/voteSubject/public/records',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'id': id
          }
        }).then(({
          data
        }) => {
          this.loading = false;
          this.recordList = data.records
          this.tablePage.total = data.total
        })
      },
      exportExcel(type,fileName) {
        this.$http({
          url: `/vote/voteSubject/export-${type}`,
          method: 'get',
          params: {id:this.id},
          responseType: 'blob'
        }).then(({data}) => {
             // 将二进制流文件写入excel表，以下为重要步骤
          this.$utils.downloadExcel(data, fileName)
        }).catch(function (err) {
          if (err.response) {
            console.log(err.response)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .my-dialog .el-dialog__body {
    padding: 0;
  }
</style>
