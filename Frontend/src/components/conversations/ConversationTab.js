import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

const ConversationTab = ({ userData }) => {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");


    useEffect(() => {
            if (!userData.id){
                navigate('/');
            }
        }, [userData, navigate]);
    // 🔹 Fetch conversațiile utilizatorului
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/conversations/${userData.id}`);
                if (!response.data) {
                    setConversations([]);
                    return;
                }
                setConversations(response.data);

                // 🔹 Fetch info pentru fiecare utilizator din conversații
                const usersMap = {};
                for (const conversation of response.data) {
                    const id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    const userRes = await axios.get(`http://localhost:8080/api/users/${id}`);
                    usersMap[id] = userRes.data;
                }
                setUsers(usersMap);
            } catch (error) {
                console.error("❌ Error fetching conversations:", error);
            }
        };
        fetchData();
    }, [userData.id]);

    // 🔹 Când selectezi o conversație
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
        setLoadingMessages(true);

        try {
            const response = await axios.get(
                `http://localhost:8080/api/conversations/messages/${conversation.id}`
            );

            console.log("✅ Received messages:", response.data);

            // Backend trimite direct un array de MessageDTO
            setMessages(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // 🔹 Trimiterea mesajului
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

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
                "http://localhost:8080/api/conversations/conversation/message/",
                messageData
            );

            // Adaugă local
            setMessages((prev) => [...prev, messageData]);
            setNewMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    // 🔹 Trimite și cu Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <Box sx={{ width: "100%", backgroundColor: "#bcbcc0ff", display: "flex" }}>
            {/* 🔹 Sidebar cu conversațiile */}
            <Box
                sx={{
                    alignItems: "center",
                    backgroundColor: "#222222ff",
                    height: "92vh",
                    width: "25%",
                    borderRight: "4px solid black",
                    overflowY: "auto",
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
                                    backgroundColor: "#fff",
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "100%",
                                    marginRight: "10px",
                                }}
                            ></Box>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Typography sx={{ color: "#fff", marginLeft: "2%" }}>
                                    {otherUser ? otherUser.username : "Loading..."}
                                </Typography>
                                <Typography sx={{ color: "gray", marginLeft: "2%" }}>
                                    {conversation.messages &&
                                        conversation.messages[conversation.messages.length - 1]?.message}
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

                            {/* 🔹 Mesaje */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    backgroundColor: "#222",
                                    borderRadius: 2,
                                    p: 2,
                                    overflowY: "auto",
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
