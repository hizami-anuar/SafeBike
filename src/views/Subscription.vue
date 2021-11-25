<template>
  <div class="subscription-page">
    <div class="map-container">
      <Map
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
        :circles='circles'/>
    </div>
    <div class="subscriptions-container">
      <input type="submit" v-on:click.prevent="addSubscription" value="Add Subscription">
      <input type="submit" v-on:click.prevent="getSubscribedBlockages" value="Get Subscription">
      <div>Current Selected Subscription:</div>
      <template v-if="selectedCircle">
        <div class="subscription-item">
          <div>ID: {{ selectedCircle._id }}</div>
          <div>Center: {{ selectedCircle.center.coordinates }}</div>
          <div>Radius: {{ selectedCircle.radius }}</div>
          <button v-on:click="deleteSubscription({id: selectedCircle._id})">Delete</button>
        </div>
      </template>
      <div v-else>None selected.</div>
      <br>
      <br>
      <div v-for='(circle, index) in circles' :key='index'>
        <template>
          <div class="subscription-item">
            <div>ID: {{ circle._id }}</div>
            <div>Center: {{ circle.center.coordinates }}</div>
            <div>Radius: {{ circle.radius }}</div>
            <div>Schedule: {{ circle.schedule }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";
import Map from '@/components/Map';

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
        {name: 'circle-radius-changed', func: this.updateRegionRadius},
        {name: 'circle-center-changed', func: this.updateRegionCenter},
        {name: 'circle-clicked', func: this.selectRegion},
      ],
      id: 0,
      selectedCircle: undefined,
    }
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  mounted() {
    console.log("mounted");
    this.refreshSubscription();
  },
  methods: {
    refreshSubscription() {
      console.log("refreshing");
      this.getSubscribedBlockages();
      this.getSubscription();
    },

    getSubscribedBlockages() {
      axios.get(`/api/blockages?subscription=true&active=true`)
        .then((response) => {
          console.log(response);
          this.blockages = response.data.blockages;
        }).catch((error) => {
          console.log(error);
        })
    },

    getSubscription() {
      axios.get(`/api/subscriptions`)
        .then((response) => {
          console.log(response);
          this.circles = response.data.subscription;
        }).catch((error) => {
          console.log(error);
        })
    },

    next() {
      return this.id++;
    },

    addSubscription() {
      axios.post(`/api/subscriptions`, {
          _id: this.next(),
          center: [42.35, -71.07],
          radius: 0.01*111111,
        })
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.refreshSubscription();
    },

    deleteSubscription(data) {
      axios.delete(`/api/subscriptions/${data.id}`)
        .then((response) => {
          this.selectedCircle = undefined;
          console.log(response);
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
        }) 
    },

    updateRegionRadius(data) {
      axios.patch(`/api/subscriptions/${data.id}/radius`, { radius: data.radius })
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.refreshSubscription();
    },

    updateRegionCenter(data) {
      axios.patch(`/api/subscriptions/${data.id}/center`, { center: data.center })
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.refreshSubscription();
    },

    selectRegion(data) {
      console.log(data);
      this.selectedCircle = this.circles.filter(circle => circle._id === data.id)[0];
    }
  },
}
</script>

<style scoped>
.subscription-page {
  display: flex;
  flex-direction: row;
}

.map-container {
  width: 50%;
  height: 100%;
}

.subscriptions-container {
  width: 50%;
  height: 100%;
}

.subscription-item {
  margin: 5px;
  border: 1px solid black;
}
</style>