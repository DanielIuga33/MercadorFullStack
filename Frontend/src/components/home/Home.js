import React from 'react';
import { Box} from '@mui/material';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({searchFilters, setSearchFilters, setCarData}) => {

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: "row",
        gap: 1, // Spațiere între coloane
        padding: 0, // Spațiere interioară
        backgroundColor: '#2B2B2B', // Fundal gri deschis
        minHeight: '100vh',
      }}
      className="home"
    >
        {/* SearchBar Section - Stânga */}
        <Box  sx={{width: '18%', minWidth: '320px', maxWidth: '500px'}}>
            <SearchBar 
              searchFilters={searchFilters} 
              setSearchFilters={setSearchFilters} 
            />
        </Box>

        {/* Divider Vertical */}
        {/* MainPage Section - Dreapta */}
        <Box sx={{borderLeft: '2px solid hsl(10, 70%, 0%)', flex: 1}}>
            <MainPage 
              searchFilters={searchFilters} 
              setCarData={setCarData} 
            />
        </Box>
  </Box>
  );
};

export default Home