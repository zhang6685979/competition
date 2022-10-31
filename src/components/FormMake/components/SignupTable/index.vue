<template>
  <div>
    <template v-for="(table,index) in tables">
      <div class="title" v-if="editable&&(rowInfo.role=='参赛选手')">
        <h5>{{'队伍'+(index+1)}} <el-button v-if="!disabled&&!options.teamNum" class="pull-right no-print" type="primary" :icon="'el-icon-'+(index>0?'minus':'plus')" @click="addTeam(index)">{{index>0?'删除队伍':'添加队伍'}}</el-button>
        </h5>
      </div>
      <table class="table">
        <tr>
          <th align="center">角色</th>
          <th>
            <font style="color:#f00">*</font> 姓名
          </th>
          <th v-if="rowInfo.role=='领队'">院系</th>
          <th v-if="rowInfo.role!='领队'">
            <font style="color:#f00">*</font>赛项
          </th>
          <th v-if="rowInfo.role=='参赛选手'"><font style="color:#f00">*</font>指导老师</th>
          <th v-if="rowInfo.role!='参赛选手'">职务/职称</th>
          <th v-if="rowInfo.role=='参赛选手'">
            <font style="color:#f00">*</font> 身份证号
          </th>
          <th>性别</th>
          <th>
            <font style="color:#f00">*</font> 联系方式
          </th>
          <th>
            <font style="color:#f00">*</font> 邮箱
          </th>

        </tr>
        <tr v-for="(item,index) in table.list" :key="index">
          <td align="center">{{item.role}}</td>
          <td>
            <el-form-item class="field-item" :prop="`${model}.${index}.name`"
              :rules='[{ "required": true, "message": "必须填写" }]'>
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </td>
          <td v-if="rowInfo.role=='领队'">
            <el-input v-model="item.caculty"></el-input>
          </td>
          <td v-if="rowInfo.role!='领队'">
            <el-select v-model="item.module" :rules='[{ "required": true, "message": "请选择赛项" }]'>
              <el-option v-for="(option,index) in options.modules" :label="option.value" :value="option.value"
                :key="index"></el-option>
            </el-select>
          </td>
          <td v-if="rowInfo.role=='参赛选手'">
            <el-select v-model="item.instructor" :rules='[{ "required": true, "message": "请选择指导老师" }]'>
              <el-option
                v-for="(option,index) in models['instructor-signup']?models['instructor-signup'].filter(item=>item.name):[]"
                :label="option.name" :value="option.name" :key="index"></el-option>
            </el-select>
          </td>
          <td v-if="rowInfo.role!='参赛选手'">
            <el-input v-model="item.jobtitle"></el-input>
          </td>
          <td v-if="rowInfo.role=='参赛选手'">
            <el-form-item class="field-item" :prop="`${model}.${index}.idcardno`"
              :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isCardId, trigger:["blur","change"]}]'>
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
            <el-form-item class="field-item" :prop="`${model}.${index}.mobile`"
              :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isMobile, trigger:["blur","change"]}]'>
              <el-input v-model="item.mobile"></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="field-item" :prop="`${model}.${index}.email`"
              :rules='[{ "required": true, "message": "必须填写" },{validator: validator.isEmail, trigger:["blur","change"]}]'>
              <el-input v-model="item.email"></el-input>
            </el-form-item>
          </td>

        </tr>
      </table>
    </template>

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
      disabled:Boolean,
      editable: Boolean,
      model: {
        type: String,
        default: ''
      },
      models: {
        type: Object,
        default: () => {
          return {}
        }
      }
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
            if (this.rowInfo.role == '参赛选手') {
              this.rowInfo.teamName = '队伍1'
            }
            this.dataModel.push(Object.assign({}, this.rowInfo))
          }
        }
      },
      'options.defaultModule': function(newVal) {
        this.rowInfo.module = newVal;
        if (this.dataModel && this.dataModel.length > 0) {
          this.dataModel.forEach(item => {
            item.module = newVal;
          })
        }
      },
      dataModel(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.dataModel = val;
      }

    },
    created() {
      if (this.value && this.value.length > 0) {
        this.rowInfo = Object.assign({}, this.value[0]);
      }
      if(this.editable){
        var teamNum = this.options.teamNum;
        for(var i=0;i<Number(teamNum)-1;i++){
          this.addTeam(0);
        }
      }
    },
    methods: {
      groupArr(list, field) {
        var fieldList = [],
          att = [];
        list.map((e) => {
          fieldList.push(e[field])
        })
        //数组去重
        fieldList = fieldList.filter((e, i, self) => {
          return self.indexOf(e) == i
        })
        for (var j = 0; j < fieldList.length; j++) {
          //过滤出匹配到的数据
          var arr = list.filter((e) => {
            return e[field] == fieldList[j];
          })
          att.push({
            type: arr[0][field],
            list: arr
          })
        }
        return att;
      },
      addTeam(index) {
        if(index==0){
          var teamNum = this.tables.length + 1;
          for (var i = 0; i < this.options.rows; i++) {
            this.rowInfo.teamName = '队伍' + teamNum;
            this.dataModel.push(Object.assign({}, this.rowInfo))
          }
        }else{
          //删除队伍数据
          this.dataModel.splice(index*this.options.rows,this.options.rows)
          //重新分配队伍序号
          this.tables.forEach((table,index)=>{
            if(this.rowInfo.role=='参赛选手'){
              table.list.forEach(item=>{
                item.teamName = '队伍'+(index+1);
              })
            }
          })
        }
      }
    },
    computed: {
      tables() {
        var groupArr = this.groupArr(this.dataModel, 'teamName');
        return groupArr
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    height: 30px;
    line-height: 30px;
    border-left: 3px solid #DC000C;
    text-indent: 10px;
    margin-bottom: 10px;
    h5{
      text-align: left;
      font-size: 14px;
      margin: 0;
    }
  }

  .table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    margin-bottom:10px;
    tr {
      th {
        border: 1px solid #ccc;
      }

      td {
        border: 1px solid #ccc;
        vertical-align: top;

        .field-item {
          margin-bottom: 0px;

          &.is-error {
            margin-bottom: 18px;
          }
        }
      }
    }
  }
</style>
