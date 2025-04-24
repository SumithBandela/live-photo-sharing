import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { CloseButton } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import './album-photos.css';

import Pagination from '@mui/material/Pagination';

export function AlbumPhotos() {
  const { slug } = useParams();
  const [photos, setPhotos] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({
    title: '',
    description: '',
    download: false,
    watermark:'',
    is_visible:false
  });

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 8;

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
          watermark:album.watermark,
          is_visible:album.is_visible
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

  const visiblePhotos = photos.filter(p => p.is_visible === 1);
  const totalPages = Math.ceil(visiblePhotos.length / photosPerPage);

  const paginatedPhotos = visiblePhotos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  );

  const formattedImages = visiblePhotos.map(photo => ({
    original: photo.img_src
  }));

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const applyWatermarkAndDownload = (imgSrc, watermarkText) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
  
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
  
      ctx.drawImage(image, 0, 0);
  
      const fontSize = Math.floor(canvas.width / 40);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
  
      ctx.fillText(watermarkText, 20, canvas.height - 20);
  
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/jpeg");
      link.download = 'watermarked_photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    image.onerror = () => {
      alert("Failed to load image for download.");
    };
  
    image.src = imgSrc;
  };
  

  const handleWaterMarkDownload = () => {
    const currentImage = formattedImages[currentIndex];
    if (currentImage && currentImage.original && albumDetails.watermark) {
      applyWatermarkAndDownload(currentImage.original, albumDetails.watermark);
    }
  };
  

  return (
    <div className="album-photos">
      {albumDetails.is_visible===1 ? (
        <>
          <h2>{albumDetails.title}</h2>
      <p>{albumDetails.description}</p>

      <div className="photos-grid">
        {paginatedPhotos.map((photo, index) => (
          photo.is_visible === 1 && (
            <Card
              key={index}
              className="image-card"
              onClick={() => handleShow(index + (currentPage - 1) * photosPerPage)}
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
          )
        ))}
      </div>

     {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              boundaryCount={1}
              siblingCount={1}
              shape="rounded"
              variant="outlined"
              size="large"
              showFirstButton
              showLastButton
              color="secondary"
            />
          </div>
        )}

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
        </>
      ) : (
        <div className="text-center p-5">
          <h2 className="text-white">🚫 This album is not visible to the public.</h2>
          </div>
      )}
    </div>
  );
}
