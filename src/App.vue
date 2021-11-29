<template>
  <div id="app">
    <div id="navbar">
      <div id='navbar-left'>
        <router-link id='logo-div' to="/"><img class='logo' src="@/assets/navlogo.png"/></router-link>
        <h1>SafeBike</h1>
        <router-link class='link' to="/"><img class='icon' src="@/assets/home.png"/>Home</router-link>
        <router-link class='link' to="/account"><img class='icon' src="@/assets/profile.png"/>My Reports</router-link> 
        <router-link class='link' to="/subscription"><img class='icon' src="@/assets/notification-bell.png"/>My Alerts</router-link> 
      </div>
      <Logout
        :loggedIn='loggedIn'
        :user='user'/>
    </div>
    <router-view
      id="page-content"
      v-bind:loggedIn='loggedIn'
      v-bind:user='user'/>
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
      loginError: "",
      logoutError: "",
      // username: "",
      user: undefined,
    }
  }, 
  mounted() {
    this.refreshUser();

    // Register some eventBus listeners
    eventBus.$on('refresh-user', this.refreshUser);
    eventBus.$on('login-event',  this.handleLogin);
    eventBus.$on('logout-event', this.handleLogout);
    eventBus.$on('login', this.login);
  }, 
  methods: {
    refreshUser() {
      // Check if the user is already logged in.
      axios.get('/api/session/').then((res) => {
        // const currentUsername = res.data.username;
        // const currentUserId = res.data.id;
        // Empty username means not already logged in, which is assumed
        // if (currentUsername === "") return;
        // Update the data fields to reflect that we are already logged in.
        this.loggedIn = true;
        // this.username = currentUsername;
        this.user = res.data;
        return ;
      }).catch((err) => console.log(err));
    },
    handleLogin(response) {
      this.loggedIn = true;
      this.user = response.data;
    },
    handleLogout(/*response*/) {
      this.loggedIn = false;
      this.user = undefined;
    },
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


h1 {
  margin-right: 20px;
  color: rgb(104, 27, 192);
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
/* 
#logo-div a.router-link-exact-active {
  background-color: red;
  background: none;
} */

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


</style>
