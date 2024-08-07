// import React from 'react';

// const HomePage: React.FC = () => {
//   return (
//     <div>
//       <h1>Welcome to the Home Page</h1>
//       <p>This is the main page of your application.</p>
//     </div>
//   );
// };

// export default HomePage;

import React from 'react';
import MainLayout from './layout';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of your application.</p>
    </MainLayout>
  );
};

export default HomePage;
