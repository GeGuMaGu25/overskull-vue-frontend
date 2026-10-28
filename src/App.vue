<script setup>
  import { RouterView } from "vue-router"
  import AppNavbar from "@/components/AppNavbar.vue"
  import ToastContainer from "@/components/ToastContainer.vue"
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavbar />
    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>