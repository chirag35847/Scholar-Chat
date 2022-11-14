import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  Box,
  Container,
  Button,
  useToast,
  Text,
  Heading,
} from '@chakra-ui/react'
import axios from 'axios'

function ForgotPassword() {
  const [orcid, setOrcid] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const submitHandler = async () => {
    setLoading(true)
    if (!orcid) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/auth/forgotpassword',
        { orcid },
        config
      )

      if (data.message) {
        toast({
          title: 'Message',
          description: data.message,
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
        setLoading(false)
      }
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
    }
  }

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={'white'}
        w='100%'
        m='40px 0 15px 0'
        borderRadius='1g'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work sans' color='black'>
          Scholar Chat
        </Text>
      </Box>

      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='1g'
        color='black'
        borderWidth='1px'
      >
        <Container centerContent={true}>
          <Heading as='h4' size='lg' mb='4'>
            Forgot Password?
          </Heading>
        </Container>
        <VStack spacing='5px'>
          <FormControl id='login-orcid' isRequired>
            <FormLabel>Orcid</FormLabel>
            <Input
              placeholder='Enter Your Orcid 0000-0000-0000-0000'
              value={orcid}
              onChange={event => setOrcid(event.target.value)}
            ></Input>
          </FormControl>

          <Button
            colorScheme={'blue'}
            width='100%'
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
          >
            Send Link
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}

export default ForgotPassword
