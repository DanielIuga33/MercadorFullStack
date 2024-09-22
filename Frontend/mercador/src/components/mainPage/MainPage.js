import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';

const MainPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true); // Stare pentru loading

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cars');
                console.log('Response from API:', response.data); // Log pentru debugging

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

    return (
        <div className="grid-container">
            {cars.length > 0 ? (
                cars.map((car) => (
                    <div key={car.id} className='car-card'>
                        {car.images && car.images.length > 0 && (
                            <img
                                src={`data:image/jpeg;base64,${car.images[0]}`} // Folosim primul URL de imagine
                                alt={`Car ${car.title}`} // Adăugăm un alt text descriptiv
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
