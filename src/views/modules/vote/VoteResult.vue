<template>
  <el-dialog title="投票结果" :visible.sync="visible" :append-to-body="true">
    <div class="page">
      <div class="bg-white top">
        <vxe-toolbar :refresh="{query: getResult}">
        </vxe-toolbar>
        <div style="height: 400px;">
          <vxe-table border="inner" auto-resize resizable height="auto" :loading="loading" size="small"
            ref="voteOptionTable" show-header-overflow show-overflow highlight-hover-row :data="dataList" >
            <vxe-column field="sid" sortable title="编号">
              <template slot-scope="scope">
                {{scope.row.sid}}号
              </template>
            </vxe-column>
            <vxe-column type="seq" title="名次"></vxe-column>
            <vxe-column field="name" sortable title="选项名称">
            </vxe-column>
            <vxe-column field="image" sortable title="选项图片">
              <template slot-scope="scope" v-if="scope.row.image">
                <el-image style="height: 50px;width:50px;margin-right:10px;" :src="src"
                  v-for="(src, index) in scope.row.image.split('|')" :key="index"
                  :preview-src-list="scope.row.image.split('|')">
                </el-image>
              </template>
            </vxe-column>
            <vxe-column field="votes" sortable title="票数">
              <template slot-scope="scope">
                {{scope.row.votes}}票({{scope.row.percent}}%)
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script>
  export default {
    data() {
      return {
        id:'',
        searchForm: {
          subject: ''
        },
        dataList: [],
        loading: false,
        visible:false
      }
    },
    methods: {
      init(id){
        this.id = id;
        this.getResult();
      },
      getResult(){
        var id = this.id;
        this.loading = true;
        this.sumVotes = 0;
        this.$http({
          url: '/vote/voteSubject/result',
          method: 'get',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.loading = false;
          this.dataList = data;
          this.visible = true;
        })
      }
    }
  }
</script>
