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
            <el-form-item label="公告标题" prop="title"
                :rules="[
                  {required: true, message:'公告标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.title" placeholder="请填写公告标题"  maxlength="250"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="公告内容" prop="content"
                :rules="[
                  {required: true, message:'公告内容不能为空', trigger:'blur'}
                 ]">
            <WangEditor ref="contentEditor" v-model="inputForm.content"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否最新" prop="latest"
                :rules="[
                  {required: true, message:'是否最新不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.latest" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否置顶" prop="top"
                :rules="[
                  {required: true, message:'是否置顶不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.top" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="公告描述" prop="describe0"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.describe0" placeholder="请填写公告描述"  maxlength="250"    ></el-input>
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
  import WangEditor from '@/components/editor/WangEditor'
  import AnnouncementService from '@/api/announcement/AnnouncementService'
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
          latest: '',
          top: '',
          describe0: ''
        }
      }
    },
    components: {
      WangEditor
    },
    announcementService: null,
    created () {
      this.announcementService = new AnnouncementService()
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建通知公告`
        } else if (method === 'edit') {
          this.title = '修改通知公告'
        } else if (method === 'view') {
          this.title = '查看通知公告'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$refs.contentEditor.init('')
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.announcementService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.$refs.contentEditor.init(this.inputForm.content)
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
            this.announcementService.save(this.inputForm).then(({data}) => {
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

  
