import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { HiPhone, HiLockClosed } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from "../store/actions";


const countryCodes = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+27', country: 'South Africa' },
  { code: '+82', country: 'South Korea' },
  { code: '+20', country: 'Egypt' },
  { code: '+52', country: 'Mexico' },
  { code: '+60', country: 'Malaysia' },
  { code: '+31', country: 'Netherlands' },
  { code: '+41', country: 'Switzerland' },
  { code: '+46', country: 'Sweden' },
  { code: '+48', country: 'Poland' },
  { code: '+90', country: 'Turkey' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+381', country: 'Serbia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+383', country: 'Kosovo' },
  { code: '+385', country: 'Croatia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+389', country: 'North Macedonia' },
];


const validatePhoneNumber = (value) => {
  let error;
  if (!/^[6-9]\d{9}$/.test(value)) {
    error = 'Invalid Indian phone number';
  }
  return error;
};

const validateForm = (values) => {
  const errors = {};

  if (!values.countryCode) {
    errors.countryCode = 'Country code is required';
  }

  const phoneError = validatePhoneNumber(values.phoneNumber);
  if (phoneError) {
    errors.phoneNumber = phoneError;
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/api/user/login', values);
      
      console.log('Login successful:', response.data);
      setMessage('Login successful!');
      setMessageType('success');
      
      dispatch(loginSuccess(response.data)); 
      navigate("/Home");
      
    } catch (error) {
      console.error('Login failed:', error);

     
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.50"
      p={4}
    >
      <Box
        maxWidth="md"
        width="full"
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="md"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Login
        </Text>
        {message && (
          <Alert status={messageType === 'success' ? 'success' : 'error'} mb={4}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>{messageType === 'success' ? 'Success!' : 'Error!'}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Box>
          </Alert>
        )}
        <Formik
          initialValues={{ countryCode: '+91', phoneNumber: '', password: '' }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.countryCode && touched.countryCode}>
                  <FormLabel htmlFor="countryCode">Country Code</FormLabel>
                  <Field name="countryCode">
                    {({ field }) => (
                      <Select id="countryCode" {...field} placeholder="Select country code">
                        {countryCodes.map(({ code, country }) => (
                          <option key={code} value={code}>
                            {code} ({country})
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>

                <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
                  <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                  <Field name="phoneNumber">
                    {({ field }) => (
                      <Input
                        id="phoneNumber"
                        {...field}
                        placeholder="Enter your phone number"
                        leftElement={<HiPhone />}
                      />
                    )}
                  </Field>
                </FormControl>

                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field name="password">
                    {({ field }) => (
                      <Input
                        id="password"
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        leftElement={<HiLockClosed />}
                      />
                    )}
                  </Field>
                </FormControl>

                <Button
                  mt={4}
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default LoginPage;
