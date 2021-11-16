<template>
  <GmapMap
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    class="map"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    />
  </GmapMap>
</template>

<script>
export default {
  name: 'Map',
  data: function () {
    return {};
  },
}
</script>

<style scoped>
.map {
  width: 500px;
  height: 300px;
}
</style>