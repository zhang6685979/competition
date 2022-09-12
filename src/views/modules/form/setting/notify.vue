<template>
    <div class="project-setting-view ">
        <el-form ref="notifySettingForm" :model="notifySettingForm" :rules="settingRules">
            <p class="project-setting-title">
                通知设置
            </p>
            <div class="setting-item">
                <p class="label">
                    发邮件提醒我
                </p>
                <el-switch v-model="notifySettingForm.emailNotify" />
            </div>
            <el-form-item v-if="notifySettingForm.emailNotify" prop="newWriteNotifyEmail">
                <el-input v-model="notifySettingForm.newWriteNotifyEmail"
                          placeholder="多个邮箱用 ; 隔开"
                />
            </el-form-item>
            <div class="setting-item">
                <p class="label">
                    发微信提醒我
                </p>
                <el-switch v-model="notifySettingForm.wxNotify" />
            </div>
            <el-row v-if="notifySettingForm.newWriteNotifyWx" align="middle" type="flex">
                <el-col :offset="3" :span="5">
                    <p class="project-setting-sub-label">
                        提醒人：
                    </p>
                </el-col>
                <el-col :span="12">
                    <span v-for="(user,i) in subNotifyWxUserList" :key="i" class="sub-user-view">
                        <i class="el-icon-close sub-user-delete" @click="deleteSubNotifyUserHandle(i)" />
                        <el-avatar :src="user.headImgUrl" />
                    </span>
                </el-col>
            </el-row>
            <div class="submit-btn">
                <el-button type="primary" @click="saveSettingHandle">
                    保存设置
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import mixin from './mixin'
import {
    deleteWxNotifyUserRequest,
    getNotifySettingRequest,
    getWxNotifyQrcodeRequest,
    getWxNotifyUserRequest,
    saveNotifySettingRequest
} from '@/api/project/setting.js'

export default {
    name: 'NotifySetting',
    mixins: [mixin],
    data() {
        return {
            settingRules: {
                newWriteNotifyEmail: [
                    {
                        trigger: 'blur',
                        pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
                        message: '请输入正确发送的邮箱'
                    },
                    {required: true, message: '请输入正确发送的邮箱', trigger: 'blur'}
                ]
            },
            notifySettingForm: {
                emailNotify: false,
                newWriteNotifyEmail: null,
                wxNotify: false,
                newWriteNotifyWx: null
            },
            subNotifyWxUserList: [],
            subNotifyUserTimer: null
        }
    },
    mounted() {
        this.queryUserProjectSetting()
    },
    destroyed() {
        clearInterval(this.subNotifyUserTimer)
    },
    methods: {
        queryUserProjectSetting() {
            getNotifySettingRequest(this.formKey).then(res => {
                if (res.data) {
                    this.notifySettingForm = res.data
                    if (this.notifySettingForm.wxNotify) {
                        this.querySubNotifyWxUser(this.notifySettingForm.newWriteNotifyWx)
                    }
                }
            })
        },
        saveSettingHandle() {
            this.$refs['notifySettingForm'].validate(valid => {
                if (valid) {
                    this.notifySettingForm.formKey = this.formKey
                    saveNotifySettingRequest(this.notifySettingForm).then(() => {
                        this.msgSuccess('保存成功')
                        this.queryUserProjectSetting()
                    })
                } else {
                    return false
                }
            })
        },
        deleteSubNotifyUserHandle(i) {
            if (this.subNotifyWxUserList) {
                let openId = this.subNotifyWxUserList[i].openId
                let key = this.formKey
                deleteWxNotifyUserRequest(key, openId).then(res => {
                    this.subNotifyWxUserList.splice(i)
                    this.notifySettingForm.newWriteNotifyWx = this.subNotifyWxUserList.map(item => item.openId).join(';')
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "settting";

.sub-label-text {
  text-align: left;
}

.sub-user-view {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 60px;
  cursor: pointer;

  &:hover .sub-user-delete {
    display: block;
  }

  .sub-user-delete {
    position: absolute;
    right: -6px;
    background-color: red;
    color: white;
    border-radius: 50px;
    padding: 2px;
    font-size: 12px;
    height: 16px;
    width: 16px;
    font-weight: 500;
    line-height: 18px;
    display: none;
  }
}
</style>
