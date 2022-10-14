<template>

  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="queryParams"
      @keyup.enter.native="getList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetQuery()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: getList}">
        <template #buttons>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">新建</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="handleUpdate()" :disabled="single"
            plain>修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete()" :disabled="multiple" plain>删除
          </el-button>
        </template>
      </vxe-toolbar>
      <div style="height: 500px;">
        <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small" ref="categoryTable"
          show-header-overflow show-overflow highlight-hover-row :menu-config="{}" :print-config="{}"
          :import-config="{}" :export-config="{}" :data="categoryList" :checkbox-config="{}" @checkbox-change="handleSelectionChange"  @checkbox-all="handleSelectionChange">
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column field="name" align="center" title="分类名称">
          </vxe-column>
          <vxe-column field="sort" align="center" title="排序">
          </vxe-column>
          <vxe-column fixed="right" align="center" width="200" title="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager background size="small" :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
          :total="total" :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="getList">
        </vxe-pager>
      </div>
    </div>
    <!-- 添加或修改项目模板分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button @click="cancel">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCategory,
    delCategory,
    getCategory,
    listCategory,
    updateCategory
  } from '@/api/project/template'

  export default {
    name: 'Category',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 项目模板分类表格数据
        categoryList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          sort: null
        },
        // 表单参数
        form: {
          name: '',
          sort: ''
        },
        // 表单校验
        rules: {
          name: [{
            required: true,
            message: '分类名称不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询项目模板分类列表 */
      getList() {
        this.loading = true
        listCategory(this.queryParams).then(response => {
          this.categoryList = response.data.records
          this.total = response.data.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          name: null,
          sort: null,
          updateTime: null,
          createTime: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      resetForm(form) {
        this.$refs[form].resetFields();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('searchForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange() {
        const selection = this.$refs.categoryTable.getCheckboxRecords();
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.open = true;
        this.$nextTick(() => {
          this.reset()
          this.title = '添加项目模板分类'
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row?row.id:this.ids
        getCategory(id).then(response => {
          this.open = true;
          this.$nextTick(() => {
            this.reset();
            this.form = response.data
            this.title = '修改项目模板分类'
          })

        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateCategory(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addCategory(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row?row.id:this.ids
        this.$confirm('是否确认删除该数据项？').then(function() {
          return delCategory(id)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(() => {})
      }
    }
  }
</script>
