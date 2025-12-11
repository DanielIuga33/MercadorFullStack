import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../..';
import img1 from '../../images/img1.jpeg'; // Asigură-te de calea corectă
import { 
    Grid, Box, Card, CardContent, CardMedia, Typography, 
    CircularProgress, Button, Container 
} from '@mui/material';
import { 
    Edit, 
    Delete, 
    DirectionsCar 
} from '@mui/icons-material';

// --- STILURI ---
const themeColors = {
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(30, 30, 30, 0.6)', 
    glassHover: 'rgba(40, 40, 40, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#ff4d4d',
    textSecondary: 'rgba(255, 255, 255, 0.6)'
};

const BackgroundWrapper = ({ children }) => (
    <Box sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px'
    }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>{children}</Box>
    </Box>
);

const UserOwnCars = ({ userData }) => {
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const carIds = userData.carIds || [];
        const getCarData = async () => {
            if (!carIds.length) {
                setLoading(false);
                return;
            }
            try {
                // Folosim Promise.all pentru performanță (cereri paralele)
                const promises = carIds.map(id => axios.get(`${API_URL}/cars/dto/${id}`));
                const responses = await Promise.all(promises);
                const validCars = responses
                    .map(res => res.data)
                    .filter(car => car !== null);
                setCars(validCars);
            } catch (error) {
                console.error("Error fetching cars: ", error);
            } finally {
                setLoading(false);
            }
        };
        getCarData();
    }, [userData.carIds]);

    const handleViewModify = (carId) => {
        // Navighează către pagina de editare/vizualizare
        // Exemplu: navigate(`/account/cars/${carId}`);
        console.log("View/Modify", carId);
    };

    const handleDelete = async (carId) => {
        // Logică de ștergere
        if (window.confirm("Are you sure you want to delete this car listing?")) {
            try {
                await axios.delete(`${API_URL}/cars/${carId}`);
                setCars(prev => prev.filter(c => c.id !== carId));
                // Opțional: Update userData.carIds în părinte sau refresh user
            } catch (error) {
                console.error("Error deleting car:", error);
            }
        }
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <Box sx={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{ color: themeColors.accent }} />
                </Box>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                    My Garage
                </Typography>
                <Typography variant="body1" sx={{ color: themeColors.textSecondary, mb: 5, textAlign: 'center' }}>
                    Manage your listed vehicles
                </Typography>

                {cars.length > 0 ? (
                    <Grid container spacing={3} justifyContent="center">
                        {cars.map((car) => (
                            <Grid item key={car.id} xs={12} sm={6} md={4} lg={3}>
                                <Card 
                                    sx={{
                                        backgroundColor: themeColors.glass,
                                        backdropFilter: 'blur(12px)',
                                        border: `1px solid ${themeColors.border}`,
                                        borderRadius: '16px',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        "&:hover": {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                            borderColor: 'rgba(255, 77, 77, 0.3)'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                        {car.image ? (
                                            <CardMedia
                                                component="img"
                                                image={`${API_URL}${car.image}`}
                                                alt={car.title}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ width: '100%', height: '100%', bgcolor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <DirectionsCar sx={{ fontSize: 60, color: 'gray', opacity: 0.5 }} />
                                            </Box>
                                        )}
                                        
                                        {/* Preț Overlay */}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                            p: 2,
                                            pt: 4
                                        }}>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                {car.price} {car.currency}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ pb: 1 }}>
                                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1rem', fontWeight: 600, mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {car.title}
                                        </Typography>
                                        
                                        {/* Actions Bar */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${themeColors.border}` }}>
                                            <Button 
                                                size="small" 
                                                startIcon={<Edit />}
                                                onClick={() => handleViewModify(car.id)}
                                                sx={{ 
                                                    color: '#90caf9', 
                                                    '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' } 
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                size="small" 
                                                startIcon={<Delete />}
                                                color="error"
                                                onClick={() => handleDelete(car.id)}
                                                sx={{ 
                                                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } 
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.7 }}>
                        <DirectionsCar sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
                        <Typography variant="h5" sx={{ color: 'white' }}>Your garage is empty</Typography>
                        <Button 
                            variant="outlined" 
                            sx={{ mt: 3, borderColor: themeColors.accent, color: themeColors.accent }}
                            onClick={() => navigate('/account/postACar')}
                        >
                            Post your first car
                        </Button>
                    </Box>
                )}
            </Container>
        </BackgroundWrapper>
    );
}

export default UserOwnCars;