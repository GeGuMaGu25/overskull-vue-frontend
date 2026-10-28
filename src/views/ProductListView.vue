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
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
        <p class="text-sm text-gray-500">Gestiona el catálogo de productos</p>
      </div>
      <RouterLink :to="{ name: 'product-create' }" class="btn-primary">+ Nuevo producto</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6 grid gap-4 sm:grid-cols-2">
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

    <div v-else-if="!productStore.products.length" class="card text-center text-gray-500">
      No se encontraron productos.
    </div>

    <div v-else class="card overflow-x-auto p-0">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
        <tr>
          <th class="px-4 py-3">Producto</th>
          <th class="px-4 py-3">Categoría</th>
          <th class="px-4 py-3 text-right">Precio</th>
          <th class="px-4 py-3 text-center">Stock</th>
          <th class="px-4 py-3 text-right">Acciones</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-gray-50">
          <td class="px-4 py-3">
            <p class="font-medium text-gray-900">{{ product.name }}</p>
            <p class="text-xs text-gray-500">{{ product.description || 'Sin descripción' }}</p>
          </td>
          <td class="px-4 py-3 text-gray-600">{{ product.category?.name ?? '—' }}</td>
          <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(product.price) }}</td>
          <td class="px-4 py-3 text-center">
              <span
                  :class="[
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  product.stock < LOW_STOCK_THRESHOLD ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700',
                ]"
              >
                {{ product.stock }}
              </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-2">
              <RouterLink
                  :to="{ name: 'product-edit', params: { id: product.id } }"
                  class="btn-secondary px-3 py-1"
              >
                Editar
              </RouterLink>
              <button
                  type="button"
                  class="btn-danger px-3 py-1"
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