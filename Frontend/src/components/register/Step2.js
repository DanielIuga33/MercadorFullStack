import React, { useState, useEffect } from 'react';
import { cityByRegion, regionsByCountry, countries } from '../ConstantData';
import img1 from '../../images/img1.jpeg'; // Asigură-te că imaginea e importată
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Container, 
  TextField, 
  InputAdornment, 
  MenuItem,
  Collapse,
  Alert
} from '@mui/material';
import { 
  CalendarToday, 
  Public, 
  LocationCity, 
  Home, 
  ArrowBack,
  ArrowForward,
  Map
} from '@mui/icons-material';

// --- STILURI (Aceleași ca la Step1) ---
const themeColors = {
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.75)',
    border: 'rgba(255, 255, 255, 0.1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    error: '#f44336'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        borderRadius: '12px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#ff4d4d' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff4d4d' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' }, // Iconița de dropdown
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
    marginBottom: 2
};

const menuProps = {
    PaperProps: {
        sx: {
            backgroundColor: 'rgb(40, 40, 40)',
            color: 'white',
            '& .MuiMenuItem-root': {
                '&:hover': { backgroundColor: 'rgba(255, 77, 77, 0.2)' },
                '&.Mui-selected': { backgroundColor: 'rgba(255, 77, 77, 0.4)' },
                '&.Mui-selected:hover': { backgroundColor: 'rgba(255, 77, 77, 0.5)' }
            }
        }
    }
};

const buttonStyle = {
    background: themeColors.gradient,
    color: 'white',
    padding: '12px 30px',
    borderRadius: '12px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
        boxShadow: '0 6px 20px rgba(255, 0, 0, 0.2)',
    }
};

const buttonSecondaryStyle = {
    ...buttonStyle,
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: 'none',
    '&:hover': {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid white'
    }
};

// --- WRAPPER FUNDAL ---
const BackgroundWrapper = ({ children }) => (
    <Box sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
    }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>{children}</Box>
    </Box>
);

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
    
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    
    // State-uri locale pentru filtrare
    const [filteredCounties, setFilteredCounties] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    // 1. Când se încarcă componenta sau se schimbă țara în formData
    useEffect(() => {
        if (formData.country && regionsByCountry[formData.country]) {
            setFilteredCounties(regionsByCountry[formData.country]);
        } else {
            setFilteredCounties([]);
        }
    }, [formData.country]);

    // 2. Când se schimbă județul în formData
    useEffect(() => {
        if (formData.county && cityByRegion[formData.county]) {
            setFilteredCities(cityByRegion[formData.county].sort());
        } else {
            setFilteredCities([]);
        }
    }, [formData.county]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Resetăm erorile pentru câmpul modificat
        setValidationErrors({ ...validationErrors, [name]: false });

        // Logică specifică pentru resetarea câmpurilor dependente
        if (name === 'country') {
            setFormData({ ...formData, [name]: value, county: '', city: '' });
        } else if (name === 'county') {
            setFormData({ ...formData, [name]: value, city: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const doNextStep = () => {
        const errors = {};
        let hasError = false;

        if (!formData.birthDate) { errors.birthDate = true; hasError = true; }
        if (!formData.country) { errors.country = true; hasError = true; }
        if (!formData.county) { errors.county = true; hasError = true; }
        if (!formData.city) { errors.city = true; hasError = true; }
        if (!formData.street) { errors.street = true; hasError = true; }

        if (hasError) {
            setValidationErrors(errors);
            setErrorMessage('Please complete all required fields!');
            return;
        }

        setErrorMessage('');
        nextStep();
    };

    return (
        <BackgroundWrapper>
            <Container maxWidth="sm">
                <Paper elevation={24} sx={{
                    backgroundColor: themeColors.glass,
                    backdropFilter: 'blur(16px)',
                    borderRadius: 4,
                    border: `1px solid ${themeColors.border}`,
                    padding: { xs: 3, md: 5 },
                    color: 'white'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="overline" sx={{ color: '#ff4d4d', letterSpacing: 2 }}>
                            Step 2 of 2
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            Address Details
                        </Typography>
                        <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                            Tell us where you are located
                        </Typography>
                    </Box>

                    <form>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Birth Date"
                                    name="birthDate"
                                    value={formData.birthDate || ''}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    InputLabelProps={{ shrink: true }}
                                    error={validationErrors.birthDate}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><CalendarToday /></InputAdornment>) 
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={formData.country || ''}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    error={validationErrors.country}
                                    SelectProps={{ MenuProps: menuProps }}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><Public /></InputAdornment>) 
                                    }}
                                >
                                    {countries.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="County"
                                    name="county"
                                    value={formData.county || ''}
                                    onChange={handleChange}
                                    disabled={!formData.country} // Dezactivat dacă nu e aleasă țara
                                    sx={inputStyle}
                                    error={validationErrors.county}
                                    SelectProps={{ MenuProps: menuProps }}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><Map /></InputAdornment>) 
                                    }}
                                >
                                    {filteredCounties.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    disabled={!formData.county} // Dezactivat dacă nu e ales județul
                                    sx={inputStyle}
                                    error={validationErrors.city}
                                    SelectProps={{ MenuProps: menuProps }}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><LocationCity /></InputAdornment>) 
                                    }}
                                >
                                    {filteredCities.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Street and Number"
                                    name="street"
                                    value={formData.street || ''}
                                    onChange={handleChange}
                                    sx={inputStyle}
                                    error={validationErrors.street}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><Home /></InputAdornment>) 
                                    }}
                                />
                            </Grid>

                        </Grid>

                        <Collapse in={!!errorMessage}>
                            <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                                {errorMessage}
                            </Alert>
                        </Collapse>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                onClick={prevStep}
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                sx={buttonSecondaryStyle}
                            >
                                Back
                            </Button>
                            <Button 
                                onClick={doNextStep}
                                variant="contained"
                                endIcon={<ArrowForward />}
                                sx={buttonStyle}
                            >
                                Next Step
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </BackgroundWrapper>
    );
};

export default Step2;