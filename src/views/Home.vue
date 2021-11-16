<template>
  <div class="home">
    <p> Hello World! </p>
    <Map />
  </div>
</template>

<script>
import Map from '../components/Map.vue';

export default {
  name: "Home",
  components: { Map },
  methods: {}
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
