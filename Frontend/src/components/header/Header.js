import {useState}  from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SvgIcon from '@mui/material/SvgIcon';
import { Typography} from '@mui/material';


const Header = ({ userData, setUserData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const logout = () => {
        const reset = {
            id: '',
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            country: '',
            city: '',
            street: '',
            role: '',
            carIds: []
        };
        setUserData(reset);
  }

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {!userData.email && <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>}
        {!userData.email && <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Register</MenuItem>}
        {userData.email &&<MenuItem component={Link} to="/account" onClick={handleMenuClose}>Profile</MenuItem>} 
        {userData.email && <MenuItem component={Link} to="/account/details" onClick={handleMenuClose}>My account</MenuItem>}
        {userData.email && <MenuItem onClick={() => {logout(); handleMenuClose();}}>Logout</MenuItem>}
      </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <Box sx={{ flexGrow: 1, border: '2px solid hsl(0, 3%, 7%);'}}>
          <AppBar position="static">
              <Toolbar>
                  <Button 
                      color="inherit" 
                      component={Link} 
                      to="/" id="Home"
                  >
                      <SvgIcon>
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </SvgIcon>
                  </Button>
                  <Box 
                      sx={{
                          width: '100%',
                          justifyContent: 'center',
                      }}
                  >
                      <Typography 
                          sx={{ 
                              margin: '0 auto',
                              width: {
                                lg: '60%',
                                md: '70%'
                              },
                              textAlign: 'center',
                              border: '1px solid hsl(0, 0.00%, 2.70%)',
                              borderRadius: '10px',
                              backgroundColor: 'hsl(0, 0.00%, 12.20%)',
                              fontFamily: 'Montserrat',
                              fontStyle: 'italic',
                              textOverflow: "ellipsis", 
                              overflow: "hidden", 
                              whiteSpace: "nowrap",
                              fontSize: 'clamp(16px, 2vw, 30px)'
                          }}
                      > 
                          Life Is a Journey – Choose Your Ride Wisely.
                      </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                      <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                          <Badge badgeContent={4} color="error">
                              <MailIcon />
                          </Badge>
                      </IconButton>
                      <IconButton
                          size="large"
                          aria-label="show 17 new notifications"
                          color="inherit"
                      >
                          <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                          </Badge>
                      </IconButton>
                      <IconButton
                          size="large"
                          edge="end"
                          aria-label="account of current user"
                          aria-haspopup="true"
                          onClick={handleProfileMenuOpen}
                          color="inherit"
                      >
                          <AccountCircle />
                      </IconButton>
                  </Box>
                  <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                      <IconButton
                          size="large"
                          aria-label="show more"
                          aria-controls={mobileMenuId}
                          aria-haspopup="true"
                          onClick={handleMobileMenuOpen}
                          color="inherit"
                      >
                          <MoreIcon />
                      </IconButton>
                  </Box>
              </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
      </Box>
    );
}
export default Header;