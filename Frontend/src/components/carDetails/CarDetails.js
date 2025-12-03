import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../..';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarDetails.css';

// --- IMPORTURI NOI PENTRU ICONIȚE ---
import { 
    CalendarToday, Speed, Settings, LocalGasStation, 
    Palette, Engineering, VpnKey, Share, LocationOn // Am adaugat LocationOn
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const CarDetails = ({userData, carDataId}) => {
  const [car, setCar] = useState({});
  const [carImages, setCarImages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const navigate = useNavigate();
  const [carOwnerId, setCarOwnerId] = useState("");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");
  const [info1, setInfo1] = useState("");
  const [hadMessage, setHadMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/cars/${carDataId}`);
            setCar(response.data);
            setCarImages(response.data.images || []); 
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

  // Cleanup timer
  useEffect(() => {
    let timer;
    if (info !== "" || info1 !== "") { 
        timer = setTimeout(() => {
            setInfo("");
            setInfo1("");
        }, 3000);
    }
    return () => clearTimeout(timer);
  },[info, info1]);

  const copyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setInfo("Link copied to clipboard! 📋");
  };

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
    focusOnSelect: true,
  };
  
  const handleImageClick = (index) => {
    if (slider1Ref.current && slider2Ref.current) {
      slider1Ref.current.slickGoTo(index); 
      slider2Ref.current.slickGoTo(index); 
    }
  };

  // Helper styles
  const gridRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333'};
  const iconStyle = { fontSize: '1.1rem', marginRight: '8px', color: '#888', verticalAlign: 'middle' };

  return (
    <div className='car-details'>
        <div className='content'>
            <div className="car-image-slider">
                <h5 className='message_status1' style={{ color: '#a51717ff' }}>{info1}</h5>
                
                {/* --- SECȚIUNEA TITLU & PREȚ REVIZUITĂ --- */}
                <span className='title'>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{width: '100%'}}>
                            {/* Titlu Mare */}
                            <h1 id='title' style={{margin: 0, fontSize: '2rem', lineHeight: '1.2'}}>{car.title ? car.title : navigate('/')}</h1>
                            
                            {/* Rândul cu Preț și Badge-uri (Exchange/Negotiable) */}
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '10px'}}>
                                {/* Prețul */}
                                <h1 style={{margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: '#fff'}}>
                                    {car.price} {car.currency} 
                                </h1>

                                {/* Badge-uri lângă preț */}
                                <div style={{display: 'flex', gap: '8px'}}>
                                    {car.negotiable && 
                                        <span style={{
                                            border: '1px solid #4caf50', 
                                            color: '#4caf50', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            Negotiable
                                        </span>
                                    }
                                    {car.exchange && 
                                        <span style={{
                                            backgroundColor: '#1976d2', // Albastru ca în poză
                                            color: 'white', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                                        }}>
                                            🔄 Accepts Exchange
                                        </span>
                                    }
                                </div>
                            </div>

                            {/* Rândul cu Locația (Sub preț) */}
                            {car.city && 
                                <div style={{display: 'flex', alignItems: 'center', marginTop: '8px', color: '#ccc'}}>
                                    <LocationOn sx={{color: '#d32f2f', fontSize: '1.4rem', marginRight: '4px'}} />
                                    <h3 style={{margin: 0, fontWeight: '400', fontSize: '1.1rem'}}>
                                        {car.city}, {car.county}
                                    </h3>
                                </div>
                            }
                        </div>

                        {/* Buton Share (Dreapta sus) */}
                        <Tooltip title="Copy Link">
                            <IconButton onClick={copyLink} sx={{color: 'white'}}>
                                <Share />
                            </IconButton>
                        </Tooltip>
                    </div>

                    {carOwnerId !== userData.id &&
                    <div className='chatWithOwner' style={{marginTop: '20px'}}>
                        <button onClick={sendMessage}>Message Seller</button>
                    </div>
                    }
                </span>
                {/* --- FINAL SECȚIUNE HEADER --- */}

                <Slider ref={slider1Ref} {...settings1}>
                    {carImages.map((img, index) => (
                        <div className='image' key={index}>
                            <img src={`${API_URL}${img}`} alt={`Car ${index + 1}`} style={{cursor: 'grab'}}/>
                        </div>
                    ))}
                </Slider>
                <div className="car-images-slider">
                    <Slider ref={slider2Ref} {...settings2}>
                        {carImages.map((img, index) => (
                            <div className='image' key={index} onClick={() => handleImageClick(index)}>
                                <img src={`${API_URL}${img}`} alt={`Car ${index + 1}`} style={{cursor: 'pointer'}} />
                            </div>
                        ))}
                    </Slider>
                </div>
                <h5 style={{textAlign: 'right', marginTop: '5px', color: 'gray'}}>{`${currentSlide+1} / ${carImages.length}`}</h5>
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
                        <label >Send a quick message</label>
                        <input type='text' value={message} onChange={handleChange} placeholder="Is this still available?" />
                        <button id="sendButton" onClick={sendAMessage}>Send</button>
                    </div>
                </div>
                }
                
                <div className='row'>
                    <h4>Price Details</h4>
                    <div className='bar'></div>
                    <div style={gridRowStyle}>
                        <span style={{color: '#aaa'}}>Price in RON (approx)</span>
                        <span>{Math.floor(car.price * (car.currency === "€" ? 4.97 : 1))} RON</span>
                    </div>
                    <div style={gridRowStyle}>
                        <span style={{color: '#aaa'}}>Negotiable</span>
                        <span style={{color: car.negotiable ? '#4caf50' : 'white'}}>{car.negotiable ? "Yes" : "No"}</span>
                    </div>
                </div>

                <div className='row'>
                    <h4>Technical Data</h4>
                    <div className='bar'></div>
                    
                    <div style={{
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        columnGap: '20px',
                        rowGap: '5px',
                        marginTop: '10px'
                    }}>
                        {/* Coloana Stânga */}
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}>Brand</span><span>{car.brand}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}>Model</span><span>{car.model}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><CalendarToday sx={iconStyle}/>Year</span><span>{car.year}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><Speed sx={iconStyle}/>Mileage</span><span>{car.mileage} km</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><Engineering sx={iconStyle}/>Power</span><span>{car.hp} CP</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><Settings sx={iconStyle}/>Engine</span><span>{car.cm3} cm³</span></div>
                        </div>

                        {/* Coloana Dreapta */}
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><LocalGasStation sx={iconStyle}/>Fuel</span><span>{car.fuelType}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><Settings sx={iconStyle}/>Transm.</span><span>{car.transmission}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}>Pollution</span><span>{car.pollutionStandard || '-'}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}>Drive</span><span>{car.driveType || '-'}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><Palette sx={iconStyle}/>Color</span><span>{car.color}</span></div>
                            <div style={gridRowStyle}><span style={{color: '#aaa'}}><VpnKey sx={iconStyle}/>Doors</span><span>{car.numberOfDoors}</span></div>
                        </div>
                    </div>
                    
                    <div style={{...gridRowStyle, marginTop: '10px'}}>
                        <span style={{color: '#aaa'}}>VIN</span>
                        <span style={{fontFamily: 'monospace', letterSpacing: '1px'}}>{car.vin || 'N/A'}</span>
                    </div>
                </div>

                {car.features && car.features.length > 0 && (
                    <div className='row'>
                        <h4>Features / Options</h4>
                        <div className='bar'></div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px'}}>
                            {car.features.map((feature, idx) => (
                                <span key={idx} style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    border: '1px solid #444',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{color: '#4caf50', marginRight: '5px', fontWeight: 'bold'}}>✓</span> {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="row">
                    <h4>Description</h4>
                    <div className='bar'></div>
                    <p className='description' style={{whiteSpace: 'pre-line', lineHeight: '1.6'}}>{car.description}</p>
                </div>
                
                <div style={{marginTop: '30px', borderTop: '1px solid #333', paddingTop: '10px', textAlign: 'center', color: '#666', fontSize: '0.8rem'}}>
                   <p>Ad ID: {carDataId} • Views: {car.views || 0} • Posted by UserID: {carOwnerId}</p>
                </div>

            </div>
       </div>
    </div>
  );
}

export default CarDetails;