import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

const MessagesPopover = ({ messages, userData }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const id = open ? 'messages-popover' : undefined;

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpen}>
        <Badge badgeContent={messages.length} color="error">
          <MailIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
          <Typography variant="h6">Messages</Typography>
          {messages.length === 0 ? (
            <Typography sx={{ mt: 1 }}>No messages</Typography>
          ) : (
            <List>
              {messages.map((msg, idx) => (
                <ListItem
                  key={idx}
                  button
                  onClick={() => {
                    handleClose(); // închide popover-ul
                    if (userData.id){
                        navigate(`account/conversations/`); // navighează
                    }
                  }}
                >
                  <ListItemText
                    primary={msg.senderName}
                    secondary={msg.text}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default MessagesPopover;
