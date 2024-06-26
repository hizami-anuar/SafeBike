<template>
  <div class="blockage">
    <div class='header-div'>
    <div class='reporter'>
      <div class='profile'>{{reporter.username[0].toUpperCase()}}</div>
      <span class='username'>@{{reporter.username}}</span>
      <span v-if="reporter"> (Level {{ reporter.activityLevel }})</span>
    </div>
    <!-- <div class='date'>
      <span>{{  date.split(',')[0] }}</span><br>
      <span>{{  date.split(',')[1] }}</span>
    </div> -->
    </div>
    <span>{{ blockageData.location.name }}</span>
    <EditBlockage 
      v-if="['EDIT', 'UPDATE'].includes(mode)"
      :blockageData="blockageData"
      :mode="mode"
      @back="viewDefault"
      @updated-status="viewPendingStatusUpdate"
    />
    <PendingBlockage
      v-else-if="child && mode === 'VIEW_PENDING_CHILD'"
      :blockageData="blockageData"
      :loggedIn="loggedIn"
      :user="user"
      @back="viewDefault"
    />
    <div v-else class="blockage-content">
      <h1>{{  status.toUpperCase()  }}</h1>
      <button v-if='child' v-on:click='viewPendingStatusUpdate' class="general-button">
        View Pending Status Update
      </button>
      <button v-else-if='loggedIn' v-on:click='updateStatus' class="general-button">
        Request Status Update
      </button>
      <span class="description" v-if='description.length!==0'>{{  description }}</span>
    </div>
    <div class='footer'>
    <div class='footer-buttons vote-buttons'>
      <p class='vote-count'>Total Votes: {{this.votes}}</p>
      <VoteIcons
        v-if="loggedIn"
        :blockageData="blockageData"
        :loggedIn="loggedIn"
        :user="user"
      />
    </div>
    <div class="footer-right">
    <div class='date'>
      <span class='time'>{{  date.split(',')[0] }}</span><br>
      <span class='time'>{{  date.split(',')[1] }}</span>
    </div>
    <div class="footer-buttons edit-delete-buttons">
      <span class='num-comments'>{{ commentsLength }}</span>
      <InteractiveIcon
        :handler="openComments"
        :hovertext="'View Comments'">   
        <template v-slot:image><img class='icon' src="@/assets/comment.png"/></template>
      </InteractiveIcon>
      <span v-if='history' class='num-history'>{{ historyLength }}</span>
      <InteractiveIcon
        :handler="openHistory"
        :hovertext="'View History'">   
        <template v-slot:image><img class='icon' src="@/assets/history.png"/></template>
      </InteractiveIcon>
      <template v-if="canEditOrDelete">
      <InteractiveIcon
        :handler="editBlockage"
        :hovertext="'Edit'">   
        <template v-slot:image><img class='icon icon-edit' src="@/assets/edit.png"/></template>
      </InteractiveIcon>
      <InteractiveIcon
        :handler="deleteBlockage"
        :hovertext="'Delete'">   
        <template v-slot:image><img class='icon' src="@/assets/delete.png"/></template>
      </InteractiveIcon>
      </template>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

import EditBlockage from '@/components/EditBlockage.vue';
import InteractiveIcon from '@/components/input_components/InteractiveIcon.vue';
import PendingBlockage from '@/components/PendingBlockage.vue';
import VoteIcons from '@/components/VoteIcons.vue';

