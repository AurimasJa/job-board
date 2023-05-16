import axios from "axios";

class ResumesService {
  async fetchResumes(headers) {
    return await axios
      .get("https://localhost:7045/api/resumes/", {
        headers,
      })
      .then((resp) => {
        const notHiddenResumes = resp.data.filter((resume) => !resume.isHidden);
        return notHiddenResumes;
      });
  }
  async fetchResume(resumeId, headers) {
    const response = await axios.get(
      `https://localhost:7045/api/resumes/${resumeId}`,
      { headers }
    );
    return response;
  }

  async fetchUserResumes(userId, headers) {
    return await axios
      .get("https://localhost:7045/api/resumes/user/" + userId, {
        headers,
      })
      .then((response) => {
        const notHiddenRes = response.data.filter((res) => !res.isHidden);
        return notHiddenRes;
      });
  }

  async fetchAllUserResumes(userId, headers) {
    return await axios
      .get("https://localhost:7045/api/resumes/user/" + userId, {
        headers,
      })
      .then((response) => {
        return response.data;
      });
  }

  //create
  async createResume(formValues, headers) {
    try {
      const response = await axios.post(
        "https://localhost:7045/api/resumes",
        {
          fullName: formValues.fullName,
          city: formValues.city,
          address: formValues.address,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          education: formValues.educations,
          experience: formValues.experiences,
          skills: formValues.skills,
          references: formValues.references,
          position: formValues.position,
          summary: formValues.summary,
          salary: formValues.salary,
        },
        { headers }
      );

      return response;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }
  //update

  async updateResumeVisibility(isHidden, resumeId, headers) {
    try {
      const response = await axios.put(
        `https://localhost:7045/api/resumes/visibility/${resumeId}`,
        {
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

  async updateResume(resumeId, resumeUpdateData, headers) {
    try {
      const response = await axios.put(
        `https://localhost:7045/api/resumes/${resumeId}`,
        {
          fullName: resumeUpdateData.fullName,
          city: resumeUpdateData.city,
          address: resumeUpdateData.address,
          email: resumeUpdateData.email,
          phoneNumber: resumeUpdateData.phoneNumber,
          educations: resumeUpdateData.educations,
          experiences: resumeUpdateData.experiences,
          skills: resumeUpdateData.skills,
          references: resumeUpdateData.references,
          position: resumeUpdateData.position,
          summary: resumeUpdateData.summary,
          salary: resumeUpdateData.salary,
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
  async delete(resumeId, headers) {
    try {
      const response = await axios.delete(
        `https://localhost:7045/api/resumes/${resumeId}`,
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

export default new ResumesService();
