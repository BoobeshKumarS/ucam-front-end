import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaGraduationCap, FaUniversity, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard')
      } else if (user.role === 'ADMIN') {
        navigate('/university/dashboard')
      } else {
        navigate('/')
      }
    }
  }, [isAuthenticated, user, navigate])

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    }
  }

  const validateForm = () => {
    const errors = {}

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        errors.password = 'Password does not meet requirements'
        errors.passwordDetails = passwordValidation
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
        passwordDetails: name === 'password' ? null : formErrors.passwordDetails
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      showValidationErrors()
      return
    }

    dispatch(loginStart())

    try {
      const response = await authService.login(formData)
      dispatch(loginSuccess(response))
      toast.success('Login successful!')
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'))
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const showValidationErrors = () => {
    if (formErrors.email) {
      toast.error(formErrors.email)
    }

    if (formErrors.password) {
      if (formErrors.passwordDetails) {
        const details = formErrors.passwordDetails
        const missingRequirements = []
        
        if (!details.hasUpperCase) missingRequirements.push('uppercase letter')
        if (!details.hasLowerCase) missingRequirements.push('lowercase letter')
        if (!details.hasNumber) missingRequirements.push('number')
        if (!details.hasSpecialChar) missingRequirements.push('special character')
        if (formData.password.length < details.minLength) missingRequirements.push(`minimum ${details.minLength} characters`)

        toast.error(
          `Password must contain: ${missingRequirements.join(', ')}`,
          { autoClose: 5000 }
        )
      } else {
        toast.error(formErrors.password)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Real-time password strength indicator
  const getPasswordStrength = () => {
    if (!formData.password) return null

    const validation = validatePassword(formData.password)
    const requirements = [
      { met: formData.password.length >= 8, text: '8+ characters' },
      { met: validation.hasUpperCase, text: 'Uppercase letter' },
      { met: validation.hasLowerCase, text: 'Lowercase letter' },
      { met: validation.hasNumber, text: 'Number' },
      { met: validation.hasSpecialChar, text: 'Special character' }
    ]

    const metCount = requirements.filter(req => req.met).length
    const strength = (metCount / requirements.length) * 100

    return { requirements, strength }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-2">
                Welcome Back
              </h1>
              <p className="lead text-muted">
                Sign in to continue your academic journey
              </p>
            </div>

            <Row className="g-4">
              {/* Left Side - Form */}
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                      <div className="bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{width: '60px', height: '60px'}}>
                        <FaUser className="text-white" size={24} />
                      </div>
                      <h4 className="fw-bold">Sign In</h4>
                      <p className="text-muted">Enter your credentials to access your account</p>
                    </div>
                    
                    {error && (
                      <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible className="border-0">
                        <strong>Error!</strong> {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaUser className="text-muted" />
                          </span>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`border-start-0 ${formErrors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email"
                          />
                        </div>
                        {formErrors.email && (
                          <div className="invalid-feedback d-block">
                            {formErrors.email}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaLock className="text-muted" />
                          </span>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`border-start-0 ${formErrors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                          />
                          <button 
                            type="button"
                            className="input-group-text bg-light border-start-0"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {formErrors.password && (
                          <div className="invalid-feedback d-block">
                            {formErrors.password}
                          </div>
                        )}

                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <div className="mt-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">Password Strength:</small>
                              <small className={`fw-semibold ${
                                passwordStrength.strength < 40 ? 'text-danger' :
                                passwordStrength.strength < 80 ? 'text-warning' : 'text-success'
                              }`}>
                                {passwordStrength.strength < 40 ? 'Weak' :
                                 passwordStrength.strength < 80 ? 'Medium' : 'Strong'}
                              </small>
                            </div>
                            <div className="progress mb-2" style={{height: '4px'}}>
                              <div 
                                className={`progress-bar ${
                                  passwordStrength.strength < 40 ? 'bg-danger' :
                                  passwordStrength.strength < 80 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{width: `${passwordStrength.strength}%`}}
                              />
                            </div>
                            
                            {/* Password Requirements */}
                            <div className="small">
                              {passwordStrength.requirements.map((req, index) => (
                                <div 
                                  key={index} 
                                  className={`d-flex align-items-center mb-1 ${
                                    req.met ? 'text-success' : 'text-muted'
                                  }`}
                                >
                                  <span className={`me-2 ${req.met ? 'text-success' : 'text-muted'}`}>
                                    {req.met ? '✓' : '○'}
                                  </span>
                                  {req.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Form.Group>

                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          size="lg"
                          disabled={loading}
                          className="fw-semibold py-2"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Signing In...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </div>
                    </Form>

                    <div className="text-center mt-4">
                      <p className="text-muted mb-0">
                        Don't have an account?{' '}
                        <a href="/register" className="text-primary fw-semibold text-decoration-none">
                          Create one here
                        </a>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Side - Info */}
              <Col md={6}>
                <div className="h-100 d-flex flex-column justify-content-center">
                  <div className="bg-primary bg-opacity-10 border-start-4 border-primary rounded-end p-4">
                    <h5 className="fw-semibold mb-3">Join Our Learning Community</h5>
                    <div className="d-flex align-items-start mb-3">
                      <FaGraduationCap className="text-primary mt-1 me-3" />
                      <div>
                        <h6 className="mb-1">For Students</h6>
                        <p className="text-muted small mb-0">
                          Access thousands of courses and track your applications
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <FaUniversity className="text-primary mt-1 me-3" />
                      <div>
                        <h6 className="mb-1">For University Admins</h6>
                        <p className="text-muted small mb-0">
                          Manage courses and connect with prospective students
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <Row className="g-2 mt-4">
                    <Col xs={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <h5 className="fw-bold text-primary mb-1">50+</h5>
                        <small className="text-muted">Universities</small>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <h5 className="fw-bold text-success mb-1">10K+</h5>
                        <small className="text-muted">Students</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login