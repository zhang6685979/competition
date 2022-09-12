<template>
<div>
    <el-input placeholder="请选择" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="showRefereeSelect" icon="el-icon-search"></el-button>
    </el-input>
    <referee-select ref="refereeSelect" :cid="cid" @doSubmit="selectRefereeToInput" :limit="limit" :selectData="selectData"></referee-select>
</div>
</template>
<script>
import refereeSelect from './refereeSelectDialog'
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
      type:Array,
      default: () => {return []}
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
    refereeSelect
  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          // newVal.split(',').forEach((id) => {
          //   this.userService.queryById(id).then(({data}) => {
          //     if (data && data.id !== '') {
          //       this.selectData.push(data)
          //     }
          //   })
          // })
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler (newVal) {
        this.name = newVal.map(referee => { return referee.name }).join(',')
      },
      immediate: false,
      deep: false
    }
  },
  methods: {
    selectRefereeToInput (referees) {
      this.selectData = referees
      this.labelValue = referees.map(referee => { return referee.id })
      this.name = referees.map(referee => { return referee.name }).join(',')
      console.log(this.name,'==========');
      this.$emit('getValue', this.labelValue, this.name)
    },
    showRefereeSelect () {
      this.$refs.refereeSelect.init()
    }
  }
}
</script>
<style>
  .el-form-item__content .el-input-group {
      vertical-align: middle;
  }
 .el-tag + .el-tag {
    margin-left: 5px;
    margin-bottom: 5px;
  }
</style>
