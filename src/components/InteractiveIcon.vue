<template>
  <span class="icon-container" v-on:click="handler">
    <slot name="image"></slot>
    <span class="hovertext">{{hovertext}}</span>
  </span>
</template>

<script>
export default {
  name: "InteractiveIcon",
  props: ["handler", "hovertext"],
}
</script>

<style scoped>

.interactive-icon {
  cursor: pointer;
}

.icon-container {
  display: flex;
  justify-content: center;
  position: relative;
  width: fit-content;
  margin: 0px;
}

.icon-container .hovertext {
  visibility: hidden;
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  bottom: 100%;
}

.icon-container:hover .hovertext:not(:hover) {
  visibility: visible;
}
</style>