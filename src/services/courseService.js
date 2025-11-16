import api from './api'

export const courseService = {
  getAllCourses: async (page = 1, limit = 10) => {
    const response = await api.get(`/courses?page=${page}&limit=${limit}`)
    return response.data
  },

  getCoursesByUniversity: async (universityId) => {
    const response = await api.get(`/courses/university/${universityId}`)
    return response.data
  },

  createCourse: async (universityId, courseData) => {
    const response = await api.post(`/courses/${universityId}`, courseData)
    return response.data
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },
}