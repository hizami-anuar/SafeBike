<template>
  <main>
    <Map/>
    <Blockage/>
  </main>
</template>

<script>
import Blockage from '@/components/Blockage.vue';
import Map from '../components/Map.vue';
// import App from '../App.vue';

export default {
  name: 'Home',
  components: { Blockage, Map }
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
