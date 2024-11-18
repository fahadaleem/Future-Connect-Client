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

export const apiUtilServices = (() => {
  const apiBaseUrl = `${import.meta.env.VITE_BE_URL}/api`;

  function getRoomDetails(roomCode) {
    const endPoint = "/rooms/" + roomCode;
    return axios
      .get(`${apiBaseUrl}${endPoint}`, {
        headers: {
          "Timezone-Offset": formatTimezoneOffset(),
        },
      })
      .then((res) => res.data);
  }

  return {
    getRoomDetails,
  };
})();
