import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const authStatus = false
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/Home",
      active: authStatus
    }, 
    {
      name: "Login",
      slug: "/Login",
      active: !authStatus,
    },
    {
      name: "Registration",
      slug: "/Registration",
      active: !authStatus,
    },
    {
      name: "Chat",
      slug: "/Chat",
      active: authStatus,
    },
  ]

  return (
    <header>
      <div>
        <ul>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button onClick={() => navigate(item.slug)}>
                  {item.name}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </header>
  )
}

export default Navbar
