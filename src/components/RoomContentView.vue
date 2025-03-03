<template>
  <div class="c-room-content-view h-screen overflow-hidden">
    <!-- new UI -->
    <div v-if="roomDetails && roomDetails.status === 'occupied' && activeEntity" class="border-[20px] h-[100%] border-primary overflow-hidden">
      <div class="h-20 p-8">
        <img :src="clientDetails.client_image_url" class="h-12 w-12" />
        <!-- Digital clock -->
        <div class="w-[200px] absolute top-10 right-10" v-if="clientDetails && clientDetails.settings && clientDetails.settings.clock_type === 'analog'">
          <c-analog-clock></c-analog-clock>
        </div>
        <div v-else class="absolute top-10 right-10">
          <c-digital-clock></c-digital-clock>
        </div>
      </div>
      <div class="px-10 h-[100%] relative">
        <div class="pt-20">
          <img :src="activeEntity.image" class="absolute top-6 w-[36vw] bottom-0 object-cover" />
        </div>
        <div class="w-[70%] ml-auto">
          <div class="text-center w-[58vw]">
            <h2 class="text-[4vw] font-bold">{{ activeEntity.name }}</h2>
            <h3 class="font-bold text-[2vw]">{{ activeEntity.specialization }}</h3>
            <h3 class="font-bold text-[1.5vw]">{{ activeEntity.education }}</h3>
            <div class="my-8">
              <h2 class="text-[3vw] font-bold underline">Timings</h2>
              <div class="mt-6" v-for="(timing, key) in activeEntity.timings" :key="key">
                <p class="text-gray-800 text-[2vw]">
                  <span class="text-primary font-semibold">
                    {{ getDoctorTiming(timing.checkIn, timing.checkOut) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
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
import AnalogClock from "./AnalogClock.vue";
import DigitalClock from "./DigitalClock.vue"
export default {
  name: "c-room-content-view",
  props: {
    roomDetails: Object,
    clientDetails: Object,
  },
  components: {
    cMediaContent: MediaContent,
    cAnalogClock: AnalogClock,
    cDigitalClock: DigitalClock
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
          image: activeEntity.entity.image,
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
