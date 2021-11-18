<template>
  <main>
    <Map/>
    <div class="home">
      <!-- Hello world -->
      Double click on the map to create a new blockage.
    </div>
    <CreateBlockage/>
    <Blockages
      v-bind:blockages='this.blockages'
      @refresh-blockages='refreshBlockages'/>
    <!-- <Blockage/> -->
  </main>
</template>

<script>
import Map from '../components/Map.vue';

import CreateBlockage from '@/components/CreateBlockage.vue';
// import Blockage from '@/components/Blockage.vue';
import Blockages from '@/components/Blockages.vue';
// import App from '../App.vue';
import { eventBus } from "../main";

import axios from 'axios';

export default {
  name: 'Home',
  components: { CreateBlockage, Map, Blockages},
  data () {
    return {
      blockages: [],
    }
  }, 
  mounted() {
    this.blockages = this.getAllBlockages();
    eventBus.$on('refresh-blockages', this.refreshBlockages);
  },
  methods: {
    getAllBlockages() {
      axios.get(`/api/blockages`)
        .then((response) => {
          this.blockages = response.data.blockages;
          console.log(this.blockages);
        }).catch((error) => {
          this.console.log(error);
        });
    },
    refreshBlockages() {
      this.getAllBlockages();
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
