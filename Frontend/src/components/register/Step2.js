import React, { useState, useEffect} from 'react';
import { cityByRegion, regionsByCountry, countries} from '../ConstantData';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Step2.css";

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
    
    const [errorMessage, setErrorMessage] = useState('');
    const [borderColors, setBorderColors] = useState({});
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCounty, setSelectedCounty] = useState('');
    const [filteredCounties, setFilteredCounties] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (selectedCountry && regionsByCountry[selectedCountry]) {
            setFilteredCounties(regionsByCountry[selectedCountry]);
        } else {
            setFilteredCounties([]);
        }
    }, [selectedCountry]);

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lunile încep de la 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (selectedCounty && cityByRegion[selectedCounty]) {
            setFilteredCities(cityByRegion[selectedCounty].sort());
        } else {
            setFilteredCities([]);
        }
    }, [selectedCounty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setBorderColors({ ...borderColors, [name]: '' }); // Resetăm border-ul la modificare
    };

    const handleChangeColor = (id) => {
        setBorderColors(prevState => ({ ...prevState, [id]: 'red' }));
    };

    const doNextStep = () => {
        let hasError = false;

        if (!formData.birthDate) {
            handleChangeColor("birthDate");
            hasError = true;
        }
        if (!formData.country) {
            handleChangeColor("country");
            hasError = true;
        }
        if (!formData.city) {
            handleChangeColor("city");
            hasError = true;
        }
        if (!formData.street) {
            handleChangeColor("street");
            hasError = true;
        }

        if (hasError) {
            setErrorMessage('You need to complete all the fields!');
            return;
        }

        nextStep();
    };

    return (
        <div className='step2-container'>
            <form>
                <h2>More information about you: </h2>
                <div>
                    <label htmlFor="birthDate">Birth Date:</label>
                    <DatePicker
                        id="birthDate"
                        selected={selectedDate} // Trebuie să fie un obiect de tip Date
                        onChange={(date) => {
                            setSelectedDate(date); // Actualizează data selectată în format Date
                            setFormData({ ...formData, birthDate: formatDate(date) }); // Actualizează și formData
                            setBorderColors((prev) => ({ ...prev, birthDate: '' })); // Resetăm border-ul
                        }}
                        style={{
                            borderColor: borderColors['birthDate'],
                            borderWidth: '2px',
                            borderStyle: 'solid',
                        }}
                        dateFormat="dd.MM.yyyy" // Formatare personalizată
                        placeholderText="Selectează o dată"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <select
                        type="text"
                        id="country"
                        name="country"
                        onChange={(e) => {setSelectedCountry(e.target.value);handleChange(e)}}
                        style={{ borderColor: borderColors['country'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    >
                        <option value="">see all</option>
                            {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="county">County:</label>
                    <select
                        id="county"
                        name="county"
                        onChange={(e) => {setSelectedCounty(e.target.value);handleChange(e)}}
                        style={{ borderColor: borderColors['county'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    >
                        <option value="">see all</option>
                            {filteredCounties.map((county) => (
                        <option key={county} value={county}>{county}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{ borderColor: borderColors['city'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    >
                        <option value="">see all</option>
                            {filteredCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="street" id="streetText">Street and Number:</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        style={{ borderColor: borderColors['street'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className='buttons'>
                    <button type="button" onClick={prevStep}>Back</button>
                    <button type="button" onClick={doNextStep}>Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step2;
