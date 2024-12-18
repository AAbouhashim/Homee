import React, { useState } from "react";
import { createPost } from "../api/api"; // Import API functions

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    image: "", // Store the Base64 string
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // Limit file size to 5MB
        setError("File size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result, // Store Base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64

      setUploadedFileName(file.name); // Display the file name
      setError(""); // Clear any existing error
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    const postData = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      image: formData.image,
    };
  
    try {
      const response = await createPost(postData);
  
      // Reset form
      setFormData({
        title: "",
        description: "",
        difficulty: "",
        image: "",
      });
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to submit the form.");
    } finally {
      setSubmitting(false);
    }
  };  

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-lg shadow-lg bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center">Create New Post</h2>

          {error && <p className="text-red-500">{error}</p>} {/* Error Message */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text">Post Title</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text">Description</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter description"
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>

            {/* Difficulty */}
            <div className="form-control">
              <label className="label" htmlFor="difficulty">
                <span className="label-text">Difficulty</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select difficulty
                </option>
                <option value="1">1 - Very Easy</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - Hard</option>
                <option value="5">5 - Very Hard</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="form-control">
              <label className="label" htmlFor="file">
                <span className="label-text">Upload File</span>
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleChange}
                className="file-input file-input-bordered w-full"
              />
              {uploadedFileName && (
                <p className="text-gray-500 mt-2">Selected file: {uploadedFileName}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                submitting ? "loading" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;