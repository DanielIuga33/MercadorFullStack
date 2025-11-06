import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Step1 from './Step1';
import Step2 from './Step2';
import './RegisterPage.css';
import API_URL from '../..';

const RegisterPage = ({ setUserData, returning}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
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
        await axios.post(`${API_URL}/users`, formData, {
        headers: {  
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const finalStep = async () => {
    try {
      await sendData(formData); // Trimite datele la server
      const response = await axios.get(`${API_URL}/users/findByEmail`, {
          params: { email: formData.email }
      });
      if (response.status === 200)
          setUserData(response.data); // Actualizează starea cu datele utilizatorului
     // Navighează către pagina home
    } catch (error) {
      console.error('Failed to register:', error);
      return false;
    }
  };

  const goHome = () => {
    finalStep();
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
      {step === 3 &&(
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
