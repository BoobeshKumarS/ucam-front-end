import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Container } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './store'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Universities from './pages/Universities'
import Courses from './pages/Courses'
import StudentDashboard from './components/student/StudentDashboard'
import StudentProfile from './components/student/StudentProfile'
import UniversityDashboard from './components/university/UniversityDashboard'
import UniversityAdminProfile from './components/university/UniversityAdminProfile'

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Navbar />
            <Container fluid className="mt-3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/courses" element={<Courses />} />
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UniversityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UniversityAdminProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
            <ToastContainer 
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  )
}

export default App