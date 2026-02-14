<script setup lang="ts">
import TheNavBar from '@/components/TheNavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheNavBar />
    <main class="flex-1 relative z-10">
      <router-view />
    </main>
    
    <!-- Ambient Background Blobs -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-blob"></div>
      <div class="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-secondary-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-accent-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
    </div>
  </div>
</template>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
