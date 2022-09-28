<template>
     <div class="cascader-warp">
          <el-cascader
              v-model="city"
              :options="list"
              filterable
              separator="/"
              class="el-cascader"
              :props="{ expandTrigger: 'hover',value:'name',label:'name' }"
          >
          </el-cascader>
         <el-input class="address" v-model="address"  placeholder="请输入详细地址" style="flex:1"></el-input></el-col>
     </div>
</template>

<script>
  export default {
    props:{
      value: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        list:[],
        city: [],
        address:''
      }
    },
    watch: {
      dataModel(val) {
        this.$emit('input', val)
      },
      value(val) {
        var city = [],address = '';
        if(val){
          var datas = val.split('/');
          city = datas.slice(0,datas.length-1);
          address = datas[datas.length-1];
        }
        this.city = city;
        this.address = address
      }
    },
    mounted(){
      this.getAreaList();
    },
    methods:{
      getAreaList(){
        this.$http({
          url:'/sys/area/treeData',
          method:'get',
          headers:{
            token:this.$cookie.get('token')||this.$cookie.get('user-token')
          }
        }).then(({data})=>{
          this.list = data;
        })
      }
    },
    computed:{
      dataModel:function(){
        return (this.city?this.city.join('/'):'')+'/'+this.address
      }
    }
  }
</script>

<style scoped lang="scss">
  .cascader-warp{
    display: flex;
    .el-cascader{flex:1}
    .address{flex:1}
  }
</style>
