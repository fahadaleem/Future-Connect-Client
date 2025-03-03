<template>
    <div class="c-digital-clock text-center">
      <span class="text-[4vw] font-bold">{{ formattedTime }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name:"c-digital-clock",
    data() {
      return {
        time: new Date(),
      };
    },
    computed: {
      formattedTime() {
        return this.time.toLocaleTimeString();
      },
    },
    mounted() {
      setInterval(() => {
        this.time = new Date();
      }, 1000);
    },
  };
  </script>
  
  <style scoped>
  .digital-clock {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    background: black;
    color: white;
    border-radius: 8px;
    width: 150px;
  }
  </style>