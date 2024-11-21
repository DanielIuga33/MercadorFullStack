import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import axios from 'axios';

const MainPage = ({searchFilters, setCarData}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true); // Stare pentru loading
    const navigate = useNavigate();

    const existSearchFilters = (searchFilters) =>{
        if (searchFilters){
            for (let elem in searchFilters)
                if (searchFilters[elem])
                   return true;
            return false;
        }else return false;
    }


    useEffect(() => {
        const applysearchFilters = (carData) =>{
            if (!existSearchFilters(searchFilters)){
                return carData;
            }
            // let filteredSearchFilters = [];
            // for (let elem in searchFilters)
            //     if (searchFilters[elem])
            //         filteredSearchFilters = [...filteredSearchFilters,{[elem]: searchFilters[elem]}];
            const filteredSearchFilters = Object.entries(searchFilters)
                .filter(([key, value]) => value)
                .map(([key, value]) => ({ [key]: value }));
            for (let elem in filteredSearchFilters){
                if (filteredSearchFilters[elem]["title"]) {
                    const keywords = filteredSearchFilters[elem]["title"].split(" ");
            
                    carData = Object.values(carData).filter((item) =>
                        keywords.every((keyword) => item["title"].includes(keyword))
                    );
                }
                if (filteredSearchFilters[elem]["brand"]){
                    carData = Object.values(carData) 
                        .filter((item) => item["brand"] === filteredSearchFilters[elem]["brand"]);
                }
                if (filteredSearchFilters[elem]["model"]){
                    carData = Object.values(carData) 
                        .filter((item) => item["model"] === filteredSearchFilters[elem]["model"]);
                }
                if (filteredSearchFilters[elem]["body"]){
                    carData = Object.values(carData)
                        .filter((item) => item["body"] === filteredSearchFilters[elem]["body"]);
                }
                if (filteredSearchFilters[elem]["kmStart"]){
                    carData = Object.values(carData) 
                        .filter((item) => Number(item["mileage"]) >= Number(filteredSearchFilters[elem]["kmStart"]));
                }
                if (filteredSearchFilters[elem]["kmEnd"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["mileage"]) <= Number(filteredSearchFilters[elem]["kmEnd"]));
                }
                if (filteredSearchFilters[elem]["yearStart"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["year"]) >= Number(filteredSearchFilters[elem]["yearStart"]));
                }
                if (filteredSearchFilters[elem]["yearEnd"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["year"]) <= Number(filteredSearchFilters[elem]["yearEnd"]));
                }
                if (filteredSearchFilters[elem]["priceStart"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["price"]) >= Number(filteredSearchFilters[elem]["priceStart"]));
                }
                if (filteredSearchFilters[elem]["priceEnd"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["price"]) <= Number(filteredSearchFilters[elem]["priceEnd"]));
                }
                if (filteredSearchFilters[elem]["cm3Start"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["cm3"]) >= Number(filteredSearchFilters[elem]["cm3Start"]));
                }
                if (filteredSearchFilters[elem]["cm3End"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["cm3"]) <= Number(filteredSearchFilters[elem]["cm3End"]));
                }
                if (filteredSearchFilters[elem]["hpStart"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["hp"]) >= Number(filteredSearchFilters[elem]["hpStart"]));
                }
                if (filteredSearchFilters[elem]["hpEnd"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["hp"]) <= Number(filteredSearchFilters[elem]["hpEnd"]));
                }
                if (filteredSearchFilters[elem]["fuelType"]){
                    carData = Object.values(carData)
                        .filter((item) => item["fuelType"] === filteredSearchFilters[elem]["fuelType"]);
                }
                if (filteredSearchFilters[elem]["transmission"]){
                    carData = Object.values(carData)
                        .filter((item) => item["transmission"] === filteredSearchFilters[elem]["transmission"]);
                }
                if (filteredSearchFilters[elem]["color"]){
                    carData = Object.values(carData)
                        .filter((item) => item["color"] === filteredSearchFilters[elem]["color"]);
                }
                if (filteredSearchFilters[elem]["condition"]){
                    carData = Object.values(carData)
                        .filter((item) => item["condition"] === filteredSearchFilters[elem]["condition"]);
                }
                if (filteredSearchFilters[elem]["steeringwheel"]){
                    carData = Object.values(carData)
                        .filter((item) => item["steeringwheel"] === filteredSearchFilters[elem]["steeringwheel"]);
                }
                if (filteredSearchFilters[elem]["numberOfDoors"]){
                    carData = Object.values(carData)
                        .filter((item) => Number(item["numberOfDoors"]) === Number(filteredSearchFilters[elem]["numberOfDoors"]));
                }
                if (filteredSearchFilters[elem]["sort"]){
                    if (filteredSearchFilters[elem]["sort"] === "YearDescending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.year) - Number(a.year));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "YearAsscending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.year) - Number(b.year));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "PriceDescending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.price) - Number(a.price));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "PriceAscending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.price) - Number(b.price));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "MileageDescending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.mileage) - Number(a.mileage));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "MileageAscending"){
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.mileage) - Number(b.mileage));
                    }
                }
            }
            return carData;
        }


        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cars');
                if (response.data && Array.isArray(response.data)) {
                    setCars(applysearchFilters(response.data));
                } else {
                    console.error('Response data is not an array or is null:', response.data);
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchFilters]);

    if (loading) {
        return (
            <div className="loader"></div>
        );
    }

    const accesCar = (e) => {
        const carId = e.currentTarget.id;
        const carDetails = cars.find(car => car.id === carId);
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
                                src={`http://localhost:8080/api${car.image}`}
                                alt={`Car ${car.title}`}
                                loading="lazy"
                            />
                        )}
                        <div className="item">
                            <h4>{car.title}</h4>
                            <h3>{car.price} {car.currency}</h3>
                            <p>{car.registrationDate}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className='noCars'>
                <p>No cars available.</p>
                </div>
            )}
        </div>
    );
}

export default MainPage;
