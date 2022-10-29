<template>
<div class="el-scrollbar__wrap wrap-white padding-20">
  <div class="el-scrollbar__view">
    <el-form size="small" :model="inputForm" ref="inputForm"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="22">
            <el-form-item label="标题" prop="title"
                :rules="[
                  {required: true, message:'标题不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.title" placeholder="请输入标题"     ></el-input>
	         </el-form-item>
        </el-col>
         <el-col :span="22">
            <el-form-item label="内容" prop="content" :rules="[
                  {required: true, message:'内容不能为空', trigger:'blur'}
                 ]">
              <tiny-mce v-model="inputForm.content"  :config="{
          width: '100%',
          height: 280,
          menubar: false,
          language: 'zh_CN'
        }"></tiny-mce>
            </el-form-item>
        </el-col>

        <el-col :span="22">
          <el-form-item label="通知对象" prop="type">
              <el-radio-group v-model="inputForm.type" @change="changeHandle">
                  <el-radio :label="1">裁判</el-radio>
                  <el-radio :label="2">领队</el-radio>
                  <el-radio :label="3">指导老师</el-radio>
                  <el-radio :label="4">选手</el-radio>
                  <el-radio :label="5">自定义</el-radio>
                </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="inputForm.type==5">
            <el-form-item  label="收件地址"  prop="emailAddress"
                :rules="[
                  {required: true, message:'收件地址不能为空', trigger:'blur'}
                 ]">
          		   <el-input v-model="inputForm.emailAddress" placeholder="输入多个邮件地址请用英文符号;隔开"></el-input>
           </el-form-item>
        </el-col>
        <template v-else>
          <el-col :span="11">
            <el-form-item prop="cid" label="选择比赛" :rules="[
                  {required: true, message:'请选择比赛', trigger:['blur','change']}
                 ]">
                <el-select v-model="inputForm.cid" filterable clearable placeholder="请选择比赛" style="width: 100%;" @change="changeHandle">
                <el-option
                  v-for="(item,index) in dataList"
                  :key="index"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="people" label="选择人员" :rules="[
                  {required: true, message:'请选择人员', trigger:['blur','change']}
                 ]">
                <el-select v-model="inputForm.people" filterable clearable multiple placeholder="请选择人员" style="width: 100%;">
                 <el-option label="全部" value="all"></el-option>
                 <el-option
                  v-for="(item,index) in peopleList"
                  :key="index"
                  :label="item.name"
                  :value="item.email">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="22">
          <el-form-item label="附件" prop="appendix">
            <el-upload ref="file"
              :action="`${$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/emailTemplate`"
              :headers="{token: $cookie.get('token')}"
              :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
              :on-success="(response, file, fileList) => {
                     inputForm.appendix = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                   }" :on-remove="(file, fileList) => {
                     if(file&&file.status=='success'){
                       $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                         $message.success(data)
                       })
                       inputForm.appendix = fileList.map(item => item.url).join('|')
                     }
                   }" :before-remove="(file, fileList) => {
                     if(file&&file.status=='success'){
                       return $confirm(`确定移除 ${file.name}？`)
                     }
                   }" multiple :limit="5" :on-exceed="(files, fileList) =>{
                     $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                   }" :file-list="fileArra" :before-upload="beforeFileUpload">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">附件格式不限,文件大小不能超过50M</div>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="22">
          <el-form-item>
            <el-button size="small" type="primary" @click="doSubmit()" v-noMoreClick>发送
            </el-button>
          </el-form-item>
        </el-col>
        </el-row>
    </el-form>
</div>
</div>
</template>

<script>
  import TinyMce from '@/components/editor/TinyMce'
  import ToolsService from '@/api/tools/ToolsService'
  import CompetitionService from '@/api/competition/CompetitionService'
  export default {
    data () {
      return {
        inputForm: {
          emailAddress: '',
          title: '',
          content: '',
          cid:'',
          type:1,
          people:[],
          appendix:''
        },
        dataList:[],
        peopleList:[],
        fileArra:[]
      }
    },
    components: {
      TinyMce
    },
    toolsService: null,
    competitionService: null,
    created () {
      this.toolsService = new ToolsService()
      this.competitionService = new CompetitionService()
    },
    activated(){
      this.getCompetitionList()
    },
    watch:{
      'inputForm.people':function(newVal,oldval){
        let newindex =  newVal.indexOf('all'),oldindex =  oldval.indexOf('all');   //获取val和oldval里all的索引,如果没有则返回-1
        if(newindex!=-1 && oldindex==-1 && newVal.length>1){
          //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
          this.inputForm.people=['all'];
        }else if(newindex!=-1 && oldindex!=-1 && newVal.length>1){
          //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
          this.inputForm.people.splice(newVal.indexOf('all'),1)
        }
        if(newindex!=-1){
          this.inputForm.emailAddress = this.peopleList.map(item=>item.email).join(';')
        }else{
          this.inputForm.emailAddress = newVal.join(';')
        }
      }
    },
    methods: {
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.toolsService.sendEmail(this.inputForm).then(({data}) => {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data})
              this.$refs.inputForm.resetFields()
              this.fileArra = []
            })
          }
        })
      },
      getCompetitionList() {
        this.competitionService.list({
          'current': 1,
          'size': 9999,
        }).then(({
          data
        }) => {
          this.dataList = data.records;
        })
      },
      changeHandle(){
        this.$http({
          url:'/competition/competitionPlayer/people',
          params:{
            type:this.inputForm.type,
            cid:this.inputForm.cid
          }
        }).then(({data})=>{
          this.peopleList = data
        })
      },
      beforeFileUpload(file) {
        return new Promise((resolve, reject) => {
          if (file.size >= 1024*1024*50) {
            // 限制文件大小
            this.$message({
              type: "error",
              message: "文件大小不能超出50M，请重新上传！",
            });
            return reject(false);
          } else {
            resolve(true);
          }
        });
      }
    }
  }
</script>
