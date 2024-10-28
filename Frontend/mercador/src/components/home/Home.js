import React from 'react';
import { useState } from 'react';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({userData, setCarData}) => {
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    brand: '',
    model: '',
    body: '',
    yearStart: '',
    yearEnd: '',
    cm3Start: '',
    cm3End: '',
    hpStart: '',
    hpEnd: '',
    kmStart: '',
    kmEnd: '',
    priceStart: '',
    priceEnd: '',
    color: '',
    fuelType: '',
    numberOfDoors: '',
    transmission: '',
    condition: '',
    steeringwheel: '',
    sort: '',
  })

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