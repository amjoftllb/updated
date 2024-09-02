import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loadchat } from "../store/actions";

function ChatHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserPhoneNumber = useSelector((state) => state.user?.user1?.phoneNumber);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('/api/user/findAllUsers');
        const allUsers = response.data.data;

        const filteredUsers = allUsers.filter(user => user.phoneNumber !== loginUserPhoneNumber);

        setUsers(filteredUsers);
      } catch (error) {
        console.warn("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();


    const intervalId = setInterval(fetchUsers, 7000);

    return () => clearInterval(intervalId);
  }, [loginUserPhoneNumber]);

  const handleProfileClick = (user) => {
    dispatch(loadchat({
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      _id: user._id,
    }));
    navigate("/Chat");
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="row" height="100%">
      <VStack
        spacing={4}
        align="stretch"
        height="100%"
        overflowY="auto"
        p={4}
        bg="gray.100"
        borderRadius="md"
        flex="1"
      >
      { users.map((user) => (
          <Flex
            key={user._id}
            align="center"
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ bg: 'gray.50' }}
            cursor="pointer"
            onClick={() => handleProfileClick(user)}
          >
            <Avatar size="md" name={`${user.firstName} ${user.lastName}`} src={user.avatar} />
            <Box ml={4} flex="1">
              <Text fontWeight="bold" fontSize="lg">
                {user.firstName} {user.lastName}
              </Text>
              <Text fontSize="sm" color="gray.500" isTruncated>
                {user.phoneNumber}
              </Text>
            </Box>
          </Flex>
        ))}

      
        
      </VStack>
    </Flex>
  );
}

export default ChatHistory;
