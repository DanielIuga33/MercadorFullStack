import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, TextareaAutosize, CircularProgress, Typography, Box, CardMedia } from '@mui/material';
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';
import './PostACar.css';
import API_URL from '../..';

const PostACar = ({ userData, setUserData }) => {
    const MAX_IMAGES = 9;
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState('');
    const [descError, setDescError] = useState('');
    const titleRef = useRef();
    const descriptionRef = useRef();

    const [carData, setCarData] = useState({
        title: '',
        brand: '',
        model: '',
        body: '',
        vin: '',
        year: '',
        cm3: '',
        hp: '',
        mileage: '',
        price: '',
        currency: '',
        color: '',
        fuelType: '',
        numberOfDoors: '',
        transmission: '',
        condition: '',
        registrationDate: '',
        description: '',
        steeringwheel: '',
        ownerId: userData.id,
        images: []
    });

    useEffect(() => {
        if (!userData.id){
            navigate('/');
        }
    }, [userData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const verifyDescription =() => {
        if (carData.description.length < 40 && carData.description.length > 0) {
            setDescError('Invalid description size !');          
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
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
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
        if (carData.title === '' || carData.brand === '' || carData.model === '' || carData.year === '' || carData.price === '') {
            setErrors('You need to complete all the required fields!');
            return;
        }else{
            setErrors('');
        }
        if (descError) {
            console.log(descError);
            return;
        }
        setLoading(true);

        try {
            const imageUrls = await uploadImages();
            if (imageUrls.length === 0) {
                alert("Error uploading images");
                setLoading(false);
                return;
            }

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

    if (loading) {
        return <div className="loader"><CircularProgress /></div>;
    }

    if (done) {
        return (
            <div className='finished-posting-car'>
                <h1>Car successfully posted!</h1>
                <Button variant="contained" color="success" onClick={() => navigate("/account")}>Click here to proceed</Button>
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
                        fontSize: {
                        xs: '4vw', // Dimensiune pentru ecrane mici
                        sm: '2vw', // Dimensiune pentru ecrane medii
                        md: '2.5vw', // Dimensiune pentru ecrane mai mari
                        },
                    }}
                    gutterBottom
                >
                    Add your car details:
                </Typography>
                <Grid container spacing={3} sx={{justifyContent: 'center'}}>
                    <TextField
                        variant='outlined'
                        label="Title"
                        name="title"
                        ref={titleRef}
                        placeholder="Write a descriptive title for your car"
                        sx={{width: '60%', marginTop: '20px',marginBottom: 2 }}
                    />
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                name="brand"
                                label="Brand"
                                variant='outlined'
                                value={carData.brand}
                                onChange={(e) => { setSelectedBrand(e.target.value); handleChange(e); }}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Model</InputLabel>
                            <Select
                                name="model"
                                label="model"
                                value={carData.model}
                                onChange={handleChange}
                            >   
                                {carData.brand ? (
                                <MenuItem value="">Choose</MenuItem>) :
                                <MenuItem value="">Choose the brand first</MenuItem>}
                                {filteredModels.map((model) => (
                                    <MenuItem key={model} value={model}>{model}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Body Type</InputLabel>
                            <Select
                                name="body"
                                label="Body Type"
                                variant='outlined'
                                value={carData.body}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                {bodies.map((body) => (
                                    <MenuItem key={body} value={body}>{body}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="VIN"
                            name="vin"
                            value={carData.vin}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Mileage"
                            name="mileage"
                            type="number"
                            value={carData.mileage}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Year"
                            name="year"
                            type="number"
                            value={carData.year}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={carData.price}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl sx={{ width: "110px" }}>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                fullWidth
                                label="Currency"
                                name="currency"
                                value={carData.currency}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="€">€</MenuItem>
                                <MenuItem value="Ron">Ron</MenuItem>
                                <MenuItem value="£">£</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{}}>
                            <InputLabel>Condition</InputLabel>
                            <Select
                                fullWidth
                                label="Condition"
                                name="condition"
                                value={carData.condition}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="NEW">New</MenuItem>
                                <MenuItem value="USED">Used</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{}}>
                            <InputLabel>Color</InputLabel>
                            <Select
                                fullWidth
                                label="Color"
                                name="color"
                                value={carData.color}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                {colors.map((color) => 
                                    <MenuItem key={color} value={color}>{color}</MenuItem>
                                    )}
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Engine capacity(cm³)"
                            name="cm3"
                            type="number"
                            value={carData.cm3}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Engine displacement(hp)"
                            name="hp"
                            type="number"
                            value={carData.hp}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{}}>
                            <InputLabel>Fuel Type</InputLabel>
                            <Select
                                fullWidth
                                label="Fuel Type"
                                name="fuelType"
                                value={carData.fuelType}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="PETROL">Petrol</MenuItem>
                                <MenuItem value="DIESEL">Diesel</MenuItem>
                                <MenuItem value="GPL">GPL</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                                <MenuItem value="ELECTRIC">Electric</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{}}>
                            <InputLabel>Gearbox</InputLabel>
                            <Select
                                fullWidth
                                label="Gearbox"
                                name="transmission"
                                value={carData.transmission}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="MANUAL">Manual</MenuItem>
                                <MenuItem value="AUTOMATIC">Automatic</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{}}>
                            <InputLabel>Steeringwheel</InputLabel>
                            <Select
                                fullWidth
                                label="Steeringwheel"
                                name="steeringwheel"
                                value={carData.steeringwheel}
                                onChange={handleChange}
                            >   
                                <MenuItem value="">Choose</MenuItem>
                                <MenuItem value="LEFT">Left Side</MenuItem>
                                <MenuItem value="RIGHT">Right Side</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Number of doors"
                            name="numberOfDoors"
                            type="number"
                            value={carData.numberOfDoors}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextareaAutosize
                            minRows={3}
                            ref={descriptionRef}
                            name="description"
                            placeholder="Describe the car"
                            style={{ width: '90%', minHeight: '100px' , backgroundColor: 'hsla(0, 0%, 7%, 0.658)' , color: 'white'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            Upload Images
                            <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
                        </Button>
                    </Grid>
                    <Grid 
                        container
                        spacing={2} // Spațiu între elemente
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


                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    // disabled={!agreed || errors || descError}
                    style={{ marginTop: '20px' }}
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
