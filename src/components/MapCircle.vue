<template>
  <div id="marker-container">

  </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';
import { eventBus } from '@/main';

export default {
  name: 'Map',
  components: {  },
  props: ['loggedIn', 'user', 'map', 'circle'],
  data: function () {
    return {
      marker: undefined,
      region: undefined,
    };
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    await this.$nextTick();
  
    const map = await this.map.$mapPromise;

    // var pinLabel = "A";

    /*
    // Pick your pin (hole or no hole)
    var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    var labelOriginHole = new this.google.maps.Point(12,15);
    // var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    // var labelOriginFilled =  new this.google.maps.Point(12,9);

    var markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new this.google.maps.Point(12,17),
        fillOpacity: 1,
        fillColor: "#ADD8E6",
        strokeWeight: 2,
        strokeColor: "#0000AA",
        scale: 2,
        labelOrigin: labelOriginHole
    };

    const marker = new this.google.maps.Marker({
      map: map,
      position: new this.google.maps.LatLng(this.circle.center[0], this.circle.center[1]),
      title: 'Some location',
      icon: markerImage,
      draggable: true,
    });
    this.marker = marker;
    */

    // Add circle overlay and bind to marker
    const region = new this.google.maps.Circle({
      map: map,
      center: new this.google.maps.LatLng(this.circle.center[0], this.circle.center[1]),
      radius: this.circle.radius,    // 10 miles in metres
      fillColor: '#AAAA00',
      draggable: true,
      editable: true,
    });
    this.region = region;

    // region.bindTo('center', marker, 'position');

    const circle = this.circle;
    this.google.maps.event.addListener(region, 'center_changed', function() {
      const center = [region.getCenter().lat(), region.getCenter().lng()];
      eventBus.$emit('circle-center-changed', {id: circle._id, center: center});
    });

    this.google.maps.event.addListener(region, 'radius_changed', function() {
      console.log(region.getRadius());
      eventBus.$emit('circle-radius-changed', {id: circle._id, radius: region.getRadius()});
    });
  },
  computed: {
    google: gmapApi,
  },
  methods: {

  },
}
</script>

<style>
  h2 {
    color: rgb(46, 2, 89);
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin-bottom: 0px;
  }
  p {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 15px;
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