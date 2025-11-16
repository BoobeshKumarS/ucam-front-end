import React from 'react'
import { Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { FaClock, FaDollarSign, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaBook, FaLanguage, FaGraduationCap, FaUniversity } from 'react-icons/fa'

const CourseList = ({ 
  courses = [], 
  onApply, 
  showUniversity = false,
  isLoading = false 
}) => {
  const { user } = useSelector((state) => state.auth)
  const { applications = [] } = useSelector((state) => state.applications)
  const { universities = [] } = useSelector((state) => state.universities)

  const hasApplied = (courseId) => {
    return applications.some(app => app.courseId === courseId && app.studentId === user?.id)
  }

  const getApplicationStatus = (courseId) => {
    const application = applications.find(app => app.courseId === courseId && app.studentId === user?.id)
    return application ? application.status : null
  }

  const getUniversityName = (universityId) => {
    const university = universities.find(u => u.id === universityId)
    return university ? university.name : 'University'
  }

  // Handle different response formats
  const getCoursesArray = () => {
    if (Array.isArray(courses)) {
      return courses
    } else if (courses && Array.isArray(courses.data)) {
      return courses.data
    }
    return []
  }

  const safeCourses = getCoursesArray()

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading courses...</p>
      </div>
    )
  }

  if (safeCourses.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <FaBook className="me-2" />
        No courses available at the moment. Please check back later.
      </Alert>
    )
  }

  return (
    <Row className="g-4">
      {safeCourses.map((course) => {
        const applied = hasApplied(course.id)
        const applicationStatus = getApplicationStatus(course.id)
        const universityName = getUniversityName(course.university)
        
        return (
          <Col lg={6} xl={4} key={course.id}>
            <Card className="border-0 shadow-sm h-100 hover-lift">
              <Card.Header className="bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg="primary" className="fs-6">
                    {course.level || 'General'}
                  </Badge>
                  <Badge bg={applied ? (applicationStatus === 'APPROVED' ? 'success' : applicationStatus === 'REJECTED' ? 'danger' : 'warning') : 'outline-primary'} text={applied ? 'white' : 'primary'}>
                    {applied ? applicationStatus : 'Available'}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <h5 className="fw-bold text-dark mb-3">{course.name || 'Course Name'}</h5>
                
                {showUniversity && (
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <FaUniversity className="me-2" size={14} />
                    <small>{universityName}</small>
                  </div>
                )}
                
                <p className="text-muted mb-3">{course.description || 'No description available.'}</p>

                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-primary me-2" />
                    <span className="fw-semibold">Duration:</span>
                    <span className="ms-2">{course.duration + ' year(s)' || 'Not specified'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaGraduationCap className="text-success me-2" />
                    <span className="fw-semibold">Level:</span>
                    <span className="ms-2">{course.level || 'Not specified'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaLanguage className="text-info me-2" />
                    <span className="fw-semibold">Language:</span>
                    <span className="ms-2">{course.language || 'Not specified'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaDollarSign className="text-warning me-2" />
                    <span className="fw-semibold">Price Range:</span>
                    <span className="ms-2">{course.price + " (" + course.currency + ")" || 'Not specified'}</span>
                  </div>
                </div>

                {/* Course Image if available */}
                {course.courseImage && course.courseImage !== 'image' && (
                  <div className="mb-3">
                    <img 
                      src={course.courseImage} 
                      alt={course.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 pt-0">
                {applied ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <span className={`fw-semibold ${
                      applicationStatus === 'APPROVED' ? 'text-success' : 
                      applicationStatus === 'REJECTED' ? 'text-danger' : 'text-warning'
                    }`}>
                      {applicationStatus === 'APPROVED' ? (
                        <FaCheckCircle className="me-2" />
                      ) : applicationStatus === 'REJECTED' ? (
                        <FaTimesCircle className="me-2" />
                      ) : (
                        <FaClock className="me-2" />
                      )}
                      {applicationStatus}
                    </span>
                    <Button variant="outline-secondary" size="sm" disabled>
                      Applied
                    </Button>
                  </div>
                ) : (
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      onClick={() => onApply(course)}
                      disabled={!user}
                    >
                      {user ? 'Apply Now' : 'Login to Apply'}
                    </Button>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default CourseList