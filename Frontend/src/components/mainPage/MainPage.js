import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardContent, CardMedia, Typography, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';
import API_URL from '../..';

const MainPage = ({ searchFilters}) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- LOGICA TA ORIGINALĂ DE FILTRARE (NESCHIMBATĂ) ---
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
                // ... (Filtrele tale rămân exact la fel) ...
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
            navigate(`/carDetails/${carId}`);
        }
    };

    return (
        <Box 
            sx={{
                // Păstrăm containerul tău, doar ajustăm puțin scrollbar-ul
                height: 'calc(100vh - 70px)', 
                width: '100%',
                overflowY: 'auto', 
                overflowX: 'hidden',
                bgcolor: "#121212", // Gri puțin mai închis și mai neutru decât HSL-ul original
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "#1e1e1e" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#444", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
            }}
        >
            <Grid 
                container 
                spacing={2} 
                sx={{
                    padding: { xs: "10px", md: "20px 2%" },
                    justifyContent: 'flex-start',
                    margin: 0,
                    width: '100%'
                }}
            >
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <Grid 
                            item 
                            xs={12} sm={6} md={4} lg={3} xl={2.4} 
                            key={car.id} 
                            sx={{ display: 'flex', justifyContent: 'center', minWidth: '280px' }}
                        >
                            <Card 
                                onClick={() => accesCar(car.id)} 
                                sx={{
                                    cursor: 'pointer',
                                    width: '100%', 
                                    maxWidth: '320px',
                                    bgcolor: '#1e1e1e', 
                                    borderRadius: '12px', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    position: 'relative',
                                    "&:hover": {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                                        // Border subtil la hover
                                        outline: '1px solid rgba(255, 77, 77, 0.3)' 
                                    }
                                }}
                            >
                                {/* Zona de imagine */}
                                <Box sx={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                    {car.image ? (
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover' 
                                            }}
                                            image={`${API_URL}${car.image}`} 
                                            alt={car.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Box sx={{ width: '100%', height: '100%', bgcolor: '#2a2a2a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            <Typography variant="caption" color="gray">No Image</Typography>
                                        </Box>
                                    )}
                                    
                                    {/* Etichetă Negotiable (Stilizată mai bine) */}
                                    {car.negotiable && (
                                        <Chip 
                                            label="Neg." 
                                            size="small" 
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                color: '#4caf50',
                                                border: '1px solid #4caf50',
                                                height: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    )}
                                </Box>

                                <CardContent 
                                    sx={{ 
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '16px', // Padding puțin mai mare
                                        "&:last-child": { paddingBottom: '16px' }
                                    }}
                                >
                                    {/* Titlu */}
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            color: '#f0f0f0', // Alb mai luminos
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            lineHeight: 1.3,
                                            height: '2.6em', 
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            mb: 1
                                        }}
                                    >
                                        {car.title}
                                    </Typography>

                                    {/* Detalii tehnice - Gri mai deschis pentru lizibilitate */}
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#aaa', 
                                            fontSize: '0.8rem',
                                            mb: 2,
                                            display: 'block'
                                        }}
                                    >
                                        {car.year} • {car.fuelType ? car.fuelType.toLowerCase() : '-'} • {parseInt(car.mileage).toLocaleString()} km
                                    </Typography>
                                    
                                    <Box sx={{ flexGrow: 1 }} />

                                    {/* Preț și Iconiță */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                color: '#f5f5f5ff'
                                            }}
                                        >
                                            {parseInt(car.price).toLocaleString()} {car.currency}
                                        </Typography>
                                        
                                        {/* Locație mică în dreapta */}
                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                            {car.city || "RO"}
                                        </Typography>
                                    </Box>

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