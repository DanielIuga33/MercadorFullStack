import React from 'react';
import {useState, useEffect} from 'react';
import './MainPage.css';
import axios from 'axios';

const MainPage = () => {
    
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cars');
                if (response.data) {
                    setCars(response.data);
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };
    
        fetchData(); // Apelează funcția async
    }, []);


    return (
        <div className="grid-container">
        {cars.map((car) =>(
            <div class="item">
                <h3>{car.model}</h3>
                <p>{car.price}</p>
            </div>
        ))}
        </div>
    )
}

export default MainPage