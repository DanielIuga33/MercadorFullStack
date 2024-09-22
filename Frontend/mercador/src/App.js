// import React, { useEffect, useState } from 'react';
import React, {useState} from 'react';
//import axios from 'axios';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import AccountDetails from './components/accountDetails/AccountDetails';
import Account from './components/account/Account';
import PostACar from './components/postACar/PostACar';

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

  return (
    <div className='App.js'>
      <Header userData={userData} setUserData={setUserData}/>
      <Routes>
        <Route path="/" element={<Home userData={userData}/>} />

        <Route path="/account" element={<Account userData={userData}/>} />
        <Route path="/account/details" element={<AccountDetails userData={userData}/>} />
        <Route path="/account/postACar" element={<PostACar userData={userData}/>}/>

        <Route path="/login" element={<LoginPage setUserData={setUserData} returning={0}/>} />
        <Route path="/login/account" element={<LoginPage setUserData={setUserData} returning={1}/>} />
  
        <Route path="/register" element={<RegisterPage userData={userData} setUserData={setUserData} returning={0}/>} />
        <Route path="/register/account" element={<RegisterPage userData={userData} setUserData={setUserData} returning={1}/>} />
      </Routes>
    </div>
  );
}

export default App;
