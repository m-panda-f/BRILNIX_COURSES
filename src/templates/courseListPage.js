import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../authentication/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "../styles/list.css"; // Import the styles for the Course List page

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchCourses(); // Fetch courses only if authenticated
      } else {
        setIsAuthenticated(false);
        navigate("/login"); // Redirect unauthenticated users
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [navigate]);

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "Courses"));
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  // Function to handle course deletion
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      try {
        const courseRef = doc(db, "Courses", courseId);
        await deleteDoc(courseRef);
        setCourses(courses.filter((course) => course.id !== courseId)); // Update state
        alert("Course deleted successfully!");
      } catch (error) {
        console.error("Error deleting course: ", error);
        alert("Failed to delete the course.");
      }
    }
  };

  // While checking authentication, show a loading message
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-list">
      <h1>Available Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <Link to={`/edit-course/${course.id}`} className="course-link">
                <div className="course-item">
                  <img
                    src={course.courseImage}
                    alt={course.courseTitle}
                    className="course-img"
                  />
                  <div className="course-info">
                    <h2>{course.courseTitle}</h2>
                    <p>{course.courseDescription}</p>
                    <p>{course.coursePoints} Points</p>
                  </div>
                </div>
              </Link>
              {/* Delete button */}
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="delete-btn"
              >
                Delete Course
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseListPage;
