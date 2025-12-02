import React, { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Divider } from '@mui/material';
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';

const SearchBar = ({ searchFilters, setSearchFilters }) => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [currentSearchFilters, setCurrentSearchFilters] = useState(searchFilters);

    const customDivider = (pos) => {
        if (pos === "top")
            return <Box display={'flex'}><PlayArrowIcon sx={{color:'rgb(160, 160, 160)'}}/><Divider
                sx={{
                    width: "95%",
                    marginTop: '10px',
                    marginLeft: '-10px',
                    height: '5px',
                    backgroundColor: 'rgb(160, 160, 160)',
                    marginBottom: '10px'
                }}
            />
            </Box>
        else if (pos === "bottom")
            return <Box display={'flex'} marginTop={'-14px'} marginBottom={'10px'}><PlayArrowIcon sx={{color:'rgb(160, 160, 160)'}}/><Divider
                sx={{
                    width: "95%",
                    marginTop: '10px',
                    marginLeft: '-10px',
                    height: '5px',
                    backgroundColor: 'rgb(160, 160, 160)',
                    marginBottom: '10px'
                }}
            />
            </Box>
        else 
            return <Box display={'flex'} marginTop={'-12px'} marginBottom={'4px'}><PlayArrowIcon sx={{color:'rgb(160, 160, 160)'}}/><Divider
                sx={{
                    width: "95%",
                    marginTop: '10px',
                    marginLeft: '-10px',
                    height: '5px',
                    backgroundColor: 'rgb(160, 160, 160)',
                    marginBottom: '10px'
                }}
            />
            </Box>
            
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSearchFilters({ ...currentSearchFilters, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearchFilters(currentSearchFilters);
    };

    const handleReset = (event) => {
        event.preventDefault();
        setSearchFilters([]);
        setCurrentSearchFilters([]);
    };

    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                width: '100%',
                maxWidth: 350,
                maxHeight: '90vh', // Limitează înălțimea la dimensiunea vizibilă a paginii
                padding: 2,
                backgroundColor: 'hsl(0, 100%, 24%)',
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: 'hsl(0, 100%, 25%)', // O nuanță puțin mai deschisă
                },
                color: 'white',
                overflowY: 'auto', // Permite scroll vertical
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'hsla(0, 0%, 100%, 0.30)',
                    borderRadius: '10px',
                },

            }}

        >
            <Typography variant="h5" align="center" sx={{ marginBottom: 2, border: '1px solid gray' }}>
                Search Filters
            </Typography>
            <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleReset}
                        sx={{
                            fontWeight: 550,
                            backgroundColor: 'rgb(129, 13, 13)',
                            '&:hover': { backgroundColor: 'rgb(124, 35, 27)' },
                            color: 'hsl(0, 3.00%, 73.70%)',
                            borderColor: 'hsl(0, 3.00%, 73.70%)'
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{
                            fontWeight: 600,
                            backgroundColor: 'hsla(60, 2%, 40%, 0.74)',
                            '&:hover': { backgroundColor: 'rgba(100, 100, 95, 0.74)' },
                        }}
                    >
                        Search
                    </Button>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Search by title"
                name="title"
                onChange={handleChange}
                value={currentSearchFilters.title || ''}
                sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                    name="sort"
                    label="Sort by"
                    value={currentSearchFilters.sort || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">See all</MenuItem>
                    <MenuItem value="YearDescending">Year Descending</MenuItem>
                    <MenuItem value="YearAscending">Year Ascending</MenuItem>
                    <MenuItem value="PriceDescending">Price Descending</MenuItem>
                    <MenuItem value="PriceAscending">Price Ascending</MenuItem>
                    <MenuItem value="MileageDescending">Mileage Descending</MenuItem>
                    <MenuItem value="MileageAscending">Mileage Ascending</MenuItem>
                </Select>
            </FormControl>


            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Brand</InputLabel>
                <Select
                    name="brand"
                    label="Brand"
                    value={currentSearchFilters.brand || ''}
                    onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        handleChange(e);
                    }}
                >
                    <MenuItem value="">See all</MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                            {brand}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Model</InputLabel>
                <Select
                    name="model"
                    label="Model"
                    value={currentSearchFilters.model || ''}
                    onChange={handleChange}
                >
                    {currentSearchFilters.brand ? (
                                <MenuItem value="">Choose</MenuItem>) :
                                <MenuItem value="">Choose the brand first</MenuItem>}
                    {filteredModels.map((model) => (
                        <MenuItem key={model} value={model}>
                            {model}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Car Body</InputLabel>
                <Select
                    name="body"
                    label="Car Body"
                    value={currentSearchFilters.body || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">Choose</MenuItem>
                    {bodies.map((body) => (
                        <MenuItem key={body} value={body}>
                            {body}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {customDivider("top")}
            <TextField
                fullWidth
                size="small"
                label="Mileage From"
                name="kmStart"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.kmStart || ''}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Mileage To"
                name="kmEnd"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.kmEnd || ''}
                sx={{ marginBottom: 2 }}
            />
            {customDivider()}
            <TextField
                fullWidth
                size="small"
                label="Year From"
                name="yearStart"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.yearStart || ''}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Year To"
                name="yearEnd"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.yearEnd || ''}
                sx={{ marginBottom: 2 }}
            />
            {customDivider()}
            <TextField
                fullWidth
                size="small"
                label="Price From"
                name="priceStart"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.priceStart || ''}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Price To"
                name="priceEnd"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.priceEnd || ''}
                sx={{ marginBottom: 2 }}
            />
            {customDivider()}
            <TextField
                fullWidth
                size="small"
                label="Engine Capacity (cm³) From"
                name="cm3Start"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.cm3Start || ''}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Engine Capacity (cm³) To"
                name="cm3End"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.cm3End || ''}
                sx={{ marginBottom: 2 }}
            />
            {customDivider()}
            <TextField
                fullWidth
                size="small"
                label="Engine Power (hp) From"
                name="hpStart"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.hpStart || ''}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Engine Power (hp) To"
                name="hpEnd"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.hpEnd || ''}
                sx={{ marginBottom: 2 }}
            />
            {customDivider("bottom")}
            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                    name="fuelType"
                    label="Fuel Type"
                    value={currentSearchFilters.fuelType || ''}
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

            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Transmission</InputLabel>
                <Select
                    name="transmission"
                    label="Transmission"
                    value={currentSearchFilters.transmission  || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">Choose</MenuItem>
                    <MenuItem value="MANUAL">Manual</MenuItem>
                    <MenuItem value="AUTOMATIC">Automatic</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Color</InputLabel>
                <Select
                    name="color"
                    label="Color"
                    value={currentSearchFilters.color || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">Choose</MenuItem>
                    {colors.map((color) => (
                        <MenuItem key={color} value={color}>
                            {color}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Steeringwheel</InputLabel>
                <Select
                    name="steeringwheel"
                    label="Steeringwheel"
                    value={currentSearchFilters.steeringwheel || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">Choose</MenuItem>
                    <MenuItem value="LEFT">Left</MenuItem>
                    <MenuItem value="RIGHT">Right</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                    name="condition"
                    label="Condition"
                    value={currentSearchFilters.condition || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="">Choose</MenuItem>
                    <MenuItem value="NEW">New</MenuItem>
                    <MenuItem value="USED">Used</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                size="small"
                label="Number of doors"
                name="numberOfDoors"
                type="number"
                onChange={handleChange}
                value={currentSearchFilters.numberOfDoors || ''}
                sx={{ marginBottom: 2 }}
            />

            </form>
        </Box>
    );
};

export default SearchBar;
