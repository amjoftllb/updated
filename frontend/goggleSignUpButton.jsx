
// import React from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// // Replace with your actual Google Client ID
// const clientId = '821307923389-dmdu2s0143o9lol9fe292fbjtngtouvg.apps.googleusercontent.com';

// const App = () => {
//   const handleSuccess = (response) => {
//     console.log('Login Success:', response);
 
//   };

//   const handleError = (error) => {
//     console.error('Login Failed:', error);
    
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <GoogleLogin
//         onSuccess={handleSuccess}
//         onError={handleError}
//       />
//     </GoogleOAuthProvider>
//   );
// };

// export default App;

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Replace with your actual Google Client ID
const clientId = '821307923389-dmdu2s0143o9lol9fe292fbjtngtouvg.apps.googleusercontent.com';

const App = () => {
  const handleSuccess = async (response) => {
    console.log('Login Success:', response);

    // Extract the token from the response
    const token = response.credential; // The JWT token returned by Google

    try {
      // Send the token to your backend server
      const res = await fetch('/api/googleAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      // Check if the request was successful
      if (!res.ok) {
        throw new Error('Failed to send token to backend');
      }

      const data = await res.json();
      console.log('Backend Response:', data);

      // Handle any additional logic after a successful response
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const handleError = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

export default App;



