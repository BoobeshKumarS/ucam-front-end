import { createSlice } from '@reduxjs/toolkit'

// Function to decode JWT token and get user information
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Decoded token payload:', payload) // For debugging
    
    // Extract role from roles array and convert to our role format
    const userRole = payload.roles && payload.roles.length > 0 
      ? (payload.roles[0] === 'ROLE_ADMIN' ? 'ADMIN' : 'STUDENT')
      : 'STUDENT'
    
    return {
      id: payload.sub, // Using email as ID since no UUID in token
      email: payload.email,
      role: userRole,
      firstName: payload.username.charAt(0).toUpperCase() + payload.username.slice(1).toLowerCase(),
      lastName: ''
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.token = action.payload.token
      
      // Decode token to get user information including role
      const userData = decodeToken(action.payload.token)
      state.user = userData
      
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(userData))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    registerStart: (state) => {
      state.loading = true
      state.error = null
    },
    registerSuccess: (state, action) => {
      state.loading = false
    },
    registerFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    // New action to update user profile with complete data
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  updateUser,
  updateUserProfile,
} = authSlice.actions

export default authSlice.reducer