<template>
  <div class="page">
    <div class="bg-white top">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane :label="type==1?'用户通知模板':'裁判通知模板'" :name="type" :key="type" v-for="type in types">
          <el-form :model="inputForm" size="small" ref="inputForm" label-width="120px">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-form-item label="模板设置说明：">
                  <p class="no-margin">
                    消息通知内容中存在动态替换的内容，在模板配置时需要通过占位符的形式进行占位，系统提供的占位符如下：<br>
                    比赛名称：$competition$ 用户列表：$userlist$ 考试名称：$eaxm$ 裁判分配列表：$examlist$<br>
                    <font style="color: red;">注意：占位符为固定标识，不能进行修改，否则在邮件里将作为为本进行发送。</font>
                  </p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="模板标题" prop="title" :rules="[
                  {required: true, message:'标题不能为空', trigger:'blur'}
                 ]">
                  <el-input v-model="inputForm.title" placeholder="请填写标题" maxlength="250"></el-input>
                </el-form-item>
              </el-col>


              <el-col :span="24">
                <el-form-item label="模板内容" prop="content" :rules="[
                  {required: true, message:'模板内容不能为空', trigger:'blur'}
                 ]">
                  <tiny-mce v-model="inputForm.content" :config="{
          width: '100%',
          height: 200,
          menubar: false,
          language: 'zh_CN'
        }"></tiny-mce>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item>
                  <el-button size="small" type="primary" @click="doSubmit()" v-noMoreClick>保存
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import TinyMce from '@/components/editor/TinyMce'
  export default {
    data() {
      return {
        inputForm: {
          id: '',
          title: '',
          content: '',
          type: '1' //用户通知为1，裁判通知为2
        },
        activeName: '1',
        types: ['1', '2'], //用户通知为1，裁判通知为2
        templateList: []
      }
    },
    components: {
      TinyMce
    },
    watch: {
      activeName: function(newVal, oldVal) {
        if (newVal != oldVal) {
          var template = this.templateList.find(item => {
            return item.type == newVal
          })
          if (template) {
            this.inputForm = this.recover(this.inputForm, template)
          } else {
            this.inputForm = {
              id: '',
              title: '',
              content: '',
              type: newVal
            }
          }

        }
      }
    },
    activated() {
      this.getTemplateList();
    },
    methods: {
      getTemplateList() {
        this.$http({
          url: '/email/template/list',
          method: 'get'
        }).then(({
          data
        }) => {
          var template = data.find(item => {
            return item.type == this.activeName
          })
          this.templateList = data;
          if (template) {
            this.inputForm = this.recover(this.inputForm, template)
          }
        })
      },
      doSubmit() {
        this.$http({
          url: '/email/template',
          method: 'post',
          data: this.inputForm
        }).then(({
          data
        }) => {
          this.$message.success(data);
          this.getTemplateList()
        })
      }
    }
  }
</script>

<style lang="scss">
  .tabs {
    height: 100%;

    .el-tabs__content {
      overflow: auto !important;
    }
  }
</style>
