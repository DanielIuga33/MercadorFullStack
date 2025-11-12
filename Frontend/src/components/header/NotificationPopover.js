import { Popover, Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import API_URL from '../..'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// =========================================================================
// 💡 FUNCȚIA HELPER PENTRU FORMATUL AVANSAT DE ORĂ/DATĂ (AZI, IERI, DD.MM.YYYY)
// =========================================================================

const formatNotificationTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const notificationDate = new Date(timestamp);

    // Funcție pentru a formata ora (HH:MM în 24h)
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // Verifică dacă este Azi
    if (notificationDate.toDateString() === now.toDateString()) {
        // Dacă este AZI, afișăm DOAR ORA
        return formatTime(notificationDate); 
    }

    // Verifică dacă este Ieri (folosind doar data, ignorând ora)
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (notificationDate.toDateString() === yesterday.toDateString()) {
        // Dacă este IERI, afișăm "Ieri" + ora
        return `Yesterday at ${formatTime(notificationDate)}`; 
    }

    // Dacă este mai veche, afișează data completă (DD.MM.YYYY) + ora
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const datePart = notificationDate.toLocaleDateString('ro-RO', options);
    
    return `${datePart} la ${formatTime(notificationDate)}`; // Ex: 05.11.2025 la 14:30
};


const NotificationPopover = ({ 
    anchorEl, open, onClose, 
    notifications = [], unreadNotifications, setUnreadNotifications, 
    id, refreshNotifications,
}) => {
    
    const navigate = useNavigate();
    
    // 1. Referința pentru elementul de scroll
    const listRef = useRef(null); 
    
    const [sendersMap, setSendersMap] = useState({}); 

    // Efectul de scroll
    useEffect(() => {
        if (open && listRef.current) {
            const scrollToBottom = () => {
                if (listRef.current) {
                    listRef.current.scrollTop = listRef.current.scrollHeight;
                }
            };
            const timer = setTimeout(scrollToBottom, 50);
            return () => clearTimeout(timer);
        }
    }, [open, notifications]); 


    // Logica asincronă (fetch senders)
    useEffect(() => {
        const fetchSenders = async () => {
            const uniqueSenderIds = [...new Set(notifications.map(n => n.sender))].filter(Boolean);
            
            const fetchedData = {};
            let didUpdate = false;
            
            for (const senderId of uniqueSenderIds) {
                if (!sendersMap[senderId]) { 
                    try {
                        const response = await axios.get(`${API_URL}/users/${senderId}`);
                        fetchedData[senderId] = response.data.username || response.data.surname || 'Unknown user';
                        didUpdate = true;
                    } catch (error) {
                        console.error(`Error fetching user ${senderId}:`, error);
                        fetchedData[senderId] = "Eroare utilizator";
                        didUpdate = true;
                    }
                }
            }
            
            if (didUpdate) {
                setSendersMap(prevMap => ({
                    ...prevMap, 
                    ...fetchedData 
                }));
            }
        };

        if (open && notifications.length > 0) {
            fetchSenders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifications, open]); 

    // 1. Sortarea notificărilor (cele mai noi primele)
    const sortedNotifications = [...notifications].sort((b, a) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const handleNotificationClick = async (notif) => {
        try {
            if (!notif.read) {
                await axios.put(`${API_URL}/notifications/read/${notif.id}`);
                setUnreadNotifications(prev => prev - 1); 
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
                
                {/* Containerul List cu referința de scroll și stilurile noi */}
                <List 
                    ref={listRef} // 👈 Atașează referința
                    sx={{ 
                        maxHeight: '260px', 
                        overflowY: 'auto',
                        
                        // STILURI PENTRU SCROLL MIC ȘI VIZIBIL LA HOVER
                        
                        "&::-webkit-scrollbar": { 
                            width: "6px", 
                            backgroundColor: "transparent", 
                        },
                        "&::-webkit-scrollbar-thumb": { 
                            backgroundColor: "transparent", 
                            borderRadius: "10px", 
                        },
                        "&:hover": {
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(255, 255, 255, 0.3)", 
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.5)", 
                            }
                        }
                    }}
                >
                    {sortedNotifications.length > 0 ? (
                        sortedNotifications.map((notif, index) => {
                            
                            const senderName = sendersMap[notif.sender] || "Loading..."; 

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
                                            {senderName} a trimis un mesaj.
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" sx={{ display: 'block', color: notif.read ? 'gray' : 'lightgray' }} noWrap>
                                                Mesaj: "{notif.message && (notif.message < 50 ? notif.message :
                                                notif.message.slice(0,50).concat("..."))}"
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                {/* 💡 Aici apelăm funcția helper */}
                                                **{formatNotificationTimestamp(notif.timestamp)}**
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            )})
                        ) : !id ? (
                            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, fontSize: '16px' }}>
                                You are not logged in !
                            </Typography>
                        ) : (
                            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                                There is no news.
                            </Typography>
                        )}
                </List>
            </Box>
        </Popover>
    );
};

export default NotificationPopover;