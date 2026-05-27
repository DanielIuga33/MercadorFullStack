import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Card, CardContent, CardMedia, Typography, CircularProgress} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../..';

const MainPage = ({ searchFilters, userData }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);

    const toggleFavorite = async (e, carId) => {
        // Oprește propagarea evenimentului către Card-ul părinte!
        e.stopPropagation(); 
        
        // Dacă utilizatorul nu este logat, îl oprim (protecție anti-crash)
        if (!userData || !userData.id) {
            alert("You need to login first! 🔑");
            return;
        }

        setToggle(true);

        // Verificăm dacă mașina este deja salvată în favoritele utilizatorului logat
        const isCurrentlyFav = userData?.favoriteCars?.includes(carId);

        // CORECTARE 2: Am șters linia cu car.id care dădea crash (nedefinit)

        try {
            if (isCurrentlyFav) {
                // Șterge de la favorite
                await axios.delete(`${API_URL}/users/favorites/remove`, { data: { userId: userData.id, carId: carId } });
                
                // Actualizăm userData local
                userData.favoriteCars = userData.favoriteCars.filter(id => id !== carId);
            } else {
                // Adaugă la favorite
                await axios.post(`${API_URL}/users/favorites/add`, { userId: userData.id, carId: carId });
                
                // Adăugăm local în array
                if (!userData.favoriteCars) userData.favoriteCars = [];
                userData.favoriteCars.push(carId);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        } finally {
            setToggle(false);
        }
    };

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
        if (toggle === true) return;
        const carDetails = cars.find(car => car.id === carId);
        if (carDetails) {
            navigate(`/carDetails/${carId}`);
        }
    };

    return (
        <Box 
            sx={{
                height: 'calc(100vh - 70px)', 
                width: '100%',
                overflowY: 'auto', 
                bgcolor: "#0a0a0a",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#333", borderRadius: "10px" },
            }}
        >
            <Grid 
                container 
                spacing={3} 
                sx={{ padding: { xs: "20px", md: "30px 4%" }, margin: 0, width: '100%' }}
            >
                {cars.length > 0 ? (
                    cars.map((car) => {
                        // --- CORECT: Aici calculăm starea inimii special pentru mașina curentă din buclă ---
                        const isCarFavorite = userData?.favoriteCars?.includes(car.id) || false;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={car.id}>
                                <Card 
                                    onClick={() => { accesCar(car.id); }} 
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: '#161616', 
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        "&:hover": {
                                            transform: 'translateY(-8px)',
                                            borderColor: 'rgba(255, 77, 77, 0.4)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                                            "& .card-image": { transform: 'scale(1.05)' }
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                        <CardMedia
                                            className="card-image"
                                            component="img"
                                            sx={{ height: '100%', transition: 'transform 0.5s ease' }}
                                            image={car.image ? `${API_URL}${car.image}` : 'https://via.placeholder.com/400x300?text=No+Photo'} 
                                            alt={car.title}
                                        />
                                        {car.negotiable && (
                                            <Box sx={{
                                                position: 'absolute', top: 12, right: 12,
                                                bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                                                color: '#4caf50', border: '1px solid #4caf50',
                                                borderRadius: '6px', px: 1, py: 0.5, fontSize: '0.7rem', fontWeight: 800
                                            }}>
                                                NEGOCIABIL
                                            </Box>
                                        )}
                                    </Box>

                                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#fff', fontWeight: 800, fontSize: '1.05rem',
                                                mb: 1, lineHeight: 1.2, height: '2.4em',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}
                                        >
                                            {car.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.3, borderRadius: '4px', color: '#ccc' }}>
                                                {car.year}
                                            </Typography>
                                            <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.3, borderRadius: '4px', color: '#ccc' }}>
                                                {car.fuelType}
                                            </Typography>
                                            <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.3, borderRadius: '4px', color: '#ccc' }}>
                                                {parseInt(car.mileage).toLocaleString()} km
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: -0.5, fontSize: '0.7rem' }}>
                                                    PREȚ TOTAL
                                                </Typography>
                                                <Typography variant="h5" sx={{ color: '#ff4d4d', fontWeight: 900, fontSize: '1.4rem' }}>
                                                    {parseInt(car.price).toLocaleString()} <span style={{ fontSize: '0.9rem' }}>{car.currency}</span>
                                                </Typography>
                                            </Box>
                                            
                                            {/* Rândul cu locația și inima, aliniate frumos prin flexbox */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                    {car.city || "România"}
                                                </Typography>
                                                {!userData.carIds.includes(car.id) &&
                                                <Tooltip title={isCarFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                                                    <IconButton 
                                                        onClick={(e) => toggleFavorite(e, car.id)} 
                                                        sx={{ 
                                                            backgroundColor: "#272727", 
                                                            color: isCarFavorite ? '#ff4d4d' : 'white', 
                                                            '&:hover': { backgroundColor: '#333' } 
                                                        }}
                                                    >
                                                        {isCarFavorite ? <Favorite sx={{ fontSize: '1.5rem' }} /> : <FavoriteBorder sx={{ fontSize: '1.5rem' }} />}
                                                    </IconButton>
                                                </Tooltip>}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                        <Typography variant="h5" color="gray">Nu am găsit nicio mașină conform filtrelor.</Typography>
                    </Box>
                )}
            </Grid>
        </Box>
    );
};

export default MainPage;