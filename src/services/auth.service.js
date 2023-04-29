import axios from "axios";
import jwtDecode from "jwt-decode";
// import Constants from "../utilities/Constants";

// const API_URL = Constants.API_URL_GET_ALL_WAREHOUSES;

class AuthService {
  //register

  async login(email, password) {
    return await axios
      .post("https://localhost:7045/api/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(localStorage);
        }
        return "success";
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
          return error.response.data || {};
        } else {
          console.error(error);
        }
      });
  }
  //eda@ga.l
  async registerUser(
    name,
    surname,
    email,
    aboutSection,
    password,
    dateOfBirth
  ) {
    return await axios
      .post("https://localhost:7045/api/register", {
        name,
        surname,
        aboutSection,
        dateOfBirth,
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(localStorage);
        }
        return "success";
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          return error.response.data.errors || error.response.data || {};
        } else {
          console.error(error);
        }
      });
  }
  async registerCompany(
    name,
    surname,
    phoneNumber,
    email,
    password,
    aboutSection,
    address,
    city,
    companyCode,
    companyName,
    site
  ) {
    return await axios
      .post("https://localhost:7045/api/register/company", {
        name,
        surname,
        phoneNumber,
        email,
        password,
        aboutSection,
        address,
        city,
        companyCode,
        companyName,
        site,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(localStorage);
        }
        return "success";
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          return error.response.data.errors || error.response.data || {};
        } else {
          console.error(error);
        }
      });
  }

  logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const token = user.accessToken;
      const dec = jwtDecode(token);
      const userId = dec.sub;
      const temp = [];
      temp.push(
        userId,
        dec["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        dec["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        user.accessToken
      );
      return temp;
    }
    return "";
  }
}

export default new AuthService();
