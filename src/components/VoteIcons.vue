<template>
  <div class='vote-icons'>
    <img v-if='!upvoted' class='icon' v-on:click="toggleVote('up')" src="@/assets/like.png"/>
    <img v-else class='icon' v-on:click="toggleVote('up')" src="@/assets/liked.png"/>
    <img v-if='!downvoted' class='icon' v-on:click="toggleVote('down')" src="@/assets/dislike.png"/>
    <img v-else class='icon' v-on:click="toggleVote('down')" src="@/assets/disliked.png"/>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

export default {
  name: 'VoteIcons',
  components: {},
  props: {
    /** @type {Blockage} The blockage object to display */
    blockageData: Object,
    loggedIn: Boolean,
    user: Object
  },
  computed: {
    upvoted() { return this.blockageData.upvoted; },
    downvoted() { return this.blockageData.downvoted; },
  },
  methods: {
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
      // const oldVoteScore = this.voteScore;
      const action = alreadyVoted ? "delete" : "post";
      axios[action](route)
        .then(() => {
          eventBus.$emit('refresh-blockages');
        }).catch((error) => {
          console.log(error);
        })
    },
  }
}
</script>

<style scoped>
.vote-icons {
  display: flex;
  flex-direction: row;
}

.icon {
  margin-right: 0px;
}
</style>
