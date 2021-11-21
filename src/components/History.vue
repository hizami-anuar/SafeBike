<template>
  <div class='outer-container'>
      History of the blockage goes here
      Displayed in list forms
      Click anywhere around popup to close it
  </div>
</template>

<script>

export default {
    name: 'History',
    props : {
        blockageData: Object,
    },
    emits: [
    ],
    data () {
        return {};
    },
    methods: {
    }
}
</script>

<style scoped>

.outer-container {
    background-color: rgb(67, 21, 142);
    padding: 20px;
    color: white;
    border-radius: 10px;
    width: 50%;
    height: 80%;
    /* background: rgba(63, 58, 58, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%; */
    z-index: 6;
}

</style>