import React from "react";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Registration",
      slug: "/Registration",
    },
    {
      name: "UpdateDetails",
      slug: "/UpdateDetails",
    },
    {
      name: "AllUsers",
      slug: "/AllUsers",
    },
  ];

  return (
    <header>
      <div className=" bg-slate-800 p-3 ">
        <ul className=" flex justify-evenly ">
          {navItems.map((item) =>(
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="bg-slate-400 text-white font-bold rounded-full hover:text-black md:py-2 md:px-2 py-1 px-1"
                >
                  {item.name}
                </button>
              </li>
            ) 
          )}
          
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
