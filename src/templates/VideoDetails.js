import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../authentication/firebaseConfig";
import "../styles/App.css";

const VideoDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const { title, description, points, imageUrl, viewOnly } = location.state || {};
  const parsedPoints = parseInt(points, 10) || 0; // Safely parse points

  // State variables
  const [videos, setVideos] = useState([{ videoTitle: "", videoLink: "" }]);
  const [message, setMessage] = useState("");
  const [, setIsAuthenticated] = useState(false);
  const [isViewOnly, ] = useState(viewOnly || false);

  // Check user authentication status
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    });
  }, [navigate, auth]);

  // Fetch existing course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (title) {
        try {
          const courseRef = doc(db, "Courses", title);
          const courseDoc = await getDoc(courseRef);

          if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            setVideos(courseData.videos || [{ videoTitle: "", videoLink: "" }]);
          }
        } catch (error) {
          console.error("Error fetching course videos: ", error);
          setMessage("Error fetching course details.");
        }
      }
    };

    fetchCourseData();
  }, [title]);

  // Handle input changes for video fields
  const handleChange = (index, e) => {
    if (isViewOnly) return; // Prevent edits in view-only mode
    const { name, value } = e.target;

    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      updatedVideos[index][name] = value;
      return updatedVideos;
    });
  };

  // Add a new video field
  const addVideoField = () => {
    if (!isViewOnly) {
      setVideos((prevVideos) => [...prevVideos, { videoTitle: "", videoLink: "" }]);
    }
  };

  // Save or update course video details
  const handleSave = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;

    if (videos.every((video) => video.videoTitle && video.videoLink)) {
      try {
        const courseRef = doc(db, "Courses", title);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          // Update existing document
          await updateDoc(courseRef, {
            videos,
            updatedAt: new Date(),
          });
        } else {
          // Create new document
          await setDoc(courseRef, {
            courseTitle: title,
            courseDescription: description,
            coursePoints: parsedPoints,
            courseImage: imageUrl,
            videos,
            createdAt: new Date(),
          });
        }

        setMessage("Video details saved successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error saving video details: ", error);
        setMessage("Failed to save video details. Please try again.");
      }
    } else {
      setMessage("Please fill in all fields for each video!");
    }
  };

  return (
    <div className="form-container">
      <h2
        style={{
          textAlign: "center",
          color: "#f5576c",
          marginBottom: "20px",
          fontSize: "24px",
        }}
      >
        {isViewOnly ? "View Course Videos" : "Add Course Videos"}
      </h2>
      <form onSubmit={handleSave}>
        {videos.map((video, index) => (
          <div key={index} className="video-input-group">
            <label>Video Title:</label>
            <input
              type="text"
              name="videoTitle"
              value={video.videoTitle}
              onChange={(e) => handleChange(index, e)}
              readOnly={isViewOnly}
              required
            />
            <label>Video Link:</label>
            <input
              type="url"
              name="videoLink"
              value={video.videoLink}
              onChange={(e) => handleChange(index, e)}
              readOnly={isViewOnly}
              required
            />
          </div>
        ))}
        {!isViewOnly && (
          <>
            <button type="button" onClick={addVideoField}>
              Add Another Video
            </button>
            <button type="submit">Save Videos</button>
          </>
        )}
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default VideoDetails;
