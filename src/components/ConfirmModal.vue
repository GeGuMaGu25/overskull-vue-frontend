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
    <div
        v-if="show"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        @click.self="$emit('cancel')"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ message }}</p>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="btn-secondary" :disabled="loading" @click="$emit('cancel')">
            Cancelar
          </button>
          <button type="button" class="btn-danger" :disabled="!loading" @click="$emit('confirm')">
            {{ loading ? 'Procesando...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>