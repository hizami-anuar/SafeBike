<template>
  <div>
    <form action="" class="blockage-creator" @submit.prevent=''>
        <h1>Report Blockage</h1>
            <h2>Status</h2>
            <span v-if='status.length!==0'>Status: {{ status }}</span>
            <div class="checkboxes">
            <span>
                <input type="radio" id="unblocked" value="UNBLOCKED" v-model="status">
                <label for="unblocked">Unblocked</label>
            </span>
            <span>
                <input type="radio" id="unsafe" value="UNSAFE" v-model="status">
                <label for="unsafe">Unsafe</label>
            </span>
            <span>
                <input type="radio" id="blocked" value="BLOCKED" v-model="status">
                <label for="blocked">Blocked</label>
            </span>
            </div>
            <h2>Description</h2>
            <textarea v-model="description" placeholder="Details about the blockage..."/>
        <label v-if='this.errorMessage' for='creator-textbox' class='error'>{{this.errorMessage}}</label>
        <button :disabled='status.length === 0' class="post-button" v-on:click="createBlockage">SUBMIT</button>
        <span class="grace-period-disclaimer">
            Blockages cannot be modified or deleted after thirty minutes of posting
        </span>

    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

export default {
  name: 'CreateBlockage',
  components: {},
  props: ['location'],
  data () {
    return {
      errorMessage: '',
      status: '',
      description: '',
  }
  },
  emits: [
  ],
  methods: {
    /**
     * Makes an API request to create a new Blockage. If successful, triggers the callback 
     * for the parent element to update its view as necessary, such as by reloading the
     * list of blockages.
     */
    createBlockage () {
      let fields = { 
        status: this.status, 
        description: this.description,
        location: {
          latitude: this.location.lat,
          longitude: this.location.lng,
        },
      };
      axios.post(`/api/blockages/`, fields).then(() => {
        this.errorMessage = '';
        this.$emit('created-blockage'); // tells map to close the report blockage window
        eventBus.$emit('refresh-blockages'); // refresh the list of blockages

        // reset description and status of the create blockage
        this.description = '';
        this.status = '';
      }).catch(err => {
        console.log(err.response || err);
        this.errorMessage = err.response.data.error 
                  || err.response.data.message 
                  || "An unknown error occurred when posting this Blockage.";
      });
    },
  }
}
</script>

<style scoped>
h1, h2 {
  color: rgb(69, 38, 118);
}

h1 {
  margin: 10px 0px;
  padding: 0px;
  font-size: 36px;
}

.checkboxes {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}
h2 {
  margin-top: 0px;
  margin-bottom: 5px;
  padding: 0px;
  font-size: 24px;
}
.blockage-creator {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(186, 186, 235);

  /* max-width: 500px; */
  width: 250px;
  border: 2px solid rgb(81, 138, 235);
  border-radius: 15px;
  color: black;
  font-size: 15px;
  margin: 10px auto 10px auto;
  padding: 20px;
  /* padding-right: 12px; */
  margin-left: 10px;
}

.feed-icon {
  width: 30px;
  margin-right: 10px;
}

textarea {
  width: 70%;
  resize: none;
  padding: 8px;
  margin: 0 8px 0 8px;
  border-radius: 5px;
  border: none;
}

.textboxes {
  display: flex;
}

.post-button {
  font-size: 25px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: bold;
  border-radius: 10px;
  height: 60%;
  margin-top: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(88, 44, 192);
  color: white;
  padding: 10px 15px;
  border: none;
}

.post-button:disabled {
  background-color: rgb(148, 148, 148);
  color: rgb(235, 235, 235);
}

.post-button:hover:enabled {
  background-color: rgb(249, 199, 138);
  color: rgb(102, 29, 138);
}

.error{
  color: red;
}

.grace-period-disclaimer {
  font-style: italic;
  font-size: smaller;
  padding-top: 10px;
}
</style>
