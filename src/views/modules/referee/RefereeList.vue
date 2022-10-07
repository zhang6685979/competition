<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
      @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="name">
        <el-input size="small" v-model="searchForm.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="participate0">
        <el-select v-model="searchForm.participate0" placeholder="请选择参与方式" size="small" style="width: 100%;" clearable>
          <el-option v-for="item in ['线上参会', '线下参会']" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}" export print custom>
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-upload class="upload" :action="`${$http.BASE_URL}/referee/referee/import`" :show-file-list="false"
            :data="{cid:cid}" :headers="{token: $cookie.get('token')}" :on-success="uploadSuccess">
            <el-button slot="trigger" size="small" type="warning" icon="el-icon-upload">导入</el-button>
          </el-upload>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
            :disabled="$refs.refereeTable && $refs.refereeTable.getCheckboxRecords().length === 0" plain>删除</el-button>
          <el-button type="text" size="small" icon="el-icon-download" @click="downloadFile('./static/template/导入裁判模板.xlsx')">下载导入模板</el-button>
        </template>
      </vxe-toolbar>
      <div style="height: calc(100% - 80px);">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="refereeTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" @sort-change="sortChangeHandle" :sort-config="{remote:true}"
          :data="dataList" :checkbox-config="{}">
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
          <vxe-column fixed="right" align="center" width="230" title="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="setting(scope.row)">设置制裁规则</el-button>
              <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <RefereeForm ref="refereeForm" :cid="cid" @refreshDataList="refreshList"></RefereeForm>
    <el-dialog title="设置执裁规则" :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="裁判姓名:" style="margin-bottom:0;">
              {{currItem.name}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择规则:">
              <el-checkbox label="是否能执裁本人所在院校" true-label="1" false-label="0" v-model="inputForm.selfSchool"></el-checkbox>
              <el-checkbox label="是否能执裁所在单位省份院校" true-label="1" false-label="0" v-model="inputForm.selfCity"></el-checkbox>
              <div>
                <el-checkbox label="指定不能监控院校" true-label="1" false-label="0" v-model="inputForm.specificSchool">
                </el-checkbox>
                <school-select :disabled="inputForm.specificSchool==0" :cid="cid" v-model="inputForm.specificSchoolList"></school-select>
              </div>

            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" type="primary" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import RefereeForm from './RefereeForm'
  import RefereeService from '@/api/referee/RefereeService'
  import schoolSelect from './schoolSelect'
  export default {
    props: {
      cid: String
    },
    data() {
      return {
        searchForm: {
          name: '',
          participate0: '',
        },
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false,
        visible: false,
        inputForm: {
          selfSchool: '0',
          selfCity: '0',
          specificSchool: '0',
          specificSchoolList: ''
        },
        currItem: {}
      }
    },
    components: {
      RefereeForm,
      schoolSelect
    },
    refereeService: null,
    created() {
      this.refereeService = new RefereeService()
    },
    mounted() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.refereeService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          'cid': this.cid,
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
        this.$refs.refereeForm.init('add', '')
      },
      // 修改
      edit(id) {
        id = id || this.$refs.refereeTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.refereeForm.init('edit', id)
      },
      // 查看
      view(id) {
        this.$refs.refereeForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.$refs.refereeTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.refereeService.delete(ids).then(({
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
      },
      uploadSuccess() {
        this.$message.success('导入成功!');
        this.refreshList()
      },
      setting(currItem) {
        this.currItem = Object.assign({}, currItem);
        this.visible = true;
        this.$nextTick(()=>{
          this.loading = true;
          this.$refs.inputForm.resetFields()
          this.$http({
            url: '/referee/referee/setting',
            method: 'get',
            params: {
              id: currItem.id
            }
          }).then(({
            data
          }) => {
            this.loading = false;
            if(data){
              this.inputForm = this.recover(this.inputForm, data)
            }else{
              this.inputForm = {
                selfSchool: '0',
                selfCity: '0',
                specificSchool: '0',
                specificSchoolList: ''
              }
            }
          })
        })
      },
      doSubmit() {
        this.loading = true
        this.inputForm.id = this.currItem.id;
        this.$http({
          url: '/referee/referee/setting',
          method: 'POST',
          params: this.inputForm
        }).then(({
          data
        }) => {
          this.visible = false
          this.$message.success(data)
          this.refreshList()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
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
  .upload {
    margin: 0 10px;
  }
</style>
