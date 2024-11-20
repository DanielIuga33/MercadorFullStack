import React from 'react';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({searchFilters, setSearchFilters, setCarData}) => {

  return (
    <div className='home'>
      <SearchBar searchFilters={searchFilters} setSearchFilters={setSearchFilters}/>
      <div className='separator'>
      </div>
      <MainPage searchFilters={searchFilters} setCarData={setCarData}/>
    </div>
  )
}

export default Home