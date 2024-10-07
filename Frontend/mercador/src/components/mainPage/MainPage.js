import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import axios from 'axios';

const MainPage = ({setCarData}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true); // Stare pentru loading
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cars');
                // Verificăm dacă response.data există și este un array
                if (response.data && Array.isArray(response.data)) {
                    setCars(response.data);
                } else {
                    console.error('Response data is not an array or is null:', response.data);
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false); // Setăm loading la false
            }
        };

        fetchData(); // Apelează funcția async
    }, []);

    // Afișăm un spinner de loading până când datele sunt încărcate
    if (loading) {
        return (
            <div className="loader"></div> // Afișăm spinner-ul
        );
    }

    const accesCar = (e) => {
        const carId = e.currentTarget.id;
        
        // Găsește mașina în listă după id
        const carDetails = cars.find(car => car.id === carId); // Folosește ID-ul ca string
        console.log(carDetails);
        if (carDetails) {
            setCarData(carDetails);
            navigate("/carDetails");
        } else {
            console.error('Car not found for the given ID');
        }
    };
    

    return (
        <div className="grid-container">
            {cars.length > 0 ? (
                cars.map((car) => (
                    <div 
                        key={car.id}
                        id={car.id} 
                        className='car-card' 
                        onClick={accesCar}
                    >
                        {car.image && (
                            <img
                                src={`http://localhost:8080/api${car.image}`} // Folosim primul URL de imagine
                                alt={`Car ${car.title}`} // Adăugăm un alt text descriptiv
                                loading="lazy"
                            />
                        )}
                        <div className="item">
                            <h3>{car.title}</h3>
                            <strong>{car.price} {car.currency}</strong>
                        </div>
                    </div>
                ))
            ) : (
                <p>No cars available.</p> // Mesaj dacă nu sunt mașini
            )}
        </div>
    );
}

export default MainPage;
