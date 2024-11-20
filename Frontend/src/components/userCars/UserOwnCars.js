import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserOwnCars.css';

const UserOwnCars = ({userData}) => {
  
  const carIds = userData.carIds;
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  useEffect(() => {
    const getCarData = async () => {
        try {
            const tempCars = [];
            for (let elem of carIds) {
                const response = await axios.get(`http://localhost:8080/api/cars/dto/${elem}`);
                if (response.data !== null) {
                    tempCars.push(response.data);
                }
            }
            setCars(tempCars);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setLoading(false);
        }
        };

        getCarData();
    }, [carIds]);


    return (
    <div className='ownCars'>
        <div className='container'>
            {!loading ? (
            <div className='container-principal'>
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div 
                            key={car.id}
                            id={car.id} 
                            className='car-card' 
                            onClick={() => console.log("Auch")}
                        >
                            {car.image && (
                                <img
                                    src={`http://localhost:8080/api${car.image}`}
                                    alt={`Car ${car.title}`}
                                    loading="lazy"
                                />
                            )}
                            <div className="item">
                                <h3>{car.title}</h3>
                                <strong>{car.price} {car.currency}</strong>
                            </div>
                            <div className='buttons'>
                                <button id="view">View/Modify</button>
                                <button id="delete">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='noCars'>
                    <p>No cars available.</p>
                    </div>
                )}
            </div>) : <div className="loader"></div>}
        </div>
    </div>
  )
}

export default UserOwnCars