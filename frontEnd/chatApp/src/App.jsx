import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import Sidebar from './components/header/Sidebar';
import ChatHistory from './components/ChatHistory';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, logout } from "./store/actions";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authStatus } = useSelector((state) => state);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.post('/api/user/getuser');
        
        if (response.status === 200) {
          dispatch(loginSuccess(response.data));
          
          navigate("/Home");
        }
      } catch (error) {
        navigate("/Login");
        dispatch(logout());
      }
    };

    getUser();
  }, [dispatch, navigate]);

  const sidebarWidth = useBreakpointValue({ base: 'full', md: '60px' }) || '60px';
  const chatWidth = authStatus ? '30%' : '0';

  return (
    <Flex direction="row" minHeight="100vh" bg="gray.50">
      <Box
        width={sidebarWidth}
        bg="blue.900"
        borderRight="1px"
        borderColor="gray.200"
        p="0"
        display={{ base: 'none', md: 'block' }}
        height="100vh"
        transition="width 0.3s ease"
        position="fixed"
      >
        <Sidebar />
      </Box>

      {authStatus && (
        <Box
          width={chatWidth}
          bg="white"
          borderLeft="1px"
          borderColor="gray.200"
          p="4"
          height="100vh"
          overflowY="auto"
          ml={sidebarWidth}
          position="relative"
          display={{ base: 'none', md: 'block' }}
        >
          <ChatHistory />
        </Box>
      )}

      
      <Box
        flex="1"
        height="100%"
        transition="margin-left 0.3s ease"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default App;
