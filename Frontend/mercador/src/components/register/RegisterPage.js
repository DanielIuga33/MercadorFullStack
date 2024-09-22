import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Step1 from './Step1';
import Step2 from './Step2';
import './RegisterPage.css';

const API_URL = 'http://localhost:8080/api/users';

const RegisterPage = ({ setUserData, returning}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    country: '',
    city: '',
    street: '',
    role: "USER",
    carIds: []
  });

  const [step, setStep] = useState(1);
  const navigate = useNavigate();


  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const sendData = async (formData) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const finalStep = async () => {
    try {
      console.log(formData);
      await sendData(formData); // Trimite datele la server
      setUserData(formData); // Actualizează starea cu datele utilizatorului
     // Navighează către pagina home
    } catch (error) {
      console.error('Failed to register:', error);
      return false;
    }
  };

  const goHome = () => {
    if (returning === 1){
      navigate('/account');
    } else{
    navigate('/');
    }
  }

  return (
    <div className="App">
      {step === 1 && (
        <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && finalStep() &&(
        <div className='done'>
          <h1>Hello and Welcome {formData.surname || formData.username}</h1>
          <h1>You successfully registered your account !</h1>
          <button type='button' onClick={goHome}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
