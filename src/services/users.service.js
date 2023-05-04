import axios from "axios";

class Users {
  async getUser(id) {
    return await axios
      .get("https://localhost:7045/api/users/" + id)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }
  async getUsersCompany(id) {
    return await axios
      .get("https://localhost:7045/api/users/company/" + id)
      .then((resp) => {
        return resp.data;
      });
  }
  async getUserJobApplies(id) {
    return await axios
      .get("https://localhost:7045/api/users/applied/job/" + id)
      .then((response) => {
        const responseToArray = Object.values(response.data);
        return responseToArray;
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
      });
  }

  //update
  async updateUserData(id, userDataUpdate, headers) {
    return await axios
      .put(
        `https://localhost:7045/api/users/${id}`,
        {
          name: userDataUpdate.name,
          surname: userDataUpdate.surname,
          email: userDataUpdate.email,
          password: userDataUpdate.password,
          newPassword: userDataUpdate.newPassword,
          dateOfBirth: userDataUpdate.dateOfBirth,
        },
        {
          headers,
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log(response);
        return "success";
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data;
        } else {
          console.error(error);
        }
      });
  }
  async updateCompanyData(id, companyDataUpdate, city, headers) {
    return await axios
      .put(
        `https://localhost:7045/api/users/company/${id}`,
        {
          name: companyDataUpdate.name,
          surname: companyDataUpdate.surname,
          email: companyDataUpdate.email,
          password: companyDataUpdate.password,
          newPassword: companyDataUpdate.newPassword,
          aboutSection: companyDataUpdate.aboutSection,
          city: city,
          address: companyDataUpdate.address,
          site: companyDataUpdate.site,
          phoneNumber: companyDataUpdate.phoneNumber,
          companyName: companyDataUpdate.companyName,
          companyCode: companyDataUpdate.companyCode,
        },
        {
          headers,
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        return "success";
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data;
        } else {
          console.error(error);
        }
      });
  }

  //update
}

export default new Users();
