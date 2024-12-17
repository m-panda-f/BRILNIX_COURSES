import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Firebase Auth methods
import "../styles/App.css"; // Import the styles for the Home Page

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth status
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const auth = getAuth();
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
        navigate("/login"); // Redirect to login page
      }
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out user
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // While checking authentication, show a loading message
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <nav className="nav-bar">
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="home-option">
        <h3>Create a New Course</h3>
        <p>Start building a new course with the necessary details.</p>
        <Link to="/create-course">
          <button>Create Course</button>
        </Link>
      </div>
      <div className="home-option">
        <h3>View Existing Courses</h3>
        <p>Edit or review the courses you've created so far.</p>
        <Link to="/course-list">
          <button>View Courses</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
