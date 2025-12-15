import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import AccountDetails from './components/accountDetails/AccountDetails';
import Account from './components/account/Account';
import PostACar from './components/postACar/PostACar';
import CarDetails from './components/carDetails/CarDetails';
import ConversationTab from './components/conversations/ConversationTab'
import useSessionStorage from './hooks/useSessionStorage';
import UserCars from './components/userCars/UserOwnCars';
import { useEffect , useState} from 'react';
import axios from 'axios';
import API_URL from '../src/index'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CarEditing from './components/carEditing/CarEdtiting';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5252',
    },
  },
});

function App() {
  const [userData, setUserData] = useSessionStorage('userData', {
    id: '',
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    country: '',
    county: '',
    city: '',
    street: '',
    role: '',
    carIds: []
  });

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
  useEffect(() =>{
    const cleanup = async () =>{
        try{
          await axios.delete(`${API_URL}/cleanup-images`);
        } catch (error){
          console.error('Error cleaning unused photos:', error);
        }
    }
    cleanup();
  },[])

  const [unreadMessages, setUnreadMessages] = useState(0);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <div className='App.js'>
          <Header userData={userData} setUserData={setUserData} unreadMessages={unreadMessages} setUnreadMessages={setUnreadMessages}/>
          <Routes>
            <Route path="/" element={<Home searchFilters={searchFilters} setSearchFilters={setSearchFilters}/>} />

            <Route path="/account" element={<Account userData={userData}/>} />
            <Route path="/account/details" element={<AccountDetails userData={userData} setUserData={setUserData}/>} />
            <Route path="/account/conversations" element={<ConversationTab userData={userData} unreadMessages={unreadMessages} setUnreadMessages={setUnreadMessages}/>} />
            <Route path="/account/cars" element={<UserCars userData={userData}/>} />
            <Route path="/account/postACar" element={<PostACar userData={userData} setUserData={setUserData}/>}/>

            <Route path="/login" element={<LoginPage setUserData={setUserData} returning={0}/>} />
            <Route path="/login/account" element={<LoginPage setUserData={setUserData} returning={1}/>} />
      
            <Route path="/register" element={<RegisterPage userData={userData} setUserData={setUserData} returning={0}/>} />
            <Route path="/register/account" element={<RegisterPage userData={userData} setUserData={setUserData} returning={1}/>} />
            <Route path="/carDetails/:id" element={<CarDetails userData={userData}/>} />
            <Route path="/account/cars/:id" element={<CarEditing userData={userData}/>}/>
            <Route path="/conversations" element={<ConversationTab userData={userData} unreadMessages={unreadMessages} setUnreadMessages={setUnreadMessages}/>} />
          </Routes>
        </div>
    </ThemeProvider>
  );
}

export default App;
