import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardContent, CardMedia, Typography, CircularProgress} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Opțional: inimioară stil OLX
import axios from 'axios';
import API_URL from '../..';

const MainPage = ({ searchFilters, setCarData }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function normalizeText(text) {
        return text.toLowerCase().replace(/[^a-z0-9ăâîșț ]/gi, '').replace(/\s+/g, ' ').trim();
    }

    const existSearchFilters = (searchFilters) => {
        if (searchFilters) {
            for (let elem in searchFilters)
                if (searchFilters[elem]) return true;
            return false;
        } else return false;
    };

    useEffect(() => {
        const applysearchFilters = (carData) => {
            if (!existSearchFilters(searchFilters)) {
                return carData;
            }

            const filteredSearchFilters = Object.entries(searchFilters)
                .filter(([key, value]) => value)
                .map(([key, value]) => ({ [key]: value }));

            for (let elem in filteredSearchFilters) {
                if (filteredSearchFilters[elem]["title"]) {
                    const keywords = normalizeText(filteredSearchFilters[elem]["title"]).split(" ");
                    carData = Object.values(carData).filter((item) => {
                    const title = normalizeText(item["title"]);
                    return keywords.every((keyword) => title.includes(keyword));
                });
}
                if (filteredSearchFilters[elem]["brand"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["brand"] === filteredSearchFilters[elem]["brand"]);
                }
                if (filteredSearchFilters[elem]["model"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["model"] === filteredSearchFilters[elem]["model"]);
                }
                if (filteredSearchFilters[elem]["body"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["body"] === filteredSearchFilters[elem]["body"]);
                }
                if (filteredSearchFilters[elem]["kmStart"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["mileage"]) >= Number(filteredSearchFilters[elem]["kmStart"]));
                }
                if (filteredSearchFilters[elem]["kmEnd"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["mileage"]) <= Number(filteredSearchFilters[elem]["kmEnd"]));
                }
                if (filteredSearchFilters[elem]["yearStart"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["year"]) >= Number(filteredSearchFilters[elem]["yearStart"]));
                }
                if (filteredSearchFilters[elem]["yearEnd"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["year"]) <= Number(filteredSearchFilters[elem]["yearEnd"]));
                }
                if (filteredSearchFilters[elem]["priceStart"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["price"]) >= Number(filteredSearchFilters[elem]["priceStart"]));
                }
                if (filteredSearchFilters[elem]["priceEnd"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["price"]) <= Number(filteredSearchFilters[elem]["priceEnd"]));
                }
                if (filteredSearchFilters[elem]["cm3Start"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["cm3"]) >= Number(filteredSearchFilters[elem]["cm3Start"]));
                }
                if (filteredSearchFilters[elem]["cm3End"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["cm3"]) <= Number(filteredSearchFilters[elem]["cm3End"]));
                }
                if (filteredSearchFilters[elem]["hpStart"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["hp"]) >= Number(filteredSearchFilters[elem]["hpStart"]));
                }
                if (filteredSearchFilters[elem]["hpEnd"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["hp"]) <= Number(filteredSearchFilters[elem]["hpEnd"]));
                }
                if (filteredSearchFilters[elem]["fuelType"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["fuelType"] === filteredSearchFilters[elem]["fuelType"]);
                }
                if (filteredSearchFilters[elem]["transmission"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["transmission"] === filteredSearchFilters[elem]["transmission"]);
                }
                if (filteredSearchFilters[elem]["color"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["color"] === filteredSearchFilters[elem]["color"]);
                }
                if (filteredSearchFilters[elem]["condition"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["condition"] === filteredSearchFilters[elem]["condition"]);
                }
                if (filteredSearchFilters[elem]["steeringwheel"]) {
                    carData = Object.values(carData)
                        .filter((item) => item["steeringwheel"] === filteredSearchFilters[elem]["steeringwheel"]);
                }
                if (filteredSearchFilters[elem]["numberOfDoors"]) {
                    carData = Object.values(carData)
                        .filter((item) => Number(item["numberOfDoors"]) === Number(filteredSearchFilters[elem]["numberOfDoors"]));
                }
                if (filteredSearchFilters[elem]["sort"]) {
                    if (filteredSearchFilters[elem]["sort"] === "YearDescending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.year) - Number(a.year));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "YearAsscending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.year) - Number(b.year));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "PriceDescending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.price) - Number(a.price));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "PriceAscending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.price) - Number(b.price));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "MileageDescending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(b.mileage) - Number(a.mileage));
                    }
                    if (filteredSearchFilters[elem]["sort"] === "MileageAscending") {
                        carData = Object.values(carData)
                            .sort((a, b) => Number(a.mileage) - Number(b.mileage));
                    }
                }
            }
            return carData;
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/cars`);
                if (response.data && Array.isArray(response.data)) {
                    setCars(applysearchFilters(response.data));
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: "hsl(0, 0%, 11%)" }}>
                <CircularProgress color="inherit" sx={{color: 'white'}} />
            </Box>
        );
    }

    const increaseView = async(carId) => {
        await axios.patch(`${API_URL}/cars/increaseView/${carId}`);
    }

    const accesCar = (carId) => {
        try{
            const carDetails = cars.find(car => car.id === carId);
            if (carDetails) {
                setCarData(carDetails);
                navigate("/carDetails");
                increaseView(carId);
            }
        } catch(exception){
            console.log(exception);
        }
    };

    return (
        <Box 
            sx={{
                height: 'calc(100vh - 70px)', 
                width: '100%',
                overflowY: 'auto', 
                overflowX: 'hidden',
                bgcolor: "hsl(0, 0%, 11%)", // Background general
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
            }}
        >
            <Grid 
                container 
                // Gap mai mic (OLX style)
                spacing={2} 
                sx={{
                    padding: { xs: "10px", md: "20px 5%" },
                    justifyContent: 'flex-start',
                    margin: 0,
                    width: '100%'
                }}
            >
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <Grid 
                            item 
                            xs={6} sm={4} md={3} lg={2.4} // 5 pe rând pe ecrane mari (stil OLX)
                            key={car.id} 
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Card 
                                onClick={() => accesCar(car.id)} 
                                sx={{
                                    cursor: 'pointer',
                                    width: '100%', 
                                    // Stil Card OLX: background închis, bordură subtilă sau deloc, colțuri rotunjite
                                    backgroundColor: 'rgb(35, 37, 40)', 
                                    borderRadius: '4px',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    "&:hover": {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }
                                }}
                            >
                                {/* Zona de imagine */}
                                <Box sx={{ position: 'relative' }}>
                                    {car.image ? (
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: '100%',
                                                height: { xs: '130px', md: '160px' }, // Fix height
                                                objectFit: 'cover' 
                                            }}
                                            image={`${API_URL}${car.image}?w=400`}
                                            alt={car.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Box sx={{height: { xs: '130px', md: '160px' }, bgcolor: '#333', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            <Typography variant="caption" color="gray">No Image</Typography>
                                        </Box>
                                    )}
                                    
                                    {/* Opțional: Badge "Negotiable" pe poză */}
                                    {car.negotiable && (
                                        <Box sx={{
                                            position: 'absolute', 
                                            bottom: '5px', 
                                            left: '5px', 
                                            bgcolor: 'rgba(0,0,0,0.7)', 
                                            color: 'white', 
                                            fontSize: '10px', 
                                            padding: '2px 5px', 
                                            borderRadius: '3px'
                                        }}>
                                            Negotiable
                                        </Box>
                                    )}
                                </Box>

                                {/* Conținutul Cardului */}
                                <CardContent 
                                    sx={{ 
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: { xs: '10px', md: '12px' },
                                        "&:last-child": { paddingBottom: { xs: '10px', md: '12px' } }
                                    }}
                                >
                                    {/* Titlu */}
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: '#fff',
                                            fontSize: { xs: '14px', md: '16px' },
                                            fontWeight: 400,
                                            lineHeight: 1.2,
                                            height: '2.4em', // Fix height for 2 lines
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            marginBottom: '5px'
                                        }}
                                    >
                                        {car.title}
                                    </Typography>

                                    {/* Detalii tehnice scurte (An - Fuel - Km) */}
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#b0b0b0', 
                                            fontSize: '11px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        {car.year} • {car.fuelType ? car.fuelType.toLowerCase() : ''} • {car.mileage} km
                                    </Typography>
                                    
                                    {/* Spacer pentru a împinge prețul jos */}
                                    <Box sx={{ flexGrow: 1 }} />

                                    {/* Preț și Inimioară */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontSize: { xs: '16px', md: '18px' },
                                                fontWeight: 'bold',
                                                color: '#fff'
                                            }}
                                        >
                                            {car.price} {car.currency}
                                        </Typography>
                                        {/* Iconiță decorativă */}
                                        <FavoriteBorderIcon sx={{ color: 'gray', fontSize: '18px' }} />
                                    </Box>

                                    {/* Locație și dată (Footer) */}
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#7f7f7f', 
                                            fontSize: '10px', 
                                            marginTop: '5px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {car.city ? car.city : "Romania"} {car.county ? `, ${car.county}` : ""}
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" color="textSecondary">No cars available.</Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default MainPage;