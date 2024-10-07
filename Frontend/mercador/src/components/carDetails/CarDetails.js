import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarDetails.css';


const CarDetails = ({carDataId}) => {
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); // Inițializează cu array gol
  const [loading, setLoading] = useState(true); // Stare pentru loading

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cars/${carDataId}`);
            setCar(response.data);
            setCarImages(response.data.images || []); // Asigură-te că este un array
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); 
        }
    };

    fetchData();
  },[carDataId]);

  if (loading) {
    return (
        <div className='bg'>
            <div className="loader"></div>
        </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className='car-details'>
        <div className='content'>
            <span className='title'>
                <h1>{car.title}</h1>
            </span>
            <div className="car-image-slider">
                <Slider {...settings}>
                    {carImages.map((img, index) => (
                        <div className='image' key={index}>
                            <img src={`http://localhost:8080/api${img}`} alt={`Car ${index + 1}`} style={{ cursor: 'pointer' }} />
                        </div>
                    ))}
                </Slider>
            </div>
            <div className='car-info-box'>
                <div className='col'>
                    <label><em>An fabricatie: </em><p>{car.year}</p></label>
                </div>
                <div className='col'>
                  <label><em>An fabricatie: </em><p>{car.year}</p></label>
                </div>
                <div className='col'>
                  
                </div>
            </div>
       </div>
    </div>
  );
}

export default CarDetails;
