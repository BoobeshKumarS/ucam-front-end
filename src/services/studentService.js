import api from './api'

export const studentService = {
  getCurrentStudent: async () => {
    const response = await api.get('/students/me')
    return response.data
  },

  updateStudent: async (studentData) => {
    const response = await api.put('/students/me', studentData)
    return response.data
  },
} 