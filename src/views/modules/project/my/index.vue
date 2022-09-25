<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="queryParams"
      @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="queryParams.name" placeholder="请输入项目名称" type="text" />
      </el-form-item>
      <el-form-item label="项目状态">
        <el-select v-model="queryParams.status" clearable placeholder="请选择">
            <el-option
              v-for="status in projectStatusList"
              :key="status.code"
              :label="status.name"
              :value="status.code">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryProjectPage()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white" style="padding:0;">
      <div class="el-scrollbar__wrap" style="height: calc(100% - 110px);">
        <div class="el-scrollbar__view">
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                <div class="jp-card jp-card-bordered">
                  <div class="add-border">
                    <a @click="createFormHandle()">
                      <i class="el-icon-plus"></i>
                      <p>新建问卷</p>
                    </a>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in projectList" :key="index">
              <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
                <img class="image" :src="item.image?item.image:require('@/assets/images/99d0.png')">
                <div class="jp-card-label">
                  <p>{{item.name}}</p>
                  <el-tag size="small" :type="getStatusColorStyle(item.status).type">
                    {{getStatusColorStyle(item.status).name}}</el-tag>
                </div>
                <p class="create-time">创建时间：{{ item.createTime | formatDate }}</p>
                <ul class="jp-card-actions">
                  <li>
                    <el-link :underline="false" @click="toProjectHandle(item.key,'editor',item.name)"><i
                        class="el-icon-edit-outline"></i> 编辑
                    </el-link>
                  </li>
                  <li v-if="item.status!=1">
                    <el-link :underline="false" @click="toProjectHandle(item.key,'statistics',item.name)"><i
                        class="el-icon-data-analysis"></i> 统计</el-link>
                  </li>
                  <li v-if="item.status==2">
                    <el-link :underline="false" @click="stopProject(item.key)"><i class="el-icon-close"></i> 停止
                    </el-link>
                  </li>
                  <li v-if="item.status!=2">
                    <el-link :underline="false" @click="deleteProject(item.key)"><i class="el-icon-delete"></i> 删除
                    </el-link>
                  </li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>`
      </div>
      <vxe-pager background size="small" :current-page="queryParams.current" :page-size="queryParams.size"
        :total="total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="queryProjectPage">
      </vxe-pager>
    </div>
    <CreateForm ref="createForm"></CreateForm>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import {
    createFormRequest,
    deleteFormRequest,
    pageFormRequest,
    stopFormRequest
  } from '@/api/project/form'

  import CreateForm from './create'


  export default {
    name: 'MyProject',
    filters: {
      formatDate(time) {
        return dayjs(time).format('YYYY/MM/DD')
      }
    },
    components:{
      CreateForm
    },
    data() {
      return {
        dialogVisible: false,
        dataShowType: 'gird',
        total: 0,
        queryParams: {
          current: 1,
          size: 10,
          name: '',
          status: null
        },
        formData: {
          description: '',
          name: '问卷名称'
        },
        projectStatusList: [{
            code: 1,
            name: '未发布',
            type: 'primary'
          },
          {
            code: 2,
            name: '收集中',
            type: 'success'
          },
          {
            code: 3,
            name: '已结束',
            type: 'warning'
          }
        ],
        projectList: [],
        projectListLoading: true
      }
    },
    computed: {
      getStatusColorStyle() {
        return function(code) {
          let item = this.projectStatusList.find(item => item.code == code)
          return item;
        }
      }
    },
    activated() {
      this.queryProjectPage()
    },
    methods: {
      createFormHandle() {
        this.$refs.createForm.handleOpen()
      },
      switchDataShowTypeHandle(type) {
        this.dataShowType = type
      },
      toProjectHandle(key, type,title) {
        this.$router.push({
          path: `/form/index`,
          query: {
            key: key,
            type: type,
            title:title
          }
        })
      },
      deleteProject(key) {
        this.$confirm(`确定删除该项目吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFormRequest({
            'key': key
          }).then(res => {
            if (res.data) {
              this.msgSuccess('刪除成功')
              this.queryProjectPage()
            }
          })
        })
      },
      stopProject(key) {
        this.$confirm(`确定停止收集该项目吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopFormRequest({
            'key': key
          }).then(res => {
            if (res.data) {
              this.msgSuccess('停止成功')
              this.queryProjectPage()
            }
          })
        })
      },
      queryProjectPage() {
        pageFormRequest(
          this.queryParams
        ).then(res => {
          let {
            records,
            total,
            size
          } = res.data
          this.projectList = records
          this.total = total
          this.queryParams.size = size
          this.projectListLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    height: 254px;
    cursor: pointer;
  }

  .jp-card-actions {
    display: flex;

    li {
      flex: 1;
    }
  }

  .jp-card-label {

    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
      color: #1890FF;
      font-size: 14px;
      margin: 8px 0;
    }

  }

  .create-time {
    padding: 0 10px;
    font-weight: 400;
    color: #707070;
    line-height: 0px;
    font-size: 12px;
  }
</style>
