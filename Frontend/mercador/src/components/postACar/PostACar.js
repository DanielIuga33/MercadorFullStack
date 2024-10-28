import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostACar.css';
import { brands, modelsByBrand, bodies, colors } from '../carData';

const PostACar = ({userData}) => {
    const MAX_IMAGES = 9;
    const API_URL = 'http://localhost:8080/api/cars';
    const IMAGE_UPLOAD_URL = 'http://localhost:8080/api/upload'; // URL pentru încărcarea imaginilor
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState('');
    
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
        setCarData({...carData, [name]: value});
    };

    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            setImages(files);
            return;
        }
        setImages(prev => [...prev, ...files]);
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
        setErrors('');
        setLoading(true);
        
        try {
            // Încărcăm imaginile și obținem URL-urile acestora
            const imageUrls = await uploadImages();
            if (imageUrls.length === 0) {
                alert("Error uploading images");
                setLoading(false);
                return;
            }

            // Actualizăm `carData` cu URL-urile imaginilor
            const updatedCarData = { ...carData, images: imageUrls };

            // Trimitere date mașină
            console.log(updatedCarData);
            await axios.post(API_URL, updatedCarData);
            setDone(true);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loader"></div>;
    }

    if (done) {
        return (
            <div className='finished-posting-car'>
                <h1>Car successfully posted!</h1>
                <button onClick={() => navigate("/account")}>Click here to proceed</button>
            </div>
        );
    }

    return (
        <div className='postCar-main-container'>
            <div className='frame'>
                <h1> Add here your car details: </h1>
                <div className='table'>
                    <div className='col'>
                        <div className="packet">
                            <div className='row'>
                                <label id="title-label">Title</label>
                                <input 
                                    id="title-input"
                                    name="title"
                                    type="text" 
                                    value={carData.title}
                                    onChange={handleChange}
                                    placeholder='Write a descriptive title for your car'
                                    required
                                />
                            </div>
                        </div>
                        <div className="packet">
                            <div className='row'>
                                <label>Brand</label>
                                <select 
                                    id="brand" 
                                    name="brand"
                                    onChange={(e) => {setSelectedBrand(e.target.value); handleChange(e)}}
                                >
                                    <option value="">see all</option>
                                    {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='row'>
                                <label>Model</label>
                                <select 
                                    id="model" 
                                    name="model"
                                    onChange={handleChange}
                                >
                                    <option value="">choose</option>
                                    {filteredModels.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label>Body type</label>
                                <select 
                                    id="body" 
                                    name="body"
                                    onChange={handleChange}
                                >
                                    <option value="">see all</option>
                                    {bodies.map((body) => (
                                        <option key={body} value={body}>{body}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='row'>
                                <label>VIN</label>
                                <input 
                                    id="vin"
                                    name="vin"
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder='car vin'
                                />
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label >Mileage</label>
                                <input 
                                    id="mileage"
                                    name="mileage"
                                    onChange={handleChange}
                                    type="number" 
                                    placeholder='car milleage'
                                />
                            </div>

                            <div className='row'>
                                <label >Year</label>
                                <input 
                                    id="year"
                                    name="year"
                                    onChange={handleChange}
                                    type="number" 
                                    placeholder='car year'
                                />
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label >Price</label>
                                <input 
                                    id="price"
                                    name="price"
                                    onChange={handleChange}
                                    type="number" 
                                    placeholder='car price'
                                />
                            </div>
                            <div className='packet'>
                                <div className="row">
                                    <label>Euro</label>
                                    <input 
                                        type='radio' 
                                        name="currency" 
                                        value={" €"}
                                        onClick={handleChange}
                                    />
                                </div>
                                <div className="row">
                                    <label>Ron</label>
                                    <input 
                                        type='radio' 
                                        name="currency" 
                                        value={"Ron"}
                                        onClick={handleChange}
                                    />
                                </div>
                                <div className="row">
                                    <label>Lire</label>
                                    <input 
                                        type='radio' 
                                        name="currency" 
                                        value={"£"}
                                        onClick={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label >State</label>
                                <select
                                    name="condition"
                                    onChange={handleChange}
                                >
                                    <option value="">choose</option>
                                    <option value="NEW">New</option>
                                    <option value="USED">Used</option>
                                </select>
                            </div>
                            <div className='row'>
                                <label >Color</label>
                                <select
                                    name="color"
                                    onChange={handleChange}
                                >
                                    <option value="">choose</option>
                                    {colors.map((color) => 
                                    <option key={color} value={color}>{color}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='col'>
                        <div className='packet'>
                        <div className='row'>
                                <label id="label-engine-capacity">Engine capacity</label>
                                <input 
                                    name="cm3"
                                    onChange={handleChange}
                                    type="number" 
                                    placeholder='cm³'
                                />
                        </div>
                        <div className='row'>
                                <label>Hp power</label>
                                <input 
                                    name="hp"
                                    onChange={handleChange}
                                    type="number" 
                                    placeholder='hp'
                                />
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label>Fuel type</label>
                                <select
                                    name="fuelType"
                                    onChange={handleChange}
                                >
                                    <option value="" >see all</option>
                                    <option value="PETROL">Petrol</option>
                                    <option value="DIESEL">Diesel</option>
                                    <option value="GPL">GPL</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="ELECTRIC">Electric</option>
                                </select>
                            </div>
                            <div className='row'>
                                <label>Gearbox</label>
                                <select
                                    name="transmission"
                                    onChange={handleChange}
                                >
                                    <option value="">choose</option>
                                    <option value="MANUAL">Manual</option>
                                    <option value="AUTOMATIC">Automatic</option>
                                </select>
                            </div>
                        </div>
                        <div className='packet'>
                            <div className='row'>
                                <label>Steeringwheel</label>
                                <select
                                    name="steeringwheel"
                                    onChange={handleChange}
                                >
                                    <option value="">choose</option>
                                    <option value="LEFT">Left</option>
                                    <option value="RIGHT">Right</option>
                                </select>
                            </div>
                            <div className='row'>
                                <label id="label-no-doors">Number of Doors</label>
                                <input 
                                    name="numberOfDoors"
                                    onChange={handleChange}
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <label>Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple // Permite încărcarea mai multor imagini
                                onChange={handleImageUpload}
                            />
                            <div className='imagesGrid'>
                                {images.length === 0 && <h2>No images selected</h2>}
                                {images.map((image, index) => 
                                    <img 
                                        key={index} 
                                        alt='No Car' 
                                        src={URL.createObjectURL(image)} 
                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='row'>
                            <label>Description</label>
                            <textarea
                                id="desc"
                                name="description"
                                onChange={handleChange}
                            />
                        </div>
                        <p>Description must have at least 40 words</p>
                        <div className="btn">
                            <button type='button' onClick={handleSubmit}>Sumbit and post</button>
                        </div>
                        <p className='error'>{errors}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostACar

