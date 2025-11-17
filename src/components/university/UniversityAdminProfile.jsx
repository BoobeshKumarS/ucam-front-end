import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { adminService } from "../../services/adminService";
import { updateUserProfile } from "../../store/slices/authSlice";
import { FaUser, FaEdit, FaSave, FaTimes, FaBuilding } from "react-icons/fa";

const UniversityAdminProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentUniversity } = useSelector((state) => state.universities);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminData = await adminService.getCurrentAdmin();
      setProfile(adminData);
      setFormData(adminData);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Error fetching admin profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      const updatedProfile = await adminService.updateAdmin(profile.id, formData);
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      dispatch(updateUserProfile(updatedProfile));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating admin profile:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setValidationErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Loading profile...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Admin Profile</h2>
              <p className="text-muted mb-0">
                Manage your personal information and account details.
              </p>
            </div>
            <Badge bg="success" className="fs-6 px-3 py-2">
              <FaUser className="me-1" />
              Admin
            </Badge>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Personal Information</h5>
              {!isEditing ? (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="me-1" />
                  Edit Profile
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSave}
                    disabled={updating}
                  >
                    {updating ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaSave className="me-1" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCancel}
                    disabled={updating}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">First Name</Form.Label>
                    {isEditing ? (
                      <>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.firstName}
                        </Form.Control.Feedback>
                      </>
                    ) : (
                      <p className="mb-0 text-dark">{profile?.firstName || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Last Name</Form.Label>
                    {isEditing ? (
                      <>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.lastName}
                        </Form.Control.Feedback>
                      </>
                    ) : (
                      <p className="mb-0 text-dark">{profile?.lastName || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        disabled
                        readOnly
                      />
                    ) : (
                      <p className="mb-0 text-dark">{profile?.email || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Phone Number</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mb-0 text-dark">{profile?.phoneNumber || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mb-0 text-dark">
                        {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Gender</Form.Label>
                    {isEditing ? (
                      <Form.Select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option> 
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </Form.Select>
                    ) : (
                      <p className="mb-0 text-dark">
                        {profile.gender || "Not provided"}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Nationality</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="nationality"
                        value={formData.nationality || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mb-0 text-dark">{profile?.nationality || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col>
                {/* <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Address</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="mb-0 text-dark">{profile?.address || "Not provided"}</p>
                    )}
                  </Form.Group>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 fw-semibold">Account Details</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Account ID</small>
                <p className="mb-2 fw-semibold">{profile?.id || "N/A"}</p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Member Since</small>
                <p className="mb-2 fw-semibold">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="mb-0">
                <small className="text-muted">Last Updated</small>
                <p className="mb-0 fw-semibold">
                  {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </Card.Body>
          </Card>

          {currentUniversity && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h5 className="mb-0 fw-semibold">
                  <FaBuilding className="me-2" />
                  Associated University
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">{currentUniversity.name}</h6>
                  <p className="text-muted mb-2 small">
                    {currentUniversity.city}, {currentUniversity.state}, {currentUniversity.country}
                  </p>
                  {/* <Badge bg="primary">{currentUniversity.fieldOfStudy?.length || 0} Fields of Study</Badge> */}
                </div>
                <div className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => window.location.href = "/university/dashboard"}
                  >
                    Manage University
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UniversityAdminProfile;
