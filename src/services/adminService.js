import api from './api'

export const adminService = {
  getCurrentAdmin: async () => {
    const response = await api.get('/admins/me')
    return response.data
  },

  updateAdmin: async (adminId, adminData) => {
    const response = await api.put(`/admins/${adminId}`, adminData)
    return response.data
  },
}