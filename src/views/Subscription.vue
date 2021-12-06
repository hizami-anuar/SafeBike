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
      <template v-if="createEnabled">
        <form class="subscriptions-form">
          <h1>New Alert</h1>
          <CreateSubscriptionItem 
            :DAY_NAMES='DAY_NAMES'
            :subscription='subscriptionFormData'
            @cancel='cancelCreate'
            :editable='true' />
        </form>
      </template>
      <template v-else-if="selectedCircle">
        <h1>Update Alert</h1>
        <SubscriptionItem 
          :DAY_NAMES='DAY_NAMES'
          :subscription='selectedCircle'
          @cancel='cancelSelect'
          :editable='true'/>
      </template>
      <template v-else>
        <h1>Subscriptions</h1>
        <SubscriptionItem 
          v-for='(subscription, index) in circles' 
          :key='index'
          :DAY_NAMES='DAY_NAMES'
          :subscription='subscription'
          :editable='false'/>
      </template>
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
      alertPrior: 0,
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
        {name: 'update-subscription', func: this.updateRegion},
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
    this.refreshSubscription();
  },
  methods: {
    refreshSubscription() {
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
          this.cancelCreate();
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
        })
    },

    deleteSubscription(data) {
      axios.delete(`/api/subscriptions/${data._id}`)
        .then((response) => {
          this.selectedCircleId = undefined;
          console.log(response);
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
        }) 
    },

    updateRegion(data) {
      console.log(data);
      this.selectRegion(data);
      axios.patch(`/api/subscriptions/${data._id}`, data)
        .then((response) => {
          console.log(response);
          this.cancelSelect();
          this.refreshSubscription();
        }).catch((error) => {
          console.log(error);
          this.refreshSubscription();
        })
    },

    updateCreateRegionRadius(data) {
      this.subscriptionFormData.radius = data.radius;
    },

    updateCreateRegionCenter(data) {
      this.subscriptionFormData.center.coordinates = data.center.coordinates;
    },

    selectRegion(data) {
      this.selectedCircleId = data._id;
    },

    cancelCreate() {
      this.resetSubscriptionForm();
      this.createEnabled = false;
    },

    cancelSelect() {
      this.selectedCircleId = undefined;
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