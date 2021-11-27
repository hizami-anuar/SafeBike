<template>
  <div class="subscription-container">
    <h3>{{ subscription.name }}</h3>
    <div class="days-container">
    <div class="round" 
      v-for="(day, index) in DAYS"
      :key="index">
      <input type="checkbox" 
        :value="day"
        v-model="subscription.schedule.days[index]" 
        :id="`${1234}-${day}`"
        disabled />
      <label :for="`${1234}-${day}`">{{ day }}</label>
    </div>
    </div>
    <input type="time" v-model="subscription.schedule.startTime" disabled />
    <input type="time" v-model="subscription.schedule.endTime" disabled />
    <input type="submit" value="delete" v-on:click.prevent="deleteSubscription" />
  </div>
</template>

<script>
import { eventBus } from "@/main";

export default {
  name: 'SubscriptionItem',
  props: ['subscription', 'DAYS'],
  methods: {
    deleteSubscription() {
      eventBus.$emit('delete-subscription', { id: this.subscription._id })
    }
  },
}
</script>

<style scoped>
.subscription-container {
  margin: 5px;
  background: white;
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