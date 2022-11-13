import React from "react";
import { Link, useParams } from "react-router-dom";
import { Text, Container, Box } from "@chakra-ui/react";

const PageNotFound = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        alignItems="center"
        d={"flex"}
        //  justifyContent={"space-between"}
        flexDirection={"column"}
        w={"100%"}
        h={"100%"}
        p={"50px"}
		fontSize={"3rem"}
		textColor={"black"}
      >
        <h1 style={{padding:"0px", }}>
          404  :) 
          </h1>
		  {/* <br/> */}
      <h1>
		  Page Not Found 
        </h1>
        <a class="login-button" href="https://scholar-chat-orcid.herokuapp.com/">
          <button
          style={{fontSize:"20px", border:"2px solid green", borderRadius:"5px", padding:"5px 10px", borderColor:"#0C0A3E" ,backgroundColor:"#0C0A3E", color:"white"}}
          >Back to Home</button></a>
      </Box>

      {/* <Box
      alignItems="center"
      justifyContent={"center"}
      display="flex"
      >
      <a class="login-button" href="https://scholar-chat-orcid.herokuapp.com/"><button type="button "
            class="">Log in to Scholar Chat</button></a>
      </Box> */}
      
      
      
     
      
    </Container>
  );
};

export default PageNotFound;
