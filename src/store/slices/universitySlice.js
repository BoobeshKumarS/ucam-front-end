import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  universities: [],
  currentUniversity: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1
  },
  count: 0
}

const universitySlice = createSlice({
  name: 'universities',
  initialState,
  reducers: {
    fetchUniversitiesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchUniversitiesSuccess: (state, action) => {
      state.loading = false
      state.universities = action.payload.universities || []
      state.pagination = action.payload.pagination || initialState.pagination
      state.count = action.payload.count || 0
    },
    fetchUniversitiesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    createUniversityStart: (state) => {
      state.loading = true
      state.error = null
    },
    createUniversitySuccess: (state, action) => {
      state.loading = false
      state.universities.push(action.payload)
      state.currentUniversity = action.payload
    },
    createUniversityFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    setCurrentUniversity: (state, action) => {
      state.currentUniversity = action.payload
    },
    clearUniversityError: (state) => {
      state.error = null
    },
  },
})

export const {
  fetchUniversitiesStart,
  fetchUniversitiesSuccess,
  fetchUniversitiesFailure,
  createUniversityStart,
  createUniversitySuccess,
  createUniversityFailure,
  setCurrentUniversity,
  clearUniversityError,
} = universitySlice.actions

export default universitySlice.reducer