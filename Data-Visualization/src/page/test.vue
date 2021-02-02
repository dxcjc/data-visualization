<template>

</template>

<script>
import {test} from '../API/test/test'

export default {
  name: "test",
  created:function () {
    this.getInfo({gameId:3})
  },
  methods:{
    async getInfo(gameId) {
      await test(gameId)
    }
  }
}
</script>

<style scoped>

</style>