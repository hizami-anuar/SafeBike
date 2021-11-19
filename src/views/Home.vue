<template>
  <main>
    <Map
      :blockages='blockages'
      :loggedIn='loggedIn'
    />
    <Blockages
      :blockages='blockages'
      :loggedIn='loggedIn'
      :user='user'
      @refresh-blockages='refreshBlockages'
    />
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
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  data () {
    return {
      blockages: [], // list of blockage objects to display 
    }
  }, 
  mounted() {
    this.getAllBlockages();
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
