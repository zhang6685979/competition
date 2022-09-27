<template>
  <div class="form-table" :class="{'is-disabled': disabled}">
    <el-table
      :data="tableData"
      border
      size="small"
    >
      <el-table-column
        label="#"
        fixed
        width="50">
        <template slot-scope="scope">
          <div class="scope-index" :class="{'show':options.rows>0}">
            <span>{{scope.$index + 1}}</span>
          </div>
          <div class="scope-action" v-if="options.rows==0">
            <el-button :disabled="disabled" @click="handleRemove(scope.$index)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.length==0"></el-table-column>
      <template v-else>
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :label="column.name"
          :width="column.options.width"
          :label-class-name="column.options.required ? 'required' : ''"
        >
          <template slot-scope="scope">
            <el-form-item :prop="`${name}.${scope.$index}.${column.model}`" :rules="rules[`${name}.${column.model}`]">
              <GenerateElementItem :edit="!disabled" :blanks="blanks" :is-table="true" :widget="column" v-model="scope.row[column.model]" :models.sync="tableData[scope.$index]" :remote="remote" :remote-option="remoteOption">
                <template v-slot:[blank.name]="blankScope" v-for="blank in blanks">
                  <slot :name="blank.name" :model="scope.row"></slot>
                </template>
              </GenerateElementItem>
            </el-form-item>

          </template>

        </el-table-column>
      </template>
    </el-table>
    <el-button  icon="el-icon-plus" type="text" @click="handleAddRow" v-if="(!disabled)&&options.rows==0">{{$t('fm.actions.add')}}</el-button>
  </div>
</template>

<script>

export default {
  components: {
    GenerateElementItem: () => import('../GenerateElementItem.vue')
  },
  props: ['columns', 'value', 'models', 'remote', 'blanks', 'disabled', 'rules', 'name', 'remoteOption','options'],
  data () {
    return {
      tableData: this.value,
      // dataModels: this.models
    }
  },
  created(){
    var rows = this.options.rows;
    if(rows>0){
      for(var i=0;i<rows;i++){
        if(!this.tableData[i]){
          this.handleAddRow();
        }
      }
    }
  },
  methods: {
    handleAddRow () {
      let item = {}
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === 'blank') {
          item[this.columns[i].model] = this.columns[i].options.defaultType == 'String' ? '' : (this.columns[i].options.defaultType == 'Object' ? {} : [])
        } else {
          item[this.columns[i].model] = this.columns[i].options.defaultValue
        }
      }

      this.tableData.push(item)
    },

    handleRemove (index) {
      this.tableData.splice(index, 1)
    }
  },
  watch: {
    value (val) {
      this.tableData = val
    },
    'options.rows':function(newVal){
      if(newVal>0){
        for(var i=0;i<newVal;i++){
          this.handleAddRow();
        }
      }
    }
  }
}
</script>

<style lang="scss">
.form-table{
  position: relative;

  .el-form-item{
    margin-top: 2px;
  }

  .el-table th.required>div::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    background: transparent;
    vertical-align: top;
  }

  .el-table td{
    padding-bottom: 0;
  }

  .el-table__header-wrapper{
    background: #f5f7fa;

    div,th{
      background: #f5f7fa;
    }
  }

  .el-table__fixed-header-wrapper{
    div,th{
      background: #f5f7fa;
    }
  }

  &.is-disabled{
    background-color: #F5F7FA;
    table::after{
      display: block;
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      cursor: no-drop;
    }
  }

  .el-table__empty-block{
    display: none;
  }

  .scope-action{
    display: none;
    margin-bottom: 18px;
  }

  .scope-index{
    display: block;
    margin-bottom: 18px;
  }

  .hover-row{
    .scope-action{
      display: block;
      .el-button{
        padding: 3px;
      }
    }

    .scope-index{
      display: none;
    }
    .show{
      display: block;
    }
  }
}
</style>
