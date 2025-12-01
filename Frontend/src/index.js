import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
    /* IP LOCAL */
// const API_URL = "http://localhost:8080/api";
    /*TESTE PT PC*/
const API_URL = "http://192.168.1.128:8080/api";
    /*IP HAMACHI PC*/
// const API_URL = "http://25.37.228.158:8080/api";
    /*IP HAMACHI LAPTOP*/
// const API_URL = "http://25.37.211.179:8080/api";
export default API_URL;
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />}/>
      </Routes>    
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
