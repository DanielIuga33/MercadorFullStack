import React from 'react';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({userData}) => {
  return (
    <div className='home'>
      <SearchBar/>
      <div className='separator'>
      </div>
      <MainPage></MainPage>
    </div>
  )
}

export default Home