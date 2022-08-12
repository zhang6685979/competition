<template>
	<div class="container">
    <el-carousel :interval="5000" height="320px">
      <el-carousel-item v-for="item in 4" :key="item">
        <img class="image" :src="require('../assets/images/bisai.png')"/>
      </el-carousel-item>
    </el-carousel>
    <div class="main-content">
      当前位置：首页-大赛专区
      <el-divider></el-divider>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-col :span="12" >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="require('../assets/images/bisai2.jpg')" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12" >
          <div class="bisai-info">
            <h5>2022一带一路暨金砖国家技能发展与技术创新大 赛之飞机维修赛项</h5>
            <p>飞机维修赛项包含三个模块：模块A直升机日常检查、模块B航空发动机部件拆装和模块C飞机液压系统排故。本赛项紧紧围绕飞机维修职业能力培养，以直升机、航空涡轮轴发动机及飞机液压系统为载体，充分展现直升机日常检查、航空发动机维护与飞机液压系统排故的全工作流程，全面考察参赛选手查阅飞机维修手册、飞机零部件拆装、软/硬管路施工、标准线路施工、故障诊断与排除等能力，集中检验教学成果。</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
</script>

<style scoped>
  .container{
    margin-top: 20px;
  }
  .main-content{max-width: 1200px;margin: 20px auto 0;}
  .image{width: 100%;height:100%;}
  .bisai-img{width:100%;height: 260px;}
  .bisai-info{background-color: #E0E1E4;height:260px;padding:20px;box-sizing: border-box;}
  .bisai-info h5{font-size:18px;color:#1A1718;font-weight: bold;margin-bottom: 20px;position: relative;padding-top:20px;}
  .bisai-info h5:after{content: "";display: block;width: 110px;height:10px;background-color: #E50006;position: absolute;left:0;top:0;}
</style>
