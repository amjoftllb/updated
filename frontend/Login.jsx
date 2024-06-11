import React, { useEffect, useState } from "react";
import Button from "../componets/Button.jsx";
import Input from "../componets/Input.jsx";
import { loginUser } from "../store/action&Reducers/auth.Action.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
  const auth = useSelector((state) => state.rootReducer.user);
  console.log(auth);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    if (!emailRegex.test(formData.email)) {
      valid = false;
      errors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      valid = false;
      errors.password = "Password is required";
    }
    setErrors(errors);
    return valid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    auth.error = ""
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      dispatch(loginUser(formData.email, formData.password));
      if (auth.userData) {
        Navigate("/Home")
      }
    }
  };

  useEffect(() => {
    if (auth.userData) {
      Navigate("/Home")
    }

  }, [auth]);

 
  return (
    <div className=" bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto  bg-white bg-opacity-50 rounded-lg shadow-lg p-6 ">
        <div className=" text-3xl font-bold pb-3 ">Login User</div>
        <hr className=" pb-3 "></hr>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <Input
            label="E-mail id:"
            type="email"
            name="email"
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.email}</p>}
          <Input
            label="Password:"
            type="password"
            name="password"
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.password}</p>}
          {auth.error &&<p className="text-red-500">{auth.error}</p>}
          <Button type="submit" className="mt-4">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
