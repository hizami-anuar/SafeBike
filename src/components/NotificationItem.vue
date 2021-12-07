<template>
  <div class="notification-container" @click="toggleRead">
    <div class='reporter'>
      <div class='profile'>{{blockage.reporter.username[0].toUpperCase()}}</div>
      <span class='username'>@{{blockage.reporter.username}}</span>
      <span class='level'>(L{{blockage.reporter.activityLevel}})</span>
    </div>
    <div>
      <span class='regions'>Regions: {{subscriptions.join(', ')}}</span>
    </div>
    <div>
      <div class='blocked'>{{blockage.status}}</div>
      <div class='description'>{{blockage.description}}</div>    
    </div>
    <router-link
      class='link-alert' 
      :to="`/?blockage=${blockage._id}`">
      <button class='alert-name'>{{blockage.location.name}}</button>
    </router-link>
    <div class='date'>{{  date(blockage)  }}</div>
  </div>
</template>

<script> // fix these styles for me thanks
import axios from 'axios';
import { eventBus } from "@/main";

var moment = require('moment'); // require
moment().format(); 

export default {
  name: 'NotificationItem',
  props: ['alert'], // type Notification
  data() {
    return {
      read: this.alert.read,
    };
  },
  computed: {
    blockage() { console.log(this.alert); return this.alert.blockage; },
    subscriptions() { 
      // list of all names of subscriptions that caused this notification
      // (notifs from two subscriptions are combined if they're at the same time)
      return this.alert.subscriptions.map(s => s.name);
    },
  },
  mounted() {
    this.read = true;
    this.setRead();
  },
  methods: {
    date(blockage) {
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(blockage.time/1000);
      return moment(date).fromNow()
    },
    setRead: function() {
      const action = this.read ? 'read' : 'unread';
      axios.get(`/api/notifications/${action}/${this.alert._id}`)
        .then(() => {
          eventBus.$emit('refresh-notifs');
        }).catch((error) => {
          console.log(error);
        });
    },
    toggleRead: function() {
      this.read = !this.read;
      this.setRead();
    }
  },
}
</script>

<style scoped>
.notification-container {
  border: 3px solid rgb(255, 251, 198);
  padding: 10px;
  padding-left: 15px;
  border-radius: 2px;
  background-color: rgb(195, 159, 254);
  text-align: left;
  margin-top: 6px;
}

.profile {
  background-color: rgb(90, 0, 128);
  border-radius: 30px;
  color: rgb(254, 254, 254);
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30x;
  margin-right: 10px;
  /* font-weight: bold; */
}

.username {
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
}
.reporter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.alert-name {
  font-size: 20px;
  font-weight: bold;
  padding: 2px 10px;
  width: 100%;
  background-color: rgb(195, 159, 254);
  color: rgb(122, 17, 187);
  text-align: center;
  border: 3px rgb(122, 17, 187) solid;
  border-radius: 5px;
  margin-bottom: 10px;
}

.link-alert {
  text-decoration: none;
  background-color: none;
  padding: 0px;
  text-align: center;
  margin: 0px;
}
.alert-name:hover:enabled {
  background-color: rgb(252, 242, 185);
  cursor: pointer;
}

.regions {
  font-style: italic;
}

#navbar a.router-link-exact-active {
  background-color: rgb(195, 159, 254);
  color: rgb(122, 17, 187);
}

.blocked {
  color: rgb(122, 17, 187);
  font-weight: bold;
  text-align: center;
}

.unsafe {
  color: rgb(250, 250, 78);
  font-weight: bold;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  text-align: center;
}

.level {
  font-style: italic;
}

.date {
  text-align:right;
  width: 100%;
  margin-top: 10px;
  margin-bottom: -5px;
  color: rgb(90, 0, 128);
  font-style: italic;
}
</style>