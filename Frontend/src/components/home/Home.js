import {useState} from 'react'
import { Box, Button} from '@mui/material';
import './Home.css';
import '../searchbar/SearchBar';
import SearchBar from '../searchbar/SearchBar';
import MainPage from '../mainPage/MainPage';

const Home = ({searchFilters, setSearchFilters, setCarData}) => {
  const [shown , setShown] = useState(false);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: "row",
        gap: 1, // Spațiere între coloane
        padding: 0, // Spațiere interioară
        backgroundColor: '#2B2B2B', 
        width: 'auto',
        minHeight: '70vh'
      }}
      className="home"
    >
      <Box>
          <Button 
            onClick={() => {shown ? setShown(false) : setShown(true)}}
            sx={{
                // 1. Resetăm lățimea minimă a MUI pentru a permite butonul subțire
                minWidth: '30px', 
                width: '30px',
                
                // 2. Stiluri pentru text vertical
                writingMode: 'vertical-rl', // Scrie de sus în jos
                textOrientation: 'upright', // Ține literele drepte (nu le rotește la 90 de grade)
                
                // 3. Estetică (ca să arate ca în exemplul tău)
                textTransform: 'uppercase', // Transformă totul în MAJUSCULE
                letterSpacing: '2px',       // Spațiu între litere
                padding: '10px 0',          // Padding sus-jos
                
                // 4. Stilurile tale vechi
                border: '2px solid red',
                borderRadius: '2px',
                backgroundColor: 'rgba(36, 36, 36, 0.78)', // Opțional: puțin fundal
                height: '90vh',
                borderColor: 'rgba(91, 89, 89, 0.92)',
                color: 'rgba(190, 190, 190, 0.92)',
                "&:hover": {backgroundColor: 'rgba(35, 35, 35, 0.78)'},
            }}
          > 
          {shown ?
          "Hide" : "Show"} Filters
          </Button>
        </Box>
        {/* SearchBar Section - Stânga */}
        {shown &&
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
        </Box>}

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