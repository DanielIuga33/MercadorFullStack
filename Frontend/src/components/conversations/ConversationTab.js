import { Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const ConversationTab = ({ userData }) => {
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // 🔹 textul din input

    // Fetch conversațiile utilizatorului
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/conversations/${userData.id}`);
                if (!response.data) {
                    setConversations([]);
                    return;
                }
                setConversations(response.data);

                // Fetch pentru fiecare utilizator din conversații
                const usersMap = {};
                for (const conversation of response.data) {
                    let id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    const userRes = await axios.get(`http://localhost:8080/api/users/${id}`);
                    usersMap[id] = userRes.data;
                }
                setUsers(usersMap);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [userData.id]);

    // Când selectezi o conversație
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
        setLoadingMessages(true);

        try {
            const response = await axios.get(`http://localhost:8080/api/conversations/messages/${conversation.id}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // 🔹 Trimiterea mesajului
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;
        try {
            const messageData = {
                id: selectedConversation.id,
                sender: userData.id,
                receiver: selectedConversation.user2,
                message: newMessage,
            };
            // Trimite mesajul la backend
            await axios.post("http://localhost:8080/api/conversations/conversation/message/", messageData);

            // Adaugă mesajul local (fără să reîncarci tot)
            setMessages((prev) => [...prev, messageData]);
            setNewMessage(""); // golește inputul
        } catch (error) {
            window.alert(error);
        }
    };

    // 🔹 Trimite și cu Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <Box sx={{ width: "100%", backgroundColor: "#bcbcc0ff", display: "flex" }}>
            {/* Sidebar cu conversațiile */}
            <Box
                sx={{
                    alignItems: "center",
                    backgroundColor: "#222222ff",
                    height: "92vh",
                    width: "25%",
                    borderRight: "4px solid black",
                }}
            >
                <Typography textAlign={"center"} fontSize={35} fontWeight={400} marginBottom={6}>
                    Conversations
                </Typography>
                {conversations.map((conversation) => {
                    let id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    let otherUser = users[id];

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
                                    backgroundColor: "#ffffffff",
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "100%",
                                }}
                            ></Box>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Box sx={{ backgroundColor: "#6b6a6aff", height: "40%" }}>
                                    <Typography sx={{ marginLeft: "2%" }}>
                                        {otherUser ? otherUser.username : "Loading..."}
                                    </Typography>
                                </Box>
                                <Box sx={{ height: "70%" }}>
                                    <Typography sx={{ color: "red" }}>
                                        {conversation.messages &&
                                            conversation.messages[conversation.messages.length - 1]?.message}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Zona de chat */}
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "red",
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
                        backgroundColor: "purple",
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                    }}
                >
                    {selectedConversation ? (
                        <>
                            {/* Header cu numele utilizatorului */}
                            <Box sx={{ display: "flex", height: "70px" }}>
                                <Box
                                    sx={{
                                        height: "60px",
                                        width: "60px",
                                        backgroundColor: "yellow",
                                        borderRadius: "30px",
                                    }}
                                ></Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: "white",
                                        mb: 2,
                                        alignItems: "center",
                                        backgroundColor: "red",
                                        marginTop: "auto",
                                    }}
                                >
                                    {
                                        users[
                                            selectedConversation.user1 !== userData.id
                                                ? selectedConversation.user1
                                                : selectedConversation.user2
                                        ]?.username
                                    }
                                </Typography>
                            </Box>

                            {/* Zona mesajelor */}
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
                                        const isOwn = msg.senderId === userData.id;
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
                                                <Typography variant="body1">{msg.message}</Typography>
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Typography sx={{ color: "gray" }}>No messages yet ...</Typography>
                                )}
                            </Box>

                            {/* 🔹 Bara de input */}
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
