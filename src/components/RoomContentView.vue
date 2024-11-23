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
import moment from "moment-timezone";
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
      const currentTime = moment.tz("Asia/Riyadh"); // Get current time in Riyadh timezone

      // Filter for active entities based on check-in and check-out times
      const activeEntities = this.roomDetails?.entities?.filter((entity) => {
        const checkInTime = moment.tz(entity.check_in, "Asia/Riyadh");
        const checkOutTime = moment.tz(entity.check_out, "Asia/Riyadh");

        // Check if current time is between check-in and check-out
        return currentTime.isBetween(checkInTime, checkOutTime, null, "[)");
      });

      if (activeEntities && activeEntities.length > 0) {
        const activeEntity = activeEntities[0];

        // Trigger active event
        this.triggerActiveEvent(activeEntity);

        // Return active entity's details along with timings
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
      const timeMoment = moment.tz(time, "Asia/Riyadh"); // Use moment to handle time formatting in Riyadh timezone
      return timeMoment.format("hh:mm A"); // Format as "12:00 PM"
    },
    getDoctorTiming(checkIn, checkOut) {
      const checkInMoment = moment.tz(checkIn, "Asia/Riyadh"); // Use moment to handle the times in Riyadh timezone
      const checkOutMoment = moment.tz(checkOut, "Asia/Riyadh");

      const checkInFormatted = this.formatTime(checkIn);
      const checkOutFormatted = this.formatTime(checkOut);

      const checkInDay = checkInMoment.format("dddd"); // Get the day name (e.g., "Monday")
      const checkOutDay = checkOutMoment.format("dddd");

      if (checkInMoment.isSame(checkOutMoment, "day")) {
        return `${checkInDay} ${checkInFormatted} - ${checkOutFormatted}`;
      }

      return `${checkInDay} ${checkInFormatted} - ${checkOutDay} ${checkOutFormatted}`;
    },
    updateClock() {
      this.currentTime = moment.tz("Asia/Riyadh").format("hh:mm:ss A"); // Update the clock with current time formatted in Riyadh timezone
    },
    checkRoomStatus() {
      const currentTime = moment.tz("Asia/Riyadh"); // Use moment to get current time in Riyadh timezone

      // Check if any entity is active
      const hasActiveEntity = this.roomDetails?.entities?.some((entity) => {
        const checkInTime = moment.tz(entity.check_in, "Asia/Riyadh");
        const checkOutTime = moment.tz(entity.check_out, "Asia/Riyadh");
        return currentTime.isBetween(checkInTime, checkOutTime, null, "[)");
      });

      // Update room status based on entity activity
      if (!hasActiveEntity) {
        this.roomDetails.status = "vacant";
      }
    },
    triggerActiveEvent(activeEntity) {
      console.log(`Entity ${activeEntity.entity.name} is now active.`);
      // Additional logic to handle the active event can be added here.
    },
  },
  mounted() {
    // Update clock every second
    this.clockInterval = setInterval(this.updateClock, 1000);

    // Check room status every second (uncomment this line if needed)
     this.roomCheckInterval = setInterval(this.checkRoomStatus, 1000);
  },
  beforeDestroy() {
    clearInterval(this.clockInterval);
    clearInterval(this.roomCheckInterval);
  },
};
</script>
