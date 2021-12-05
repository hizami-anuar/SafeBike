<template>
  <div id="app">
    <div id="navbar">
      <div id='navbar-left'>
        <router-link id='logo-div' to="/"><img class='logo' src="@/assets/navlogo.png"/></router-link>
        <h1 class='logo-name'>SafeBike</h1>
        <router-link class='link' to="/"><img class='icon' src="@/assets/home.png"/>Home</router-link>
        <router-link class='link' to="/account" v-if="loggedIn"><img class='icon' src="@/assets/profile.png"/>My Reports</router-link> 
        <router-link class='link' to="/subscription" v-if="loggedIn"><img class='icon' src="@/assets/notification-bell.png"/>My Alerts</router-link> 
      </div>
      <Logout
        :loggedIn='loggedIn'
        :user='user'
        :alerts='alerts'
        :newAlerts='newAlerts'/>
    </div>
    <router-view
      id="page-content"
      :loggedIn="loggedIn"
      :user="user"
    />
  </div>
</template>

<script>
import { eventBus } from "@/main";
import Logout from '@/components/Logout.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: { Logout},
  data() {
    return {
      loggedIn: false,
      user: undefined,
      timer: undefined,
      alerts: [],
      newAlerts: true,
    }
  }, 
  mounted() {
    this.refreshUser();
    this.refreshNotifications();
    this.timer = setInterval(() => {
      this.refreshNotifications();
    }, 30000);

    // Register some eventBus listeners
    eventBus.$on('refresh-user', this.refreshUser);
    eventBus.$on('login-event',  this.handleLogin);
    eventBus.$on('logout-event', this.handleLogout);
    eventBus.$on('clear-alerts', this.clearAlerts);
  }, 
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    // Check if the user is logged in.
    refreshUser() {
      axios.get('/api/session/')
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
    },
    handleLogout(/*response*/) {
      this.loggedIn = false;
      this.user = undefined;
    },
    refreshNotifications() {
      axios.get(`/api/blockages/subscription?active=true`)
        .then((response) => {
          console.log(response);
          this.alerts = response.data.alerts;
          this.newAlerts = true; // TODO - CHECK IF NEW ALERTS FIRST
        }).catch((error) => {
          console.log(error);
        })
    },
    clearAlerts() {
      this.newAlerts = false;
    }
  }
}
</script>

<style>

#navbar-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#navbar {
  /* padding: 30px; */
  display: flex;
  height: var(--navbar-height);
  justify-content: space-between;
  align-items: center;
  background-color: rgb(227, 214, 255);
  z-index: 2;
  width: 100%;
  left: 0;
  top: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#navbar a.router-link-exact-active {
  color: rgb(255, 255, 255);
  background-color: rgb(179, 127, 250);
}

#logo-div {
  background: none !important;
}

#page-content {
  width: 100%;
  height: calc(100% - var(--navbar-height));
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-left: 20px;
}

.icon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  /* margin-left: 20px; */
}

.link {
  /* margin-right: 10px; */
  font-size: 20px;
  text-decoration: none;
  /* background-color: red; */
  padding: 20px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link:hover {
  background-color: rgb(252, 242, 185);
}

.logo-name {
  margin-right: 20px;
  color: rgb(104, 27, 192);
}


</style>
