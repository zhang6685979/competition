<template>
      <div class="page">
        <div class="bg-white top">
        <div class="header">
          <div class="use-btn pull-right">
              <el-button type="primary" @click="createProjectByTemplate">
                  使用该模板
              </el-button>
          </div>
            <el-page-header content="模板详情" @back="$router.back(-1)" />
            <el-divider></el-divider>
        </div>
        <div class="template-preview-content">
            <el-scrollbar class="template-scrollbar">
                <biz-project-form
                    v-if="formConfig.formKey"
                    :form-config="formConfig"
                    @submit="submitForm"
                />
            </el-scrollbar>

        </div>
    </div>
   </div>
</template>

<script>
import { BizProjectForm } from '@/components/tduck-form/TduckForm.common'
import '@/components/tduck-form/TduckForm.css'
import { useTemplateCreateFormRequest } from '@/api/project/template'
import mixin from '../../form/TduckFormMixin'

export default {
    name: 'TemplatePreview',
    components: {
        BizProjectForm
    },
    mixins: [mixin],
    props: {},
    data() {
        return {
            createProjectLoading: false,
            formConfig: {
                formKey: '',
                preview: false,
                formKind: 2,
                showBtns: true
            }
        }
    },
    watch:{
      '$route.query.key':function(newVal){
        this.formConfig.formKey = '';
        this.$nextTick(()=>{
          this.formConfig.formKey = newVal
        })
      }
    },
    mounted() {
        this.formConfig.formKey = this.$route.query.key
    },
    methods: {
        createProjectByTemplate() {
            this.createProjectLoading = true
            useTemplateCreateFormRequest({ key: this.formConfig.formKey })
                .then(res => {
                    this.createProjectLoading = false
                    if (res.data) {
                        this.$router.push({
                            path: '/form/index',
                            query: { key: res.data, type: 'editor' }
                        })
                    }
                })
                .catch(() => {
                    this.createProjectLoading = false
                })
        },
        submitForm() {}
    }
}
</script>

<style lang="scss" scoped>
.template-preview-container {
    width: 100%;
    height: 100%;
}

.template-scrollbar {
    height: calc(100% - 64px);
}
.template-preview-content {
    position: relative;
    height:100%;
    .use-btn {
        position: absolute;
        top: 50px;
        right: 180px;
    }
}
::v-deep .support-text{
  display: none;
}
</style>
