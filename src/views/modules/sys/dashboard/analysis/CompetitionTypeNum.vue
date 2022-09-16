<template>
  <div class="type-num">
    <ve-histogram height="400px" :legend-visible="false" :data="data" :colors="['#3aa1ff']" auto-resize>
    </ve-histogram>
  </div>
</template>

<script>
  import { VeHistogram } from 'v-charts/lib/index.esm'

  export default {
    name: 'CellNum',
    components: {
      'VeHistogram': VeHistogram
    },
    data() {
      return {
        data: {
          rows: [],
          columns: []
        }
      }
    },
    methods: {
      /**
       * 获取不同分类的比赛数量
       */
      getTypes() {
        this.$http({
          url: '/statistics/competitiontypes',
          methods: 'get'
        }).then(({
          data
        }) => {
          var xData = [],
            yData = [];
            this.data.columns = ['比赛类型','比赛数量'];
          if (data && data.length > 0) {
            data.forEach(item => {
              xData.push(item.key);
              yData.push(item.value);
              this.data.rows.push({'比赛类型':item.key,'比赛数量':item.value})
            });
          }
        })
      }
    },
    mounted() {
      this.getTypes()
    }
  }
</script>

<style scoped lang="less">
  .type-num {
    .echarts {
      width: 100%;
      height: 400px;
    }
  }
</style>
