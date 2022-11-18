import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  VStack,
  Button,
  useToast,
  Text,
  Container,
  Box,
} from '@chakra-ui/react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function EmailVerify() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const params = useParams()

  const verify = async () => {
    try {
      const { data } = await axios.get('/api/auth/email/verify/' + params.token)
      console.log(data)
      if (data.message) {
        toast({
          title: 'Email Verification',
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

  // The Login Widget
  return (
    <Container centerContent maxW='xl' marginTop='10'>
      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='1g'
        color='black'
        borderWidth='1px'
      >
        <VStack spacing='5px'>
          <FormControl id='login-orcid'>
            <FormLabel>Email Verification</FormLabel>
          </FormControl>
          <Text>
            Please click on the button below to verify your email address.
          </Text>
          <Button
            colorScheme={'blue'}
            width='100%'
            style={{ marginTop: 15 }}
            onClick={verify}
            isLoading={loading}
          >
            Verify Email Address
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}

export default EmailVerify
