import React from 'react';
import {useState, useEffect} from 'react';
import './SearchBar.css';
import { brands, modelsByBrand, bodies, colors } from '../ConstantData';

const SearchBar = ({searchFilters, setSearchFilters}) => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [currentSearchFilters, setCurrentSearchFilters] = useState(searchFilters);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSearchFilters({...currentSearchFilters, [name]: value});
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setSearchFilters(currentSearchFilters);
    };

    const handleReset = (event) => {
        event.preventDefault();
        setSearchFilters([]);
        setCurrentSearchFilters([])
    }

    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);
    
    return (
        <div className="sidebar">
            <h2>Search Filters</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="cauta" 
                    name="title" 
                    placeholder="Search by title"
                    onChange={handleChange}
                    value={currentSearchFilters.title || ""}
                />
                <button id="submit" name="submit ">Search</button>
                <div className="line">
                <button id="reset" name="reset " onClick={handleReset}>Reset filters</button>
                    <p>Sort by:</p>
                    <select
                        id="sort" 
                        name="sort"
                        onChange={(e) => {setSelectedBrand(e.target.value); handleChange(e)}}
                        value={currentSearchFilters.sort || ""}
                    >  
                        <option value="">see all</option>
                        <option value={"YearDescending"}>Year Descending</option>
                        <option value={"YearAscending"}>Year Ascending</option>
                        <option value={"PriceDescending"}>Price Descending</option>
                        <option value={"PriceAscending"}>Price Ascending</option>
                        <option value={"MileageDescending"}>Mileage Descending</option>
                        <option value={"MileageAscending"}>Mileage Ascending</option>
                    </select>
                </div>
                <div className="line">
                    <div>
                        <div id="brand1" className="row">Brand</div>
                        <select 
                            id="brand" 
                            name="brand"
                            onChange={(e) => {setSelectedBrand(e.target.value); handleChange(e)}}
                            value={currentSearchFilters.brand || ""}
                        >
                            <option value="">see all</option>
                            {brands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div id="model1" className="row">Model</div>
                        <select 
                            id="model" 
                            name="model"
                            onChange={handleChange}
                            value={currentSearchFilters.model || ""}
                        >
                            <option value="">choose</option>
                            {filteredModels.map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div id="body1" className="row">Car Body</div>
                <select 
                    id="body" 
                    name="body"
                    onChange={handleChange}
                    value={currentSearchFilters.body || ""}
                >
                    <option value="" >choose</option>
                    {bodies.map((body) => (
                        <option key={body} value={body}>{body}</option>
                    ))}
                </select>

                <div id="km" className="row">Mileage</div>
                <input type="number" name="kmStart"  placeholder="From" onChange={handleChange} value={currentSearchFilters.kmStart || ""}/>
                <input type="number" name="kmEnd"  placeholder="To" onChange={handleChange} value={currentSearchFilters.kmEnd || ""}/>

                <div id="years" className="row">Year of fabricatiom</div>
                <input type="number" name="yearStart"  placeholder="From" onChange={handleChange} value={currentSearchFilters.yearStart || ""}/>
                <input type="number" name="yearEnd"  placeholder="To" onChange={handleChange} value={currentSearchFilters.yearEnd || ""}/>

                <div id="prices" className="row">Price</div>
                <input type="number" name="priceStart"  placeholder="From" onChange={handleChange} value={currentSearchFilters.priceStart || ""}/>
                <input type="number" name="priceEnd"  placeholder="To" onChange={handleChange} value={currentSearchFilters.priceEnd || ""}/>

                <div id="cm3" className="row">Engine capacity cm³</div>
                <input type="number" name="cm3Start"  placeholder="From" onChange={handleChange} value={currentSearchFilters.cm3Start || ""}/>
                <input type="number" name="cm3End"  placeholder="To" onChange={handleChange} value={currentSearchFilters.cm3End || ""}/>

                <div id="hp" className="row">HP power</div>
                <input type="number" name="hpStart"  placeholder="From" onChange={handleChange} value={currentSearchFilters.hpStart || ""}/>
                <input type="number" name="hpEnd"  placeholder="To" onChange={handleChange} value={currentSearchFilters.hpEnd || ""}/>
                <div className='line'>
                    <div>
                        <div id="fuel1" className="row">Fuel</div>
                        <select 
                            id="fuel" 
                            name="fuelType"
                            onChange={handleChange}
                            value={currentSearchFilters.fuelType || ""}
                        >
                            <option value="" >see all</option>
                            <option value="PETROL">Petrol</option>
                            <option value="DIESEL">Diesel</option>
                            <option value="GPL">GPL</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="ELECTRIC">Electric</option>
                        </select>
                    </div>
                    <div>
                        <div id="gearBox1" className="row">Gearbox</div>
                        <select 
                            id="gearBox" 
                            name="transmission"
                            onChange={handleChange}
                            value={currentSearchFilters.transmission || ""}
                        >
                            <option value="" >see all</option>
                            <option value="MANUAL">Manual</option>
                            <option value="AUTOMATIC">Automatic</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="color1" className="row">Color</div>
                        <select 
                            id="color"
                            name="color"
                            onChange={handleChange}
                            value={currentSearchFilters.color || ""}
                        >
                            <option value="" >choose</option>
                            {colors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div id="steeringWheel1" className="row">Steeringwheel</div>
                        <select 
                            id="steeringWheel" 
                            name="steeringwheel"
                            onChange={handleChange}
                            value={currentSearchFilters.steeringwheel || ""}
                        >
                            <option value="" >choose</option>
                            <option value="LEFT">Left</option>
                            <option value="RIGHT">Right</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="state1" className="row">State</div>
                        <select 
                            id="state" 
                            name="condition"
                            onChange={handleChange}
                            value={currentSearchFilters.condition || ""}
                        >
                            <option value="" >choose</option>
                            <option value="NEW">New</option>
                            <option value="USED">Used</option>
                        </select>
                    </div>
                    <div>
                        <div id="nodoors" className="row">Number of Doors</div>
                        <input 
                            type="number" 
                            name="numberOfDoors"  
                            placeholder="How many doors?"
                            onChange={handleChange}
                            value={currentSearchFilters.numberOfDoors || ""} 
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchBar

