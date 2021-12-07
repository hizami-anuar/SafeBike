<template>
  <div class='vote-icons'>
    <InteractiveIcon v-if="!upvoted"
      :handler="() => toggleVote('up')"
      :hovertext="'Upvote'">   
      <template v-slot:image><img class='icon' src="@/assets/like.png"/></template>
    </InteractiveIcon>
    <InteractiveIcon v-else
      :handler="() => toggleVote('up')"
      :hovertext="'Remove Upvote'">   
      <template v-slot:image><img class='icon' src="@/assets/liked.png"/></template>
    </InteractiveIcon>
    <InteractiveIcon v-if="!downvoted"
      :handler="() => toggleVote('down')"
      :hovertext="'Downvote'">   
      <template v-slot:image><img class='icon' src="@/assets/dislike.png"/></template>
    </InteractiveIcon>
    <InteractiveIcon v-else
      :handler="() => toggleVote('down')"
      :hovertext="'Remove Downvote'">   
      <template v-slot:image><img class='icon' src="@/assets/disliked.png"/></template>
    </InteractiveIcon>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";
import InteractiveIcon from "@/components/input_components/InteractiveIcon.vue";

export default {
  name: 'VoteIcons',
  components: { InteractiveIcon },
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
  justify-content: space-around;
  width: 100%;
}

.icon {
  margin-right: 0px;
}
</style>
