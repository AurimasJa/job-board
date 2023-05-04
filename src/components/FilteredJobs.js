import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navham from "./Navham";
import JobList from "./JobList";

function FilteredJobs({ filteredJobs }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const data = location.state.filteredJobs;
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    const itemsPerPage = 6;
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(totalPages);
  }, [data]);

  const handlePageClick = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set("page", event.target.innerText);
    navigate(`/jobs/?${params.toString()}`, {
      state: {
        filteredJobs: data,
      },
    });
  };
  return (
    <>
      <div>
        <Navham />
        <Container>
          <JobList
            data={data}
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
                href={`/jobs?page=${index + 1}`}
                onClick={handlePageClick}
              >
                {index + 1}
              </a>
            ))}
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default FilteredJobs;
