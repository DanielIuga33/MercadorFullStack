import React from 'react';
import {useState, useEffect} from 'react';
import './SearchBar.css';
import { brands, modelsByBrand, bodies, colors } from '../carData';

const SearchBar = () => {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        // Aici poți prelua datele din formular și le poți trimite către backend sau le poți folosi local
    };

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
                <input type="text" id="cauta" name="cauta" placeholder="Search by title"></input>
                <button id="submit" name="submit ">Search</button>
                <div className="line">
                    <div>
                        <div id="brand1" className="row">Brand</div>
                        <select 
                            id="brand" 
                            name="brand"
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="">see all</option>
                            {brands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div id="model1" className="row">Model</div>
                        <select id="model" name="model">
                            <option value="">choose</option>
                            {filteredModels.map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div id="body1" className="row">Car Body</div>
                <select id="body" name="body">
                    <option value="" >choose</option>
                    {bodies.map((body) => (
                        <option key={body} value={body}>{body}</option>
                    ))}
                </select>

                <div id="km" className="row">Milleage</div>
                <input type="number" name="kmStart"  placeholder="From" ></input>
                <input type="number" name="kmEnd"  placeholder="To" ></input>

                <div id="years" className="row">Year of fabricatiom</div>
                <input type="number" name="yearStart"  placeholder="From" ></input>
                <input type="number" name="yearEnd"  placeholder="To" ></input>

                <div id="prices" className="row">Price</div>
                <input type="number" name="priceStart"  placeholder="From" ></input>
                <input type="number" name="priceEnd"  placeholder="To" ></input>

                <div id="cm3" className="row">Engine capacity cm³</div>
                <input type="number" name="cm3Start"  placeholder="From" ></input>
                <input type="number" name="cm3End"  placeholder="To" ></input>

                <div id="hp" className="row">HP power</div>
                <input type="number" name="hpStart"  placeholder="From" ></input>
                <input type="number" name="hpEnd"  placeholder="To" ></input>
                <div className='line'>
                    <div>
                        <div id="fuel1" className="row">Fuel</div>
                        <select id="fuel" name="fuel">
                            <option value="" >see all</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="GPL">GPL</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                        </select>
                    </div>
                    <div>
                        <div id="gearBox1" className="row">Gearbox</div>
                        <select id="gearBox" name="gearBox">
                            <option value="" >see all</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="color1" className="row">Color</div>
                        <select id="color" name="color">
                            <option value="" >choose</option>
                            {colors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div id="steeringWheel1" className="row">Steeringwheel</div>
                        <select id="steeringWheel" name="steeringWheel">
                            <option value="" >choose</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="state1" className="row">State</div>
                        <select id="state" name="state">
                            <option value="" >choose</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>
                    <div>
                        <div id="nodoors" className="row">Number of Doors</div>
                        <input type="number" name="nrdoors"  placeholder="How many doors?" ></input>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchBar

