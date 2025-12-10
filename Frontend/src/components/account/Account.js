import React from 'react';
import img1 from '../../images/img1.jpeg';
import { Box, Typography, Button, Divider, Grid, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Account = ({ userData }) => {
  const navigate = useNavigate();

  // Culori și stiluri comune
  const themeColors = {
    primary: 'hsl(0, 90%, 30%)', // Roșu închis de bază
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.75)', // Fundal semi-transparent întunecat
    border: 'rgba(255, 255, 255, 0.1)',
  };

  const buttonStyle = {
    background: themeColors.gradient,
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 90%, 50%) 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(200, 0, 0, 0.4)',
    },
  };

  const viewCars = () => {
    if ((userData.carIds || []).length === 0) {
      return; // Opțional: Poți adăuga o notificare aici (Snackbar)
    } else {
      navigate('/account/cars');
    }
  };

  // Wrapper pentru fundalul general (se aplică la ambele view-uri)
  const BackgroundWrapper = ({ children }) => (
    <Box
      sx={{
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
      }}
    >
      {/* Overlay întunecat pentru contrast */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Întunecă imaginea cu 70%
          zIndex: 1,
        }}
      />
      
      {/* Conținutul efectiv */}
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', p: 2 }}>
        {children}
      </Box>
    </Box>
  );

  const NoAccountView = () => (
    <BackgroundWrapper>
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            backgroundColor: themeColors.glass,
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            border: `1px solid ${themeColors.border}`,
            p: 5,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, letterSpacing: 1 }}>
            Join the Community
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}>
            You are currently not logged in. Access your garage and settings by logging in below.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={() => navigate('/login/account')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                ...buttonStyle,
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                  border: '2px solid white',
                }
              }}
              onClick={() => navigate('/register/account')}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </BackgroundWrapper>
  );

  const AccountView = () => (
    <BackgroundWrapper>
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            backgroundColor: themeColors.glass,
            backdropFilter: 'blur(16px)', // Efect de sticlă
            borderRadius: 6,
            border: `1px solid ${themeColors.border}`,
            padding: { xs: 4, md: 6 },
            color: 'white',
            boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.85rem' }}>
              Member Dashboard
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
              Welcome back, <br />
              <Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #FF3333, #FF8888)', 
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {userData.username || userData.surname}
              </Box>
            </Typography>
          </Box>

          <Divider sx={{ mb: 5, backgroundColor: 'rgba(255,255,255,0.1)' }} />

          {/* Action Grid */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={buttonStyle}
                onClick={() => navigate('/account/postACar')}
              >
                Post a Car
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={buttonStyle}
                onClick={viewCars}
                disabled={(userData.carIds || []).length === 0}
              >
                My Garage ({(userData.carIds || []).length})
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={buttonStyle}
              >
                Notifications
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={{
                  ...buttonStyle,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-3px)',
                  }
                }}
                onClick={() => navigate('/account/details')}
              >
                Account Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </BackgroundWrapper>
  );

  return <>{!userData.email ? <NoAccountView /> : <AccountView />}</>;
};

export default Account;