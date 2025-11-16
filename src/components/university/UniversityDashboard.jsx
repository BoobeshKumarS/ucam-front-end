import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Tabs,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../../store/thunks/universityThunks";
import { fetchApplicationsByUniversity } from "../../store/thunks/applicationThunks";
import { adminService } from "../../services/adminService";
import { updateUserProfile } from "../../store/slices/authSlice";
import UniversityForm from "./UniversityForm";
import CourseForm from "./CourseForm";
import ApplicationManagement from "./ApplicationManagement";
import {
  FaBuilding,
  FaBook,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBell,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const UniversityDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    currentUniversity,
    loading: universityLoading,
    error: universityError,
  } = useSelector((state) => state.universities);
  const { universityApplications, loading: applicationsLoading } = useSelector(
    (state) => state.applications
  );

  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("university");

  useEffect(() => {
    const fetchUserProfileAndUniversity = async () => {
      if (!user || hasFetchedProfile) return;

      try {
        if (user.role === "ADMIN") {
          const adminProfile = await adminService.getCurrentAdmin();
          dispatch(updateUserProfile(adminProfile)); 
          setHasFetchedProfile(true);

          // Fetch university after profile is updated
          dispatch(fetchCurrentUniversity());
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        setHasFetchedProfile(true);
      }
    };

    fetchUserProfileAndUniversity();
  }, [dispatch, user, hasFetchedProfile]);

  useEffect(() => {
    if (currentUniversity?.id) {
      dispatch(fetchApplicationsByUniversity(currentUniversity.id));
    }
  }, [dispatch, currentUniversity]);

  const pendingApplications = universityApplications.filter(
    (app) => app.status != "APPROVED"
  ).length;
  const totalCourses = currentUniversity?.courses?.length || 0;

  // Use proper name from user profile
  const displayName = user?.firstName || user?.email?.split("@")[0] || "Admin";

  const handleDeleteUniversity = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this university? This action cannot be undone."
      )
    ) {
      try {
        // You'll need to implement deleteUniversity thunk
        // await dispatch(deleteUniversity(currentUniversity.id)).unwrap()
        alert("University deletion would be implemented here");
      } catch (error) {
        alert("Failed to delete university");
      }
    }
  };

  if (universityLoading && !currentUniversity) {
    return (
      <div className="min-vh-50 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">University Dashboard</h2>
              <p className="text-muted mb-0">
                Welcome, {displayName}! Manage your university profile and
                applications.
              </p>
            </div>
            <Badge bg="success" className="fs-6 px-3 py-2">
              <FaBuilding className="me-1" />
              Admin
            </Badge>
          </div>
        </Col>
      </Row>

      {universityError && (
        <Alert variant="danger" className="mb-4">
          {universityError}
        </Alert>
      )}

      {/* Stats Cards - Only show if university exists */}
      {currentUniversity && (
        <Row className="g-3 mb-4">
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm bg-gradient-primary text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold">{universityApplications.length}</h4>
                    <p className="mb-0 opacity-75">Total Applications</p>
                  </div>
                  <FaUsers size={30} className="opacity-75" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm bg-gradient-warning text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold">{pendingApplications}</h4>
                    <p className="mb-0 opacity-75">Pending Review</p>
                  </div>
                  <FaBell size={30} className="opacity-75" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm bg-gradient-success text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold">{totalCourses}</h4>
                    <p className="mb-0 opacity-75">Active Courses</p>
                  </div>
                  <FaBook size={30} className="opacity-75" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm bg-gradient-info text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold">
                      {universityApplications.length > 0
                        ? Math.round(
                            (universityApplications.filter(
                              (app) => app.status === "APPROVED"
                            ).length /
                              universityApplications.length) *
                              100
                          )
                        : 0}
                      %
                    </h4>
                    <p className="mb-0 opacity-75">Acceptance Rate</p>
                  </div>
                  <FaChartLine size={30} className="opacity-75" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="px-3 pt-3"
              >
                {/* University Tab */}
                <Tab
                  eventKey="university"
                  title={
                    <span>
                      <FaBuilding className="me-2" />
                      University Profile
                      {!currentUniversity && (
                        <Badge bg="warning" className="ms-2">
                          Setup Required
                        </Badge>
                      )}
                    </span>
                  }
                >
                  <div className="p-4">
                    {currentUniversity ? (
                      <div>
                        {/* University Details View */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="fw-bold mb-0">University Details</h4>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <FaEdit className="me-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={handleDeleteUniversity}
                            >
                              <FaTrash className="me-1" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        <Card className="border-0 bg-light">
                          <Card.Body>
                            <Row>
                              <Col md={6}>
                                <h5 className="fw-bold">
                                  {currentUniversity.name}
                                </h5>
                                <p className="mb-2">
                                  <strong>Location:</strong>{" "}
                                  {currentUniversity.city},{" "}
                                  {currentUniversity.state},{" "}
                                  {currentUniversity.country}
                                </p>
                                <p className="mb-2">
                                  <strong>Tuition Fee:</strong>{" "}
                                  {currentUniversity.tuitionFee}{" "}
                                  {currentUniversity.currency}
                                </p>
                                {currentUniversity.fieldOfStudy &&
                                  currentUniversity.fieldOfStudy.length > 0 && (
                                    <div className="mb-2">
                                      <strong>Fields of Study:</strong>
                                      <div className="d-flex flex-wrap gap-1 mt-1">
                                        {currentUniversity.fieldOfStudy.map(
                                          (field, index) => (
                                            <Badge key={index} bg="primary">
                                              {field}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </Col>
                              <Col md={6}>
                                {currentUniversity.universityImage &&
                                  currentUniversity.universityImage !==
                                    "string" && (
                                    <div className="text-center">
                                      <img
                                        src={currentUniversity.universityImage}
                                        alt={currentUniversity.name}
                                        className="img-fluid rounded"
                                        style={{
                                          maxHeight: "200px",
                                          maxWidth: "100%",
                                        }}
                                      />
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                    ) : (
                      /* University Creation Form */
                      <div>
                        {/* <div className="text-center mb-4">
                          <FaBuilding size={48} className="text-primary mb-3" />
                          <h4 className="fw-bold">Setup Your University</h4>
                          <p className="text-muted">
                            Create your university profile to start managing
                            courses and applications.
                          </p>
                        </div> */}
                        <UniversityForm />
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Courses Tab */}
                <Tab
                  eventKey="courses"
                  title={
                    <span>
                      <FaBook className="me-2" />
                      Manage Courses
                      {totalCourses > 0 && (
                        <Badge bg="primary" className="ms-2">
                          {totalCourses}
                        </Badge>
                      )}
                    </span>
                  }
                  disabled={!currentUniversity}
                >
                  <div className="p-4">
                    {currentUniversity ? (
                      <CourseForm universityId={currentUniversity.id} />
                    ) : (
                      <div className="text-center py-5">
                        <FaBuilding size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">
                          University Profile Required
                        </h5>
                        <p className="text-muted mb-4">
                          Please set up your university profile first to manage
                          courses.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab("university")}
                        >
                          Setup University
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Applications Tab */}
                <Tab
                  eventKey="applications"
                  title={
                    <span>
                      <FaUsers className="me-2" />
                      Applications
                      {pendingApplications > 0 && (
                        <Badge bg="warning" className="ms-2">
                          {pendingApplications}
                        </Badge>
                      )}
                    </span>
                  }
                  disabled={!currentUniversity}
                >
                  <div className="p-4">
                    {currentUniversity ? (
                      <ApplicationManagement
                        universityId={currentUniversity.id}
                      />
                    ) : (
                      <div className="text-center py-5">
                        <FaUsers size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">
                          University Profile Required
                        </h5>
                        <p className="text-muted mb-4">
                          Please set up your university profile first to view
                          applications.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab("university")}
                        >
                          Setup University
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity - Only show if university exists */}
      {currentUniversity && (
        <Row className="mt-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Recent Activity</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                {applicationsLoading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <p className="text-muted mt-2 mb-0">
                      Loading applications...
                    </p>
                  </div>
                ) : (
                  universityApplications.slice(0, 5).map((app, index) => {
                    // Helper function to get course name
                    const getCourseName = (courseId) => {
                      if (!currentUniversity?.courses) return "Course";
                      const course = currentUniversity.courses.find(
                        (course) => course.id === courseId
                      );
                      return course ? course.name : "Course";
                    };

                    // Helper function to get student name
                    const getStudentName = (application) => {
                      return (
                        application.personalInfo?.fullName ||
                        application.studentName ||
                        "Student"
                      );
                    };

                    return (
                      <div
                        key={app.id}
                        className="d-flex align-items-center py-2 border-bottom"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${
                              app.status === "PENDING"
                                ? "bg-warning"
                                : app.status === "APPROVED"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                            style={{ width: "40px", height: "40px" }}
                          >
                            <FaUsers className="text-white" size={16} />
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">{getStudentName(app)}</h6>
                          <p className="text-muted mb-0 small">
                            Applied for {getCourseName(app.courseId)} •{" "}
                            {new Date(
                              app.submittedAt || app.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          bg={
                            app.status === "PENDING"
                              ? "warning"
                              : app.status === "APPROVED"
                              ? "success"
                              : "danger"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                    );
                  })
                )}
                {!applicationsLoading &&
                  universityApplications.length === 0 && (
                    <div className="text-center py-4">
                      <FaUsers size={32} className="text-muted mb-2" />
                      <p className="text-muted mb-0">No applications yet</p>
                    </div>
                  )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h5 className="mb-0 fw-semibold">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    className="text-start py-3"
                    onClick={() => setActiveTab("university")}
                  >
                    <FaBuilding className="me-2" />
                    {currentUniversity
                      ? "Update University"
                      : "Setup University"}
                  </Button>
                  <Button
                    variant="outline-success"
                    className="text-start py-3"
                    disabled={!currentUniversity}
                    onClick={() => setActiveTab("courses")}
                  >
                    <FaBook className="me-2" />
                    Manage Courses
                  </Button>
                  <Button
                    variant="outline-info"
                    className="text-start py-3"
                    disabled={!currentUniversity}
                    onClick={() => setActiveTab("applications")}
                  >
                    <FaUsers className="me-2" />
                    Review Applications
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default UniversityDashboard;
