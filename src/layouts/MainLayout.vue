<script setup lang="ts">
import TheNavBar from '@/components/TheNavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white selection:bg-emerald-500/30">
    <TheNavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>
