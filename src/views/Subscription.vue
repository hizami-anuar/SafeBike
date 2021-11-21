<template>
  <div>
    <input type="submit" v-on:click.prevent="getSubscription" value="Get Subscription">
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
      circles: [
        {
          _id: 'abcdef',
          center: [42.35, -71.07],
          radius: 0.01*111111,
        }
      ],
      eventListeners: [],
    }
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  methods: {
    getSubscription() {
      axios.get(`/api/blockages?subscription=true`)
        .then((response) => {
          console.log(response);
          this.subscription = response.data.blockages;
        }).catch((error) => {
          console.log(error);
        })
    },

    updateRegionRadius(data) {
      this.circles[0].radius = data.radius;
      this.getSubscription();
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