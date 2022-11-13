import React from "react";
import { Link, useParams } from "react-router-dom";
import { Text, Container, Box } from "@chakra-ui/react";

const PageNotFound = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"100%"}
        p={"50px"}
		fontSize={"3rem"}
		textColor={"green"}
      >
        <h1>
          404  :) 
		  <br/>
		  Page Not Found 
        </h1>
      </Box>
    </Container>
  );
};

export default PageNotFound;
