import React, { useEffect, useState } from 'react'
import { Table, Badge, Button, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplicationsByUniversity, updateApplicationStatus } from '../../store/thunks/applicationThunks'
import { toast } from 'react-toastify'
import { FaEye, FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa'
import ApplicationDetails from '../student/ApplicationDetails'

const ApplicationManagement = ({ universityId }) => {
  const dispatch = useDispatch()
  const { universityApplications, loading, error } = useSelector((state) => state.applications)
  const { currentUniversity } = useSelector((state) => state.universities)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)


  useEffect(() => {
    if (universityId) {
      dispatch(fetchApplicationsByUniversity(universityId))
    }
  }, [dispatch, universityId])

  // Helper function to get course name by courseId
  const getCourseName = (courseId) => {
    if (!currentUniversity?.courses) return 'N/A'
    const course = currentUniversity.courses.find(course => course.id === courseId)
    return course ? course.name : 'N/A'
  }

  // Helper function to get university name (should be current university)
  const getUniversityName = () => {
    return currentUniversity?.name || 'N/A'
  }

  // Helper function to get student name from personalInfo
  const getStudentName = (application) => {
    return application.personalInfo?.fullName || application.studentName || 'N/A'
  }

  // Helper function to get student email from personalInfo
  const getStudentEmail = (application) => {
    return application.personalInfo?.email || 'N/A'
  }

  const handleStatusUpdate = async (applicationId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return // No change needed

    const confirmed = window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)
    if (!confirmed) return

    setUpdatingStatus(applicationId)

    try {
      await dispatch(updateApplicationStatus(applicationId, newStatus)).unwrap()

      // Refresh the applications list to show updated status
      dispatch(fetchApplicationsByUniversity(universityId))

      toast.success(`Application status updated to ${newStatus}!`)
    } catch (error) {
      toast.error(error || 'Status update failed')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'DRAFT':
        return { bg: 'secondary', icon: <FaEdit className="me-1" /> }
      case 'SUBMITTED':
        return { bg: 'info', icon: <FaHourglassHalf className="me-1" /> }
      case 'UNDER_REVIEW':
        return { bg: 'warning', icon: <FaClock className="me-1" /> }
      case 'ACTION_REQUIRED':
        return { bg: 'danger', icon: <FaExclamationTriangle className="me-1" /> }
      case 'APPROVED':
        return { bg: 'success', icon: <FaCheckCircle className="me-1" /> }
      case 'REJECTED':
        return { bg: 'danger', icon: <FaTimesCircle className="me-1" /> }
      default:
        return { bg: 'secondary', icon: null }
    }
  }

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ACTION_REQUIRED', label: 'Action Required' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ]

  if (loading) return (
    <div className="text-center py-4">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Loading applications...</p>
    </div>
  )
  
  if (error) return <Alert variant="danger">{error}</Alert>

  if (universityApplications.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <FaEye size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No Applications Received</h5>
          <p className="text-muted">Applications from students will appear here once they apply to your courses.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Student Applications</h4>
        <Badge bg="primary" className="fs-6">
          {universityApplications.length} Applications
        </Badge>
      </div>

      <Row className="g-4">
        {universityApplications.map((app, index) => {
          const statusInfo = getStatusVariant(app.status)
          return (
            <Col lg={6} xl={4} key={app.applicationId || app.id}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      <Badge bg={statusInfo.bg} className="d-inline-flex align-items-center fs-6 me-2">
                        {statusInfo.icon}
                        {app.status}
                      </Badge>
                      <Form.Select
                        size="sm"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusUpdate(app.applicationId || app.id, e.target.value, app.status)
                            e.target.value = "" // Reset select after change
                          }
                        }}
                        disabled={updatingStatus === (app.applicationId || app.id)}
                        className="border"
                        style={{ minWidth: '140px', fontSize: '0.875rem' }}
                      >
                        <option value="">Change Status</option>
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <small className="text-muted">
                      #{index + 1}
                    </small>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <h5 className="fw-bold text-dark mb-2">{getStudentName(app)}</h5>
                  <p className="text-muted mb-2">
                    <small>{getStudentEmail(app)}</small>
                  </p>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-semibold">Course:</span>
                      <span className="ms-2">{getCourseName(app.courseId)}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-semibold">University:</span>
                      <span className="ms-2">{getUniversityName()}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold">Applied:</span>
                      <span className="ms-2">
                        {new Date(app.createdAt || app.submittedAt || app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => {
                      setSelectedApplication(app)
                      setShowDetailsModal(true)
                    }}
                    className="d-flex align-items-center w-100"
                  >
                    <FaEye className="me-1" />
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          )
        })}
      </Row>



      {/* Application Details Modal */}
      <ApplicationDetails
        application={selectedApplication}
        show={showDetailsModal}
        onHide={() => {
          setShowDetailsModal(false)
          setSelectedApplication(null)
        }}
        readOnly={true}
      />
    </div>
  )
}

export default ApplicationManagement