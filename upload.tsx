import { useState } from "react";
import { useDropzone } from "react-dropzone";

function Upload({ setResult }) {
  const [preview, setPreview] = useState(null); // Preview for the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // Upload status message

  // Dropzone configuration
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Generate preview for the selected file
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Optional: Store the file for uploading
      uploadFile(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/png, image/jpeg, image/gif",
    maxSize: 10 * 1024 * 1024, // 10 MB max size
  });

  // Function to upload file to the server
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the API returns JSON data
        setUploadStatus("File uploaded successfully!");
        setResult(data.predictions); // Set result from API response
      } else {
        setUploadStatus("Failed to upload the file.");
        setResult("Error: Unable to upload.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred during upload.");
      setResult("Error: Something went wrong.");
    }
  };

  return (
    <div
      {...getRootProps()} // Dropzone props
      className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6 text-center cursor-pointer"
    >
      <input {...getInputProps()} /> {/* Invisible input for file selection */}
      {/* Dropzone Content */}
      <div>
        <img
          className="mx-auto h-12 w-12"
          src="https://www.svgrepo.com/show/357902/image-upload.svg"
          alt="Upload Icon"
        />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Drag and drop{" "}
          <span className="text-indigo-600 cursor-pointer">or click</span> to
          upload
        </h3>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
      {/* Preview Section */}
      {preview && (
        <img
          src={preview}
          className="mt-4 mx-auto max-h-40 object-contain"
          alt="Preview"
        />
      )}
      {/* Upload Status */}
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-700">{uploadStatus}</p>
      )}
    </div>
  );
}

export default Upload;
