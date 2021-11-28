<template>
  <div class="days-container">
    <div class="round" 
      v-for="(day, index) in DAY_NAMES"
      :key="index">
      <label :class="days[index] ? 'checked-label' : 'unchecked-label'">
        {{ day }}
        <input type="checkbox" 
          v-model="days[index]"
          :disabled="!editable"/>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Days',
  props: ['days', 'editable', 'DAY_NAMES'],
}
</script>

<style scoped>
.days-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
}

.round {
  --day-size: 30px;
  position: relative;
  height: var(--day-size);
  width: var(--day-size);
}

.round label {
  display: flex;
  align-items: center;
  justify-content: center; 
  font-weight: bold;
  border-width: 3px;
  border-style: solid;
  border-radius: 50%;
  cursor: pointer;
  height: var(--day-size);
  width: var(--day-size);
  position: absolute;
  top: 0;
}

.round input[type="checkbox"] {
  display: none;
}

.unchecked-label {
  background-color: lightgrey;
  border-color: grey;
  color: grey;
}

.checked-label {
  background-color: #66bb6a;
  border-color: #449958;
  color: black;
}
</style>