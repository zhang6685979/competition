<template>
  <div class="custom-component">
    <p style="margin:0">{{options.downloadDesc}}</p>
    <el-button type="primary">{{options.btnText}}</el-button>
  <!-- <span>
      宽：<el-input v-model="dataModel.width" style="width: 200px;"></el-input>
    </span>
    <span>
      高：<el-input v-model="dataModel.height" style="width: 200px;"></el-input>
    </span> -->
  </div>
</template>

<script>
export default {
  name: 'download',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    options:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dataModel: this.value
    }
  },
  watch: {
    value (val) {
      this.dataModel = val
    },
    dataModel (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.custom-component{
  background: #eee;
  padding: 10px;

  span{
    +span{
      margin-left: 10px;
    }
  }
}
</style>
