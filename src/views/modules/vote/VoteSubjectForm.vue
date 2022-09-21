<template>
  <div class="page">
    <div class="bg-white top">
      <div class="pull-right">
        <el-button type="primary" size="medium" @click="doSubmit">
          确定
        </el-button>
      </div>
      <el-page-header @back="goBack" content="添加投票" class="page-header"></el-page-header>
      <el-divider></el-divider>
      <el-row :gutter="20" class="scroll-wrapper">
        <el-col :span="10">
          <div class="preview-layer">
            <div class="preview-bg" />
            <div class="preview-phone">
              <iframe id="preview-html" :src="mobilePreviewUrl" class="preview-html" frameborder="0" name="preview-html"
                scrolling="auto" />
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" label-width="120px">
            <el-form-item label="标题" prop="title" :rules="[
                           {required: true, message:'标题不能为空', trigger:'blur'}
                          ]">
              <el-input v-model="inputForm.title" placeholder="简短的标题"></el-input>
            </el-form-item>
            <el-form-item label="投票分类" prop="type" :rules="[
                           {required: true, message:'投票分类不能为空', trigger:'change'}
                         ]">
              <SelectTree ref="type" :props="{
                                  value: 'id',             // ID字段名
                                  label: 'name',         // 显示名称
                                  children: 'children'    // 子级字段名
                                }" url="/vote/voteCategory/treeData" :value="inputForm.type" :clearable="true"
                :accordion="true" @getValue="(value) => {inputForm.type=value}" />
            </el-form-item>

            <el-form-item label="封面图片" prop="image" :rules="[
                           {required: true, message:'封面图片不能为空', trigger:'blur'}
                          ]">
              <el-upload ref="image" list-type="picture-card"
                :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/vote/voteSubject`"
                :headers="{token: $cookie.get('token')}" :on-preview="(file, fileList) => {
                                 $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                                   dangerouslyUseHTMLString: true,
                                   showConfirmButton: false,
                                   closeOnClickModal: true,
                                   customClass: 'showPic'
                                 });
                             }" :on-success="(response, file, fileList) => {
                                inputForm.image = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                             }" :on-remove="(file, fileList) => {
                               $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                                 $message.success(data)
                               })
                               inputForm.image = fileList.map(item => item.url).join('|')
                             }" :before-remove="(file, fileList) => {
                               return $confirm(`确定移除 ${file.name}？`)
                             }" multiple :limit="5" :on-exceed="(files, fileList) =>{
                               $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                             }" :file-list="imageArra">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="开始时间" prop="starttime" :rules="[
                              {required: true, message:'开始时间不能为空', trigger:'blur'}
                             ]">
              <el-date-picker style="width: 100%;" v-model="inputForm.starttime" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endtime" :rules="[
                              {required: true, message:'结束时间不能为空', trigger:'blur'}
                             ]">
              <el-date-picker style="width: 100%;" v-model="inputForm.endtime" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="主题色" prop="themeColor">
              <div class="theme-setting">
                <div class="theme-form"
                  :style="{'background-image': `linear-gradient(${themeList[inputForm.themeColor].color1}, ${themeList[inputForm.themeColor].color2})`}" @click="showThemeSelect=!showThemeSelect">
                </div>
                <div class="theme-list" v-show="showThemeSelect">
                  <div class="item" v-for="(item,index) in themeList" :key="index" @click="inputForm.themeColor=index;showThemeSelect=false">
                    <div class="item-inner"
                      :style="{'background-image': `linear-gradient(${item.color1}, ${item.color2})`}"><span
                        v-if="inputForm.themeColor==index" class="el-icon-check"></span></div>
                  </div>
                </div>
              </div>

            </el-form-item>
            <el-form-item label="投票模式" prop="mode" :rules="[
                              {required: true, message:'请选择投票模式', trigger:'change'}
                             ]">
              <el-radio-group v-model="inputForm.mode">
                <el-radio :label="1">全程可投</el-radio>
                <el-radio :label="2">每日可投</el-radio>
              </el-radio-group>
              <el-input v-model="inputForm.maxTimes" class="times-setting" placeholder="填写票数"></el-input>
            </el-form-item>
            <el-form-item label="投票简介" prop="describe0" :rules="[
                              {required: true, message:'投票简介不能为空', trigger:'blur'}
                             ]">

              <tiny-mce v-model="inputForm.describe0" :config="editorConfig"></tiny-mce>
            </el-form-item>

            <!-- <el-form-item label="投票选项配置" prop="optionConfig">
              <el-radio-group v-model="inputForm.optionConfig">
                <el-radio :label="1">文字模式</el-radio>
                <el-radio :label="2">图文模式</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <div>
              <VoteOptionList v-model="inputForm.options"></VoteOptionList>
            </div>
          </el-form>
        </el-col>
      </el-row>

    </div>
  </div>

</template>

<script>
  import VoteSubjectService from '@/api/vote/VoteSubjectService'
  import SelectTree from '@/components/treeSelect/treeSelect'
  import VoteOptionList from './VoteOptionList'
  import TinyMce from '@/components/editor/TinyMce'
  export default {
    data() {
      return {
        title: '',
        method: '',
        loading: false,
        imageArra: [],
        editorConfig: {
          width: '100%',
          height: 300,
          menubar: false,
          language: 'zh_CN'
        },
        showThemeSelect:false,
        themeList: [{
            color1: '#347DFF',
            color2: '#A376FB'
          },
          {
            color1: '#c3272b',
            color2: '#827100'
          },
          {
            color1: '#21a675',
            color2: '#ffa400'
          },
          {
            color1: '#1685a9',
            color2: '#16a951'
          },
          {
            color1: '#75664d',
            color2: '#f2be45'
          },
          {
            color1: '#2e4e7e',
            color2: '#177cb0'
          },
          {
            color1: '#424c50',
            color2: '#20CE96'
          },
          {
            color1: '#c93756',
            color2: '#ffb3a7'
          },
          {
            color1: '#e54d42',
            color2: '#f37b1d'
          },
          {
            color1: '#0E9489',
            color2: '#8dc63f'
          },
          {
            color1: '#347DFF',
            color2: '#50BFFF'
          },
          {
            color1: '#6739b6',
            color2: '#9B7ACD'
          },
          {
            color1: '#9c26b0',
            color2: '#CF97D9'
          },
          {
            color1: '#e03997',
            color2: '#EF94C6'
          },
          {
            color1: '#a5673f',
            color2: '#CEAD97'
          },
          {
            color1: '#000000',
            color2: '#999999'
          }
        ],
        inputForm: {
          id: '',
          title: '',
          image: '',
          starttime: '',
          endtime: '',
          describe0: '',
          themeColor: 0,
          type: this.$route.query.type || '',
          mode: 1,
          maxTimes: '',
          optionConfig: '1',
          options: [],
          status: 0
        },
        mobilePreviewUrl: ''
      }
    },
    components: {
      SelectTree,
      VoteOptionList,
      TinyMce
    },
    voteSubjectService: null,
    created() {
      this.voteSubjectService = new VoteSubjectService()
    },
    activated(){
      this.id = this.$route.query.id
      this.queryById(this.id);
      let url = window.location.protocol + '//' + window.location.host
      this.mobilePreviewUrl = `${url}/mobile.html#/vote/${this.id}`
    },
    methods: {
      queryById(id) {
        this.imageArra = []
        this.loading = false
        this.$nextTick(() => {
          this.clearCache();
          if (id) { // 修改或者查看
            this.loading = true
            this.voteSubjectService.queryById(id).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.inputForm.image.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.imageArra.push({
                    name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
                    url: item
                  })
                }
              })
              this.loading = false
            })
          }
        })
      },
      clearCache(){
        this.$refs.inputForm.resetFields();
        this.inputForm = {
          id: '',
          title: '',
          image: '',
          starttime: '',
          endtime: '',
          describe0: '',
          themeColor: 0,
          mode: 1,
          maxTimes: '',
          optionConfig: '1',
          options: [],
          status: 0
        }
      },
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.voteSubjectService.save(this.inputForm).then(({
              data
            }) => {
              this.$message.success(data)
              this.$emit('refreshDataList')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      goBack() {
        this.$store.dispatch('tagsView/delView', {
          fullPath: this.$route.fullPath
        })
        this.$router.push({
          path: `/vote/VoteSubjectList`
        })
      }
    }
  }
</script>
<style lang="scss" scoped="">
  .times-setting {
    width: 150px;
    margin-left: 20px;
  }

  .scroll-wrapper {
    height: calc(100% - 75px);
    overflow: auto;
  }

  div.preview-layer {
    width: 500px;
    height: 100%;
    margin: 10px auto;
    right: 0;
    text-align: center;
  }

  div.preview-layer .preview-bg {
    width: 500px;
    height: 100%;
    margin: 20px auto;
    z-index: 999;
    opacity: 0.7;
  }

  div.preview-layer .preview-phone {
    width: 372px;
    height: 744px;
    margin: 0 auto;
    background: url('~@/assets/images/appearset_bgc_big.png');
    background-size: 372px 744px;
    z-index: 1000;
  }

  .preview-html {
    width: 345px !important;
    height: 568px !important;
    margin: 74px 0 0;
    border-radius: 5px;
    outline: none;
    background-color: #fff;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 0;
  }

  .theme-setting {
    position: relative;
  }

  .theme-list {
    width: 300px;
    padding: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: absolute;
    top: 40px;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  .theme-list .item {
    width: 25%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .theme-list .item .item-inner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }

  .theme-form {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #999;
    cursor: pointer;
  }
</style>
