import React from "react";
import { Link, useParams } from "react-router-dom";
import { Text, Container, Box } from "@chakra-ui/react";

const VerifyPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"100%"}
        p={"50px"}
      >
        <Text>
          Your email is successfully registered! Please click{" "}
          {/* <Link to="/" style={{ color: "#0000FF" }}>
            {" "}
            here{" "}
          </Link>{" "} */}
          {console.log("Ha bhai mai aya fir mujhe nikal diya gaya")}
          and login again to use the application.
        </Text>
      </Box>
    </Container>
  );
};

export default VerifyPage;
