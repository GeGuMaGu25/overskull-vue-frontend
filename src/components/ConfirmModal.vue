<script setup>
  defineProps({
    show: {type: Boolean, default: false},
    title: {type: String, default: 'Confirmar acción'},
    message: {type: String, default: '¿Estás seguro?'},
    confirmText: {type: String, default: 'Eliminar'},
    loading: {type: Boolean, default: false},
  })

  defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
    <div
        v-if="show"
        class="modal-backdrop fixed inset-0 z-40 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-[2px]"
        @click.self="$emit('cancel')"
    >
      <div class="modal-panel w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_oklch(20%_0.03_285/0.35)] ring-1 ring-ink-900/5" role="dialog" aria-modal="true">
        <div class="flex gap-4">
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
            </svg>
          </span>
          <div>
            <h3 class="text-base font-semibold text-ink-900">{{ title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-600">{{ message }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="btn-secondary" :disabled="loading" @click="$emit('cancel')">
            Cancelar
          </button>
          <button type="button" class="btn-danger" :disabled="!loading" @click="$emit('confirm')">
            {{ loading ? 'Procesando...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .modal-enter-active,
  .modal-enter-active .modal-panel {
    transition: opacity 200ms ease, transform 240ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .modal-leave-active,
  .modal-leave-active .modal-panel {
    transition: opacity 140ms ease, transform 140ms ease;
  }
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  .modal-enter-from .modal-panel,
  .modal-leave-to .modal-panel {
    transform: scale(0.96) translateY(4px);
  }
</style>