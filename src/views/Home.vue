<template>
  <main>
    <div class="home-container">
      <Map
        class='map'
        :inHome='inHome'
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
      />
      <div v-if='isLoading' class='loading'>
      <!-- <div class='loading'> -->
        <p class='loading-text'>Loading pins...</p>
        <img class='loading-gif' src="@/assets/loading.gif"/>
      </div>
      <div
        class='instructions' 
        v-if="instructionsShown && !isLoading"
        @click="closeInstructions"
        >
        <p>Click on an existing pin to view details on the blockage report.</p>
        <template v-if='loggedIn'>
          <p>Double click on the map to report a new blockage.</p>
          <p>Subscribe to new blockages in a region in the My Alerts tab.</p>
          <p>Access account settings via the profile icon in the top-right.</p>
        </template>
        <p v-else>Log in to report new blockages and subscribe to blockage alerts.</p>
      </div>
      <Blockage
        class="blockage-popup"
        v-if='currBlockage'
        :key='currBlockageId'
        :blockageData='currBlockage'
        :loggedIn='loggedIn'
        :user='user'/>
      <Popup v-if='historyPopupShown' @close-popup='closeHistoryPopup'>
      <History 
        :blockageData='currBlockage'
        :key='currBlockage._id'
        :user='user'/></Popup>
      <Popup v-if='commentsPopupShown' @close-popup='closeCommentsPopup'>
      <Comments
        :blockageData='currBlockage'
        :loggedIn='loggedIn'
        :user='user'
        />
      </Popup>
    </div>
  </main>
</template>

<script>
import Map from '@/components/Map.vue';

// import Blockages from '@/components/Blockages.vue';
import { eventBus } from "@/main";
import Blockage from '@/components/Blockage.vue';
import Popup from '@/components/map_components/Popup.vue';
import History from '@/components/History.vue';
import Comments from '@/components/Comments.vue';

import axios from 'axios';

export default {
  name: 'Home',
  components: { Map, Blockage, History, Comments, Popup},
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  data () {
    return {
      blockages: [], // list of blockage objects to display 
      currBlockageId: undefined,
      historyPopupShown: false,
      commentsPopupShown: false,
      instructionsShown: true,
      inHome: true,
      isLoading: true,
    }
  }, 
  computed: {
    currBlockage () {
      return this.currBlockageId ?
        this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
        : undefined;
    }
  },
  mounted() {
    this.getAllBlockages();
    if (this.$route) {
      this.currBlockageId = this.$route.query.blockage;
    }
    eventBus.$on('refresh-blockages', this.refreshBlockages);
    eventBus.$on('updated-status', this.updateStatus);
    eventBus.$on('open-marker', this.displayBlockage);
    eventBus.$on('close-marker', this.undisplayBlockage);
    eventBus.$on("history-clicked", this.toggleHistoryPopup);
    eventBus.$on('comments-clicked', this.toggleCommentsPopup);
  },
  beforeDestroy: function() {
    eventBus.$off('refresh-blockages', this.refreshBlockages);
    eventBus.$off('updated-status', this.updateStatus);
    eventBus.$off('open-marker', this.displayBlockage);
    eventBus.$off('close-marker', this.undisplayBlockage);
    eventBus.$off("history-clicked", this.toggleHistoryPopup);
    eventBus.$off('comments-clicked', this.toggleCommentsPopup);
  },
  methods: {
    toggleHistoryPopup () {
      console.log('hiiii');
      this.historyPopupShown = !this.historyPopupShown;
    },
    closeHistoryPopup() {
      this.historyPopupShown = false;
    },
    closeCommentsPopup() {
      this.commentsPopupShown = false;
    },
    toggleCommentsPopup() {
      this.commentsPopupShown = !this.commentsPopupShown;
    },
    closeInstructions() {
      this.instructionsShown = false;
    },

    updateStatus(blockage) {
      console.log('updating statussss', blockage._id);
      // set active blockage
      if (blockage.active) {
        this.currBlockageId = blockage._id;
      }
      // refresh list of blockages after an update status
        axios.get(`/api/blockages?active=true`)
        .then((response) => {
          this.blockages = response.data.blockages;
          // this.currBlockage = this.currBlockageId ?
          //   this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
          //   : undefined;
        }).catch((error) => {
          this.console.log(error);
        });
      // refresh history of the currently viewing blockage
      eventBus.$emit('refresh-history', this.currBlockage);
      console.log("RERESHING HISTORY");
    },
    // fetch list of all blockages
    getAllBlockages() {
      axios.get(`/api/blockages?active=true`)
        .then((response) => {
          this.blockages = response.data.blockages;
          this.isLoading = false;
        }).catch((error) => {
          console.log(error);
        });
    },
    refreshBlockages() {
      this.getAllBlockages(); // refresh list of blockages when edit, delete or post
      if (this.currBlockageId) { // refresh currently viewing blockage
        this.displayBlockage(this.currBlockageId);
      }
    },
    displayBlockage(id) {
      this.currBlockageId = id;
      console.log("displaying blockage " + this.currBlockageId)
      
      /*this.currBlockage = this.currBlockageId ?
        this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
        : undefined;*/
    },
    undisplayBlockage() {
      this.currBlockageId = '';
      //this.currBlockage = undefined;
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

.loading-gif {
  /* width: 200px; */
  height: 250px;
}

.instructions {
  position: absolute;
  top: 90px;
  left: 50%;
  padding: 6px 12px;
  /* z-index: 3; */
  background-color: white;
  transform: translate(-50%, 0);
  cursor: pointer;
}

.loading-text {
  position: absolute;
  left: 26%;
  padding: 0px;
  font-size: 28px;
}

.loading {
  position: absolute;
  top: 35%;
  left: 50%;
  /* padding: 15px 30px; */
  font-size: 30px;
  margin: 0px;
  padding: 0px;
  /* z-index: 3; */
  background-color: none;
  transform: translate(-50%, 0);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

.instructions p {
  margin: 0px;
  padding: 0px;
}

.blockage-popup {
  position:fixed;
  top: 20%;
  left: 2%;
}

.home-container {
  width: 100%;
  height: 100%;
}
</style>
