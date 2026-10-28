<script setup>
  import { useToastStore } from "@/stores/toast"

  const toastStore = useToastStore()

  const styles = {
    success: 'border-green-500 bg-green-50 text-green-800',
    error: 'border-red-500 bg-red-50 text-red-800',
    info: 'border-blue-500 bg-blue-50 text-blue-800',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="['flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-md', styles[toast.type]]"
        role="alert"
      >
        <span class="font-bold">{{ icons[toast.type] }}</span>
        <p class="flex-1 text-sm">{{ toast.message }}</p>
        <button
          type="button"
          class="text-sm opacity-60 hover:opacity-100"
          aria-label="Cerrar notificación"
          @click="toastStore.remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>

</template>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
</style>