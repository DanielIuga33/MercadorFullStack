import React from 'react';
import {useState, useEffect} from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Aici poți prelua datele din formular și le poți trimite către backend sau le poți folosi local
    };
    const brands = [
        "Abart", "Acura", "Aixam", "Alfa Romeo", "Aro", "Aston Martin", "Audi", "Austin", "Baic", "Bentley", "BMW",
        "Bugatti", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroen", "Comarth", "Dacia", "Daewoo", "Daihatsu",
        "DFSK", "Dodge", "Ferrari", "Fiat", "Fisker", "Ford", "Minibus", "Honda", "Hummer", "Hyundai", "Ineos",
        "Infiniti", "Isuzu", "Jaguar", "Jeep", "KG Mobility", "Kia", "Lada", "Lamborghini", "Lancia", "Land Rover",
        "Lexus", "Ligier", "Lincoln", "Lotus", "Lucid", "Lynk&Co", "Maserati", "Mazda", "McLaren", "Maybach", "Merceds-Benz",
        "MG", "Microlinio", "Mini", "Mitsubishi", "Microcar", "Morgan", "Nissan","Opel","Peugeot","Plymouth","Pontiac",
        "Porsche","Renault","Rolls-Royce","Rover","Saab","Seat","Skoda","Smart","SsangYong","Skywell","Subaru","Suzuki",
        "Tesla","Tata","Tazzari","Toyota","Trabant","Triumph","Vauxhall","Volkswagen","Volvo","Weismann","Alte marci",
        "JAC","SWM","Forthing","XEV"
      ];

    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);

    useEffect(() => {
        if (selectedBrand && modelsByBrand[selectedBrand]) {
            setFilteredModels(modelsByBrand[selectedBrand]);
        } else {
            setFilteredModels([]);
        }
    }, [selectedBrand]);
    

    const bodies = ["Cabrio", "Sedan", "Coupe", "Pickup", "HatchBack", "Break", "Off-road", "Minibus", "Monovolum", "SUV" ];
    const colors = ["Red", "Blue", "Black", "White", "Silver", "Grey", "Green", "Yellow", "Brown", "Orange", "Purple"];

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
                            <option value="" selected>see all</option>
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
                            <option value="" selected>see all</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="color1" className="row">Color</div>
                        <select id="color" name="color">
                            <option value="" selected>choose</option>
                            {colors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div id="steeringWheel1" className="row">Steeringwheel</div>
                        <select id="steeringWheel" name="steeringWheel">
                            <option value="" selected>choose</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                        </select>
                    </div>
                </div>
                
                <div className='line'>
                    <div>
                        <div id="state1" className="row">State</div>
                        <select id="state" name="state">
                            <option value="" selected>choose</option>
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

const modelsByBrand = {
    Abart: ["500", "595", "124 Spider"],
    Acura: ["ILX", "MDX", "NSX", "RDX", "RLX", "TLX"],
    Aixam: ["City", "Crossline", "Coupé", "Scouty"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Giulietta", "4C", "Spider"],
    Aro: ["10", "24", "244", "324"],
    "Aston Martin": ["DB11", "DBX", "Vantage", "DBS", "Rapide"],
    Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "R8"],
    Austin: ["Mini", "A30", "A40", "Healey"],
    Baic: ["X25", "X35", "BJ40", "Senova D50"],
    Bentley: ["Continental", "Bentayga", "Flying Spur", "Mulsanne"],
    BMW: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5", "Series 6", "Series 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4"],
    Bugatti: ["Chiron", "Veyron", "Divo", "La Voiture Noire"],
    Buick: ["Encore", "Enclave", "Regal", "LaCrosse"],
    Cadillac: ["Escalade", "XT4", "XT5", "CT6", "CTS", "ATS"],
    Chevrolet: ["Camaro", "Corvette", "Impala", "Silverado", "Suburban", "Tahoe", "Trax"],
    Chrysler: ["300", "Pacifica", "Voyager"],
    Citroen: ["C1", "C3", "C4", "C5 Aircross", "Berlingo", "SpaceTourer"],
    Comarth: ["XTamy", "Cross Rider", "S1", "XTamy4"],
    Dacia: ["Duster", "Sandero", "Logan", "Lodgy", "Dokker"],
    Daewoo: ["Matiz", "Nubira", "Lanos", "Leganza"],
    Daihatsu: ["Terios", "Copen", "Sirion", "Materia"],
    DFSK: ["Glory 580", "C31", "C35", "C37"],
    Dodge: ["Challenger", "Charger", "Durango", "Ram"],
    Ferrari: ["488", "Portofino", "Roma", "F8", "812", "SF90"],
    Fiat: ["500", "Panda", "Tipo", "Punto", "Doblo", "500X", "500L"],
    Fisker: ["Karma", "Ocean"],
    Ford: ["Fiesta", "Focus", "Mustang", "Kuga", "Edge", "Explorer", "Ranger", "F-150"],
    Honda: ["Civic", "Accord", "CR-V", "Jazz", "HR-V", "Pilot", "Fit"],
    Hummer: ["H1", "H2", "H3", "EV"],
    Hyundai: ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona"],
    Ineos: ["Grenadier"],
    Infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80"],
    Isuzu: ["D-Max", "MU-X", "Trooper", "Rodeo"],
    Jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "F-Type"],
    Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Renegade", "Compass", "Gladiator"],
    "KG Mobility": ["Tivoli", "Rexton", "Korando", "Musso"],
    Kia: ["Rio", "Ceed", "Sportage", "Sorento", "Stonic", "Stinger", "Niro"],
    Lada: ["Niva", "Granta", "Vesta", "XRay"],
    Lamborghini: ["Aventador", "Huracan", "Urus"],
    Lancia: ["Ypsilon", "Delta", "Thema"],
    "Land Rover": ["Defender", "Discovery", "Range Rover", "Evoque", "Velar"],
    Lexus: ["IS", "ES", "GS", "LS", "RX", "NX", "UX"],
    Ligier: ["JS50", "JS60", "Pulse 3"],
    Lincoln: ["Navigator", "Aviator", "Corsair", "Continental"],
    Lotus: ["Elise", "Exige", "Evora"],
    Lucid: ["Air", "Gravity"],
    "Lynk&Co": ["01", "02", "03", "05", "06", "09"],
    Maserati: ["Ghibli", "Quattroporte", "Levante", "GranTurismo"],
    Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "MX-5"],
    McLaren: ["570S", "720S", "GT", "P1"],
    Maybach: ["S-className", "GLS"],
    "Merceds-Benz": ["A-className", "C-className", "E-className", "S-className", "GLA", "GLC", "GLE", "GLS", "G-className", "Vito", "Sprinter"],
    MG: ["ZS", "HS", "5", "MG4"],
    Microlinio: ["Lite", "Pioneer", "Ranger"],
    Mini: ["Cooper", "Clubman", "Countryman"],
    Mitsubishi: ["Mirage", "Outlander", "ASX", "L200"],
    Microcar: ["M.Go", "M8", "Dué"],
    Morgan: ["Plus Four", "Plus Six"],
    Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Navara"],
    Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland"],
    Peugeot: ["208", "308", "508", "2008", "3008", "5008"],
    Plymouth: ["Barracuda", "Fury", "Road Runner"],
    Pontiac: ["Firebird", "GTO", "Bonneville"],
    Porsche: ["911", "Cayenne", "Panamera", "Taycan", "Macan", "Boxster", "Cayman"],
    Renault: ["Clio", "Megane", "Captur", "Kadjar", "Koleos", "Talisman"],
    "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Cullinan"],
    Rover: ["200", "400", "600", "800"],
    Saab: ["9-3", "9-5", "900", "9000"],
    Seat: ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco"],
    Skoda: ["Fabia", "Octavia", "Superb", "Kodiaq", "Karoq"],
    Smart: ["ForTwo", "ForFour"],
    SsangYong: ["Tivoli", "Korando", "Rexton", "Musso"],
    Skywell: ["ET5", "ET6"],
    Subaru: ["Impreza", "Legacy", "Outback", "Forester", "XV", "WRX"],
    Suzuki: ["Swift", "Vitara", "S-Cross", "Jimny"],
    Tesla: ["Model S", "Model 3", "Model X", "Model Y"],
    Tata: ["Nexon", "Safari", "Harrier"],
    Tazzari: ["Zero", "Em2"],
    Toyota: ["Yaris", "Corolla", "Camry", "RAV4", "Land Cruiser", "Hilux"],
    Trabant: ["601", "P50", "1.1"],
    Triumph: ["Herald", "TR6", "Spitfire"],
    Vauxhall: ["Corsa", "Astra", "Insignia"],
    Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Touareg", "T-Roc", "ID.3", "ID.4"],
    Volvo: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
    Weismann: ["MF3", "MF4", "GT"],
    "Alte marci": ["Dacia 1300", "ARO M461", "ARO 244"],
    JAC: ["S2", "S3", "S5"],
    SWM: ["G01", "X3", "X7"],
    Forthing: ["T5 EVO", "Thunder EV"],
    XEV: ["Yoyo"],
};
