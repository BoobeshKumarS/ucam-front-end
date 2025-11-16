import { universityService } from '../../services/universityService'
import { adminService } from '../../services/adminService'
import { updateUserProfile } from '../slices/authSlice'
import {
  fetchUniversitiesStart,
  fetchUniversitiesSuccess,
  fetchUniversitiesFailure,
  createUniversityStart,
  createUniversitySuccess,
  createUniversityFailure,
  setCurrentUniversity,
  clearUniversityError,
} from '../slices/universitySlice'

export const fetchUniversities = (page = 1, limit = 10) => async (dispatch) => {
  dispatch(fetchUniversitiesStart())
  try {
    const response = await universityService.getAllUniversities(page, limit)
    dispatch(fetchUniversitiesSuccess({
      universities: response.data || [],
      pagination: response.pagination,
      count: response.count
    }))
  } catch (error) {
    dispatch(fetchUniversitiesFailure(error.response?.data?.message || 'Failed to fetch universities'))
  }
}

export const fetchCurrentUniversity = () => async (dispatch, getState) => {
  try {
    const state = getState()
    const user = state.auth.user
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Use the current user ID (from token/sub) to fetch university
    const university = await universityService.getUniversityByAdmin(user.id)
    dispatch(setCurrentUniversity(university))
  } catch (error) {
    console.error('Failed to fetch university:', error)
    // Set current university to null if not found (admin has no university yet)
  dispatch(setCurrentUniversity(null))
 }
}

export const createUniversity = (universityData) => async (dispatch) => {
 dispatch(createUniversityStart())
 try {
  const response = await universityService.createUniversity(universityData)
  dispatch(createUniversitySuccess(response.data))
   
  // After creating university, set it as current
  dispatch(setCurrentUniversity(response.data))
   
  return response.data
 } catch (error) {
  dispatch(createUniversityFailure(error.response?.data?.message || 'Failed to create university'))
  throw error
 }
}

export const updateUniversity = (universityData) => async (dispatch) => {
 dispatch(createUniversityStart())
 try {
  const response = await universityService.updateUniversity(universityData.id, universityData)
  dispatch(createUniversitySuccess(response.data))
  return response.data
 } catch (error) {
  dispatch(createUniversityFailure(error.response?.data?.message || 'Failed to update university'))
  throw error
 }
}

// Clear university error if needed
export const clearUniversityErrors = () => (dispatch) => {
 dispatch(clearUniversityError())
}