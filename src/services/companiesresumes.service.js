import axios from "axios";

class Users {
  async getResumesViewedByCompanies(id, headers) {
    return await axios
      .get("https://localhost:7045/api/companiesresume/companies/" + id, {
        headers,
      })
      .then((response) => {
        const responseToArray = Object.values(response.data);
        return responseToArray;
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }
  //create
  async createCompaniesResume(id, resumeId, headers) {
    return await axios
      .post(
        `https://localhost:7045/api/companiesresume/`,
        {
          companyId: id,
          resumeId: resumeId,
        },
        {
          headers,
        }
      )
      .then((response) => {
        return "success";
      });
  }
}

export default new Users();
