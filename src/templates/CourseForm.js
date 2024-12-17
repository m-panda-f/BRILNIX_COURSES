import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase auth
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const CourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(""); // New state for points
  const [image, setImage] = useState(null); // New state for the image
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
        navigate("/login"); // Redirect to login page if not logged in
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && description && points && image) {
      try {
        // Upload the image to Firebase Storage
        const storage = getStorage();
        const imageRef = ref(storage, `course-images/${uuidv4()}_${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        // Navigate to the next page with the data including points and image URL
        navigate("/video-details", {
          state: { title, description, points, imageUrl },
        });
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Failed to upload the image. Please try again.");
      }
    } else {
      alert("Please fill in all fields and upload an image!");
    }
  };

  if (!isAuthenticated) {
    return null; // Optionally show a loading spinner or message
  }

  return (
    <div>
      <h1>Add Course Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Points Required"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default CourseForm;
