<template>
  <div 
    id="marker-container"
  >
    <GmapMarker
      :clickable="true"
      :draggable="false"
      :position="marker.location"
      :icon="markerImage"
      @click="toggleBlockageView"
      @mouseover="hoverMarker = true"
      @mouseout="hoverMarker = false"
    />
    <GmapMarker v-if="blockage.childBlockage"
      :clickable="false"
      :draggable="false"
      :position="marker.location"
      :icon="updateImage"
    />
    <div 
      v-if="activeOrHovering" 
      class='popup' 
      ref="popup"
      >
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
import { eventBus } from "@/main";

// import Blockage from '@/components/Blockage.vue';

export default {
  name: 'Map',
  components: {  },
  props: ['loggedIn', 'user', 'map', 'marker', 'blockage', 'active'],
  data: function () {
    return {
      Popup: undefined,
      popup: undefined,
      futureFills: {
        BLOCKED: "#CC000088", 
        UNSAFE: "#CCCC0088",
        UNBLOCKED: "#00CC0088",
      },
      statusFills: {
        BLOCKED: "#FF0000", 
        UNSAFE: "#FFFF00",
        UNBLOCKED: "#00FF00",
      },
      statusOutlines: {
        BLOCKED: "#AA0000", 
        UNSAFE: "#AAAA00",
        UNBLOCKED: "#00AA00",
      },
      hoverMarker: false,
      hoverCircle: false,
      hoverPopup: false,
    };
  },
  computed: {
    google: gmapApi,
    activeOrHovering() { 
      return this.active || this.hoverMarker; 
    },
    futureBlockage() {
      return this.blockage.time > Date.now();
    },
    markerFill () {
      if (this.futureBlockage) {
        return this.futureFills[this.blockage.status];
      } else {
        return this.statusFills[this.blockage.status];
      }
    },
    markerImage () {
      var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
      var labelOriginHole = new this.google.maps.Point(12,15);
      var markerImage = {
          path: pinSVGHole,
          anchor: new this.google.maps.Point(12,17),
          fillOpacity: 1,
          fillColor: this.markerFill,
          strokeWeight: 2,
          strokeColor: this.statusOutlines[this.blockage.status],
          scale: 2,
          labelOrigin: labelOriginHole
      };
      return markerImage;
    },
    updateImage() {
      //var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
      var circleSVG = "M 25, 50 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0";
      var labelOriginFilled =  new this.google.maps.Point(12,15);
      var updateImage = {
          path: circleSVG,
          //anchor: new this.google.maps.Point(50,110),
          anchor: new this.google.maps.Point(0,150),
          fillOpacity: 1,
          fillColor: this.statusFills[this.blockage.childBlockage.status],
          strokeWeight: 2,
          strokeColor: this.statusOutlines[this.blockage.childBlockage.status],
          scale: 0.25,
          labelOrigin: labelOriginFilled
      };
      return updateImage;
    },
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    await this.$nextTick();
  
    const {Popup} = await definePopupClass();
    this.Popup = Popup;
  },
  watch: {
    activeOrHovering: async function (val) {
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
  methods: {
    openBlockageView: function() {
      this.$emit('open-marker', this.blockage._id);
      eventBus.$emit('open-marker', this.blockage._id);
    },
    closeBlockageView: function() {
      this.$emit('close-marker');
    },
    toggleBlockageView: function() {
      console.log(this.active, this.hovering)
      this.active ? this.closeBlockageView() : this.openBlockageView();
    },
    beginHovering: function() {
      console.log('on')
      this.hovering = true;
    },
    stopHovering: function() {
      console.log('off')
      this.hovering = false;
    },
  },
}
</script>

<style scoped>
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
    pointer-events: none;
  }
</style>

<!-- this cannot be scoped; necessary for popup styling -->
<style> 
	/* The location pointed to by the popup tip. */
	.popup-tip-anchor {
		height: 0;
		position: absolute;
		/* The max width of the info window. */
		width: 200px;
    pointer-events: none;
	}
	/* The bubble is anchored above the tip. */
	.popup-bubble-anchor {
		position: absolute;
		width: 100%;
		bottom: /* TIP_HEIGHT= */ 8px;
		left: 0;
    pointer-events: none;
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
    pointer-events: none;
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
    pointer-events: none;
	}
</style>