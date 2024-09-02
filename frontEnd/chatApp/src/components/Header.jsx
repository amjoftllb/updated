import React from 'react';
import { Box, Flex, Text, Image, IconButton } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Header({ onBack }) {
 
  const user = useSelector(state => state.ChatReciver) || {};

  return (
    <Flex
      align="center"
      p={4}
      bg="blue.500"
      color="white"
      borderBottomWidth={1}
      borderBottomColor="gray.200"
      boxShadow="md"
    >
      <IconButton
        icon={<FaArrowLeft />}
        aria-label="Go back"
        variant="ghost"
        color="white"
        onClick={onBack}
        mr={4}
      />
      <Flex align="center" flex="1">
        <Image
          src={user.avatar || 'https://via.placeholder.com/50'}
          alt={`${user.firstName} ${user.lastName}`}
          borderRadius="full"
          boxSize="50px"
          mr={3}
        />
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {user.firstName} {user.lastName}
          </Text>
          <Text fontSize="sm">{user.phoneNumber}</Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Header;
