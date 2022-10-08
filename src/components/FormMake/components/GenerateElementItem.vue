<template>
  <span>
    <template v-if="widget.type == 'blank'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <slot :name="widget.model" :model="dataModels"></slot>
      </div>

    </template>

    <template v-if="widget.type == 'component'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <component :is="`component-${widget.key}-${key}`" :key="key" v-model="dataModel"></component>
      </div>
    </template>

    <template v-if="widget.type == 'custom'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <component
          :is="widget.el"
          v-model="dataModel"
          :width="widget.options.width"
          :height="widget.options.height"
          :placeholder="widget.options.placeholder"
          :readonly="widget.options.readonly"
          :disabled="!edit || widget.options.disabled"
          :editable="true"
          :clearable="widget.options.clearable"
          :options="widget.options"
          :model="widget.model"
          :models="dataModels"
        ></component>
      </div>
    </template>

    <template v-if="widget.type == 'input'" >
      <el-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        type="number"
        v-model.number="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :show-password="widget.options.showPassword"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
      <el-input
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :show-password="widget.options.showPassword"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input type="textarea" :rows="5"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
        :disabled="!edit || widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
      ></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-radio
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-checkbox

          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="!edit || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: isTable ? '100%' : widget.options.width}"
      >
      </el-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <el-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="!edit || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : (widget.options.type == 'datetime' ? 'yyyy-MM-dd HH:mm' : widget.options.format )"
        :format="widget.options.type == 'datetime' ? 'yyyy-MM-dd HH:mm' : widget.options.format "
        :style="{width: isTable ? '100%' : widget.options.width}"
      >
      </el-date-picker>
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate v-model="dataModel"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :allow-half="widget.options.allowHalf"
        :show-score="widget.options.showScore"
      ></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :filterable="widget.options.filterable"
      >
        <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
      </el-select>
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
      >
      </el-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-slider>
    </template>

    <template v-if="widget.type=='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :readonly="widget.options.readonly"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :is-delete="widget.options.isDelete"
        :min="widget.options.min"
        :is-edit="widget.options.isEdit"
        :action="widget.options.action"
        :headers="widget.options.headers || []"
      >
      </fm-upload>
    </template>

    <template v-if="widget.type == 'editor'">
      <fm-editor
        v-model="dataModel"
        :sty="{width: isTable ? '100%' : widget.options.width, cursor: (!edit || widget.options.disabled) ? 'no-drop' : '', backgroundColor: (!edit || widget.options.disabled) ? '#F5F7FA' : ''}"
        :toolbar="widget.options.customToolbar"
        :disabled="!edit || widget.options.disabled"
      >
      </fm-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :options="remoteOptions"
      >

      </el-cascader>
    </template>

    <template v-if="widget.type == 'text'">
      <span>{{dataModel}}</span>
    </template>

    <template v-if="widget.type == 'html'">
      <span v-html="dataModel"></span>
    </template>

    <template v-if="widget.type == 'table'" >
      <fm-form-table
        :value="dataModel"
        :columns="widget.tableColumns"
        :models="dataModels"
        :remote="remote"
        :blanks="blanks"
        :disabled="!edit || widget.options.disabled"
        :rules="rules"
        :name="widget.model"
        :remote-option="remoteOption"
        :options="widget.options"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </fm-form-table>
    </template>

    <template v-if="widget.type == 'fileupload'">
      <fm-file-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :min="widget.options.min"
        :action="widget.options.action"
        :tip="widget.options.tip"
        :headers="widget.options.headers || []"
      >
      </fm-file-upload>

    </template>
  </span>
</template>

<script>
import FmUpload from './Upload'
import FmFormTable from './FormTable'
import FmFileUpload from './Upload/file'
import FmEditor from './Editor'
import UserSelect from './userSelect'
import SelectTree from './treeSelect/treeSelect.vue'
import Vue from 'vue'
export default {
  name: 'generate-element-item',
  components: {
    FmUpload,
    FmFormTable,
    UserSelect,
    SelectTree,
    FmFileUpload,
    FmEditor
  },
  props: ['widget', 'value', 'models', 'remote', 'isTable', 'blanks', 'disabled', 'edit', 'remoteOption', 'rules'],
  data () {
    return {
      dataModel: this.value,
      dataModels: {...this.models},
      remoteOptions: [],
      key: new Date().getTime()
    }
  },
  created () {
    this.remoteOptions = []

    if (this.widget.options.remote
      && (Object.keys(this.widget.options).indexOf('remoteType') >= 0 ? this.widget.options.remoteType == 'func' : true)
      && this.remote[this.widget.options.remoteFunc]) {

      this.remote[this.widget.options.remoteFunc]((data) => {
        this.loadOptions(data)
      })
    }

    if (this.widget.options.remote
      && this.widget.options.remoteType == 'option'
      && this.remoteOption[this.widget.options.remoteOption]) {

      this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
    }

    if ((this.widget.type === 'imgupload' || this.widget.type === 'fileupload') && this.widget.options.isQiniu) {

      !this.widget.options.token && this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }

    if (this.widget.type == 'component') {

      Vue.component(`component-${this.widget.key}-${this.key}`, {
        template: `<span>${this.widget.options.template}</span>`,
        props: ['value'],
        data: () => ({
          dataModel: this.value
        }),
        watch: {
          dataModel (val) {

            if (this.ui == 'antd') {
              EventBus.$emit('on-field-change', this.$attrs.id, val)
            } else {
              this.$emit('input', val)
            }
          },
          value (val) {
            this.dataModel = val
          }
        }
      })
    }
  },
  methods: {
    loadOptions (data) {
      this.remoteOptions = data.map(item => {

        if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
          }
        } else {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label]
          }
        }

      })
    },
    processRemoteProps (children, props) {
      if (children && children.length) {
        return children.map(item => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              label: item[props.label],
              children: this.processRemoteProps(item[props.children], props)
            }
          } else{
            return {
              value: item[props.value],
              label: item[props.label],
            }
          }
        })
      } else {
        return []
      }
    }
  },
  watch: {
    value (val) {
      this.dataModel = val
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModels = {...val}
      }
    },
    dataModel (val) {
      this.$emit('input', val)
    },
    dataModels: {
      deep: true,
      handler (val) {
        this.$emit('input', val[this.widget.model])
      }
    },
    'remoteOption': {
      deep: 'true',
      handler: function (val) {

        if (Object.keys(this.remoteOption).indexOf(this.widget.options.remoteOption) >= 0
          && this.widget.options.remote
          && this.widget.options.remoteType == 'option'
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
        }
      }
    }
  }
}
</script>
