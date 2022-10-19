<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="module">
                <el-input size="small" v-model="searchForm.module" placeholder="赛项" clearable></el-input>
         </el-form-item>
         <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="姓名" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>

     <div class="bg-white top">
        <vxe-toolbar :refresh="{query: refreshList}" export custom>
          <template #buttons>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-upload
              class="upload"
              :action="`${$http.BASE_URL}/player/player/import`"
              :show-file-list="false"
              :data="{cid:cid}"
              :headers="{token: $cookie.get('token')}"
              :on-success="uploadSuccess"
              >
              <el-button slot="trigger" size="small" type="warning" icon="el-icon-upload">导入</el-button>
            </el-upload>
            <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.playerTable && $refs.playerTable.getCheckboxRecords().length === 0" plain>删除</el-button>
            <el-button type="text" size="small" icon="el-icon-download" @click="downloadFile('./static/template/导入选手模板.xlsx')">下载导入模板</el-button>
          </template>
        </vxe-toolbar>
        <div style="height: calc(100% - 80px);">
        <vxe-table
            border="inner"
            auto-resize
            resizable
            height="auto"
            :loading="loading"
            size="small"
            ref="playerTable"
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
        title="姓名">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
            </template>
      </vxe-column>
    <vxe-column
        field="idcardno"
        sortable
        title="身份证号">
      </vxe-column>
    <vxe-column
        field="sex"
        sortable
        title="性别">
      </vxe-column>
    <vxe-column
        field="mobile"
        sortable
        title="手机号">
      </vxe-column>
    <vxe-column
        field="email"
        sortable
        title="电子邮箱">
      </vxe-column>
    <vxe-column
        field="address"
        sortable
        title="地址">
      </vxe-column>
    <vxe-column
        field="school"
        sortable
        title="单位名称">
      </vxe-column>
    <vxe-column
        field="module"
        sortable
        title="赛项">
      </vxe-column>
      <vxe-column
          field="teamName"
          sortable
          title="赛队">
        </vxe-column>
        <vxe-column
            field="instructor"
            sortable
            title="指导老师">
          </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template  slot-scope="scope">
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
    <PlayerForm  ref="playerForm" :cid="cid" @refreshDataList="refreshList"></PlayerForm>
  </div>
</template>

<script>
  import PlayerForm from './PlayerForm'
  import PlayerService from '@/api/player/PlayerService'
  export default {
    props:{
      cid:String
    },
    data () {
      return {
        searchForm: {
          name:'',
          module: ''
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
      PlayerForm
    },
    playerService: null,
    created () {
      this.playerService = new PlayerService()
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.playerService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid':this.cid,
          ...this.searchForm
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
        this.$refs.playerForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.playerTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.playerForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.playerForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.playerTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.playerService.delete(ids).then(({data}) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      uploadSuccess(message){
        if(message.indexOf('成功')!=-1){
          this.refreshList();
          this.$message.success(message)
        }else{
          this.$message.warning(message)
        }
      },
      downloadFile(url) {
        var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
        const el = document.createElement('a');
        el.style.display = 'none';
        el.setAttribute('target', '_blank');
        /**
         * download的属性是HTML5新增的属性
         * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
         * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
         * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
         */
        fileName && el.setAttribute('download', fileName);
        el.href = url;
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
      }
    }
  }
</script>
<style scoped>
  .upload{margin:0 10px;}
</style>
