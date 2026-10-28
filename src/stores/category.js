import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '@/services/categoryService'
import { useToastStore } from './toast'

const sortByName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name))

export const useCategoryStore = defineStore('category', () => {
    const categories = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const deletingId = ref(null)
    const error = ref(null)

    const toast = useToastStore()

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            const res = await categoryService.getAll()
            categories.value = res.data
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function create(payload) {
        saving.value = true
        try {
            const res = await categoryService.create(payload)
            categories.value = sortByName([...categories.value, res.data])
            toast.success(res.message)
            return res.data
        } finally {
            saving.value = false
        }
    }

    async function update(id, payload) {
        saving.value = true
        try {
            const res = await categoryService.update(id, payload)
            categories.value = sortByName(
                categories.value.map((category) => (category.id === id ? res.data : category)),
            )
            toast.success(res.message)
            return res.data
        } finally {
            saving.value = false
        }
    }

    async function remove(id) {
        deletingId.value = id
        try {
            const res = await categoryService.remove(id)
            categories.value = categories.value.filter((category) => category.id !== id)
            toast.success(res.message)
        } finally {
            deletingId.value = null
        }
    }

    return { categories, loading, saving, deletingId, error, fetchAll, create, update, remove }
})