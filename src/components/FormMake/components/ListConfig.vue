<template>
  <div v-if="show">
    <el-form label-position="top" size="small">

      <el-form-item :label="$t('fm.config.list.attribute')">
        <el-checkbox v-model="data.options.isShow" v-if="Object.keys(data.options).indexOf('isShow')>=0 ">{{$t('fm.config.list.isShow')}}	</el-checkbox>
        <el-checkbox v-model="data.options.isSort" v-if="Object.keys(data.options).indexOf('isSort')>=0 ">{{$t('fm.config.list.isSort')}}	</el-checkbox>
        <el-checkbox v-model="data.options.isSearch" v-if="Object.keys(data.options).indexOf('isSearch')>=0 ">{{$t('fm.config.list.isSearch')}}	</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
  <div v-else class="empty">
    {{$t('fm.description.configEmpty')}}
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CodeEditor from '../components/CodeEditor'

export default {
  components: {
    Draggable,
    CodeEditor
  },
  props: ['data'],
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    }
  },
  computed: {
    show () {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    handleOptionsRemove (index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else if (this.data.type === 'tabs') {
        this.data.tabs.splice(index, 1)
      } else {
        if (!this.data.options.remote && this.data.options.options[index].value) {
          this.data.options.defaultValue = typeof this.data.options.defaultValue === 'string' ? '' : []
        }

        this.data.options.options.splice(index, 1)
      }
      
    },
    handleAddOption () {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption'),
          label: this.$t('fm.config.widget.newOption')
        })
      } else {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption')
        })
      }
      
    },
    handleAddColumn () {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    handleAddTab () {
      let length = this.data.tabs.length

      this.data.tabs.push({
        label: this.$t('fm.config.widget.tab') + (length + 1),
        name: 'tab_' + new Date().getTime(),
        list: []
      })
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple (value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
        
      } else {
        if (this.data.options.defaultValue.length>0){
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
        
      }
    },

    validateRequired (val) {
      if (val) {
        this.validator.required = {required: true, message: `${this.data.name}${this.$t('fm.config.widget.validatorRequired')}`}
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType (val) {
 
      if (!this.show) {
        return false
      }
      
      if (val) {
        this.validator.type = {type: val, message: this.data.name + this.$t('fm.config.widget.validatorType')}
        // 解决 数字相关类型的 校验报错
        if(val == 'number' || val == "float" || val =="integer"){
          this.validator.type.type = 'number'
        } 
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = {pattern: val, message: this.data.name + this.$t('fm.config.widget.validatorPattern')}
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue')>=0) 
            this.data.options.defaultValue = ''
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function (val) {
      this.valiatePattern(val)
    },
    'data.name': function (val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    }
  }
}
</script>
