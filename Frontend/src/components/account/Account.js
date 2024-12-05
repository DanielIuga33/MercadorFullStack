import React from 'react';
import { Box, Typography, Button, Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Account = ({ userData }) => {
  const navigate = useNavigate();

  const viewCars = () => {
    if ((userData.carIds || []).length === 0) {
      return;
    } else {
      navigate('/account/cars');
    }
  };

  const NoAccountView = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#2B2B2B',
        color: 'white',
        textAlign: 'center',
        px: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        You are not logged in or registered!
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF5722',
            color: 'white',
            '&:hover': { backgroundColor: '#FF3D00' },
            padding: '14px 28px',
            borderRadius: '12px',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => window.location.href = '/login/account'}
        >
          Login
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF5722',
            color: 'white',
            '&:hover': { backgroundColor: '#FF3D00' },
            padding: '14px 28px',
            borderRadius: '12px',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => window.location.href = '/register/account'}
        >
          Register
        </Button>
      </Box>
    </Box>
  );

  const AccountView = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#2B2B2B',
        color: 'white',
        px: 3,
      }}
    >
      <Box
        sx={{
          border: '5px solid hsl(0, 100%, 24%)',
          borderRadius: 8,
          backgroundColor: '#333333',
          padding: { xs: 5, md: 8 },
          width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
          minWidth: 300,
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Welcome <em>{userData.username || userData.surname}</em>!
        </Typography>
        <Divider sx={{ my: 4, backgroundColor: 'hsl(0, 100%, 24%)', height: '2px' }} />
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'hsl(0, 100%, 24%)',
                color: 'white',
                '&:hover': { backgroundColor: 'hsl(0, 100%, 22%)' },
                padding: '18px 0',
                borderRadius: '12px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/account/postACar')}
            >
              Post a Car
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'hsl(0, 100%, 24%)',
                color: 'white',
                '&:hover': { backgroundColor: 'hsl(0, 100%, 22%)' },
                padding: '18px 0',
                borderRadius: '12px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onClick={viewCars}
            >
              View your cars ({(userData.carIds || []).length > 0 ? userData.carIds.length : 'no'} cars posted)
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, backgroundColor: 'hsl(0, 100%, 24%)', height: '2px' }} />
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'hsl(0, 100%, 24%)',
                color: 'white',
                '&:hover': { backgroundColor: 'hsl(0, 100%, 22%)' },
                padding: '18px 0',
                borderRadius: '12px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              Notifications
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'hsl(0, 100%, 24%)',
                color: 'white',
                '&:hover': { backgroundColor: 'hsl(0, 100%, 22%)' },
                padding: '18px 0',
                borderRadius: '12px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/account/details')}
            >
              View/Edit account details
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return <div>{!userData.email ? <NoAccountView /> : <AccountView />}</div>;
};

export default Account;
