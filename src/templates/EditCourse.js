import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../authentication/firebaseConfig";

const EditCourse = () => {
  const { courseId } = useParams(); // Get course ID from the URL
  const navigate = useNavigate();
  const auth = getAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([{ videoTitle: "", videoLink: "" }]);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication check
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

  // Fetch course data and populate the form
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, "Courses", courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          setTitle(courseData.courseTitle);
          setDescription(courseData.courseDescription);
          setPoints(courseData.coursePoints);
          setVideos(courseData.videos || [{ videoTitle: "", videoLink: "" }]);
        } else {
          setMessage("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching course data: ", error);
        setMessage("Failed to fetch course details.");
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Handle video input changes
  const handleVideoChange = (index, e) => {
    const { name, value } = e.target;

    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      updatedVideos[index][name] = value;
      return updatedVideos;
    });
  };

  // Add a new video field
  const addVideoField = () => {
    setVideos((prevVideos) => [...prevVideos, { videoTitle: "", videoLink: "" }]);
  };

  // Delete a video field
  const handleDeleteVideo = (index) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  // Save updated course details
  const handleSave = async (e) => {
    e.preventDefault();

    if (title && description && points && videos.every((video) => video.videoTitle && video.videoLink)) {
      try {
        let updatedImageUrl = null;

        if (image) {
          // Upload new image if provided
          const storage = getStorage();
          const imageRef = ref(storage, `course-images/${courseId}_${image.name}`);
          await uploadBytes(imageRef, image);
          updatedImageUrl = await getDownloadURL(imageRef);
        }

        const courseRef = doc(db, "Courses", courseId);

        // Update the course details in Firestore
        await updateDoc(courseRef, {
          courseTitle: title,
          courseDescription: description,
          coursePoints: parseInt(points, 10),
          courseImage: updatedImageUrl || null, // Optional image update
          videos,
          updatedAt: new Date(),
        });

        setMessage("Course updated successfully!");
        navigate("/"); // Redirect to the home or courses page
      } catch (error) {
        console.error("Error updating course: ", error);
        setMessage("Failed to update course. Please try again.");
      }
    } else {
      setMessage("Please fill in all required fields.");
    }
  };

  if (!isAuthenticated) {
    return null; // Optionally show a loading spinner
  }

  return (
    <div className="form-container">
      <h2>Edit Course</h2>
      <form onSubmit={handleSave}>
        <label>Course Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Course Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <label>Points Required:</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
        <label>Course Image (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {videos.map((video, index) => (
          <div key={index} className="video-input-group">
            <label>Video Title:</label>
            <input
              type="text"
              name="videoTitle"
              value={video.videoTitle}
              onChange={(e) => handleVideoChange(index, e)}
              required
            />
            <label>Video Link:</label>
            <input
              type="url"
              name="videoLink"
              value={video.videoLink}
              onChange={(e) => handleVideoChange(index, e)}
              required
            />
            <button
              type="button"
              onClick={() => handleDeleteVideo(index)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete Video
            </button>
          </div>
        ))}
        <button type="button" onClick={addVideoField}>Add Another Video</button>
        <button type="submit">Save Changes</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default EditCourse;
