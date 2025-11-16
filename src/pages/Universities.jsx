import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, InputGroup, Badge, Pagination } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUniversities } from '../store/thunks/universityThunks'
import { fetchCoursesByUniversity } from '../store/thunks/courseThunks'
import UniversityList from '../components/student/UniversityList'
import CourseList from '../components/student/CourseList'
import ApplicationForm from '../components/student/ApplicationForm'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaArrowLeft, FaStar, FaUsers, FaBook, FaUniversity, FaGraduationCap } from 'react-icons/fa'

const Universities = () => {
  const dispatch = useDispatch()
  const { universities: universitiesState, loading, error, pagination, count } = useSelector((state) => state.universities)
  const { currentCourses, loading: coursesLoading } = useSelector((state) => state.courses)
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Safely get universities array from state
  const universities = Array.isArray(universitiesState) ? universitiesState : []

  useEffect(() => {
    dispatch(fetchUniversities(currentPage))
  }, [dispatch, currentPage])

  const handleViewCourses = (university) => {
    setSelectedUniversity(university)
    dispatch(fetchCoursesByUniversity(university.id))
  }

  const handleBackToUniversities = () => {
    setSelectedUniversity(null)
    setShowApplicationForm(false)
    setSelectedCourse(null)
  }

  // Updated handleApply function - redirects to application form
  const handleApply = (course) => {
    setSelectedCourse(course)
    setShowApplicationForm(true)
  }

  // Filter universities based on search and filter (client-side filtering for now)
  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.country?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = !filterCountry || university.country === filterCountry
    return matchesSearch && matchesCountry
  })

  // Get unique countries for filter
  const countries = [...new Set(universities.map(u => u.country).filter(Boolean))].sort()

  // Pagination
  const totalPages = pagination?.totalPages || 1
  const renderPaginationItems = () => {
    let items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      )
    }
    return items
  }

  if (loading && universities.length === 0) {
    return (
      <div className="min-vh-50 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading universities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>Error Loading Universities</h5>
          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    )
  }

  // Show application form if course is selected
  if (showApplicationForm && selectedCourse) {
    return (
      <ApplicationForm 
        course={selectedCourse}
        onBack={handleBackToUniversities}
      />
    )
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        {selectedUniversity && !showApplicationForm ? (
          // Course View
          <div>
            <Button 
              variant="outline-primary" 
              onClick={handleBackToUniversities} 
              className="mb-4 d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Back to Universities
            </Button>

            {/* University Header */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <div className="bg-gradient-primary text-white p-5">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h1 className="display-6 fw-bold mb-2">{selectedUniversity.name}</h1>
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="me-2 opacity-75" />
                        <span>{selectedUniversity.city}, {selectedUniversity.country}</span>
                      </div>
                      <Badge bg="light" text="dark" className="fs-6">
                        <FaStar className="text-warning me-1" />
                        4.8 Rating
                      </Badge>
                      <Badge bg="light" text="dark" className="fs-6">
                        <FaUsers className="text-primary me-1" />
                        15,000+ Students
                      </Badge>
                    </div>
                    {selectedUniversity.fieldOfStudy && selectedUniversity.fieldOfStudy.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-semibold mb-2">Fields of Study:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedUniversity.fieldOfStudy.map((field, index) => (
                            <Badge key={index} bg="light" text="dark">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="d-flex align-items-center">
                      <FaGraduationCap className="me-2 opacity-75" />
                      <span className="fw-semibold">Tuition Fee: </span>
                      <span className="ms-2">
                        {selectedUniversity.tuitionFee} {selectedUniversity.currency}
                      </span>
                    </div>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="bg-opacity-20 rounded p-4">
                      <FaUniversity size={48} className="mb-3 opacity-75" />
                      <h5 className="mb-1">University Info</h5>
                      {selectedUniversity.contactEmail && (
                        <p className="mb-1 small">{selectedUniversity.contactEmail}</p>
                      )}
                      {selectedUniversity.contactPhone && (
                        <p className="mb-0 small">{selectedUniversity.contactPhone}</p>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Courses Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-bold mb-1">Available Courses</h3>
                  <p className="text-muted mb-0">
                    Explore {currentCourses.length} courses offered by {selectedUniversity.name}
                  </p>
                </div>
                <Badge bg="primary" className="fs-6 px-3 py-2">
                  <FaBook className="me-1" />
                  {currentCourses.length} Courses
                </Badge>
              </div>
              <CourseList 
                courses={currentCourses}
                onApply={handleApply}
                isLoading={coursesLoading}
              />
            </div>
          </div>
        ) : (
          // Universities List View
          <div>
            {/* Hero Section */}
            <Row className="mb-5">
              <Col lg={8} className="mx-auto text-center">
                <h1 className="display-5 fw-bold text-primary mb-3">
                  Explore Top Universities
                </h1>
                <p className="lead text-muted mb-4">
                  Discover {count} prestigious universities from around the world. 
                  Find your perfect academic home and start your journey today.
                </p>
              </Col>
            </Row>

            {/* Search and Filter Section */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <Row className="g-3">
                  <Col md={8}>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FaSearch className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search universities by name, city, or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FaFilter className="text-muted" />
                      </InputGroup.Text>
                      <Form.Select
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="border-start-0"
                      >
                        <option value="">All Countries</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Stats Bar */}
            <Row className="g-3 mb-4">
              <Col lg={3} md={6}>
                <Card className="border-0 bg-gradient-primary text-white">
                  <Card.Body className="text-center p-3">
                    <h4 className="fw-bold mb-1">{count}</h4>
                    <p className="mb-0 opacity-75">Total Universities</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 bg-gradient-success text-white">
                  <Card.Body className="text-center p-3">
                    <h4 className="fw-bold mb-1">{countries.length}</h4>
                    <p className="mb-0 opacity-75">Countries</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 bg-gradient-warning text-white">
                  <Card.Body className="text-center p-3">
                    <h4 className="fw-bold mb-1">500+</h4>
                    <p className="mb-0 opacity-75">Courses Available</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 bg-gradient-info text-white">
                  <Card.Body className="text-center p-3">
                    <h4 className="fw-bold mb-1">10K+</h4>
                    <p className="mb-0 opacity-75">Student Applications</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Results Info */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-semibold mb-1">
                  {filteredUniversities.length} University{filteredUniversities.length !== 1 ? 's' : ''} Found
                </h5>
                <p className="text-muted mb-0">
                  {searchTerm && `for "${searchTerm}"`} {filterCountry && `in ${filterCountry}`}
                </p>
              </div>
              <div className="text-muted small">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Universities List */}
            {filteredUniversities.length === 0 ? (
<Card className="border-0 shadow-sm text-center py-5">
                <Card.Body>
                  <FaSearch size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No universities found</h5>
                  <p className="text-muted mb-3">
                    {universities.length === 0 
                      ? "No universities are currently available. Please check back later."
                      : "Try adjusting your search criteria or browse all universities."
                    }
                  </p>
                  {universities.length > 0 && (
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setSearchTerm('')
                        setFilterCountry('')
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <UniversityList 
                universities={filteredUniversities} 
                onViewCourses={handleViewCourses}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {renderPaginationItems()}
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Universities