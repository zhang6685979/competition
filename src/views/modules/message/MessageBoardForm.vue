<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="留言标题" prop="title"
                :rules="[
                  {required: true, message:'留言标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写留言标题"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="留言内容" prop="content"
                :rules="[
                  {required: true, message:'留言内容不能为空', trigger:'blur'}
                 ]">
          <el-input type="textarea" v-model="inputForm.content" placeholder="请填写留言内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="姓名" prop="name"
                :rules="[
                  {required: true, message:'姓名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写姓名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile"
                :rules="[
                  {required: true, message:'联系电话不能为空', trigger:'blur'},
                  {validator: validator.isMobile, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.mobile" placeholder="请填写联系电话"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email"
                :rules="[
                  {required: true, message:'电子邮箱不能为空', trigger:'blur'},
                  {validator: validator.isEmail, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.email" placeholder="请填写电子邮箱"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import MessageBoardService from '@/api/message/MessageBoardService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          title: '',
          content: '',
          name: '',
          mobile: '',
          email: ''
        }
      }
    },
    components: {
    },
    messageBoardService: null,
    created () {
      this.messageBoardService = new MessageBoardService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建留言`
        } else if (method === 'edit') {
          this.title = '修改留言'
        } else if (method === 'view') {
          this.title = '查看留言'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.messageBoardService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.messageBoardService.save(this.inputForm).then(({data}) => {
              this.visible = false
              this.$message.success(data)
              this.$emit('refreshDataList')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

  
