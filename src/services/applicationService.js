import api from './api'

export const applicationService = {
  getApplicationsByStudent: async (studentId) => {
    const response = await api.get(`/applications/students/${studentId}`)
    return response.data
  },

  getApplicationsByUniversity: async (universityId) => {
    const response = await api.get(`/applications/universities/${universityId}`)
    return response.data
  },

  createApplication: async (studentId, applicationData) => {
    const response = await api.post(`/applications/${studentId}`, applicationData)
    return response.data
  },

  updateApplication: async (id, applicationData) => {
    const response = await api.put(`/applications/${id}`, applicationData)
    return response.data
  },

 submitApplication: async (id) => {
  const response = await api.post(`/applications/${id}/submit`)
  return response.data
 },

 updateApplicationStatus: async (id, status) => {
  const response = await api.put(`/applications/${id}/{status}?status=${status}`)
  return response.data
 },

 getApplicationById: async (id) => {
  const response = await api.get(`/applications/${id}`)
  return response.data
 }
}