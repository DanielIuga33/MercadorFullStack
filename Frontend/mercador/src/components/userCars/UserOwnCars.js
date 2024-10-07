import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';

const UserOwnCars = ({userData}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="car-image-slider">
      <Slider {...settings}>
        {carImages.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Car ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default UserOwnCars