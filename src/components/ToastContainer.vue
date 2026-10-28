<script setup>
  import { useToastStore } from "@/stores/toast"

  const toastStore = useToastStore()

  const styles = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    info: 'text-brand-600',
  }
</script>

<template>
  <div class="pointer-events-none fixed top-4 right-4 z-50 flex w-88 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border border-ink-200/80 bg-white/95 p-3.5 pr-2.5 text-ink-900 shadow-[0_12px_32px_-12px_oklch(20%_0.03_285/0.3)] backdrop-blur"
        role="alert"
      >
        <span :class="['mt-px shrink-0', styles[toast.type]]">
          <svg v-if="toast.type === 'success'" viewBox="0 0 20 20" class="size-5" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.86a.75.75 0 1 0-1.06-1.06L9 10.88 7.2 9.08a.75.75 0 0 0-1.06 1.06l2.33 2.33c.3.3.77.3 1.06 0l4.33-4.33Z" clip-rule="evenodd"/></svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 20 20" class="size-5" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9.25 6h1.5v5h-1.5V6Zm0 6.5h1.5V14h-1.5v-1.5Z" clip-rule="evenodd"/></svg>
          <svg v-else viewBox="0 0 20 20" class="size-5" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9.25 9h1.5v5h-1.5V9Zm0-3h1.5v1.5h-1.5V6Z" clip-rule="evenodd"/></svg>
        </span>
        <p class="flex-1 pt-px text-sm leading-snug">{{ toast.message }}</p>
        <button
          type="button"
          class="grid size-6 shrink-0 place-items-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          aria-label="Cerrar notificación"
          @click="toastStore.remove(toast.id)"
        >
          <svg viewBox="0 0 16 16" class="size-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .toast-move,
  .toast-enter-active {
    transition: opacity 320ms ease, transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .toast-leave-active {
    position: absolute;
    width: 100%;
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(24px) scale(0.98);
  }
</style>
