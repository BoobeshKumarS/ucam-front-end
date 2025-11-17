import React, { useState } from 'react'
import { Table, Badge, Card, Button, Spinner } from 'react-bootstrap'
import { FaEye, FaDownload, FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa'
import ApplicationDetails from './ApplicationDetails'

const ApplicationList = ({ applications }) => {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Helper function to get status display info
  const getStatusVariant = (status) => {
    switch (status) {
      case 'DRAFT':
        return { bg: 'secondary', icon: <FaEdit className="me-1" />, label: 'Draft' }
      case 'SUBMITTED':
        return { bg: 'info', icon: <FaHourglassHalf className="me-1" />, label: 'Submitted' }
      case 'UNDER_REVIEW':
        return { bg: 'warning', icon: <FaClock className="me-1" />, label: 'Under Review' }
      case 'ACTION_REQUIRED':
        return { bg: 'danger', icon: <FaExclamationTriangle className="me-1" />, label: 'Action Required' }
      case 'APPROVED':
        return { bg: 'success', icon: <FaCheckCircle className="me-1" />, label: 'Approved' }
      case 'REJECTED':
        return { bg: 'danger', icon: <FaTimesCircle className="me-1" />, label: 'Rejected' }
      default:
        return { bg: 'secondary', icon: null, label: status }
    }
  }

  // Helper function to get display text for university and course
  // Since we only have IDs, we'll show meaningful text based on available data
  const getUniversityDisplay = (application) => {
    // If we have universityName in the application, use it
    if (application.universityName) {
      return application.universityName
    }
    // Otherwise show the university ID (you might want to fetch university names separately)
    return `University (${application.universityId?.substring(0, 8)}...)` || 'University'
  }

  const getCourseDisplay = (application) => {
    // If we have courseName in the application, use it
    if (application.courseName) {
      return application.courseName
    }
    // Otherwise show the course ID
    return `Course (${application.courseId?.substring(0, 8)}...)` || 'Course'
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setShowDetails(true)
  }

  if (applications.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="mb-3">
            <FaClock size={48} className="text-muted" />
          </div>
          <h5 className="text-muted">No Applications Yet</h5>
          <p className="text-muted mb-3">Start by browsing universities and applying to courses.</p>
          <Button variant="primary" href="/universities">
            Browse Universities
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">Application History</h5>
          <Badge bg="primary" className="fs-6">
            {applications.length} Applications
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Application ID</th>
                  <th className="border-0">University</th>
                  <th className="border-0">Course</th>
                  <th className="border-0">Applied Date</th>
                  <th className="border-0">Status</th>
                  <th className="border-0 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => {
                  const statusInfo = getStatusVariant(app.status)
                  return (
                    <tr key={app.applicationId || app.id} className="fade-in">
                      <td>
                        <div className="text-muted small">
                          {app.applicationId ? `APP-${app.applicationId.substring(0, 8)}...` : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-1 fw-semibold">{getUniversityDisplay(app)}</h6>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-1 fw-semibold">{getCourseDisplay(app)}</h6>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {new Date(app.createdAt || app.submittedAt || app.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <Badge bg={statusInfo.bg} className="d-inline-flex align-items-center">
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="d-flex align-items-center"
                            onClick={() => handleViewApplication(app)}
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                          {/* <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                            <FaDownload className="me-1" />
                            Download
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <ApplicationDetails
        application={selectedApplication}
        show={showDetails}
        onHide={() => setShowDetails(false)}
      />
    </>
  )
}

export default ApplicationList