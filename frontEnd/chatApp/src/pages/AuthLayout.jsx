import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({ children }) => {


  const navigate = useNavigate();
  const { authStatus } = useSelector((state) => state);
  useEffect(() => {
    if (!authStatus) {
        navigate('/Login');
    }
  }, [authStatus]);


  if (!authStatus) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.300"
        p={6}
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return children;
};

export default AuthLayout;
