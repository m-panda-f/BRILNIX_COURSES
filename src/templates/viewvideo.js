import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ViewVideo = () => {
  const [courseData, setCourseData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Function to parse URL query parameters
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    try {
      // Parse data from the URL
      const courseTitle = query.get("courseTitle") || "No Title Provided";
      const courseDescription =
        query.get("courseDescription") || "No Description Provided";
      const courseImage =
        query.get("courseImage") || "https://via.placeholder.com/300";

      // Safely parse the videoLinks JSON
      let videoLinks;
      try {
        videoLinks = JSON.parse(query.get("videoLinks")) || [];
      } catch (error) {
        console.error("Error parsing videoLinks:", error);
        videoLinks = [];
      }

      const fetchedData = {
        courseTitle,
        courseDescription,
        courseImage,
        videos: videoLinks,
      };

      setCourseData(fetchedData);
      if (videoLinks.length > 0) setSelectedVideo(videoLinks[0]); // Default to first video
    } catch (error) {
      console.error("Error fetching query params:", error);
    }
  }, [query]);

  if (!courseData) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      {/* Course Details */}
      <div style={{ textAlign: "center" }}>
        <img
          src={courseData.courseImage}
          alt={courseData.courseTitle}
          width="300"
          style={{ borderRadius: "8px" }}
        />
        <h1>{courseData.courseTitle}</h1>
        <p>{courseData.courseDescription}</p>
      </div>

      {/* Video Player and List */}
      <div style={{ display: "flex", marginTop: "20px" }}>
        {/* Video List */}
        <div style={{ flex: "1", paddingRight: "20px" }}>
          <h3>Video List</h3>
          <ul>
            {courseData.videos.length > 0 ? (
              courseData.videos.map((video, index) => (
                <li key={index} style={{ margin: "10px 0" }}>
                  <button
                    onClick={() => setSelectedVideo(video)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {video.videoTitle || `Video ${index + 1}`}
                  </button>
                </li>
              ))
            ) : (
              <p>No videos available.</p>
            )}
          </ul>
        </div>

        {/* Video Player */}
        <div style={{ flex: "2" }}>
          {selectedVideo ? (
            <>
              <h3>{selectedVideo.videoTitle}</h3>
              <iframe
                width="100%"
                height="400px"
                src={selectedVideo.videoLink}
                title={selectedVideo.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
          ) : (
            <p>No video selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVideo;
