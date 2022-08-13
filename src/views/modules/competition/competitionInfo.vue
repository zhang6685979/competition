<template>
  <div class="page">
    <div class="bg-white top">
      <el-page-header @back="goBack" content="比赛详情" class="page-header"></el-page-header>
      <el-divider></el-divider>
      <el-tabs v-model="activeName">
        <el-tab-pane label="报名管理" name="1">
          <CompetitionSignupList :id="$route.query.cid"></CompetitionSignupList>
        </el-tab-pane>
        <el-tab-pane label="比赛轮次" name="2">
          <CompetitionRoundsList :id="$route.query.cid"></CompetitionRoundsList>
        </el-tab-pane>
        <el-tab-pane label="赛事风采" name="3">
          <CompetitionStyleList :id="$route.query.cid"></CompetitionStyleList>
        </el-tab-pane>
        <el-tab-pane label="赛事新闻" name="4">
          <CompetitionNewsList :id="$route.query.cid"></CompetitionNewsList>
        </el-tab-pane>
        <el-tab-pane label="赛事直播" name="5">
          <CompetitionLiveList :id="$route.query.cid"></CompetitionLiveList>
        </el-tab-pane>
        <el-tab-pane label="大赛设备" name="6">
          <CompetitionEquipmentList :id="$route.query.cid"></CompetitionEquipmentList>
        </el-tab-pane>
        <el-tab-pane label="通知公告" name="7">
          <CompetitionAnnouncementList :id="$route.query.cid"></CompetitionAnnouncementList>
        </el-tab-pane>
        <el-tab-pane label="资源下载" name="8">
          <CompetitionDownloadList :id="$route.query.cid"></CompetitionDownloadList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import CompetitionAnnouncementList from './CompetitionAnnouncementList'
  import CompetitionDownloadList from './CompetitionDownloadList'
  import CompetitionEquipmentList from './CompetitionEquipmentList'
  import CompetitionLiveList from './CompetitionLiveList'
  import CompetitionNewsList from './CompetitionNewsList'
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
      CompetitionAnnouncementList,
      CompetitionDownloadList,
      CompetitionEquipmentList,
      CompetitionLiveList,
      CompetitionNewsList,
      CompetitionRoundsList,
      CompetitionStyleList,
      CompetitionSignupList
    },
    mounted() {

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

<style>
  .el-divider--horizontal {
    margin: 10px 0;
  }
</style>
