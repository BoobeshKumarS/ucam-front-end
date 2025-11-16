import { applicationService } from '../../services/applicationService'
import { studentService } from '../../services/studentService'
import {
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
 submitApplicationStart,
 submitApplicationSuccess,
 submitApplicationFailure,
 updateApplicationStatusStart,
 updateApplicationStatusSuccess,
 updateApplicationStatusFailure,
} from '../slices/applicationSlice'

export const fetchApplications = () => async (dispatch, getState) => {
 dispatch(fetchApplicationsStart())
 try {
  // First get current student to get the ID
  const studentResponse = await studentService.getCurrentStudent()
  const studentId = studentResponse.id
   
  const applications = await applicationService.getApplicationsByStudent(studentId)
  dispatch(fetchApplicationsSuccess(applications))
 } catch (error) {
  dispatch(fetchApplicationsFailure(error.response?.data?.message || 'Failed to fetch applications'))
 }
}

export const fetchApplicationsByUniversity = (universityId) => async (dispatch) => {
 dispatch(fetchApplicationsByUniversityStart())
 try {
  const applications = await applicationService.getApplicationsByUniversity(universityId)
  dispatch(fetchApplicationsByUniversitySuccess(applications))
 } catch (error) {
  dispatch(fetchApplicationsByUniversityFailure(error.response?.data?.message || 'Failed to fetch applications'))
 }
}

export const createApplication = (applicationData) => async (dispatch) => {
 dispatch(createApplicationStart())
 try {
  // First get current student to get the ID
  const studentResponse = await studentService.getCurrentStudent()
  const studentId = studentResponse.id
   
  if (!studentId) {
   throw new Error('Student ID not found')
  }

  const application = await applicationService.createApplication(studentId, applicationData)
   
  // NEW: Automatically submit the application after creation
  try {
   const submittedApplication = await applicationService.submitApplication(application.applicationId || application.id)
   dispatch(createApplicationSuccess(submittedApplication))
   return submittedApplication
  } catch (submitError) {
   // If submit fails, still return the created application but log the error
   console.error('Failed to submit application after creation:', submitError)
   dispatch(createApplicationSuccess(application))
   return application
  }
 } catch (error) {
  dispatch(createApplicationFailure(error.response?.data?.message || 'Failed to create application'))
  throw error
 }
}

export const updateApplication = (applicationData) => async (dispatch) => {
 dispatch(updateApplicationStart())
 try {
  const application = await applicationService.updateApplication(applicationData.id, applicationData)
  dispatch(updateApplicationSuccess(application))
  return application
 } catch (error) {
  dispatch(updateApplicationFailure(error.response?.data?.message || 'Failed to update application'))
  throw error
 }
}

// NEW: Submit application
export const submitApplication = (applicationId) => async (dispatch) => {
 dispatch(submitApplicationStart())
 try {
  const application = await applicationService.submitApplication(applicationId)
  dispatch(submitApplicationSuccess(application))
  return application
 } catch (error) {
  dispatch(submitApplicationFailure(error.response?.data?.message || 'Failed to submit application'))
  throw error
 }
}

// NEW: Update application status (for admin)
export const updateApplicationStatus = (applicationId, status) => async (dispatch) => {
 dispatch(updateApplicationStatusStart())
 try {
  const application = await applicationService.updateApplicationStatus(applicationId, status)
  dispatch(updateApplicationStatusSuccess(application))
  return application
 } catch (error) {
  dispatch(updateApplicationStatusFailure(error.response?.data?.message || 'Failed to update application status'))
  throw error
 }
}