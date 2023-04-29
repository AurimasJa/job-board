import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateResume from "./components/CreateResume";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Login from "./components/Login";
import Job from "./components/Job";
import Profile from "./components/Profile";
import Jobcandidates from "./components/JobCandidates";
import CompanyProfile from "./components/CompanyProfile";
import SavedJobs from "./components/SavedJobs";
import AnalyzedData from "./components/AnalysedData";
import UserResumes from "./components/UserResumes";
import FilteredJobs from "./components/FilteredJobs";
import Resumes from "./components/Resumes";
import ViewResume from "./components/ViewResume";
import Calculatesalary from "./components/Calculatesalary";
import DownloadResume from "./components/DownloadResume";
// import NavHam from "./components/NavHam";

function App() {
  const imageUrl =
    "https://images.pexels.com/photos/7233099/pexels-photo-7233099.jpeg";

  const style = {
    // backgroundImage: `url('${imageUrl}')`,
    backgroundSize: "cover",
    minHeight: "100vh",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
    // backgroundColor: "#f1f1f1", // set your desired color value here
  };
  return (
    <>
      <div style={style}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/createresume" element={<CreateResume />} />
            <Route path="/resume" element={<Resumes />} />
            <Route path="/jobs/:id" element={<Job />} exact />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs/candidates" element={<Jobcandidates />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/jobSearch" element={<AnalyzedData />} />
            <Route path="/saved/jobs" element={<SavedJobs />} />
            <Route path="/user/resumes" element={<UserResumes />} />
            <Route path="/jobs" element={<FilteredJobs />} />
            <Route path="/view/resume" element={<ViewResume />} />
            <Route path="/calculator" element={<Calculatesalary />} />
            {/* <Route path="/downloadpdf" element={<DownloadResume />} /> */}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
