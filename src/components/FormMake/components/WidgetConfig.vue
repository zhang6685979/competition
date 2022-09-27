<template>
  <div v-if="show">
    <el-form label-position="top" size="small">
      <el-form-item :label="$t('fm.config.widget.model')">
        <el-input v-model="data.model"></el-input>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.name')" v-if="data.type!='grid' && data.type != 'tabs'">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.width')" v-if="Object.keys(data.options).indexOf('width')>=0">
        <el-input v-model="data.options.width"></el-input>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.height')" v-if="Object.keys(data.options).indexOf('height')>=0">
        <el-input v-model="data.options.height"></el-input>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.size')" v-if="Object.keys(data.options).indexOf('size')>=0">
        {{$t('fm.config.widget.width')}}
        <el-input style="width: 90px;" type="number" v-model.number="data.options.size.width"></el-input>
        {{$t('fm.config.widget.height')}}
        <el-input style="width: 90px;" type="number" v-model.number="data.options.size.height"></el-input>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.labelWidth')"
        v-if="Object.keys(data.options).indexOf('labelWidth')>=0 && !data.options.tableColumn">
        <el-checkbox v-model="data.options.isLabelWidth" style="margin-right: 5px;">{{$t('fm.config.widget.custom')}}
        </el-checkbox>
        <el-input-number v-model="data.options.labelWidth" :disabled="!data.options.isLabelWidth" :min="0" :max="99999"
          :step="10"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.placeholder')"
        v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' && data.type!='date')">
        <el-input v-model="data.options.placeholder"></el-input>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.layout')" v-if="Object.keys(data.options).indexOf('inline')>=0">
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">{{$t('fm.config.widget.block')}}</el-radio-button>
          <el-radio-button :label="true">{{$t('fm.config.widget.inline')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.contentPosition')"
        v-if="Object.keys(data.options).indexOf('contentPosition') >= 0">
        <el-radio-group v-model="data.options.contentPosition">
          <el-radio-button label="left">{{$t('fm.config.widget.left')}}</el-radio-button>
          <el-radio-button label="center">{{$t('fm.config.widget.center')}}</el-radio-button>
          <el-radio-button label="right">{{$t('fm.config.widget.right')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.showInput')" v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <el-switch v-model="data.options.showInput"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.min')" v-if="Object.keys(data.options).indexOf('min')>=0">
        <el-input-number v-model="data.options.min" :min="-99999" :max="99999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.max')" v-if="Object.keys(data.options).indexOf('max')>=0">
        <el-input-number v-model="data.options.max" :min="-99999" :max="99999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.step')" v-if="Object.keys(data.options).indexOf('step')>=0">
        <el-input-number v-model="data.options.step" :min="-99999" :max="99999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.multiple')"
        v-if="data.type=='select' || data.type=='imgupload' || data.type == 'fileupload'">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.filterable')" v-if="data.type=='select'">
        <el-switch v-model="data.options.filterable"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.allowHalf')" v-if="Object.keys(data.options).indexOf('allowHalf')>=0">
        <el-switch v-model="data.options.allowHalf">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.showAlpha')" v-if="Object.keys(data.options).indexOf('showAlpha')>=0">
        <el-switch v-model="data.options.showAlpha">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.showLabel')" v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <el-switch v-model="data.options.showLabel">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.option')" v-if="Object.keys(data.options).indexOf('options')>=0">
        <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">{{$t('fm.config.widget.staticData')}}</el-radio-button>
          <el-radio-button :label="true">{{$t('fm.config.widget.remoteData')}}</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <el-radio-group v-model="data.options.remoteType">
              <el-radio label="option">{{$t('fm.config.widget.remoteAssigned')}}</el-radio>
              <el-radio label="func">{{$t('fm.config.widget.remoteFunc')}}</el-radio>
            </el-radio-group>
            <el-input size="mini" v-if="data.options.remoteType == 'option'" v-model="data.options.remoteOption"
              style="margin-bottom: 5px;">
            </el-input>
            <el-input size="mini" v-if="data.options.remoteType == 'func'" v-model="data.options.remoteFunc"
              style="margin-bottom: 5px;">
            </el-input>
            <el-input size="mini" v-model="data.options.props.value">
              <div style="width: 30px;" slot="prepend">{{$t('fm.config.widget.value')}}</div>
            </el-input>
            <el-input size="mini" v-model="data.options.props.label">
              <div slot="prepend" style="width: 30px;">{{$t('fm.config.widget.label')}}</div>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue">
              <draggable tag="ul" :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}" handle=".drag-item">
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio :label="item.value" style="margin-right: 5px;">
                    <el-input :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini"
                      v-model="item.value"></el-input>
                    <el-input style="width:90px;" size="mini" v-if="data.options.showLabel" v-model="item.label">
                    </el-input>
                    <!-- <input v-model="item.value"/> -->
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i
                      class="iconfont icon-icon_bars"></i></i>
                  <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                    icon="el-icon-minus" style="padding: 4px;margin-left: 5px;"></el-button>

                </li>
              </draggable>

            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">

              <draggable tag="ul" :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}" handle=".drag-item">
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-checkbox :label="item.value" style="margin-right: 5px;">
                    <el-input :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini"
                      v-model="item.value"></el-input>
                    <el-input style="width:90px;" size="mini" v-if="data.options.showLabel" v-model="item.label">
                    </el-input>
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i
                      class="iconfont icon-icon_bars"></i></i>
                  <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                    icon="el-icon-minus" style="padding: 4px;margin-left: 5px;"></el-button>

                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">{{$t('fm.actions.addOption')}}</el-button>
          </div>
        </template>

      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.remoteData')" v-if="data.type=='cascader'">
        <div>
          <el-radio-group v-model="data.options.remoteType">
            <el-radio label="option">{{$t('fm.config.widget.remoteAssigned')}}</el-radio>
            <el-radio label="func">{{$t('fm.config.widget.remoteFunc')}}</el-radio>
          </el-radio-group>
          <el-input size="mini" v-if="data.options.remoteType == 'option'" v-model="data.options.remoteOption"
            style="margin-bottom: 5px;">
          </el-input>
          <el-input size="mini" v-if="data.options.remoteType == 'func'" v-model="data.options.remoteFunc"
            style="margin-bottom: 5px;">
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.value">
            <template slot="prepend">{{$t('fm.config.widget.value')}}</template>
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.label">
            <template slot="prepend">{{$t('fm.config.widget.label')}}</template>
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.children">
            <template slot="prepend">{{$t('fm.config.widget.childrenOption')}}</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.dictType')" v-if="data.type=='dict'">
        <el-select filterable v-model="data.options.dictType" placeholder="请选择" clearable style="width: 100%;">
          <el-option v-for="(item, index) in dictList" :key="index" :label="`${item.dictType}:${item.dictName}`"
            :value="item.dictType">
          </el-option>
        </el-select>
      </el-form-item>




      <el-form-item :label="$t('fm.config.widget.defaultValue')"
        v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'text' || data.type == 'textarea' || data.type == 'input' || data.type=='number' || data.type=='rate' || data.type=='color' || data.type=='switch' || data.type == 'html')">
        <el-input v-if="data.type=='textarea'" type="textarea" :rows="5" v-model="data.options.defaultValue"></el-input>

        <template v-if="data.type=='input' || data.type == 'text'">
          <template
            v-if="data.options.dataType == 'number' || data.options.dataType == 'integer' || data.options.dataType == 'float'">
            <el-input type="number" v-model.number="data.options.defaultValue"></el-input>
          </template>
          <template v-else>
            <el-input v-model="data.options.defaultValue"></el-input>
          </template>
        </template>


        <el-rate v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;" :max="data.options.max"
          :allow-half="data.options.allowHalf" v-model="data.options.defaultValue"></el-rate>
        <el-button type="text" v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">
          {{$t('fm.actions.clear')}}
        </el-button>
        <el-color-picker v-if="data.type == 'color'" v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"></el-color-picker>
        <el-switch v-if="data.type=='switch'" v-model="data.options.defaultValue"></el-switch>
        <el-input-number v-if="data.type=='number'" v-model="data.options.defaultValue" :step="data.options.step"
          :min="data.options.min" :max="data.options.max"></el-input-number>

        <template v-if="data.type == 'html'">
          <code-editor :key="data.key" v-model="data.options.defaultValue" height="200px"></code-editor>
        </template>
      </el-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item :label="$t('fm.config.widget.showType')" v-if="data.type == 'date'">
          <el-select v-model="data.options.type">
            <el-option value="year"></el-option>
            <el-option value="month"></el-option>
            <el-option value="date"></el-option>
            <el-option value="dates"></el-option>
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime"></el-option>
            <el-option value="datetimerange"></el-option>
            <el-option value="daterange"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isRange')" v-if="data.type == 'time'">
          <el-switch v-model="data.options.isRange">
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isTimestamp')" v-if="data.type == 'date'">
          <el-switch v-model="data.options.timestamp">
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.placeholder')"
          v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')">
          <el-input v-model="data.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.startPlaceholder')"
          v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <el-input v-model="data.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.endPlaceholder')"
          v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <el-input v-model="data.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.format')">
          <el-input v-model="data.options.format"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.defaultValue')"
          v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0">
          <el-time-picker key="1" style="width: 100%;" v-if="!data.options.isRange" v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl" :value-format="data.options.format">
          </el-time-picker>
          <el-time-picker key="2" v-if="data.options.isRange" style="width: 100%;" v-model="data.options.defaultValue"
            is-range :arrowControl="data.options.arrowControl" :value-format="data.options.format">
          </el-time-picker>
        </el-form-item>
      </template>
      <el-form-item label="表格行数" v-if="data.type=='table'">
        <el-input type="number" v-model.number="data.options.rows"></el-input>
      </el-form-item>
      <template v-if="data.options.type=='signup-table'">
        <el-form-item label="表格行数">
          <el-input type="number" v-model.number="data.options.rows"></el-input>
        </el-form-item>
        <el-form-item label="模块配置">
          <template>
            <el-radio-group v-model="data.options.defaultModule">
              <draggable tag="ul" :list="data.options.modules"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}" handle=".drag-item">
                <li v-for="(item, index) in data.options.modules" :key="index">
					{{item.value}}
                  <el-radio :label="item.value" style="margin-right: 5px;">
                    <el-input :style="{'width': '180px' }" size="mini" v-model="item.value"></el-input>
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i
                      class="iconfont icon-icon_bars"></i></i>
                  <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                    icon="el-icon-minus" style="padding: 4px;"></el-button>

                </li>
              </draggable>

            </el-radio-group>
            <div style="margin-left: 22px;">
              <el-button type="text" @click="handleAddOption">{{$t('fm.actions.addOption')}}</el-button>
            </div>
          </template>

        </el-form-item>
      </template>
      <template v-if="data.options.type=='download'">
        <el-form-item label="按钮文字">
          <el-input v-model="data.options.btnText"></el-input>
        </el-form-item>
        <el-form-item label="下载描述">
          <el-input type="textarea" clearable :rows="3" placeholder="请输入下载描述" size="mini"
            v-model="data.options.downloadDesc"></el-input>
        </el-form-item>
        <el-form-item label="下载模板设置">
          <el-upload ref="file" :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/template`"
            :headers="{token: $cookie.get('token')}"
            :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
            :on-success="(response, file, fileList) => {
                   data.options.downloadUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                 }" :on-remove="(file, fileList) => {
                   $http.delete(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                     $message.success(data)
                   })
                   data.options.downloadUrl=''
                 }" :before-remove="(file, fileList) => {
                   return $confirm(`确定移除 ${file.name}？`)
                 }" multiple :limit="1" :on-exceed="(files, fileList) =>{
                   $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                 }" :file-list="getFileList(data.options.downloadUrl)">
            <el-button size="small" type="primary">上传模板</el-button>
          </el-upload>
        </el-form-item>
      </template>

      <template v-if="data.type=='imgupload' || data.type=='fileupload'">

        <el-form-item :label="$t('fm.config.widget.limit')">
          <el-input type="number" v-model.number="data.options.limit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.tip')" v-if="Object.keys(data.options).indexOf('tip')>=0">
          <el-input v-model="data.options.tip"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isQiniu')">
          <el-switch v-model="data.options.isQiniu"></el-switch>
        </el-form-item>
        <template v-if="data.options.isQiniu">
          <el-form-item label="Domain" :required="true">
            <el-input v-model="data.options.domain"></el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.tokenFunc')" :required="true">
            <el-input v-model="data.options.tokenFunc"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('fm.config.widget.action')" :required="true">
            <el-input v-model="data.options.action"></el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.headers')">
            <ul>
              <li v-for="(item, index) in data.options.headers" :key="index" style="margin-bottom: 5px;">
                <el-input type="textarea" clearable :rows="1" placeholder="KEY" size="mini"
                  style="width: 100px;margin-right:5px;" v-model="item.key"></el-input>

                <el-input type="textarea" clearable :rows="1" placeholder="VALUE" size="mini" style="width: 130px;"
                  v-model="item.value"></el-input>

                <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                  icon="el-icon-minus" style="padding: 4px;margin-left: 5px;"></el-button>

              </li>
            </ul>
            <div>
              <el-button type="text" @click="handleAddHeader">{{$t('fm.actions.add')}}</el-button>
            </div>
          </el-form-item>
        </template>
      </template>

      <template v-if="data.type=='blank'">
        <el-form-item :label="$t('fm.config.widget.defaultType')">
          <el-select v-model="data.options.defaultType">
            <el-option value="String" :label="$t('fm.config.widget.string')"></el-option>
            <el-option value="Object" :label="$t('fm.config.widget.object')"></el-option>
            <el-option value="Array" :label="$t('fm.config.widget.array')"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'component'">
        <el-form-item :label="$t('fm.config.widget.customTemplates')">
          <!-- <code-editor :key="data.key" mode="html" v-model="data.options.template" height="200px"></code-editor> -->
          <el-button style="width: 100%;" @click="handleSetTemplate">{{$t('fm.config.widget.setting')}}</el-button>
        </el-form-item>

        <code-dialog ref="codeDialog" mode="html" @on-confirm="handleTemplateConfirm"></code-dialog>
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item :label="$t('fm.config.widget.gutter')">
          <el-input type="number" v-model.number="data.options.gutter"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.flex')">
          <el-switch v-model="data.options.flex"></el-switch>
        </el-form-item>
        <!-- responsive -->
        <el-form-item :label="$t('fm.config.widget.responsive')">
          <el-switch v-model="data.options.responsive"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.columnOption')">
          <draggable tag="ul" :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}" handle=".drag-item">
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i
                  class="iconfont icon-icon_bars"></i></i>

              <el-input v-if="!data.options.responsive" :placeholder="$t('fm.config.widget.span')" size="mini"
                style="width: 100px;" type="number" v-model.number="item.span"></el-input>

              <template v-if="data.options.responsive">
                <div style="display: inline-block;">
                  <div style="display: flex; flex-direction: column; margin:0 10px 10px 10px;">
                    <span>
                      <span style="width: 25px; display: inline-block;">xs: </span>
                      <el-input placeholder="xs" size="mini" style="width: 100px;" type="number"
                        v-model.number="item.xs"></el-input>
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'<768px'"></pre>
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">sm: </span>
                      <el-input placeholder="sm" size="mini" style="width: 100px;" type="number"
                        v-model.number="item.sm"></el-input>
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥768px'"></pre>
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">md: </span>
                      <el-input placeholder="md" size="mini" style="width: 100px;" type="number"
                        v-model.number="item.md"></el-input>
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;" v-html="'≥992px'"></pre>
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">lg: </span>
                      <el-input placeholder="lg" size="mini" style="width: 100px;" type="number"
                        v-model.number="item.lg"></el-input>
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;"
                        v-html="'≥1200px'"></pre>
                    </span>
                    <span>
                      <span style="width: 25px; display: inline-block;">xl: </span>
                      <el-input placeholder="xl" size="mini" style="width: 100px;" type="number"
                        v-model.number="item.xl"></el-input>
                      <pre style="width: 55px; display: inline; color: #999; margin-left: 5px;"
                        v-html="'≥1920px'"></pre>
                    </span>
                  </div>
                </div>
              </template>

              <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"></el-button>

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">{{$t('fm.actions.addColumn')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.justify')" v-if="data.options.flex">
          <el-select v-model="data.options.justify">
            <el-option value="start" :label="$t('fm.config.widget.justifyStart')"></el-option>
            <el-option value="end" :label="$t('fm.config.widget.justifyEnd')"></el-option>
            <el-option value="center" :label="$t('fm.config.widget.justifyCenter')"></el-option>
            <el-option value="space-around" :label="$t('fm.config.widget.justifySpaceAround')"></el-option>
            <el-option value="space-between" :label="$t('fm.config.widget.justifySpaceBetween')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.align')" v-if="data.options.flex">
          <el-select v-model="data.options.align">
            <el-option value="top" :label="$t('fm.config.widget.alignTop')"></el-option>
            <el-option value="middle" :label="$t('fm.config.widget.alignMiddle')"></el-option>
            <el-option value="bottom" :label="$t('fm.config.widget.alignBottom')"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'tabs'">
        <el-form-item :label="$t('fm.config.widget.type')">
          <el-radio-group v-model="data.options.type">
            <el-radio-button label="">{{$t('fm.config.widget.default')}}</el-radio-button>
            <el-radio-button label="card">{{$t('fm.config.widget.card')}}</el-radio-button>
            <el-radio-button label="border-card">{{$t('fm.config.widget.borderCard')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.tabPosition')">
          <el-radio-group v-model="data.options.tabPosition">
            <el-radio-button label="top">{{$t('fm.config.widget.top')}}</el-radio-button>
            <el-radio-button label="left">{{$t('fm.config.widget.left')}}</el-radio-button>
            <el-radio-button label="right">{{$t('fm.config.widget.right')}}</el-radio-button>
            <el-radio-button label="bottom">{{$t('fm.config.widget.bottom')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.tabOption')">
          <draggable tag="ul" :list="data.tabs"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}" handle=".drag-item">
            <li v-for="(item, index) in data.tabs" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i
                  class="iconfont icon-icon_bars"></i></i>
              <el-input :placeholder="$t('fm.config.widget.tabName')" size="mini" style="width: 200px;"
                v-model="item.label"></el-input>

              <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"></el-button>

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddTab">{{$t('fm.actions.addTab')}}</el-button>
          </div>
        </el-form-item>
      </template>

      <el-form-item :label="$t('fm.config.widget.customClass')"
        v-if="Object.keys(data.options).includes('customClass')">
        <el-input v-model="data.options.customClass" clearable></el-input>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.attribute')">
        <el-checkbox v-model="data.options.dataBind"
          v-if="Object.keys(data.options).indexOf('dataBind')>=0 && !data.options.tableColumn"
          :disabled="data.type != 'blank' && data.type != 'component'">{{$t('fm.config.widget.dataBind')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.hidden"
          v-if="Object.keys(data.options).indexOf('hidden')>=0 && !data.options.tableColumn">
          {{$t('fm.config.widget.hidden')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.readonly" v-if="Object.keys(data.options).indexOf('readonly')>=0">
          {{$t('fm.config.widget.readonly')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.disabled" v-if="Object.keys(data.options).indexOf('disabled')>=0">
          {{$t('fm.config.widget.disabled')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.editable" v-if="Object.keys(data.options).indexOf('editable')>=0">
          {{$t('fm.config.widget.editable')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.clearable" v-if="Object.keys(data.options).indexOf('clearable')>=0">
          {{$t('fm.config.widget.clearable')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.arrowControl" v-if="Object.keys(data.options).indexOf('arrowControl')>=0">
          {{$t('fm.config.widget.arrowControl')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.isDelete" v-if="Object.keys(data.options).indexOf('isDelete')>=0">
          {{$t('fm.config.widget.isDelete')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.isEdit" v-if="Object.keys(data.options).indexOf('isEdit')>=0">
          {{$t('fm.config.widget.isEdit')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.showPassword" v-if="Object.keys(data.options).indexOf('showPassword')>=0">
          {{$t('fm.config.widget.showPassword')}}
        </el-checkbox>
        <el-checkbox v-model="data.options.showScore" v-if="Object.keys(data.options).indexOf('showScore')>=0">
          {{$t('fm.config.widget.showScore')}}
        </el-checkbox>

      </el-form-item>

      <template v-if="data.type != 'grid' && data.type != 'tabs'">

        <el-form-item :label="$t('fm.config.widget.validate')">
          <div class="validate-block" v-if="Object.keys(data.options).indexOf('required')>=0">
            <el-checkbox v-model="data.options.required">{{$t('fm.config.widget.required')}}</el-checkbox>

            <el-input size="mini" class="message-input" clearable v-model="data.options.requiredMessage"
              v-if="data.options.required" :placeholder="$t('fm.message.errorTip')"></el-input>
          </div>
          <div class="validate-block" v-if="Object.keys(data.options).indexOf('dataType')>=0">
            <el-checkbox v-model="data.options.dataTypeCheck" style="margin-right: 10px;"></el-checkbox>
            <el-select :disabled="!data.options.dataTypeCheck" v-if="Object.keys(data.options).indexOf('dataType')>=0"
              v-model="data.options.dataType" size="mini">
              <el-option value="string" :label="$t('fm.config.widget.string')"></el-option>
              <el-option value="number" :label="$t('fm.config.widget.number')"></el-option>
              <el-option value="integer" :label="$t('fm.config.widget.integer')"></el-option>
              <el-option value="float" :label="$t('fm.config.widget.float')"></el-option>
              <el-option value="url" :label="$t('fm.config.widget.url')"></el-option>
              <el-option value="email" :label="$t('fm.config.widget.email')"></el-option>
              <el-option value="hex" :label="$t('fm.config.widget.hex')"></el-option>
            </el-select>

            <el-input size="mini" class="message-input" clearable v-model="data.options.dataTypeMessage"
              v-if="data.options.dataTypeCheck" :placeholder="$t('fm.message.errorTip')"></el-input>
          </div>

          <div class="validate-block" v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-checkbox v-model="data.options.patternCheck" style="margin-right: 10px;"></el-checkbox>
            <el-input :disabled="!data.options.patternCheck" size="mini" v-model.lazy="data.options.pattern"
              style=" width: 240px;" :placeholder="$t('fm.config.widget.patternPlaceholder')"></el-input>
            <el-input size="mini" class="message-input" clearable v-model="data.options.patternMessage"
              v-if="data.options.patternCheck" :placeholder="$t('fm.message.errorTip')"></el-input>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
  <div v-else class="empty">
    {{$t('fm.description.configEmpty')}}
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import axios from 'axios'
  import CodeEditor from '../components/CodeEditor'
  import CodeDialog from './CodeDialog'

  export default {
    components: {
      Draggable,
      CodeEditor,
      CodeDialog
    },
    props: ['data'],
    data() {
      return {
        validator: {
          type: null,
          required: null,
          pattern: null,
          range: null,
          dictList: [],
          length: null
        }
      }
    },
    computed: {
      show() {
        if (this.data && Object.keys(this.data).length > 0 && this.data.key) {
          return true
        }
        return false
      }
    },
    methods: {
      getFileList(url) {
        var fileArra = [];
        url.split('|').forEach((item) => {
          if (item.trim().length > 0) {
            fileArra.push({
              name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
              url: item
            })
          }
        })
        return fileArra;
      },
      handleOptionsRemove(index) {
        if (this.data.type === 'grid') {
          this.data.columns.splice(index, 1)
        } else if (this.data.type === 'tabs') {
          this.data.tabs.splice(index, 1)
        } else if (this.data.type === 'imgupload' || this.data.type === 'fileupload') {
          this.data.options.headers.splice(index, 1)
        } else if(this.data.options.type=='signup-table'){
          this.data.options.modules.splice(index,1)
        }else {
          if (!this.data.options.remote && this.data.options.options[index].value) {
            this.data.options.defaultValue = typeof this.data.options.defaultValue === 'string' ? '' : []
          }

          this.data.options.options.splice(index, 1)
        }

      },
      handleAddOption() {
        if (this.data.options.showLabel) {
          this.data.options.options.push({
            value: this.$t('fm.config.widget.newOption'),
            label: this.$t('fm.config.widget.newOption')
          })
        } else {
          //报名赛项配置
          if (this.data.options.modules) {
            this.data.options.modules.push({
              value: this.$t('fm.config.widget.newOption')
            })
            return;
          }
          this.data.options.options.push({
            value: this.$t('fm.config.widget.newOption')
          })
        }

      },
      handleAddColumn() {
        this.data.columns.push({
          span: '',
          list: []
        })
      },
      handleAddTab() {
        let length = this.data.tabs.length

        this.data.tabs.push({
          label: this.$t('fm.config.widget.tab') + (length + 1),
          name: 'tab_' + new Date().getTime(),
          list: []
        })
      },
      handleAddHeader() {
        if ('headers' in this.data.options) {
          this.data.options.headers.push({
            key: '',
            value: ''
          })
        } else {

          this.$set(this.data.options, 'headers', [{
            key: '',
            value: ''
          }])
        }

      },
      generateRule() {
        this.data.rules = []
        Object.keys(this.validator).forEach(key => {
          if (this.validator[key]) {
            this.data.rules.push(this.validator[key])
          }
        })
      },
      handleSelectMuliple(value) {
        if (this.data.type == 'select') {
          if (value) {
            if (this.data.options.defaultValue) {
              this.data.options.defaultValue = [this.data.options.defaultValue]
            } else {
              this.data.options.defaultValue = []
            }

          } else {
            if (this.data.options.defaultValue.length > 0) {
              this.data.options.defaultValue = this.data.options.defaultValue[0]
            } else {
              this.data.options.defaultValue = ''
            }
          }
        }
      },

      handleSetTemplate() {
        this.$refs.codeDialog.open(this.data.options.template)
      },

      handleTemplateConfirm(value) {

        this.data.options.template = value

        this.$refs.codeDialog.close()
      },

      validateRequired(val) {
        if (val) {
          this.validator.required = {
            required: true,
            message: this.data.options.requiredMessage ? this.data.options.requiredMessage :
              `${this.$t('fm.config.widget.validatorRequired')}`
          }
        } else {
          this.validator.required = null
        }

        this.$nextTick(() => {
          this.generateRule()
        })
      },

      validateDataType(val) {
        if (!this.show) {
          return false
        }

        if (val && (this.data.options.dataTypeCheck || !Object.keys(this.data.options).includes('dataTypeCheck'))) {
          this.validator.type = {
            type: val,
            message: this.data.options.dataTypeMessage ? this.data.options.dataTypeMessage : this.$t(
              'fm.config.widget.validatorType')
          }
          // 解决 数字相关类型的 校验报错
          if (val == 'number' || val == "float" || val == "integer") {
            this.validator.type.type = 'number'
          }
        } else {
          this.validator.type = null
        }

        this.generateRule()
      },
      valiatePattern(val) {
        if (!this.show) {
          return false
        }

        if (val && (this.data.options.patternCheck || !Object.keys(this.data.options).includes('patternCheck'))) {
          this.validator.pattern = {
            pattern: val,
            message: this.data.options.patternMessage ? this.data.options.patternMessage : this.$t(
              'fm.config.widget.validatorPattern')
          }
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
            if (Object.keys(this.data.options).indexOf('defaultValue') >= 0)
              this.data.options.defaultValue = ''
          }
        }
      },
      'data.options.required': function(val) {
        this.validateRequired(val)
      },
      'data.options.requiredMessage': function(val) {
        this.validateRequired(this.data && this.data.options ? this.data.options.required : false)
      },
      'data.options.dataType': function(val) {
        this.validateDataType(val)
      },
      'data.options.dataTypeCheck': function(val) {
        this.validateDataType(this.data && this.data.options ? this.data.options.dataType : '')
      },
      'data.options.dataTypeMessage': function(val) {
        this.validateDataType(this.data && this.data.options ? this.data.options.dataType : '')
      },
      'data.options.pattern': function(val) {
        this.valiatePattern(val)
      },
      'data.options.patternCheck': function(val) {
        this.valiatePattern(this.data && this.data.options ? this.data.options.pattern : '')
      },
      'data.options.patternMessage': function(val) {
        this.valiatePattern(this.data && this.data.options ? this.data.options.pattern : '')
      }
    }
  }
</script>
