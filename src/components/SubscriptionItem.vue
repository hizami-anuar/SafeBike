<template>
  <div :class="containerClass">
    <h3><input class="subscription-name" type="text" v-model="subscriptionName" :disabled="!editable" /></h3>
    <Days 
      :DAY_NAMES="DAY_NAMES"
      :days="subscription.schedule.days"
      :editable="editable"
    />
    <Time
      :schedule="subscription.schedule"
      :editable="editable"
    />
    <div class="edit-delete-buttons">
      <img v-if="!editable" class='icon' v-on:click="selectSubscription" src="@/assets/edit.png"/>
      <img v-if="!editable" class='icon' v-on:click.prevent="deleteSubscription" src="@/assets/delete.png"/>
    </div>
    <template v-if="editable">
      <span class="buttons-container">
        <button class="cancel-button" v-on:click.prevent="cancelSubscription">Cancel</button>
        <button class="update-button" :disabled='!updateSubEnabled' v-on:click.prevent="updateSubscription">Update</button>
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
    // whether we can update the currently editing subscription (check title and days are nonempty)
    updateSubEnabled() {
     return this.subscription.schedule.days.some((bool) => bool) && this.subscriptionName;
    }
  },
  data() {
    return {
      subscriptionName: this.subscription.name,
    }
  },
  emits: ['cancel'],
  methods: {
    deleteSubscription() {
      eventBus.$emit('delete-subscription', this.subscription);
    },
    updateSubscription() {
      eventBus.$emit('update-subscription', this.subscription);
    },
    selectSubscription() {
      if (!this.editable) { eventBus.$emit('circle-clicked', this.subscription); }
    }, 
    cancelSubscription() {
      this.$emit('cancel');
      this.subscriptionName = this.subscription.name;
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

.edit-delete-buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
  margin-right: -5px;
}

.clickable:hover {
  /* cursor: pointer; */
}
.icon {
  cursor: pointer;
}

.subscription-name {
  font-size: 30px;
  color: rgb(104, 27, 192);
  border-radius: 5px;
  border: none;
  padding-left: 10px;
}

.subscription-name {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.subscription-name:disabled {
  background-color: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
  text-align: center;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
}

.update-button {
  margin-right: 10px;
}

.cancel-button {
  margin-left: 10px;
  background: none;
  border: 3px rgb(88, 44, 192) solid;
  color: rgb(88, 44, 192);
  margin-right: 10px;
}

button {
  font-size: 20px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: bold;
  border-radius: 10px;
  height: 50%;
  margin-top: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(88, 44, 192);
  color: white;
  padding: 10px 15px;
  border: none;
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