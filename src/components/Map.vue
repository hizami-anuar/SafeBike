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
      @dblclick="openCreateBlockageMenu"
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
        @close-marker="closeAllMarkerPopups"
      />
      <GmapMarker
        v-if="createBlockageMenu.active"
        ref="create-blockage-marker"
        :clickable="false"
        :draggable="true"
        :position="createBlockageMenu.location"
        @dragend="openCreateBlockageMenu"
      />
    </GmapMap>
    <CreateBlockage 
      class='create-blockage'
      v-if="createBlockageMenu.active"
      :location="createBlockageMenu.location"
      @created-blockage="closeCreateBlockageMenu"
    />
  </div>
</template>

<script>
import CreateBlockage from '@/components/CreateBlockage.vue';
import MapMarker from '@/components/map_components/MapMarker.vue';
import { eventBus } from "@/main";
import {gmapApi} from 'vue2-google-maps';

export default {
  name: 'Map',
  components: { CreateBlockage, MapMarker },
  props: {
      /** @type {Blockage[]} The blockage object to display */
      blockages: Array,
      loggedIn: Boolean,
      user: Object,
      circles: Array,
      inHome: Boolean,
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
      createBlockageMenu: {
        active: false,
        location: null,  // {lat, lng, name}
      },
      eventListeners: [
        {name: 'location-name-found', func: this.locationNameFound},
      ]
    };
  },
  computed: {
    displayMarkers() {  // [(blockage, marker)]
      let markers = this.blockages.map(b => {
        const [lat, lng] = b.location.coordinates;
        return [b, {location: {lat, lng}}];
      });
      return markers;
    },
    google: gmapApi,
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  methods: {
    clickBlockageMarker (id) {
      this.active = id;
      this.closeCreateBlockageMenu();
    },
    closeAllMarkerPopups: function() {
      this.active = null;
      this.closeCreateBlockageMenu();
      eventBus.$emit('close-marker');
    },
    /**
     * @param position gmaps position supporting lat() and lng()
     */
    openCreateBlockageMenu: function(event) {
      if (!this.loggedIn || !this.inHome) return;

      let google = this.google;
      let geocoder = new google.maps.Geocoder();
      let location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      eventBus.$emit('close-marker');
      geocoder.geocode({'location': location }, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            location.name = results[0].formatted_address;
          } else {
            location.name = "Unknown Location";
          }
          eventBus.$emit('location-name-found', location);
        }
      });
    },
    locationNameFound (location) {
      this.createBlockageMenu = {
        active: true,
        location: location,
      }
    },
    closeCreateBlockageMenu () {
      this.createBlockageMenu = {
        active: false,
        location: null,
      };
    },
  }
}
</script>

<style scoped>
.create-blockage {
  z-index: 1;
  position: fixed;
  margin-left: 20px;
  top: 15%;
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