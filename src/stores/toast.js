import { defineStore } from "pinia"
import { ref } from 'vue'

let nextId = 1

export const useToastStore = defineStore('toast',() => {
    const toasts = ref([])

    function remove(id) {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    function show(type, message, duration = 4000) {
        const id = nextId++
        toasts.value.push({id, message, duration})

        if (duration > 0) {
            setTimeout(() => remove(id), duration)
        }

        return id
    }

    const success = (message) => show('success', message)
    const error = (message) => show('error', message, 6000)
    const info = (message) => show('info', message)

    return {toasts, show, success, error, info, remove}
})