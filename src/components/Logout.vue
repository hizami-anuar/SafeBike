<template>
  <div>
    <nav class="header">

  <!-- Information on the right side of the navigation bar -->
      <div class='header-right'>
        <h1 v-if='loggedIn' class='username'>Welcome, {{user.username}}</h1>
        <img v-if='loggedIn' v-on:click.prevent="popupClicked=!popupClicked" src="@/assets/profile.png" class='account-icon'/>
          
        <div v-else class='guest-view'>
            <router-link v-if='onRegister || (!onLogin && !onRegister)' to='/login' class='account-info'> 
                <button class='login-button'>Login</button>
            </router-link>
            <router-link v-if='onLogin || (!onLogin && !onRegister)' to='/signup' class='account-info'> 
                <button class='signup-button'>Signup</button>
            </router-link>
        </div>
      </div>

    </nav>      
    <div v-if='loggedIn && popupClicked' class="popup">
      <button class='submit-button' v-on:click.prevent='logout'>Logout</button>
      <router-link v-if='loggedIn' to='/settings' >   
          <button class="submit-button" v-on:click="popupClicked=false">Settings</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import axios from "axios";
export default {
  name: 'Logout',
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  data() {
    return {
      popupClicked:false,
    }
  }, 
  computed: {
    onLogin() {
      return this.$route.name == 'Login'
    },
    onRegister() {
      return this.$route.name == 'Signup'
    }
  },
  methods: {
    logout() {
      axios.delete('/api/session')
        .then((response) => {
          eventBus.$emit("logout-event", response);
          this.logoutError = '';
          this.$router.push({name: 'Login'});
        }).catch((error) => {
          this.logoutError = error.response.data.error 
                              || error.response.data.message 
                              || "An unknown error occurred when logging you out.";
        })
    },
  }
}
</script>

<style scoped>

.header {
    /* background-color: #474973; */
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.login-button {
    padding: 7px 20px;
    font-size: 20px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold; 
    border-radius: 5px;
    /* background-color: none; */
    background: none;
    border: 3px rgb(81, 22, 121) solid;
    color: rgb(81, 22, 121);
}

.login-button:hover {
    background-color: rgb(252, 252, 188);
    color: rgb(81, 22, 121);
}

.signup-button {
    padding: 10px 20px;
    font-size: 20px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold; 
    border-radius: 5px;
    background-color: rgb(81, 22, 121);
    color: white;
    border: none;
}

.signup-button:hover {
    background-color: rgb(252, 252, 188);
    color: rgb(81, 22, 121);
}

.submit-button {
  background: none;
  background-color: rgb(109, 47, 180);
  border: none;
  padding: 5px;
  color: white;
  width: 100%;
  border-radius: 10px;
  font-size: 18px;
  margin-top: 10px;
}

.submit-button:hover {
    background-color: rgb(250, 255, 177);
    color: rgb(81, 22, 121);
}

button:disabled {
    background-color: rgb(148, 148, 148);
    color: rgb(235, 235, 235);
}

.popup {
    position: absolute;
    width: 21%;
    /* top: 100%; */
    /* left: 88%; */
    background-color: rgb(229, 198, 250);
    z-index: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    
}


.header-right {
    justify-content: flex-end;
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.guest-view a{
    font-size: 2em;
    color: rgb(81, 22, 121);
    text-decoration: none;
    width: 100%;
    text-align: center;
}

h1 {
    Color: rgb(59, 14, 123);
    font-style: italic;
    font-weight: normal;
    font-size: 22px;
}
.username {
    margin-left: auto;
    margin-right: 10px;
}

.logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    margin-left: 15px;
    
}
.account-icon {
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.account-info {
    width: 15%;
    margin: 5px;
}

</style>