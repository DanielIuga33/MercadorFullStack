import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostACar.css';

const PostACar = ({userData}) => {
    const MAX_IMAGES = 9;
    const API_URL = 'http://localhost:8080/api/cars';
    const IMAGE_UPLOAD_URL = 'http://localhost:8080/api/upload'; // URL pentru încărcarea imaginilor
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [images, setImages] = useState([]); // Stocăm URL-urile imaginilor
    // const [descriptionError, setDescriptionError] = useState('');
    
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
        if (files.length + imageFiles.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }
        setImageFiles(prev => [...prev, ...files]);
    };

    const uploadImages = async () => {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('images', file));
    
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
            alert('You need to complete all the required fields!');
            return;
        }

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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostACar

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
const bodies = ["Cabrio", "Sedan", "Coupe", "Pickup", "HatchBack", "Break", "Off-road", "Minibus", "Monovolum", "SUV" ];
const colors = [
    "Almond", "Alpine White", "Amethyst", "Anthracite", "Aqua", "Arctic White", "Azure", "Beige", "Black", 
      "Black Cherry", "Black Diamond", "Black Pearl", "Black Sapphire", "Blue", "Blue Diamond", "Blue Metallic", 
      "Brilliant Black", "Brilliant Blue", "Bronze", "Brown", "Burgundy", "Candy Apple Red", "Carbon Black", 
      "Cavansite Blue", "Champagne", "Charcoal", "Cobalt Blue", "Copper", "Cream", "Crimson", "Crystal White", 
      "Dark Blue", "Dark Green", "Dark Red", "Daytona Gray", "Deep Black Pearl", "Deep Blue", "Deep Green", 
      "Desert Sand", "Designo Diamond White", "Designo Manufaktur", "Designo Selenite Gray Magno", 
      "Diamond Silver", "Dove Gray", "Electric Blue", "Emerald Green", "Estoril Blue", "Floret Silver", 
      "Forest Green", "Frozen Brilliant White", "Frozen Silver", "Frozen White", "Glacier Blue", "Glacier White", 
      "Gold", "Graphite", "Gray", "Green", "Gunmetal", "Ice Blue", "Ibis White", "Indium Gray", "Iridium Silver", 
      "Ivory", "Jet Black", "Lapis Blue", "Lava Orange", "Lavender", "Le Mans Blue", "Lime Green", 
      "Limestone Gray", "Magenta", "Maroon", "Matte Black", "Melbourne Red", "Midnight Blue", "Mineral White", 
      "Mint Green", "Misano Red", "Moonlight Silver", "Mojave Silver", "Mythos Black", "Nardo Gray", 
      "Navarra Blue", "Navy Blue", "Night Blue", "Ocean Blue", "Olive Green", "Onyx Black", "Orange", 
      "Oryx White Pearl", "Pale Blue", "Pearl White", "Phantom Black", "Pink", "Platinum", "Platinum Gray", 
      "Polar White", "Pure White", "Purple", "Racing Green", "Raven Black", "Red", "Reflex Silver", 
      "Riviera Blue", "Rose Gold", "Ruby Red", "Saffron", "San Marino Blue", "Sand", "Sapphire Black", 
      "Sapphire Blue", "Sepang Blue", "Shadow Black", "Silver", "Sky Blue", "Slate Gray", "Slenite Gray", 
      "Snow White", "Sophisto Gray", "Steel Blue", "Storm Gray", "Sunset Orange", "Super White", "Suzuka Gray", 
      "Tan", "Tango Red", "Tanzanite Blue", "Teal", "Titanium", "Tornado Red", "Turquoise", "Vesuvius Gray", 
      "Viper Green", "White", "Yellow"
  ];
