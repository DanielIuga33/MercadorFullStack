import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import NotificationPopover from './NotificationPopover';

const Header = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotifOpen = Boolean(notifAnchor);

  // ✅ Fetch notificări din backend
  useEffect(() => {
    if (!userData?.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notifications/${userData.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh la 10 secunde
    return () => clearInterval(interval);
  }, [userData]);

  // Navigare spre conversații
  const goToConversations = () => navigate('/conversations');

  // Deschidere popover notificări
  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

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
      <MenuItem onClick={goToConversations}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={messages.length} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleNotifOpen}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
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

          {/* Desktop icons */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5, // mai echilibrat
            }}
          >
            {/* Mesaje */}
            <IconButton color="inherit" onClick={goToConversations}>
              <Badge badgeContent={messages.length} color="error">
                <MailIcon fontSize="medium" />
              </Badge>
            </IconButton>

            {/* Notificări */}
            <IconButton color="inherit" onClick={handleNotifOpen}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon fontSize="medium" />
              </Badge>
            </IconButton>

            {/* Profil */}
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize="medium" />
            </IconButton>
          </Box>

          {/* Mobile icons */}
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

      {/* Notification popover */}
      <NotificationPopover
        anchorEl={notifAnchor}
        open={isNotifOpen}
        onClose={handleNotifClose}
        notifications={notifications}
        refreshNotifications={() => {
          axios.get(`http://localhost:8080/api/notifications/${userData.id}`)
          .then(res => setNotifications(res.data))
          .catch(err => console.error(err));
        }}
      />
    </Box>
  );
};

export default Header;
