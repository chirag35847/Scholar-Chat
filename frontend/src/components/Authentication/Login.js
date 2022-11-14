// This file contains the component that is responsible for Logging in the user to the app

import React, { useState } from "react";
import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast, } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
    const [show, setShow] = useState(false);
    const [orcid, setmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleClick = () => setShow(!show);

    // submitHandler called when the user clickes Login on the Login widget in the frontend
    // first this function checks if the user input is valid or not
    // if the inputs are valid it sends the data to Db and checks response
    const submitHandler = async () => {
        setLoading(true);
        if (!orcid || !password) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { orcid, password },
                config
            );

            if (data.message) {
                toast({
                    title: "Please Verify Your Orcid",
                    description: data.message,
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            }
            else {
                localStorage.setItem("userInfo", JSON.stringify(data));
                toast({
                    title: "Login Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
                function sleep(ms) {
                    return new Promise((resolve) => setTimeout(resolve, ms));
                }
                async function demo() {
                    await sleep(2 * 1000);
                    console.log("done");
                    window.location.reload();
                }
                demo();
            }
            //   window.localStorage.reload();
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    // The Login Widget
    const [ocrid, setOcrid] = useState("");
    return (
        <VStack spacing="5px">
            <FormControl id="login-orcid" isRequired>
                <FormLabel>Orcid</FormLabel>
                <Input
                    placeholder="Enter Your Orcid 0000-0000-0000-0000"
                    value={ocrid}
                    onChange={(event) => {
                        setOcrid(event.target.value);
                        if (!isNaN(event.target.value.slice(-1))) {
                            if (event.target.value.length === 4) {
                                setOcrid(event.target.value + "-");
                            }
                            if (event.target.value.includes("-") 
                                && event.target.value.length - event.target.value.split("-").length +1 !== 16
                                && (event.target.value.length - event.target.value.split("-").length +1 ) % 4 === 0) {
                                setOcrid(event.target.value+'-')
                            }
                        }
                        setmail(event.target.value);
                      }
                    }
                ></Input>
            </FormControl>

            <FormControl id="login-password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        value={password}
                        placeholder="Enter your password"
                        onChange={(event) => setPassword(event.target.value)}
                    ></Input>
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme={"blue"}
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                LogIn
            </Button>
        </VStack>
    );
};

export default Login;
