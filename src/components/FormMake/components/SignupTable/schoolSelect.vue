<template>
   <el-select v-model="dataModel" filterable clearable placeholder="请选择学校" style="width: 100%;">
      <el-option
        v-for="(item,index) in list"
        :key="index"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
</template>

<script>
  export default {
    value: {
      type: String,
      default: ''
    },
    data(){
      return {
        list:[],
        dataModel: this.value
      }
    },
    watch: {
      dataModel(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.dataModel = val;
      }
    },
    mounted(){
      this.getSchoolList();
    },
    methods:{
      getSchoolList(){
        this.$http({
          url:'/school/school/list',
          method:'get',
          headers:{
            token:this.$cookie.get('token')||this.$cookie.get('user-token')
          }
        }).then(({data})=>{
          this.list = data;
        })
      }
    }
  }
</script>

<style>
</style>
