<template>
  <div class="pending-blockage-content">
    <div class='header-div'>
      <div class='reporter'>
        <div class='profile'>{{reporter.username[0].toUpperCase()}}</div>
        <span class='username'>@{{reporter.username}}</span>
        <span v-if="reporter"> (L{{ reporter.activityLevel }})</span>
      </div>
      <div class='date'>
        <span>{{  date.split(',')[0] }}</span><br>
        <span>{{  date.split(',')[1] }}</span>
      </div>
      <span>(copy styles from blockage)</span>
    </div>
    <h1><s>{{ status.toUpperCase() }}</s> ⮕ {{ newStatus.toUpperCase()  }}</h1>
    <span class="description" v-if='newDescription.length!==0'>{{ newDescription }}</span>
    <button
      class='general-button back-button'
      @click="$emit('back')">
      Back
    </button>
    <span>Total Reputation: {{ reputation }}/3</span>
    <VoteIcons
      v-if="loggedIn"
      :blockageData="child"
      :loggedIn="loggedIn"
      :user="user"
    />
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
  background-color: rgb(169, 138, 218);
  padding: 10px;
  border-radius: 10px;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-top: 35px;
  margin-bottom: 25px;
}
</style>