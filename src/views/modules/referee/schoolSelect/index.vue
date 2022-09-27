<template>
<div>
    <el-input placeholder="请选择" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="showSchoolSelect" icon="el-icon-search"></el-button>
    </el-input>
    <school-select ref="schoolSelect"  @doSubmit="selectSchoolToInput" :limit="limit" :selectData="selectData"></school-select>
</div>
</template>
<script>
import schoolSelect from './schoolSelectDialog'
import SchoolService from '@/api/school/SchoolService'
export default {
  data () {
    return {
      name: '',
      labelValue: this.value,
      selectData: []
    }
  },
  props: {
    limit: Number,
    value: {
      type:String,
      default: () => {return ''}
    },
    size: {
      type: String,
      default: () => { return 'small' }
    },
    readonly: {
      type: Boolean,
      default: () => { return false }
    },
    disabled: {
      type: Boolean,
      default: () => { return false }
    },
    cid:String
  },
  components: {
    schoolSelect
  },
  schoolService: null,
  beforeCreate () {
    this.schoolService = new SchoolService()
  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          newVal.split(',').forEach((id) => {
            this.schoolService.queryById(id).then(({data}) => {
              if (data && data.id !== '') {
                this.selectData.push(data)
              }
            })
          })
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler (newVal) {
       this.name = newVal.map(school => { return school.name }).join(',')
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    selectSchoolToInput (schools) {
      this.selectData = schools
      this.labelValue = schools.map(school => { return school.id }).join(',')
      this.name = schools.map(school => { return school.name }).join(',')
      this.$emit('input', this.labelValue, this.name)
    },
    showSchoolSelect () {
      this.$refs.schoolSelect.init()
    }
  }
}
</script>
<style>
  .el-form-item__content .el-input-group {
      vertical-align: middle;
  }
 .el-tag{
    margin-left: 5px;
    margin-bottom: 5px;
  }
</style>
