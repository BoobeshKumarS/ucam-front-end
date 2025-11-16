export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  UNIVERSITY: 'UNIVERSITY',
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'