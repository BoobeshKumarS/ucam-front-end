import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap'
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { updateApplication } from '../../store/thunks/applicationThunks'

const ApplicationDetails = ({ application, show, onHide, readOnly = false }) => {
 const dispatch = useDispatch()
 const [isEditing, setIsEditing] = useState(false)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const [formData, setFormData] = useState({
  universityId: application?.universityId || '',
  courseId: application?.courseId || '',
  personalInfo: {
   fullName: application?.personalInfo?.fullName || '',
   email: application?.personalInfo?.email || '',
   country: application?.personalInfo?.country || '',
   phoneNumber: application?.personalInfo?.phoneNumber || ''
  },
  agreedToTerms: true
 })

 const canEdit = application?.status === 'ACTION_REQUIRED'

 const handleEdit = () => {
  if (canEdit) {
   setIsEditing(true)
  }
 }

 const handleSave = async () => {
  setLoading(true)
  setError('')
  try {
   await dispatch(updateApplication({
    id: application.applicationId,
    ...formData
   })).unwrap()
   setIsEditing(false)
   onHide() // Close modal after successful update
  } catch (err) {
   setError(err.message || 'Failed to update application')
  } finally {
   setLoading(false)
  }
 }

 const handleCancel = () => {
  setIsEditing(false)
  // Reset form data to original application data
  setFormData({
   universityId: application?.universityId || '',
   courseId: application?.courseId || '',
   personalInfo: {
    fullName: application?.personalInfo?.fullName || '',
    email: application?.personalInfo?.email || '',
    country: application?.personalInfo?.country || '',
    phoneNumber: application?.personalInfo?.phoneNumber || ''
   },
   agreedToTerms: true
  })
 }

 const handleInputChange = (field, value) => {
  if (field.startsWith('personalInfo.')) {
   const personalInfoField = field.split('.')[1]
   setFormData(prev => ({
    ...prev,
    personalInfo: {
     ...prev.personalInfo,
     [personalInfoField]: value
    }
   }))
  } else {
   setFormData(prev => ({
    ...prev,
    [field]: value
   }))
  }
 }

 const getStatusVariant = (status) => {
  switch (status) {
   case 'DRAFT': return 'secondary'
   case 'SUBMITTED': return 'info'
   case 'UNDER_REVIEW': return 'warning'
   case 'ACTION_REQUIRED': return 'danger'
   case 'APPROVED': return 'success'
   case 'REJECTED': return 'danger'
   default: return 'secondary'
  }
 }

 if (!application) return null

 return (
  <Modal show={show} onHide={onHide} size="lg" centered>
   <Modal.Header closeButton>
    <Modal.Title>
     Application Details
     <Badge bg={getStatusVariant(application.status)} className="ms-2">
      {application.status}
     </Badge>
    </Modal.Title>
   </Modal.Header>
   <Modal.Body>
    {error && <Alert variant="danger">{error}</Alert>}
     
    <Row className="mb-3">
     <Col>
      <h6 className="text-muted mb-2">Application Information</h6>
      <div className="d-flex justify-content-between">
       <div>
        <small className="text-muted">Application ID</small>
        <p className="mb-0">{application.applicationId}</p>
       </div>
       <div>
        <small className="text-muted">Created</small>
        <p className="mb-0">{new Date(application.createdAt).toLocaleDateString()}</p>
       </div>
       <div>
        <small className="text-muted">Submitted</small>
        <p className="mb-0">
         {application.submittedAt 
          ? new Date(application.submittedAt).toLocaleDateString()
          : 'Not submitted'
         }
        </p>
       </div>
      </div>
     </Col>
    </Row>

    <hr />

    <h6 className="text-muted mb-3">
     <FaUser className="me-2" />
     Personal Information
     {canEdit && !isEditing && !readOnly && (
      <Button variant="outline-primary" size="sm" className="ms-2" onClick={handleEdit}>
       <FaEdit className="me-1" />
       Edit
      </Button>
     )}
    </h6>

    <Row>
     <Col md={6}>
      <Form.Group className="mb-3">
       <Form.Label>
        <FaUser className="me-1" />
        Full Name
       </Form.Label>
       {isEditing ? (
        <Form.Control
         type="text"
         value={formData.personalInfo.fullName}
         onChange={(e) => handleInputChange('personalInfo.fullName', e.target.value)}
        />
       ) : (
        <Form.Control plaintext readOnly value={application.personalInfo?.fullName || 'N/A'} />
       )}
      </Form.Group>
     </Col>
     <Col md={6}>
      <Form.Group className="mb-3">
       <Form.Label>
        <FaEnvelope className="me-1" />
        Email
       </Form.Label>
       {isEditing ? (
        <Form.Control
         type="email"
         value={formData.personalInfo.email}
         onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
        />
       ) : (
        <Form.Control plaintext readOnly value={application.personalInfo?.email || 'N/A'} />
       )}
      </Form.Group>
     </Col>
    </Row>

    <Row>
     <Col md={6}>
      <Form.Group className="mb-3">
       <Form.Label>
        <FaGlobe className="me-1" />
        Country
       </Form.Label>
       {isEditing ? (
        <Form.Control
         type="text"
         value={formData.personalInfo.country}
         onChange={(e) => handleInputChange('personalInfo.country', e.target.value)}
        />
       ) : (
        <Form.Control plaintext readOnly value={application.personalInfo?.country || 'N/A'} />
       )}
      </Form.Group>
     </Col>
     <Col md={6}>
      <Form.Group className="mb-3">
       <Form.Label>
        <FaPhone className="me-1" />
        Phone Number
       </Form.Label>
       {isEditing ? (
        <Form.Control
         type="text"
         value={formData.personalInfo.phoneNumber}
         onChange={(e) => handleInputChange('personalInfo.phoneNumber', e.target.value)}
        />
       ) : (
        <Form.Control plaintext readOnly value={application.personalInfo?.phoneNumber || 'N/A'} />
       )}
      </Form.Group>
     </Col>
    </Row>

    {!canEdit && application.status !== 'ACTION_REQUIRED' && (
     <Alert variant="info" className="mt-3">
      This application cannot be edited because its status is "{application.status}".
      Only applications with "ACTION REQUIRED" status can be modified.
     </Alert>
    )}
   </Modal.Body>
   <Modal.Footer>
    {isEditing ? (
     <>
      <Button variant="outline-secondary" onClick={handleCancel} disabled={loading}>
       <FaTimes className="me-1" />
       Cancel
      </Button>
      <Button variant="primary" onClick={handleSave} disabled={loading}>
       {loading ? <Spinner animation="border" size="sm" /> : <FaSave className="me-1" />}
       Save Changes
      </Button>
     </>
    ) : (
     <Button variant="secondary" onClick={onHide}>
      Close
     </Button>
    )}
   </Modal.Footer>
  </Modal>
 )
}

export default ApplicationDetails