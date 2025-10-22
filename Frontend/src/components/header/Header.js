import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Badge,
  Menu,
  MenuItem,
  Typography,
  SvgIcon
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MessagesPopover from './MessagesPopover';

// Simulăm mesaje (în practică iei din API sau state global)
const messages = [
  { senderName: 'Alice', text: 'Hello!' },
  { senderName: 'Bob', text: 'How are you?' }
];

// În interiorul Box-ul cu iconițe:
<MessagesPopover messages={messages} />

// Component mic pentru icon + badge
const IconWithBadge = ({ icon, badgeContent = 0, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
    <IconButton size="large" color="inherit">
      <Badge badgeContent={badgeContent} color="error">
        {icon}
      </Badge>
    </IconButton>
    {label && <Typography sx={{ ml: 1 }}>{label}</Typography>}
  </Box>
);

const Header = ({userData, setUserData}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const logout = () => {
    setUserData({
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
    });
  };

  const headerTitleStyles = {
    margin: '0 auto',
    width: { lg: '60%', md: '70%' },
    textAlign: 'center',
    border: '1px solid hsl(0, 0%, 2.7%)',
    borderRadius: '10px',
    backgroundColor: 'hsl(0, 0%, 12.2%)',
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 'clamp(16px, 2vw, 30px)'
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userData.email ? (
        <>
          <MenuItem component={Link} to="/account" onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem component={Link} to="/account/details" onClick={handleMenuClose}>My account</MenuItem>
          <MenuItem onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
          <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Register</MenuItem>
        </>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconWithBadge icon={<MailIcon />} badgeContent={0} label="Messages" />
      </MenuItem>
      <MenuItem>
        <IconWithBadge icon={<NotificationsIcon />} badgeContent={47} label="Notifications" />
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconWithBadge icon={<AccountCircle />} label="Profile" />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, border: '2px solid hsl(0, 3%, 7%)' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" id="Home">
            <SvgIcon>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </SvgIcon>
          </Button>
          <Box sx={{ width: '100%', justifyContent: 'center' }}>
            <Typography sx={headerTitleStyles}>
              Life Is a Journey – Choose Your Ride Wisely.
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MessagesPopover messages={messages} userData={userData} />
            <IconWithBadge icon={<NotificationsIcon />} badgeContent={0} />
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
};

export default Header;
