import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../..';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarDetails.css';


const CarDetails = ({userData, carDataId}) => {
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); // Inițializează cu array gol
  const [loading, setLoading] = useState(true); // Stare pentru loading
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const navigate = useNavigate();
  const [carOwnerId, setCarOwnerId] = useState("");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");
  const [info1, setInfo1] = useState("");
  const [hadMessage, setHadMessage] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/cars/${carDataId}`);
            setCar(response.data);
            setCarImages(response.data.images || []); // Asigură-te că este un array
            let carOwnerId = await axios.get(`${API_URL}/cars/owner/${carDataId}`);
            setCarOwnerId(carOwnerId.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); 
        }
    };

    fetchData();
  },[carDataId]);



  useEffect(() => {
    const runDelayedAction = async() => {
        // Folosește funcția 'delay' pentru a aștepta 3 secunde.
        await delay(3000); 
        
        // După 3 secunde, setează starea.
        setInfo("");
        setInfo1("");
        
    }
    if (info !== "" || info1 !== "") { // Rulează doar dacă 'info' nu este gol
        runDelayedAction();
    }
  },[info, info1])

  const sendMessage = async() =>{
    if (!userData.id){
        setInfo1("You need to login or register first!");
        return;
    } else {
        let ownerId = await axios.get(`${API_URL}/cars/owner/${carDataId}`)
        let conv = {user1: userData.id, user2: ownerId.data}
        try{
            await axios.post(`${API_URL}/conversations/create/`, conv);
            navigate('/account/conversations/');
        } catch (error){
            console.log(error)
        }
    }
  }

  const handleChange = (event) =>{
    setMessage(event.target.value);
  } 

  const sendAMessage = async() =>{
    if (!userData.id){
        setInfo("You need to login or register first!");
        return;
    }
    if (message === ""){
        setInfo("You need to write a message first");
        return;
    }
    setHadMessage(false);
    let ownerId = await axios.get(`${API_URL}/cars/owner/${carDataId}`)
    let conv = {sender: userData.id, receiver: ownerId.data, message: message}
    await axios.post(`${API_URL}/conversations/conversation/message/`, conv);
    setHadMessage(true);
    setMessage("");
    setInfo("Message was sent succesfully")
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
                <h5 
                className='message_status1'
                style={{ 
                    color: '#a51717ff' 
                }}
                >{info1}</h5>
                <span className='title'>
                    <h1 id='title'>{car.title ? car.title : navigate('/')}</h1>
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
                            <img src={`${API_URL}${img}`} alt={`Car ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
                <div className="car-images-slider">
                    <Slider ref={slider2Ref} {...settings2}>
                        {carImages.map((img, index) => (
                            <div className='image' key={index} onClick={() => handleImageClick(index)}>
                                <img src={`${API_URL}${img}`} alt={`Car ${index + 1}`} />
                            </div>
                        ))}
                    </Slider>
                </div>
                <h5>{`${currentSlide+1} / ${carImages.length}`}</h5>
            </div>
            <div className='car-info-box'>
                <div className='spacer'></div>
                <h5 className='message_status' 
                style={{ 
                    color: (!userData.id|| !hadMessage) ? '#ae0808ff' : '#0dc713ff' 
                }}
                >{info}</h5>
                {carOwnerId !== userData.id && 
                <div className='messageBox'>
                    <div className='message'>
                        <label >Write a message</label>
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
