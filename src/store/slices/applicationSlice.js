import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
  universityApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchApplicationsByUniversityStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsByUniversitySuccess: (state, action) => {
      state.loading = false;
      state.universityApplications = action.payload;
    },
    fetchApplicationsByUniversityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createApplicationSuccess: (state, action) => {
      state.loading = false;
      state.applications.push(action.payload);
    },
    createApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateApplicationSuccess: (state, action) => {
      state.loading = false;
      const index = state.universityApplications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.universityApplications[index] = action.payload;
      }
      // Also update in student applications if exists
      const studentIndex = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (studentIndex !== -1) {
        state.applications[studentIndex] = action.payload;
      }
    },
    updateApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearApplicationError: (state) => {
      state.error = null;
    },

    // Add these to your existing slice
    submitApplicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitApplicationSuccess: (state, action) => {
      state.loading = false;
      // Update the specific application in the list
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    submitApplicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateApplicationStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateApplicationStatusSuccess: (state, action) => {
      state.loading = false;
      // Update the specific application in the list
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      // Also update in universityApplications if it exists
      const uniIndex = state.universityApplications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (uniIndex !== -1) {
        state.universityApplications[uniIndex] = action.payload;
      }
    },
    updateApplicationStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  fetchApplicationsByUniversityStart,
  fetchApplicationsByUniversitySuccess,
  fetchApplicationsByUniversityFailure,
  createApplicationStart,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplicationStart,
  updateApplicationSuccess,
  updateApplicationFailure,
  clearApplicationError,
  submitApplicationStart,
  submitApplicationSuccess,
  submitApplicationFailure,
  updateApplicationStatusStart,
  updateApplicationStatusSuccess,
  updateApplicationStatusFailure,
} = applicationSlice.actions;

export default applicationSlice.reducer;
