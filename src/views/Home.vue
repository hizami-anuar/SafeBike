<template>
  <main>
    <div class="home">
      <!-- Hello world -->
      Double click on the map to create a new blockage.
    </div>
    <CreateBlockage/>
    <Blockage/>
  </main>
</template>

<script>

import CreateBlockage from '@/components/CreateBlockage.vue';
import Blockage from '@/components/Blockage.vue';
// import App from '../App.vue';

export default {
  name: 'Home',
  components: { CreateBlockage, Blockage}
}
</script>
