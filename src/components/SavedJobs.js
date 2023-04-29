import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Navham from "./Navham";
import axios from "axios";
import JobList from "./JobList";
import { Container } from "react-bootstrap";
import JobSearch from "./JobSearch";
import { useLocation, useNavigate } from "react-router-dom";
import { BsHeart } from "react-icons/bs";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    async function fetchJobs() {
      const storedList = JSON.parse(localStorage.getItem("selectedJobIds"));
      if (storedList && storedList.length > 0) {
        const jobList = storedList.map((id) =>
          axios.get(`https://localhost:7045/api/job/${id}`)
        );
        axios
          .all(jobList)
          .then((results) => {
            const jobs = results.map((res) => res.data);
            const notHiddenJobs = jobs.filter((job) => !job.isHidden);
            setJobs(notHiddenJobs);
          })
          .catch((error) => {
            console.error(error);
          });
        setLoaded(true);
      }
    }

    fetchJobs();
  }, []);
  useEffect(() => {
    // Update current page based on query parameter
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    // Update total pages based on data and items per page
    const itemsPerPage = 6;
    const totalItems = jobs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(totalPages);
  }, [jobs]);

  const handlePageClick = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set("page", event.target.innerText);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  return (
    <>
      <div>
        {<Navham />}
        <JobSearch />
        <Container>
          <h3 className="text-center m-3 p-3">Išsaugoti skelbimai</h3>
          {jobs && jobs.length > 0 ? (
            <>
              <JobList
                data={jobs}
                currentPage={currentPage}
                totalPages={totalPages}
              />
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <a
                    key={index}
                    className={`page-link ${
                      index + 1 === currentPage ? "active" : ""
                    }`}
                    href={`${location.pathname}?page=${index + 1}`}
                    onClick={handlePageClick}
                  >
                    {index + 1}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <h4>
              Darbo skelbimų neišsisaugojęs. Norėdamas išsisaugoti darbo
              skelbimą paspausk <BsHeart />
            </h4>
          )}
        </Container>
      </div>
      {<Footer />}
    </>
  );
}

export default SavedJobs;
