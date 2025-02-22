import axios from "axios";

function formatTimezoneOffset() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();

  // Convert offset from minutes to hours and minutes
  const sign = offsetMinutes > 0 ? "-" : "+";
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;

  // Return in the required format "+hh,-hh" (positive or negative)
  return `${sign}${hours},${sign}${minutes}`;
}

function getTenant() {
  // const url = "http://aghakhan.futurconnect.cloud/";
  const url = window.location.href;
  // get aghakhan from above url
  const tenant = url.split(".")[0].split("//")[1];
  const isProd = import.meta.env.MODE === "production";

  if(isProd){
    return tenant
  }
  else{
    return "aghakhan"
  }
  return tenant;

  
}

export const apiUtilServices = (() => {
  const apiBaseUrl = `${import.meta.env.VITE_BE_URL}/api`;
  const bopApi = `${import.meta.env.VITE_TENANT_API}`;

  function getClientDetails() {
    const endPoint = "/client/" + getTenant();
    return  axios
      .get(`${apiBaseUrl}${endPoint}`, {
        headers: {
          "Timezone-Offset": formatTimezoneOffset(),
          "X-tenant": getTenant(),
        },
      })
      .then((res) => res.data);
  }

  function getRoomDetails(roomCode) {
    const endPoint = "/rooms/" + roomCode;
    console.log(getTenant());
    return axios
      .get(`${apiBaseUrl}${endPoint}`, {
        headers: {
          "Timezone-Offset": formatTimezoneOffset(),
          "X-tenant": getTenant(),
        },
      })
      .then((res) => res.data);
  }

  function checkDeviceAvailibity(deviceId) {
    const endPoint = "/tenant-devices/check/" + deviceId;
    return axios
      .get(`${bopApi}${endPoint}`, {
        headers: {
        
        },
      })
      .then((res) => res.data);
  }

  function deviceStatusUpdate(deviceId) {
    const endPoint = "/tenant-devices/" + deviceId;
    return axios
      .put(`${bopApi}${endPoint}`, {
        device_status:"ACTIVE"
      })
      .then((res) => res.data);
  }

  return {
    getRoomDetails,
    getClientDetails,
    checkDeviceAvailibity,
    deviceStatusUpdate
  };
})();
