import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import axios from 'axios';

const ConversationTab = ({ userData }) => {
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState({}); // dictionar userId -> user

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/conversations/${userData.id}`);
                setConversations(response.data);

                // Încarcă userii pentru fiecare conversație
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

    return (
        <Box sx={{ width: "100%", backgroundColor: '#bcbcc0ff', display: "flex" }}>
            <Box sx={{ alignItems: "center", backgroundColor: '#222222ff', height: "92vh", width: "25%", borderRight: "4px solid black" }}>
                <Typography textAlign={"center"} fontSize={35} fontWeight={400} marginBottom={6}>
                    Conversations
                </Typography>
                {conversations.map((conversation) => {
                    let id = conversation.user1 !== userData.id ? conversation.user1 : conversation.user2;
                    let otherUser = users[id];

                    return (
                        <Box key={conversation.id} sx={{ marginLeft: "2%", display: "flex", border: "2px solid pink", backgroundColor: '#1c1c1cff', width: "90%", height: "10%", marginBottom: "20px" }}>
                            <Box sx={{ backgroundColor: "#644848ff", height: "100%", width: "19%" }}></Box>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Box sx={{ backgroundColor: "#a49e9eff", height: "30%" }}>
                                    <Typography sx={{ marginLeft: "2%" }}>
                                        {otherUser ? otherUser.username : "Loading..."}
                                    </Typography>
                                </Box>
                                <Box sx={{ backgroundColor: "#eeff00ff", height: "70%" }}></Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Box sx={{ width: "100%", backgroundColor: "red", height: "92vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: "97%", height: "96%", backgroundColor: "purple", display: "flex" }}>
                    <Box></Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ConversationTab;
