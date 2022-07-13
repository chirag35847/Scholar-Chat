import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button ,Image,Text} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
                <ModalOverlay />
                <ModalContent h={'410px'}>
                    <ModalHeader fontSize={'40px'} fontFamily={"Work sans"} d={'flex'} justifyContent={'center'}>{user.name}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody d={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'space-between'}>
                        <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name}></Image>
                        <Text>Email : {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal