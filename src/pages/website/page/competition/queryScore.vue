<template>
  <div>
    <h1 class="text-center">成绩查询</h1>
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" class="el-form" label-width="150px"
      v-if="!resultVisible">
      <el-form-item label="请输入您的姓名" prop="name" :rules="[
               {required: true, message:'请输入姓名', trigger:'blur'}
              ]">
        <el-input v-model="inputForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="请输入身份证号" prop="cardNo" :rules="[
               {required: true, message:'请输入身份证号', trigger:'blur'},
               {validator: validator.isCardId, trigger:'blur'}
              ]">
        <el-input v-model="inputForm.cardNo" placeholder="请填写身份证号"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="query" class="el-button">查 询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="text-center" v-if="resultVisible">
      <div class="result-page" v-if="scoreList.length==0">
        <img :src="require('../../assets/images/symbol-icon.png')" alt="">
        <p>未查询到该比赛的成绩信息,请稍后再试</p>
      </div>
      <div v-else class="result-list">
        <p>
          <span>姓名:{{inputForm.name}}</span> <span>身份证号：{{inputForm.cardNo}}</span>
        </p>
        <table>
          <tr>
            <td v-for="(item,index) in scoreList" :key="index">{{item.round}}</td>
          </tr>
          <tr>
            <td v-for="(item,index) in scoreList" :key="index">{{item.score}}</td>
          </tr>
        </table>
      </div>
      <button class="btn-back" @click="resultVisible=false">返 回</button>
    </div>



  </div>

</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        inputForm: {
          cid: this.$route.params.id,
          name: '',
          cardNo: ''
        },
        resultVisible: false,
        scoreList: []
      }
    },
    components: {},
    created() {},
    methods: {
      // 成绩查询
      query() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: '/competition/competitionRounds/public/score/query',
              method: 'get',
              params: this.inputForm
            }).then(({
              data
            }) => {
              this.resultVisible = true;
              this.scoreList = data;
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      resetSearch() {
        this.$refs.inputForm.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form {
    width: 500px;
    margin: 30px auto 100px;
  }

  .text-center {
    text-align: center;
  }

  .result-page {
    width: 614px;
    height: 325px;
    margin: 0 auto;
    background: rgba(220, 0, 12, 0.07);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #DC000C;
    text-align: center;
    padding: 100px 0;

    p {
      margin-top: 20px;
    }
  }

  .btn-back {
    width: 200px;
    height: 50px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #DC000C;
    margin: 20px auto;
    color: #DC000C;
    cursor: pointer;
  }

  .result-list {
    width: 70%;
    margin: 0 auto;
    padding: 100px 0;

    p {
      text-align: left;
      margin-bottom: 35px;

      span {
        margin-right: 100px;
        font-size: 18px;
      }
    }

    table {
      width: 100%;
      margin: 0 auto;
      border-spacing: 0;

      tr {
        &:first-child {
          background-color: #F5F5F5;
          font-size: 18px;
        }

        &:last-child {
          color: #DC000C;
          font-size: 32px;
        }

        td {
          height: 60px;
          border: 1px solid #DDDDDD;
        }
      }
    }
  }
</style>
