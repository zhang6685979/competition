<template>
  <div>
     <table class="table">
       <tr>
         <th>角色</th>
         <th>姓名</th>
         <th>院系</th>
         <th>赛项</th>
         <th>职务/职称</th>
         <th>性别</th>
         <th>联系方式</th>
         <th>邮箱</th>
         <th>身份证号</th>
       </tr>
       <tr v-for="(item,index) in options.rows" :key="index">
         <td>选手</td>
         <td>张三</td>
         <td>
           <el-select>
             <el-option v-for="(option,index) in options.modules" :key="index">{{option.value}}</el-option>
           </el-select>
         </td>
         <td>站务员</td>
         <td>指导老师</td>
         <td>男</td>
         <td>18537169260</td>
         <td>zhansan@qq.com</td>
         <td>411082198912264219</td>
       </tr>
     </table>
  </div>
</template>

<script>
export default {
  name: 'signup-table',
  props: {
    value: {
      type: [],
      default: () => ([])
    },
    options:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dataModel: this.value
    }
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
  .table{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    tr{
      th{
        border:1px solid #ccc;
      }
      td{
        border:1px solid #ccc;
      }
    }
  }
</style>
