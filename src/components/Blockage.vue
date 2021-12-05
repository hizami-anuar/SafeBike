<template>
  <div class="blockage">
    <div class='reporter'>
      <div class='profile'>{{reporter.username[0].toUpperCase()}}</div>
      <span class='username'>@{{reporter.username}}</span>
      <span v-if="reporter"> (Level {{ reporter.activityLevel }})</span>
    </div>
    <span>{{  date  }}</span>
    <span>{{ displayLat }}°, {{ displayLng }}°</span>
    <div v-if="['EDIT', 'UPDATE'].includes(mode)">
      <EditBlockage 
        :blockageData="blockageData"
        :mode="mode"
        @cancel-edit="cancelEdit"
      />
    </div>
    <div v-else class="blockage-content">
      <h1>{{  status.toUpperCase()  }}</h1>
      <button v-if='loggedIn' v-on:click='updateStatus' class="general-button">
        Update Status
      </button>
      <span class="description" v-if='description.length!==0'>{{  description }}</span>
    </div>
    <div class='edit-delete-buttons'>
      <p class='vote-count'>Total Votes: {{this.votes}}</p>
      <div v-if='loggedIn' class='like-buttons'>
        <img v-if='!upvoted' class='icon' v-on:click="toggleVote('up')" src="@/assets/like.png"/>
        <img v-else class='icon' v-on:click="toggleVote('up')" src="@/assets/liked.png"/>
        <img v-if='!downvoted' class='icon' v-on:click="toggleVote('down')" src="@/assets/dislike.png"/>
        <img v-else class='icon' v-on:click="toggleVote('down')" src="@/assets/disliked.png"/>
      </div>
    </div>
    <div class="edit-delete-buttons">
      <InteractiveIcon
        :handler="openComments"
        :hovertext="'View Comments'">   
        <template v-slot:image><img class='icon' src="@/assets/comment.png"/></template>
      </InteractiveIcon>
      <InteractiveIcon
        :handler="openHistory"
        :hovertext="'View History'">   
        <template v-slot:image><img class='icon' src="@/assets/history.png"/></template>
      </InteractiveIcon>
      <img v-if="canEditOrDelete" class='icon' v-on:click="editBlockage" src="@/assets/edit.png"/>
      <img v-if="canEditOrDelete" class='icon' v-on:click="deleteBlockage" src="@/assets/delete.png"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

import EditBlockage from '@/components/EditBlockage.vue';
import InteractiveIcon from '@/components/InteractiveIcon.vue';

