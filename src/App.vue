<template>
  <div v-if="deviceId !== null" >
    <c-room-code-modal v-if="lodashIsEmpty(roomDetails)" @onSetRoomCode="onSetRoomCode"></c-room-code-modal>
    <c-room-content-view v-else :room-details="roomDetails" :client-details="clientDetails"></c-room-content-view>
  </div>
  <div v-else>
      <c-device-code-modal @onSetDeviceCode="onSetDeviceCode"></c-device-code-modal>
  </div>
</template>

<script>
import { apiUtilServices } from "./services/apiUtilServices";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

import lodashIsEmpty from "lodash/isEmpty";

import RoomCodeModal from "./components/RoomCodeModal.vue";
import RoomContentView from "./components/RoomContentView.vue";
import DeviceCodeModal from "./components/DeviceCodeModal.vue"
export default {
  name: "c-app",
  components: {
    cRoomCodeModal: RoomCodeModal,
    cRoomContentView: RoomContentView,
    cDeviceCodeModal: DeviceCodeModal
  },
  data() {
    return {
      deviceId: Cookies.get("DEVICE_ID") || null,
      roomCode: null,
      roomDetails: {},
      clientDetails: {},
      socket: null,
    };
  },
  created() {
    const self = this;
    self.initialize();
    self.setupSocket();
  },
  methods: {
    initialize() {
      const self = this;
      apiUtilServices.getClientDetails().then((res) => {
        self.clientDetails = res.data;
      });
      self.roomCode = window.sessionStorage.getItem("MMS_ROOM_CODE")
        ? window.sessionStorage.getItem("MMS_ROOM_CODE")
        : null;
      if (self.roomCode) {
        self.getRoomDetails();
      }
    },
    onSetRoomCode(roomCode) {
      const self = this;
      self.roomCode = roomCode;
      self.getRoomDetails();
    },
    onSetDeviceCode(deviceId) {
      const self = this;
      apiUtilServices.checkDeviceAvailibity(deviceId).then((res)=>{
        console.log("res", res)
        if(res?.success){
          self.deviceId = deviceId;
          Cookies.set("DEVICE_ID", deviceId, { expires: 365 }); // Expires in 30 days
          apiUtilServices.deviceStatusUpdate(res?.tenant_device_id).then((res)=>{
           
          })
        }
        else{
            alert(res?.message)
        }
        
      })
      
    },
    async getRoomDetails() {
      const self = this;
      if(self.roomCode !== undefined && self.roomCode !== null && self.roomCode !== "null" ){
        console.log("self.roomCode 333",self.roomCode)
        try {
        // setting roomcode in session storage
        window.sessionStorage.setItem("MMS_ROOM_CODE", self.roomCode);
        const response = await apiUtilServices.getRoomDetails(self.roomCode);
        const data = response.data;
        if (response.status === "success") {
          self.roomDetails = data || {};
        }
      } catch (err) {
        console.log(err);
        self.$toast.open({
          type: "error",
          message: (err.response && err.response.data.message) || "Internal server error.",
        });
      }
      }

    },
    setupSocket() {
      const self = this;
      // Initialize the socket connection
      self.socket = io(import.meta.env.VITE_BE_URL); // Replace with your server URL

      self.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });
      // Listen for room updates
      self.socket.on("roomUpdate", (updatedRoom) => {
        console.log("testing", updatedRoom);
        if (updatedRoom.room_id === self.roomCode) {
          self.roomDetails = updatedRoom;
        }
      });
    },
    lodashIsEmpty: lodashIsEmpty,
  },
  beforeDestroy() {
    const self = this;
    // Clean up the socket connection when the component is destroyed
    if (self.socket) {
      self.socket.disconnect();
    }
  },
  mounted() {
    const self = this;

    // Update clock every second

        this.clockInterval = setInterval(this.getRoomDetails, 60000);

    // Check room status every second (uncomment this line if needed)
  },
  beforeDestroy() {
    clearInterval(this.clockInterval);
  },
};
</script>
<style></style>
