import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./templates/homepage";
import CourseListPage from "./templates/courseListPage";
import CourseForm from "./templates/CourseForm";
import EditCourse from "./templates/EditCourse"; // Used for both creating and editing courses
import VideoDetails from "./templates/VideoDetails";
import Login from "./authentication/login"; // Login Page
import Signup from "./authentication/signup"; // Signup Page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Course List Page */}
        <Route path="/course-list" element={<CourseListPage />} />

        {/* Course creation form */}
        <Route path="/create-course" element={<CourseForm />} />

        {/* Edit Course (this reuses the CourseForm component for both creation and editing) */}
        <Route path="/edit-course/:courseId" element={<EditCourse />} />

        {/* Login and Signup Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Video Details (for adding/editing videos after course creation) */}
        <Route path="/video-details" element={<VideoDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
