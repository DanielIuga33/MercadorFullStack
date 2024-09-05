import React from 'react';
import './AccountDetails.css';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const AccountDetails = ({ userData }) => {
    const navigate = useNavigate();
    // useEffect(() => {
    //     if (!userData.email){
    //         navigate('/account');
    //     } 
    // });
    const handleChange = () => {
    };
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('')
    return (
        <div className='account-details-container'>
            <div>
                <h2>Personal Information and Password</h2>
                <div className='container-details'>
                    <form className='first-row'>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userData.name}
                                readOnly = "true"
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
                                value={userData.surname}
                                readOnly = "true"
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
                                value={userData.username}
                                readOnly = "true"
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
                                value={userData.email}
                                readOnly = "true"
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birthDate">Birth Date:</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={userData.birthDate}
                                readOnly = "true"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="country">Country:</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={userData.country}
                                readOnly = "true"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={userData.city}
                                readOnly = "true"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="street">Street:</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={userData.street}
                                readOnly = "true"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {emailError && <p className="error">{emailError}</p>}
                        <div className='buttons'>
                            <button type="button">Edit </button>
                            <button type="button">Submit change </button>
                        </div>
                        </form>
                    <form className='second-row'>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userData.password}
                                readOnly = "true"
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                readOnly = "true"
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails