import http from './http'

const RESOURCE = '/products'

export const productService = {
    async getAll(params = {}) {
        const { data } = await http.get(RESOURCE, { params })
        return data
    },

    async getById(id) {
        const { data } = await http.get(`${RESOURCE}/${id}`)
        return data
    },

    async create(payload) {
        const { data } = await http.post(RESOURCE, payload)
        return data
    },

    async update(id, payload) {
        const { data } = await http.put(`${RESOURCE}/${id}`, payload)
        return data
    },

    async remove(id) {
        const { data } = await http.delete(`${RESOURCE}/${id}`)
        return data
    },
}