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
     <el-button type="text" size="small" icon="el-icon-download" @click="downloadFile('./static/template/导入成绩模板.xlsx')">下载导入模板</el-button>
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
            'crid': this.crid,
            'ceid':this.ceid
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
<style lang="scss" scoped>
  .upload{margin-bottom:10px;display: inline-block;margin-right: 15px;}
</style>
