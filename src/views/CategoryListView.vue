<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { validateCategory, hasErrors } from '@/utils/validators'
import { mapValidationErrors } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import FormField from '@/components/FormField.vue'

const store = useCategoryStore()

const editingId = ref(null)
const form = reactive({ name: '', description: '' })
const errors = ref({})
const toDelete = ref(null)

const isEditing = computed(() => editingId.value !== null)

onMounted(() => store.fetchAll())

function resetForm() {
  editingId.value = null
  form.name = ''
  form.description = ''
  errors.value = {}
}

function startEdit(category) {
  editingId.value = category.id
  form.name = category.name
  form.description = category.description ?? ''
  errors.value = {}
}

async function submit() {
  errors.value = validateCategory(form)
  if (hasErrors(errors.value)) return

  const payload = {
    name: form.name.trim(),
    description: form.description.trim() || null,
  }

  try {
    if (isEditing.value) {
      await store.update(editingId.value, payload)
    } else {
      await store.create(payload)
    }
    resetForm()
  } catch (e) {
    if (e.status === 422) {
      errors.value = mapValidationErrors(e.errors)
    }
  }
}

async function confirmDelete() {
  try {
    await store.remove(toDelete.value.id)
  } catch {
    // El interceptor ya mostró el error (por ejemplo, 409 si tiene productos)
  } finally {
    toDelete.value = null
  }
}
</script>

<template>
  <section>
    <div class="mb-8">
      <h1 class="page-title">Categorías</h1>
      <p class="page-subtitle">Administra las categorías de tus productos</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Formulario -->
      <form class="card h-fit space-y-4 lg:sticky lg:top-20" novalidate @submit.prevent="submit">
        <h2 class="section-title">
          {{ isEditing ? 'Editar categoría' : 'Nueva categoría' }}
        </h2>

        <FormField id="name" label="Nombre" :error="errors.name" required>
          <input
              id="name"
              v-model="form.name"
              type="text"
              class="input"
              :class="{ 'input-error': errors.name }"
              placeholder="Ej. Ropa"
          />
        </FormField>

        <FormField id="description" label="Descripción" :error="errors.description">
          <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="input"
              :class="{ 'input-error': errors.description }"
              placeholder="Descripción opcional"
          ></textarea>
        </FormField>

        <div class="flex gap-2">
          <button type="submit" class="btn-primary flex-1" :disabled="store.saving">
            {{ store.saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear' }}
          </button>
          <button v-if="isEditing" type="button" class="btn-secondary" @click="resetForm">
            Cancelar
          </button>
        </div>
      </form>

      <!-- Listado -->
      <div class="lg:col-span-2">
        <LoadingSpinner v-if="store.loading" text="Cargando categorías..." />

        <ErrorAlert v-else-if="store.error" :message="store.error" @retry="store.fetchAll()" />

        <div v-else-if="!store.categories.length" class="empty-state">
          <span class="grid size-11 place-items-center rounded-full bg-ink-100 text-ink-400">
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/></svg>
        </span>
          <p>Aún no hay categorías registradas.</p>
        </div>

        <div v-else class="card overflow-x-auto p-0">
          <table class="min-w-full divide-y divide-ink-200 text-sm">
            <thead class="table-head">
            <tr>
              <th class="px-5 py-3.5">Nombre</th>
              <th class="px-5 py-3.5">Descripción</th>
              <th class="px-5 py-3.5 text-center">Productos</th>
              <th class="px-5 py-3.5 text-right">Acciones</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-ink-100">
            <tr v-for="category in store.categories" :key="category.id" class="transition-colors duration-100 hover:bg-ink-50/70">
              <td class="px-5 py-3.5 font-medium text-ink-900">{{ category.name }}</td>
              <td class="px-5 py-3.5 text-ink-600">{{ category.description || '—' }}</td>
              <td class="px-5 py-3.5 text-center"><span class="badge bg-ink-100 text-ink-700 ring-ink-900/5">{{ category.products_count ?? 0 }}</span></td>
              <td class="px-5 py-3.5">
                <div class="flex justify-end gap-1">
                  <button type="button" class="btn-row" @click="startEdit(category)">
                    Editar
                  </button>
                  <button
                      type="button"
                      class="btn-row-danger"
                      :disabled="store.deletingId === category.id"
                      @click="toDelete = category"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ConfirmModal
        :show="!!toDelete"
        title="Eliminar categoría"
        :message="`¿Seguro que deseas eliminar «${toDelete?.name}»? Esta acción no se puede deshacer.`"
        :loading="store.deletingId !== null"
        @confirm="confirmDelete"
        @cancel="toDelete = null"
    />
  </section>
</template>