import React from 'react'


const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9m0 0l9 9m-9-9v18" />
  </svg>
)

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l6-6m-6 6l6 6m7-6h6" />
  </svg>
)

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l6-6m-6 6l6 6m7-6h6" />
  </svg>
)

const UpdateProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l6-6m-6 6l6 6m7-6h6" />
  </svg>
)

const AllUsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l6-6m-6 6l6 6m7-6h6" />
  </svg>
)

function App() {
  const authStatus = true


  const navItems = [
    {
      name: 'Home',
      slug: "/Home",
      active: authStatus,
      icon: <HomeIcon />,
    }, 
    {
      name: "Login",
      slug: "/Login",
      active: !authStatus,
      icon: <LoginIcon />,
    },
    {
      name: "RegisterUser",
      slug: "/Registration",
      active: !authStatus,
      icon: <RegisterIcon />,
    },
    {
      name: "UpdateProfile",
      slug: "/UpdateProfile",
      active: authStatus,
      icon: <UpdateProfileIcon />,
    },
    {
      name: "All-Users",
      slug: "/All-Users",
      active: authStatus,
      icon: <AllUsersIcon />,
    },
  ]

  return (
    <aside className='fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg'>
      <div className='p-4'>
        <h1 className='text-2xl font-semibold mb-6 text-center'>MyApp</h1>
        <ul className='flex flex-col space-y-2'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className='w-full flex items-center text-white font-medium rounded-lg hover:bg-blue-400 transition-colors duration-200 py-3 px-4 text-left'
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </aside>
  )
}

export default App
