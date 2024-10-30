import React from 'react';
import './AccountDetails.css';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountDetails = ({ userData, setUserData}) => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState(userData);
    const [borderColors, setBorderColors] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [errorMsgFirstRow, setErrorMsgFirstRow] = useState('');
    const [errorMsgSecondRow1, setErrorMsgSecondRow1] = useState('');
    const [errorMsgSecondRow2, setErrorMsgSecondRow2] = useState('');
    const [password, setPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [cfnpassword, setcfnPassword] = useState('');


    useEffect(() => {
        if (!userData.email) navigate('/account');
    }, [navigate, userData.email]);

    const handleChangeColor = (id) => {
        setBorderColors(prevState => ({ ...prevState, [id]: 'red' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBorderColors({ ...borderColors, [name]: '' });
        setFormData({...formData, [name]: value});
    };
    
    const edit = () => {
        setIsReadOnly(!isReadOnly);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!userData.email || !password) {
          setErrorMsgSecondRow1('Wrong password.');
          return;
        }
        const email = userData.email;
        setErrorMsgSecondRow1('');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });
    
            if (response.status === 200) {
                setPasswordsMatch(true);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMsgSecondRow1('Wrong password!');
                } else {
                    setErrorMsgSecondRow1(`An error occurred: ${error.response.statusText}`);
                }
            } else {
                setErrorMsgSecondRow1('Network error. Please try again later.');
            }
        }
    }

    useEffect(() => {
        if (formData.email !== userData.email) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [formData.email]);

    const submit = () => {
        let hasError = false;
        if (!formData.name) {
            handleChangeColor("name");
            hasError = true;
        }
        if (!formData.surname) {
            handleChangeColor("surname");
            hasError = true;
        }
        if (!formData.email) {
            handleChangeColor("email");
            hasError = true;
        }
      
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
            setErrorMsgFirstRow('You need to complete all the fields!');
            return;
        }else{
            setErrorMsgFirstRow("");
            if (!emailError) setIsReadOnly(true);
            updateUser(formData.id, formData);
        }
    };

    const exit = () => {
        setPasswordsMatch(false);
        setcfnPassword('');
        setnewPassword('');
    };

    useEffect(() => {
        if (newpassword && cfnpassword && newpassword !== cfnpassword) {
            setErrorMsgSecondRow2('Passwords does not match !');
        } else {
            setErrorMsgSecondRow2('');
        }
    }, [newpassword, cfnpassword]);

    const changePassword = () => {
        if (!newpassword){
            setErrorMsgSecondRow2('You need to complete the password field !');
            return;
        }
        if (!errorMsgSecondRow2){
            formData.password = newpassword;
            updateUser(formData.id, formData);
            exit();
        } 
    };

    const updateUser = async (id, userData) => {
        try {
            await axios.patch(`http://localhost:8080/api/users/${id}`, userData);
            setUserData(userData);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    

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
                                value={formData.name}
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                style={{ borderColor: borderColors['name'], borderWidth: '2px', borderStyle: 'solid' }}
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
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                placeholder="Enter your surname"
                                style={{ borderColor: borderColors['surname'], borderWidth: '2px', borderStyle: 'solid' }}
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
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                placeholder="Create your username"
                                style={{ borderColor: borderColors['username'], borderWidth: '2px', borderStyle: 'solid' }}
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
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={{ borderColor: borderColors['email'], borderWidth: '2px', borderStyle: 'solid' }}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birthDate">Birth Date:</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                readOnly = {isReadOnly}
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
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                style={{ borderColor: borderColors['country'], borderWidth: '2px', borderStyle: 'solid' }}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="county">County:</label>
                            <input
                                type="text"
                                id="county"
                                name="county"
                                value={formData.county}
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                style={{ borderColor: borderColors['county'], borderWidth: '2px', borderStyle: 'solid' }}
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
                                readOnly = {isReadOnly}
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
                                readOnly = {isReadOnly}
                                onChange={handleChange}
                                style={{ borderColor: borderColors['street'], borderWidth: '2px', borderStyle: 'solid' }}
                                required
                            />
                        </div>
                        <div className='buttons'>
                            <button type="button" onClick={edit}>Edit </button>
                            <button type="button" onClick={submit}>Submit change </button>
                        </div>
                        <div className='errors'>
                            {errorMsgFirstRow && <p className="error">{errorMsgFirstRow}</p>}
                            {emailError && <p className="error">{emailError}</p>}
                        </div>
                        </form>
                    <form className='second-row'>
                        <h3>CHANGE YOUR PASSOWRD</h3>
                        <span>
                            <div>
                                <label htmlFor="password">Account Password:</label>
                                <input
                                    type="password"
                                    id="oldpassword"
                                    name="oldpassword"
                                    readOnly = {false}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="your password"
                                    required
                                />
                            </div>
                            <button type="button" onClick={handleSubmit}>Submit your password</button>
                            <div className='errors'>
                                {errorMsgSecondRow1 && <p className="error">{errorMsgSecondRow1}</p>}
                            </div>
                            {(passwordsMatch &&
                            <div>
                                <label htmlFor="password">New Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={newpassword}
                                    readOnly = {false}
                                    onChange={(e) => setnewPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>)}
                            {(passwordsMatch &&
                            <div>
                                <label htmlFor="confirmPassword">Confirm New Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={cfnpassword}
                                    readOnly = {false}
                                    onChange={(e) => setcfnPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                            )}
                        </span>
                        {passwordsMatch && (
                        <div className='buttons'>
                            <button type="button" onClick={changePassword}>Submit change</button>
                            <button type="button" onClick={exit}>Cancel</button>
                        </div>)}
                        {passwordsMatch && (
                        <div className='errors'>
                                {errorMsgSecondRow2 && <p className="error">{errorMsgSecondRow2}</p>}
                            </div>)}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails