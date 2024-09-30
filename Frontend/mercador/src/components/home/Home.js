import React from 'react';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({userData, setCarData}) => {
  return (
    <div className='home'>
      <SearchBar/>
      <div className='separator'>
      </div>
      <MainPage setCarData={setCarData}/>
    </div>
  )
}

export default Home