import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import universityReducer from './slices/universitySlice'
import courseReducer from './slices/courseSlice'
import applicationReducer from './slices/applicationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    universities: universityReducer,
    courses: courseReducer,
    applications: applicationReducer,
  },
})