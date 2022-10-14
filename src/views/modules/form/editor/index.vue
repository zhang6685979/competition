<template>
  <FormDesign ref="formDesign" :question-mode="true" v-if="isRouterAlive"/>
</template>
<script>
  import TduckForm, {
    FormDesign
  } from '@/components/tduck-form/TduckForm.common'
  import '@/components/tduck-form/TduckForm.css'
  import mixin from '../TduckFormMixin.js'

  export default {
    name: 'FormEditor',
    components: {
      FormDesign
    },
    mixins: [mixin],
    watch: {
      '$route.query.key': function(newVal) {
        if (newVal) {
         // this.isRouterAlive = false
          //this.$nextTick(() => (this.isRouterAlive = true))
        }
      }
    },
    data() {
      return {}
    },
    computed: {},
    methods: {

    }
  }
</script>

<style lang='scss'>
  .center-board {
    margin: 0px 370px 80px 270px;
  }
</style>
