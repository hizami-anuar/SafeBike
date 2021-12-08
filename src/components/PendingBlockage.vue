<template>
  <div class="pending-blockage-content">
    <div class='header-div'>
      <div class='reporter'>
        <div class='profile'>{{reporter.username[0].toUpperCase()}}</div>
        <span class='username'>@{{reporter.username}}</span>
        <span v-if="reporter"> (L{{ reporter.activityLevel }})</span>
      </div>
    </div>
    <h1><s>{{ status.toUpperCase() }}</s> ⮕ {{ newStatus.toUpperCase()  }}</h1>
    <span class="description" v-if='newDescription.length!==0'>{{ newDescription }}</span>
    <span>Total Reputation: {{ reputation }}/3</span>
    <VoteIcons
      v-if="loggedIn"
      :blockageData="child"
      :loggedIn="loggedIn"
      :user="user"
    />
    <div class='bottom-div'>
    <button
      class='general-button back-button'
      @click="$emit('back')">
      Back
    </button>
    <div class='date'>
      <span>{{  date.split(',')[0] }}</span><br>
      <span>{{  date.split(',')[1] }}</span>
    </div>
    </div>
  </div>
</template>

<script>
import VoteIcons from '@/components/VoteIcons.vue';

export default {
  name: 'PendingBlockage',
  components: { VoteIcons },
  props: {
    /** @type {Blockage} The blockage object whose child is being displayed */
    blockageData: Object,
    loggedIn: Boolean,
    user: Object
  },
  data () {
    return {}
  },
  computed: {
    child() { return this.blockageData.childBlockage; },
    status() { return this.blockageData.status; },
    newStatus() { return this.child.status; },
    newDescription() { return this.child.description; },
    reporter() { return this.child.reporter; },
    reputation() { return this.child.reputation; },
    date() { // formatted time for displaying (human readable) 
      // convert from unix epoch time to human readable date
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(this.child.time/1000);
      return date.toLocaleString('en-US');
    },
  },
  methods: {},
}
</script>

<style scoped>
h1 {
  color: rgb(69, 38, 118);
  font-size: 20px;
  margin: 0;
}

.pending-blockage-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(254, 248, 226);
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-top: 8px;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-top: 35px;
  margin-bottom: 25px;
}

.header-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
  padding: 0px;
  margin-top: 5px;
}

.bottom-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
  margin-top: 10px;
}

.reporter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-left: 10px;
}

.profile {
  background-color: rgb(90, 0, 128);
  border-radius: 30px;
  color: rgb(254, 254, 254);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  cursor: default;
  margin-right: 10px;
}

.username {
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
  margin-left: 0px;
  /* padding-left: 5px; */
}

.date {
  text-align: right;
  font-style: italic;
  color: rgb(90, 0, 128);
  margin-right: -5px;
  margin-bottom: -5px;
}
.back-button {
  height: 34px;
  border: 2px solid purple;
}
</style>