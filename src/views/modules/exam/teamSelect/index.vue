<template>
<div>
    <el-input placeholder="请选择" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="showTeamSelect" icon="el-icon-search"></el-button>
    </el-input>
    <team-select ref="teamSelect" :cid="cid" :crid="crid" @doSubmit="selectTeamToInput" :limit="limit" :selectData="selectData"></team-select>
</div>
</template>
<script>
import teamSelect from './teamSelectDialog'
import CompetitionExamService from '@/api/exam/CompetitionExamService'
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
    cid:String,
    crid:String
  },
  components: {
    teamSelect
  },
  competitionExamService: null,
  beforeCreate () {
    this.competitionExamService = new CompetitionExamService()
  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          newVal.forEach((id) => {
            this.competitionExamService.getTeamById(id).then(({data}) => {
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
       this.name = newVal.map(team => { return `${team.school}-${team.module}`}).join(',')
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    selectTeamToInput (teams) {
      this.selectData = teams
      this.labelValue = teams.map(team => { return team.id })
      this.name = teams.map(team => { return `${team.school}-${team.module}` }).join(',')
      this.$emit('getValue', this.labelValue, this.name)
    },
    showTeamSelect () {
      this.$refs.teamSelect.init()
    }
  }
}
</script>
<style>
  .el-form-item__content .el-input-group {
      vertical-align: middle;
  }
 .el-tag {
    margin-left: 5px;
    margin-bottom: 5px;
  }
</style>
