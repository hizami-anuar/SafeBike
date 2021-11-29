<template>
  <main>
    <div class="home-container">
      <Map
        class='map'
        :blockages='blockages'
        :loggedIn='loggedIn'
        :user='user'
      />
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
      currBlockage: undefined,
      historyPopupShown: false,
      commentsPopupShown: false,
    }
  }, 
  computed: {
    // currBlockage () {
    //   return this.currBlockageId ?
    //     this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
    //     : undefined;
    // }
  },
  mounted() {
    this.getAllBlockages();
    eventBus.$on('refresh-blockages', this.refreshBlockages);
    eventBus.$on('open-marker', this.displayBlockage);
    eventBus.$on('close-marker', this.undisplayBlockage);
    eventBus.$on("history-clicked", this.toggleHistoryPopup);
    eventBus.$on('comments-clicked', this.toggleCommentsPopup);
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
    // fetch list of all blockages
    getAllBlockages() {
      axios.get(`/api/blockages?active=true`)
        .then((response) => {
          this.blockages = response.data.blockages;
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
      // console.log("displaying blockage " + id)
      this.currBlockage = this.currBlockageId ?
        this.blockages.filter((blockage) => blockage._id == this.currBlockageId)[0]
        : undefined;
    },
    undisplayBlockage() {
      this.currBlockageId = '';
      this.currBlockage = undefined;
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
