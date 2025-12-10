import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../..';
import img1 from '../../images/img1.jpeg'; // Asigură-te că calea e corectă
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  TextField, 
  Alert, 
  Collapse,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Login 
} from '@mui/icons-material';

// --- DEFINIȚII DE STIL & TEMĂ (CONSTANTE) ---
const themeColors = {
    primary: 'hsl(0, 90%, 30%)',
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.75)',
    border: 'rgba(255, 255, 255, 0.1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        borderRadius: '12px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#ff4d4d' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff4d4d' },
    marginBottom: 3
};

const buttonStyle = {
    background: themeColors.gradient,
    color: 'white',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
        boxShadow: '0 6px 20px rgba(255, 0, 0, 0.2)',
    },
    '&.Mui-disabled': {
        background: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.3)'
    }
};

// Componenta de fundal (Background Wrapper)
const BackgroundWrapper = ({ children }) => (
    <Box sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
    }}>
        {/* Overlay întunecat */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1 }} />
        {/* Conținut */}
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>{children}</Box>
    </Box>
);

// --- COMPONENTA PRINCIPALĂ LOGIN ---
function LoginPage({ setUserData, returning }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Stare pentru spinner
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsLoading(true); // Pornim spinner-ul

    try {
      // 1. Autentificare
      const loginResponse = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (loginResponse.status !== 200) {
         throw new Error('Login failed');
      }

      // 2. Obținere date utilizator
      const userResponse = await axios.get(`${API_URL}/users/findByEmail`, {
        params: { email: email }
      });

      if (userResponse.status === 200) {
        let user = userResponse.data;
        const validCarIds = new Set();

        // 3. Verificare integritate mașini (Logica ta originală)
        try {
          if (user.carIds && user.carIds.length > 0) {
             // Folosim Promise.all pentru a verifica mai rapid, dar păstrăm logica de validare
             for (let elem of user.carIds) {
                try {
                    const carRes = await axios.get(`${API_URL}/cars/${elem}`);
                    if (carRes.data !== null) {
                        validCarIds.add(elem);
                    }
                } catch (err) {
                    console.log(`Car ${elem} not found or error accessing it.`);
                }
             }
             
             const uniqueCarIds = Array.from(validCarIds);

             // Dacă lista de pe server diferă de cea validată, facem update
             if (uniqueCarIds.length !== user.carIds.length) {
                user.carIds = uniqueCarIds; // Actualizăm obiectul local
                
                // Actualizăm starea globală (optimist update)
                setUserData(prevUserData => ({
                    ...prevUserData,
                    carIds: uniqueCarIds
                }));

                // Patch la server
                await axios.patch(`${API_URL}/users/${user.id}`, {
                    ...user,
                    carIds: uniqueCarIds
                });
             }
          }
        } catch (carError) {
           console.error("Error validating cars:", carError);
           // Continuăm logarea chiar dacă verificarea mașinilor dă eroare parțială
        }

        // 4. Finalizare și Redirecționare
        setUserData(user);
        setIsLoading(false); // Oprim spinner-ul

        if (returning === 1) {
          navigate('/account');
        } else {
          navigate('/');
        }
      }

    } catch (error) {
      setIsLoading(false); // Oprim spinner-ul în caz de eroare
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          setError('Wrong email or password!');
        } else {
          setError(`Error: ${error.response.statusText}`);
        }
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <BackgroundWrapper>
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{
            backgroundColor: themeColors.glass,
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            border: `1px solid ${themeColors.border}`,
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
        }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Box sx={{ 
                    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                    borderRadius: '50%', 
                    padding: 2, 
                    display: 'inline-flex',
                    mb: 2 
                }}>
                    <Login sx={{ fontSize: 40, color: '#ff4d4d' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                    Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary, mt: 1 }}>
                    Enter your credentials to access your account
                </Typography>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={inputStyle}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={inputStyle}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Collapse in={!!error}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                </Collapse>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={buttonStyle}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                    Don't have an account?{' '}
                    <span 
                        style={{ color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => navigate('/register/account')}
                    >
                        Register here
                    </span>
                </Typography>
            </Box>
        </Paper>
      </Container>
    </BackgroundWrapper>
  );
}

export default LoginPage;