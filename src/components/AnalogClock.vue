<template>
  <div class="clock-container">
    <div class="clock">
      <div v-for="n in 12" :key="n" class="number" :style="numberStyle(n)">{{ n }}</div>
      <div class="hand hour-hand" :style="hourStyle"></div>
      <div class="hand minute-hand" :style="minuteStyle"></div>
      <div class="hand second-hand" :style="secondStyle"></div>
      <div class="center-circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: new Date(),
    };
  },
  computed: {
    hourStyle() {
      return { transform: `rotate(${(this.time.getHours() % 12) * 30 + this.time.getMinutes() * 0.5}deg)` };
    },
    minuteStyle() {
      return { transform: `rotate(${this.time.getMinutes() * 6}deg)` };
    },
    secondStyle() {
      return { transform: `rotate(${this.time.getSeconds() * 6}deg)` };
    },
  },
  mounted() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  },
  methods: {
    numberStyle(n) {
      const angle = (n - 3) * 30;
      return {
        position: "absolute",
        top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
        left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
        transform: "translate(-50%, -50%)",
        fontSize: "16px",
        fontWeight: "bold",
      };
    },
  },
};
</script>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.clock {
  width: 200px;
  height: 200px;
  border: 5px solid black;
  border-radius: 50%;
  position: relative;
  background: white;
}
.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: black;
  border-radius: 5px;
}
.hour-hand {
  width: 6px;
  height: 50px;
}
.minute-hand {
  width: 4px;
  height: 70px;
  background: gray;
}
.second-hand {
  width: 2px;
  height: 80px;
  background: red;
}
.center-circle {
  width: 10px;
  height: 10px;
  background: black;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.number {
  position: absolute;
  text-align: center;
}
</style>
