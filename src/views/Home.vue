<template>
  <main>
    <Map/>
    <div class="home">
    </div>
    <Blockages
      v-bind:blockages='this.blockages'
      @refresh-blockages='refreshBlockages'/>
  </main>
</template>

<script>
import Map from '../components/Map.vue';

import Blockages from '@/components/Blockages.vue';
import { eventBus } from "../main";

import axios from 'axios';

export default {
  name: 'Home',
  components: { Map, Blockages},
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
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
