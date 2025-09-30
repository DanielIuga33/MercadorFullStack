import { Box, Typography } from "@mui/material"

const ConversationTab = ({ userData }) =>{
    let conversations = 5
    return(
        <Box sx={{width: "100%", backgroundColor: '#bcbcc0ff', display: "flex"}}>
            <Box sx={{alignItems: "center", backgroundColor: '#222222ff', height: "92vh", width: "25%", borderRight: "4px solid black"}}>
                <Typography textAlign={"center"} fontSize={35} fontWeight={400} marginBottom={6}>Conversations</Typography>
                {Array.from({ length: conversations }).map((_, i) => (
                    <Box sx={{marginLeft: "2%", display: "flex",border: "2px solid pink", backgroundColor: '#1c1c1cff',width:"90%", height: "10%", marginBottom: "20px"}}>
                        <Box sx={{backgroundColor: "#644848ff", height: "100%", width: "19%"}}>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                            <Box sx={{backgroundColor: "#a49e9eff", height: "30%"}}>
                                <Typography sx={{marginLeft: "2%"}}>Nume Prenume</Typography>
                            </Box>
                            <Box sx={{backgroundColor: "#eeff00ff", height: "70%"}}></Box>
                        </Box>

                    </Box>
                ))}
            </Box>
            <Box sx={{width: "100%", backgroundColor: "red", height: "92vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Box sx={{width: "97%", height: "96%", backgroundColor: "purple", display:"flex"}}>
                    <Box></Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ConversationTab;