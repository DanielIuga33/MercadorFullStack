import React, { useState, useEffect, useRef } from "react"; 
import { Box, Typography, TextField, Avatar, IconButton, Paper, InputAdornment } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../..";
import img1 from '../../images/img1.jpeg'; 
import { Send, Circle, Search } from '@mui/icons-material';

// --- STILURI GENERALE ---
const themeColors = {
    gradient: 'linear-gradient(135deg, hsl(0, 100%, 24%) 0%, hsl(0, 80%, 40%) 100%)',
    glass: 'rgba(20, 20, 20, 0.6)', 
    glassDark: 'rgba(0, 0, 0, 0.6)', 
    border: 'rgba(255, 255, 255, 0.1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    ownMessage: 'linear-gradient(135deg, hsl(0, 100%, 30%) 0%, hsl(0, 80%, 40%) 100%)', 
    otherMessage: 'rgba(255, 255, 255, 0.1)', 
    unreadIndicator: '#ff4d4d'
};

const scrollbarStyles = {
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(255, 77, 77, 0.3)", 
        borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(255, 77, 77, 0.6)",
    },
};

const BackgroundWrapper = ({ children }) => (
    <Box sx={{
        height: '90vh',
        width: '100%',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', p: { xs: 1, md: 4 } }}>{children}</Box>
    </Box>
);

const ConversationTab = ({ userData, unreadMessages, setUnreadMessages }) => {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null); 

    // --- 1. POLL CONVERSATIONS (LISTA DIN STÂNGA) ---
    useEffect(() => {
        if (!userData.id) navigate('/');
        
        const fetchConversations = async () => {
            if (!userData.id) return;
            try {
                const response = await axios.get(`${API_URL}/conversations/${userData.id}`);
                
                if (!response.data) { 
                    setConversations([]); 
                    return; 
                }

                // Sortare
                const sortedConversations = response.data.sort((a, b) => {
                    const lastMsgDateA = (a.messages && a.messages.length > 0) 
                        ? a.messages[a.messages.length - 1].createdAt 
                        : null;
                    const timeA = new Date(lastMsgDateA || a.createdAt).getTime();

                    const lastMsgDateB = (b.messages && b.messages.length > 0) 
                        ? b.messages[b.messages.length - 1].createdAt 
                        : null;
                    const timeB = new Date(lastMsgDateB || b.createdAt).getTime();

                    return timeA - timeB;
                });

                setConversations(sortedConversations);

                // Fetch Users Info (doar dacă e nevoie)
                const usersMap = { ...users }; // Păstrăm userii existenți
                let newUsersFound = false;

                for (const conversation of sortedConversations) {
                    const id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    if (!usersMap[id]) {
                        const userRes = await axios.get(`${API_URL}/users/${id}`);
                        usersMap[id] = userRes.data;
                        newUsersFound = true;
                    }
                }
                if (newUsersFound) setUsers(usersMap);

            } catch (error) { console.error("Error fetching conversations:", error); }
        };

        // Apel inițial
        fetchConversations();

        // Polling la fiecare 2 secunde
        const intervalId = setInterval(fetchConversations, 2000);

        // Curățare la unmount
        return () => clearInterval(intervalId);
    }, [userData.id, navigate, users]); // Scoatem 'users' din dependințe pentru a evita loop infinit


    // --- 2. POLL MESSAGES (CONVERSAȚIA ACTIVĂ) ---
    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${API_URL}/conversations/messages/${selectedConversation.id}`);
                // Actualizăm mesajele doar dacă s-a schimbat lungimea (optimizare simplă)
                // Sau pur și simplu le setăm mereu pentru a prinde și schimbări de status
                setMessages(response.data || []); 
                
                // Actualizare vizuală locală a statusului 'read'
                setConversations(prev => prev.map(c => {
                    if (c.id === selectedConversation.id && c.messages) {
                        const updatedMessages = c.messages.map(m => 
                            m.receiver === userData.id ? { ...m, read: true } : m
                        );
                        return { ...c, messages: updatedMessages };
                    }
                    return c;
                }));

            } catch (error) { console.error("Error fetching messages:", error); } 
        };

        // Polling la fiecare 2 secunde DOAR dacă avem o conversație selectată
        const intervalId = setInterval(fetchMessages, 2000);

        return () => clearInterval(intervalId);
    }, [selectedConversation, userData.id]);


    // --- RESTUL FUNCȚIILOR (Neschimbate) ---
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]); 
        setLoadingMessages(true);
        try {
            const response = await axios.get(`${API_URL}/conversations/messages/${conversation.id}`);
            setMessages(response.data || []); 
        } catch (error) { console.error("Error fetching messages:", error); } 
        finally { setLoadingMessages(false); }
    };

    const markMessageAsRead = async (message) => {
        try {
            if (message.receiver !== userData.id) return;
            const response = await axios.put(`${API_URL}/conversations/markMessagesAsRead/${message.id}`);
            let params = {sender: message.sender, receiver: message.receiver}
            if (!message.receiver || !message.sender) return;
            await axios.put(`${API_URL}/notifications/read/`, params);
            setUnreadMessages((unreadMessages - response.data) > 0 ? (unreadMessages - response.data): 0);
        } catch (error){ console.log(error) } 
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const tempMessage = {
            id: selectedConversation.id,
            sender: userData.id,
            message: newMessage,
            createdAt: new Date().toISOString()
        };

        try {
            const receiverId = selectedConversation.user1 === userData.id ? selectedConversation.user2 : selectedConversation.user1;
            const messageData = { id: selectedConversation.id, sender: userData.id, receiver: receiverId, message: newMessage };
            
            await axios.post(`${API_URL}/conversations/conversation/message/`, messageData);
            setMessages((prev) => [...prev, tempMessage]);
            setNewMessage("");

            // Re-fetch imediat după trimitere pentru a fi siguri
            // Deși avem polling, vrem feedback instant
        } catch (error) { console.error("Error sending message:", error); }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); 
        }
    }, [messages]); 

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <BackgroundWrapper>
            <Paper elevation={24} sx={{
                width: "100%",
                height: "100%",
                backgroundColor: themeColors.glass,
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${themeColors.border}`,
                display: "flex",
                overflow: 'hidden'
            }}>
                
                {/* 🔹 SIDEBAR */}
                <Box sx={{
                    width: { xs: "80px", md: "30%" },
                    backgroundColor: themeColors.glassDark,
                    borderRight: `1px solid ${themeColors.border}`,
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box sx={{ p: 3, borderBottom: `1px solid ${themeColors.border}` }}>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>
                            Inbox
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'block', md: 'none' }, textAlign: 'center' }}>
                            <Circle sx={{ color: '#ff4d4d' }} />
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: "auto", ...scrollbarStyles, p: 2 }}>
                        {conversations.map((conversation) => {
                            const id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                            const otherUser = users[id];
                            const isSelected = selectedConversation?.id === conversation.id;

                            const hasUnread = conversation.messages?.some(
                                msg => msg.receiver === userData.id && !msg.read
                            );

                            const lastMsg = conversation.messages && conversation.messages.length > 0 
                                ? conversation.messages[conversation.messages.length - 1] 
                                : null;
                            
                            return (
                                <Box
                                    key={conversation.id}
                                    onClick={() => handleSelectConversation(conversation)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1.5,
                                        mb: 1,
                                        borderRadius: 3, 
                                        cursor: "pointer",
                                        backgroundColor: isSelected 
                                            ? 'rgba(255, 77, 77, 0.2)' 
                                            : hasUnread ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                        
                                        border: isSelected 
                                            ? '1px solid rgba(255, 77, 77, 0.4)' 
                                            : '1px solid transparent',
                                        
                                        borderLeft: hasUnread 
                                            ? `4px solid ${themeColors.unreadIndicator}` 
                                            : (isSelected ? '1px solid rgba(255, 77, 77, 0.4)' : '1px solid transparent'),

                                        transition: 'all 0.2s',
                                        "&:hover": { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: isSelected ? '#ff4d4d' : '#555', color: 'white' }}>
                                        {otherUser ? otherUser.username[0].toUpperCase() : "?"}
                                    </Avatar>
                                    
                                    <Box sx={{ ml: 2, overflow: 'hidden', display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ 
                                                color: hasUnread ? "white" : "rgba(255,255,255,0.8)", 
                                                fontWeight: (hasUnread || isSelected) ? 'bold' : 'normal' 
                                            }}>
                                                {otherUser ? otherUser.username : "Loading..."}
                                            </Typography>
                                            
                                            {hasUnread && <Circle sx={{ color: themeColors.unreadIndicator, width: 10, height: 10 }} />}
                                        </Box>
                                        
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: hasUnread ? "white" : themeColors.textSecondary, 
                                                fontWeight: hasUnread ? '600' : 'normal',
                                                whiteSpace: 'nowrap', 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis' 
                                            }}
                                        >
                                            {lastMsg 
                                                ? (lastMsg.sender === userData.id ? `You: ${lastMsg.message}` : lastMsg.message)
                                                : "Start a conversation"}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* 🔹 ZONA DE CHAT */}
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: 'transparent' }}>
                    
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <Box sx={{ 
                                p: 2, 
                                display: "flex", 
                                alignItems: "center", 
                                borderBottom: `1px solid ${themeColors.border}`,
                                backgroundColor: 'rgba(0,0,0,0.2)'
                            }}>
                                <Avatar sx={{ width: 40, height: 40, bgcolor: '#ff4d4d', mr: 2 }}>
                                    {users[selectedConversation.user1 !== userData.id ? selectedConversation.user1 : selectedConversation.user2]?.username[0].toUpperCase()}
                                </Avatar>
                                <Typography variant="h6" sx={{ color: "white" }}>
                                    {users[selectedConversation.user1 !== userData.id ? selectedConversation.user1 : selectedConversation.user2]?.username}
                                </Typography>
                            </Box>

                            {/* Chat Messages */}
                            <Box sx={{ 
                                flexGrow: 1, 
                                p: 3, 
                                overflowY: "auto", 
                                ...scrollbarStyles,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5
                            }}>
                                {loadingMessages ? (
                                    <Typography sx={{ color: "gray", textAlign: 'center', mt: 4 }}>Loading messages...</Typography>
                                ) : messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isOwn = msg.sender === userData.id;
                                        if (!isOwn && !msg.read) markMessageAsRead(msg);

                                        return (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    alignSelf: isOwn ? "flex-end" : "flex-start",
                                                    backgroundColor: 'transparent',
                                                    maxWidth: "70%",
                                                }}
                                            >
                                                <Paper sx={{
                                                    p: 1.5,
                                                    px: 2.5,
                                                    borderRadius: isOwn ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
                                                    background: isOwn ? themeColors.ownMessage : themeColors.otherMessage,
                                                    color: "white",
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                                    border: `1px solid ${isOwn ? 'transparent' : 'rgba(255,255,255,0.05)'}`
                                                }}>
                                                    <Typography variant="body1">{msg.message}</Typography>
                                                </Paper>
                                                {isOwn && idx === messages.length - 1 && (
                                                    <Typography variant="caption" sx={{ color: 'gray', display: 'block', textAlign: 'right', mt: 0.5, fontSize: '0.7rem' }}>
                                                        {msg.read ? "Read" : "Sent"}
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.5 }}>
                                        <Search sx={{ fontSize: 60, color: 'white', mb: 2 }} />
                                        <Typography sx={{ color: "white" }}>No messages yet. Say hello!</Typography>
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderTop: `1px solid ${themeColors.border}` }}>
                                <TextField
                                    fullWidth
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            color: 'white',
                                            borderRadius: '30px',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff4d4d' },
                                            paddingRight: '8px'
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    onClick={handleSendMessage}
                                                    sx={{ 
                                                        color: 'white', 
                                                        backgroundColor: themeColors.gradient, 
                                                        '&:hover': { opacity: 0.9 },
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <Send fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: themeColors.textSecondary }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" alt="chat" style={{ width: '100px', opacity: 0.5, filter: 'invert(1)' }} />
                            <Typography variant="h6" sx={{ mt: 2 }}>Select a conversation to start chatting</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </BackgroundWrapper>
    );
};

export default ConversationTab;