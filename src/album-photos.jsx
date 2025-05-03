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
import { Box } from '@mui/material';
import Fab from '@mui/material/Fab';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export function AlbumPhotos() {
  const { slug } = useParams();
  const [photos, setPhotos] = useState([]);
  const [profile ,setProfile]  = useState({});
  const [showButton, setShowButton] = useState(false);
  const [hideIcons, setHideIcons] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [albumDetails, setAlbumDetails] = useState({
    title: '',
    description: '',
    download: false,
    is_visible:false,
    username:''
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
          is_visible:album.is_visible,
          username:album.username
        });

        const fetchedPhotos = album.images.map((image) => ({
          img_src: `https://rashmiphotography.com/backend/${image.img_src}`,
          is_visible: image.is_visible,
          alt: album.title || "Album Image"
        }));

        setPhotos(fetchedPhotos);
        setProfile(response.data.profile || {});
    
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
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000); // 1 second = 1000 milliseconds

    return () => clearTimeout(timer); // cleanup
  }, [loaded]);
  
   useEffect(() => {
      const handleScroll = () => {
        // Show scroll-to-top button after scrolling down 300px
        setShowButton(window.scrollY > 300);
  
        // Hide only social icons (WhatsApp, Instagram, YouTube) at the bottom
        const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 150; // Adjust this value to control when icons hide
        setHideIcons(isNearBottom);
  
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  

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

  const handleWaterMarkDownload = async () => {
    if (photos[currentIndex]) {
      try {
        const imageName = photos[currentIndex].img_src.split('/').pop();
        const username = albumDetails.username;
        const title = albumDetails.title;      
  
        const response = await axios.get(`https://rashmiphotography.com/backend/download_image.php`, {
          params: {
            username: username, 
            title: title,
            img_src: imageName
          },
          responseType: "blob",
        });
  
        const blob = response.data;
        const img = new Image();
        img.src = URL.createObjectURL(blob);
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
  
          const watermarkText = `©${profile.studio_name}`;
          const fontSize = img.width / 25;
          ctx.font = `${fontSize}px Playfair Display`;
          ctx.fillStyle = "rgba(255, 255, 255)";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
  
          const offset = 50;
          ctx.fillText(watermarkText, img.width - 20, img.height - offset);
  
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  
          const link = document.createElement("a");
          link.href = dataUrl;
  
          const fileName = photos[currentIndex].alt
            ? photos[currentIndex].alt.replace(/\s+/g, "_") + ".jpg"
            : `image_${currentIndex + 1}.jpg`;
  
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
  
        img.onerror = () => {
          console.error("Error loading image.");
        };
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
  };
  

  return (
    <div className="album-photos" onContextMenu={handleContextMenu}>
      {albumDetails.is_visible===1 ? (
        <>
        {/* Top Branding */}
          <div className="top-branding text-center">
            <h1 className="studio-name-text">{profile.studio_name}</h1>
            <p className="caption-text">{profile.caption}</p>
          </div>

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
          {albumDetails.download === 1 && profile.studio_name && (
          <button className="download-btn" onClick={handleWaterMarkDownload}>
          <i className="bi bi-download"></i> Download
        </button>
               
          
          )}
        </div>
      </Modal>
      {/* Branding / Photographer Promotion */}
          <div className="branding-footer">
            <hr className="footer-divider" />
            <div className="branding-content">
              {profile.logo_url && (
                <img src={`https://rashmiphotography.com/backend/${profile.logo_url}?ts=${Date.now()}`}  alt="Studio Logo" className="branding-logo" />
              )}
              <h4 className="studio-name">{profile.studio_name}</h4>
              <p className="branding-description mb-0">{profile.caption}</p>
              <div className="social-icons">
               {profile.facebook_link && (<a href={profile.facebook_link} target="_blank" rel="noopener noreferrer" className="mx-2 fs-3 text-primary">
                <img src='logo/facebook-icon.png' width='30' alt='icon'/>
                </a>)}
                {profile.instagram_link &&<a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="mx-2 fs-3 text-white">
                <img src='logo/instagram-icon.png' width='30' alt='icon' className='bg-white rounded rounded-2' style={{padding:'4px'}}/>
                </a>}
              {profile.youtube_link && (<a href={profile.youtube_link} target="_blank" rel="noopener noreferrer" className="mx-2 fs-3 text-danger">
                <img src='logo/youtube-icon.png' width='30' alt='icon'/>
                </a>)}
                {profile.whatsapp_link && (<a href={profile.whatsapp_link} target="_blank" rel="noopener noreferrer" className="mx-2 fs-3 text-danger">
                <img src='logo/whatsapp-icon.png' width='30' alt='icon'/>
                </a>)}
              </div>
            </div>
            <Box
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {showButton && (
        <Fab
          aria-label="scroll to top"
          sx={{
            borderRadius: 2,
            width: 40,
            height: 40,
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <KeyboardArrowUpIcon sx={{width:30 ,height:30}}/>
        </Fab>
      )}

      {!hideIcons && (
        <>
        {profile.whatsapp_link && (
          <a
          href={profile.whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Fab
            color="success"
            aria-label="whatsapp"
            sx={{ borderRadius: 2 ,width:40, height:40}}
          >
            <WhatsAppIcon fontSize="small"  sx={{width:30 ,height:30}}/>
          </Fab>
        </a>
        )}
        {profile.instagram_link && (
             <a
             href={profile.instagram_link}
             target="_blank"
             rel="noopener noreferrer"
           >
             <Fab
               color="secondary"
               aria-label="instagram"
               sx={{ borderRadius: 2, width: 40, height: 40 }}
             >
               <InstagramIcon fontSize="small" sx={{width:30 ,height:30}}  />
             </Fab>
           </a>
        )}
         <a
           href={profile.facebook_link}
           target="_blank"
           rel="noopener noreferrer"
         >
          {profile.facebook_link && (
            <Fab
            color="primary"
            aria-label="facebook"
            sx={{ borderRadius: 2, width: 40, height: 40 }}
            >
            <FacebookIcon fontSize="small" sx={{width:30 ,height:30}} />
            </Fab>
          )}
          
         </a>
         {profile.youtube_link && (
           <a
           href={profile.youtube_link}
           target="_blank"
           rel="noopener noreferrer"
         >
           <Fab
             color="error"
             aria-label="youtube"
             sx={{ borderRadius: 2, width: 40, height: 40 }}
           >
             <YouTubeIcon fontSize="small" sx={{width:30 ,height:30}} />
           </Fab>
         </a>
         )}
        </>
      )}
    </Box>
          </div>


        </>
      ) : <>
      {showMessage && (
        <div className="text-center p-5">
          <h2 className="text-white">🚫 This album is not visible to the public.</h2>
        </div>
      )}
    </>}
    </div>
  );
}
