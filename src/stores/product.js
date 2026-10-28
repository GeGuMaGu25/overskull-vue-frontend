import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/productService'
import { useToastStore } from './toast'

export const useProductStore = defineStore('product', () => {
    const products = ref([])
    const current = ref(null)
    const loading = ref(false)
    const saving = ref(false)
    const deletingId = ref(null)
    const error = ref(null)

    const toast = useToastStore()

    async function fetchAll(params = {}) {
        loading.value = true
        error.value = null
        try {
            const res = await productService.getAll(params)
            products.value = res.data
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function fetchById(id) {
        loading.value = true
        error.value = null
        try {
            const res = await productService.getById(id)
            current.value = res.data
            return res.data
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function create(payload) {
        saving.value = true
        try {
            const res = await productService.create(payload)
            products.value.unshift(res.data)
            toast.success(res.message)
            return res.data
        } finally {
            saving.value = false
        }
    }

    async function update(id, payload) {
        saving.value = true
        try {
            const res = await productService.update(id, payload)
            const index = products.value.findIndex((product) => product.id === res.data.id)
            if (index !== -1) products.value[index] = res.data
            current.value = res.data
            toast.success(res.message)
            return res.data
        } finally {
            saving.value = false
        }
    }

    async function remove(id) {
        deletingId.value = id
        try {
            const res = await productService.remove(id)
            products.value = products.value.filter((product) => product.id !== id)
            toast.success(res.message)
        } finally {
            deletingId.value = null
        }
    }

    return {
        products,
        current,
        loading,
        saving,
        deletingId,
        error,
        fetchAll,
        fetchById,
        create,
        update,
        remove,
    }
})