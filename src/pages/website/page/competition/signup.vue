<template>
  <div class="signup-list">
    <el-row :gutter="10">
      <el-col :span="6" v-for="(item,index) in dataList" >
        <div class="signup-item" :style="{background:colors[index%3]}" @click="showSignupForm(item.id)">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>{{item.name}}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="signup-item my-signup">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>我的报名</p>
        </div>
      </el-col>
    </el-row>
    <fm-generate-form style="margin: 0 auto;" insite="true"
      v-if="json" :data="json"
      :value="{}" :remote="{}" ref="generateForm">

      <template v-slot:blank="scope">
        Width<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
        Height：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
      </template>
    </fm-generate-form>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataList: [],
        json:'',
        colors: ['linear-gradient(180deg, #7DB3F9 0%, #4B6DF6 100%)',
          'linear-gradient(180deg, #7CD6BD 0%, #55B8CE 100%)', 'linear-gradient(180deg, #BAA4F8 0%, #7D67F3 100%)'
        ]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.$http({
          url: '/competition/competitionSignup/public/list',
          method: 'get',
          params: {
            'cid': this.$route.params.id
          }
        }).then(({
          data
        }) => {
          this.dataList = data.records
        })
      },
      queryById(id){

      },
      showSignupForm(id){
        this.$http({
          url: '/competition/competitionSignup/public/queryById',
          method: 'get',
          params: {id: id}
        }).then(({data})=>{

          this.json = JSON.parse(data.content);
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  .signup-list {
    width: 650px;
    margin:100px auto;
  }

  .signup-item {
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    p {
      margin-top: 10px;
      color: #fff;
    }
  }

  .my-signup {
    background: linear-gradient(180deg, #F09EBA 0%, #EC6085 100%);
  }
</style>
