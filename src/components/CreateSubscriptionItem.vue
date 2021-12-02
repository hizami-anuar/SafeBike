<template>
  <div class="subscription-container">
    <h2>Alert Name</h2>
    <input placeholder='school' class="subscription-name" type="text" v-model="subscription.name" :disabled="!editable" />
    <h3>Days</h3>
    <Days 
      :DAY_NAMES="DAY_NAMES"
      :days="subscription.schedule.days"
      :editable="editable"
    />
    <h3>Time</h3>
    <Time
      :schedule="subscription.schedule"
      :editable="editable"
    />
    <div class='buttons-div'>
    <button class='cancel-button' v-on:click="cancelCreate">Cancel</button>
    <button class='add-button' :disabled='!addEnabled' v-on:click.prevent="createSubscription">Add Subscription</button>
    </div> 
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
  emits: ['cancel'],
  computed: {
    addEnabled() {
      return this.subscription.schedule.days.some((bool) => bool) && this.subscription.name;
    }
  },
  methods: {
    createSubscription() {
      eventBus.$emit('create-subscription', this.subscription);
    }, 
    cancelCreate() {
      this.$emit('cancel');
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

.subscription-name {
  font-size: 25px;
  color: rgb(104, 27, 192);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  border: none;
  border-radius: 5px;
  padding: 3px;
  padding-left: 10px;
}

.subscription-name:disabled {
  background-color: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
  text-align: center;
}

h2 {
  font-size: 25px;
  margin-bottom: 8px;
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
.buttons-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.add-button {
  margin-bottom: 15px;
  margin-right: 10px;
}
.cancel-button {
  margin-left: 10px;
  background: none;
  border: 3px rgb(88, 44, 192) solid;
  color: rgb(88, 44, 192);
  margin-right: 10px;
}

button:disabled {
	background-color: rgb(148, 148, 148);
	color: rgb(235, 235, 235);
}

button:hover:enabled {
	background-color: rgb(254, 247, 158);
	color: rgb(90, 7, 131);
	cursor: pointer;
}
</style>