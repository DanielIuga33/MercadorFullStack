import React from 'react';
import './Account.css';
import { useNavigate } from 'react-router-dom';

const Account = ({userData}) => {
  const navigate = useNavigate();
  return (
    <div>
      {(!userData.email &&
        <div className='no-account-container'>
            <h2> You are not logged in or registered !</h2>
            <span>
              <button onClick={() => window.location.href = '/login/account'}> Login</button>
              <button onClick={() => window.location.href = '/register/account'}> Register</button>
            </span>
        </div>) ||
          <div className="account-container">
            <div className='display'>
                <h1>Welcome <em>{userData.username || userData.surname}</em> !</h1>
                <span>
                  <div className='firstPart'>
                    <button onClick={() => navigate('/account/postACar')}>Post a Car</button>
                    <button>View your cars ({(userData.carIds).length > 0 || 'no'} cars posted)</button>
                  </div>
                  <div className='divider'></div>
                  <div className='secondPart'>
                    <button>Notifications</button>
                    <button onClick={() => navigate('/account/details')}>View/Edit account details</button>
                  </div>
                </span>
            </div>
          </div>
        }
    </div>
  )
}

export default Account