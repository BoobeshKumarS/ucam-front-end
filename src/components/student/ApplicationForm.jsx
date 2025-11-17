import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createApplication } from "../../store/thunks/applicationThunks";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const ApplicationForm = ({ course, onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.applications);

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      country: "",
      phoneNumber: "",
    },
    agreedToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate()

  // Auto-fill form with student data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          country: user.nationality || "",
          phoneNumber: user.phoneNumber || "",
        },
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "agreedToTerms") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name.startsWith("personalInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.personalInfo.fullName.trim()) {
        errors.fullName = "Full name is required";
      }
      if (!formData.personalInfo.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
        errors.email = "Email is invalid";
      }
      if (!formData.personalInfo.country.trim()) {
        errors.country = "Country is required";
      }
      if (!formData.personalInfo.phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required";
      }
    }

    if (step === 2 && !formData.agreedToTerms) {
      errors.agreedToTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    try {
      const applicationData = {
        universityId: course.university,
        courseId: course.id,
        personalInfo: formData.personalInfo,
        agreedToTerms: formData.agreedToTerms,
      };

      // The thunk will automatically fetch the student ID from /students/me
      await dispatch(createApplication(applicationData)).unwrap();

      toast.success("Application submitted successfully!");
      // Navigate to student dashboard
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error || "Failed to submit application");
    }
  };

  const progress = (currentStep / 2) * 100;

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={onBack}
          className="d-flex align-items-center mb-3"
        >
          <FaArrowLeft className="me-2" />
          Back to Courses
        </Button>

        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary mb-2">
            Apply for {course.name}
          </h1>
          <p className="lead text-muted">
            Complete your application for this course
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">Application Progress</span>
              <span className="text-muted">Step {currentStep} of 2</span>
            </div>
            <ProgressBar
              now={progress}
              variant="primary"
              style={{ height: "8px" }}
            />
            <div className="d-flex justify-content-between mt-2">
              <small
                className={
                  currentStep >= 1 ? "text-primary fw-semibold" : "text-muted"
                }
              >
                Personal Information
              </small>
              <small
                className={
                  currentStep >= 2 ? "text-primary fw-semibold" : "text-muted"
                }
              >
                Review & Submit
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {/* Course Summary */}
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Course Details</h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Course:</strong> {course.name}
                      </p>
                      <p className="mb-2">
                        <strong>Level:</strong> {course.level}
                      </p>
                      <p className="mb-0">
                        <strong>Duration:</strong> {course.duration}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Language:</strong> {course.language}
                      </p>
                      <p className="mb-2">
                        <strong>Price Range:</strong> {course.priceRange}
                      </p>
                      <p className="mb-0">
                        <strong>Description:</strong> {course.description}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div>
                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                      <FaUser className="me-2 text-primary" />
                      Personal Information
                    </h5>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Full Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="personalInfo.fullName"
                            value={formData.personalInfo.fullName}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.fullName}
                            placeholder="Enter your full name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.fullName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Email <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="personalInfo.email"
                            value={formData.personalInfo.email}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.email}
                            placeholder="Enter your email address"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Country <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="personalInfo.country"
                            value={formData.personalInfo.country}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.country}
                            placeholder="Enter your country"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Phone Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="personalInfo.phoneNumber"
                            value={formData.personalInfo.phoneNumber}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.phoneNumber}
                            placeholder="Enter your phone number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.phoneNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button variant="primary" onClick={handleNext} disabled={user.role === 'ADMIN'}>
                        {user.role !== 'ADMIN' ? 'Next Step' : 'Only Student can Apply'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Review & Submit */}
                {currentStep === 2 && (
                  <div>
                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                      <FaFileAlt className="me-2 text-primary" />
                      Review & Submit
                    </h5>

                    <Card className="border-0 bg-light mb-4">
                      <Card.Body>
                        <h6 className="fw-semibold mb-3">
                          Application Summary
                        </h6>
                        <Row>
                          <Col md={6}>
                            <p>
                              <strong>Course:</strong> {course.name}
                            </p>
                            <p>
                              <strong>Full Name:</strong>{" "}
                              {formData.personalInfo.fullName}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {formData.personalInfo.email}
                            </p>
                          </Col>
                          <Col md={6}>
                            <p>
                              <strong>Country:</strong>{" "}
                              {formData.personalInfo.country}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {formData.personalInfo.phoneNumber}
                            </p>
                            <p>
                              <strong>Application Date:</strong>{" "}
                              {new Date().toLocaleDateString()}
                            </p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="agreedToTerms"
                        label={
                          <span>
                            I agree to the{" "}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Terms and Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Privacy Policy
                            </a>
                            <span className="text-danger">*</span>
                          </span>
                        }
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.agreedToTerms}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.agreedToTerms}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-primary" onClick={handleBack}>
                        Back
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={loading}
                        className="d-flex align-items-center"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationForm;
