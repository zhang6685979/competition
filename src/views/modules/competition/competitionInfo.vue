<template>
	<div class="page">
		 <div class="bg-white top">
			 <el-page-header @back="goBack" content="比赛详情" class="page-header"></el-page-header>
		 </div>
	</div>
</template>

<script>
	export default {
		methods:{
			goBack () {
			  this.$store.dispatch('tagsView/delView', {fullPath: this.$route.fullPath})
			  this.$router.push({path: `/competition/CompetitionList`})
			}
		}
	}
</script>

<style>
</style>
