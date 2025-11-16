import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaUniversity,
  FaEye,
  FaEyeSlash,
  FaVenusMars,
  FaGlobe,
} from "react-icons/fa";

const Register = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [studentFormData, setStudentFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phoneNumber: "",
    gender: "Male",
    nationality: "",
    address: "",
  });
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phoneNumber: "",
    gender: "Male",
    nationality: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({ student: {}, admin: {} });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      password
    );

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    };
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validateDateOfBirth = (dateOfBirth, isStudent = false) => {
    if (!dateOfBirth)
      return { isValid: false, error: "Date of birth is required" };

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (isStudent) {
      // For students: must be at least 16 years old and not older than 80
      if (actualAge < 16) {
        return {
          isValid: false,
          error: "Students must be at least 16 years old",
        };
      }
      if (actualAge > 80) {
        return { isValid: false, error: "Please enter a valid date of birth" };
      }
    } else {
      // For admins: must be at least 18 years old
      if (actualAge < 18) {
        return { isValid: false, error: "You must be at least 18 years old" };
      }
      if (actualAge > 100) {
        return { isValid: false, error: "Please enter a valid date of birth" };
      }
    }

    return { isValid: true, age: actualAge };
  };

  const validateForm = (formData, isStudent = false) => {
    const errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (!validateName(formData.firstName)) {
      errors.firstName =
        "First name must be 2-50 characters and contain only letters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (!validateName(formData.lastName)) {
      errors.lastName =
        "Last name must be 2-50 characters and contain only letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = "Password does not meet requirements";
        errors.passwordDetails = passwordValidation;
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Date of Birth validation
    const dobValidation = validateDateOfBirth(formData.dateOfBirth, isStudent);
    if (!dobValidation.isValid) {
      errors.dateOfBirth = dobValidation.error;
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    // Nationality validation
    if (!formData.nationality.trim()) {
      errors.nationality = "Nationality is required";
    } else if (formData.nationality.trim().length < 2) {
      errors.nationality = "Please enter a valid nationality";
    }

    // Address validation (for students only)
    if (isStudent && !formData.address.trim()) {
      errors.address = "Address is required";
    } else if (isStudent && formData.address.trim().length < 10) {
      errors.address =
        "Please enter a complete address (minimum 10 characters)";
    }

    return errors;
  };

  const showValidationErrors = (errors) => {
    // Show general field errors
    Object.keys(errors).forEach((field) => {
      if (field !== "passwordDetails" && errors[field]) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)}: ${errors[field]}`
        );
      }
    });

    // Show detailed password requirements
    if (errors.passwordDetails) {
      const details = errors.passwordDetails;
      const missingRequirements = [];

      if (!details.hasUpperCase) missingRequirements.push("uppercase letter");
      if (!details.hasLowerCase) missingRequirements.push("lowercase letter");
      if (!details.hasNumber) missingRequirements.push("number");
      if (!details.hasSpecialChar)
        missingRequirements.push("special character");
      if (
        activeTab === "student"
          ? studentFormData.password.length < details.minLength
          : adminFormData.password.length < details.minLength
      ) {
        missingRequirements.push(`minimum ${details.minLength} characters`);
      }

      if (missingRequirements.length > 0) {
        toast.error(
          `Password must contain: ${missingRequirements.join(", ")}`,
          { autoClose: 5000 }
        );
      }
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({
      ...studentFormData,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (formErrors.student[name]) {
      setFormErrors({
        ...formErrors,
        student: {
          ...formErrors.student,
          [name]: null,
          passwordDetails:
            name === "password" ? null : formErrors.student.passwordDetails,
        },
      });
    }
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (formErrors.admin[name]) {
      setFormErrors({
        ...formErrors,
        admin: {
          ...formErrors.admin,
          [name]: null,
          passwordDetails:
            name === "password" ? null : formErrors.admin.passwordDetails,
        },
      });
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(studentFormData, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...formErrors, student: errors });
      showValidationErrors(errors);
      return;
    }

    if (studentFormData.password !== studentFormData.confirmPassword) {
      const passwordError = { confirmPassword: "Passwords do not match" };
      setFormErrors({ ...formErrors, student: passwordError });
      toast.error("Passwords do not match");
      return;
    }

    dispatch(registerStart());
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...studentData } = studentFormData;
      await authService.registerStudent(studentData);
      dispatch(registerSuccess());
      toast.success("Student registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      dispatch(
        registerFailure(error.response?.data?.message || "Registration failed")
      );
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(adminFormData, false);
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...formErrors, admin: errors });
      showValidationErrors(errors);
      return;
    }

    if (adminFormData.password !== adminFormData.confirmPassword) {
      const passwordError = { confirmPassword: "Passwords do not match" };
      setFormErrors({ ...formErrors, admin: passwordError });
      toast.error("Passwords do not match");
      return;
    }

    dispatch(registerStart());
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...adminData } = adminFormData;
      await authService.registerAdmin(adminData);
      dispatch(registerSuccess());
      toast.success("Admin registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      dispatch(
        registerFailure(error.response?.data?.message || "Registration failed")
      );
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // Real-time password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return null;

    const validation = validatePassword(password);
    const requirements = [
      { met: password.length >= 8, text: "8+ characters" },
      { met: validation.hasUpperCase, text: "Uppercase letter" },
      { met: validation.hasLowerCase, text: "Lowercase letter" },
      { met: validation.hasNumber, text: "Number" },
      { met: validation.hasSpecialChar, text: "Special character" },
    ];

    const metCount = requirements.filter((req) => req.met).length;
    const strength = (metCount / requirements.length) * 100;

    return { requirements, strength };
  };

  const studentPasswordStrength = getPasswordStrength(studentFormData.password);
  const adminPasswordStrength = getPasswordStrength(adminFormData.password);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-2">
                Join Our Community
              </h1>
              <p className="lead text-muted">
                Create your account and start your academic journey today
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4 border-0"
                  justify
                >
                  {/* Student Registration Tab */}
                  <Tab
                    eventKey="student"
                    title={
                      <span className="d-flex align-items-center">
                        <FaGraduationCap className="me-2" />
                        Student Registration
                      </span>
                    }
                  >
                    <Row className="g-4">
                      <Col lg={6}>
                        <div className="h-100 d-flex flex-column">
                          <div className="text-center mb-4">
                            <div
                              className="bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: "60px", height: "60px" }}
                            >
                              <FaGraduationCap
                                className="text-white"
                                size={24}
                              />
                            </div>
                            <h4 className="fw-bold">Student Account</h4>
                            <p className="text-muted">
                              Join as a student to explore courses and apply to
                              universities
                            </p>
                          </div>

                          {error && (
                            <Alert
                              variant="danger"
                              onClose={() => dispatch(clearError())}
                              dismissible
                              className="border-0"
                            >
                              <strong>Error!</strong> {error}
                            </Alert>
                          )}

                          <Form onSubmit={handleStudentSubmit}>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    First Name *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaUser className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="firstName"
                                      value={studentFormData.firstName}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.firstName
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Enter first name"
                                    />
                                  </div>
                                  {formErrors.student.firstName && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.firstName}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Last Name *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaUser className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="lastName"
                                      value={studentFormData.lastName}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.lastName
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Enter last name"
                                    />
                                  </div>
                                  {formErrors.student.lastName && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.lastName}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">
                                Email Address *
                              </Form.Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <FaEnvelope className="text-muted" />
                                </span>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={studentFormData.email}
                                  onChange={handleStudentChange}
                                  required
                                  className={`border-start-0 ${
                                    formErrors.student.email ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter your email"
                                />
                              </div>
                              {formErrors.student.email && (
                                <div className="invalid-feedback d-block">
                                  {formErrors.student.email}
                                </div>
                              )}
                            </Form.Group>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Password *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaLock className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      value={studentFormData.password}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.password
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Create password"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-light border-start-0"
                                      onClick={togglePasswordVisibility}
                                    >
                                      {showPassword ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </button>
                                  </div>
                                  {formErrors.student.password && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.password}
                                    </div>
                                  )}

                                  {/* Password Strength Indicator */}
                                  {studentFormData.password && (
                                    <div className="mt-2">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">
                                          Password Strength:
                                        </small>
                                        <small
                                          className={`fw-semibold ${
                                            studentPasswordStrength.strength <
                                            40
                                              ? "text-danger"
                                              : studentPasswordStrength.strength <
                                                80
                                              ? "text-warning"
                                              : "text-success"
                                          }`}
                                        >
                                          {studentPasswordStrength.strength < 40
                                            ? "Weak"
                                            : studentPasswordStrength.strength <
                                              80
                                            ? "Medium"
                                            : "Strong"}
                                        </small>
                                      </div>
                                      <div
                                        className="progress mb-2"
                                        style={{ height: "4px" }}
                                      >
                                        <div
                                          className={`progress-bar ${
                                            studentPasswordStrength.strength <
                                            40
                                              ? "bg-danger"
                                              : studentPasswordStrength.strength <
                                                80
                                              ? "bg-warning"
                                              : "bg-success"
                                          }`}
                                          style={{
                                            width: `${studentPasswordStrength.strength}%`,
                                          }}
                                        />
                                      </div>

                                      {/* Password Requirements */}
                                      <div className="small">
                                        {studentPasswordStrength.requirements.map(
                                          (req, index) => (
                                            <div
                                              key={index}
                                              className={`d-flex align-items-center mb-1 ${
                                                req.met
                                                  ? "text-success"
                                                  : "text-muted"
                                              }`}
                                            >
                                              <span
                                                className={`me-2 ${
                                                  req.met
                                                    ? "text-success"
                                                    : "text-muted"
                                                }`}
                                              >
                                                {req.met ? "✓" : "○"}
                                              </span>
                                              {req.text}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Confirm Password *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaLock className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      name="confirmPassword"
                                      value={studentFormData.confirmPassword}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.confirmPassword
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Confirm password"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-light border-start-0"
                                      onClick={toggleConfirmPasswordVisibility}
                                    >
                                      {showConfirmPassword ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </button>
                                  </div>
                                  {formErrors.student.confirmPassword && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.confirmPassword}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Date of Birth *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaCalendarAlt className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="date"
                                      name="dateOfBirth"
                                      value={studentFormData.dateOfBirth}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.dateOfBirth
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  {formErrors.student.dateOfBirth && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.dateOfBirth}
                                    </div>
                                  )}
                                  <Form.Text className="text-muted">
                                    Must be at least 16 years old to register as
                                    a student
                                  </Form.Text>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Phone Number *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaPhone className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="tel"
                                      name="phoneNumber"
                                      value={studentFormData.phoneNumber}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.phoneNumber
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Your phone number"
                                    />
                                  </div>
                                  {formErrors.student.phoneNumber && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.phoneNumber}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Gender *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaVenusMars className="text-muted" />
                                    </span>
                                    <Form.Select
                                      name="gender"
                                      value={studentFormData.gender}
                                      onChange={handleStudentChange}
                                      required
                                      className="border-start-0"
                                    >
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Non-binary">Non-binary</option>
                                      <option value="Prefer not to say">Prefer not to say</option>
                                    </Form.Select>
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Nationality *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaGlobe className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="nationality"
                                      value={studentFormData.nationality}
                                      onChange={handleStudentChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.student.nationality
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Your nationality"
                                    />
                                  </div>
                                  {formErrors.student.nationality && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.student.nationality}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Address *
                              </Form.Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <FaMapMarkerAlt className="text-muted" />
                                </span>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name="address"
                                  value={studentFormData.address}
                                  onChange={handleStudentChange}
                                  required
                                  className={`border-start-0 ${
                                    formErrors.student.address
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="Enter your complete address"
                                />
                              </div>
                              {formErrors.student.address && (
                                <div className="invalid-feedback d-block">
                                  {formErrors.student.address}
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
                                    Creating Account...
                                  </>
                                ) : (
                                  "Create Student Account"
                                )}
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </Col>

                      <Col lg={6}>
                        {/* Student benefits section remains the same */}
                        <div className="h-100 d-flex flex-column justify-content-center p-4 bg-primary bg-opacity-5 rounded">
                          <h5 className="fw-semibold mb-4">
                            Why Join as a Student?
                          </h5>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary text-white rounded-circle p-2 me-3">
                              <FaGraduationCap size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Explore Thousands of Courses
                              </h6>
                              <p className="text-muted small mb-0">
                                Discover courses from top universities worldwide
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-success text-white rounded-circle p-2 me-3">
                              <FaUniversity size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Easy Application Process
                              </h6>
                              <p className="text-muted small mb-0">
                                Apply to multiple universities with a single
                                profile
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-warning text-white rounded-circle p-2 me-3">
                              <FaMapMarkerAlt size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Track Your Applications
                              </h6>
                              <p className="text-muted small mb-0">
                                Monitor your application status in real-time
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-white rounded border">
                            <p className="text-muted small mb-2">
                              "This platform helped me find the perfect
                              university for my masters degree. The application
                              process was incredibly smooth!"
                            </p>
                            <p className="fw-semibold small mb-0">
                              - Sarah Johnson, Computer Science Student
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab>
                  {/* Admin Registration Tab */}
                  <Tab
                    eventKey="admin"
                    title={
                      <span className="d-flex align-items-center">
                        <FaUniversity className="me-2" />
                        Admin Registration
                      </span>
                    }
                  >
                    <Row className="g-4">
                      <Col lg={6}>
                        <div className="h-100 d-flex flex-column">
                          <div className="text-center mb-4">
                            <div
                              className="bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: "60px", height: "60px" }}
                            >
                              <FaUniversity className="text-white" size={24} />
                            </div>
                            <h4 className="fw-bold">Admin Account</h4>
                            <p className="text-muted">
                              Join as an admin to manage university and courses
                            </p>
                          </div>

                          {error && (
                            <Alert
                              variant="danger"
                              onClose={() => dispatch(clearError())}
                              dismissible
                              className="border-0"
                            >
                              <strong>Error!</strong> {error}
                            </Alert>
                          )}

                          <Form onSubmit={handleAdminSubmit}>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    First Name *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaUser className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="firstName"
                                      value={adminFormData.firstName}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.firstName
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Enter first name"
                                    />
                                  </div>
                                  {formErrors.admin.firstName && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.firstName}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Last Name *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaUser className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="lastName"
                                      value={adminFormData.lastName}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.lastName
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Enter last name"
                                    />
                                  </div>
                                  {formErrors.admin.lastName && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.lastName}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">
                                Email Address *
                              </Form.Label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <FaEnvelope className="text-muted" />
                                </span>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={adminFormData.email}
                                  onChange={handleAdminChange}
                                  required
                                  className={`border-start-0 ${
                                    formErrors.admin.email ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter your email"
                                />
                              </div>
                              {formErrors.admin.email && (
                                <div className="invalid-feedback d-block">
                                  {formErrors.admin.email}
                                </div>
                              )}
                            </Form.Group>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Password *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaLock className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      value={adminFormData.password}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.password
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Create password"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-light border-start-0"
                                      onClick={togglePasswordVisibility}
                                    >
                                      {showPassword ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </button>
                                  </div>
                                  {formErrors.admin.password && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.password}
                                    </div>
                                  )}

                                  {/* Password Strength Indicator */}
                                  {adminFormData.password && (
                                    <div className="mt-2">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">
                                          Password Strength:
                                        </small>
                                        <small
                                          className={`fw-semibold ${
                                            adminPasswordStrength.strength < 40
                                              ? "text-danger"
                                              : adminPasswordStrength.strength <
                                                80
                                              ? "text-warning"
                                              : "text-success"
                                          }`}
                                        >
                                          {adminPasswordStrength.strength < 40
                                            ? "Weak"
                                            : adminPasswordStrength.strength <
                                              80
                                            ? "Medium"
                                            : "Strong"}
                                        </small>
                                      </div>
                                      <div
                                        className="progress mb-2"
                                        style={{ height: "4px" }}
                                      >
                                        <div
                                          className={`progress-bar ${
                                            adminPasswordStrength.strength < 40
                                              ? "bg-danger"
                                              : adminPasswordStrength.strength <
                                                80
                                              ? "bg-warning"
                                              : "bg-success"
                                          }`}
                                          style={{
                                            width: `${adminPasswordStrength.strength}%`,
                                          }}
                                        />
                                      </div>

                                      {/* Password Requirements */}
                                      <div className="small">
                                        {adminPasswordStrength.requirements.map(
                                          (req, index) => (
                                            <div
                                              key={index}
                                              className={`d-flex align-items-center mb-1 ${
                                                req.met
                                                  ? "text-success"
                                                  : "text-muted"
                                              }`}
                                            >
                                              <span
                                                className={`me-2 ${
                                                  req.met
                                                    ? "text-success"
                                                    : "text-muted"
                                                }`}
                                              >
                                                {req.met ? "✓" : "○"}
                                              </span>
                                              {req.text}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Confirm Password *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaLock className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      name="confirmPassword"
                                      value={adminFormData.confirmPassword}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.confirmPassword
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Confirm password"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-light border-start-0"
                                      onClick={toggleConfirmPasswordVisibility}
                                    >
                                      {showConfirmPassword ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </button>
                                  </div>
                                  {formErrors.admin.confirmPassword && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.confirmPassword}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Date of Birth *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaCalendarAlt className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="date"
                                      name="dateOfBirth"
                                      value={adminFormData.dateOfBirth}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.dateOfBirth
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  {formErrors.admin.dateOfBirth && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.dateOfBirth}
                                    </div>
                                  )}
                                  <Form.Text className="text-muted">
                                    Must be at least 18 years old to register as
                                    an admin
                                  </Form.Text>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Phone Number *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaPhone className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="tel"
                                      name="phoneNumber"
                                      value={adminFormData.phoneNumber}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.phoneNumber
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Your phone number"
                                    />
                                  </div>
                                  {formErrors.admin.phoneNumber && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.phoneNumber}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Gender *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaVenusMars className="text-muted" />
                                    </span>
                                    <Form.Select
                                      name="gender"
                                      value={adminFormData.gender}
                                      onChange={handleAdminChange}
                                      required
                                      className="border-start-0"
                                    >
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Non-binary">Non-binary</option>
                                      <option value="Prefer not to say">Prefer not to say</option>
                                    </Form.Select>
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    Nationality *
                                  </Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                      <FaGlobe className="text-muted" />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      name="nationality"
                                      value={adminFormData.nationality}
                                      onChange={handleAdminChange}
                                      required
                                      className={`border-start-0 ${
                                        formErrors.admin.nationality
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Your nationality"
                                    />
                                  </div>
                                  {formErrors.admin.nationality && (
                                    <div className="invalid-feedback d-block">
                                      {formErrors.admin.nationality}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className="d-grid">
                              <Button
                                variant="success"
                                type="submit"
                                size="lg"
                                disabled={loading}
                                className="fw-semibold py-2"
                              >
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Creating Account...
                                  </>
                                ) : (
                                  "Create Admin Account"
                                )}
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </Col>

                      <Col lg={6}>
                        {/* Admin benefits section remains the same */}
                        <div className="h-100 d-flex flex-column justify-content-center p-4 bg-success bg-opacity-5 rounded">
                          <h5 className="fw-semibold mb-4">
                            Benefits for Admins
                          </h5>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-success text-white rounded-circle p-2 me-3">
                              <FaUser size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Manage University Profile
                              </h6>
                              <p className="text-muted small mb-0">
                                Create and update your university information
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary text-white rounded-circle p-2 me-3">
                              <FaGraduationCap size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Course Management
                              </h6>
                              <p className="text-muted small mb-0">
                                Add, edit, and manage courses offered by your
                                university
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-4">
                            <div className="bg-warning text-white rounded-circle p-2 me-3">
                              <FaMapMarkerAlt size={16} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                Application Management
                              </h6>
                              <p className="text-muted small mb-0">
                                Review and process student applications
                                efficiently
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-white rounded border">
                            <p className="text-muted small mb-2">
                              "This platform has transformed how we manage
                              international applications. The tools are
                              intuitive and the student quality is exceptional."
                            </p>
                            <p className="fw-semibold small mb-0">
                              - Dr. Michael Chen, University Administrator
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
