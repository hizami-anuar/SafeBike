<template>
  <div id="app">
    <div id="nav">
      <div id='navbar'>
      <img class='logo' src="@/assets/navlogo.png"/>
      <h1>SafeBike</h1>
      <router-link class='link' to="/"><img class='icon' src="@/assets/home.png"/>Home</router-link>
      <router-link class='link' to="/account"><img class='icon' src="@/assets/profile.png"/>Account</router-link> 
      <router-link class='link' to="/debug">Debug</router-link>
      </div>
      <Logout
        :loggedIn='loggedIn'
        :user='user'/>
    </div>
    <router-view/>
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
    // Register some eventBus listeners

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

    eventBus.$on('login-event',  this.handleLogin);
    eventBus.$on('logout-event', this.handleLogout);
    eventBus.$on('login', this.login);
  }, 
  methods: {
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

html, body {
  margin: 0px;
  padding: 0px;
  background-color: rgb(255, 249, 213);
}

#navbar {
  display: flex;
  flex-direction: row;
  height: 70px;
  align-items: center;
}
button{
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
button:enabled {
  cursor: pointer;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -18px;
}

h1 {
  margin-right: 20px;
  color: rgb(104, 27, 192);
}

#nav {
  /* padding: 30px; */
  display: flex;
  height: 70px;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(227, 214, 255);
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: rgb(255, 255, 255);
  background-color: rgb(179, 127, 250);
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
