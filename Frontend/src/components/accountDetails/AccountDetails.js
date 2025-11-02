import React from 'react';
import './AccountDetails.css';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import path from '../..';

const AccountDetails = ({ userData, setUserData}) => {
    const navigate = useNavigate();
    

    useEffect(() => {
        if (!userData.email) navigate('/account');
    }, [navigate, userData.email]);


    /// COL 1
    const [formData, setFormData] = useState(userData);
    const [borderColors, setBorderColors] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [errorMsgFirstCol, setErrorMsgFirstCol] = useState('');

    const [emailOnFocus, setEmailOnFocus] = useState(false);
    const [arontErr, setArontErr] = useState(false);
    const [finishErr, setFinishErr] = useState(false);
    const [emailLenErr, setEmailLenErr] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);

    const showDiv = () => {
        setIsVisible(true);
        // Setăm un timeout pentru a ascunde div-ul după 5 secunde
        setTimeout(() => {
        setIsVisible(false);
        }, 5000); 
    };

    const showDiv1 = () => {
        setIsVisible1(true);
        // Setăm un timeout pentru a ascunde div-ul după 5 secunde
        setTimeout(() => {
        setIsVisible1(false);
        }, 5000); 
    };

    const handleChangeColor = (id) => {
        setBorderColors(prevState => ({ ...prevState, [id]: 'red' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBorderColors({ ...borderColors, [name]: '' });
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!password) {
            return;
        }
        const email = userData.email;
        setErrorMsgSecondCol1('');
        try {
            const response = await axios.post(`${path}/auth/login`, {
                email,
                password
            });
    
            if (response.status === 200) {
                setPasswordsMatch(true);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMsgSecondCol1('Wrong password!');
                } else {
                    setErrorMsgSecondCol1(`An error occurred: ${error.response.statusText}`);
                }
            } else {
                setErrorMsgSecondCol1('Network error. Please try again later.');
            }
        }
    }

    useEffect(() => {
        if (formData.email) {
            const validateEmail = () =>{
                let ok = true;
                if (formData.email.length <= 6){
                    setEmailLenErr(true);
                    ok = false;
                }else{
                    setEmailLenErr(false);
                }
                if (!formData.email.includes("@")){
                    setArontErr(true);
                    ok = false;
                }else{
                    setArontErr(false);
                }
                if (!formData.email.slice(formData.email.length - 4, formData.email.length).includes(".com") &&
                    !formData.email.slice(formData.email.length - 3, formData.email.length).includes(".ro")){
                    setFinishErr(true);
                    ok = false;
                }else{
                    setFinishErr(false);
                }

                return ok;
            }
            const ok = validateEmail();
            setEmailError("");
            if (!ok) return;
            const checkEmail = async () => {
                try {
                    const response = await axios.get(`${path}/users/check-email`, {
                        params: { email: formData.email }
                    });
                    if (response.data && emailOnFocus && !isReadOnly) {
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
    }, [formData.email, emailOnFocus, isReadOnly]);

    
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
        if (!formData.country) {
            handleChangeColor("county");
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
            setErrorMsgFirstCol('You need to complete all the fields!');
            return;
        }else{
            setErrorMsgFirstCol("");
            if (!emailError) setIsReadOnly(true);
            updateUser(formData.id, formData);
        }
    };

    /// COL 1 END

    /// COL 2
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [errorMsgSecondCol1, setErrorMsgSecondCol1] = useState('');
    const [errorMsgSecondCol2, setErrorMsgSecondCol2] = useState('');
    const [password, setPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [cfnpassword, setcfnPassword] = useState('');

    const [charErr, setCharErr] = useState(false);
    const [noNrErr, setNoNrErr] = useState(false);
    const [noUpperErr, setNoUpperErr] = useState(false);

    useEffect(() => {
        if (newpassword){
            if (newpassword.length < 8 || newpassword.length > 16){
                setCharErr(true);
            } else{
                setCharErr(false);
            }
            if (!/\d/.test(newpassword)){
                setNoNrErr(true);
            }else{
                setNoNrErr(false);
            }
            if (newpassword.toLowerCase() === newpassword){
                setNoUpperErr(true);
            }else{
                setNoUpperErr(false);
            }
        } else{
            setCharErr(false);
            setNoNrErr(false);
            setNoUpperErr(false);
        }
    },[newpassword])


    useEffect(() => {
        if (!password) {
            setErrorMsgSecondCol1("");
        }
    }, [password]);

    const exit = () => {
        setPasswordsMatch(false);
        setcfnPassword('');
        setnewPassword('');
    };


    useEffect(() => {
        if (newpassword && cfnpassword && newpassword !== cfnpassword) {
            setErrorMsgSecondCol2('Passwords does not match !');
        } else {
            setErrorMsgSecondCol2('');
        }
    }, [newpassword, cfnpassword]);

    
    const changePassword = () => {
        if (!newpassword){
            setErrorMsgSecondCol2('You need to complete the password field !');
            return;
        }
        if (newpassword === password){
            setErrorMsgSecondCol2('You cannot put the same password !');
            return;
        }
        if (charErr || noNrErr || noUpperErr) return;
        if (!cfnpassword){
            setErrorMsgSecondCol2('You need to confirm the password !');
            return;
        }
        if (!errorMsgSecondCol2 && !charErr && !noNrErr && !noUpperErr){
            formData.password = newpassword;
            updateUser(formData.id, formData);
            exit();
        } 
    };
    /// COL 2 END



    const updateUser = async (id, userData) => {
        try {
            await axios.patch(`http://localhost:8080/api/users/${id}`, userData);
            setUserData(userData);
            if (!newpassword) showDiv();
            else showDiv1();
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
                                onFocus={() => setEmailOnFocus(true)}
                                onBlur={() => setEmailOnFocus(false)}
                                placeholder="Enter your email"
                                style={{ borderColor: borderColors['email'], borderWidth: '2px', borderStyle: 'solid' }}
                                required
                            />
                        </div>
                        {formData.email && <div className='check-email'>
                            {(arontErr && formData.email) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must contain @ !</i></span>)}

                            {(finishErr && formData.email) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must finish with .com or .ro !</i></span>)}

                            {(emailLenErr && formData.email) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must have at least 10 letters !</i></span>)}
                        </div>}
                        {(errorMsgFirstCol || emailError) &&<div className='check-email'>
                            {errorMsgFirstCol && <span><i className="fas fa-times" style={{ color: "red" }}></i><i className="error"> {errorMsgFirstCol}</i></span>}
                            {emailError && <span><i className="fas fa-times" style={{ color: "red" }}></i><i className="error"> {emailError}</i></span>}
                        </div>}
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
                            <button disabled={passwordsMatch} type="button" onClick={() => setIsReadOnly(!isReadOnly)}>Edit </button>
                            <button disabled={passwordsMatch} type="button" onClick={submit}>Submit change </button>
                        </div>
                        {isVisible && <div className='check' >
                            <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Changes successfully made !</i></span>
                        </div>}
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
                                    readOnly = {!isReadOnly || passwordsMatch}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="your password"
                                    required
                                />
                            </div>
                            <button disabled={!isReadOnly || passwordsMatch} type="button" onClick={handleSubmit}>Submit your password</button>
                            <div className='check'>
                                {errorMsgSecondCol1 && <span><i className="fas fa-times" style={{ color: "red" }}></i><i> {errorMsgSecondCol1}</i></span>}
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
                            {passwordsMatch &&<div className='check'>
                                {(charErr && newpassword) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must be between 8 and 16 characters !</i></span>)}

                                {(noNrErr && newpassword) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must contain numbers !</i></span>)}

                                {(noUpperErr && newpassword) && (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must contain at least one uppercase letter !</i></span>)}
                            </div>}
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
                        <div className='check'>
                                {errorMsgSecondCol2 && <span><i className="fas fa-times" style={{ color: "red" }}></i><i>{errorMsgSecondCol2}</i></span>}
                        </div>)}
                        {isVisible1 && <div className='check' >
                            <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Changes successfully made !</i></span>
                        </div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails