

import {Input,DrawerBody,DrawerContent,DrawerHeader,useDisclosure,DrawerOverlay, Box, Button, Tooltip ,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useToast, useFocusEffect, Spinner} from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon,ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import {getSender} from '../../config/ChatLogic'

const SideDrawer = () => {
    const history = useHistory();
    const {user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState();
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState();
    const [loading,setLoading] = useState(false);
    const [loadingChat,setLoadingChat] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const toast = useToast();

    const logoutHandler = ()=>{
        localStorage.removeItem('userInfo');
        history.push('/');
    }

    const handleSearch=async()=>{
        if(!search){
            toast({
                title:"Please Enter Something in the search",
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'top-left',
            });
            return;
        }

        try {
            // console.log('exe')
            setLoading(true);
            const config={
                 headers:{
                     Authorization:`Bearer ${user.token}`,
                 },
            };

            const {data} = await axios.get(`/api/user?search=${search}`,config);

            setSearchResult(data);
            // console.log(data);
            setLoading(false);
        } catch (error) {
            toast({
                title:'Some Error Occured',
                description:error.message,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom-left',
            });
        }
    }

    const accessChat=async(userId)=>{
        try {
            setLoadingChat(true);
            const config={
                headers:{
                    'Content-type':'application/json',
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post('/api/chat',{userId},config);

            if(!chats.find((c)=>c._id===data._id)){
                setChats([data,...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title:'Error in fetching chat',
                description:error.message,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom-left',
            });
        }
    }

    return (
        <>
            <Box d='flex' justifyContent={'space-between'} alignContent={'center'} bg={'white'} w={'100%'} p={'5px 10px 5px 10px'} borderWidth='5px'>
                <Tooltip label="Search Users To Chat With" hasArrow placement='bottom-end'>
                    <Button variant={'ghost'} onClick={onOpen} ref={btnRef}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text d={{base:'none',md:'flex'}} px={'4'}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={'2xl'} fontFamily={'Work sans'}>Scholar Chat</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize={'2xl'} m={1}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((noti)=>(
                                <MenuItem key={noti._id} onClick={()=>{
                                    setSelectedChat(noti.chat);
                                    setNotification(notification.filter((n)=>n!==noti));
                                }}>
                                    {noti.chat.isGroupChat?`New Message in ${noti.chat.chatName}`:`New message from ${getSender(user,noti.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer isOpen={isOpen} placement='left' onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box d='flex' pb={2}>
                            <Input placeholder='Search by name or Orcid' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}>
                            </Input>
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading?(
                            <ChatLoading/>
                        ):(
                            searchResult?.map(currUser=>(
                                <UserListItem key={currUser._id} user={currUser} handleFunction={()=>accessChat(currUser._id)}/>
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' d='flex'/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer