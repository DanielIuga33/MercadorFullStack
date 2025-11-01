import { Popover, Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationPopover = ({ anchorEl, open, onClose, notifications = [], unreadNotifications, setUnreadNotifications, id, refreshNotifications }) => {
  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    try {
      // ✅ Marchează notificarea ca citită
      await axios.put(`http://localhost:8080/api/notifications/read/${notif.id}`);
      setUnreadNotifications(unreadNotifications - 1);

      // ✅ Închide popover-ul
      onClose();

      // ✅ Actualizează lista de notificări (ca să scadă badge-ul)
      refreshNotifications && refreshNotifications();

      // ✅ Navighează spre conversația respectivă
      if (notif.conversationId) {
        navigate(`/conversations/${notif.conversationId}`);
      } else {
        navigate('/conversations');
      }
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
      <Box sx={{ width: 300, p: 2 }}>
        {!id ? (
          <></>
        ) : (
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
        )}
        <Divider />
        <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <ListItem
                key={notif.id} 
                button
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  backgroundColor: notif.read ? 'inherit' : 'rgba(25, 118, 210, 0.1)',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                />
              </ListItem>
            ))
          ) : !id ? (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, fontSize: '16px' }}>
              You are not logged on or registered!
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              No notifications yet.
            </Typography>
          )}
        </List>
      </Box>
    </Popover>
  );
};

export default NotificationPopover;
