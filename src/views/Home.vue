<template>
  <main>
    <Map/>
    <div class="home">
      <!-- Hello world -->
      Double click on the map to create a new blockage.
    </div>
    <CreateBlockage/>
    <Blockage/>
  </main>
</template>

<script>
import Map from '../components/Map.vue';

import CreateBlockage from '@/components/CreateBlockage.vue';
import Blockage from '@/components/Blockage.vue';
// import App from '../App.vue';

export default {
  name: 'Home',
  components: { CreateBlockage, Blockage, Map}
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
