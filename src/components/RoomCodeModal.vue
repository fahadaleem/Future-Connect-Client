<template>
  <div class="c-room-code-modal">
    <div class="h-screen flex justify-center items-center bg-primary">
      <div></div>
      <div class="bg-white shadow-lg p-8 rounded-xl max-w-lg w-full text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Enter Room Code</h2>
        <form @submit="onSubmit">
          <input
            type="text"
            v-model="roomCode"
            placeholder="Room Code"
            class="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button type="submit" class="bg-primary text-white py-2 px-6 rounded-lg mt-4 w-full font-medium">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "c-room-code-modal",
  data() {
    return {
      roomCode: "",
    };
  },
  methods: {
    onSubmit(e) {
      const self = this;
      e.preventDefault();
      self.$emit("onSetRoomCode", self.roomCode);
    },
  },
};
</script>
