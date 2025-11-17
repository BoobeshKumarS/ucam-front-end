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
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../store/thunks/applicationThunks";
import { studentService } from "../../services/studentService";
import { updateUserProfile } from "../../store/slices/authSlice";
import ApplicationList from "./ApplicationList";
import UniversityList from "./UniversityList";
import {
  FaUser,
  FaChartBar,
  FaBell,
  FaBook,
  FaUniversity,
} from "react-icons/fa";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);

  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfileAndApplications = async () => {
      if (!user || hasFetchedProfile) return;

      try {
        if (user.role === "STUDENT") {
          const studentProfile = await studentService.getCurrentStudent();
          dispatch(updateUserProfile(studentProfile));
          setHasFetchedProfile(true);
        }
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
        setHasFetchedProfile(true);
      }
    };

    fetchUserProfileAndApplications();
  }, [dispatch, user, hasFetchedProfile]);

  useEffect(() => {
    // Fetch applications without needing to pass student ID
    dispatch(fetchApplications());
  }, [dispatch]);

  const pendingApplications = applications.filter(
    (app) =>
      app.status === "SUBMITTED" ||
      app.status === "UNDER_REVIEW" ||
      app.status === "ACTION_REQUIRED"
  ).length;
  const approvedApplications = applications.filter(
    (app) => app.status === "APPROVED"
  ).length;

  // Handle apply function - redirects to courses page
  const handleApply = () => {
    window.location.href = "/courses";
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Student Dashboard</h2>
              <p className="text-muted mb-0">
                Welcome back, {user?.firstName}! Here's your application
                overview.
              </p>
            </div>
            <Badge bg="primary" className="fs-6 px-3 py-2">
              <FaUser className="me-1" />
              Student
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm bg-gradient-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{applications.length}</h4>
                  <p className="mb-0 opacity-75">Total Applications</p>
                </div>
                <FaBook size={30} className="opacity-75" />
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
                  <p className="mb-0 opacity-75">Pending</p>
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
                  <h4 className="fw-bold">{approvedApplications}</h4>
                  <p className="mb-0 opacity-75">Approved</p>
                </div>
                <FaChartBar size={30} className="opacity-75" />
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
                    {applications.length > 0
                      ? Math.round(
                          (approvedApplications / applications.length) * 100
                        )
                      : 0}
                    %
                  </h4>
                  <p className="mb-0 opacity-75">Success Rate</p>
                </div>
                <FaUniversity size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs defaultActiveKey="applications" className="px-3 pt-3">
                <Tab
                  eventKey="applications"
                  title={
                    <span>
                      <FaBook className="me-2" />
                      My Applications
                      {applications.length > 0 && (
                        <Badge bg="primary" className="ms-2">
                          {applications.length}
                        </Badge>
                      )}
                    </span>
                  }
                >
                  <div className="p-3">
                    <ApplicationList applications={applications} />
                  </div>
                </Tab>
                <Tab
                  eventKey="universities"
                  title={
                    <span>
                      <FaUniversity className="me-2" />
                      Browse Universities
                    </span>
                  }
                >
                  <div className="p-3">
                    <UniversityList />
                  </div>
                </Tab>
                <Tab
                  eventKey="courses"
                  title={
                    <span>
                      <FaBook className="me-2" />
                      Browse Courses
                    </span>
                  }
                >
                  <div className="p-3">
                    <div className="text-center py-5">
                      <FaBook size={48} className="text-muted mb-3" />
                      <h5 className="text-muted mb-3">Explore All Courses</h5>
                      <p className="text-muted mb-4">
                        Browse through our comprehensive course catalog to find
                        the perfect program for your academic journey.
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => (window.location.href = "/courses")}
                      >
                        View All Courses
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 fw-semibold">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Button
                    variant="outline-primary"
                    className="w-100 py-3 d-flex flex-column align-items-center"
                    onClick={() => (window.location.href = "/courses")}
                  >
                    <FaBook size={24} className="mb-2" />
                    <span>Browse Courses</span>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button
                    variant="outline-success"
                    className="w-100 py-3 d-flex flex-column align-items-center"
                    onClick={() => (window.location.href = "/universities")}
                  >
                    <FaUniversity size={24} className="mb-2" />
                    <span>Find Universities</span>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button
                    variant="outline-info"
                    className="w-100 py-3 d-flex flex-column align-items-center"
                    onClick={() =>
                      (window.location.href =
                        "/student/dashboard?tab=applications")
                    }
                  >
                    <FaChartBar size={24} className="mb-2" />
                    <span>View Applications</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
