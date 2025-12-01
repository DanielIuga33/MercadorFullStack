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
        backgroundColor: '#2B2B2B', 
        width: 'auto',
        minHeight: '100vh',
      }}
      className="home"
    >
        {/* SearchBar Section - Stânga */}
        <Box 
            sx={{
                // 1. Lățimea (Width)
                // Pe telefon (xs) vrem să fie mare (90-95%) ca să poți apăsa ușor.
                // Pe laptop (md) revenim la 18% (sidebar).
                width: { xs: '30%', md: '18%' }, 

                // 2. Lățimea Minimă (minWidth)
                // Pe telefon punem 'auto' sau '0' ca să nu forțeze ecranul dacă telefonul e mic.
                // Pe laptop păstrăm regula ta de 320px.
                minWidth: { xs: 'auto', md: '320px' }, 

                // 3. Lățimea Maximă (maxWidth)
                maxWidth: '500px',
                
                // Opțional: Centrare pe mobil (ca să nu stea lipit de stânga)
                margin: { xs: '0 auto', md: '0' } 
            }}
        >
            <SearchBar 
                searchFilters={searchFilters} 
                setSearchFilters={setSearchFilters} 
            />
        </Box>

        {/* Divider Vertical */}
        {/* MainPage Section - Dreapta */}
        <Box 
          sx={{
            borderLeft: '2px solid hsl(10, 70%, 0%)',
            flex: 1,
            width: {xs:'60%'}
            }}>
            <MainPage 
              searchFilters={searchFilters} 
              setCarData={setCarData} 
            />
        </Box>
  </Box>
  );
};

export default Home