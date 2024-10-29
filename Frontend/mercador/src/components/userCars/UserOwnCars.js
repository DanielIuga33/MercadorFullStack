import React from 'react';
import './UserOwnCars.css';

const UserOwnCars = ({userData}) => {
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