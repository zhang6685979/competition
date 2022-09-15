<template>
     <div style="display: flex;">
          <el-cascader
              v-model="city"
              :options="list"
              filterable
              separator="/"
              :props="{ expandTrigger: 'hover',value:'name',label:'name' }"
          >
          </el-cascader>
         <el-input v-model="address"  placeholder="请输入详细地址"></el-input></el-col>
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
          city = datas.slice(0,4);
          address = datas[4];
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

<style>
</style>
