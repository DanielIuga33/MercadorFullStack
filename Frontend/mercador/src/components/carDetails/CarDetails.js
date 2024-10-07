import React, { useEffect } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Slider from 'react-slick';
import Lightbox from 'react-image-lightbox';
import './CarDetails.css';
import { useState } from 'react';


const CarDetails = ({carDataId}) => {
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); // Inițializează cu array gol

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cars/${carDataId}`);
        setCar(response.data);
        setCarImages(response.data.images || []); // Asigură-te că este un array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [carDataId]);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (index) => setPhotoIndex(index),
  };

  return (
    <div className="car-image-slider">
      <Slider {...settings}>
        {carImages.map((img, index) => (
          <div key={index} onClick={() => setIsOpen(true)}>
            <img src={`data:image/jpeg;base64,${img}`} alt={`Car ${index + 1}`} style={{ cursor: 'pointer' }} />
          </div>
        ))}
      </Slider>
      {isOpen && (
        <Lightbox
          mainSrc={carImages[photoIndex]}
          nextSrc={carImages[(photoIndex + 1) % carImages.length]}
          prevSrc={carImages[(photoIndex + carImages.length - 1) % carImages.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + carImages.length - 1) % carImages.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % carImages.length)
          }
        />
      )}
    </div>
  );
}

export default CarDetails;
