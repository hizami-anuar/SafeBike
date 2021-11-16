<template>
  <main class="two-col">
    <section id="operations-container">
      <h2>Operations:</h2>
      <div class="scrollbox">
        <form>
          <input type="submit" v-on:click.prevent="getBlockages" value="Get Blockages">
        </form>

        <form>
          <input type="submit" v-on:click.prevent="createBlockage" value="Create Blockage">
        </form>

        <form id="create-user">
          <h3>Create User</h3>
          <div>
            <label for="username">Username:</label>
            <input id="username" name="username">
          </div>
          <div>
            <label for="password">Password:</label>
            <input id="password" name="password">
          </div>
          <input type="submit" value="Create User">
        </form>

        <form id="delete-user">
          <h3>Delete User</h3>
          <input type="submit" value="Delete User">
        </form>

        <form id="change-username">
          <h3>Change Username</h3>
          <div>
            <label for="username">New Username:</label>
            <input id="username" name="username">
          </div>
          <input type="submit" value="Change Username">
        </form>

        <form id="change-password">
          <h3>Change Password</h3>
          <div>
            <label for="password">New Password:</label>
            <input id="password" name="password">
          </div>
          <input type="submit" value="Change Password">
        </form>

        <form id="sign-in">
          <h3>Sign In</h3>
          <div>
            <label for="username">Username:</label>
            <input id="username" name="username">
          </div>
          <div>
            <label for="password">Password:</label>
            <input id="password" name="password">
          </div>
          <input type="submit" value="Sign In">
        </form>

        <form id="sign-out">
          <h3>Sign Out</h3>
          <input type="submit" value="Sign out">
        </form>

        <form id="view-all-freets">
            <h3>View All Freets</h3>
            <input type="submit" value="View All Freets">
          </form>

        <form id="view-freets-by-author">
          <h3>View Freets By Author</h3>
          <div>
            <label for="author">Author:</label>
            <input id="author" name="author">
          </div>
          <input type="submit" value="View Freets By Author">
        </form>

        <form id="create-freet">
          <h3>Create Freet</h3>
          <div>
            <label for="content">Content:</label>
            <textarea id="content" name="content"></textarea>
          </div>
          <input type="submit" value="Create Freet">
        </form>

        <form id="edit-freet">
          <h3>Edit Freet</h3>
          <div>
            <label for="id">ID:</label>
            <input id="id" name="id">
          </div>
          <div>
            <label for="content">Content:</label>
            <textarea id="content" name="content"></textarea>
          </div>
          <input type="submit" value="Edit Freet">
        </form>

        <form id="delete-freet">
          <h3>Delete Freet</h3>
          <div>
            <label for="id">ID:</label>
            <input id="id" name="id">
          </div>
          <input type="submit" value="Delete Freet">
        </form>
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

export default {
  name: 'Debug',
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

    getBlockages() {
      axios.get("/api/blockages")
        .then((response) => {
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },

    createBlockage() {
      axios.post("/api/blockages")
        .then((response) => {
          this.showResponse(response);
        }).catch((error) => {
          this.showResponse(error);
        })
    },
    
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

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

body {
  
  height: 100vh;
  padding: 2vw;
  flex-direction: column;
  display: flex;
}

main {
  --light-border: 1px solid lightgray;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  background: rgba(0,0,0,.8);
  color: white;
  height: 85vh;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
}

main > * {
  flex: 1 1 320px;
  margin: 1%;
}

section {
  display: flex;
  flex-direction: column;
}

section .scrollbox {
  flex: 1 0 50vh;
}

form {
  border: var(--light-border);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255,255,255,.1);
}

form > div {
  display: flex;
  flex-direction: column;
}

form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
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

.scrollbox {
  box-shadow: 0 0 0 1px #fff; /* add border but border is broken */
  padding: 3%;
  overflow-y: scroll;
}

.teletype {
  text-align: left;
  font-family: 'Courier New', Courier, monospace;
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

</style>>