<template>
  <MapCircle
    :circle="circle"
    :color="selected ? '#00AA00' : '#AAAA00'"
    :dragEndHandler="dragEndHandler"
    :centerChangedHandler="centerChangedHandler"
    :radiusChangedHandler="radiusChangedHandler"
    :circleClickHandler="circleClickHandler"
  />
</template>

<script>
import MapCircle from '@/components/map_components/MapCircle.vue';
import { eventBus } from "@/main";

export default {
  name: 'SubscriptionCircle',
  components: { MapCircle },
  props: ['circle', 'selected'],
  methods: {
    dragEndHandler() {
      eventBus.$emit('circle-center-changed', {id: this.circle._id, center: this.center});
    },

    centerChangedHandler(event) { // event is lat/lng functions
      const center = [event.lat(), event.lng()];
      this.center = center;
    },

    radiusChangedHandler(event) { // event is radius
      eventBus.$emit('circle-radius-changed', {id: this.circle._id, radius: event});
    },

    circleClickHandler() {
      eventBus.$emit('circle-clicked', {id: this.circle._id});
    },
  }
}
</script>

<style scoped></style>