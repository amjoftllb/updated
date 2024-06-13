import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import axios from "axios";
import {loginUser} from "../store/actions/auth.action.js"
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setApiError(null);
  };

  const validateForm = (data) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!emailRegex.test(data.get("email"))) {
      valid = false;
      errors.email = "Invalid email format";
    }
    if (!data.get("password")) {
      valid = false;
      errors.password = "Password is required";
    }
    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData.get("email"));
    console.log(formData.get("password"));
    setApiError(null);
    setApiResponse(null);

    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    if (validateForm(formData)) {
      try {
        const response = await axios.post("/api/login",loginData );
        if (response.data.statusCode == 200) {
        dispatch(loginUser(response.data.data))
        navigate(response.data.data.isAdmin ? "/AdminHome" : "/UserHome");
        console.log("dispatch done");
        }
      } catch (error) {
        setApiError(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
        <div className="text-3xl font-bold pb-3">Login User</div>
        <hr className="pb-3" />
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <Input
            label="E-mail id:"
            type="email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Input
            label="Password:"
            type="password"
            name="password"
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          {apiError && <p className="text-red-500">{apiError}</p>}
          {apiResponse && <p className="text-green-500">{apiResponse}</p>}

          <Button type="submit" className="mt-4">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
