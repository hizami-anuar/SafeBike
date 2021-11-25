<template>
  <div class="subscription-page">
    <div class="map-container">
      <MapSubscription
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
        :circles='circles'/>
    </div>
    <div class="subscriptions-container">
      <input type="submit" v-on:click.prevent="addSubscription" value="Add Subscription">
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
              v-for="(day, index) in DAYS"
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
      </template>
      <br>
      <br>
      <template>
        <form class="subscriptions-form">
          <h1>Viewing Alert</h1>
          <h3>Name: {{ subscriptionFormData.name }}</h3>
          <div class="days-container">
            <div class="round" 
              v-for="(day, index) in DAYS"
              :key="index">
              <input type="checkbox" 
                :value="day"
                v-model="subscriptionFormData.days[index]" 
                :id="`${1234}-${day}`"
                disabled />
              <label :for="`${1234}-${day}`">{{ day }}</label>
            </div>
          </div>
          <input type="time" v-model="subscriptionFormData.startTime" disabled />
          <input type="time" v-model="subscriptionFormData.endTime" disabled />
          <div>{{ subscriptionFormData }}</div>
        </form>
      </template>
      <br>
      <br>
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
import MapSubscription from '@/components/MapSubscription';

export default {
  name: 'Subscription',
  components: { MapSubscription },
  props: ['loggedIn', 'user'],
  data() {
    return {
      DAYS: ["S", "M", "T", "W", "Th", "F", "Sa"],
      blockages: [],
      subscription: [],
      circles: [],
      createEnabled: false,
      createLocation: undefined,
      selectedCircle: undefined,
      subscriptionFormData: {
        name: undefined,
        days: [false, false, false, false, false, false, false],
        startTime: undefined,
        endTime: undefined,
      },
      eventListeners: [
        {name: 'circle-radius-changed', func: this.updateRegionRadius},
        {name: 'circle-center-changed', func: this.updateRegionCenter},
        {name: 'circle-clicked', func: this.selectRegion},
        {name: 'activate-create-subscription', func: this.activateCreateSubscription},
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
      axios.post(`/api/subscriptions`, {
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
    },

    activateCreateSubscription(data) {
      this.createEnabled = true;
      this.createLocation = data.center;
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

.subscription-item {
  margin: 5px;
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