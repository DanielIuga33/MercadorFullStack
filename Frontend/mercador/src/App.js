// import React, {useState} from 'react';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import AccountDetails from './components/accountDetails/AccountDetails';
import Account from './components/account/Account';
import PostACar from './components/postACar/PostACar';
import CarDetails from './components/carDetails/CarDetails';
import useLocalStorage from './hooks/useLocalStorage';
import UserCars from './components/userCars/UserOwnCars';
import { useEffect } from 'react';
import axios from 'axios';


function App() {

  const [userData, setUserData] = useLocalStorage('userData', {
    id: '',
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
    role: '',
    carIds: []
  });

  const [carData, setCarData] = useLocalStorage('carData', {
    id: '',
    title: '',
    brand: '',
    model: '',
    body: '',
    vin: '',
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
  useEffect(() =>{
    const cleanup = async () =>{
        try{
            const response = await axios.delete('http://localhost:8080/api/cleanup-images');
            console.log(response.data);
        } catch (error){
          console.error('Error cleaning unused photos:', error);
        }
    }
    cleanup();
  },[])
  return (
    <div className='App.js'>
      <Header userData={userData} setUserData={setUserData}/>
      <Routes>
        <Route path="/" element={<Home userData={userData} setCarData={setCarData}/>} />

        <Route path="/account" element={<Account userData={userData}/>} />
        <Route path="/account/details" element={<AccountDetails userData={userData} setUserData={setUserData}/>} />
        <Route path="/account/cars" element={<UserCars userData={userData}/>} />
        <Route path="/account/postACar" element={<PostACar userData={userData}/>}/>

        <Route path="/login" element={<LoginPage setUserData={setUserData} returning={0}/>} />
        <Route path="/login/account" element={<LoginPage setUserData={setUserData} returning={1}/>} />
  
        <Route path="/register" element={<RegisterPage userData={userData} setUserData={setUserData} returning={0}/>} />
        <Route path="/register/account" element={<RegisterPage userData={userData} setUserData={setUserData} returning={1}/>} />

        <Route path="/carDetails" element={<CarDetails carDataId={carData.id}/>} />
      </Routes>
    </div>
  );
}

export default App;
