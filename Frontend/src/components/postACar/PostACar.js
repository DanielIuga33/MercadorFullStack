import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, TextareaAutosize, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';
import './PostACar.css';

const PostACar = ({ userData, setUserData }) => {
    const MAX_IMAGES = 9;
    const API_URL = 'http://localhost:8080/api/cars';
    const IMAGE_UPLOAD_URL = 'http://localhost:8080/api/upload';
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState('');
    const [descError, setDescError] = useState(false);
    const [agreed, setAgreed] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    useEffect(() => {
        if (carData.description.length < 40 && carData.description.length > 0) {
            setDescError(true);
            setAgreed(false);
        } else if (carData.description.length === 0) {
            setDescError(false);
            setAgreed(false);
        } else {
            setDescError(false);
            setAgreed(true);
        }
    }, [carData.description]);

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
            const response = await axios.post(IMAGE_UPLOAD_URL, formData, {
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
        if (carData.title === '' || carData.brand === '' || carData.model === '' || carData.year === '' || carData.price === '' || carData.description === '') {
            setErrors('You need to complete all the required fields!');
            return;
        }
        if (errors || descError) {
            return;
        }
        setErrors('');
        setLoading(true);

        try {
            const imageUrls = await uploadImages();
            if (imageUrls.length === 0) {
                alert("Error uploading images");
                setLoading(false);
                return;
            }

            const updatedCarData = { ...carData, images: imageUrls };
            await axios.post(API_URL, updatedCarData);
            const response = await axios.get('http://localhost:8080/api/users/findByEmail', {
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
        <div className='postCar-main-container'>
            <div className='frame'>
                <h1> Add your car details: </h1>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={carData.title}
                            onChange={handleChange}
                            placeholder="Write a descriptive title for your car"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                name="brand"
                                value={carData.brand}
                                onChange={(e) => { setSelectedBrand(e.target.value); handleChange(e); }}
                            >
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
                                value={carData.model}
                                onChange={handleChange}
                            >
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
                                value={carData.body}
                                onChange={handleChange}
                            >
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
                    <Grid item xs={12}>
                        <TextareaAutosize
                            minRows={3}
                            name="description"
                            value={carData.description}
                            onChange={handleChange}
                            placeholder="Describe the car"
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            Upload Images
                            <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="imagesGrid">
                            {images.map((image, index) => (
                                <img key={index} src={URL.createObjectURL(image)} alt={`img-${index}`} />
                            ))}
                        </div>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!agreed || errors || descError}
                    style={{ marginTop: '20px' }}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default PostACar;
