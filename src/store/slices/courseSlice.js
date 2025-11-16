import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  courses: [],
  currentCourses: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1
  },
  count: 0
}

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false
      state.courses = Array.isArray(action.payload.courses) ? action.payload.courses : []
      state.pagination = action.payload.pagination || initialState.pagination
      state.count = action.payload.count || 0
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    fetchCoursesByUniversityStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCoursesByUniversitySuccess: (state, action) => {
      state.loading = false
      state.currentCourses = Array.isArray(action.payload.courses) ? action.payload.courses : []
      state.pagination = action.payload.pagination || initialState.pagination
      state.count = action.payload.count || state.currentCourses.length
    },
    fetchCoursesByUniversityFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    // ... rest of the reducers remain the same
    createCourseStart: (state) => {
      state.loading = true
      state.error = null
    },
    createCourseSuccess: (state, action) => {
      state.loading = false
      state.currentCourses.push(action.payload)
    },
    createCourseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateCourseStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateCourseSuccess: (state, action) => {
      state.loading = false
      const index = state.currentCourses.findIndex(course => course.id === action.payload.id)
      if (index !== -1) {
        state.currentCourses[index] = action.payload
      }
    },
    updateCourseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    deleteCourseStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteCourseSuccess: (state, action) => {
      state.loading = false
      state.currentCourses = state.currentCourses.filter(course => course.id !== action.payload)
    },
    deleteCourseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearCourseError: (state) => {
      state.error = null
    },
  },
})

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  fetchCoursesByUniversityStart,
  fetchCoursesByUniversitySuccess,
  fetchCoursesByUniversityFailure,
  createCourseStart,
  createCourseSuccess,
  createCourseFailure,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
  clearCourseError,
} = courseSlice.actions

export default courseSlice.reducer