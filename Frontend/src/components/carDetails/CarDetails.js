import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarDetails.css';


const CarDetails = ({userData, carDataId}) => {
  const API_URL = "http://localhost:8080/api/conversations/message";
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); // Inițializează cu array gol
  const [loading, setLoading] = useState(true); // Stare pentru loading
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const navigate = useNavigate();
  const [carOwnerId, setCarOwnerId] = useState("");
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cars/${carDataId}`);
            setCar(response.data);
            setCarImages(response.data.images || []); // Asigură-te că este un array
            let carOwnerId = await axios.get(`http://localhost:8080/api/cars/owner/${carDataId}`);
            setCarOwnerId(carOwnerId.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); 
        }
    };

    fetchData();
  },[carDataId]);

  const sendMessage = async() =>{
    if (!userData.id){
        window.alert("You need to login or register first!");
        return;
    } else {
        let ownerId = await axios.get(`http://localhost:8080/api/cars/owner/${carDataId}`)
        let message = {user1: userData.id, user2: ownerId.data}
        await axios.post(API_URL, message);
        navigate('/account/conversations/')
    }
  }

  const handleChange = (event) =>{
    setMessage(event.target.value);
  } 

  const sendAMessage = async() =>{
    if (!userData.id){
        window.alert("You need to login or register first!");
        return;
    }
    if (message === ""){
        window.alert("You need to write a message first");
        return;
    }
    let ownerId = await axios.get(`http://localhost:8080/api/cars/owner/${carDataId}`)
    let conv = {sender: userData.id, receiver: ownerId.data, message: message}
    await axios.post(`http://localhost:8080/api/conversations/conversation/message/`, conv);
    setMessage("");
    window.alert("Message was sent succesfully")
  }


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
            <div className="car-image-slider">
                <span className='title'>
                    <h1 id='title'>{car.title}</h1>
                    <h1 id='price'>{car.price} {car.currency}</h1>
                    {carOwnerId !== userData.id &&
                    <div className='chatWithOwner'>
                        <button onClick={sendMessage}>Message</button>
                    </div>
                    }
                </span>
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
                {carOwnerId !== userData.id &&
                <div className='messageBox'>
                    <div className='message'>
                        <label for="message">Write a message</label>
                        <input type='text' value={message} onChange={handleChange} ></input>
                        <button id="sendButton" onClick={sendAMessage}>Send</button>
                    </div>
                </div>
                }
                <div className='row'>
                    <h4>Price</h4>
                    <div className='bar'></div>
                    {car.currency !== "€" && 
                    <label><span className="align-right"><h4>{car.price} {car.currency} </h4></span><h4>{car.price * 5 } RON</h4></label>}
                </div>
                <div className='row'>
                    <h4>Tehnical Data</h4>
                    <div className='bar'></div>
                    <label><span className="align-right"><strong>Brand: </strong></span>{car.brand}</label>
                    <label><span className="align-right"><strong>Model: </strong></span>{car.model}</label>
                    <label><span className="align-right"><strong>Condition: </strong></span>{car.condition}</label>
                    <label><span className="align-right"><strong>Category: </strong></span>{car.body}</label>
                    {car.vin &&  <label><span className="align-right"><strong>VIN: </strong></span>{car.vin}</label>}
                    <label><span className="align-right"><strong>First registartion: </strong></span>{car.year}</label>
                    <label><span className="align-right"><strong>Gearbox: </strong></span>Transmission {car.transmission}</label>
                    <label><span className="align-right"><strong>Drive Type: </strong></span>{car.fuelType}</label>
                    <label><span className="align-right"><strong>Mileage: </strong></span>{car.mileage} km</label>
                    <label><span className="align-right"><strong>Power: </strong></span>{Math.floor(car.hp * 0.74)}kW({car.hp} hp)</label>
                    <label><span className="align-right"><strong>Engine capacity: </strong></span>{car.cm3} cm³</label>
                    <label><span className="align-right"><strong>Color: </strong></span>{car.color}</label>
                    <label><span className="align-right"><strong>Door Count: </strong></span>{car.numberOfDoors}</label>
                </div>
                <div className="row">
                    <h4>Description</h4>
                    <div className='bar'></div>
                    <p className='description'>{car.description}</p>
                </div>
            </div>
       </div>
    </div>
  );
}

export default CarDetails;
