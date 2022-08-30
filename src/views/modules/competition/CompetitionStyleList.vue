<template>
  <div class="page">
    <div class="top">
      <div class="el-scrollbar__wrap" style="height:calc(100% - 70px)">
        <div class="el-scrollbar__view">
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                <div class="jp-card jp-card-bordered">
                  <div class="add-border">
                    <a @click="add()">
                      <i class="el-icon-plus"></i>
                      <p>新建比赛风采</p>
                    </a>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in dataList" :key="index">
              <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                <img :src="item.image" class="image">
                <h3 class="jp-card-label">
                  <el-row>
                    <el-col :span="24">
                      <div class="top">
                        {{item.title}}
                      </div>
                      <p class="desc">{{item.describe0}}</p>
                    </el-col>
                  </el-row>
                </h3>

                <ul class="jp-card-actions">
                  <li style="width: 33.333%">
                    <el-link :underline="false" @click="edit(item.id)"><i class="el-icon-edit-outline"></i> 编辑
                    </el-link>
                  </li>
                  <li style="width: 33.333%">
                    <el-link :underline="false" @click="del(item.id)"><i class="el-icon-delete"></i> 删除</el-link>
                  </li>
                  <li style="width: 33.333%">
                    <el-link :underline="false" @click="view(item.id)"><i class="el-icon-view"></i> 查看</el-link>
                  </li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>`
      </div>
      <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
        :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="currentChangeHandle">
      </vxe-pager>

      <!-- 弹窗, 新增 / 修改 -->
      <CompetitionStyleForm ref="competitionStyleForm" :id="id" @refreshDataList="refreshList"></CompetitionStyleForm>
    </div>

  </div>
</template>

<script>
  import CompetitionStyleForm from './CompetitionStyleForm'
  import CompetitionStyleService from '@/api/competition/CompetitionStyleService'
  export default {
    props: {
      id: String
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
    components: {
      CompetitionStyleForm
    },
    competitionStyleService: null,
    created() {
      this.competitionStyleService = new CompetitionStyleService()
    },
    activated() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.competitionStyleService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid': this.id
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
        this.$refs.competitionStyleForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.competitionStyleTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.competitionStyleForm.init('edit', id)
      },
      // 查看
      view(id) {
        this.$refs.competitionStyleForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.competitionStyleTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.competitionStyleService.delete(ids).then(({
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
<style lang="less" scoped>
  .image {
    width: 100%;
    height: 156px;
    overflow: hidden;
  }

  .bottom {
    background-color: #f5f7fa;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 12px;
  }

  .jp-card {
    height: 276px;
  }

  .jp-card-label {

    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0;

    .top {
      line-height: 36px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #1890FF;
      white-space: nowrap;
      font-size: 12px;

      .label {
        margin-right: 10px;
        height: 24px;
        line-height: 24px;
      }
    }

    .desc {
      margin: 0 auto 10px;
      font-weight: normal;
      color: #303133;
      height: 32px;
      width: 100%;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size:13px;
    }

    .right {
      line-height: 38px;
      justify-content: center;
      text-decoration: none;
      float: right;
    }
  }
</style>
