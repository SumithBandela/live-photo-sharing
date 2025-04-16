import { useState } from 'react';
import './add-album.css';

export function AddAlbum() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [downloadOption, setDownloadOption] = useState('no');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const formData = {
      title,
      description,
      thumbnail,
      downloadOption
    };
    console.log(formData);
    // Reset
    setTitle('');
    setDescription('');
    setThumbnail(null);
    setDownloadOption('no');
  };

  return (
    <div className="addalbum-container">
      <h2>Add New Album</h2>
      <form className="album-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Album Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Album Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          required
        />

        <div className="radio-group">
          <label>Allow Download:</label>
          <label>
            <input
              type="radio"
              name="download"
              value="yes"
              checked={downloadOption === 'yes'}
              onChange={() => setDownloadOption('yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="download"
              value="no"
              checked={downloadOption === 'no'}
              onChange={() => setDownloadOption('no')}
            />
            No
          </label>
        </div>

        <button type="submit">Add Album</button>
      </form>
    </div>
  );
}
