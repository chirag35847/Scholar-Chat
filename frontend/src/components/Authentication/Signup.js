import { FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Signup = () => {

   const [show,setShow]=useState(false);
   const [name,setName] = useState();
   const [email,setmail] = useState();
   const [confirmPassword,setConfirmPassword] = useState();
   const [password,setPassword] = useState();
   const [pic,setPic] = useState();
   const [loading,setLoading]=useState(false);
   const toast = useToast();
   const history = useHistory();

   const handleClick = ()=>setShow(!show);

   const postDetails=(pics)=>{
       setLoading(true);
       if(pics===undefined){
           toast({
               title:'Please select an image!',
               status:'warning',
               duration:5000,
               isClosable:true,
               position:'bottom',
           })
           return;
       }

       if(pics.type==='image/jpeg' || pics.type==='image/png'){
           const data=new FormData();
           data.append('file',pics);
           data.append('upload_preset','lk6ml50n');
           data.append('cloud_name','dowydjewx');
           fetch('https://api.cloudinary.com/v1_1/dowydjewx/image/upload',{
               method:'post',
               body:data,
           }).then((res)=>res.json()).then(data=>{
               setPic(data.url.toString());
            //    console.log(data.url.toString());
               setLoading(false);
           }).catch((err)=>{
            //    console.log(err);
               setLoading(false);
           });
       }else{
            toast({
                title:'Please select an image!',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
            return;
       }
   };

   const submitHandler=async()=>{
       setLoading(true);
       if(!name || !email ||!password||!confirmPassword){
            toast({
                title:'Please fill all the fields',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
            return;
       }
       if(password!==confirmPassword){
            toast({
                title:'Passwords do not match',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
            return;
       }
       try {
           const config = {
               headers:{
                   'Content-type':'application/json',
               },
           };
           const response=await axios.post('/api/user',{name,email,password,pic},config);

           toast({
                title:`Registeration Successful, Please Check your email for email verification ${response.message}`,
                status:'success',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });

            console.log(response.message);
            // localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            // history.push('/chats');
            // function sleep(ms) {
            //     return new Promise((resolve) => setTimeout(resolve, ms));
            //   }
            //   async function demo() {
            //     // for (let i = 0; i < 5; i++) {
            //     //   console.log(`Waiting ${i} seconds...`);
            //     //   await sleep(i * 1000);
            //     // }
            //     // history.push("/chats");
            //     await sleep(2 * 1000);
            //     console.log("done");
            //     window.location.reload();
            //   }
            //   demo();
       } catch (error) {
            toast({
                title:'Error Occured!',
                description:error.response.data.message,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
       }
   };

  return (
    <VStack spacing='5px'>

        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter Your Name" onChange={(event)=>setName(event.target.value)}></Input>
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter Your Email" onChange={(event)=>setmail(event.target.value)}></Input>
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show?'text':'password'} placeholder="Enter A Password" onChange={(event)=>setPassword(event.target.value)}></Input>
                <InputRightElement width={'4.5rem'}>
                    <Button h={'1.75rem'} size='sm' onClick={handleClick}>{show?'Hide':'Show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show?'text':'password'} placeholder="ReEnter the password" onChange={(event)=>setConfirmPassword(event.target.value)}></Input>
                <InputRightElement width={'4.5rem'}>
                    <Button h={'1.75rem'} size='sm' onClick={handleClick}>{show?'Hide':'Show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='pic'>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input type={'file'} p={1.5} accept='image/*' onChange={(event)=>postDetails(event.target.files[0])}></Input>
        </FormControl>

        <Button colorScheme={'blue'} width='100%' style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>Register</Button>

    </VStack>
  )
}

export default Signup