<template>
  <div>
    <form action="" class="blockage-creator" @submit.prevent=''>
        <h1>Report Blockage</h1>
            <span class='location'>{{ location.name }}</span>
            <h2 v-if='status.length==0'>Status</h2>
            <h2 v-else>Status: {{ status }}</h2>
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
            <span class='effective-date'>
                <label for="effectiveTime" class='effective-date-label'>Effective Date (optional):</label>
                <input type="datetime-local" id="effectiveTime" name="effectiveTime"
                       required v-model="effectiveTime">            </span>
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
      effectiveTime: (new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).slice(0, -1),
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
          name: this.location.name, // insecure but whatever for now
        },
        time: new Date(this.effectiveTime).valueOf(),
      };
      axios.post(`/api/blockages/`, fields).then(() => {
        this.errorMessage = '';
        this.$emit('created-blockage'); // tells map to close the report blockage window
        eventBus.$emit('refresh-blockages'); // refresh the list of blockages
        eventBus.$emit('refresh-notifs');
        
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
  margin: 20px 0px;
  margin-top: 0px;
  padding: 0px;
  font-size: 30px;
  font-style: italic;
  color: rgb(60, 60, 60);
}

.location {
  font-style: italic;
  margin-bottom: 5px;
  font-size: 15px;
}

.effective-date {
  margin-top: 10px;
  text-align: left;
  margin-left: 8px;
}

.effective-date-label {
  font-style: italic;
  /* font-weight: bold; */
}
#effectiveTime {
  border: none;
  margin: 2px 0px;
  padding: 2px 5px;
  border-radius: 4px;
  text-decoration: none;
  width: 280px;
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
  width: 300px;
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
  width: 90%;
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
