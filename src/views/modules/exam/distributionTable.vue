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
    <vxe-table border auto-resize resizable height="300" size="small" ref="table" round show-header-overflow
      show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}" :export-config="{}"
      :data="dataList" :checkbox-config="{}" :merge-cells="mergeCells">
      <vxe-column field="roomCode" title="考场编号">
      </vxe-column>
      <vxe-column field="refereeName" title="裁判姓名">
         <template slot-scope="scope">
             <div>
               <span v-for="(item,index) in scope.row.refereeName" :key="index">{{item}}</span>
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
          var rows = item.teams.length; //行数

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
      },
      //处理裁判调整
      handleRefereeAdd(evt){
        var refereeIndex = evt.item.dataset.index;
        var roomCode = evt.item.dataset.roomcode;
        var targetRoomCode = evt.target.dataset.roomcode;
        //考场
        var room = this.list.find(item=>{
          return item.code == roomCode;
        })
        var referee = room.refereees[refereeIndex];
        //从源裁判表删除
        room.refereees.splice(refereeIndex,1);
        //目标考场
        var targetRoom = this.list.find(item=>{
          return item.code == targetRoomCode;
        })
        targetRoom.refereees.push(referee);
      },
      //处理赛队调整
      handleTeamAdd(evt){
        var schoolCode = evt.item.dataset.code;
        var roomCode = evt.item.dataset.roomcode;
        var targetRoomCode = evt.target.dataset.roomcode;
        //考场
        var room = this.list.find(item=>{
          return item.code == roomCode;
        })
        var schoolIndex = room.teams.findIndex(team=>{
          return team.schoolCode == schoolCode;
        })
        var team = room.teams[schoolIndex];
        //从源赛队表删除
        room.teams.splice(schoolIndex,1);
        //目标考场
        var targetRoom = this.list.find(item=>{
          return item.code == targetRoomCode;
        })
        targetRoom.teams.push(team);
      }
    },
    computed: {
      dataList() {
        var list = this.list;
        var dataList = [];
        list.forEach(item => {
          var teams = item.teams;
          var refereees = item.refereees;
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
        })
        return dataList
      }
    }
  }
</script>

<style>
</style>
