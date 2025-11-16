import api from './api'

export const adminService = {
  getCurrentAdmin: async () => {
    const response = await api.get('/admins/me')
    return response.data
  },

  updateAdmin: async (adminData) => {
    const response = await api.put('/admins/me', adminData)
    return response.data
  },
}