import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import axios from "axios";
import Resume from "./Resume";
import Navham from "./Navham";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "react-bootstrap";
import resumesService from "../services/resumes.service";

function ViewResume() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState("");
  const user = authService.getCurrentUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resumeId = searchParams.get("resumeId");
  const degreeStrings = [
    "Pasirinkti",
    "Vidurinis išsilavinimas",
    "Aukštesnysis/Profesinis išsilavinimas",
    "Aukštasis išsilavinimas",
    "Bakalauro laipsnis",
    "Magistro laipsnis",
    "Daktaro laipsnis",
    "Kita",
  ];
  useEffect(() => {
    if (!user && !user[1]) {
      navigate("/");
    }
  }, []);
  const fetchResume = async (resumeId) => {
    if (user) {
      const headers = {
        Authorization: `Bearer ${user[3]}`,
      };

      const response = await resumesService.fetchResume(resumeId, headers);
      if (user && user[0] && user[0] === response.data.userId) {
        setResumes(response.data);
      }
    }
  };
  useEffect(() => {
    fetchResume(resumeId);
  }, []);
  return (
    <>
      <div>
        {<Navham />}
        <Container>
          <div className="m-3">
            {resumes && (
              <Resume formValues={resumes} degreeStrings={degreeStrings} />
            )}
          </div>
        </Container>

        {<Footer />}
      </div>
    </>
  );
}

export default ViewResume;
