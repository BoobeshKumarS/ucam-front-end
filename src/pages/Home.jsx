import React from 'react'
import { Container, Row, Col, Button, Card, Badge, Carousel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux'
import { FaGraduationCap, FaUniversity, FaCheckCircle, FaUsers, FaChartLine, FaAward } from 'react-icons/fa'
import universityImage from "../assets/home.webp"

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const stats = [
    { number: '50+', label: 'Partner Universities' },
    { number: '500+', label: 'Available Courses' },
    { number: '10,000+', label: 'Successful Applications' },
    { number: '95%', label: 'Satisfaction Rate' }
  ]

  const features = [
    {
      icon: <FaUniversity className="text-primary" size={40} />,
      title: 'For Universities',
      description: 'Showcase your institution, manage courses, and streamline application processes with our comprehensive admin tools.',
      features: ['Course Management', 'Application Tracking', 'Student Communication', 'Analytics Dashboard']
    },
    {
      icon: <FaGraduationCap className="text-success" size={40} />,
      title: 'For Students',
      description: 'Discover your perfect course, apply to multiple universities, and track your applications in real-time.',
      features: ['University Search', 'Easy Applications', 'Status Tracking', 'Personal Dashboard']
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      text: 'Found my dream university through this platform! The application process was seamless.',
      university: 'Stanford University'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Admissions Director',
      text: 'This platform has revolutionized how we manage applications and connect with prospective students.',
      university: 'MIT'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 rounded-pill">
                🎓 Trusted by 50+ Universities
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Your Future Starts 
                <span className="text-warning"> Here</span>
              </h1>
              <p className="lead mb-4 fs-5">
                Connect with top universities worldwide. Browse thousands of courses, 
                apply seamlessly, and launch your academic journey with confidence.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <>
                    <LinkContainer to="/register">
                      <Button variant="warning" size="lg" className="px-4 py-2 rounded-pill fw-semibold">
                        Start Your Journey
                      </Button>
                    </LinkContainer>
                    <LinkContainer to="/universities">
                      <Button variant="outline-light" size="lg" className="px-4 py-2 rounded-pill fw-semibold">
                        Explore Universities
                      </Button>
                    </LinkContainer>
                  </>
                ) : (
                  <div className="text-center">
                    <h5 className="mb-3">Welcome back, {user?.firstName}!</h5>
                    <LinkContainer to={user?.role === 'STUDENT' ? '/student/dashboard' : '/university/dashboard'}>
                      <Button variant="warning" size="lg" className="px-4 py-2 rounded-pill fw-semibold">
                        Go to Dashboard
                      </Button>
                    </LinkContainer>
                  </div>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image mt-5 mt-lg-0">
                <img 
                  src={ universityImage }
                  alt="University Campus" 
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '40w0px', objectFit: 'cover', width: '100%' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="mb-5">Why Choose Our Platform?</h2>
            </Col>
          </Row>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <h3 className="text-primary fw-bold">{stat.number}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2>Designed for Everyone</h2>
              <p className="lead text-muted">Comprehensive tools for students and universities</p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={6} key={index}>
                <Card className="border-0 shadow-sm h-100 hover-lift">
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      {feature.icon}
                    </div>
                    <Card.Title className="text-center h4 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted text-center mb-4">
                      {feature.description}
                    </Card.Text>
                    <ul className="list-unstyled">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="mb-2">
                          <FaCheckCircle className="text-success me-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2>How It Works</h2>
              <p className="lead text-muted">Simple steps to achieve your academic goals</p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">1</span>
              </div>
              <h5>Create Account</h5>
              <p className="text-muted">Sign up as a student or university representative in minutes</p>
            </Col>
            <Col md={4} className="text-center">
              <div className="step-number bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">2</span>
              </div>
              <h5>Explore & Apply</h5>
              <p className="text-muted">Browse courses and submit applications with all required documents</p>
            </Col>
            <Col md={4} className="text-center">
              <div className="step-number bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">3</span>
              </div>
              <h5>Get Admitted</h5>
              <p className="text-muted">Track your application status and receive admission decisions</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2>Success Stories</h2>
              <p className="lead text-muted">Hear from our students and partners</p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mx-auto">
              <Carousel indicators interval={5000}>
                {testimonials.map((testimonial, index) => (
                  <Carousel.Item key={index}>
                    <Card className="border-0 shadow-sm">
                      <Card.Body className="p-5 text-center">
                        <FaAward className="text-warning mb-3" size={40} />
                        <p className="fs-5 fst-italic mb-4">"{testimonial.text}"</p>
                        <div>
                          <h6 className="mb-1">{testimonial.name}</h6>
                          <p className="text-muted mb-1">{testimonial.role}</p>
                          <Badge bg="outline-primary" text="primary">
                            {testimonial.university}
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-3">Ready to Transform Your Future?</h2>
              <p className="lead mb-4">
                Join thousands of students and universities already using our platform
              </p>
              {!isAuthenticated && (
                <LinkContainer to="/register">
                  <Button variant="warning" size="lg" className="px-5 py-3 rounded-pill fw-semibold">
                    Get Started Today
                  </Button>
                </LinkContainer>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Home