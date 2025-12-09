import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, 
    TextareaAutosize, CircularProgress, Typography, Box, CardMedia, 
    FormControlLabel, Checkbox, FormGroup 
} from '@mui/material'; 
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';
import './PostACar.css';
import API_URL from '../..';

// Listele pentru dropdown-uri
const pollutionStandards = ["Non-Euro", "Euro 1", "Euro 2", "Euro 3", "Euro 4", "Euro 5", "Euro 6"];
const driveTypes = ["Front Wheel Drive (FWD)", "Rear Wheel Drive (RWD)", "All Wheel Drive (4x4)"];

// Lista extinsă de dotări
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

// Componentă mică pentru titlurile de secțiuni
const SectionHeader = ({ title }) => (
    <Grid item xs={12} sx={{ mt: 3, mb: 1 }}>
        <Typography variant="h5" sx={{ color: '#90caf9', fontWeight: 500, borderBottom: '1px solid #444', paddingBottom: '5px' }}>
            {title}
        </Typography>
    </Grid>
);

const PostACar = ({ userData, setUserData }) => {
    const MAX_IMAGES = 9;
    const navigate = useNavigate();
    
    // --- STATE-URI ---
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState('');
    const [descError, setDescError] = useState('');
    
    // State pentru Predictia Pretului
    const [estimatedPrice, setEstimatedPrice] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [carData, setCarData] = useState({
        title: '', brand: '', model: '', body: '', vin: '',
        year: '', cm3: '', hp: '', mileage: '', price: '', currency: '',
        color: '', fuelType: '', numberOfDoors: '', transmission: '', condition: '',
        description: '', steeringwheel: '', ownerId: userData.id,
        images: [], city: '', county: '', pollutionStandard: '', driveType: '',
        negotiable: false, exchange: false, features: [],
        createdAt: '', active: '', sold: '', views: '',
    });

    useEffect(() => {
        if (!userData.id) navigate('/');
    }, [userData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCarData({ ...carData, [name]: checked });
    };

    const handleFeatureChange = (feature) => {
        let updatedFeatures = [...carData.features];
        if (updatedFeatures.includes(feature)) {
            updatedFeatures = updatedFeatures.filter(f => f !== feature);
        } else {
            updatedFeatures.push(feature);
        }
        setCarData({ ...carData, features: updatedFeatures });
    };

    const verifyDescription =() => {
        if (carData.description.length < 40 && carData.description.length > 0) {
            setDescError('Description is too short (min 40 chars)!');           
        } else if (carData.description.length === 0){
            setDescError('You need to complete the description !');
        } else {
            setDescError('');
        }
    };

    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);

    useEffect(() => {
        const carVin = carData.vin.toUpperCase();
        if (carData.vin && carData.vin !== carData.vin.toUpperCase()) {
            setCarData((c) => ({ ...c, vin: carVin }));
        }
    }, [carData.vin]);

    // --- FUNCȚIA DE PREDICȚIE PREȚ (MODIFICATĂ) ---
    const handlePredictPrice = async () => {
        // Validare de bază
        if (!carData.brand || !carData.model || !carData.year || !carData.mileage) {
            alert("To estimate the price, please select at least: Brand, Model, Year, and Mileage.");
            return;
        }

        setIsPredicting(true);
        setEstimatedPrice(null);

        try {
            // Construim obiectul complet pentru DTO-ul Java
            const predictionPayload = {
                brand: carData.brand,
                model: carData.model,
                year: parseInt(carData.year),
                mileage: parseInt(carData.mileage),
                features: carData.features,
                // Trimitem și specificațiile tehnice (convertim la int unde trebuie)
                hp: carData.hp ? parseInt(carData.hp) : 0,
                cm3: carData.cm3 ? parseInt(carData.cm3) : 0, // <--- NOU
                fuelType: carData.fuelType,
                transmission: carData.transmission,
                pollutionStandard: carData.pollutionStandard, // <--- NOU
                driveType: carData.driveType // <--- NOU (Opțional)
            };

            const response = await axios.post(`${API_URL}/cars/estimatePrice`, predictionPayload);
            const predictedValue = Math.round(response.data);
            setEstimatedPrice(predictedValue);

        } catch (error) {
            console.error("Error predicting price:", error);
            alert("Could not estimate price. Make sure the backend is running and the endpoint exists.");
        } finally {
            setIsPredicting(false);
        }
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            setImages(files);
            return;
        }
        setImages((prev) => [...prev, ...files]);
    };

    const uploadImages = async () => {
        const formData = new FormData();
        images.forEach((file) => formData.append('images', file));

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.imageUrls;
        } catch (error) {
            console.error('Error uploading images:', error.response ? error.response.data : error.message);
            return [];
        }
    };

    const handleSubmit = async () => {
        carData.title = titleRef.current.value;
        carData.description = descriptionRef.current.value;
        verifyDescription();
        
        if (carData.title === '' || carData.brand === '' || carData.model === '' || carData.year === '' || carData.price === '' || carData.city === '') {
            setErrors('You need to complete all the required fields!');
            return;
        } else {
            setErrors('');
        }
        if (descError) { return; }
        
        setLoading(true);

        try {
            const imageUrls = await uploadImages();
            const updatedCarData = { ...carData, images: imageUrls };
            await axios.post(`${API_URL}/cars`, updatedCarData);
            const response = await axios.get(`${API_URL}/users/findByEmail`, {
                params: { email: userData.email }
            });
            setUserData(response.data);
            setDone(true);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader"><CircularProgress /></div>;

    if (done) {
        return (
            <div className='finished-posting-car'>
                <h1>Car successfully posted!</h1>
                <Button variant="contained" color="success" onClick={() => navigate("/account")}>Go to Account</Button>
            </div>
        );
    }

    return (
        <Box className='postCar-main-container' sx={{
            display: 'flex',
            minHeight: '94vh',
            backgroundColor: 'hsl(0, 0%, 7%)',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box className='frame' sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '90vh',
                width: '80%',
                padding: '5%',
                border: '3px solid hsl(0, 0%, 0%)',
                borderRadius: '5px',
                backgroundColor: 'hsl(0, 0%, 12%)',
                boxShadow: '10px 20px 200px  rgb(243, 0, 0), 10px 10px 5px 8px rgb(31, 31, 31)',
            }}>
                
                <Typography 
                    variant='h3' 
                    sx={{
                        fontSize: { xs: '7vw', md: '2.5vw' },
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}
                >
                    Sell your car
                </Typography>
                <Typography variant='body1' sx={{ color: 'gray', mb: 4 }}>
                    Fill in the details below to create your listing.
                </Typography>

                <Grid container spacing={3} sx={{justifyContent: 'center'}}>
                    
                    {/* --- 1. GENERAL INFO --- */}
                    <SectionHeader title="1. General Information" />

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant='outlined'
                            label="Title"
                            name="title"
                            inputRef={titleRef}
                            placeholder="Write a descriptive title for your car"
                            sx={{width: '60%', marginTop: '20px',marginBottom: 2 }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                name="brand"
                                label="Brand"
                                value={carData.brand}
                                onChange={(e) => { setSelectedBrand(e.target.value); handleChange(e); }}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                {brands.map((brand) => <MenuItem key={brand} value={brand}>{brand}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Model</InputLabel>
                            <Select
                                name="model"
                                label="Model"
                                value={carData.model}
                                onChange={handleChange}
                            >   
                                {carData.brand ? <MenuItem value="">Choose</MenuItem> : <MenuItem value="">Select Brand First</MenuItem>}
                                {filteredModels.map((model) => <MenuItem key={model} value={model}>{model}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Body Type</InputLabel>
                            <Select name="body" label="Body Type" value={carData.body} onChange={handleChange}>   
                                <MenuItem value="">Choose</MenuItem>
                                {bodies.map((body) => <MenuItem key={body} value={body}>{body}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="VIN" name="vin" value={carData.vin} onChange={handleChange} />
                    </Grid>

                    {/* --- 2. SPECIFICATIONS --- */}
                    <SectionHeader title="2. Specifications" />

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Year" name="year" type="number" value={carData.year} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Mileage" name="mileage" type="number" value={carData.mileage} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Condition</InputLabel>
                            <Select label="Condition" name="condition" value={carData.condition} onChange={handleChange}>   
                                <MenuItem value="USED">Used</MenuItem>
                                <MenuItem value="NEW">New</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Color</InputLabel>
                            <Select label="Color" name="color" value={carData.color} onChange={handleChange}>   
                                <MenuItem value="">Choose</MenuItem>
                                {colors.map((color) => <MenuItem key={color} value={color}>{color}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         <TextField fullWidth label="Number of doors" name="numberOfDoors" type="number" value={carData.numberOfDoors} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Steeringwheel</InputLabel>
                            <Select label="Steeringwheel" name="steeringwheel" value={carData.steeringwheel} onChange={handleChange}>   
                                <MenuItem value="LEFT">Left Side</MenuItem>
                                <MenuItem value="RIGHT">Right Side</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* --- 3. ENGINE & PERFORMANCE --- */}
                    <SectionHeader title="3. Engine & Performance" />

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Engine capacity(cm³)" name="cm3" type="number" value={carData.cm3} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Engine displacement(hp)" name="hp" type="number" value={carData.hp} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Fuel Type</InputLabel>
                            <Select label="Fuel Type" name="fuelType" value={carData.fuelType} onChange={handleChange}>   
                                <MenuItem value="DIESEL">Diesel</MenuItem>
                                <MenuItem value="PETROL">Petrol</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                                <MenuItem value="ELECTRIC">Electric</MenuItem>
                                <MenuItem value="GPL">GPL</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Pollution Standard</InputLabel>
                            <Select label="Pollution Standard" name="pollutionStandard" value={carData.pollutionStandard} onChange={handleChange}>   
                                {pollutionStandards.map((std) => <MenuItem key={std} value={std}>{std}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Gearbox</InputLabel>
                            <Select label="Gearbox" name="transmission" value={carData.transmission} onChange={handleChange}>   
                                <MenuItem value="MANUAL">Manual</MenuItem>
                                <MenuItem value="AUTOMATIC">Automatic</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         <FormControl fullWidth>
                            <InputLabel>Drive Type</InputLabel>
                            <Select label="Drive Type" name="driveType" value={carData.driveType} onChange={handleChange}>   
                                {driveTypes.map((dt) => <MenuItem key={dt} value={dt}>{dt}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* --- 4. LOCATION --- */}
                    <SectionHeader title="4. Location" />

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="City" name="city" value={carData.city} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="County" name="county" value={carData.county} onChange={handleChange} />
                    </Grid>

                    {/* --- 5. FEATURES --- */}
                    <SectionHeader title="5. Features & Options" />

                    <Grid item xs={12}>
                        <Box sx={{ border: '1px solid gray', borderRadius: '5px', padding: '10px' }}>
                            <Typography variant="h6" gutterBottom>Select Features</Typography>
                            <FormGroup row>
                                {availableFeatures.map((feature) => (
                                    <FormControlLabel
                                        key={feature}
                                        control={
                                            <Checkbox 
                                                checked={carData.features.includes(feature)} 
                                                onChange={() => handleFeatureChange(feature)} 
                                                name={feature}
                                                sx={{color: 'gray', '&.Mui-checked': {color: 'red'}}}
                                            />
                                        }
                                        label={feature}
                                        sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }} 
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    </Grid>

                    {/* --- 6. DESCRIPTION --- */}
                    <SectionHeader title="6. Description" />

                    <Grid item xs={12}>
                        <TextareaAutosize
                            minRows={3}
                            ref={descriptionRef}
                            name="description"
                            placeholder="Describe the car"
                            style={{ width: '90%', minHeight: '100px' , backgroundColor: 'hsla(0, 0%, 7%, 0.658)' , color: 'white'}}
                        />
                    </Grid>

                    {/* --- 7. IMAGES --- */}
                    <SectionHeader title="7. Photos" />

                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            Upload Images
                            <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
                        </Button>
                    </Grid>
                    <Grid 
                        container
                        spacing={2} 
                        sx={{
                            backgroundColor: 'hsl(0, 2%, 12%)',
                            maxWidth: '80%',
                            marginTop: '50px',
                            height: 'auto',
                            padding: '5px',
                            border: '2px solid black',
                        }}
                    >
                        {images.length > 0 ? 
                        images.map((image, index) => (
                            <Grid 
                            item 
                            xs={4} sm={6} md={4} lg={4}
                            key={index}
                            >
                            <CardMedia
                                sx={{
                                    width: 'auto',
                                    maxWidth: "100%",
                                    maxHeight: '180px',
                                    objectFit: 'cover', 
                                    border: '2px solid black'
                                }}
                                component="img"
                                image={URL.createObjectURL(image)}
                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                alt={`img-${index}`}
                            />
                            </Grid>
                        )) :
                        <Box
                            fullWidth
                            sx={{
                                height: "190px",
                                alignContent: 'center',
                                margin: '0 auto',
                            }}
                        >
                            <Typography variant='h4' color={'gray'}> There are no images for now</Typography>
                        </Box>}
                    </Grid>

                    {/* --- 8. PRICE & DEAL --- */}
                    <SectionHeader title="8. Price & Deal" />

                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField 
                                fullWidth 
                                label="Price" 
                                name="price" 
                                type="number" 
                                value={carData.price} 
                                onChange={handleChange} 
                            />
                            
                            {/* Butonul de Estimare */}
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={handlePredictPrice}
                                disabled={isPredicting}
                                sx={{ color: '#90caf9', borderColor: '#90caf9', textTransform: 'none' }}
                            >
                                {isPredicting ? <CircularProgress size={20} color="inherit" /> : "Check Recommended Price (AI)"}
                            </Button>

                            {/* Afișarea rezultatului */}
                            {estimatedPrice && (
                                <Box sx={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', border: '1px solid green', borderRadius: 1, p: 1, mt: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#66bb6a', fontWeight: 'bold' }}>
                                        AI Estimate: {estimatedPrice} {carData.currency || '€'}
                                    </Typography>
                                    <Button 
                                        size="small" 
                                        sx={{ color: 'white', fontSize: '0.7rem' }}
                                        onClick={() => setCarData({...carData, price: estimatedPrice})}
                                    >
                                        Use this price
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select label="Currency" name="currency" value={carData.currency} onChange={handleChange}>   
                                <MenuItem value="€">€</MenuItem>
                                <MenuItem value="Ron">Ron</MenuItem>
                                <MenuItem value="£">£</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                         <FormControlLabel 
                            control={<Checkbox checked={carData.negotiable} onChange={handleCheckboxChange} name="negotiable" sx={{color: 'gray', '&.Mui-checked': {color: 'green'}}} />} 
                            label="Negotiable" 
                        />
                        <FormControlLabel 
                            control={<Checkbox checked={carData.exchange} onChange={handleCheckboxChange} name="exchange" sx={{color: 'gray', '&.Mui-checked': {color: 'blue'}}} />} 
                            label="Accept Exchange" 
                        />
                    </Grid>

                </Grid>
                
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ marginTop: '70px' }}
                >
                    Submit
                </Button>

                {errors &&
                <Box>
                    <span className="error"><i className="fas fa-times" style={{ color: "red" }}></i><i> {errors}</i></span>
                </Box>}
                {descError && 
                <Box>
                    <span className="error"><i className="fas fa-times" style={{ color: "red" }}></i><i> {descError}</i></span>
                </Box>}
            </Box>
        </Box>
    );
};

export default PostACar;