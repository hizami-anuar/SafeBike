<template>
  <div class="edit-blockage-content">
    <h1>{{  newStatus.toUpperCase()  }}</h1>
    <div class="checkboxes">
      <span>
        <input type="radio" id="unblocked" value="UNBLOCKED" v-model="newStatus">
        <label for="UNBLOCKED">Unblocked</label>
      </span>
      <span>
        <input type="radio" id="unsafe" value="UNSAFE" v-model="newStatus">
        <label for="UNSAFE">Unsafe</label>
      </span>
      <span>
        <input type="radio" id="blocked" value="BLOCKED" v-model="newStatus">
        <label for="BLOCKED">Blocked</label>
      </span>
    </div>
    <h2>Description</h2>
    <textarea class='description-input' type='text' placeholder="New description here" v-model='newDescription'/>
    <div class='edit-mode-buttons'>
      <button class='general-button cancel-button' v-on:click="cancelEdit">Cancel</button>
      <button class='general-button done-button' v-on:click="submitEdited">Submit</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

export default {
  name: 'EditBlockage',
  props: {
    /** @type {Blockage} The blockage object to display */
    blockageData: Object,
    mode: String,
  },
  data () {
    return {
      errorMessage: '',
      newStatus: this.blockageData.status, // updated status for editing mode
      newDescription: this.blockageData.description, // updated description for editing mode
      reporter: this.blockageData.reporter, // contains {username, activityLevel} from original reporter
    }
  },
  computed: {},
  mounted() {
    // updated description and status starts off same as current to display initially
    this.newDescription = this.description;
    this.newStatus = this.status;
    // convert from unix epoch time to human readable date
    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(this.blockageData.time/1000);
    this.date = date.toLocaleString('en-US');
  },
  methods: {
    // cancel edit blockage mode
    cancelEdit() {
      this.$emit('cancel-edit');
    },
    // submit the edited blockage
    submitEdited() {
      if (this.mode === "EDIT") { // submit edited blockage
        // updated blockage info: right now can't edit location (to do?)
        let updatedBlockageData = {
          description: this.newDescription,
          status: this.newStatus
        }

        // request to submit edited blockage
        axios.patch(`/api/blockages/${this.blockageData._id}`, updatedBlockageData)
          .then((response) => {
            console.log(response);
            console.log('edited blockage successfully');
            eventBus.$emit('refresh-blockages');

            // update the description and status displayed to the new ones
            this.description = this.newDescription;
            this.status = this.newStatus;

            //update the frontend time
            var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            date.setUTCSeconds(Date.now()/1000);
            this.date = date;
          }).catch((error) => {
            console.log(error);
          });
      }

      else if (this.mode === "UPDATE") {
        // submit request to update status
        let fields = { 
          status: this.newStatus, 
          description: this.newDescription,
          location: {
            latitude: this.blockageData.location.coordinates[0],
            longitude: this.blockageData.location.coordinates[1],
          },
          active: true,
          parentBlockage: this.blockageData._id,
        };
        axios.post(`/api/blockages/`, fields)
          .then((res) => {
            this.errorMessage = '';
            eventBus.$emit('updated-status', res.data.blockageData);
            console.log('wassupppp', res.data.blockageData);
            // console.log('updated status of blockage , success request')
            // reset description and status of the create blockage
            this.newStatus = this.status;
          })
          .catch(err => {
            console.log(err.response || err);
            this.errorMessage = err.response.data.error 
                  || err.response.data.message 
                  || "An unknown error occurred when updating status of this Blockage.";
          });
      }
    },
  }
}
</script>

<style scoped>
h1 {
  color: rgb(69, 38, 118);
  font-size: 20px;
}

h2 {
  color: rgb(69, 38, 118);
  margin-top: 0px;
  font-size: 28px;
  margin-bottom: 5px;
}

textarea {
  resize: none;
  border: none;
  padding: 5px 8px;
  border-radius: 5px;
  height: 40px;
}

.edit-mode-buttons {
  display: flex;
  justify-content: center;
}

.done-button {
  width: 40%;
  margin: 10px 5px 0 5px;
}

.cancel-button {
  margin: 10px 5px 0 5px;
  width: 40%;
  background: none;
  color: rgb(131, 33, 131);
  font-weight: bold;
  border: 3px rgb(171, 93, 216) solid;
}

.checkboxes {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 30%;
}

.checkboxes span {
  margin: 2px;
}
</style>