export default {
  name: 'Blockage',
  components: {
    EditBlockage,
    InteractiveIcon,
  },
  props: {
    /** @type {Blockage} The blockage object to display */
    blockageData: Object,
    loggedIn: Boolean,
    user: Object
  },
  data () {
    return {
      description: this.blockageData.description, 
      status: this.blockageData.status, 
      displayLat: this.blockageData.location.coordinates[0].toFixed(2), // round latitude to 2 decimals
      displayLng: this.blockageData.location.coordinates[1].toFixed(2), // round longitude to 2 decimals
      mode: 'VIEW', // DEFAULT, EDIT, UPDATE, VIEW_PENDING_UPDATE
      date: '', // formatted time for displaying (human readable) 
      reporter: this.blockageData.reporter, // contains {username, activityLevel} from original reporter
      votes: this.blockageData.voteCount,
    }
  },
  computed: {
    upvoted() { return this.blockageData.upvoted; },
    downvoted() { return this.blockageData.downvoted; },
    ownsBlockage() { return this.loggedIn && this.user._id === this.reporter._id; },
    // Can only edit or delete within thirty minutes of posting
    canEditOrDelete() { return this.ownsBlockage && ((Date.now() - this.blockageData.time) < 1800000); }
  },
  mounted() {
    // convert from unix epoch time to human readable date
    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(this.blockageData.time/1000);
    this.date = date.toLocaleString('en-US');
  },
  methods: {
    openHistory() {
      // open history panel for current blockage;
      eventBus.$emit('history-clicked');
    },
    openComments() {
      // open comment panel for current blockage can also make a comment on this panel;
      eventBus.$emit('comments-clicked');
    },
    // enter edit blockage mode
    editBlockage() {
      this.mode = "EDIT";
    },
    // update status button clicked
    updateStatus() {
      this.mode = "UPDATE";
    },
    // cancel edit blockage mode
    cancelEdit() {
      this.mode = "DEFAULT";
    },
    /**
     * Makes an API request to delete blockage. If successful, triggers the callback 
     * for the parent element to update its view as necessary, such as by reloading the
     * list of blockages.
     */
    deleteBlockage() {
      axios.delete(`/api/blockages/${this.blockageData._id}`)
      .then(() => {
        eventBus.$emit('close-marker');
        eventBus.$emit('refresh-user');
        eventBus.$emit('refresh-blockages');
        this.$emit('refresh-blockages');
      }).catch((error) => {
        console.log(error);
      })
    },
    /**
     * toggles up/downvote status
     * sorry for the double function but LOL
     * 
     * @param type either "up" or "down"
     */
    toggleVote(type) {
      if (!["up", "down"].includes(type)) return;
      const route = `/api/blockages/${type}vote/${this.blockageData._id}`;
      const alreadyVoted = this[`${type}voted`];
      const action = alreadyVoted ? "delete" : "post";
      axios[action](route)
        .then(() => {
          if (!alreadyVoted) {
            this.blockageData.upvoted = false;
            this.blockageData.downvoted = false;
          }
          if (type == 'up') {
            if (this.blockageData.upvoted) {
              this.votes -= 1;
            } else {
              this.votes += 1;
            }
          } else {
            if (this.blockageData.downvoted) {
              this.votes += 1;
            } else {
              this.votes -= 1;
            }
          }

          this.blockageData[`${type}voted`] = !alreadyVoted;
          if (this.ownsBlockage) {
            eventBus.$emit('refresh-user');
          }
          // eventBus.$emit('refresh-blockages');
          // eventBus.$emit('refresh-blockages');
          // this.$emit('refresh-blockages');
        }).catch((error) => {
          console.log(error);
        })
    },
  }
}
</script>

<style scoped>
h1 {
  color: rgb(69, 38, 118);
  font-size: 20px;
}

.vote-count {
  margin-right: 10px;
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  font-size: 18px;
}

.like-buttons {
  display: flex;
  flex-direction: row;
}

span{
  margin: 5px 10px;
}

.username {
  font-weight: bold;
  font-size: 20px;
}

.reporter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.profile {
  background-color: rgb(90, 0, 128);
  border-radius: 30px;
  color: rgb(254, 254, 254);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  margin-right: 10px;
  font-weight: bold;
  cursor: default;
}

.icon {
  height: 25px;
  width: 25px;
  margin-right: 10px;
  margin-left: -2px;
  cursor: pointer;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

.edit-delete-buttons {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  margin-right: -20px;
  margin-top: 5px;
  margin-bottom: -8px;
}

.blockage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(186, 186, 235);

  /* height: 100px; */
  /* max-width: 500px; */
  height: fit-content;
  width: 300px;
  border: 3px solid rgb(111, 79, 199);
  border-radius: 15px;
  color: black;
  font-size: 15px;
  margin: -20px auto 10px auto;
  padding: 20px;
  /* padding-right: 12px; */
}

.blockage-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.feed-icon {
 width: 30px;
 margin-right: 10px;
}

textarea {
  width: 90%;
  height: auto;
  padding: 8px;
  margin: 0 8px 0 8px;
  border-radius: 5px;
  border: none;
  resize: none;
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
  width: 50%;
  background-color: rgb(68, 169, 223);
  color: white;
  padding: 10px;
}

.post-button:disabled {
  background-color: rgb(148, 148, 148);
  color: rgb(235, 235, 235);
}

.post-button:hover:enabled {
  background-color: rgb(249, 199, 138);
}

.error{
  color: red;
}
</style>
