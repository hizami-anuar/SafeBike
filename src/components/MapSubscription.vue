<template>
  <div id="map-container">
    <GmapMap
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="{
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
      }"
      id="map"
      @click="closeAllMarkerPopups"
      @dblclick="doubleClickHandler"
    >
      <MapMarker
        v-for="([b, m], index) in displayMarkers"
        :key="index"
        :loggedIn="loggedIn"
        :user="user"
        :map="$refs.map"
        :blockage="b"
        :marker="m"
        :active="active === b._id"
        @open-marker="clickBlockageMarker"
        @close-marker="active = null"
      />
      <template v-if="$refs.map">
        <SubscriptionCircle
          v-for="(circle, index) in circles"
          :key="`circle-${index}`"
          :circle="circle"
          :map="$refs.map"
        />
      </template>
    </GmapMap>
    <div class='instructions'>
      <p>Click on an existing pin to view details on the subscription.</p>
      <p v-if='loggedIn'>Double click on the map to create a new subscription.</p>
      <p v-else>Please log in to create a new subscription.</p>
    </div>
  </div>
</template>

<script>
import MapMarker from '@/components/MapMarker.vue';
import SubscriptionCircle from '@/components/SubscriptionCircle.vue';
import { eventBus } from "../main";

export default {
  name: 'Map',
  components: { MapMarker, SubscriptionCircle },
  props: {
      /** @type {Blockage[]} The blockage object to display */
      blockages: Array,
      loggedIn: Boolean,
      user: Object,
      circles: Array,
      // 'center' likely
  },
  mounted() {
    eventBus.$on('close-marker', () => this.active = null);
  },
  data: function () {
    return {
      center: {lat:42.3601, lng:-71.0942},  // where the map starts
      zoom: 13,
      active: null,  // which marker is active
    };
  },
  computed: {
    displayMarkers: function() {  // [(blockage, marker)]
      let markers = this.blockages.map(b => {
        const [lat, lng] = b.location.coordinates;
        return [b, {location: {lat, lng}}];
      });
      return markers;
    },
  },
  methods: {
    doubleClickHandler (event) {
      eventBus.$emit('activate-create-subscription', { center: [event.latLng.lat(), event.latLng.lng()] })
    },

    clickBlockageMarker (id) {
      this.active = id;
      this.closeCreateBlockageMenu();
    },
    onMarkerClick: function(pos) {
      console.log(this.center, pos);
      this.center = pos;
    },
    closeAllMarkerPopups: function() {
      
      this.active = null;
    },
  }
}
</script>

<style scoped>

.instructions {
  position: absolute;
  top: 20px;
  left: 50%;
  padding: 6px 12px;
  z-index: 3;
  background-color: white;
  transform: translate(-50%, 0);
}

.instructions p {
  margin: 0px;
  padding: 0px;
}

#map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: 100%;
}
</style>