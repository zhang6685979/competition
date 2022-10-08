<template>
  <div>
    <el-dialog :title="title||'报名信息'" fullscreen :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">

      <el-tabs v-model="activeName">
        <el-tab-pane label="填报信息审批" name="first">
          <vxe-toolbar>
            <template #buttons>
              <el-button type="primary" size="small" icon="el-icon-check" @click="patchApproval()"
                :disabled="($refs.competitionSignupTable && ($refs.competitionSignupTable.getCheckboxRecords().length == 0))"
                plain>
                批量审批通过</el-button>
            </template>
          </vxe-toolbar>
          <vxe-table border="inner" auto-resize resizable height="450" :loading="loading" size="small"
            ref="competitionSignupTable" show-header-overflow show-overflow highlight-hover-row :menu-config="{}"
            :print-config="{}" :import-config="{}" :export-config="{}" :data="dataList"
            :checkbox-config="{checkMethod: checkMethod}">
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column type="checkbox" width="40px"></vxe-column>
            <vxe-column field="templateName" title="报名名称">
            </vxe-column>
            <vxe-column field="createTime" title="报名时间">
            </vxe-column>
            <vxe-column field="status" title="报名状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status==1">{{status[scope.row.status]}}</el-tag>
                <el-tag type="danger" v-if="scope.row.status==2">{{status[scope.row.status]}}</el-tag>
                <el-tag type="primary" v-if="scope.row.status==0">{{status[scope.row.status]}}</el-tag>
              </template>
            </vxe-column>
            <vxe-column fixed="right" align="center" width="300" title="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view" size="small" @click="approval(scope.row)">
                  {{scope.row.status==0?'审核':'查看填报详情'}}
                </el-button>
              </template>
            </vxe-column>
          </vxe-table>
          <vxe-pager background size="small" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
            :total="tablePage.total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
            @page-change="currentChangeHandle">
          </vxe-pager>
        </el-tab-pane>
        <el-tab-pane label="填报信息列表" name="second">
          <GenerateList :tid="tid" v-if="visible" :dataList="signupDataList" :title="title"></GenerateList>
        </el-tab-pane>
      </el-tabs>


    </el-dialog>
    <el-dialog :title="signupInfo.name" width="60%" :visible.sync="signFormVisible">
      <div class="signup-form">
        <div class="signup-info">
          <table>
            <tr>
              <td>报名时间：</td>
              <td>{{signupInfo.starttime}}--{{signupInfo.endtime}}</td>
            </tr>
            <tr>
              <td>报名说明:</td>
              <td>
                <pre>{{signupInfo.describe0}}</pre>
              </td>
            </tr>
          </table>
        </div>
        <fm-generate-form style="margin: 0 auto;" insite="true" :edit="false" :data="json" :value="{}" :remote="{}"
          ref="generateForm">
        </fm-generate-form>
        <el-form ref="form" :model="form" label-width="100px" :disabled="currItem.status==1">
          <el-form-item label="报名审批:">
            <el-radio-group v-model="form.status">
              <el-radio label="1">审批通过</el-radio>
              <el-radio label="2">审批不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="signFormVisible = false">关闭</el-button>
        <el-button v-if="currItem.status!=1" size="small" type="primary" @click="doSubmit()" v-noMoreClick>确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import GenerateList from './form/GenerateList.vue'
  export default {
    props: {
      cid: String
    },
    components: {
      GenerateList
    },
    data() {
      return {
        visible: false,
        activeName: 'first',
        tid: '', //报名模板id
        title: '', //报名表名称
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },
        loading: false,
        status: {
          0: '待审核',
          1: '报名成功',
          2: '审核不通过'
        },
        signFormVisible: false,
        signupInfo: {},
        json: {},
        currItem: {},
        form: {
          status: '1'
        }
      }
    },
    methods: {
      init(id, title) {
        this.visible = true
        this.loading = false
        this.tid = id;
        this.title = title;
        this.$nextTick(() => {
          this.getList()
        })
      },
      getList() {
        this.loading = true
        this.$http({
          url: '/competition/competitionSignup/forminput/list',
          method: 'GET',
          params: {
            cid: this.cid,
            tid: this.tid,
            current: this.tablePage.currentPage,
            size: this.tablePage.pageSize
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
        this.init(this.tid);
      },
      approval(item) {
        this.currItem = item;
        this.$http({
          url: '/competition/competitionSignup/queryById',
          method: 'get',
          params: {
            id: item.tid
          }
        }).then(({
          data
        }) => {
          this.signFormVisible = true;
          this.signupInfo = data;
          this.json = JSON.parse(data.content);
          this.form.status = item.status == 0 ? '1' : item.status; //默认选择审批通过
          this.$nextTick(() => {
            var formData = item.content;
            if (formData) {
              const $form = this.$refs.generateForm
              formData = JSON.parse(formData);
              $form.setData(formData);
            }
          })
        })
      },
      // 审批接口
      doSubmit() {
        this.$http({
          url: '/competition/competitionSignup/forminput/audit',
          method: 'patch',
          params: {
            id: this.currItem.id,
            status: this.form.status
          }
        }).then(({
          data
        }) => {
          this.$message.info(data)
          this.signFormVisible = false;
          this.init(this.tid); //刷新列表
        })
      },
      patchApproval() {
        var records = this.$refs.competitionSignupTable.getCheckboxRecords()
        var ids = '';
        if (records && records.length > 0) {
          ids = records.map(record => record.id).join(',')
        } else {
          this.$message.warning('请选择要审批的记录')
          return false;
        }
        this.$http({
          url: '/competition/competitionSignup/forminput/batch/audit',
          method: 'patch',
          params: {
            ids: ids,
            status: 1
          }
        }).then(({
          data
        }) => {
          this.getList(); //刷新列表
        })
      },
      checkMethod({
        row
      }) {
        return row.status != 1;
      }
    },
    computed: {
      signupDataList: function() {
        var dataList = [];
        this.dataList.map(item => {
          var content = item.content;
          if (content) {
            content = JSON.parse(content);
            var obj = {id:item.id},
              isSubForm = false;
            for (var key in content) {
              if (content.hasOwnProperty(key)) {
                var value = content[key]
                var type = typeof value
                if (type == 'string' || type == 'number') {
                  obj[key] = value
                } else if (value instanceof Array) {
                  if (typeof value[0] == 'object') {
                    value.forEach(data=>{;
                      data.groupId = item.id;
                    })
                    dataList = dataList.concat(value)
                    isSubForm = true; //如果包含子表单以子表单数据为准
                  }
                } else {
                  obj[key] = value
                }
              }
            }
            obj.createTime = item.createTime;
            if (isSubForm) {
              dataList.filter(data=>{return data.groupId==obj.id}).forEach(item => {
                Object.assign(item, obj);
              })
            } else {
              dataList.push(obj);
            }
          }

        });
        console.log(dataList);
        return dataList
      }
    }
  }
</script>
<style lang="scss">
  .signup-form {
    h5 {
      font-size: 32px;
      margin: 20px 0;
      text-align: center;
    }

    .signup-info {
      background: rgb(230 162 60 / 10%);
      padding: 30px;
      font-size: 16px;
      color: #303133;
      margin-bottom: 20px;

      table {
        td {
          vertical-align: top;
          padding: 5px 0;

          pre {
            margin: 0
          }
        }
      }

      p {
        margin: 10px 0;
      }
    }
  }
</style>
