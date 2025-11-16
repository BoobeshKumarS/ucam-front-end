import React from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Dropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaUniversity,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <BootstrapNavbar
      bg="white"
      expand="lg"
      sticky="top"
      className="shadow-sm py-3"
    >
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand className="d-flex align-items-center fw-bold fs-3 text-primary">
            <FaUniversity className="me-2" />
            EduConnect
          </BootstrapNavbar.Brand>
        </LinkContainer>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <LinkContainer to="/">
              <Nav.Link className="fw-semibold mx-2">Home</Nav.Link>
            </LinkContainer> */}
            <LinkContainer to="/universities">
              <Nav.Link className="fw-semibold mx-2">Universities</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses">
              <Nav.Link className="fw-semibold mx-2">Courses</Nav.Link>
            </LinkContainer>
            {isAuthenticated && user?.role === "STUDENT" && (
              <LinkContainer to="/student/dashboard">
                <Nav.Link className="fw-semibold mx-2">Dashboard</Nav.Link>
              </LinkContainer>
            )}
            {isAuthenticated && user?.role === "ADMIN" && (
              <LinkContainer to="/university/dashboard">
                <Nav.Link className="fw-semibold mx-2">Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="user-dropdown"
                  className="d-flex align-items-center"
                >
                  <FaUserCircle className="me-2" />
                  {user?.firstName}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0">
                  <Dropdown.Header className="text-muted">
                    Signed in as{" "}
                    {user?.role === "STUDENT" ? "Student" : "University Admin"}
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <LinkContainer to="/login">
                  <Button
                    variant="outline-primary"
                    className="px-4 rounded-pill"
                  >
                    Login
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="primary" className="px-4 rounded-pill">
                    Sign Up
                  </Button>
                </LinkContainer>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
