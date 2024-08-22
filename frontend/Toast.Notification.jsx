import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const showErrorNotification = () => {
    toast.error('An error occurred!');
  };

  return (
    <div>
      <button onClick={showErrorNotification}>Show Error</button>
      <ToastContainer />
    </div>
  );
}

export default App;



