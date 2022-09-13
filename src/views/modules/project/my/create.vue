<template>
  <!-- 添加或修改单模板对话框 -->
  <el-dialog class="t-dialog t-dialog--top" title="新增问卷" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="问卷名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="封面图" prop="image">
        <imageUpload v-model="form.image" v-if="open"/>
      </el-form-item>

      <el-form-item label="问卷描述" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入问卷描述" />
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
</template>

<script>
  import {
    getFormTemplateTypeListRequest,
    createTemplateRequest
  } from '@/api/project/template'
  import {
    createFormRequest
  } from '@/api/project/form'
  import ImageUpload from '@/components/ImageUpload/index'
  export default {
    name: 'CreateProject',
    props: {
      formKey: {
        type: String,
        default: ''
      }
    },
    components: {
      imageUpload: ImageUpload
    },
    data() {
      return {
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
          name:'',
          image:'',
          description:''
        },
        // 表单校验
        rules: {
          image: [{
            required: true,
            message: '请上传封面图',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '问卷名称不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      handleOpen() {
        this.open = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
      },
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.key = this.formKey
            createFormRequest(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.open = false
              this.$router.push({
                path: '/form/index',
                query: {
                  key: res.data
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
