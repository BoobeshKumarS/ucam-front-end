import api from './api'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  registerStudent: async (studentData) => {
    const response = await api.post('/students/register', studentData)
    return response.data
  },

  registerAdmin: async (adminData) => {
    const response = await api.post('/admins/register', adminData)
    return response.data
  },
}