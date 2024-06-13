import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn.jsx";

function NavigationBar() {
  const authStatus = useSelector((state) => state.rootReducer.user.isAuthenticated);
  const isAdmin = useSelector((state) =>  state.rootReducer.user.userData?.isAdmin);
  
  const userNavItems = [
    {
      name: "Home",
      slug: "/UserHome",
    },
    {
      name: "UpdateDetails",
      slug: "/UserUpdateDetails",
    },
  ];

  const adminNavItems = [
    {
      name: "Admin-Home",
      slug: "/AdminHome",
    },
    {
      name: "AdminUpdateDetails",
      slug: "/AdminUpdateDetails",
    },
  ];

  const guestNavItems = [
    {
      name: "Login",
      slug: "/Login",
    },
    {
      name: "RegisterUser",
      slug: "/Registration",
    },
  ];

  const activeLinkClasses = "bg-blue-300 text-black font-bold rounded-full md:py-2 md:px-2 py-1 px-1";
  const defaultLinkClasses = "hover:bg-blue-300 text-white font-bold rounded-full hover:text-black md:py-2 md:px-2 py-1 px-1";

  return (
    <header>
      <div className="bg-blue-600 p-3 py-5">
        <ul className="flex justify-evenly">
          {!authStatus && guestNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.slug}
                className={({ isActive }) =>
                  isActive ? activeLinkClasses : defaultLinkClasses
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {authStatus && isAdmin && adminNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.slug}
                className={({ isActive }) =>
                  isActive ? activeLinkClasses : defaultLinkClasses
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {authStatus && !isAdmin && userNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.slug}
                className={({ isActive }) =>
                  isActive ? activeLinkClasses : defaultLinkClasses
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
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
