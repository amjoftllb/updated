import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, List, ListItem, Button, Text } from '@chakra-ui/react';
import { HiHome, HiLogin, HiUserAdd, HiChat, HiUsers, HiLogout } from 'react-icons/hi'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; 
import { logout } from "../../store/actions";

function Sidebar() {
  const { authStatus } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', slug: '/Home', active: authStatus, icon: <HiHome /> },
    { name: 'Login', slug: '/Login', active: !authStatus, icon: <HiLogin /> },
    { name: 'Registration', slug: '/Registration', active: !authStatus, icon: <HiUserAdd /> },
    { name: 'Chat', slug: '/Chat', active: authStatus, icon: <HiChat /> },
    { name: 'AllContact', slug: '/AllContact', active: authStatus, icon: <HiUsers /> },
  ];


  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/user/logout');
      navigate("/Login");
      dispatch(logout());
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sidebarWidth = authStatus ? '60px' : '250px'; 

  return (
    <Box
      bg="blue.900"
      color="white"
      borderRight="1px"
      borderColor="blue.800"
      width={sidebarWidth}
      minWidth={sidebarWidth}  
      p={authStatus ? 2 : 4} 
      minHeight="100vh"
      display="block"
      transition="width 0.3s ease, min-width 0.3s ease" 
      overflow="hidden" 
    >
      <Flex direction="column" align="center">
        {!authStatus && (
          <Text fontSize="xl" fontWeight="bold" mb="6">
            Chat App
          </Text>
        )}
        <List spacing={authStatus ? 2 : 4}>
          {navItems.map((item) =>
            item.active ? (
              <ListItem key={item.name}>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  leftIcon={item.icon}
                  onClick={() => navigate(item.slug)}
                  _hover={{ bg: 'teal.600' }}
                  w="full"
                  justifyContent={authStatus ? 'center' : 'start'} 
                  p={authStatus ? 2 : 4} 
                >
                  {!authStatus && item.name} 
                </Button>
              </ListItem>
            ) : null
          )}
        </List>
        {authStatus && (
          <Button
            variant="solid"
            colorScheme="teal"
            leftIcon={<HiLogout />}
            onClick={handleLogout}
            mt={4}
            w="full"
            justifyContent={authStatus ? 'center' : 'start'} 
            p={authStatus ? 2 : 4} 
          >
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default Sidebar;
