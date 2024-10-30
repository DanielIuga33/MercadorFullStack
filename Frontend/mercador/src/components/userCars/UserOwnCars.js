import React, { useEffect } from 'react';
import axios from 'axios';
import './UserOwnCars.css';

const UserOwnCars = ({userData}) => {

  useEffect(() => {
    try{
       const response = axios.get()
    } catch(error){
      console.log(error);
    }
  }[userCars])
  return (
    <div className='ownCars'>
        <div className='container'>
            <div className='container-principal'>
                <p>{(userData.name)} da</p>
            </div>
        </div>
    </div>
  )
}

export default UserOwnCars