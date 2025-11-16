import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Table,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  fetchCoursesByUniversity,
} from "../../store/thunks/courseThunks";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { Country } from 'country-state-city';

const CourseForm = ({ universityId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "BACHELOR",
    duration: "",
    language: "English",
    price: "",
    currency: "USD",
  });

  const [formErrors, setFormErrors] = useState({});
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCourse, setViewingCourse] = useState(null);

  const dispatch = useDispatch();
  const { currentCourses, loading, error } = useSelector(
    (state) => state.courses
  );
  const { currentUniversity } = useSelector((state) => state.universities);

  const levelOptions = ["DIPLOMA", "BACHELOR", "MASTER", "DOCTORATE"];

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Other",
  ];

  // Get currency based on university country
  const getCurrencyOptions = () => {
    if (currentUniversity?.country) {
      const country = Country.getAllCountries().find(
        c => c.name === currentUniversity.country
      );
      if (country?.currency) {
        const currencies = country.currency.split(',');
        return currencies.map(currency => ({
          value: currency.trim(),
          label: `${currency.trim()} - ${getCurrencyName(currency.trim())}`
        }));
      }
    }
    
    // Default currencies if no university country found
    return [
      { value: "USD", label: "USD - US Dollar" },
      { value: "EUR", label: "EUR - Euro" },
      { value: "GBP", label: "GBP - British Pound" },
      { value: "INR", label: "INR - Indian Rupee" },
      { value: "CAD", label: "CAD - Canadian Dollar" },
      { value: "AUD", label: "AUD - Australian Dollar" },
      { value: "JPY", label: "JPY - Japanese Yen" },
      { value: "CNY", label: "CNY - Chinese Yuan" },
    ];
  };

  const getCurrencyName = (currencyCode) => {
    const currencyNames = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'INR': 'Indian Rupee',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'JPY': 'Japanese Yen',
      'CNY': 'Chinese Yuan'
    };
    return currencyNames[currencyCode] || currencyCode;
  };

  // Auto-set currency based on university location when form opens
  useEffect(() => {
    if (showForm && currentUniversity?.country && !editingCourse) {
      const currencyOptions = getCurrencyOptions();
      if (currencyOptions.length > 0) {
        setFormData(prev => ({
          ...prev,
          currency: currencyOptions[0].value
        }));
      }
    }
  }, [showForm, currentUniversity, editingCourse]);

  useEffect(() => {
    if (universityId) {
      dispatch(fetchCoursesByUniversity(universityId));
    }
  }, [dispatch, universityId]);

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name || "",
        description: editingCourse.description || "",
        level: editingCourse.level || "BACHELOR",
        duration: editingCourse.duration?.toString() || "",
        language: editingCourse.language || "English",
        price: editingCourse.price?.toString() || "",
        currency: editingCourse.currency || "USD",
      });
      setShowForm(true);
    }
  }, [editingCourse]);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Course name is required";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Course name must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    // Duration validation
    if (!formData.duration) {
      errors.duration = "Duration is required";
    } else {
      const duration = parseInt(formData.duration);
      if (isNaN(duration) || duration <= 0) {
        errors.duration = "Duration must be greater than 0";
      } else if (duration > 10) {
        errors.duration = "Duration cannot exceed 10 years";
      }
    }

    // Language validation
    if (!formData.language) {
      errors.language = "Language is required";
    }

    // Price validation
    if (!formData.price) {
      errors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        errors.price = "Price must be greater than 0";
      }
    }

    // Currency validation
    if (!formData.currency) {
      errors.currency = "Currency is required";
    } else if (!/^[A-Z]{3}$/.test(formData.currency)) {
      errors.currency = "Currency must be a valid ISO code (e.g., USD, INR)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showValidationErrors = () => {
    Object.keys(formErrors).forEach((field) => {
      if (formErrors[field]) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        toast.error(`${fieldName}: ${formErrors[field]}`);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showValidationErrors();
      return;
    }

    try {
      const courseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        level: formData.level,
        duration: parseInt(formData.duration),
        language: formData.language,
        price: parseFloat(formData.price),
        currency: formData.currency,
      };

      if (editingCourse) {
        await dispatch(
          updateCourse({
            ...courseData,
            id: editingCourse.id,
          })
        );
        toast.success("Course updated successfully!");
      } else {
        await dispatch(
          createCourse({
            ...courseData,
            universityId: universityId,
          })
        );
        toast.success("Course created successfully!");
      }

      resetForm();
      setShowForm(false);
      setEditingCourse(null);
    } catch (error) {
      toast.error(error || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      level: "BACHELOR",
      duration: "",
      language: "English",
      price: "",
      currency: "USD",
    });
    setFormErrors({});
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleView = (course) => {
    setViewingCourse(course);
    setShowViewModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      await dispatch(deleteCourse(courseToDelete.id));
      toast.success("Course deleted successfully!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      toast.error(error || "Delete failed");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
    resetForm();
  };

  const getLevelVariant = (level) => {
    switch (level) {
      case "DIPLOMA":
        return "dark";
      case "BACHELOR":
        return "primary";
      case "MASTER":
        return "success";
      case "DOCTORATE":
        return "info";
      default:
        return "secondary";
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const currencyOptions = getCurrencyOptions();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Manage Courses</h4>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="d-flex align-items-center"
          disabled={!currentUniversity}
        >
          <FaPlus className="me-2" />
          Add New Course
        </Button>
      </div>

      {!currentUniversity && (
        <Alert variant="warning" className="mb-4">
          <strong>University profile required:</strong> Please set up your university profile first to manage courses.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      {/* Course Form Modal */}
      <Modal show={showForm} onHide={handleCancel} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? "Edit Course" : "Create New Course"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={formErrors.name ? "is-invalid" : ""}
                    placeholder="Enter course name"
                    maxLength={100}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                  <Form.Text className="text-muted">
                    {formData.name.length}/100 characters
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Level *</Form.Label>
                  <Form.Select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {level.replace("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Duration (Years) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    step="1"
                    className={formErrors.duration ? "is-invalid" : ""}
                    placeholder="e.g., 4"
                  />
                  {formErrors.duration && (
                    <div className="invalid-feedback">
                      {formErrors.duration}
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Duration in years (1-10 years)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Language *</Form.Label>
                  <Form.Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className={formErrors.price ? "is-invalid" : ""}
                    placeholder="e.g., 5000.00"
                  />
                  {formErrors.price && (
                    <div className="invalid-feedback">{formErrors.price}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Currency *</Form.Label>
                  <Form.Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className={formErrors.currency ? "is-invalid" : ""}
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </Form.Select>
                  {formErrors.currency && (
                    <div className="invalid-feedback">
                      {formErrors.currency}
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    {currentUniversity?.country 
                      ? `Based on university location: ${currentUniversity.country}`
                      : 'Select currency'
                    }
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className={formErrors.description ? "is-invalid" : ""}
                    placeholder="Enter course description"
                    maxLength={500}
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">
                      {formErrors.description}
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    {formData.description.length}/500 characters
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              <FaTimes className="me-1" />
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="d-flex align-items-center"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editingCourse ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FaSave className="me-1" />
                  {editingCourse ? "Update Course" : "Create Course"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Course View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Course Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingCourse && (
            <Row>
              <Col md={12}>
                <h4 className="fw-bold">{viewingCourse.name}</h4>
                <Badge
                  bg={getLevelVariant(viewingCourse.level)}
                  className="mb-3"
                >
                  {viewingCourse.level.replace("_", " ")}
                </Badge>

                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-1">{viewingCourse.description}</p>
                </div>

                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Duration:</strong> {viewingCourse.duration} years
                    </p>
                    <p>
                      <strong>Language:</strong> {viewingCourse.language}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Price:</strong>{" "}
                      {formatPrice(viewingCourse.price, viewingCourse.currency)}
                    </p>
                    <p>
                      <strong>Currency:</strong> {viewingCourse.currency}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(viewingCourse.createdAt).toLocaleDateString()}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Existing Courses */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {currentCourses.length === 0 ? (
            <div className="text-center py-5">
              <FaPlus size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No Courses Yet</h5>
              <p className="text-muted mb-4">
                Get started by creating your first course for students to apply to.
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
                disabled={!currentUniversity}
              >
                Create First Course
              </Button>
              {!currentUniversity && (
                <div className="mt-2">
                  <small className="text-warning">
                    University profile required to create courses
                  </small>
                </div>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0">Course Name</th>
                    <th className="border-0">Level</th>
                    <th className="border-0">Duration</th>
          <th className="border-0">Price</th>
          <th className="border-0">Language</th>
          <th className="border-0">Created Date</th>
          <th className="border-0 text-center">Actions</th>
         </tr>
        </thead>
        <tbody>
         {currentCourses.map((course) => (
          <tr key={course.id}>
           <td>
            <div>
             <h6 className="mb-1 fw-semibold">{course.name}</h6>
             <p className="text-muted mb-0 small">
              {course.description?.substring(0, 50)}...
             </p>
            </div>
           </td>
           <td>
            <Badge bg={getLevelVariant(course.level)}>
             {course.level.replace("_", " ")}
            </Badge>
           </td>
           <td>{course.duration} years</td>
           <td>{formatPrice(course.price, course.currency)}</td>
           <td>{course.language}</td>
           <td>{new Date(course.createdAt).toLocaleDateString()}</td>
           <td className="text-center">
            <div className="d-flex justify-content-center gap-2">
             <Button
              variant="outline-info"
              size="sm"
              onClick={() => handleView(course)}
              className="d-flex align-items-center"
             >
              <FaEye className="me-1" />
              View
             </Button>
             <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEdit(course)}
              className="d-flex align-items-center"
             >
              <FaEdit className="me-1" />
              Edit
             </Button>
             <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(course)}
              className="d-flex align-items-center"
             >
              <FaTrash className="me-1" />
              Delete
             </Button>
            </div>
           </td>
          </tr>
         ))}
        </tbody>
       </Table>
      </div>
     )}
    </Card.Body>
   </Card>

   {/* Delete Confirmation Modal */}
   <Modal
    show={showDeleteModal}
    onHide={() => setShowDeleteModal(false)}
    centered
   >
    <Modal.Header closeButton>
     <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>
     Are you sure you want to delete the course "{courseToDelete?.name}"?
     This action cannot be undone.
    </Modal.Body>
    <Modal.Footer>
     <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
     </Button>
     <Button variant="danger" onClick={confirmDelete}>
      Delete Course
     </Button>
    </Modal.Footer>
   </Modal>
  </div>
 );
};

export default CourseForm;