import React, { useEffect, useState } from 'react'
import { Table, Badge, Button, Form, Spinner, Alert, Card, Modal, Dropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplicationsByUniversity, updateApplicationStatus } from '../../store/thunks/applicationThunks'
import { toast } from 'react-toastify'
import { FaEye, FaEllipsisV, FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa'

const ApplicationManagement = ({ universityId }) => {
  const dispatch = useDispatch()
  const { universityApplications, loading, error } = useSelector((state) => state.applications)
  const { currentUniversity } = useSelector((state) => state.universities)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [remarks, setRemarks] = useState('')

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

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !selectedStatus) return

    try {
      await dispatch(updateApplicationStatus(
        selectedApplication.applicationId || selectedApplication.id, 
        selectedStatus
      )).unwrap()
      
      toast.success(`Application status updated to ${selectedStatus}!`)
      setShowStatusModal(false)
      setSelectedApplication(null)
      setSelectedStatus('')
      setRemarks('')
    } catch (error) {
      toast.error(error || 'Status update failed')
    }
  }

  const openStatusModal = (application) => {
    setSelectedApplication(application)
    setSelectedStatus(application.status)
    setRemarks(application.remarks || '')
    setShowStatusModal(true)
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

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">#</th>
                  <th className="border-0">Student Name</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Course</th>
                  <th className="border-0">University</th>
                  <th className="border-0">Applied Date</th>
                  <th className="border-0">Status</th>
                  <th className="border-0 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {universityApplications.map((app, index) => {
                  const statusInfo = getStatusVariant(app.status)
                  return (
                    <tr key={app.applicationId || app.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{getStudentName(app)}</strong>
                      </td>
                      <td>
                        <small className="text-muted">{getStudentEmail(app)}</small>
                      </td>
                      <td>
                        {getCourseName(app.courseId)}
                      </td>
                      <td>
                        {getUniversityName()}
                      </td>
                      <td>
                        {new Date(app.createdAt || app.submittedAt || app.appliedDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={statusInfo.bg} className="d-inline-flex align-items-center">
                          {statusInfo.icon}
                          {app.status}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-primary" 
                            size="sm" 
                            id="dropdown-basic"
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openStatusModal(app)}>
                              <FaEdit className="me-2" />
                              Update Status
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              // View application details - you can implement this later
                              toast.info('View application details feature coming soon')
                            }}>
                              <FaEye className="me-2" />
                              View Details
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Application Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div className="mb-4">
              <h6>Application Details:</h6>
              <div className="bg-light p-3 rounded">
                <p className="mb-1">
                  <strong>Student:</strong> {getStudentName(selectedApplication)}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {getStudentEmail(selectedApplication)}
                </p>
                <p className="mb-1">
                  <strong>Course:</strong> {getCourseName(selectedApplication.courseId)}
                </p>
                <p className="mb-1">
                  <strong>University:</strong> {getUniversityName()}
                </p>
                <p className="mb-0">
                  <strong>Current Status:</strong> 
                  <Badge bg={getStatusVariant(selectedApplication.status).bg} className="ms-2">
                    {selectedApplication.status}
                  </Badge>
                </p>
              </div>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label><strong>New Status</strong></Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              <strong>Remarks (Optional)</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add any remarks or notes about this status change..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusUpdate}
            disabled={!selectedStatus}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApplicationManagement