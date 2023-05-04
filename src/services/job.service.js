import axios from "axios";

class JobService {
  async fetchBiggestCompanies() {
    return await axios
      .get("https://localhost:7045/api/job/biggest/companies")
      .then((resp) => {
        const temp = resp.data.sort((a, b) => b.jobCount - a.jobCount);
        return temp;
      });
  }

  async fetchAverageSalary() {
    return await axios
      .get("https://localhost:7045/api/job/average")
      .then((resp) => {
        const temp = resp.data.sort(
          (a, b) => b.averageCitySalary - a.averageCitySalary
        );
        return temp;
      });
  }
  async fetchCompanyJobs(id) {
    const response = await axios.get(
      "https://localhost:7045/api/job/company/" + id
    );
    return response;
  }
  async fetchLatestJobs() {
    return await axios
      .get("https://localhost:7045/api/job/latest")
      .then((resp) => {
        const notHiddenJobs = resp.data.filter((job) => !job.isHidden);
        return notHiddenJobs;
      });
  }
  async fetchSavedJobs() {
    const storedList = JSON.parse(localStorage.getItem("selectedJobIds"));
    if (storedList && storedList.length > 0) {
      const jobList = storedList.map((id) =>
        axios.get(`https://localhost:7045/api/job/${id}`).catch((error) => {
          if (error.response && error.response.status === 404) {
            return null;
          }
          throw error;
        })
      );
      const results = await axios.all(jobList);
      const jobs = results.filter((res) => res !== null).map((res) => res.data);
      const notHiddenJobs = jobs.filter((job) => !job.isHidden);
      return notHiddenJobs;
    } else {
      return [];
    }
  }

  async fetchSimilarJobs(pos, city, id) {
    const response = await axios.get(
      `https://localhost:7045/api/job/details?position=${pos}&&city=${city}&&id=${id}`
    );
    console.log(response.data);
    return response.data;
  }
  async fetchJobs() {
    return await axios.get("https://localhost:7045/api/job/").then((resp) => {
      const notHiddenJobs = resp.data.filter((job) => !job.isHidden);
      return notHiddenJobs;
    });
  }
  async fetchJob(id) {
    const resp = await axios.get("https://localhost:7045/api/job/" + id);
    const { companyOffers, description, ...rest } = resp.data;
    const convertedCompanyOffers = companyOffers.replace(
      /<\/?\s*br\s*\/?>/gi,
      "\n"
    );
    const convertedDescription = description.replace(
      /<\/?\s*br\s*\/?>/gi,
      "\n"
    );
    const formattedCompanyOffers = convertedCompanyOffers
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
    const formattedDescription = convertedDescription
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
    return {
      description: description,
      companyOffers: companyOffers,
      selectedJob: {
        ...rest,
        companyOffers: formattedCompanyOffers,
        description: formattedDescription,
      },
    };
  }

  //create
  async createJob(jobCreationData, headers) {
    try {
      const response = await axios.post(
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
      );

      return response.data.id;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }
  //update
  async updateJobValidity(validityDate, isHidden, jobId, headers) {
    try {
      const response = await axios.put(
        `https://localhost:7045/api/job/validity/${jobId}`,
        {
          validityDate: validityDate,
          isHidden: isHidden,
        },
        {
          headers,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }

  async updateJob(
    jobId,
    hasCompanyOffersChanged,
    hasDescriptionChanged,
    jobUpdateData,
    description,
    companyOffers,
    headers
  ) {
    try {
      const response = await axios.put(
        `https://localhost:7045/api/job/${jobId}`,
        {
          title: jobUpdateData.title,
          description: hasDescriptionChanged
            ? description.description
            : description,
          requirements: jobUpdateData.requirements,
          position: jobUpdateData.position,
          positionLevel: jobUpdateData.positionLevel,
          companyOffers: hasCompanyOffersChanged
            ? companyOffers.companyOffers
            : companyOffers,
          location: jobUpdateData.location,
          city: jobUpdateData.city,
          salary: Number(jobUpdateData.salary),
          salaryUp: Number(jobUpdateData.salaryUp),
          remoteWork: jobUpdateData.remoteWork,
          totalWorkHours: jobUpdateData.totalWorkHours,
          selection: jobUpdateData.selection,
        },
        {
          headers,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      console.log(error.data);
    }
  }
  //delete
  async delete(jobId, headers) {
    try {
      const response = await axios.delete(
        `https://localhost:7045/api/job/${jobId}`,
        {
          headers,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }
}

export default new JobService();
