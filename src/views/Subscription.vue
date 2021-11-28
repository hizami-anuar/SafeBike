<template>
  <div class="subscription-page">
    <div class="map-container">
      <MapSubscription
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
        :circles='circles'>
        <template v-slot:mapItems>
          <SubscriptionCircle
            v-for="(circle, index) in circles"
            :key="`circle-${index}`"
            :circle="circle"
            :selected="circle._id === selectedCircleId"
          />
          <CreateCircle
            :circle="subscriptionFormData"
          />
        </template>
      </MapSubscription>
    </div>
    <div class="subscriptions-container">
      <input type="submit" v-on:click.prevent="getSubscribedBlockages" value="Get Subscription">
      <template v-if="true">
        <form class="subscriptions-form">
          <h1>New Alert</h1>
          <CreateSubscriptionItem 
            :DAY_NAMES='DAY_NAMES'
            :subscription='subscriptionFormData'
            :editable='true' />
        </form>
      </template>
      <br>
      <br>
      <div>Current Selected Subscription:</div>
      <template v-if="selectedCircle">
        <SubscriptionItem 
          :DAY_NAMES='DAY_NAMES'
          :subscription='selectedCircle'
          :editable='true'/>
      </template>
      <div v-else>None selected.</div>
      <br>
      <br>
        <SubscriptionItem 
          v-for='(subscription, index) in circles' 
          :key='index'
          :DAY_NAMES='DAY_NAMES'
          :subscription='subscription'
          :editable='false'/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";
import MapSubscription from '@/components/MapSubscription';
import CreateSubscriptionItem from '@/components/CreateSubscriptionItem';
import SubscriptionItem from '@/components/SubscriptionItem';
import SubscriptionCircle from '@/components/map_components/SubscriptionCircle.vue';
import CreateCircle from '@/components/map_components/CreateCircle';

export default {
  name: 'Subscription',
  components: { MapSubscription, SubscriptionItem, CreateSubscriptionItem, CreateCircle, SubscriptionCircle },
  props: ['loggedIn', 'user'],
  data() {
    let blankSubscriptionFormData = {
      name: undefined,
      center: undefined,
      radius: undefined,
      schedule: {
        days: [false, false, false, false, false, false, false],
        startTime: "01:23",
        endTime: "12:34",
      }
    };
    return {
      DAY_NAMES: ["S", "M", "T", "W", "Th", "F", "Sa"],
      blockages: [],
      subscription: [],
      circles: [],
      createEnabled: false,
      createLocation: undefined,
      selectedCircleId: undefined,
      blankSubscriptionFormData: Object.assign({}, blankSubscriptionFormData),
      subscriptionFormData: Object.assign({}, blankSubscriptionFormData),
      eventListeners: [
        {name: 'circle-radius-changed', func: this.updateRegion},
        {name: 'circle-center-changed', func: this.updateRegion},
        {name: 'circle-clicked', func: this.selectRegion},
        {name: 'create-circle-radius-changed', func: this.updateCreateRegionRadius},
        {name: 'create-circle-center-changed', func: this.updateCreateRegionCenter},
        {name: 'activate-create-subscription', func: this.activateCreateSubscription},
        {name: 'create-subscription', func: this.createSubscription},
        {name: 'delete-subscription', func: this.deleteSubscription},
      ],
    }
  },
  computed: {
    selectedCircle() {
      return this.circles.filter(circle => circle._id === this.selectedCircleId)[0];
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

    createSubscription(data) {
      console.log(data);
      axios.post(`/api/subscriptions`, data)
        .then((response) => {
          console.log(response);
          this.resetSubscriptionForm();
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
        })
    },

    deleteSubscription(data) {
      axios.delete(`/api/subscriptions/${data.id}`)
        .then((response) => {
          this.selectedCircleId = undefined;
          console.log(response);
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
        }) 
    },

    updateRegion(data) {
      this.selectRegion({ id: data.id} );
      axios.patch(`/api/subscriptions/${data.id}`, data)
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.refreshSubscription();
    },

    updateCreateRegionRadius(data) {
      this.subscriptionFormData.radius = data.radius;
    },

    updateCreateRegionCenter(data) {
      this.subscriptionFormData.center.coordinates = data.center;
    },

    selectRegion(data) {
      this.selectedCircleId = data.id;
    },

    activateCreateSubscription(data) {
      this.createEnabled = true;
      this.createLocation = data.center;
      this.subscriptionFormData.center = { type: "Point", coordinates: data.center };
      this.subscriptionFormData.radius = 111111*0.01;
    },

    resetSubscriptionForm() {
      this.subscriptionFormData = {
        name: undefined,
        center: undefined,
        radius: undefined,
        schedule: {
          days: [false, false, false, false, false, false, false],
          startTime: "01:23",
          endTime: "12:34",
        }
      };
    },
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
  overflow-y: scroll;
}

.subscriptions-form {
  border: 1px solid black;
}

.days-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 30px;
}

.round {
  position: relative;
}

.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  left: 0;
  position: absolute;
  top: 0;
  width: 28px;
}

.round input[type="checkbox"] {
  visibility: hidden;
}

.round input[type="checkbox"]:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}
</style>