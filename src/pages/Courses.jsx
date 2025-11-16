import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Badge,
  Pagination,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourses } from "../store/thunks/courseThunks";
import { fetchUniversities } from "../store/thunks/universityThunks";
import CourseList from "../components/student/CourseList";
import ApplicationForm from "../components/student/ApplicationForm";
import {
  FaSearch,
  FaFilter,
  FaBook,
  FaGraduationCap,
  FaLanguage,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

const Courses = () => {
  const dispatch = useDispatch();
  const {
    courses: coursesData,
    loading,
    error,
    pagination,
    count,
  } = useSelector((state) => state.courses);
  const { universities } = useSelector((state) => state.universities);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    language: "",
    university: "",
    maxPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Safely get courses array from state
  const courses = Array.isArray(coursesData) ? coursesData : [];
  const universitiesList = Array.isArray(universities) ? universities : [];

  useEffect(() => {
    dispatch(fetchAllCourses(currentPage));
    dispatch(fetchUniversities());
  }, [dispatch, currentPage]);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = !filters.level || course.level === filters.level;
    const matchesLanguage =
      !filters.language || course.language === filters.language;
    const matchesUniversity =
      !filters.university || course.university === filters.university;

    // Price range filter
    const matchesPrice =
      !filters.maxPrice ||
      (course.priceRange &&
        parseInt(course.priceRange.split(" - ")[1]) <=
          parseInt(filters.maxPrice));

    return (
      matchesSearch &&
      matchesLevel &&
      matchesLanguage &&
      matchesUniversity &&
      matchesPrice
    );
  });

  // Get unique values for filters
  const levels = [
    ...new Set(courses.map((c) => c.level).filter(Boolean)),
  ].sort();
  const languages = [
    ...new Set(courses.map((c) => c.language).filter(Boolean)),
  ].sort();
  const universityIds = [
    ...new Set(courses.map((c) => c.university).filter(Boolean)),
  ];

  // Pagination
  const totalPages = pagination?.totalPages || 1;
  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowApplicationForm(true);
  };

  const handleBackToCourses = () => {
    setShowApplicationForm(false);
    setSelectedCourse(null);
  };

  const clearFilters = () => {
    setFilters({
      level: "",
      language: "",
      university: "",
      maxPrice: "",
    });
    setSearchTerm("");
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-vh-50 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>Error Loading Courses</h5>
          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  if (showApplicationForm && selectedCourse) {
    return (
      <ApplicationForm course={selectedCourse} onBack={handleBackToCourses} />
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold text-primary mb-3">
              Explore All Courses
            </h1>
            <p className="lead text-muted mb-4">
              Discover {count} courses from top universities worldwide. Find the
              perfect program to advance your career.
            </p>
          </Col>
        </Row>

        {/* Search and Filter Section */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search courses by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={clearFilters}
                  className="d-flex align-items-center"
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>

            {/* Advanced Filters */}
            <Row className="g-3 mt-2">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Level</Form.Label>
                  <Form.Select
                    value={filters.level}
                    onChange={(e) =>
                      setFilters({ ...filters, level: e.target.value })
                    }
                  >
                    <option value="">All Levels</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Language
                  </Form.Label>
                  <Form.Select
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                  >
                    <option value="">All Languages</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Max Price
                  </Form.Label>
                  <Form.Select
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                  >
                    <option value="">Any Price</option>
                    <option value="10000">Under $10,000</option>
                    <option value="20000">Under $20,000</option>
                    <option value="50000">Under $50,000</option>
                    <option value="100000">Under $100,000</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    University
                  </Form.Label>
                  <Form.Select
                    value={filters.university}
                    onChange={(e) =>
                      setFilters({ ...filters, university: e.target.value })
                    }
                  >
                    <option value="">All Universities</option>
                    {universityIds
                      .map((universityId) => {
                        const university = universitiesList.find(
                          (u) => u.id === universityId
                        );
                        return university ? (
                          <option key={universityId} value={universityId}>
                            {university.name}
                          </option>
                        ) : null;
                      })
                      .filter(Boolean)}
                  </Form.Select>
                </Form.Group>
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
                <p className="mb-0 opacity-75">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 bg-gradient-success text-white">
              <Card.Body className="text-center p-3">
                <h4 className="fw-bold mb-1">{levels.length}</h4>
                <p className="mb-0 opacity-75">Education Levels</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 bg-gradient-warning text-white">
              <Card.Body className="text-center p-3">
                <h4 className="fw-bold mb-1">{universitiesList.length}</h4>
                <p className="mb-0 opacity-75">Partner Universities</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="border-0 bg-gradient-info text-white">
              <Card.Body className="text-center p-3">
                <h4 className="fw-bold mb-1">10K+</h4>
                <p className="mb-0 opacity-75">Successful Applications</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Results Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-semibold mb-1">
              {filteredCourses.length} Course
              {filteredCourses.length !== 1 ? "s" : ""} Found
            </h5>
            <p className="text-muted mb-0">
              {searchTerm && `for "${searchTerm}"`}
              {filters.level && ` • Level: ${filters.level}`}
              {filters.language && ` • Language: ${filters.language}`}
              {filters.maxPrice && ` • Max Price: $${filters.maxPrice}`}
            </p>
          </div>
          <div className="text-muted small">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <Card className="border-0 shadow-sm text-center py-5">
            <Card.Body>
              <FaSearch size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No courses found</h5>
              <p className="text-muted mb-3">
                {courses.length === 0
                  ? "No courses are currently available. Please check back later."
                  : "Try adjusting your search criteria or browse all courses."}
              </p>
              {courses.length > 0 && (
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <CourseList
            courses={filteredCourses}
            onApply={handleApply}
            showUniversity={true}
            isLoading={loading}
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
      </Container>
    </div>
  );
};

export default Courses;
