import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import img1 from '../../images/img1.jpeg';
import { 
    TextField, Button, Grid, MenuItem, Typography, Box, CardMedia, 
    FormControlLabel, Checkbox, FormGroup, CircularProgress, 
    Container, Paper, InputAdornment, IconButton, Collapse, Alert
} from '@mui/material'; 
import { 
    CloudUpload, Delete, CheckCircle, 
    Title, DirectionsCar, Speed, 
    LocationOn, FeaturedPlayList, Description, PhotoCamera,
    AttachMoney
} from '@mui/icons-material';
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';
import API_URL from '../..';

const themeColors = {
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(30, 30, 30, 0.6)', 
    glassHover: 'rgba(40, 40, 40, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#ff4d4d',
    textSecondary: 'rgba(255, 255, 255, 0.6)'
};

const pollutionStandards = ["Non-Euro", "Euro 1", "Euro 2", "Euro 3", "Euro 4", "Euro 5", "Euro 6"];
const driveTypes = ["Front Wheel Drive (FWD)", "Rear Wheel Drive (RWD)", "All Wheel Drive (4x4)"];
const availableFeatures = [
    "ABS", "ESP", "Alloy Wheels", "Tow Hook", "Tire Pressure Monitoring",
    "LED Headlights", "Matrix / Laser Headlights", "Fog Lights", 
    "Sunroof", "Panoramic Roof", "Tinted Windows", "Air Suspension",
    "Air Conditioning", "Automatic Climate Control (2 Zones)", "Automatic Climate Control (4 Zones)",
    "Leather Interior", "Alcantara Interior", "Heated Front Seats", "Heated Rear Seats", 
    "Ventilated Seats", "Electric Seats with Memory", "Massage Seats", 
    "Heated Steering Wheel", "Multifunction Steering Wheel",
    "Keyless Entry", "Keyless Go", "Soft Close", "Electric Tailgate", "Webasto",
    "Navigation System", "Bluetooth", "Apple CarPlay / Android Auto", 
    "Digital Cockpit", "Head-up Display", "Wireless Charging", "Premium Sound System",
    "Cruise Control", "Adaptive Cruise Control (Distronic)", 
    "Lane Assist", "Blind Spot Monitor", "Traffic Sign Recognition",
    "Parking Sensors", "Rear View Camera", "360° Camera", "Self-Parking System"
];

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
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
    marginBottom: 2
};

const SectionHeader = ({ title, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2, borderBottom: `1px solid ${themeColors.border}`, pb: 1 }}>
        <Box sx={{ color: '#ff4d4d', mr: 1, display: 'flex' }}>{icon}</Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {title}
        </Typography>
    </Box>
);

