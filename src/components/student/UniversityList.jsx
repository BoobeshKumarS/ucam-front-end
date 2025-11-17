import React from 'react'
import { Card, Row, Col, Button, Badge } from 'react-bootstrap'
import { FaMapMarkerAlt, FaStar, FaUsers, FaArrowRight, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa'

const UniversityList = ({ universities = [], onViewCourses }) => {
  // Ensure universities is always an array
  const safeUniversities = Array.isArray(universities) ? universities : []

  if (safeUniversities.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No universities available.</p>
      </div>
    )
  }

  return (
    <Row className="g-4">
      {safeUniversities.map((university) => (
        <Col lg={6} key={university.id}>
          <Card className="border-0 shadow-sm h-100 hover-lift">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-2">{university.name || 'University Name'}</h5>
                  <div className="d-flex align-items-center text-muted mb-2">
                    <FaMapMarkerAlt className="me-2" size={14} />
                    <small>
                      {[university.city, university.state, university.country]
                        .filter(Boolean)
                        .join(', ') || 'Location not specified'}
                    </small>
                  </div>
                </div>
                <Badge bg="outline-primary" text="primary" className="fs-6">
                  <FaStar className="text-warning me-1" />
                  4.8
                </Badge>
              </div>

              {/* Fields of Study */}
              {university.fieldOfStudy && university.fieldOfStudy.length > 0 && (
                <div className="mb-3">
                  <h6 className="fw-semibold mb-2">Fields of Study:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {university.fieldOfStudy.slice(0, 3).map((field, index) => (
                      <Badge key={index} bg="light" text="dark" className="fs-7">
                        {field}
                      </Badge>
                    ))}
                    {university.fieldOfStudy.length > 3 && (
                      <Badge bg="secondary" className="fs-7">
                        +{university.fieldOfStudy.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Tuition Fee */}
              {/* <div className="mb-3">
                <div className="d-flex align-items-center text-muted mb-2">
                  <FaMoneyBillWave className="me-2" size={14} />
                  <span className="fw-semibold">Tuition: </span>
                  <span className="ms-2">
                    {university.tuitionFee ? `${university.tuitionFee} ${university.currency}` : 'Not specified'}
                  </span>
                </div>
              </div> */}

              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <Badge bg="light" text="dark" className="d-flex align-items-center">
                    <FaUsers className="me-1" size={12} />
                    15K Students
                  </Badge>
                  <Badge bg="light" text="dark">
                    {university.courses.length} Course(s)
                  </Badge>
                  <Badge bg="light" text="dark">
                    Est. 1890
                  </Badge>
                </div>
              </div>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  onClick={() => onViewCourses(university)}
                  className="d-flex align-items-center justify-content-center"
                >
                  View Courses
                  <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default UniversityList