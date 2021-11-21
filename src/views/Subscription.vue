<template>
  <div>
    <input type="submit" v-on:click.prevent="getSubscribedBlockages" value="Get Subscription">
    <div class="map-container">
      <Map
        :blockages='subscription'
        :loggedIn='loggedIn'
        :user='user'
        :circles='circles'/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";
import Map from '@/components/Map.vue';

export default {
  name: 'Subscription',
  components: { Map },
  props: ['loggedIn', 'user'],
  data() {
    return {
      blockages: [],
      subscription: [],
      circles: [],
      eventListeners: [
        {name: 'radius-changed', func: this.updateRegionRadius}
      ],
    }
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  mounted() {
    this.getSubscribedBlockages();
    this.getSubscription();
  },
  methods: {
    getSubscribedBlockages() {
      this.getSubscription();
      axios.get(`/api/blockages?subscription=true`)
        .then((response) => {
          console.log(response);
          this.subscription = response.data.blockages;
        }).catch((error) => {
          console.log(error);
        })
    },

    getSubscription() {
      axios.get(`/api/blockages/subscription`)
        .then((response) => {
          console.log(response);
          this.circles = response.data.subscription;
        }).catch((error) => {
          console.log(error);
        })
    },

    updateRegionRadius(data) {
      console.log('update');
      axios.patch(`/api/blockages/subscription/${data.id}`, {radius: data.radius})
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.getSubscribedBlockages();
    }
  },
}
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100%;
}
</style>