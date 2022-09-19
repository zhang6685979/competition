<template>
  <div>
    <vxe-toolbar :refresh="{query: refreshList}" export>
      <template #buttons>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="">编辑</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table border auto-resize resizable height="300" size="small" ref="table" round show-header-overflow
      show-overflow highlight-hover-row :menu-config="{}" :print-config="{}" :import-config="{}" :export-config="{}"
      :data="dataList" :checkbox-config="{}" :merge-cells="mergeCells">
      <vxe-column field="roomCode" title="考场编号">
      </vxe-column>
      <vxe-column field="refereeName" title="裁判姓名">
      </vxe-column>
      <vxe-column field="refereeSchool" title="裁判学校">
      </vxe-column>
      <vxe-column field="refereeCode" title="裁判代号">
      </vxe-column>
      <vxe-column field="refereeMobile" title="裁判电话">
      </vxe-column>
      <vxe-column field="school" title="参赛院校名称">
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
  export default {
    props: {
      list: {
        type: Array,
        default: []
      }
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
        mergeCells: []
      }
    },
    mounted() {
      this.handleMerge();
    },
    methods: {
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
        })
        this.mergeCells = mergeCells
      },
      refreshList() {
        this.$emit('refreshList');
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
