import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage({ setUserData, returning}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
      });

      if (response.status === 200) {
          // Redirect to homepage or dashboard
          console.log(response);
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Wrong email or password !');
        } else {
            //console.log(error.response.status);
            setError('An error occurred. Please try again.');
        }
    }
    try {
      const response = await axios.get('http://localhost:8080/api/users/findByEmail', {
        params: { email: email }
      });
      if (response.status === 200) {
          const user = response.data;
          setUserData(user); // Setează datele utilizatorului în starea globală
          console.log(response.data);
          if (returning === 1){
            navigate('/account');
          } else{
          navigate('/');
          }
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Wrong email or password !');
        } else if(error.response && error.response.status === 404){
          setError('Wrong email or password !');
        } else {
            //console.log(error.response.status);
            setError('An error occurred. Please try again.');
        }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default LoginPage;
