<template>
  <div class="subscription-container">
    <h3><input class="subscription-name" type="text" v-model="subscription.name" :disabled="!editable" /></h3>
    <Days 
      :DAY_NAMES="DAY_NAMES"
      :days="subscription.schedule.days"
      :editable="editable"
    />
    <Time
      :schedule="subscription.schedule"
      :editable="editable"
    />
    <input type="submit" value="Add Subscription" v-on:click.prevent="createSubscription" />
  </div>
</template>

<script>
import { eventBus } from "@/main";
import Days from "@/components/Days";
import Time from "@/components/Time";

export default {
  name: 'SubscriptionItem',
  props: ['subscription', 'editable', 'DAY_NAMES'],
  components: { Days, Time },
  methods: {
    createSubscription() {
      eventBus.$emit('create-subscription', this.subscription);
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

.subscription-name {
  font-size: 30px;
  color: rgb(104, 27, 192);
}

.subscription-name:disabled {
  background-color: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
  text-align: center;
}
</style>