import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Row, Col, Alert, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import {
  createUniversity,
  fetchCurrentUniversity,
  updateUniversity,
} from "../../store/thunks/universityThunks";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaLandmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UniversityForm = ({ university }) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.universities);

  // Get all countries - memoized to ensure availability in useEffect
  const countries = useMemo(() => Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  })), []);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "University name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "University name must be at least 2 characters long";
    } else if (formData.name.trim().length > 100) {
      errors.name = "University name must be less than 100 characters";
    }

    // Country validation
    if (!formData.country) {
      errors.country = "Country is required";
    }

    // State validation
    if (!formData.state) {
      errors.state = "State is required";
    }

    // City validation
    if (!formData.city) {
      errors.city = "City is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (university) {
      const countryData = countries.find((c) => c.label === university.country);
      setSelectedCountry(countryData);

      // Find and set state data
      if (countryData) {
        const countryStates = State.getStatesOfCountry(countryData.value);
        const stateData = countryStates.find(
          (s) => s.name === university.state
        );
        setSelectedState(
          stateData ? { value: stateData.isoCode, label: stateData.name } : null
        );

        // Find and set city data
        if (stateData) {
          const stateCities = City.getCitiesOfState(
            countryData.value,
            stateData.isoCode
          );
          const cityData = stateCities.find((c) => c.name === university.city);
          setSelectedCity(
            cityData ? { value: cityData.name, label: cityData.name } : null
          );
        }
      }

      setFormData({
        name: university.name || "",
        city: university.city || "",
        state: university.state || "",
        country: university.country || "",
      });
    }
  }, [university]);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.value);
      setStates(
        countryStates.map((state) => ({
          value: state.isoCode,
          label: state.name,
        }))
      );
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);

      setFormData((prev) => ({
        ...prev,
        country: selectedCountry.label,
        state: "", // Reset state when country changes
        city: "", // Reset city when country changes
      }));
    } else {
      setStates([]);
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      const stateCities = City.getCitiesOfState(
        selectedCountry.value,
        selectedState.value
      );
      setCities(
        stateCities.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      );
      setSelectedCity(null);

      setFormData((prev) => ({
        ...prev,
        state: selectedState.label,
        city: "", // Reset city when state changes
      }));
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setFormData((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.label : "",
      state: "", // Reset state when country changes
      city: "", // Reset city when country changes
    }));

    // Clear related errors
    setFormErrors((prev) => ({
      ...prev,
      country: null,
      state: null,
      city: null,
    }));
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setFormData((prev) => ({
      ...prev,
      state: selectedOption ? selectedOption.label : "",
      city: "", // Reset city when state changes
    }));

    if (formErrors.state) {
      setFormErrors({
        ...formErrors,
        state: null,
        city: null,
      });
    }
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData((prev) => ({
      ...prev,
      city: selectedOption ? selectedOption.value : "",
    }));

    if (formErrors.city) {
      setFormErrors({
        ...formErrors,
        city: null,
      });
    }
  };

  const showValidationErrors = () => {
    Object.keys(formErrors).forEach((field) => {
      if (formErrors[field]) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        toast.error(`${fieldName}: ${formErrors[field]}`);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showValidationErrors();
      return;
    }

    try {
      if (university) {
        await dispatch(
          updateUniversity({ id: university.id, ...formData })
        );
        toast.success("University updated successfully!");
        dispatch(fetchCurrentUniversity());
      } else {
        await dispatch(createUniversity(formData));
        toast.success("University created successfully!");
        // Redirect to university dashboard after creation
        // navigate("/university/dashboard");
        dispatch(fetchCurrentUniversity());
      }
    } catch (error) {
      toast.error(error?.message || error || "Operation failed");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? "#86b7fe"
        : formErrors[state.name]
        ? "#dc3545"
        : "#dee2e6",
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
        : "none",
      "&:hover": {
        borderColor: state.isFocused
          ? "#86b7fe"
          : formErrors[state.name]
          ? "#dc3545"
          : "#adb5bd",
      },
    }),
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <FaBuilding size={32} className="text-primary mb-2" />
          <h4 className="fw-bold">
            {university ? "Edit University" : "Create University"}
          </h4>
          <p className="text-muted">
            {university
              ? "Update your university information"
              : "Set up your university profile to get started"}
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaBuilding className="me-2 text-muted" />
                  University Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={formErrors.name ? "is-invalid" : ""}
                  placeholder="Enter university name"
                  minLength="2"
                  maxLength="100"
                />
                {formErrors.name && (
                  <div className="invalid-feedback">{formErrors.name}</div>
                )}
                <Form.Text className="text-muted">
                  University name must be 2-100 characters long
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaGlobe className="me-2 text-muted" />
                  Country *
                </Form.Label>
                <Select
                  options={countries}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select country..."
                  styles={customSelectStyles}
                  isSearchable
                  required
                />
                {formErrors.country && (
                  <div className="text-danger small mt-1">
                    {formErrors.country}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaLandmark className="me-2 text-muted" />
                  State/Province *
                </Form.Label>
                <Select
                  options={states}
                  value={selectedState}
                  onChange={handleStateChange}
                  placeholder={
                    selectedCountry
                      ? "Select state/province..."
                      : "Please select country first"
                  }
                  styles={customSelectStyles}
                  isSearchable
                  isDisabled={!selectedCountry}
                  required
                />
                {formErrors.state && (
                  <div className="text-danger small mt-1">
                    {formErrors.state}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <FaMapMarkerAlt className="me-2 text-muted" />
                  City *
                </Form.Label>
                <Select
                  options={cities}
                  value={selectedCity}
                  onChange={handleCityChange}
                  placeholder={
                    selectedState
                      ? "Select city..."
                      : "Please select state first"
                  }
                  styles={customSelectStyles}
                  isSearchable
                  isDisabled={!selectedState}
                  required
                />
                {formErrors.city && (
                  <div className="text-danger small mt-1">
                    {formErrors.city}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {university ? "Updating..." : "Creating..."}
                </>
              ) : university ? (
                "Update University"
              ) : (
                "Create University"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UniversityForm;
