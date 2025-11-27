import React, { useState, useEffect, useRef } from "react"; 
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../..";

// Stiluri pentru o bară de scroll subțire și invizibilă (apare la scroll/hover în Webkit)
const scrollbarStyles = {
    "&::-webkit-scrollbar": {
        width: "6px", // Lățimea barei
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        visibility: "hidden", // Ascunde bara inițial
    },
    // Face bara vizibilă la hover pe container
    "&:hover::-webkit-scrollbar-thumb": {
        visibility: "visible", 
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
};

const ConversationTab = ({ userData, unreadMessages, setUnreadMessages }) => {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null); 

    // 🔹 Fetch conversațiile utilizatorului
    useEffect(() => {
        if (!userData.id) {
            navigate('/');
        }
        const fetchData = async () => {
            if (userData.id)
            try {
                const response = await axios.get(`${API_URL}/conversations/${userData.id}`);
                if (!response.data) {
                    setConversations([]);
                    return;
                }
                setConversations(response.data);

                // 🔹 Fetch info pentru fiecare utilizator din conversații
                const usersMap = {};
                for (const conversation of response.data) {
                    const id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    const userRes = await axios.get(`${API_URL}/users/${id}`);
                    usersMap[id] = userRes.data;
                }
                setUsers(usersMap);
            } catch (error) {
                console.error("❌ Error fetching conversations:", error);
            }
        };
        fetchData();
    }, [userData.id, navigate]);

    // 🔹 Când selectezi o conversație
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]); 
        setLoadingMessages(true);

        try {
            const response = await axios.get(
                `${API_URL}/conversations/messages/${conversation.id}`
            );
            setMessages(response.data || []); 
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const markMessageAsRead = async (message) => {
        try {
            if (message.receiver !== userData.id) return;
            const response = await axios.put(`${API_URL}/conversations/markMessagesAsRead/${message.id}`);
            
            let params = {sender: message.sender, receiver: message.receiver}
            if (!message.receiver || !message.sender){
                return;
            }
            await axios.put(`${API_URL}/notifications/read/`, params);
            setUnreadMessages((unreadMessages - response.data) > 0 ? (unreadMessages - response.data): 0);
        }   
        catch (error){
            console.log(`Eroare: ${error}`)
        } 
        finally{
            return;
        }
    }

    // 🔹 Trimiterea mesajului
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const tempMessage = {
            id: selectedConversation.id,
            sender: userData.id,
            message: newMessage,
        };

        try {
            const receiverId =
                selectedConversation.user1 === userData.id
                    ? selectedConversation.user2
                    : selectedConversation.user1;

            const messageData = {
                id: selectedConversation.id,
                sender: userData.id,
                receiver: receiverId,
                message: newMessage,
            };

            // Trimite mesajul la backend
            await axios.post(
                `${API_URL}/conversations/conversation/message/`,
                messageData
            );

            // Adaugă local, declanșând useEffect-ul de scroll
            setMessages((prev) => [...prev, tempMessage]);
            setNewMessage("");
            
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    // 🔹 Scroll rapid/instantaneu la elementul de la final
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" }); 
        }
    }, [messages]); 

    // 🔹 Trimite și cu Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <Box sx={{ width: "100%", backgroundColor: "#bcbcc0ff", display: "flex" }}>
            {/* 🔹 Sidebar cu conversațiile - MODIFICARE 1 APLICATĂ AICI */}
            <Box
                sx={{
                    alignItems: "center",
                    backgroundColor: "#222222ff",
                    height: "92vh",
                    width: "25%",
                    borderRight: "4px solid black",
                    overflowY: "auto",
                    ...scrollbarStyles, // <-- Aplicarea stilurilor de scroll
                }}
            >
                <Typography textAlign="center" fontSize={35} fontWeight={400} marginBottom={6}>
                    Conversations
                </Typography>
                {conversations.map((conversation) => {
                    const id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    const otherUser = users[id];

                    return (
                        <Box
                            key={conversation.id}
                            sx={{
                                marginLeft: "2%",
                                display: "flex",
                                border: "2px solid black",
                                backgroundColor:
                                    selectedConversation?.id === conversation.id ? "#333" : "#1c1c1cff",
                                width: "90%",
                                height: "66px",
                                marginBottom: "20px",
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "#444" },
                            }}
                            onClick={() => handleSelectConversation(conversation)}
                        >
                            <Box 
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: "8px",
                                    marginLeft: "8px",
                                
                                }}>
                            <Box
                                sx={{
                                    backgroundColor: "#fff",
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "100%",
                                    marginRight: "11px",
                                    margin: "0 auto",

                                }}
                            ></Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Typography sx={{ color: "#fff", marginLeft: "2%" }}>
                                    {otherUser ? otherUser.username : "Loading..."}
                                </Typography>
                                <Typography sx={{ color: "gray", marginLeft: "2%" }}>
                                    {conversation.messages &&
                                        (conversation.messages[conversation.messages.length - 1]?.message.length < 20 ?
                                          conversation.messages[conversation.messages.length - 1]?.message  :
                                          conversation.messages[conversation.messages.length -1]?.message.slice(0,20).concat("...")
                                        )}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* 🔹 Zona de chat */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#101010",
                    height: "92vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "97%",
                        height: "96%",
                        backgroundColor: "#181818",
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    {selectedConversation ? (
                        <>
                            {/* Header cu numele utilizatorului */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Box
                                    sx={{
                                        height: "60px",
                                        width: "60px",
                                        backgroundColor: "#666",
                                        borderRadius: "30px",
                                        mr: 2,
                                    }}
                                ></Box>
                                <Typography variant="h4" sx={{ color: "white" }}>
                                    {
                                        users[
                                            selectedConversation.user1 !== userData.id
                                                ? selectedConversation.user1
                                                : selectedConversation.user2
                                            ]?.username
                                    }
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    backgroundColor: "#222",
                                    borderRadius: 2,
                                    p: 2,
                                    overflowY: "auto", // Acesta este containerul care face scroll
                                    ...scrollbarStyles, // <-- Aplicarea stilurilor de scroll
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                {loadingMessages ? (
                                    <Typography sx={{ color: "gray" }}>Loading messages...</Typography>
                                ) : messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isOwn = msg.sender === userData.id;
                                        !userData.id && (navigate('/'));
                                        if (!isOwn && !msg.read){
                                            markMessageAsRead(msg);
                                            msg.read = true;
                                        }
                                        return (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    alignSelf: isOwn ? "flex-end" : "flex-start",
                                                    backgroundColor: isOwn ? "#4caf50" : "#555",
                                                    color: "white",
                                                    borderRadius: 3,
                                                    p: 1.5,
                                                    maxWidth: "70%",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {msg.message || msg.text || msg.content}
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Typography sx={{ color: "gray" }}>No messages yet ...</Typography>
                                )}
                                
                                {/* Elementul de final pentru scroll */}
                                <div ref={messagesEndRef} /> 
                            </Box>

                            {/* 🔹 Input bar */}
                            <Box
                                sx={{
                                    display: "flex",
                                    mt: 2,
                                    backgroundColor: "#333",
                                    borderRadius: 2,
                                    p: 1,
                                    gap: 1,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{
                                        backgroundColor: "gray",
                                        borderRadius: 2,
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSendMessage}
                                    sx={{ borderRadius: 2, px: 3 }}
                                >
                                    Send
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6" sx={{ color: "white" }}>
                            Select a conversation
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ConversationTab;