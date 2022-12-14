<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
      @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="title">
        <el-input size="small" v-model="searchForm.title" placeholder="新闻标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}">
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button type="success" size="small" icon="el-icon-chat-line-round" @click="publishToWechat()"
            :disabled="$refs.newsTable && $refs.newsTable.getCheckboxRecords().length === 0" plain>发布到公众号
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
            :disabled="$refs.newsTable && $refs.newsTable.getCheckboxRecords().length !== 1" plain>修改
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
            :disabled="$refs.newsTable && $refs.newsTable.getCheckboxRecords().length === 0" plain>删除
          </el-button>
        </template>
      </vxe-toolbar>
      <div style="height:calc(100% - 80px);">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="newsTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
          :data="dataList" :checkbox-config="{}">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column field="title" sortable title="新闻标题">
            <template slot-scope="scope">
              <span>{{scope.row.title}}</span>
              <el-tag size="mini" v-if="scope.row.top==1">置顶</el-tag>
            </template>
          </vxe-column>
          <vxe-column field="type" width="150" sortable title="新闻类别">
            <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("jab_new_type", scope.row.type, '-') }}
            </template>
          </vxe-column>
          <vxe-column field="image" width="150" title="新闻图片">
            <template slot-scope="scope" v-if="scope.row.image">
              <el-image style="height: 50px;width:50px;margin-right:10px;" :src="src"
                v-for="(src, index) in scope.row.image.split('|')" :key="index"
                :preview-src-list="scope.row.image.split('|')">
              </el-image>
            </template>
          </vxe-column>
          <vxe-column field="latest" sortable width="120" title="是否为最新">
            <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("yes_no", scope.row.latest, '-') }}
            </template>
          </vxe-column>
          <vxe-column field="describe0" sortable title="新闻描述">
          </vxe-column>
          <vxe-column field="times" title="浏览次数">
          </vxe-column>
          <vxe-column fixed="right" align="center" width="370" title="操作">
            <template slot-scope="scope">
              <el-button v-if="id" type="text" icon="el-icon-s-promotion" size="small"
                @click="publishToIndex(scope.row.id,scope.row.index0==1?0:1)">{{scope.row.index0==1?'取消首页显示':'首页显示'}}
              </el-button>
              <el-button type="text" icon="el-icon-upload2" size="small"
                @click="toTop(scope.row.id,scope.row.top==1?0:1)">{{scope.row.top==1?'取消置顶':'置顶'}}</el-button>
              <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
              <el-button type="text" icon="el-icon-chat-line-round" size="small" @click="publishToWechat(scope.row.id)">
                {{scope.row.published==1?'重新发布':'发布到公众号'}}</el-button>
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
    <NewsForm ref="newsForm" :id="id" @refreshDataList="refreshList"></NewsForm>
  </div>
</template>

<script>
  import NewsForm from './NewsForm'
  import NewsService from '@/api/news/NewsService'
  export default {
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        searchForm: {
          title: ''
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
      NewsForm
    },
    newsService: null,
    created() {
      this.newsService = new NewsService()
    },
    activated() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.newsService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid': this.id,
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
        this.$refs.newsForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.newsTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.newsForm.init('edit', id)
      },
      // 发布到首页显示
      publishToIndex(id, status) {
        this.$http({
          url: '/news/news/setindex',
          method: 'patch',
          params: {
            id: id,
            status: status
          }
        }).then(({
          data
        }) => {
          this.$message.success(data)
          this.refreshList()
        })
      },
      // 发布到微信公众号
      publishToWechat(id) {
        id = id || this.$refs.newsTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定发布?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/news/news/sendtomp',
            method: 'post',
            params: {
              ids: id
            }
          }).then(({
            data
          }) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
        
      },
      //置顶
      toTop(id, status) {
        this.$http({
          url: '/news/news/settop',
          method: 'patch',
          params: {
            id: id,
            status: status
          }
        }).then(({
          data
        }) => {
          this.$message.success(data);
          this.refreshList()
        })
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.newsTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.newsService.delete(ids).then(({
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
