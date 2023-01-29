<template>
  <div class="write-container">
    <div v-if="writeStatus==0" v-cloak>
      <el-result icon="error" :title="writeNotStartPrompt" :sub-title="subTitle" />
    </div>
    <div v-if="writeStatus==1" class="form-container">
      <biz-project-form v-if="formConfig.formKey" :form-config="formConfig" @submit="submitForm" />
    </div>
    <div v-if="writeStatus==2" v-cloak class="title-icon-view">
      <el-result icon="success" :title="userFormSetting.promptText?userFormSetting.promptTextContent:'提交成功！'" />
      <div style="text-align: center">
        <el-image v-if="userFormSetting.promptImg" :src="userFormSetting.promptImgUrl" fit="cover" />
        <!--                <el-button v-if="userFormSetting.publicResult" type="primary" @click="openPublicResultHandle">-->
        <!--                    查看数据-->
        <!--                </el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {
    BizProjectForm
  } from '@/components/tduck-form/TduckForm.common'
  import '@/components/tduck-form/TduckForm.css'
  import {
    getQueryString
  } from '@/utils'
  import constants from '@/utils/constants'
  import _ from 'lodash'
  import mixin from '../TduckFormMixin'
  import {
    createPublicFormResultRequest,
    viewFormResultRequest
  } from '@/api/project/data'
  import {
    getShareSettingRequest,
    getSubmitSettingRequest,
    getWriteSettingRequest,
    getWriteSettingStatusRequest
  } from '@/api/project/setting'

  const uaParser = require('ua-parser-js')
  const ua = uaParser(navigator.userAgent)

  export default {
    name: 'WriteView',
    components: {
      BizProjectForm
    },
    mixins: [mixin],
    props: {},
    data() {
      return {
        formConfig: {
          formKey: '',
          preview: false,
          showBtns: true
        },
        writeStatus: 1,
        // 不允许填写的提示信息
        writeNotStartPrompt: '',
        userFormSetting: {},
      }
    },
    async created() {
      let key = this.$route.query.key || this.$route.params.key
      this.formConfig.formKey = key
      // 检查是否能进入填写
      this.queryProjectSettingStatus()
      this.queryProjectSetting()
    },
    mounted() {
      viewFormResultRequest(this.formConfig.formKey).then(() => {})
    },
    methods: {
      queryProjectSettingStatus() {
        // 是否能进入填写
        getWriteSettingStatusRequest({
          formKey: this.formConfig.formKey,
          wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : ''
        }).then(res => {
          if (res.msg) {
            this.writeNotStartPrompt = res.msg
            this.writeStatus = 0
          }
        })
      },
      queryProjectSetting() {
        // 提交设置
        getSubmitSettingRequest(this.formConfig.formKey).then(res => {
          if (res.data) {
            this.userFormSetting = this.userFormSetting ? _.assign(this.userFormSetting, res.data) : res.data
          }
        })
        // 填写设置
        getWriteSettingRequest(this.formConfig.formKey).then(res => {
          if (res.data) {
            this.userFormSetting = this.userFormSetting ? _.assign(this.userFormSetting, res.data) : res.data
          }
        })

      },
      openPublicResultHandle() {
        let formKey = this.formConfig.formKey
        this.$router.replace({
          path: '/project/public/result',
          query: {
            formKey
          }
        })
      },
      submitForm(data) {
        createPublicFormResultRequest({
          'formKey': this.formConfig.formKey,
          'submitOs': ua.os.name,
          'submitBrowser': ua.browser.name,
          'submitUa': ua,
          'wxUserInfo': this.wxUserInfo,
          'wxOpenId': this.wxUserInfo ? this.wxUserInfo.openid : '',
          'originalData': data.formModel
        }).then(() => {
          this.writeStatus = 2
          if (this.userFormSetting.submitJump) {
            setTimeout(() => {
              window.location.replace(this.userFormSetting.submitJumpUrl)
            }, 1000)
          }

        })
      }
    },
    computed: {
      subTitle() {
        if(this.userFormSetting.everyoneWriteOnce){
          return '每人限制填写1次'
        }else if(this.userFormSetting.everyoneDayWriteOnce){
          return '每人每天限制填写1次'
        }
        return ''
      }
    },
  }
</script>

<style lang="scss" scoped>
  // .write-container {
  //   margin: 0;
  //   padding: 0;
  //   height: 100%;
  //   width: 100%;
  //   overflow-x: hidden;
  // }

  .title-icon-view {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .form-container {
    height: 100%;
  }

  .icon-view {
    width: 59px;
    height: 59px;
    border-radius: 100px;
    background-color: #0076ff;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }

  .success-icon {
    text-align: center;
    color: white;
    font-size: 30px;
  }
</style>
