<template>
  <div class='outer-container'>
    <div v-if='history.length!==0'>
    <div class='history' v-for='blockage in history' v-bind:key='blockage._id'>
    <div class='reporter'>
    <div class='profile'>{{blockage.reporterUsername[0].toUpperCase()}}</div>
      <span class='username'>@{{blockage.reporterUsername}}</span>
    </div>
    <h1>{{  blockage.status.toUpperCase()  }}</h1>
      <span class="description" v-if='blockage.description.length!==0'>{{  blockage.description }}</span>
      <br>
      <span>{{  date(blockage)  }}</span>
    </div>
    </div>
    <div v-else>
      <span class='no-history'>No previous updates to show :/</span>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'History',
  props : {
    blockageData: Object,
    user: Object,
  },
  emits: [
  ],
  data () {
    return {
      blockages: [],
      history: [],
    };
  },
  computed() {
  },
  mounted() {

    axios.get(`/api/blockages`)
    .then((response) => {
      console.log('success fritter');
      let blockages = response.data.blockages;
      console.log(blockages);

      let currBlockage = this.blockageData;
      this.history = [];
      console.log('hiii');
      console.log(currBlockage.parentBlockage);
      console.log(this.blockages);
      currBlockage = currBlockage.parentBlockage ?
          blockages.filter((blockage) => blockage._id == currBlockage.parentBlockage)[0]
          : undefined;
      while (currBlockage) {
        this.history.push(currBlockage);
        currBlockage = currBlockage.parentBlockage ?
          blockages.filter((blockage) => blockage._id == currBlockage.parentBlockage)[0]
          : undefined;
      }
    }).catch((error) => {
      this.console.log(error);
    });
    console.log(this.history);
  },
  methods: {
    date(blockage) {
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(blockage.time/1000);
      return date.toLocaleString('en-US');
    },
  },
}
</script>

<style scoped>
.outer-container::-webkit-scrollbar {
  display: none;
}
.outer-container {
  background-color: rgb(67, 21, 142);
  padding: 20px;
  color: black;
  border-radius: 10px;
  width: 50%;
  height: 80%;
  overflow: scroll;
  /* background: rgba(63, 58, 58, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; */
  z-index: 6;
}

.no-history {
  color: white;
}

h1, h2 {
  color: rgb(69, 38, 118);
}
h1 {
  margin-top: -4px;
  font-size: 20px;
}
.checkboxes span {
  margin: 2px;
}

h2 {
  margin-bottom: 5px;
  /* margin-top: 100px; */
}

span{
  margin: 10px;
}

.username {
  font-weight: bold;
  font-size: 20px;
}
.reporter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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
  margin-right: 10px;
  font-weight: bold;
}
.icon {
  height: 25px;
  width: 25px;
  margin-right: 10px;
  margin-left: -2px;
  cursor: pointer;
}

.history {
  background-color: rgb(186, 186, 235);
  margin-bottom: 10px;
  padding: 5px 10px;
  padding-bottom: 10px;
  border-radius: 5px;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

.blockage-creator {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(186, 186, 235);

  /* height: 100px; */
  /* max-width: 500px; */
  height: fit-content;
  width: 300px;
  border: 3px solid rgb(111, 79, 199);
  border-radius: 15px;
  color: black;
  font-size: 15px;
  margin: 10px auto 10px auto;
  padding: 20px;
  /* padding-right: 12px; */
}


</style>