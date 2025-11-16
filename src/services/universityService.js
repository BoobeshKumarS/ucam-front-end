import api from './api'

export const universityService = {
  getAllUniversities: async (page = 1, limit = 10) => {
    const response = await api.get(`/universities?page=${page}&limit=${limit}`)
    return response.data
  },

  getUniversityById: async (id) => {
    const response = await api.get(`/universities/${id}`)
    return response.data
  },

  getUniversityByAdmin: async (adminId) => {
    const response = await api.get(`/universities/admin/${adminId}`)
    return response.data
  },

  createUniversity: async (universityData) => {
    const response = await api.post('/universities', universityData)
    return response.data
  },

  updateUniversity: async (id, universityData) => {
    const response = await api.put(`/universities/${id}`, universityData)
    return response.data
  },
}