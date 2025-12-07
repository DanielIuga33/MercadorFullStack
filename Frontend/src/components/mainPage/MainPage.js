import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardContent, CardMedia, Typography, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; 
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
            if (!existSearchFilters(searchFilters)) return carData;

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
                if (filteredSearchFilters[elem]["brand"]) carData = Object.values(carData).filter((item) => item["brand"] === filteredSearchFilters[elem]["brand"]);
                if (filteredSearchFilters[elem]["model"]) carData = Object.values(carData).filter((item) => item["model"] === filteredSearchFilters[elem]["model"]);
                if (filteredSearchFilters[elem]["body"]) carData = Object.values(carData).filter((item) => item["body"] === filteredSearchFilters[elem]["body"]);
                if (filteredSearchFilters[elem]["yearStart"]) carData = Object.values(carData).filter((item) => Number(item["year"]) >= Number(filteredSearchFilters[elem]["yearStart"]));
                if (filteredSearchFilters[elem]["yearEnd"]) carData = Object.values(carData).filter((item) => Number(item["year"]) <= Number(filteredSearchFilters[elem]["yearEnd"]));
                if (filteredSearchFilters[elem]["priceStart"]) carData = Object.values(carData).filter((item) => Number(item["price"]) >= Number(filteredSearchFilters[elem]["priceStart"]));
                if (filteredSearchFilters[elem]["priceEnd"]) carData = Object.values(carData).filter((item) => Number(item["price"]) <= Number(filteredSearchFilters[elem]["priceEnd"]));
                if (filteredSearchFilters[elem]["cm3Start"]) carData = Object.values(carData).filter((item) => Number(item["cm3"]) >= Number(filteredSearchFilters[elem]["cm3Start"]));
                if (filteredSearchFilters[elem]["cm3End"]) carData = Object.values(carData).filter((item) => Number(item["cm3"]) <= Number(filteredSearchFilters[elem]["cm3End"]));
                if (filteredSearchFilters[elem]["hpStart"]) carData = Object.values(carData).filter((item) => Number(item["hp"]) >= Number(filteredSearchFilters[elem]["hpStart"]));
                if (filteredSearchFilters[elem]["hpEnd"]) carData = Object.values(carData).filter((item) => Number(item["hp"]) <= Number(filteredSearchFilters[elem]["hpEnd"]));
                if (filteredSearchFilters[elem]["fuelType"]) carData = Object.values(carData).filter((item) => item["fuelType"] === filteredSearchFilters[elem]["fuelType"]);
                if (filteredSearchFilters[elem]["transmission"]) carData = Object.values(carData).filter((item) => item["transmission"] === filteredSearchFilters[elem]["transmission"]);
                if (filteredSearchFilters[elem]["color"]) carData = Object.values(carData).filter((item) => item["color"] === filteredSearchFilters[elem]["color"]);
                if (filteredSearchFilters[elem]["condition"]) carData = Object.values(carData).filter((item) => item["condition"] === filteredSearchFilters[elem]["condition"]);
                if (filteredSearchFilters[elem]["steeringwheel"]) carData = Object.values(carData).filter((item) => item["steeringwheel"] === filteredSearchFilters[elem]["steeringwheel"]);
                if (filteredSearchFilters[elem]["numberOfDoors"]) carData = Object.values(carData).filter((item) => Number(item["numberOfDoors"]) === Number(filteredSearchFilters[elem]["numberOfDoors"]));
                
                if (filteredSearchFilters[elem]["sort"]) {
                    if (filteredSearchFilters[elem]["sort"] === "YearDescending") carData = Object.values(carData).sort((a, b) => Number(b.year) - Number(a.year));
                    if (filteredSearchFilters[elem]["sort"] === "YearAsscending") carData = Object.values(carData).sort((a, b) => Number(a.year) - Number(b.year));
                    if (filteredSearchFilters[elem]["sort"] === "PriceDescending") carData = Object.values(carData).sort((a, b) => Number(b.price) - Number(a.price));
                    if (filteredSearchFilters[elem]["sort"] === "PriceAscending") carData = Object.values(carData).sort((a, b) => Number(a.price) - Number(b.price));
                    if (filteredSearchFilters[elem]["sort"] === "MileageDescending") carData = Object.values(carData).sort((a, b) => Number(b.mileage) - Number(a.mileage));
                    if (filteredSearchFilters[elem]["sort"] === "MileageAscending") carData = Object.values(carData).sort((a, b) => Number(a.mileage) - Number(b.mileage));
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

    const accesCar = (carId) => {
        const carDetails = cars.find(car => car.id === carId);
        if (carDetails) {
            setCarData(carDetails);
            navigate("/carDetails");
        }
    };

    return (
        <Box 
            sx={{
                height: 'calc(100vh - 70px)', 
                width: '100%',
                overflowY: 'auto', 
                overflowX: 'hidden',
                bgcolor: "hsl(0, 0%, 11%)", 
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
            }}
        >
            <Grid 
                container 
                spacing={2} 
                sx={{
                    padding: { xs: "10px", md: "20px 2%" }, // Padding mai mic pe margine
                    justifyContent: 'flex-start', // Important: Aliniere la stânga
                    margin: 0,
                    width: '100%'
                }}
            >
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <Grid 
                            item 
                            // AICI E SECRETUL PENTRU PC:
                            xs={12}     // Mobil: 1 pe rând
                            sm={6}      // Tableta mică: 2 pe rând
                            md={4}      // Tabletă mare: 3 pe rând
                            lg={3}      // Laptop: 4 pe rând
                            xl={2.4}    // PC Mare: 5 pe rând (folosind 2.4 unități din 12)
                            key={car.id} 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                minWidth: '280px' // Asigură că nu devin prea mici
                            }}
                        >
                            <Card 
                                onClick={() => accesCar(car.id)} 
                                sx={{
                                    cursor: 'pointer',
                                    width: '100%', 
                                    // LIMITA MAXIMĂ - Astfel cardul nu se mai lăbărțează pe PC
                                    maxWidth: '300px', 
                                    backgroundColor: 'rgb(35, 37, 40)', 
                                    borderRadius: '4px',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                    "&:hover": {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 8px 15px rgba(0,0,0,0.5)'
                                    }
                                }}
                            >
                                {/* Zona de imagine */}
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    {car.image ? (
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: '100%',
                                                // Înălțime fixă mai mică = Rezoluție percepută mai bună
                                                maxHeight: '180px',
                                                minHeight: '100px',
                                                height: 'auto', 
                                                objectFit: 'cover' 
                                            }}
                                            // Încărcăm originalul
                                            image={`${API_URL}${car.image}`} 
                                            alt={car.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Box sx={{
                                            width: '100%', 
                                            height: '180px',
                                            bgcolor: '#2a2a2a', 
                                            display:'flex', 
                                            alignItems:'center', 
                                            justifyContent:'center'
                                        }}>
                                            <Typography variant="caption" color="gray">No Image</Typography>
                                        </Box>
                                    )}
                                    
                                    {car.negotiable && (
                                        <Box sx={{
                                            position: 'absolute', 
                                            bottom: '5px', 
                                            left: '5px', 
                                            bgcolor: 'rgba(0,0,0,0.8)', 
                                            color: '#4caf50', 
                                            fontSize: '10px', 
                                            padding: '2px 6px', 
                                            borderRadius: '3px',
                                            fontWeight: 'bold',
                                            border: '1px solid #4caf50'
                                        }}>
                                            Negotiable
                                        </Box>
                                    )}
                                </Box>

                                <CardContent 
                                    sx={{ 
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '10px 12px',
                                        "&:last-child": { paddingBottom: '12px' }
                                    }}
                                >
                                    {/* Titlu */}
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            lineHeight: 1.25,
                                            height: '2.5em', 
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            marginBottom: '6px'
                                        }}
                                    >
                                        {car.title}
                                    </Typography>

                                    {/* Detalii tehnice */}
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#bbb', 
                                            fontSize: '12px',
                                            marginBottom: '10px',
                                            display: 'block'
                                        }}
                                    >
                                        {car.year} • {car.fuelType ? car.fuelType.toLowerCase() : '-'} • {car.mileage} km
                                    </Typography>
                                    
                                    <Box sx={{ flexGrow: 1 }} />

                                    {/* Preț */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontSize: '17px',
                                                fontWeight: 'bold',
                                                color: '#fff'
                                            }}
                                        >
                                            {car.price} {car.currency}
                                        </Typography>
                                        <FavoriteBorderIcon sx={{ color: '#666', fontSize: '20px', transition: '0.2s', "&:hover": { color: '#ff4081' } }} />
                                    </Box>

                                    {/* Locație */}
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#888', 
                                            fontSize: '11px', 
                                            marginTop: '6px',
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