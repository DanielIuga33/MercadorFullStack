import { Popover, Box, Typography, Divider, List, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../..'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const FavoritePopover = ({ 
    anchorEl, open, onClose, 
    id, refreshFavorites, userData
}) => {
    
    const [favoriteCars, setFavoriteCars] = useState([]);
    const navigate = useNavigate();
    const listRef = useRef(null); 

    const fetchFavoriteCars = async () => {
        if (!id) return;
        try {
            const response = await axios.get(`${API_URL}/users/${id}`);
            const carsIds = response.data.favoriteCars || [];

            const carPromises = carsIds.map(idCar => 
                axios.get(`${API_URL}/cars/dto/${idCar}`).then(res => res.data)
            );

            const fetchedCars = await Promise.all(carPromises);
            setFavoriteCars(fetchedCars);
        } catch (error) {
            console.error("Error fetching favorite cars:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchFavoriteCars();
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, open]);

    const handleRemoveFavorite = async (e, carId) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_URL}/users/favorites/remove`, { 
                data: { userId: id, carId: carId } 
            });
            setFavoriteCars(prev => prev.filter(car => car.id !== carId));
            if (refreshFavorites) refreshFavorites(carId);
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    };

    const handleCarClick = (carId) => {
        navigate(`/carDetails/${carId}`);
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Box sx={{ width: 350, p: 2, maxHeight: 450, bgcolor: '#161616', color: '#fff' }}>
                {id && (
                    <Typography variant="h6" fontWeight={700} sx={{ pb: 1 }}>
                        {favoriteCars.length > 0 ? `You have ${favoriteCars.length} saved cars` : `You don't have saved cars` } 
                    </Typography>
                )}
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                
                <List 
                    ref={listRef}
                    sx={{ 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        mt: 1,
                        "&::-webkit-scrollbar": { width: "5px" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10px" },
                        "&:hover::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,255,255,0.2)" }
                    }}
                >
                    {favoriteCars.length > 0 ? (
                        favoriteCars.map((car) => (
                            <ListItem
                                key={car.id} 
                                onClick={() => handleCarClick(car.id)}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={(e) => handleRemoveFavorite(e, car.id)}
                                        sx={{ color: '#ff4d4d', '&:hover': { bgcolor: 'rgba(255,77,77,0.1)' } }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                }
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '8px',
                                    mb: 1,
                                    p: 1,
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                    }
                                }}
                            >
                                {/* Miniatură Poză */}
                                <Avatar 
                                    variant="rounded"
                                    src={car.image ? `${API_URL}${car.image}` : 'https://via.placeholder.com/100x70?text=No+Photo'} 
                                    alt={car.title}
                                    sx={{ width: 65, height: 45, marginRight: 2, border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                                
                                {/* Detalii text */}
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight={600} sx={{ pr: 3, color: '#fff' }} noWrap>
                                            {car.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 700, display: 'block', mt: 0.5 }}>
                                            {parseInt(car.price).toLocaleString()} {car.currency}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : !id ? (
                        <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: '#aaa' }}>
                            You are not logged in! 🔑
                        </Typography>
                    ) : (
                        <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: '#aaa' }}>
                            Nu ai nicio mașină la favorite. ❤️
                        </Typography>
                    )}
                </List>
            </Box>
        </Popover>
    );
};

export default FavoritePopover;