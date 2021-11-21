<template>
  <div class='outer-container'>
      Comments of the blockage goes here
      Displayed in list form scrollable
      Click anywhere around popup to close it
      if user logged in, have textbox at bottom to add comment
  </div>
</template>

<script>

export default {
    name: 'Comments',
    props : {
        blockageData: Object,
        user: Object,
        loggedIn: Boolean,
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