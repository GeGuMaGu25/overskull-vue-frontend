<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { validateProduct, hasErrors } from '@/utils/validators'
import { mapValidationErrors } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import FormField from '@/components/FormField.vue'

const props = defineProps({
  id: { type: String, default: null },
})

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
})
const errors = ref({})

const isEdit = computed(() => !!props.id)

onMounted(async () => {
  categoryStore.fetchAll()

  if (isEdit.value) {
    try {
      const product = await productStore.fetchById(props.id)
      Object.assign(form, {
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
      })
    } catch {
      router.push({ name: 'products' })
    }
  }
})

async function submit() {
  errors.value = validateProduct(form)
  if (hasErrors(errors.value)) return

  const payload = {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    price: Number(form.price),
    stock: Number(form.stock),
    category_id: Number(form.category_id),
  }

  try {
    if (isEdit.value) {
      await productStore.update(Number(props.id), payload)
    } else {
      await productStore.create(payload)
    }
    router.push({ name: 'products' })
  } catch (e) {
    if (e.status === 422) {
      errors.value = mapValidationErrors(e.errors)
    }
  }
}
</script>

<template>
  <section class="mx-auto max-w-2xl">
    <RouterLink :to="{ name: 'products' }" class="link">
      <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>
      Volver al listado
    </RouterLink>

    <h1 class="page-title mt-3">
      {{ isEdit ? 'Editar producto' : 'Nuevo producto' }}
    </h1>

    <LoadingSpinner v-if="isEdit && productStore.loading" text="Cargando producto..." />

    <form v-else class="card mt-6 space-y-5" novalidate @submit.prevent="submit">
      <FormField id="name" label="Nombre" :error="errors.name" required>
        <input
            id="name"
            v-model="form.name"
            type="text"
            class="input"
            :class="{ 'input-error': errors.name }"
            placeholder="Ej. Camiseta Overskull"
        />
      </FormField>

      <FormField id="description" label="Descripción" :error="errors.description">
        <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="input"
            :class="{ 'input-error': errors.description }"
            placeholder="Ej. Camiseta negra edición limitada"
        ></textarea>
      </FormField>

      <div class="grid gap-5 sm:grid-cols-2">
        <FormField id="price" label="Precio (S/)" :error="errors.price" required>
          <input
              id="price"
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              class="input"
              :class="{ 'input-error': errors.price }"
              placeholder="0.00"
          />
        </FormField>

        <FormField id="stock" label="Stock" :error="errors.stock" required>
          <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              step="1"
              min="0"
              class="input"
              :class="{ 'input-error': errors.stock }"
              placeholder="0"
          />
        </FormField>
      </div>

      <FormField id="category_id" label="Categoría" :error="errors.category_id" required>
        <select
            id="category_id"
            v-model="form.category_id"
            class="input"
            :class="{ 'input-error': errors.category_id }"
            :disabled="categoryStore.loading"
        >
          <option value="">
            {{ categoryStore.loading ? 'Cargando categorías...' : 'Selecciona una categoría' }}
          </option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </FormField>

      <div class="-mx-6 -mb-6 mt-2 flex justify-end gap-2 rounded-b-2xl border-t border-ink-100 bg-ink-50/60 px-6 py-4">
        <RouterLink :to="{ name: 'products' }" class="btn-secondary">Cancelar</RouterLink>
        <button type="submit" class="btn-primary" :disabled="productStore.saving">
          {{ productStore.saving ? 'Guardando...' : isEdit ? 'Actualizar producto' : 'Crear producto' }}
        </button>
      </div>
    </form>
  </section>
</template>