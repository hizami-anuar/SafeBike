<template>
  <main>
    <div class="map-container">
    <Map
      class='map'
      :blockages='blockages'
      :loggedIn='loggedIn'
      :user='user'
    />
    <Blockage
    v-if='currBlockage'
    :key='currBlockageId'
    :blockageData='currBlockage'
    :loggedIn='loggedIn'
    :user='user'/>
    </div>
    <!-- <Blockages
      :blockages='blockages'
      :loggedIn='loggedIn'
      :user='user'
      @refresh-blockages='refreshBlockages'
    /> -->
  </main>
</template>

<script>
import Map from '../components/Map.vue';

// import Blockages from '@/components/Blockages.vue';
import { eventBus } from "../main";
import Blockage from '@/components/Blockage.vue';

import axios from 'axios';

export default {
  name: 'Home',
  components: { Map, Blockage},
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  data () {
    return {
      blockages: [], // list of blockage objects to display 
      currBlockageId: undefined,
      currBlockage: undefined,
    }
  }, 
  computed: {
    // currBlockage () {
    //   return this.currBlockageId ?
    //     this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
    //     : undefined;
    // }
  },
  mounted() {
    this.getAllBlockages();
    eventBus.$on('refresh-blockages', this.refreshBlockages);
    eventBus.$on('open-marker', this.displayBlockage);
    eventBus.$on('close-marker', this.undisplayBlockage);
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
    },
    displayBlockage(id) {
      this.currBlockageId = id;
      console.log("displaying blockage " + id)
      this.currBlockage = this.currBlockageId ?
        this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
        : undefined;
    },
    undisplayBlockage() {
      this.currBlockageId = '';
      this.currBlockage = undefined;
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

.map {
  margin-right: 20px;
}

.map-container {
  display: flex;
  flex-direction: row;
  /* width: 80%; */
  justify-content: space-between;
}
</style>
