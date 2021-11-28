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
          <label>Name: </label><input type="text" v-model="subscriptionFormData.name"/>
          <h3>Location</h3>
          <div>{{ createLocation }}</div>
          <div>{{ subscriptionFormData.days }}</div>
          <div class="days-container">
            <div class="round" 
              v-for="(day, index) in DAY_NAMES"
              :key="index">
              <input type="checkbox" 
                :value="day"
                v-model="subscriptionFormData.days[index]" 
                :id="`checkbox-${day}`"/>
              <label :for="`checkbox-${day}`">{{ day }}</label>
            </div>
          </div>
          <div>
            <label>Start Time: </label>
            <input type="time" v-model="subscriptionFormData.startTime" />
          </div>
          <div>
            <label>End Time: </label>
            <input type="time" v-model="subscriptionFormData.endTime" />
          </div>
        </form>
        <input type="submit" v-on:click.prevent="addSubscription" value="Add Subscription">
        <div>{{ subscriptionFormData }}</div>
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
import SubscriptionItem from '@/components/SubscriptionItem';
import SubscriptionCircle from '@/components/map_components/SubscriptionCircle.vue';
import CreateCircle from '@/components/map_components/CreateCircle';

export default {
  name: 'Subscription',
  components: { MapSubscription, SubscriptionItem, CreateCircle, SubscriptionCircle },
  props: ['loggedIn', 'user'],
  data() {
    let blankSubscriptionFormData = {
      name: undefined,
      center: undefined,
      radius: undefined,
      days: [false, false, false, false, false, false, false],
      startTime: "01:23",
      endTime: "12:34",
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
        {name: 'circle-radius-changed', func: this.updateRegionRadius},
        {name: 'circle-center-changed', func: this.updateRegionCenter},
        {name: 'circle-clicked', func: this.selectRegion},
        {name: 'create-circle-radius-changed', func: this.updateCreateRegionRadius},
        {name: 'create-circle-center-changed', func: this.updateCreateRegionCenter},
        {name: 'activate-create-subscription', func: this.activateCreateSubscription},
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

    addSubscription() {
      axios.post(`/api/subscriptions`, this.subscriptionFormData)
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

    updateRegionRadius(data) {
      this.selectRegion({ id: data.id} );
      axios.patch(`/api/subscriptions/${data.id}/radius`, { radius: data.radius })
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      this.refreshSubscription();
    },

    updateRegionCenter(data) {
      this.selectRegion({ id: data.id} );
      axios.patch(`/api/subscriptions/${data.id}/center`, { center: data.center })
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
        days: [false, false, false, false, false, false, false],
        startTime: "01:23",
        endTime: "12:34",
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