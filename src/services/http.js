import axios from "axios"
import { useToastStore} from "@/stores/toast"
import { normalizeError} from "@/utils/errorHandler"

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const apiError = normalizeError(error)

        if (!error.config?.silent) {
            useToastStore().error(apiError.message)
        }

        if (import.meta.env.DEV) {
            console.error('[API Error]', apiError)
        }

        return Promise.reject(error)
    },
)

export default http