<template>
<<<<<<< HEAD
  <main>
    <div class="home">
      <!-- Hello world -->
      Double click on the map to create a new blockage.
    </div>
    <CreateBlockage/>
    <Blockage/>
  </main>
=======
  <div class="home">
    <p> Hello World! </p>
    <Map />
  </div>
>>>>>>> ddd11a6f5edcef2db141b8559736b6f38bcf042c
</template>

<script>
import Map from '../components/Map.vue';

import CreateBlockage from '@/components/CreateBlockage.vue';
import Blockage from '@/components/Blockage.vue';
// import App from '../App.vue';

export default {
<<<<<<< HEAD
  name: 'Home',
  components: { CreateBlockage, Blockage}
=======
  name: "Home",
  components: { Map },
  methods: {}
>>>>>>> ddd11a6f5edcef2db141b8559736b6f38bcf042c
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
