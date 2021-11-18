<template>
  <main>
    <Map/>
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
      blockages: [], // list of blockage objects to display 
    }
  }, 
  mounted() {
    this.blockages = this.getAllBlockages();
    eventBus.$on('refresh-blockages', this.refreshBlockages);
  },
  methods: {
    // fetch list of all blockages
    getAllBlockages() {
      axios.get(`/api/blockages`)
        .then((response) => {
          this.blockages = response.data.blockages;
        }).catch((error) => {
          this.console.log(error);
        });
    },
    refreshBlockages() {
      this.getAllBlockages(); // refresh list of blockages when edit, delete or post
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
