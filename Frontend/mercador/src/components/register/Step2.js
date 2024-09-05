import React, { useState } from 'react';
import "./Step2.css";

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
    
    const [errorMessage, setErrorMessage] = useState('');
    const [borderColors, setBorderColors] = useState({});

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
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        style={{ borderColor: borderColors['birthDate'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        style={{ borderColor: borderColors['country'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{ borderColor: borderColors['city'], borderWidth: '2px', borderStyle: 'solid' }}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="street">Street:</label>
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
