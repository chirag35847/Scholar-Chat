import React, { useEffect } from 'react'
import {
  Container,
  Box,
  Text,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
  Button,
} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import { Link, useHistory, useLocation } from 'react-router-dom'

const HomePage = () => {
  const history = useHistory()
  const { search } = useLocation()
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const redirect = new URLSearchParams(search).get('redirect')
    if (userInfo) {
      history.push('/chats')
    }

    // as we are using two frontends, we use redirect as a query flag to check if we need to redirect to the app or not
    if (redirect !== 'false') {
      window.location.href = '/home'
    }
  }, [history, search])

  // when redirect = false,

  // const ClickHandler = () => {
  //   const history = useHistory()
  //   function sleep(ms) {
  //     return new Promise(resolve => setTimeout(resolve, ms))
  //   }
  //   async function demo() {
  //     await sleep(2 * 1000)
  //     console.log('done')
  //     window.location.reload()
  //   }
  //   demo()
  //   history.go(0)

  //   window.location.reload()
  // }

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
        <Tabs variant='soft-rounded'>
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Register</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Link to='/home'>
                  <Button>Register With Orcid</Button>
                </Link>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
