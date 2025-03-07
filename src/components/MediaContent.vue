<template>
  <div class="c-media-content">
    <!-- Display media based on format -->
    <div v-if="mediaContent.format === 'video'" class="media-container">
      <!-- Video player -->
      <video :src="mediaContent.url" muted autoplay loop class="w-full h-screen rounded-lg shadow-md"></video>
    </div>
    <div v-else-if="mediaContent.format === 'image'" class="media-container">
      <!-- Image display -->
      <img :src="mediaContent.url" alt="Room Media" class="w-full h-screen rounded-lg shadow-md object-cover" />
    </div>
    <div v-else>
      <!-- Unsupported format fallback -->
      <p class="text-gray-600">Unsupported media format</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "c-media-content",
  props: {
    mediaContent: Object,
  },
};
</script>
