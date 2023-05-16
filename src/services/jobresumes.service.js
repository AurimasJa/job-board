import axios from "axios";

class JobResumes {
  async resumesCount(id) {
    return axios
      .get("https://localhost:7045/api/jobsresumes/count/" + id)
      .then((resp) => {
        return resp.data;
      });
  }
  async getJobResumes(id, headers) {
    return await axios
      .get("https://localhost:7045/api/jobsresumes/" + id, {
        headers,
      })
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }
  async specificJobResume(id, headers) {
    return await axios
      .get("https://localhost:7045/api/jobsresumes/specific/" + id, {
        headers,
      })
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }
  //create
  async applyToJob(id, jId, headers) {
    return await axios
      .post(
        "https://localhost:7045/api/jobsresumes",
        {
          resumeId: id,
          jobId: jId,
        },
        { headers }
      )
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }
  //update

  async updateReview(id, headers) {
    const response = await axios.put(
      "https://localhost:7045/api/jobsresumes/" + id,
      {
        reviewed: Number(1),
      },
      {
        headers,
      }
    );
    return response;
  }
}

export default new JobResumes();
