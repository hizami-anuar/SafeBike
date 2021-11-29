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
      this.circle.center.coordinates = this.center;
      eventBus.$emit('circle-center-changed', this.circle );
    },

    centerChangedHandler(event) { // event is lat/lng functions
      const center = [event.lat(), event.lng()];
      this.center = center;
    },

    radiusChangedHandler(event) { // event is radius
      this.circle.radius = event;
      eventBus.$emit('circle-radius-changed', this.circle );
    },

    circleClickHandler() {
      eventBus.$emit('circle-clicked', { _id: this.circle._id });
    },
  }
}
</script>

<style scoped></style>