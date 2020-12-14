<template>
  <div class="personel">
    <h1></h1>
    <Personelselector></Personelselector>
    <!-- <Showdata></Showdata> -->
  </div>
</template>

<script>
import Personelselector from '../components/PersonelSelector.vue'
import Showdata from '../components/showdata'

export default {
  data() {
    return {}
  },
  components: {
    Personelselector,
    Showdata
  }
}
</script>

<style></style>
