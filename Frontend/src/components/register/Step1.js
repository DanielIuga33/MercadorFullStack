import React, {useEffect, useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import './Step1.css';

const Step1 = ({ formData, setFormData, nextStep }) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    const [emailOnFocus, setEmailOnFocus] = useState(false);
    const [arontErr, setArontErr] = useState(false);
    const [finishErr, setFinishErr] = useState(false);
    const [emailLenErr, setEmailLenErr] = useState(false);

    const [pwdOnFocus, setPwdOnFocus] = useState(false);
    const [charErr, setCharErr] = useState(false);
    const [noNrErr, setNoNrErr] = useState(false);
    const [noUpperErr, setNoUpperErr] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const doNextStep = () => {
        const { name, surname, email, password, confirmPassword } = formData;
        if (!name || !surname || !email  || !password){
            setErrorMessage(' You need to complete all the fields!');
            return;
        }else if (charErr || noNrErr || noUpperErr || arontErr || finishErr || emailLenErr){
            return;
        } else if (!confirmPassword){
            setErrorMessage(" You need to confirm the password !");
            return;
        } else if (password !== confirmPassword) {
            setErrorMessage(' Passwords do not match!');
            return; // Opriți execuția funcției dacă parolele nu se potrivesc
        } else if (emailError){
            return;
        }
        
        // Dacă parolele se potrivesc, poți continua cu următorii pași
        setErrorMessage('');
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

      useEffect(() => {
        if (formData.password){
            if (formData.password.length < 8 || formData.password.length > 16){
                setCharErr(true);
            } else{
                setCharErr(false);
            }
            if (!/\d/.test(formData.password)){
                setNoNrErr(true);
            }else{
                setNoNrErr(false);
            }
            if (formData.password.toLowerCase() === formData.password){
                setNoUpperErr(true);
            }else{
                setNoUpperErr(false);
            }
        } else{
            setCharErr(false);
            setNoNrErr(false);
            setNoUpperErr(false);
        }
    },[formData.password])


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
                        onFocus={() => setEmailOnFocus(true)}
                        onBlur={() => setEmailOnFocus(false)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                {formData.email && <div className='check'>
                    {(arontErr && formData.email) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must contain @ !</i></span>) :
                    (emailOnFocus && formData.email && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Email must contain @ !</i></span>)}

                    {(finishErr && formData.email) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must finish with .com or .ro !</i></span>) :
                    (emailOnFocus && formData.email && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Email must finish with .com or .ro !</i></span>)}

                    {(emailLenErr && formData.email) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Email must have at least 10 letters !</i></span>) :
                    (emailOnFocus && formData.email && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Email must have at least 10 letters !</i></span>)}
                </div>}
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        onFocus={() => setPwdOnFocus(true)}
                        onBlur={() => setPwdOnFocus(false)}
                        required
                    />
                </div>
                {formData.password &&<div className='check'>
                    {(charErr && formData.password) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must be between 8 and 16 characters !</i></span>) :
                    (pwdOnFocus && formData.password && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Password must be between 8 and 16 characters !</i></span>)}

                    {(noNrErr && formData.password) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must contain numbers !</i></span>) :
                    (pwdOnFocus && formData.password && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Password must contain numbers !</i></span>)}

                    {(noUpperErr && formData.password) ? (<span><i className="fas fa-times" style={{ color: "red" }}></i><i id="red"> Password must contain at least one uppercase letter !</i></span>) :
                    (pwdOnFocus && formData.password && <span><i className="fas fa-check" style={{ color: "green" }}></i><i id="green"> Password must contain at least one uppercase letter !</i></span>)}
                </div>}
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
                <div className='check-fin'>
                    {errorMessage && <span className='error'><i className="fas fa-times" style={{ color: "red" }}></i><i>{errorMessage}</i></span>}
                    {emailError && <span className='error'><i className="fas fa-times" style={{ color: "red" }}></i><i>{emailError}</i></span>}
                </div>
                <button type="button" onClick={doNextStep}>Next</button>
            </form>
        </div>
    );
};

export default Step1