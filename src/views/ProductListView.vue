<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency } from '@/utils/formatters'
import { LOW_STOCK_THRESHOLD } from '@/utils/constants'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const filters = reactive({ search: '', category_id: '' })
const toDelete = ref(null)
let searchTimer = null

function loadProducts() {
  const params = {}
  if (filters.search.trim()) params.search = filters.search.trim()
  if (filters.category_id) params.category_id = filters.category_id
  productStore.fetchAll(params)
}

// Búsqueda con debounce para no llamar a la API en cada tecla
watch(
    () => filters.search,
    () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(loadProducts, 400)
    },
)

watch(() => filters.category_id, loadProducts)

onMounted(() => {
  loadProducts()
  categoryStore.fetchAll()
})

onBeforeUnmount(() => clearTimeout(searchTimer))

async function confirmDelete() {
  try {
    await productStore.remove(toDelete.value.id)
  } catch {
    // El interceptor ya mostró el error
  } finally {
    toDelete.value = null
  }
}
</script>

<template>
  <section>
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestiona el catálogo de productos</p>
      </div>
      <RouterLink :to="{ name: 'product-create' }" class="btn-primary"><svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>
          Nuevo producto</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-4 grid gap-4 p-4 sm:grid-cols-[2fr_1fr]">
      <div>
        <label for="search" class="label">Buscar</label>
        <input
            id="search"
            v-model="filters.search"
            type="search"
            class="input"
            placeholder="Buscar por nombre..."
        />
      </div>
      <div>
        <label for="category-filter" class="label">Categoría</label>
        <select id="category-filter" v-model="filters.category_id" class="input">
          <option value="">Todas las categorías</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="productStore.loading" text="Cargando productos..." />

    <ErrorAlert v-else-if="productStore.error" :message="productStore.error" @retry="loadProducts" />

    <div v-else-if="!productStore.products.length" class="empty-state">
      <span class="grid size-11 place-items-center rounded-full bg-ink-100 text-ink-400">
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/></svg>
        </span>
      <p>No se encontraron productos.</p>
    </div>

    <div v-else class="card overflow-x-auto p-0">
      <table class="min-w-full divide-y divide-ink-200 text-sm">
        <thead class="table-head">
        <tr>
          <th class="px-5 py-3.5">Producto</th>
          <th class="px-5 py-3.5">Categoría</th>
          <th class="px-5 py-3.5 text-right">Precio</th>
          <th class="px-5 py-3.5 text-center">Stock</th>
          <th class="px-5 py-3.5 text-right">Acciones</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-ink-100">
        <tr v-for="product in productStore.products" :key="product.id" class="transition-colors duration-100 hover:bg-ink-50/70">
          <td class="px-5 py-3.5">
            <p class="font-medium text-ink-900">{{ product.name }}</p>
            <p class="mt-0.5 max-w-xs truncate text-xs text-ink-500">{{ product.description || 'Sin descripción' }}</p>
          </td>
          <td class="px-5 py-3.5 text-ink-600">{{ product.category?.name ?? '—' }}</td>
          <td class="px-5 py-3.5 text-right font-medium text-ink-900">{{ formatCurrency(product.price) }}</td>
          <td class="px-5 py-3.5 text-center">
              <span
                  :class="[
                                    product.stock < LOW_STOCK_THRESHOLD ? 'badge-low' : 'badge-ok',
                ]"
              >
                {{ product.stock }}
              </span>
          </td>
          <td class="px-5 py-3.5">
            <div class="flex justify-end gap-1">
              <RouterLink
                  :to="{ name: 'product-edit', params: { id: product.id } }"
                  class="btn-row"
              >
                Editar
              </RouterLink>
              <button
                  type="button"
                  class="btn-row-danger"
                  :disabled="productStore.deletingId === product.id"
                  @click="toDelete = product"
              >
                Eliminar
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
        :show="!!toDelete"
        title="Eliminar producto"
        :message="`¿Seguro que deseas eliminar «${toDelete?.name}»? Esta acción no se puede deshacer.`"
        :loading="productStore.deletingId !== null"
        @confirm="confirmDelete"
        @cancel="toDelete = null"
    />
  </section>
</template>