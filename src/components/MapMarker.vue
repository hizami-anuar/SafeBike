<template>
  <div id="marker-container">
    <GmapMarker
      :clickable="true"
      :draggable="false"
      :position="marker.location"
      @click="toggleBlockageView"
    />
    <div v-if="active" class='popup' ref="popup">
      <h2>{{blockage.status}}</h2>
      <p>{{blockage.description}}</p>
      <!-- <Blockage
        :blockageData='blockage'
        :loggedIn='loggedIn'
        :user='user'
      /> -->
    </div>
  </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';

import {definePopupClass} from '@/composables/definePopupClass.js'
import { eventBus } from "../main";

// import Blockage from '@/components/Blockage.vue';

export default {
  name: 'Map',
  components: {  },
  props: ['loggedIn', 'user', 'map', 'marker', 'blockage', 'active'],
  data: function () {
    return {
      Popup: undefined,
      popup: undefined,
    };
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    await this.$nextTick();
  
    const {Popup} = await definePopupClass();
    this.Popup = Popup;
  },
  watch: {
    active: async function (val) {
      if (!val) {
        this.popup.onRemove();
        return;
      }
      await this.$nextTick();
      const map = await this.map.$mapPromise;
      const {lat, lng} = this.marker.location;
      this.popup = new this.Popup(
        new this.google.maps.LatLng(lat, lng),
        this.$refs.popup);
      this.popup.setMap(map);
    }
  },
  computed: {
    google: gmapApi,
  },
  methods: {
    openBlockageView: function() {
      this.$emit('open-marker', this.blockage._id);
      eventBus.$emit('open-marker', this.blockage._id);
    },
    closeBlockageView: function() {
      this.$emit('close-marker');
    },
    toggleBlockageView: function() {
      this.active ? this.closeBlockageView() : this.openBlockageView();
    },
  },
}
</script>

<style>
  h2 {
    color: rgb(46, 2, 89);
    font-size: 16px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin-bottom: -15px;
    margin-top: 4px;
  }
  p {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 15px;
    margin-bottom: -5px;
  }
  .popup {
    padding: 0px 12px;
    padding-bottom: 10px;
  }
	/* The location pointed to by the popup tip. */
	.popup-tip-anchor {
		height: 0;
		position: absolute;
		/* The max width of the info window. */
		width: 200px;
	}
	/* The bubble is anchored above the tip. */
	.popup-bubble-anchor {
		position: absolute;
		width: 100%;
		bottom: /* TIP_HEIGHT= */ 8px;
		left: 0;
	}
	/* Draw the tip. */
	.popup-bubble-anchor::after {
		content: "";
		position: absolute;
		top: -1px;
		left: 0;
		/* Center the tip horizontally. */
		transform: translate(-50%, 0);
		/* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
		width: 0;
		height: 0;
		/* The tip is 8px high, and 12px wide. */
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: /* TIP_HEIGHT= */ 8px solid white;
	}
	/* The popup bubble itself. */
	.popup-bubble-content {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -100%);
		/* Style the info window. */
		background-color: rgb(255, 249, 236);
		/* padding: 5px; */
		border-radius: 3px;
		font-family: sans-serif;
		overflow-y: auto;
		max-height: 200px;
    max-width: 500px;
		box-shadow: 0px 2px 10px 1px rgba(0,0,0,0.5);
	}
</style>