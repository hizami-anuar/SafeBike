<template>
  <div id="app">
    <NavBar 
      :loggedIn='loggedIn'
      :user='user'
      :alerts='alerts'
      :newAlerts='newAlerts'
    />
    <router-view
      id="page-content"
      :loggedIn="loggedIn"
      :user="user"
    />
  </div>
</template>

<script>
import { eventBus } from "@/main";
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: { NavBar },
  data() {
    return {
      loggedIn: false,
      user: undefined,
      timer: undefined,
      alerts: {},
      newAlerts: true,
      eventListeners: [
        {name: 'refresh-user', func: this.refreshUser},
        {name: 'refresh-notifs', func: this.refreshNotifications},
        {name: 'login-event', func: this.handleLogin},
        {name: 'logout-event', func: this.handleLogout},
        {name: 'clear-alerts', func: this.clearAlerts},
      ],
    }
  }, 
  async mounted() {
    await this.refreshUser();
    this.refreshNotifications();
    this.timer = setInterval(() => {
      this.refreshNotifications();
    }, 30000);

    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  }, 
  beforeDestroy() {
    clearInterval(this.timer);
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  methods: {
    // Check if the user is logged in.
    async refreshUser() {
      await axios.get('/api/session/')
        .then((res) => {
          this.user = res.data;
          this.loggedIn = true;
          if (!this.user) {
            this.user = undefined;
            this.loggedIn = false;
          }
        })
        .catch((err) => console.log(err));
    },
    handleLogin(response) {
      this.loggedIn = true;
      this.user = response.data;
      this.refreshNotifications();
    },
    handleLogout(/*response*/) {
      this.loggedIn = false;
      this.user = undefined;
      this.refreshNotifications();
    },
    async refreshNotifications() {
      if (!this.loggedIn) {
        return;
      }
      await axios.get(`/api/blockages/subscription?active=true`)
        .then((res) => {
          // console.log(res);
          this.alerts.summaryAlerts = res.data.alerts;
        }).catch((error) => {
          console.log(error);
        });
      await axios.get(`/api/notifications`)
        .then((res) => {
          const alerts = res.data.notifications;
          this.newAlerts = alerts.some((a) => !a.read);
          this.alerts.blockageAlerts = alerts;
        }).catch((error) => {
          console.log(error);
        });
    },
    clearAlerts() {
      this.newAlerts = false;
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#page-content {
  width: 100%;
  height: calc(100% - var(--navbar-height));
}
</style>
