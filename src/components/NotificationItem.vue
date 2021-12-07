<template>
  <div class="notification-container" @click="toggleRead">
    <router-link
      class='link-alert' 
      :to="`/?blockage=${blockage._id}`">
      <button class='alert-name'>{{blockage.location}}</button>
    </router-link>
    <div>
      <span class='blocked'>{{subscriptions}}</span>
    </div>
    <div>
      <span class='blocked'>{{blockage.reporter.username}}</span>
    </div>
    <div>
      <span class='unsafe'>{{blockage.description}}</span>
    </div>
  </div>
</template>

<script> // fix these styles for me thanks
import axios from 'axios';
import { eventBus } from "@/main";

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


#navbar a.router-link-exact-active {
  background-color: rgb(195, 159, 254);
  color: rgb(122, 17, 187);
}

.blocked {
  color: rgb(122, 17, 187);
  font-weight: bold;
}

.unsafe {
  color: rgb(250, 250, 78);
  font-weight: bold;
}
</style>