<template>
  <main>
    <div class="home-container">
      <div class='map-container'>
      <Map
        class='map'
        :inHome='inHome'
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
      />
      </div>
      <Blockage
        class="blockage-popup"
        v-if='currBlockage'
        :key='currBlockageId'
        :blockageData='currBlockage'
        :loggedIn='loggedIn'
        :user='user'/>
      <div v-if='!currBlockageId' class='instructions'>
        <p>Click on an existing pin to view details on your blockage report.</p>
      </div>
    </div>
      <div v-if='isLoading' class='loading'>
        <p class='loading-text'>Loading pins...</p>
        <img class='loading-gif' src="@/assets/loading.gif"/>
      </div>
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
  </main>
</template>

<script>
import Map from '@/components/Map.vue';

import { eventBus } from "@/main";
import Blockage from '@/components/Blockage.vue';
import Popup from '@/components/map_components/Popup.vue';
import History from '@/components/History.vue';
import Comments from '@/components/Comments.vue';

import axios from 'axios';

export default {
  name: 'Account',
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
      inHome: false,
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
      this.currBlockageId = blockage._id;
      // refresh list of blockages after an update status
        axios.get(`/api/blockages?active=true`)
        .then((response) => {
          this.blockages = response.data.blockages;
        }).catch((error) => {
          this.console.log(error);
        });
      // refresh history of the currently viewing blockage
      eventBus.$emit('refresh-history', this.currBlockage);
      console.log("RERESHING HISTORY");
    },
    // fetch list of all blockages belong to the user
    getAllBlockages() {
      axios.get(`/api/blockages?active=true`)
        .then((response) => {
          this.isLoading = false;
          this.blockages = response.data.blockages.filter(blockage => blockage.reporter._id == this.user._id);
        }).catch((error) => {
          this.console.log(error);
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
    },
    undisplayBlockage() {
      this.currBlockageId = '';
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
  height: 180px;
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
  left: 30%;
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

.instructions {
  position: absolute;
  top: 90px;
  left: 80%;
  width: 30%;
  padding: 6px 12px;
  /* z-index: 3; */
  background-color: white;
  transform: translate(-50%, 0);
}

.instructions p {
  margin: 0px;
  padding: 0px;
}

.blockage-popup {
  /* position:absolute; */
  width: 35%;
  /* height: 70%; */
  margin-top: 20px;
  /* top: 24%; */
  /* right: 2%; */
}

.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.map-container {
  height: 100%;
  width: 60%;
  /* margin-left: 50%; */
}
</style>
