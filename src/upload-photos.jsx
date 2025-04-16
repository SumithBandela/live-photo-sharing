import './upload-photos.css';
import { useState } from 'react';

export function UploadPhotos() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one photo!');
      return;
    }

    // Replace this with real upload logic
    alert(`${selectedFiles.length} photo(s) uploaded successfully!`);
    setSelectedFiles([]);
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2 className="upload-title">📤 Upload Photos</h2>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="upload-input"
        />

        <div className="preview-container">
          {selectedFiles.map((file, index) => (
            <div className="preview-card" key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="preview-img"
              />
              <p className="preview-name">{file.name}</p>
            </div>
          ))}
        </div>

        <button onClick={handleUpload} className="upload-button">Upload</button>
      </div>
    </div>
  );
}
