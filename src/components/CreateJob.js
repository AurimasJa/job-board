import { useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form, Modal } from "react-bootstrap";
import authService from "../services/auth.service";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import cities from "../data/cities";
import "../style.css"; // import your CSS file

function JobCreate(props) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errors, setErrors] = useState({});
  const loc = useLocation();
  const [location, setLocation] = useState("");
  const user = authService.getCurrentUser();
  const [remoteWork, setRemoteWork] = useState(false);

  const validateJobCreate = (values) => {
    let errors = {};

    if (!values.title || !values.title === "")
      errors.title = "Pavadinimas yra privalomas";
    else if (values.title.length < 5 || values.title.length > 100)
      errors.title =
        "Pavadinimas per trumpas arba per ilgas, pavadinimo ilgis nuo 5 iki 100 simbolių";
    if (!values.description || !values.description === "")
      errors.description = "Darbo aprašymas yra privalomas";
    else if (values.description.length < 30 || values.title.description > 1000)
      errors.description =
        "Aprašymas per trumpas arba per ilgas, pavadinimo ilgis nuo 30 iki 1000 simbolių";
    if (!values.position || !values.position === "")
      errors.position = "Pozicija yra privaloma";
    if (!values.positionLevel || !values.positionLevel === "")
      errors.positionLevel =
        "Pareigų lygis(Vadovas, Specialistas, (ne)kvalifikuotas darbuotojas) yra privalomas";
    if (!values.companyOffers || !values.companyOffers === "")
      errors.companyOffers = "Įmonės pasiūlymas yra privalomas";
    if (!values.city || !values.city === "")
      errors.city = "Miestas yra privalomas";
    if (!values.location || !values.location === "")
      errors.location = "Adresas yra privalomas";
    if (!values.salary || !values.salary === "")
      errors.salary = "Alga nuo yra privaloma";

    let tempSalary = Number(values.salary);
    let tempSalaryUp = Number(values.salaryUp);
    if (!values.salaryUp || !values.salaryUp === "")
      errors.salaryUp = "Alga iki yra privaloma";
    else if (tempSalary > tempSalaryUp) {
      errors.salary = "Alga iki negali būti mažesnė nei alga nuo";
      errors.salaryUp = "Alga iki negali būti mažesnė nei alga nuo";
    }
    if (!values.totalWorkHours || !values.totalWorkHours === "")
      errors.totalWorkHours = "Etatą nurodyti yra privaloma";
    if (!values.selection || !values.selection === "")
      errors.selection = "Atrankos būdo nurodymas yra privalomas";

    values.requirements.forEach((requirement, i) => {
      errors.requirements = errors.requirements || [];
      if (!requirement || !requirement.name || requirement.name === "") {
        errors.requirements[i] = errors.requirements[i] || {};
        errors.requirements[i].name = "Reikalavimus nurodyti būtina";
      }
    });
    return errors;
  };
  const handleLocationChange = (newLocation) => {
    const temp = newLocation.join("");
    setJobCreationData({
      ...jobCreationData,
      city: temp,
    });
    setLocation(temp);
  };
  const [jobCreationData, setJobCreationData] = useState({
    title: "",
    description: "",
    requirements: [
      {
        name: "",
      },
    ],
    position: "",
    positionLevel: "",
    companyOffers: "",
    location: "",
    city: location,
    salary: "",
    salaryUp: "",
    totalWorkHours: "",
    selection: "",
    remoteWork: false,
  });
  const handleCreateJob = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${user[3]}`,
    };
    const errors = validateJobCreate(jobCreationData);
    console.log(jobCreationData);
    setErrors(errors);
    const newErrors = Object.keys(errors).reduce((acc, key) => {
      const value = errors[key];
      if (Array.isArray(value) && value.length === 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(newErrors).length === 0) {
      axios
        .post(
          "https://localhost:7045/api/job",
          {
            title: jobCreationData.title,
            description: jobCreationData.description,
            requirements: jobCreationData.requirements,
            position: jobCreationData.position,
            positionLevel: jobCreationData.positionLevel,
            companyOffers: jobCreationData.companyOffers,
            location: jobCreationData.location,
            city: jobCreationData.city,
            salary: Number(jobCreationData.salary),
            salaryUp: Number(jobCreationData.salaryUp),
            remoteWork: jobCreationData.remoteWork,
            totalWorkHours: jobCreationData.totalWorkHours,
            selection: jobCreationData.selection,
          },
          { headers }
        )
        .then((response) => {
          console.log(response);
          console.log(response.data);

          const timer = setTimeout(() => {
            navigate("/jobs/" + response.data.id, {
              state: {
                id: response.data.id,
              },
            });
          }, 500);
          return () => clearTimeout(timer);
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.message);
        });
    }
  };
  useEffect(() => {
    setJobCreationData({
      ...jobCreationData,
      remoteWork: remoteWork,
    });
  }, [remoteWork]);
  const handleAddRequirement = () => {
    setJobCreationData({
      ...jobCreationData,
      requirements: [
        ...jobCreationData.requirements,
        {
          name: "",
        },
      ],
    });
  };
  const handleRemoveRequirement = (i) => {
    const requirements = [...jobCreationData.requirements];
    requirements.splice(i, 1);
    setJobCreationData({ ...jobCreationData, requirements });
  };

  return (
    <>
      {user &&
      user[1] &&
      loc.pathname === "/profile" &&
      (user[1].includes("Darbdavys") ||
        user[1].includes("Administratorius")) ? (
        <Button onClick={() => handleShow()}>Sukurti naują skelbimą</Button>
      ) : null}

      <Modal
        size="lg"
        show={show}
        backdrop="static"
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Naujo skelbimo kūrimas</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleCreateJob}>
            <Form.Group controlId="realTitle">
              <FloatingLabel
                controlId="titleInput"
                label="Pavadinimas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      title: event.target.value,
                    })
                  }
                  placeholder="Pavadinimas"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realDescription">
              <FloatingLabel
                controlId="descriptionInput"
                label="Aprašymas"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  style={{ height: "200px" }}
                  placeholder="Įmonės aprašymas"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      description: event.target.value,
                    })
                  }
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realPosition">
              <FloatingLabel
                controlId="positionInput"
                label="Pozicija"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      position: event.target.value,
                    })
                  }
                  placeholder="Įveskite poziciją"
                  isInvalid={!!errors.position}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.position}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="selectCity">
              <Typeahead
                className="d-flex justify-content-center mb-3"
                style={{ width: "100%", height: "58px" }}
                id="cities"
                name="cities"
                placeholder="Miestas"
                onChange={handleLocationChange}
                options={cities}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ marginTop: "-12px" }}
              >
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="realPositionLevel">
              <FloatingLabel
                controlId="positionInput"
                label="Pareigų lygis"
                className="mb-3 mt-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      positionLevel: event.target.value,
                    })
                  }
                  placeholder="Pareigų lygis"
                  isInvalid={!!errors.positionLevel}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.positionLevel}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realCompanyOffers">
              <FloatingLabel
                controlId="companyOffersInput"
                label="Įmonė siūlo"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  style={{ height: "200px" }}
                  placeholder="Įmonė siūlo"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      companyOffers: event.target.value,
                    })
                  }
                  isInvalid={!!errors.companyOffers}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyOffers}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Card className="mb-3">
              <Card.Header className="mb-3 fs-5">Reikalavimai:</Card.Header>
              {jobCreationData.requirements.map((requirement, i) => (
                <div key={i} className="mb-3">
                  <Form.Group controlId={`name-${i}`}>
                    <FloatingLabel
                      controlId={`requirementsInput-${i}`}
                      label="Reikalavimas"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="pvz.: Gerai išmanyti PHP, Darbo patirtis su PHP bent 3 metai"
                        value={requirement.name}
                        onChange={(event) => {
                          const newRequirement = [
                            ...jobCreationData.requirements,
                          ];
                          newRequirement[i].name = event.target.value;
                          setJobCreationData({
                            ...jobCreationData,
                            requirements: newRequirement,
                          });
                        }}
                        isInvalid={
                          !!(
                            errors.requirements &&
                            errors.requirements[i] &&
                            errors.requirements[i].name
                          )
                        }
                      />{" "}
                      <Form.Control.Feedback type="invalid">
                        {errors.requirements &&
                          errors.requirements[i] &&
                          errors.requirements[i].name}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>

                  {i !== 0 && (
                    <Button
                      className="ms-3"
                      variant="danger"
                      onClick={() => handleRemoveRequirement(i)}
                    >
                      Pašalinti
                    </Button>
                  )}
                </div>
              ))}
              <div>
                <Button
                  className="mb-3 ms-3"
                  variant="success"
                  onClick={() => handleAddRequirement()}
                >
                  Pridėti
                </Button>
              </div>
            </Card>

            <Form.Group controlId="realLocation">
              <FloatingLabel
                controlId="locationInput"
                label="Adresas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      location: event.target.value,
                    })
                  }
                  placeholder="Adresas"
                  isInvalid={!!errors.location}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Group
                controlId="realSalary"
                style={{ width: "50%" }}
                className="me-3"
              >
                <FloatingLabel
                  controlId="salaryInput"
                  label="Alga (ant popieriaus) nuo"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    onChange={(event) =>
                      setJobCreationData({
                        ...jobCreationData,
                        salary: event.target.value,
                      })
                    }
                    placeholder="Alga"
                    isInvalid={!!errors.salary}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salary}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group controlId="realSalaryUp" style={{ width: "50%" }}>
                <FloatingLabel
                  controlId="salaryInputUp"
                  label="Alga (ant popieriaus) iki"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    onChange={(event) =>
                      setJobCreationData({
                        ...jobCreationData,
                        salaryUp: event.target.value,
                      })
                    }
                    placeholder="Alga"
                    isInvalid={!!errors.salaryUp}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salaryUp}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </div>
            <Form.Group controlId="realTotalWorkHours">
              <FloatingLabel
                controlId="totalWorkHours"
                label="Etatas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      totalWorkHours: event.target.value,
                    })
                  }
                  placeholder="Etatas"
                  isInvalid={!!errors.totalWorkHours}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totalWorkHours}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="realSelection">
              <FloatingLabel
                controlId="selectionInput"
                label="Atrankos būdas"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={(event) =>
                    setJobCreationData({
                      ...jobCreationData,
                      selection: event.target.value,
                    })
                  }
                  placeholder="Atrankos būdas"
                  isInvalid={!!errors.selection}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selection}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <div>
              <Form.Check
                type="checkbox"
                className="mt-3 mb-2"
                label="Darbas iš namų?"
                checked={remoteWork}
                onChange={(event) => {
                  setRemoteWork(event.target.checked);
                }}
              />
            </div>
            <Button variant="success" type="submit">
              Atnaujinti duomenis
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default JobCreate;
