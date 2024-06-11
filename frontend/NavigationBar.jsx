import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn.jsx";

function NavigationBar() {
  const authStatus = useSelector((state) => state.rootReducer.user.isAuthenticated);
  const navItems = [
    {
      name: "Home",
      slug: "/Home",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/Login",
      active: !authStatus,
    },
    {
      name: "RegisterUser",
      slug: "/Registration",
      active: !authStatus,
    },
    {
      name: "UpdateDetails",
      slug: "/UpdateDetails",
      active: authStatus,
    },
    {
      name: "UserDetails",
      slug: "/AllUsers",
      active: authStatus,
    },
  ];

  return (
    <header>
      <div className="bg-blue-600 p-3 py-5">
        <ul className="flex justify-evenly">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <NavLink
                  to={item.slug}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-300 text-black font-bold rounded-full md:py-2 md:px-2 py-1 px-1"
                      : "hover:bg-blue-300 text-white font-bold rounded-full hover:text-black md:py-2 md:px-2 py-1 px-1"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ) : null
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}

export default NavigationBar;
