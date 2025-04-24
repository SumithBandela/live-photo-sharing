import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { CloseButton } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import './album-photos.css';

export function AlbumPhotos() {
  const { slug } = useParams();
  const [photos, setPhotos] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({
    title: '',
    description: '',
    download: false
  });

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    axios.get(`https://rashmiphotography.com/backend/get_album_photos.php`, {
      params: { slug }
    })
    .then((response) => {
      if (response.data.status === 'success') {
        const album = response.data.album;

        setAlbumDetails({
          title: album.title,
          description: album.description,
          download: album.download,
        });

        const fetchedPhotos = album.images.map((image) => ({
          img_src: `https://rashmiphotography.com/backend/${image.img_src}`,
          is_visible: image.is_visible,
          alt: album.title || "Album Image"
        }));

        setPhotos(fetchedPhotos);
      } else {
        console.error(response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching photos:', error);
    });
  }, [slug]);

  useEffect(() => {
    if (loaded) {
      const timeout = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [loaded]);

  const handleShow = (index) => {
    setCurrentIndex(index);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleContextMenu = (e) => e.preventDefault();

  const formattedImages = photos.map(photo => ({
    original: photo.img_src
  }));

  const handleWaterMarkDownload = () => {
    const currentPhoto = photos[currentIndex];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentPhoto.img_src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const watermarkText = "©Rashmi Photography";
      const fontSize = img.width / 25;
      ctx.font = `${fontSize}px Playfair Display`;
      ctx.fillStyle = "rgba(255, 255, 255)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(watermarkText, img.width - 20, img.height - 50);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = currentPhoto.alt.replace(/\s+/g, "_") + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.onerror = () => {
      console.error("Error loading image.");
    };
  };

  return (
    <div className="album-photos">
      <h2>{albumDetails.title}</h2>
      <p>{albumDetails.description}</p>

      <div className="photos-grid">
        {photos.filter(p => p.is_visible === 1).map((photo, index) => (
          <Card
            key={index}
            className="image-card"
            onClick={() => handleShow(index)}
            style={{ background: "transparent", boxShadow: "none", border: "none" }}
          >
            <Card.Img
              variant="top"
              src={photo.img_src}
              alt={photo.alt}
              className={`lazy-img ${loaded ? "loaded" : ""} ${visible ? "visible" : ""}`}
              onLoad={() => setLoaded(true)}
              onContextMenu={handleContextMenu}
              loading="lazy"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </Card>
        ))}
      </div>

      {/* Modal Preview */}
      <Modal show={show} onHide={handleClose} animation centered onContextMenu={handleContextMenu} className="fade-modal">
        <Modal.Body className="modal-body">
          <span className="close-button fs-5" onClick={handleClose}>
            <CloseButton variant="white" />
          </span>
          <ImageGallery
            items={formattedImages}
            startIndex={currentIndex}
            showPlayButton={false}
            showFullscreenButton={false}
            onSlide={(index) => setCurrentIndex(index)}
          />
        </Modal.Body>
        <div className="d-flex justify-content-center">
          {albumDetails.download === 1 && (
            <button
              className="btn btn-danger w-50 rounded rounded-5 download-button"
              onClick={handleWaterMarkDownload}
            >
              Download
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}
