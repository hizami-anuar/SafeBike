<template>
  <div class="subscription-container">
    <h3>{{ subscription.name }}</h3>
    <Days 
      :DAY_NAMES="DAY_NAMES"
      :days="subscription.schedule.days"
      :editable="editable"
    />
    <div class="time-container">
      <input type="time" v-model="subscription.schedule.startTime" disabled />
      <span> - </span>
      <input type="time" v-model="subscription.schedule.endTime" disabled />
    </div>
    <input type="submit" value="delete" v-on:click.prevent="deleteSubscription" />
  </div>
</template>

<script>
import { eventBus } from "@/main";
import Days from "@/components/Days";

export default {
  name: 'SubscriptionItem',
  props: ['subscription', 'editable', 'DAY_NAMES'],
  components: { Days },
  methods: {
    deleteSubscription() {
      eventBus.$emit('delete-subscription', { id: this.subscription._id })
    }
  },
}
</script>

<style scoped>
.subscription-container {
  margin: 20px;
  border: 1px solid black;
  background-color: rgb(186, 186, 235);
  border: 3px solid rgb(111, 79, 199);
  border-radius: 15px;
}

.time-container {
  margin: 5px;
  color: black;
  font-size: 20px;
}

input[type="time"]:disabled {
  width: fit-content;
  color: black;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
}

input[type="time"]:disabled::-webkit-calendar-picker-indicator {
  display: none;
}
</style>