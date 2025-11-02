import { Popover, Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import path from '../..';
import { useNavigate } from 'react-router-dom';

const NotificationPopover = ({ 
    anchorEl, open, onClose, 
    notifications = [], unreadNotifications, setUnreadNotifications, 
    id, refreshNotifications,
}) => {
  const navigate = useNavigate();

  // 1. Sortarea notificărilor (cele mai noi primele)
  const sortedNotifications = [...notifications].sort((a, b) => 
 new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const findUsername = async (id) => {
    try{
      console.log(id);
      const response = await axios.get(`${path}/users/${id}`);
      console.log(response.data)
      return response.data;
    } 
    catch (error){
      console.log(error)
    }
    finally{
      return
    }
  }

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        // ✅ Marchează notificarea ca citită pe server
        await axios.put(`${path}/notifications/read/${notif.id}`);
        setUnreadNotifications(prev => prev - 1); // Scade contorul
      }

      onClose();
      navigate('/conversations');
      refreshNotifications && refreshNotifications();

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: 330, p: 2, maxHeight: 400 }}>
        {!id ? (
          <></>
        ) : (
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Notificări necitite ({unreadNotifications})
          </Typography>
        )}
        <Divider />
        
        {/* Containerul List cu înălțime limitată și scroll */}
        <List sx={{ 
            maxHeight: '260px', 
            overflowY: 'auto',
            // O bară de scroll subțire și discretă
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { 
                backgroundColor: "rgba(255, 255, 255, 0.1)", 
                borderRadius: "10px" 
            }
        }}>
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((notif, index) => {
                
                // 🛑 CORECȚIE: Căutare în harta de utilizatori, nu cerere Axios
                console.log(notif.sender)
                const senderUser = findUsername(notif.sender); 
                // Presupunem că obiectul utilizator are câmpul 'username'
                const senderName = senderUser ? senderUser.username : "Utilizator necunoscut";

                return (
              <ListItem
                key={notif.id} 
                button
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  backgroundColor: notif.read ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 82, 82, 0.1)',
                  borderRadius: 1,
                  mb: 1,
                  borderLeft: notif.read ? 'none' : '3px solid #ff5252',
                }}
              >
                <ListItemText
                    primary={
                        <Typography variant="body2" fontWeight={!notif.read ? 600 : 400}>
                            **{senderName}** a trimis un mesaj.
                        </Typography>
                    }
                    secondary={
                        <Box>
                            <Typography variant="caption" sx={{ display: 'block', color: notif.read ? 'gray' : 'lightgray' }} noWrap>
                                Mesaj: "{notif.message}"
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {new Date(notif.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>
                        </Box>
                    }
                />
              </ListItem>
            )})
          ) : !id ? (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, fontSize: '16px' }}>
              Nu sunteți autentificat!
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Nu sunt notificări noi.
            </Typography>
          )}
        </List>
      </Box>
    </Popover>
  );
};

export default NotificationPopover;