import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarDetails.css';


const CarDetails = ({carDataId}) => {
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); // Inițializează cu array gol
  const [loading, setLoading] = useState(true); // Stare pentru loading
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

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

  const settings1 = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (oldIndex, newIndex) => {
        setCurrentSlide(newIndex);
        // Schimbăm și slider-ul 2 când se schimbă slider-ul 1
        if (slider2Ref.current) {
          slider2Ref.current.slickGoTo(newIndex);
        }
      },
  };

  const settings2 = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };
  const handleImageClick = (index) => {
    if (slider1Ref.current && slider2Ref.current) {
      slider1Ref.current.slickGoTo(index); // Schimbă slide-ul la slider-ul mare
      slider2Ref.current.slickGoTo(index); // Schimbă slide-ul la slider-ul mic
    }
  };


  return (
    <div className='car-details'>
        <div className='content'>
            <span className='title'>
                <h1>{car.title}</h1>
            </span>
            <div className="car-image-slider">
                <Slider ref={slider1Ref} {...settings1}>
                    {carImages.map((img, index) => (
                        <div className='image' key={index} onClick={() => handleImageClick(index)}>
                            <img src={`http://localhost:8080/api${img}`} alt={`Car ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
                <div className="car-images-slider">
                    <Slider ref={slider2Ref} {...settings2}>
                        {carImages.map((img, index) => (
                            <div className='image' key={index} onClick={() => handleImageClick(index)}>
                                <img src={`http://localhost:8080/api${img}`} alt={`Car ${index + 1}`} />
                            </div>
                        ))}
                    </Slider>
                </div>
                <h5>{`${currentSlide+1} / ${carImages.length}`}</h5>
            </div>
            <div className='car-info-box'>
                <div className='spacer'></div>
                <div className='row'>
                    <h4>Price</h4>
                    <div className='bar'></div>
                    {car.currency !== "€" && 
                    <label><span className="align-right"><h4>{car.price} {car.currency} </h4></span><h4>{car.price * 5 } RON</h4></label>}
                </div>
                <div className='row'>
                    <h4>Tehnical Data</h4>
                    <div className='bar'></div>
                    <label><span className="align-right"><strong>Condition: </strong></span>{car.condition}</label>
                    <label><span className="align-right"><strong>Body type: </strong></span>{car.body}</label>
                    <label><span className="align-right"><strong>First registartion: </strong></span>{car.year}</label>
                    <label><span className="align-right"><strong>Gearbox: </strong></span>Transmission {car.transmission}</label>
                    <label><span className="align-right"><strong>Fuel: </strong></span>{car.fuelType}</label>
                    <label><span className="align-right"><strong>Mileage: </strong></span>{car.mileage} km</label>
                </div>
                <div className='row'>
                </div>
            </div>
       </div>
    </div>
  );
}

export default CarDetails;
