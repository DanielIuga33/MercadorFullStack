import React, {useEffect, useState } from 'react'
import axios from 'axios';
import './Step1.css';

const Step1 = ({ formData, setFormData, nextStep }) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const doNextStep = () => {
        const { name, surname , email, password, confirmPassword } = formData;

        if (!name || !surname || !email  || !password){
            setErrorMessage('You need to complete all the fields!');
            return;
        } else if (!confirmPassword){
            setErrorMessage("You need to confirm the password !");
            return;
        } else if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return; // Opriți execuția funcției dacă parolele nu se potrivesc
        } else if (emailError){
            return;
        }
        
        // Dacă parolele se potrivesc, poți continua cu următorii pași
        setErrorMessage('');
        console.log('Passwords match. Proceeding to the next step...');
        nextStep();
        // Aici poți face redirect, sau orice altă acțiune pentru următorul pas
    };

    useEffect(() => {
        const { name, surname, email, password, confirmPassword } = formData;
        if (name && surname && email && password && confirmPassword) {
            setErrorMessage('');
        }
    }, [formData]);

    useEffect(() => {
        if (formData.email) {
          const checkEmail = async () => {
            try {
              const response = await axios.get('http://localhost:8080/api/users/check-email', {
                params: { email: formData.email }
              });
              if (response.data) {
                setEmailError('Email already exists');
              } else {
                setEmailError('');
              }
            } catch (error) {
              console.error('Error checking email:', error);
            }
          };
    
          checkEmail();
        } else {
          setEmailError('');
        }
      }, [formData.email]);

    return (
        <div className='step1-container'>
            <h2>Personal Information and Password</h2>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="surname">Surname:</label>
                    <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Enter your surname"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="username">Username*:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Create your username"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div>
                    <label id="cfpassword" htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {emailError && <p className="error">{emailError}</p>}
                <button type="button" onClick={doNextStep}>Next</button>
            </form>
        </div>
    );
};

export default Step1