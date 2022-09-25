<template>
  <div class="page">
    <div class="bg-white top">
      <div class="pull-right">
        <el-button type="primary" icon="el-icon-view" @click="previewDialogVisible=true">
            预览
        </el-button>
        <el-button type="success" icon="el-icon-folder-add" @click="saveProjectAsTemplateHandle">
            保存至模板
        </el-button>
      </div>
      <el-page-header @back="goBack" content="问卷详情" class="page-header"></el-page-header>
      <el-divider></el-divider>
      <div class="main-container">
        <div class="left-menu-container">
          <el-menu :collapse="isCollapse" :default-active="defaultActiveMenu" class="el-menu-vertical"
            @select="menuSelectHandle">
            <el-menu-item v-for="menuItem in menuItemList" :key="menuItem.route" :index="menuItem.route">
              <i :class="menuItem.icon" />
              <span slot="title">{{ menuItem.title }}</span>
            </el-menu-item>
          </el-menu>
          <i v-if="!isCollapse" class="el-icon-d-arrow-left" @click="collapseHandle" />
          <i v-else class="el-icon-d-arrow-right" @click="collapseHandle" />
        </div>
        <div class="right-content-container">
          <component :is="defaultActiveMenu" :key="projectKey"></component>
        </div>
      </div>
      <el-dialog :visible.sync="previewDialogVisible" title="问卷预览" destroy-on-close fullscreen>
        {{title}}
        <pre-view :key="previewKey" :preview-qrcode="true"  :title="title"/>
      </el-dialog>
      <template-create ref="templateCreate" :form-key="projectKey"/>
    </div>
  </div>
</template>
</template>

<script>
  import PreView from '@/views/modules/form/preview'
  import TemplateCreate from '@/views/modules/project/template/create'

  import editor from './editor'
  import logic from './logic'
  import setting from './setting'
  import publish from './publish'
  import theme from './theme'
  import data from './data'
  import statistics from './statistics'

  export default {
    name: 'NewIndex',
    components: {
      TemplateCreate,
      PreView,
      editor,
      logic,
      setting,
      publish,
      theme,
      formData: data,
      statistics
    },
    data() {
      return {
        previewKey: +new Date(),
        previewDialogVisible: false,
        defaultActiveMenu: 'editor',
        projectKey: null,
        title:'',
        isCollapse: false,
        menuItemList: [{
            title: '编辑',
            icon: 'el-icon-edit',
            route: 'editor'
          },
          {
            title: '逻辑',
            icon: 'el-icon-menu',
            route: 'logic'
          }, {
            title: '外观',
            icon: 'el-icon-view',
            route: 'theme'
          },
          {
            title: '设置',
            icon: 'el-icon-setting',
            route: 'setting'
          },
          {
            title: '发布',
            icon: 'el-icon-video-play',
            route: 'publish'
          },
          {
            title: '数据',
            icon: 'el-icon-s-data',
            route: 'formData'
          },
          {
            title: '统计',
            icon: 'el-icon-data-line',
            route: 'statistics'
          }
        ]
      }
    },
    activated() {
      this.projectKey = this.$route.query.key
      this.title = this.$route.query.title
      this.defaultActiveMenu = this.$route.query.type||'editor'
    },
    methods: {
      menuSelectHandle(index) {
        this.defaultActiveMenu = index;
      },
      openPreviewHandle() {
        this.previewKey = +new Date()
        this.previewDialogVisible = true
      },
      saveProjectAsTemplateHandle() {
        this.$refs['templateCreate'].handleOpen()
      },
      collapseHandle() {
        let isCollapse = !this.isCollapse
        this.isCollapse = isCollapse
      },
      goBack() {
        this.$store.dispatch('tagsView/delView', {
          fullPath: this.$route.fullPath
        })
        this.$router.push({
          path: `/project/my/index`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-index-container {
    height: 100%;
    width: 100%;
  }

  ::v-deep .el-card__body {
    padding: 0;
  }

  ::v-deep .el-menu {
    border: none;
    background-color: transparent;
  }

  .header-container {
    width: 100%;
    height: 50px;
    padding: 0 20px;
    line-height: 50px;

    .el-icon-back {
      font-size: 22px;
      font-weight: 550;
      cursor: pointer;
      color: #000;
      margin-right: 75px;

      &:hover {
        color: rgb(32, 160, 255);
      }
    }

    .header-logo {
      height: 35px;
      width: 160px;
      vertical-align: middle;
    }
  }

  .main-container {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;

    .right-content-container {
      width: calc(100% - 100px);
      height: 100%;
      overflow-x: hidden;
    }
  }

  .left-menu-container {
    max-width: 100px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: solid 1px #e6e6e6;

    .el-menu-vertical:not(.el-menu--collapse) {
      width: 100px;
      min-height: 400px;
    }

    .el-icon-d-arrow-left,
    .el-icon-d-arrow-right {
      font-size: 19px;
      cursor: pointer;
      font-weight: 550;
      color: #000;
      margin-bottom: 100px;

      &:hover {
        color: rgb(32, 160, 255);
      }
    }
  }

  ::v-deep.preview-container {
    background-color: #ffffff;
  }
</style>
