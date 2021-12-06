<template>
  <div class="time-container">
    <input type="time" 
      v-model="schedule.startTime" 
      :disabled="!editable" />
    <span> - </span>
    <input type="time" 
      v-model="schedule.endTime" 
      :disabled="!editable" />
  </div>
</template>

<script>
export default {
  name: 'Time',
  props: ['schedule', 'editable'],
}
</script>

<style scoped>
.time-container {
  margin: 5px;
  color: black;
  font-size: 20px;
}

input[type="time"] {
  color: black;
  font-size: 20px;
}

input[type="time"]:disabled {
  background-color: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
}

input[type="time"]:disabled::-webkit-calendar-picker-indicator {
  display: none;
}
</style>