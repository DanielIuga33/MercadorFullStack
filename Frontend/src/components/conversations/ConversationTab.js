import { Box, Typography } from "@mui/material"

const ConversationTab = ({ userData }) =>{
    let conversations = 5
    return(
        <Box sx={{width: "100%", backgroundColor: '#bcbcc0ff'}}>
            <Box sx={{backgroundColor: '#1000f7ff', height: "100vh", width: "30%", borderRight: "4px solid black"}}>
                <Typography textAlign={"center"} fontSize={35} fontWeight={400}>Conversations</Typography>
                {Array.from({ length: conversations }).map((_, i) => (
                    <Box sx={{display: "flex", backgroundColor: '#00f73eff', height: "50px", marginBottom: "20px"}}>

                    </Box>
                ))}
            </Box>
            <Box sx ={{}}>
            </Box>
        </Box>
    )
}

export default ConversationTab;