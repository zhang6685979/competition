<template>
  <div class="box-card">
    <template v-if="$route.query.keyword&&dataList.length>0">
      <div class="item" v-for="(item,index) in dataList" :key="index">
        <div class="left" v-if="item.type==1">
          <router-link class="thumbnail" :to="{path:'/news/'+item.id}">
            <img :src="item.image">
          </router-link>
        </div>
        <div class="right">
          <div class="item-heading">
            <div class="text-muted pull-right">
              <span>
                <i class="el-icon-view"></i> {{item.times}}</span> &nbsp;
              <span>
                <i class="el-icon-time"></i> {{item.updateDate.substring(0,10)}}</span>
            </div>
            <router-link :to="{path:'/'+(item.type==1?'news':'notice')+'/'+item.id}"  v-html="brightenKeyword(item.title)"></router-link>
          </div>
          <p class="item-content">
            {{item.describe0}}
          </p>
        </div>
      </div>

      <div class="pager">
        <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
          :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
        </el-pagination>
      </div>
    </template>
    <div class="error-tip" v-else>
      <img :src="require('../assets/images/symbol-icon.png')" alt="">
      <p>{{!$route.query.keyword?'请输入关键字才能进行检索!':'未查询相关信息，请更换关键字重新检索'}}</p>
    </div>
  </div>




</template>

<script>
  export default {
    data() {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    watch: {
      '$route.query.keyword': function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.getList();
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(currentPage) {
        var keyword = this.$route.query.keyword;
        if (!keyword) {
          return;
        }
        this.tablePage.currentPage = currentPage || 1;
        this.$http({
          url: '/public/search',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'key': keyword
          }
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.$forceUpdate()
        })
      },
      brightenKeyword(val) {
        var keyword = this.$route.query.keyword;
        if (keyword.length > 0) {
          let replaceReg = new RegExp(keyword, 'ig')
          let replaceString = `<font style="color: #f75353">${keyword}</font>`
          return val.replace(replaceReg, replaceString)
        } else {
          return val;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    height: 330px;
  }

  .box-card {
    width: 80%;
    margin: 0 auto;

    .item {
      border-bottom: 1px solid #C0C4CC;
      padding: 20px 0;
      display: flex;
      &:nth-last-child(2)
      {
        border:none;
      }

      .left {
        display: block;
        width: 240px;
        height: 160px;
        margin-right: 30px;
        img {
          width: 100%;
          height: 100%
        }

      }

      .right {
        flex:1;
        .item-heading {
          margin-top: 10px;

          a {
            font-size: 20px;
            font-weight: bold;
            color: #303133;
            line-height: 30px;
          }

          .text-muted {
            float: right;
            colot: #707070;
            font-size: 16px;
          }
        }

        .item-content {
          font-size: 16px;
          color: #707070;
          line-height: 30px;
        }
      }

    }

    .pager {
      text-align: center;
      padding: 20px;
    }
    .error-tip {
      width: 614px;
      height: 325px;
      margin: 0 auto;
      background: rgba(220, 0, 12, 0.07);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #DC000C;
      text-align: center;
      padding: 100px 0;

      p {
        margin-top: 20px;
      }
    }
  }
</style>
