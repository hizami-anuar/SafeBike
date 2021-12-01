<template>
  <div :class="containerClass" v-on:click="selectSubscription">
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
    <template v-if="editable">
      <span class="buttons-container">
        <button class="update-button" v-on:click.prevent="updateSubscription">Update</button>
        <button class="delete-button" v-on:click.prevent="deleteSubscription">Delete</button>
      </span>
    </template>
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
  computed: {
    containerClass () {
      return this.editable ? "subscription-container" : "subscription-container clickable";
    },
  },
  methods: {
    deleteSubscription() {
      eventBus.$emit('delete-subscription', this.subscription);
    },
    updateSubscription() {
      eventBus.$emit('update-subscription', this.subscription);
    },
    selectSubscription() {
      if (!this.editable) { eventBus.$emit('circle-clicked', this.subscription); }
    }
  },
}
</script>

<style scoped>
.subscription-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  border: 1px solid black;
  background-color: rgb(186, 186, 235);
  border: 3px solid rgb(111, 79, 199);
  border-radius: 15px;
}

.clickable:hover {
  cursor: pointer;
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

.buttons-container {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 100%;
}

.update-button {
  background: green;
}

.delete-button {
  background: red;
}

button {
  font-size: 25px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: bold;
  border-radius: 10px;
  height: 60%;
  margin-top: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(88, 44, 192);
  color: white;
  padding: 10px 15px;
  border: none;
}
</style>