<template>
  <div class="c-room-content-view h-screen overflow-hidden">
    <div
      v-if="roomDetails && roomDetails.status === 'occupied' && activeEntity"
      class="border-[20px] border-primary p-8 h-screen flex items-center gap-x-12"
    >
      <div class="flex-1">
        <div>
          <h2 class="text-[4.5vw] font-bold">{{ activeEntity.name }}</h2>
          <h3 class="font-bold text-[2.5vw]">{{ activeEntity.specialization }}</h3>
          <h3 class="font-bold text-[1.5vw]">{{ activeEntity.education }}</h3>
        </div>

        <div class="my-8">
          <h2 class="text-[3vw] font-bold underline">Timings</h2>
          <div class="mt-6" v-for="(timing, key) in activeEntity.timings" :key="key">
            <p class="text-gray-800 text-4xl">
              <span class="text-primary font-semibold">
                {{ getDoctorTiming(timing.checkIn, timing.checkOut) }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <!-- Digital clock -->
        <p class="text-[6vw] font-bold text-center">{{ currentTime }}</p>
      </div>
    </div>
    <div v-else>
      <c-media-content v-if="roomDetails.media_content" :media-Content="roomDetails.media_content"></c-media-content>
    </div>
  </div>
</template>

<script>
import MediaContent from "./MediaContent.vue";

export default {
  name: "c-room-content-view",
  props: {
    roomDetails: Object,
  },
  components: {
    cMediaContent: MediaContent,
  },
  data() {
    return {
      currentTime: null,
      clockInterval: null,
      roomCheckInterval: null,
    };
  },
  computed: {
    activeEntity() {
      let currentTime = new Date();

      const timezoneOffsetMinutes = currentTime.getTimezoneOffset();

      // Calculate the offset in hours and minutes
      const offsetHours = Math.floor(timezoneOffsetMinutes / 60);
      const offsetMinutes = timezoneOffsetMinutes % 60;

      // Adjust the current time using the calculated offset
      currentTime.setHours(currentTime.getHours() - offsetHours);
      currentTime.setMinutes(currentTime.getMinutes() - offsetMinutes);

      currentTime = currentTime.toISOString();
      const activeEntities = this.roomDetails?.entities?.filter((entity) => {
        const checkInTime = entity.check_in;
        const checkOutTime = entity.check_out;
        return currentTime >= checkInTime && currentTime <= checkOutTime;
      });

      if (activeEntities && activeEntities.length > 0) {
        const activeEntity = activeEntities[0];
        return {
          name: activeEntity.entity.name,
          specialization: activeEntity.entity.specialization,
          education: activeEntity.entity.education,
          timings: this.roomDetails.entities
            .filter((entity) => entity.entity._id === activeEntity.entity._id)
            .map((entity) => ({
              checkIn: entity.check_in,
              checkOut: entity.check_out,
            })),
        };
      }
      return null;
    },
  },
  methods: {
    formatTime(time) {
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      const dateTime = new Date(time);
      const timezoneOffset = dateTime.getTimezoneOffset() / 60;
      dateTime.setHours(dateTime.getHours() + timezoneOffset);
      return new Date(dateTime).toLocaleTimeString("en-US", options);
    },
    getDoctorTiming(checkIn, checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timezoneOffset = checkInDate.getTimezoneOffset() / 60;
      checkInDate.setHours(checkInDate.getHours() + timezoneOffset);
      checkOutDate.setHours(checkOutDate.getHours() + timezoneOffset);
      const checkInFormatted = this.formatTime(checkIn);
      const checkOutFormatted = this.formatTime(checkOut);
      const checkInDay = new Date(checkIn).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const checkOutDay = new Date(checkOut).toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (checkInDate.toDateString() === checkOutDate.toDateString()) {
        return `${checkInDay} ${checkInFormatted} - ${checkOutFormatted}`;
      }
      return `${checkInDay} ${checkInFormatted} - ${checkOutDay} ${checkOutFormatted}`;
    },
    updateClock() {
      console.log("helloworld");
      this.currentTime = new Date().toLocaleTimeString(); // Update the digital clock
    },
    checkRoomStatus() {
      const currentTime = new Date();

      // Get the timezone offset in minutes
      const timezoneOffsetMinutes = currentTime.getTimezoneOffset();

      // Calculate the offset in hours and minutes
      const offsetHours = Math.floor(timezoneOffsetMinutes / 60);
      const offsetMinutes = timezoneOffsetMinutes % 60;

      // Adjust the current time using the calculated offset
      currentTime.setHours(currentTime.getHours() - offsetHours);
      currentTime.setMinutes(currentTime.getMinutes() - offsetMinutes);

      // Convert the adjusted time back to ISO format for comparison
      const adjustedTime = currentTime.toISOString();

      if(this.roomDetails?.entities){
      // Check if any entity is active
        const hasActiveEntity = this.roomDetails?.entities?.some((entity) => {
          return adjustedTime >= entity.check_in && adjustedTime <= entity.check_out;
        });

        // Update room status based on entity activity
        if (!hasActiveEntity) {
          this.roomDetails.status = "vacant";
        }
      }

    },
  },
  mounted() {
    // Update clock every second
    this.clockInterval = setInterval(this.updateClock, 1000);

    // Check room status every second
    this.roomCheckInterval = setInterval(this.checkRoomStatus, 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockInterval);
    clearInterval(this.roomCheckInterval);
  },
};
</script>
