export const basicComponents = [{
    type: 'input',
    icon: 'icon iconfont icon-input',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      requiredMessage: '',
      dataType: '',
      dataTypeCheck: false,
      dataTypeMessage: '',
      pattern: '',
      patternCheck: false,
      patternMessage: '',
      placeholder: '',
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      showPassword: false,
      isShow: true,
      isSort: true,
      isSearch: true
    }
  },
  {
    type: 'textarea',
    icon: 'icon iconfont icon-diy-com-textarea',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      requiredMessage: '',
      disabled: false,
      pattern: '',
      patternMessage: '',
      placeholder: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'number',
    icon: 'icon iconfont icon-number',
    options: {
      width: '',
      required: false,
      requiredMessage: '',
      defaultValue: 0,
      min: 0,
      max: 9,
      step: 1,
      disabled: false,
      controlsPosition: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'radio',
    icon: 'icon iconfont icon-radio-active',
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      options: [{
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      required: false,
      requiredMessage: '',
      width: '',
      remote: false,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'checkbox',
    icon: 'icon iconfont icon-check-box',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      options: [{
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },
        {
          value: 'Option 3'
        }
      ],
      required: false,
      requiredMessage: '',
      width: '',
      remote: false,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'time',
    icon: 'icon iconfont icon-time',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      requiredMessage: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'date',
    icon: 'icon iconfont icon-date',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      requiredMessage: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'rate',
    icon: 'icon iconfont icon-pingfen1',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
      requiredMessage: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      showScore: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'color',
    icon: 'icon iconfont icon-color',
    options: {
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false,
      requiredMessage: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'select',
    icon: 'icon iconfont icon-select',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      requiredMessage: '',
      showLabel: false,
      width: '',
      options: [{
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        }, {
          value: 'Option 3'
        }
      ],
      remote: false,
      remoteType: 'option',
      remoteOption: '',
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'switch',
    icon: 'icon iconfont icon-switch',
    options: {
      defaultValue: false,
      required: false,
      requiredMessage: '',
      disabled: false,
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'slider',
    icon: 'icon iconfont icon-slider',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      requiredMessage: '',
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'text',
    icon: 'icon iconfont icon-wenzishezhi-',
    options: {
      defaultValue: 'This is a text',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'html',
    icon: 'icon iconfont icon-html',
    options: {
      defaultValue: '<b style="color: red;">\n\tThis is a HTML5\n</b>',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  }
]

export const advanceComponents = [
  {
    type: 'fileupload',
    icon: 'icon iconfont icon-wenjianshangchuan',
    options: {
      defaultValue: '',
      width: '',
      tokenFunc: '',
      token: '',
      domain: '',
      disabled: false,
      tip: '',
      action: '',
      customClass: '',
      disabled: false,
      required: false,
      limit: 9,
      multiple: false,
      isQiniu: false,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      headers: [],
      isShow: true,
      isSort: false
    }
  },
  {
    type: 'imgupload',
    icon: 'icon iconfont icon-tupian',
    options: {
      defaultValue: '',
      size: {
        width: 100,
        height: 100,
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      domain: '',
      disabled: false,
      readonly: false,
      required: false,
      limit: 8,
      multiple: false,
      isQiniu: false,
      isDelete: false,
      min: 0,
      isEdit: false,
      action: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      headers: [],
      isShow: true,
      isSort: false
    }
  },
  {
    type: 'editor',
    icon: 'icon iconfont icon-fuwenbenkuang',
    options: {
      defaultValue: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike',
          {
            'color': []
          },
          {
            'background': []
          },
          {
            'align': []
          },
          {
            'list': 'ordered'
          },
          {
            'list': 'bullet'
          },
          {
            'indent': '-1'
          },
          {
            'indent': '+1'
          }
        ],
        [{
          'font': []
        }, {
          'header': [1, 2, 3, 4, 5, 6, false]
        }],
        [{
          'script': 'sub'
        }, {
          'script': 'super'
        }],
        ['link', 'image', 'blockquote', 'code-block'],
        [{
          'direction': 'rtl'
        }],
        ['clean']
      ],
      disabled: false,
      required: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  },
  {
    type: 'cascader',
    icon: 'icon iconfont icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      required: false,
      clearable: false,
      remote: true,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      isSort: false,
      isSearch: false
    }
  },
  {
    type: 'table',
    icon: 'icon iconfont icon-table',
    options: {
      defaultValue: [],
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      isShow: true,
      disabled: false,
      required: false,
    },
    tableColumns: []
  },
  {
    type: 'user',
    icon: 'icon fa fa-user',
    options: {
      defaultType: 'String',
      customClass: '',
      width: '',
      limit: 1,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  }, {
    type: 'office',
    icon: 'icon fa fa-bank',
    options: {
      defaultType: 'String',
      customClass: '',
      width: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  }, {
    type: 'area',
    icon: 'icon fa fa-map',
    options: {
      defaultType: 'String',
      customClass: '',
      width: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  }, {
    type: 'dict',
    icon: 'icon fa fa-font',
    options: {
      defaultType: 'String',
      customClass: '',
      width: '',
      labelWidth: 100,
      isLabelWidth: false,
      dictType: '',
      hidden: false,
      dataBind: true,
      required: false,
      disabled: false,
      isShow: true,
      isSort: true,
      isSearch: false
    }
  }
]

export const layoutComponents = [{
    type: 'grid',
    icon: 'icon iconfont icon-RectangleCopy',
    columns: [{
        span: 12,
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
        list: []
      },
      {
        span: 12,
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
      customClass: '',
      hidden: false,
      flex: true,
      responsive: false
    }
  },
  {
    type: 'tabs',
    icon: 'icon iconfont icon-tabs',
    tabs: [{
      label: 'Tab 1',
      name: 'tab_1',
      list: []
    }],
    options: {
      type: '',
      tabPosition: 'top',
      customClass: '',
      hidden: false,
    }
  },
  {
    type: 'divider',
    icon: 'icon iconfont icon-fengexian',
    options: {
      hidden: false,
      contentPosition: 'left'
    }
  }
]