export default {
  name: 'Blockage',
  components: {
    EditBlockage,
    InteractiveIcon,
    PendingBlockage,
    VoteIcons,
  },
  mounted() {
    this.getAllComments();
    this.getHistory();
    eventBus.$on('new-comment', this.getAllComments);
    eventBus.$on('delete-comment', this.getAllComments);
  },
  props: {
    /** @type {Blockage} The blockage object to display */
    blockageData: Object,
    loggedIn: Boolean,
    user: Object
  },
  data () {
    return {
      // displayLat: this.blockageData.location.coordinates[0].toFixed(2), // round latitude to 2 decimals
      // displayLng: this.blockageData.location.coordinates[1].toFixed(2), // round longitude to 2 decimals
      mode: 'DEFAULT', // DEFAULT, EDIT, UPDATE, VIEW_PENDING_CHILD
      comments: undefined,
      history: undefined,
    }
  },
  computed: {
    description() { return this.blockageData.description; },
    status() { return this.blockageData.status; },
    reporter() { return this.blockageData.reporter; },
    votes() { return this.blockageData.voteCount; },
    child() { return this.blockageData.childBlockage; },
    ownsBlockage() { return this.loggedIn && this.user._id === this.reporter._id; },
    // Can only edit or delete within thirty minutes of posting
    canEditOrDelete() {
      return this.ownsBlockage && ((Date.now() - this.blockageData.time) < 1800000); 
    },
    date() { // formatted time for displaying (human readable) 
      // convert from unix epoch time to human readable date
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(this.blockageData.time/1000);
      return date.toLocaleString('en-US');
    },
    commentsLength() { return this.comments ? this.comments.length : 0; },
    historyLength() { return this.history ? this.history.length : 0; },
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
    viewPendingStatusUpdate() {
      this.mode = "VIEW_PENDING_CHILD";
    },
    viewDefault() {
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
        eventBus.$emit('refresh-notifs');
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
    getAllComments() {
        axios.get('/api/blockages/comments/' + this.blockageData._id).then((res) => {
          console.log('got all comments!');
          this.comments = res.data.filter( comment => comment); // filter out null deleted comments
          console.log(this.comments);
        }).catch(err => {
          console.log(err.response || err);
          this.errorMessage = err.response.data.error 
            || err.response.data.message 
            || "An unknown error occurred when posting this comment.";
        });
    },

    getHistory() {
      console.log('getting history');
      axios.get(`/api/blockages`)
      .then((response) => {
        console.log('success fritter');
        let blockages = response.data.blockages;
        console.log(blockages);

        let currBlockage = this.blockageData;
        this.history = [];
        console.log(currBlockage.parentBlockage);
        console.log(this.blockages);
        currBlockage = currBlockage.parentBlockage ?
            blockages.filter((blockage) => blockage._id == currBlockage.parentBlockage)[0]
            : undefined;
        while (currBlockage) {
          this.history.push(currBlockage);
          currBlockage = currBlockage.parentBlockage ?
            blockages.filter((blockage) => blockage._id == currBlockage.parentBlockage)[0]
            : undefined;
        }
      }).catch((error) => {
        this.console.log(error);
      });
      console.log(this.history);
    }
  }
}
</script>

<style scoped>
h1 {
  color: rgb(69, 38, 118);
  font-size: 20px;
}

.icon {
  margin-left: 6px;
  margin-right: 0px;
}

.num-comments {
  font-size: 18px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 4px;
}

.num-history {
  font-size: 18px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 4px;
  margin-left: 15px;
  margin-right: -5px;
}

.icon-edit {
  width: 27px;
  height: 27px;
}
.date {
  padding: 0px;
  width: fit-content;
  color: rgb(90, 0, 128);
  font-style: italic;
  text-align: right;
  margin-right: -10px;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.footer-right {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.header-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
  padding: 0px;
}

.vote-count {
  /* margin-right: 10px; */
  margin-top: 3px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: row;
  font-size: 18px;
}

.time {
  margin: 0px;
  white-space: nowrap;
  margin-right: 10px;
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
  margin-right: 0px;
  margin-left: 0px;
  /* padding-left: 5px; */
}

.reporter {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-left: 10px;
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
  font-weight: bold;
  cursor: default;
  margin-right: 10px;
}

.description {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 10px;
}

.edit-delete-buttons {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.vote-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-buttons {
  width: fit-content;
  justify-content: flex-end;
  margin-right: 0px;
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
  width: 320px;
  border: 3px solid rgb(111, 79, 199);
  border-radius: 15px;
  color: black;
  font-size: 15px;
  margin: -20px auto 10px auto;
  padding: 20px;
  padding-right: 10px;
  padding-left: 10px;
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
