import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, Text, Image, SimpleGrid, Flex, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

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

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (!values.avatar) {
    errors.avatar = 'Avatar image is required';
  }

  return errors;
};

function Registration() {
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage(null);
    setError(null);

    try {

      const response = await axios.post('/api/user/signUp', values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Registration successful');
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bg="gray.50" p={4}>
      <Box maxWidth={{ base: 'full', md: 'md' }} width="full" bg="white" p={6} borderRadius="md" boxShadow="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Register
        </Text>
        {message && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Formik
          initialValues={{ countryCode: '+91', phoneNumber: '', firstName: '', lastName: '', password: '', confirmPassword: '', avatar: '' }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Stack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.firstName && touched.firstName}>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Field name="firstName">
                      {({ field }) => <Input id="firstName" {...field} placeholder="First name" />}
                    </Field>
                  </FormControl>

                  <FormControl isInvalid={!!errors.lastName && touched.lastName}>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Field name="lastName">
                      {({ field }) => <Input id="lastName" {...field} placeholder="Last name" />}
                    </Field>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.countryCode && touched.countryCode}>
                    <FormLabel htmlFor="countryCode">Country Code</FormLabel>
                    <Field name="countryCode">
                      {({ field }) => (
                        <Select id="countryCode" {...field} placeholder="Country code">
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
                      {({ field }) => <Input id="phoneNumber" {...field} placeholder="Phone number" />}
                    </Field>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field name="password">
                      {({ field }) => <Input id="password" {...field} type="password" placeholder="Password" />}
                    </Field>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <Field name="confirmPassword">
                      {({ field }) => <Input id="confirmPassword" {...field} type="password" placeholder="Confirm password" />}
                    </Field>
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={!!errors.avatar && touched.avatar}>
                  <FormLabel htmlFor="avatar">Avatar Image</FormLabel>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file) {
                        setFieldValue('avatar', file);
                        handleFileChange(event);
                      }
                    }}
                  />
                  {avatar && (
                    <Flex justify="center" mt={2}>
                      <Image src={avatar} alt="Avatar preview" boxSize="100px" borderRadius="full" />
                    </Flex>
                  )}
                </FormControl>

                <Button mt={4} colorScheme="teal" type="submit" isLoading={isSubmitting} width="full">
                  Register
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default Registration;
