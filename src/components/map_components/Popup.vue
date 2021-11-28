<template>
  <div class='popup-background' v-on:click.self='cancel'>
      <slot></slot>
  </div>
</template>

<script>

export default {
    name: 'Popup',
    emits: [
        'close-popup',
    ],
    data () {
        return {};
    },
    methods: {
        cancel () {
            this.$emit('close-popup');
        },
    }
}
</script>

<style scoped>

.popup-background {
    background: rgba(63, 58, 58, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 5;
}

</style>