<template>
  <div>
    <table class="table">
      <tr>
        <th align="center">角色</th>
        <th><font style="color:#f00">*</font> 姓名</th>
        <th v-if="rowInfo.role=='领队'">院系</th>
        <th v-if="rowInfo.role!='领队'">赛项</th>
        <th v-if="rowInfo.role!='参赛选手'">职务/职称</th>
        <th v-if="rowInfo.role=='参赛选手'"><font style="color:#f00">*</font> 身份证号</th>
        <th>性别</th>
        <th><font style="color:#f00">*</font> 联系方式</th>
        <th><font style="color:#f00">*</font> 邮箱</th>

      </tr>
      <tr v-for="(item,index) in dataModel" :key="index">
        <td align="center">{{item.role}}</td>
        <td>
          <el-form-item class="field-item" :prop="`${model}.${index}.name`" :rules='[{ "required": true, "message": "必须填写" }]'>
            <el-input v-model="item.name"></el-input>
          </el-form-item>
        </td>
        <td v-if="rowInfo.role=='领队'">
          <el-input v-model="item.caculty"></el-input>
        </td>
        <td v-if="rowInfo.role!='领队'">
          <el-select v-model="item.module">
            <el-option v-for="(option,index) in options.modules" :label="option.value" :value="option.value"
              :key="index"></el-option>
          </el-select>
        </td>
        <td v-if="rowInfo.role!='参赛选手'">
          <el-input v-model="item.jobtitle"></el-input>
        </td>
        <td v-if="rowInfo.role=='参赛选手'">
          <el-form-item class="field-item" :prop="`${model}.${index}.idcardno`" :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isCardId, trigger:["blur","change"]}]'>
            <el-input v-model="item.idcardno"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-select v-model="item.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </td>
        <td>
          <el-form-item class="field-item" :prop="`${model}.${index}.mobile`" :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isMobile, trigger:["blur","change"]}]'>
          <el-input v-model="item.mobile"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item class="field-item" :prop="`${model}.${index}.email`" :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isEmail, trigger:["blur","change"]}]'>
            <el-input v-model="item.email"></el-input>
          </el-form-item>
        </td>

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
      options: {
        type: Object,
        default: () => {
          return {}
        }
      },
      model:{type:String,default:''}
    },
    data() {
      return {
        rowInfo: {},
        dataModel: this.value
      }
    },
    watch: {
      'options.rows': function(newVal, oldVal) {
        if (newVal && (newVal != oldVal)) {
          this.dataModel = [];
          for (var i = 0; i < newVal; i++) {
            this.dataModel.push(Object.assign({},this.rowInfo))
          }
        }
      },
      dataModel(val) {
        this.$emit('input', val)
      }
    },
    created(){
      if(this.value&&this.value.length>0){
        this.value[0].module = this.options.modules[0].value;
        this.rowInfo = Object.assign({},this.value[0]);
      }
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    tr {
      th {
        border: 1px solid #ccc;
      }

      td {
        border: 1px solid #ccc;
        vertical-align: top;
        .field-item{margin-bottom: 0px;&.is-error{
          margin-bottom: 18px;
        }}
      }
    }
  }
</style>
