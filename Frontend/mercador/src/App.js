import React, {useState} from 'react';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import AccountDetails from './components/accountDetails/AccountDetails';
import Account from './components/account/Account';
import PostACar from './components/postACar/PostACar';
import CarDetails from './components/carDetails/CarDetails';

function App() {

  const [userData, setUserData] = useState({
      id: '',
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      country: '',
      city: '',
      street: '',
      role: '',
      carIds: []
});

const [carData, setCarData] = useState({
  id: '',
  title: '',
  brand: '',
  model: '',
  body: '',
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
  ownerEmail: userData.email,
  images: []
});

  return (
    <div className='App.js'>
      <Header userData={userData} setUserData={setUserData}/>
      <Routes>
        <Route path="/" element={<Home userData={userData} setCarData={setCarData}/>} />

        <Route path="/account" element={<Account userData={userData}/>} />
        <Route path="/account/details" element={<AccountDetails userData={userData}/>} />
        <Route path="/account/postACar" element={<PostACar userData={userData}/>}/>

        <Route path="/login" element={<LoginPage setUserData={setUserData} returning={0}/>} />
        <Route path="/login/account" element={<LoginPage setUserData={setUserData} returning={1}/>} />
  
        <Route path="/register" element={<RegisterPage userData={userData} setUserData={setUserData} returning={0}/>} />
        <Route path="/register/account" element={<RegisterPage userData={userData} setUserData={setUserData} returning={1}/>} />

        <Route path="/carDetails" element={<CarDetails carData={carData}/>} />
      </Routes>
    </div>
  );
}

export default App;