const menuProps = {
    PaperProps: {
        sx: {
            backgroundColor: 'rgb(40, 40, 40)',
            color: 'white',
            '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255, 77, 77, 0.2)' },
            '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'rgba(255, 77, 77, 0.4)' }
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
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
    }
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

const CarEditing = ({userData}) => {
    const MAX_IMAGES = 9;
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [done, setDone] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState('');
    const [descError, setDescError] = useState('');    
    const descriptionRef = useRef(null);
    const titleRef = useRef(null);
    
    // CORECTIE: Trebuie apelat hook-ul, nu doar atribuit
    const navigate = useNavigate(); 
    
    const [loading, setLoading] = useState(true);
    const [carData, setCarData] = useState({}); // Initializam cu obiect gol
    const { id } = useParams();
    
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return; 
            // Nu verificam userData aici pentru a evita redirect loop in caz de delay la auth
            
            try {
                const response = await axios.get(`${API_URL}/cars/${id}`);
                setCarData(response.data);
                setImages(response.data.images || []); 
                setSelectedBrand(response.data.brand); // Setam si brandul selectat initial
                
                // Optional: Verificare owner
                // let ownerRes = await axios.get(`${API_URL}/cars/owner/${id}`);
                // setCarOwnerId(ownerRes.data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors("Could not fetch car details.");
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
         if (!loading && (!userData || !userData.id)) {
            // Redirect doar daca loading e gata si userul nu e logat
             navigate('/');
         }
    }, [userData, navigate, loading]);
    
    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);
    
    useEffect(() => {
        if (carData.vin && carData.vin !== carData.vin.toUpperCase()) {
            setCarData((c) => ({ ...c, vin: c.vin.toUpperCase() }));
        }
    }, [carData.vin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
        setErrors('');
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCarData({ ...carData, [name]: checked });
    };

    const handleFeatureChange = (feature) => {
        let updatedFeatures = carData.features ? [...carData.features] : [];
        if (updatedFeatures.includes(feature)) {
            updatedFeatures = updatedFeatures.filter(f => f !== feature);
        } else {
            updatedFeatures.push(feature);
        }
        setCarData({ ...carData, features: updatedFeatures });
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }
        setImages((prev) => [...prev, ...files]);
    };

    const uploadImages = async () => {
        // CORECTIE: Filtram doar fisierele noi (File objects), ignoram string-urile (URL-uri vechi)
        const newFiles = images.filter((img) => typeof img !== 'string');
        
        // Daca nu sunt poze noi de incarcat, returnam array gol
        if (newFiles.length === 0) return [];

        const formData = new FormData();
        newFiles.forEach((file) => formData.append('images', file));

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.imageUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            return [];
        }
    };

    const handleSubmit = async () => {
        const descriptionValue = descriptionRef.current.value;
        const titleValue = titleRef.current.value;

        if (!descriptionValue || descriptionValue.length === 0) {
            setDescError('You need to complete the description!');
            return;
        } else if (descriptionValue.length < 40) {
            setDescError('Description is too short (min 40 chars)!');
            return;
        } else {
            setDescError('');
        }

        if (!titleValue || !carData.brand || !carData.model || !carData.year || !carData.price || !carData.city) {
            setErrors('You need to complete all the required fields!');
            return;
        }

        setLoading(true);

        try {
            // 1. Urcam pozele noi
            const newUploadedUrls = await uploadImages();
            
            // 2. Pastram pozele vechi (cele care sunt string-uri)
            const existingUrls = images.filter((img) => typeof img === 'string');

            // 3. Combinam listele
            const finalImages = [...existingUrls, ...newUploadedUrls];
            
            const updatedCarData = { 
                ...carData, 
                title: titleValue,        
                description: descriptionValue, 
                images: finalImages 
            };
            
            // CORECTIE: Folosim PUT catre ID-ul specific pentru update, nu POST catre /cars
            await axios.put(`${API_URL}/cars/${id}`, updatedCarData);

            setDone(true);
        } catch (error) {
            console.error('Error:', error);
            setErrors('An error occurred while updating the car.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <CircularProgress sx={{ color: '#ff4d4d' }} />
            </BackgroundWrapper>
        );
    }

    if (done) {
        return (
            <BackgroundWrapper>
                <Paper sx={{ p: 5, textAlign: 'center', backgroundColor: themeColors.glass, color: 'white', borderRadius: 4 }}>
                    <CheckCircle sx={{ fontSize: 60, color: themeColors.success || '#4caf50', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Success!</Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: themeColors.textSecondary }}>Your car has been successfully updated.</Typography>
                    <Button variant="contained" sx={buttonStyle} onClick={() => navigate("/account")}>Go to Dashboard</Button>
                </Paper>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            <Container maxWidth="lg">
                <Paper elevation={24} sx={{
                    backgroundColor: themeColors.glass,
                    backdropFilter: 'blur(16px)',
                    borderRadius: 4,
                    border: `1px solid ${themeColors.border}`,
                    padding: { xs: 3, md: 5 },
                    color: 'white'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                            Edit Your <span style={{ color: '#ff4d4d' }}>Car</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: themeColors.textSecondary }}>
                            Update the details below to modify your listing.
                        </Typography>
                    </Box>

                    {/* --- 1. GENERAL INFO --- */}
                    <SectionHeader title="General Information" icon={<Title />} />
                    
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        inputRef={titleRef}
                        defaultValue={carData.title || ''}
                        placeholder="e.g. BMW M4 Competition Pack 2021"
                        sx={inputStyle}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Title sx={{color:'rgba(255,255,255,0.5)'}}/></InputAdornment>) }}
                    />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Brand" name="brand" value={carData.brand || ''} 
                                onChange={(e) => { setSelectedBrand(e.target.value); handleChange(e); }} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                {brands.map((brand) => <MenuItem key={brand} value={brand}>{brand}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Model" name="model" value={carData.model || ''} 
                                onChange={handleChange} sx={inputStyle} disabled={!carData.brand} SelectProps={{ MenuProps: menuProps }}>
                                {filteredModels.map((model) => <MenuItem key={model} value={model}>{model}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Body Type" name="body" value={carData.body || ''} 
                                onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                {bodies.map((body) => <MenuItem key={body} value={body}>{body}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="VIN" name="vin" value={carData.vin || ''} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                    </Grid>

                    {/* --- 2. SPECIFICATIONS --- */}
                    <SectionHeader title="Specifications" icon={<DirectionsCar />} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth type="number" label="Year" name="year" value={carData.year || ''} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth type="number" label="Mileage" name="mileage" value={carData.mileage || ''} onChange={handleChange} sx={inputStyle} 
                                InputProps={{ endAdornment: <InputAdornment position="end" sx={{color:'white'}}>km</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField select fullWidth label="Condition" name="condition" value={carData.condition || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                <MenuItem value="USED">Used</MenuItem>
                                <MenuItem value="NEW">New</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField select fullWidth label="Color" name="color" value={carData.color || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                {colors.map((color) => <MenuItem key={color} value={color}>{color}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth type="number" label="Number of Doors" name="numberOfDoors" value={carData.numberOfDoors || ''} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Steering Wheel" name="steeringwheel" value={carData.steeringwheel || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                <MenuItem value="LEFT">Left Side</MenuItem>
                                <MenuItem value="RIGHT">Right Side</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* --- 3. ENGINE & PERFORMANCE --- */}
                    <SectionHeader title="Engine & Performance" icon={<Speed />} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField fullWidth type="number" label="Engine Capacity" name="cm3" value={carData.cm3 || ''} onChange={handleChange} sx={inputStyle} 
                                InputProps={{ endAdornment: <InputAdornment position="end" sx={{color:'white'}}>cm³</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField fullWidth type="number" label="Power" name="hp" value={carData.hp || ''} onChange={handleChange} sx={inputStyle}
                                InputProps={{ endAdornment: <InputAdornment position="end" sx={{color:'white'}}>HP</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField select fullWidth label="Fuel Type" name="fuelType" value={carData.fuelType || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                <MenuItem value="DIESEL">Diesel</MenuItem>
                                <MenuItem value="PETROL">Petrol</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                                <MenuItem value="ELECTRIC">Electric</MenuItem>
                                <MenuItem value="GPL">GPL</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField select fullWidth label="Pollution Standard" name="pollutionStandard" value={carData.pollutionStandard || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                {pollutionStandards.map((std) => <MenuItem key={std} value={std}>{std}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField select fullWidth label="Gearbox" name="transmission" value={carData.transmission || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                <MenuItem value="MANUAL">Manual</MenuItem>
                                <MenuItem value="AUTOMATIC">Automatic</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField select fullWidth label="Drive Type" name="driveType" value={carData.driveType || ''} onChange={handleChange} sx={inputStyle} SelectProps={{ MenuProps: menuProps }}>
                                {driveTypes.map((dt) => <MenuItem key={dt} value={dt}>{dt}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* --- 4. LOCATION --- */}
                    <SectionHeader title="Location" icon={<LocationOn />} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="City" name="city" value={carData.city || ''} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="County" name="county" value={carData.county || ''} onChange={handleChange} sx={inputStyle} />
                        </Grid>
                    </Grid>

                    {/* --- 5. FEATURES --- */}
                    <SectionHeader title="Features & Options" icon={<FeaturedPlayList />} />
                    <Paper elevation={0} sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: 2, 
                        p: 2 
                    }}>
                        <FormGroup row>
                            {availableFeatures.map((feature) => (
                                <FormControlLabel
                                    key={feature}
                                    control={
                                        <Checkbox 
                                            checked={carData.features ? carData.features.includes(feature) : false}
                                            onChange={() => handleFeatureChange(feature)} 
                                            sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#ff4d4d' } }} 
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{feature}</Typography>}
                                    sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, m: 0.5 }}
                                />
                            ))}
                        </FormGroup>
                    </Paper>

                    {/* --- 6. DESCRIPTION --- */}
                    <SectionHeader title="Description" icon={<Description />} />
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Describe the car in detail (min 40 characters)..."
                        inputRef={descriptionRef} 
                        defaultValue={carData.description || ''}
                        sx={inputStyle}
                        error={!!descError}
                        helperText={descError}
                    />

                    {/* --- 7. IMAGES (FIXED) --- */}
                    <SectionHeader title="Photos" icon={<PhotoCamera />} />
                    <Box sx={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 2, p: 4, textAlign: 'center', mb: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Select Images (Max {MAX_IMAGES})
                            <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
                            Supported formats: JPG, PNG
                        </Typography>
                    </Box>

                    {images.length > 0 && (
                        <Grid container spacing={2}>
                            {images.map((image, index) => {
                                // FIX: Verificam daca e URL (string) sau File object
                                const imageUrl = typeof image === 'string' 
                                    ? image 
                                    : URL.createObjectURL(image);

                                return (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                image={imageUrl}
                                                alt={`img-${index}`}
                                                sx={{ height: 140, borderRadius: 2, border: '1px solid rgba(255,255,255,0.2)' }}
                                            />
                                            <IconButton 
                                                size="small"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.7)', color: '#ff4d4d', '&:hover': { backgroundColor: 'white' } }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )}

                    {/* --- 8. PRICE & DEAL --- */}
                    <SectionHeader title="Price & Deal" icon={<AttachMoney />} />
                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField 
                                    fullWidth 
                                    label="Price" 
                                    name="price" 
                                    type="number" 
                                    value={carData.price || ''} 
                                    onChange={handleChange} 
                                    sx={inputStyle}
                                />
                                <TextField
                                    select
                                    label="Currency"
                                    name="currency"
                                    value={carData.currency || '€'}
                                    onChange={handleChange}
                                    sx={{ ...inputStyle, width: '120px' }}
                                    SelectProps={{ MenuProps: menuProps }}
                                >
                                    <MenuItem value="€">€</MenuItem>
                                    <MenuItem value="Ron">Ron</MenuItem>
                                    <MenuItem value="£">£</MenuItem>
                                </TextField>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                <FormControlLabel 
                                    control={<Checkbox checked={carData.negotiable || false} onChange={handleCheckboxChange} name="negotiable" sx={{color: 'gray', '&.Mui-checked': {color: themeColors.success}}} />} 
                                    label="Price is Negotiable" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={carData.exchange || false} onChange={handleCheckboxChange} name="exchange" sx={{color: 'gray', '&.Mui-checked': {color: '#2196f3'}}} />} 
                                    label="Accept Exchange / Buy-Back" 
                                />
                             </Box>
                        </Grid>
                    </Grid>

                    {/* --- ACTIONS --- */}
                    <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Collapse in={!!errors}>
                            <Alert severity="error" onClose={() => setErrors('')}>{errors}</Alert>
                        </Collapse>
                        
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            sx={{ ...buttonStyle, fontSize: '1.2rem', py: 2 }}
                        >
                            Update Listing
                        </Button>
                    </Box>

                </Paper>
            </Container>
        </BackgroundWrapper>
    );
}

export default CarEditing;