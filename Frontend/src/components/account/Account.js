import React from 'react';
import img1 from '../../images/img1.jpeg';
import { 
  Box, Typography, Button, Divider, Grid, Paper, Container, Avatar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Importuri Iconițe
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PersonIcon from '@mui/icons-material/Person';

const Account = ({ userData }) => {
  const navigate = useNavigate();

  const themeColors = {
    primary: 'hsl(0, 90%, 30%)',
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.7)', 
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#FF3333'
  };

  const commonButtonStyle = {
    padding: '20px',
    borderRadius: '16px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    border: `1px solid ${themeColors.border}`,
  };

  const viewCars = () => {
    if ((userData.carIds || []).length > 0) {
      navigate('/account/cars');
    }
  };

  const BackgroundWrapper = ({ children }) => (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', py: 4 }}>
        {children}
      </Box>
    </Box>
  );

  const NoAccountView = () => (
    <BackgroundWrapper>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            backgroundColor: themeColors.glass,
            backdropFilter: 'blur(20px) saturate(160%)',
            borderRadius: 6,
            border: `1px solid ${themeColors.border}`,
            p: 6,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Avatar sx={{ width: 70, height: 70, bgcolor: themeColors.accent, margin: '0 auto 20px' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
            Join the Community
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Log in to access your private garage, track notifications, and manage your listings.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login/account')}
              sx={{ 
                background: themeColors.gradient, 
                px: 4, py: 1.5, borderRadius: '12px', fontWeight: 'bold' 
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/register/account')}
              sx={{ 
                color: 'white', borderColor: 'rgba(255,255,255,0.3)', 
                px: 4, py: 1.5, borderRadius: '12px', fontWeight: 'bold',
                '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.05)' }
              }}
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
          elevation={0}
          sx={{
            backgroundColor: themeColors.glass,
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: 8,
            border: `1px solid ${themeColors.border}`,
            padding: { xs: 4, md: 8 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Back Button */}
          <Button 
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate('/')}
            sx={{ 
              position: 'absolute', top: 24, left: 24, 
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              '&:hover': { color: 'white', background: 'transparent' }
            }}
          >
            Back to Home
          </Button>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: themeColors.accent, fontWeight: 700, letterSpacing: 3 }}>
              Member Dashboard
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, letterSpacing: -1 }}>
              Welcome back, <br />
              <Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #FF3333, #FF8888)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {userData.username || userData.surname}
              </Box>
            </Typography>
          </Box>

          <Divider sx={{ mb: 6, opacity: 0.1 }} />

          {/* Tiles Grid */}
          <Grid container spacing={3}>
            {/* Post a Car */}
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={{
                  ...commonButtonStyle,
                  background: themeColors.gradient,
                  color: 'white',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(255,0,0,0.3)' }
                }}
                onClick={() => navigate('/account/postACar')}
              >
                <AddBoxIcon sx={{ fontSize: 32 }} />
                Post a Car
              </Button>
            </Grid>

            {/* My Garage */}
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                disabled={(userData.carIds || []).length === 0}
                sx={{
                  ...commonButtonStyle,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)' }
                }}
                onClick={viewCars}
              >
                <DirectionsCarIcon sx={{ fontSize: 32 }} />
                My Garage ({(userData.carIds || []).length})
              </Button>
            </Grid>

            {/* Notifications */}
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={{
                  ...commonButtonStyle,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' }
                }}
              >
                <NotificationsIcon sx={{ fontSize: 32 }} />
                Notifications
              </Button>
            </Grid>

            {/* Account Settings */}
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                sx={{
                  ...commonButtonStyle,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' }
                }}
                onClick={() => navigate('/account/details')}
              >
                <SettingsIcon sx={{ fontSize: 32 }} />
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