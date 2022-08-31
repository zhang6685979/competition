<template>
  <div class="page">
    <div class="bg-white top">
      <el-page-header @back="goBack" content="比赛详情" class="page-header"></el-page-header>
      <el-divider></el-divider>
      <el-tabs v-model="activeName" style="height: calc(100% - 84px);">
        <el-tab-pane label="信息填报" name="1">
          <CompetitionSignupList :id.sync="$route.query.cid"></CompetitionSignupList>
        </el-tab-pane>
        <el-tab-pane label="比赛轮次" name="2">
          <CompetitionRoundsList :id="$route.query.cid"></CompetitionRoundsList>
        </el-tab-pane>
        <el-tab-pane label="赛事风采" name="3">
          <CompetitionStyleList :id="$route.query.cid"></CompetitionStyleList>
        </el-tab-pane>
        <el-tab-pane label="赛事新闻" name="4">
          <NewsList :id="$route.query.cid"></NewsList>
        </el-tab-pane>
        <el-tab-pane label="赛事直播" name="5">
          <CompetitionLiveList :id="$route.query.cid"></CompetitionLiveList>
        </el-tab-pane>
        <el-tab-pane label="大赛设备" name="6">
          <CompetitionEquipmentForm :id="$route.query.cid"></CompetitionEquipmentForm>
        </el-tab-pane>
        <el-tab-pane label="通知公告" name="7">
          <AnnouncementList :id="$route.query.cid"></AnnouncementList>
        </el-tab-pane>
        <el-tab-pane label="资源下载" name="8">
          <CompetitionDownloadList :id="$route.query.cid"></CompetitionDownloadList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import AnnouncementList from '../announcement/AnnouncementList'
  import CompetitionDownloadList from './CompetitionDownloadList'
  import CompetitionEquipmentForm from './CompetitionEquipmentForm'
  import CompetitionLiveList from './CompetitionLiveList'
  import NewsList from '../news/NewsList'
  import CompetitionRoundsList from './CompetitionRoundsList'
  import CompetitionStyleList from './CompetitionStyleList'
  import CompetitionSignupList from './CompetitionSignupList'

  export default {
    data() {
      return {
        activeName: '1'
      }
    },
    components: {
      AnnouncementList,
      CompetitionDownloadList,
      CompetitionEquipmentForm,
      CompetitionLiveList,
      NewsList,
      CompetitionRoundsList,
      CompetitionStyleList,
      CompetitionSignupList
    },
    methods: {
      goBack() {
        this.$store.dispatch('tagsView/delView', {
          fullPath: this.$route.fullPath
        })
        this.$router.push({
          path: `/competition/CompetitionList`
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-divider--horizontal {
    margin: 10px 0;
  }
  .el-tabs__content{
    height: 100%;
    overflow: auto;
    .el-tab-pane{
      height:100%;
    }
  }
  .jp-center .page{overflow: auto!important;}
</style>
