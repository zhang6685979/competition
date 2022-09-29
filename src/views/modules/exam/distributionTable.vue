<template>
  <div>
    <vxe-toolbar :refresh="{query: refreshList}" export>
      <template #buttons>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="edit">{{editMode?'取消编辑':'编辑'}}</el-button>
        <el-button type="success" size="small" icon="el-icon-refresh-right" @click="refreshList(true)">重新分配</el-button>
      </template>
    </vxe-toolbar>
    <div v-if="editMode">
      <p>提示：点击裁判和赛队标签卡进行拖动可进行字段定义分组</p>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>剩余裁判</span>
            </div>
            <draggable tag="div" :list="surplusReferees" group="referee">
                <el-tag v-for="(item,index) in surplusReferees" data-type="referee" :data-index="index" :key="index">{{item.name}}</el-tag>
            </draggable>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>剩余赛队</span>
            </div>
            <draggable tag="div" :list="surplusTeams" group="team">
                <el-tag v-for="(item,index) in surplusTeams" data-type="team" :data-index="index" :key="index">{{item.school}}</el-tag>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
      {{list}}
      <vxe-table border auto-resize resizable height="300" size="small" ref="table" round show-header-overflow
        show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}" :export-config="{}"
        :data="list" :checkbox-config="{}">
        <vxe-column field="code" title="考场编号">
        </vxe-column>
        <vxe-column title="裁判信息">
           <template slot-scope="scope">
                 <draggable tag="div" :list="scope.row.refereees" group="referee">
                     <el-tag v-for="(item,index) in scope.row.refereees" :data-index="index" :key="index">{{item.name}}</el-tag>
                 </draggable>
           </template>
        </vxe-column>
        <vxe-column title="赛队信息">
           <template slot-scope="scope">
                 <draggable tag="div" :list="scope.row.teams"  group="team">
                     <el-tag v-for="(item,index) in scope.row.teams" :data-index="index" :key="index">{{item.school}}</el-tag>
                 </draggable>
           </template>
        </vxe-column>

      </vxe-table>
    </div>
    {{dataList}}
    <vxe-table border auto-resize resizable height="300" size="small" ref="table" round show-header-overflow
      show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}" :export-config="{}"
      :data="dataList" :checkbox-config="{}" :merge-cells="mergeCells">
      <vxe-column field="roomCode" title="考场编号">
      </vxe-column>
      <vxe-column field="refereeName" title="裁判姓名">
         <template slot-scope="scope">
             <div>
               <span v-for="(item,index) in scope.row.refereeName" :key="index">{{item}}&nbsp;&nbsp;</span>
             </div>
         </template>
      </vxe-column>
      <vxe-column field="refereeSchool" title="裁判学校">
      </vxe-column>
      <vxe-column field="refereeCode" title="裁判代号">
      </vxe-column>
      <vxe-column field="refereeMobile" title="裁判电话">
      </vxe-column>
      <vxe-column field="school" title="参赛院校名称">
        <template slot-scope="scope">
              <span>{{scope.row.school}}</span>
        </template>
      </vxe-column>
      <vxe-column field="schoolCode" title="院校代号">
      </vxe-column>
      <vxe-column field="leader" title="领队姓名">
      </vxe-column>
      <vxe-column field="leaderMobile" title="领队电话">
      </vxe-column>
    </vxe-table>




  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      surplusTeams:{
        type: Array,
        default: []
      },
      surplusReferees:{
        type: Array,
        default: []
      }
    },
    components: {
      Draggable
    },
    watch: {
      list: {
        handler: function() {
          this.handleMerge()
        },
        deep: true
      }
    },
    data() {
      return {
        editMode:false,//编辑模式
        mergeCells: []
      }
    },
    mounted() {
      this.handleMerge();
    },
    methods: {
      edit(){
        this.editMode = !this.editMode;
      },
      handleMerge() {
        var mergeCells = [];
        var list = this.list;
        var row = 0;
        list.forEach((item, index) => {
          var rows = item.teams?item.teams.length:1; //行数
          for (var i = 0; i < 5; i++) {
            mergeCells.push({
              row: row,
              col: i,
              rowspan: rows,
              colspan: 1
            })
            if (i == 4) {
              row = row + rows;
            }
          }
          if (i == 4) {
            row = row + rows;
          }
        })
        this.mergeCells = mergeCells
      },
      refreshList(redo) {
        this.$emit('refreshList',redo||false);
      }
    },
    computed: {
      dataList() {
        var list = this.list;
        var dataList = [];
        list.forEach(item => {
          var teams = item.teams||[];
          var refereees = item.refereees||[];
          if(teams.length>0||refereees.length>0){
            //裁判信息
            var refereeInfo = {
              refereeName: [],
              refereeSchool: [],
              refereeCode: [],
              refereeMobile: []
            }
            refereees.forEach(referee => {
              refereeInfo.refereeName.push(referee.name);
              refereeInfo.refereeSchool.push(referee.school);
              refereeInfo.refereeCode.push(referee.code);
              refereeInfo.refereeMobile.push(referee.mobile);
            })
            teams.forEach(team => {
              dataList.push({
                roomCode: item.code,
                ...team,
                ...refereeInfo
              })
            })
          }else{
            item.teams = [];
            item.refereees = [];
            dataList.push({
              roomCode: item.code,
            })
          }

        })
        return dataList
      }
    }
  }
</script>

<style>
</style>
