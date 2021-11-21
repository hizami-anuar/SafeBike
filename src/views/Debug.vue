<template>
  <main class="two-col">
    <section id="operations-container">
      <h2>Operations:</h2>
      <span>
        <button class="button-mode" v-on:click="mode='users'">Users</button>
        <button class="button-mode" v-on:click="mode='blockages'">Blockages</button>
        <button class="button-mode" v-on:click="mode='subscription'">Subscription</button>
      </span>
      <div class="scrollbox">
        <template v-if="mode=='users'">
          <form>
            <span>
              <label>Username: </label>
              <input type="text" v-model="registrationFormData.username">
            </span>
            <span>
              <label>Password: </label>
              <input type="text" v-model="registrationFormData.password">
            </span>
            <input type="submit" v-on:click.prevent="createAccount" value="Create Account">
          </form>

          <form>
            <span>
              <label>Username: </label>
              <input type="text" v-model="loginFormData.username">
            </span>
            <span>
              <label>Password: </label>
              <input type="text" v-model="loginFormData.password">
            </span>
            <input type="submit" v-on:click.prevent="login" value="Login">
          </form>

          <form>
            <input type="submit" v-on:click.prevent="logout" value="Logout">
          </form>
        </template>
        
        <template v-else-if="mode=='blockages'">
          <form>
            <input type="submit" v-on:click.prevent="getBlockages" value="Get Blockages">
          </form>


          <form>
            <span>
              <label>Latitude: </label>
              <input type="number" class="small-input" v-model="blockageFormData.location.latitude">
              &nbsp;
              <label>Longitude: </label>
              <input type="number" class="small-input" v-model="blockageFormData.location.longitude">
            </span>
            <span>
              <label>Description: </label>
              <input type="text" v-model="blockageFormData.description">
            </span>
            <span>
              <label>Status: </label>
              <input type="text" v-model="blockageFormData.status">
            </span>
            <input type="submit" v-on:click.prevent="createBlockage" value="Create Blockage">
          </form>

          <DebugBlockageItem
            v-for="blockage in blockages"
            :key="blockage._id"
            :blockage="blockage"/>
        </template>

        <template v-else-if="mode=='subscription'">
          <input type="submit" v-on:click.prevent="getSubscription" value="Get Subscription">
          <div class="map-container">
            <Map
              class='map'
              :blockages='subscription'
              :loggedIn='loggedIn'
              :user='user'
              :circles='circles'
            />
          </div>
        </template>
      </div>
    </section>
    <section>
      <h2>Response:</h2>
      <div class="scrollbox">
        <pre id="response" class="teletype"></pre>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";
import DebugBlockageItem from '@/components/DebugBlockageItem';
import Map from '@/components/Map.vue';

export default {
  name: 'Debug',
  components: { DebugBlockageItem, Map },
  props: ['loggedIn', 'user'],
  data() {
    return {
      mode: 'users',
      blockages: [],
      subscription: [],
      circles: [
        {
          center: [42.35, -71.07],
          radius: 0.01*111111,
        }
      ],
      blockageFormData: {
        description: "",
        status: "",
        location: {
          latitude: 0,
          longitude: 0,
        }
      },
      loginFormData: {
        username: "",
        password: "",
      },
      registrationFormData: {
        username: "",
        password: "",
      },
      eventListeners: [
          {name: 'edit-blockage', func: this.editBlockage},
          {name: 'delete-blockage', func: this.deleteBlockage},
        ]
    }
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },

  methods: {
    showObject(obj) {
      const pre = document.getElementById("response");
      const preParent = pre.parentElement;
      pre.innerText = JSON.stringify(obj, null, 4);
      preParent.classList.add("flashing");
      setTimeout(() => preParent.classList.remove("flashing"), 300);
    },
  
    showResponse(axiosResponse) {
      const fullResponse =
        axiosResponse.response === undefined
          ? axiosResponse
          : axiosResponse.response;
      const abridgedResponse = {
        data: fullResponse.data,
        status: fullResponse.status,
        statusText: fullResponse.statusText,
      };
      this.showObject(abridgedResponse);
    },

    getSubscription() {
      axios.get(`/api/blockages?subscription=true`)
        .then((response) => {
          this.subscription = response.data.blockages;
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    getBlockages() {
      axios.get(`/api/blockages`)
        .then((response) => {
          this.blockages = response.data.blockages;
          this.blockages.forEach((blockage) => {
            const id = blockage._id;
            this.editFormData[id] = this.editFormData[id] || 
            {
              description: "",
              status: "",
              location: {
                latitude: 0,
                longitude: 0,
              }
            };
          }); 
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    createBlockage() {
      axios.post(`/api/blockages`, this.blockageFormData)
        .then((response) => {
          this.showResponse(response);
          this.getBlockages();
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    editBlockage(data) {
      const id = data.id;
      const blockageData = data.data;

      axios.patch(`/api/blockages/${id}`, blockageData)
        .then((response) => {
          this.showResponse(response);
          this.getBlockages();
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    deleteBlockage(data) {
      const id = data.id;

      axios.delete(`/api/blockages/${id}`)
        .then((response) => {
          console.log(response);
          this.showResponse(response);
          this.getBlockages();
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    createAccount() {
      axios.post('/api/users', this.registrationFormData)
        .then((response) => {
          console.log(response);
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    login() {
      axios.post('/api/session', this.loginFormData)
        .then((response) => {
          console.log(response);
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    logout() {
      axios.delete('/api/session')
        .then((response) => {
          console.log(response);
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

  }
}
</script>

<style scoped>

/* customize scrollbar for dark theme */
::-webkit-scrollbar {
  width: 12px;  /* for vertical scrollbars */
  height: 12px; /* for horizontal scrollbars */
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

.map-container {
  width: 50vh;
  height: 50vh;
}

form {
  display: flex;
  flex-direction: column;
}

body {
  
  height: 100vh;
  padding: 2vw;
  flex-direction: column;
  display: flex;
}

.two-col {
  --light-border: 1px solid lightgray;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  background: rgba(0,0,0,.8);
  color: white;
  height: 85vh;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
}

textarea {
  resize: none;
  height: 3rem;
}

input, textarea {
  border: var(--light-border);
}

input[type="submit"] {
  font-weight: bold;
}

.small-input {
  width: 100px;
}

.scrollbox {
  box-shadow: 0 0 0 1px #fff; /* add border but border is broken */
  padding: 3%;
  overflow-y: scroll;
}

.teletype {
  text-align: left;
  font-family: 'Courier New', Courier, monospace;
}

.item {
  text-align: left;
}

p {
  padding: 0px;
  margin: 0px;
}

input:hover:not(:focus) {
  box-shadow: inset 0 0 100px 100px rgba(238, 251, 50, 0.15);
}

input[type="submit"] {
  background: rgba(0,0,0,.05);
  color: white;
  font-size: 100%;
  line-height: 200%;
}

input[type="submit"]:hover {
  cursor: pointer;
  box-shadow: inset 0 0 100px 100px rgba(50, 251, 93, 0.15);
}

@keyframes flash {
  from {background-color: rgba(255, 255, 0, 0.3)}
  to {background-color: rgba(255, 255, 0, 0)}
}

.flashing {
  animation: flash 0.3s;
}

.button-mode {
  width: 50%;
  height: 50px;
}

</style>>