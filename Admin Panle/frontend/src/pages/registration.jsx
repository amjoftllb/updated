import React, { useState } from "react";
import axios from "axios"; // Import Axios
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import InputTick from "../components/InputTick.jsx";

function Registration() {

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({ gender: "", department: "" });

  const validateForm = (data) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const stringRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let valid = true;

    if (!data.get("email") || !emailRegex.test(data.get("email"))) {
      valid = false;
      errors.email = "Invalid email format";
    }

    if (!data.get("gender")) {
      valid = false;
      errors.gender = "Please select gender";
    }
    if (!data.get("department")) {
      valid = false;
      errors.gender = "Please select Department";
    }

    if (!data.get("birthDate")) {
      valid = false;
      errors.birthDate = "Please select birth date";
    }

    if (!data.get("firstName") || !stringRegex.test(data.get("firstName"))) {
      valid = false;
      errors.firstName = "Invalid firstName format";
    }

    if (!data.get("firstName")) {
      valid = false;
      errors.firstName = "First name is required";
    }

    if (!data.get("lastName") || !stringRegex.test(data.get("lastName"))) {
      valid = false;
      errors.lastName = "Invalid lastName format";
    }

    if (!data.get("lastName")) {
      valid = false;
      errors.lastName = "Last name is required";
    }

    if (!data.get("password")) {
      valid = false;
      errors.password = "Password is required";
    }
   
    if (!data.get("password") || !passwordRegex.test(data.get("password"))) {
      valid = false;
      errors.password = "Password must be 8+ char with upper/lowercase, number, and special character";
    }

    
    if (!data.get("confirmPassword")) {
      valid = false;
      errors.confirmPassword = "Confirm password is required";
    }

    if (data.get("password") !== data.get("confirmPassword")) {
      valid = false;
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    if (validateForm(data)) {
      try {
        const formData = {
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          gender: data.get("gender"),
          birthDate: data.get("birthDate"),
          email: data.get("email"),
          password: data.get("password"),
          department: data.get("department"),
        };

        const response = await axios.post("api/registerUser", formData);

        if (response.status === 200) {
          resetForm();
          setResponse({ firstName: data.get("firstName") });
          setApiError(null);
        } 
      } catch (error) {
        console.error("Error adding user: ", error.response.data.message);
        setApiError(error.response.data.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setApiError(null);
    setFormData((prevFormData) => ({...prevFormData,[name]: value,}));
  };

  const resetForm = () => {
    document.getElementById("registrationForm").reset();
    setErrors({});
    setResponse(null);
    setFormData({ gender: "", department: "" });
  };

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
        <form id="registrationForm" onSubmit={handleSubmit} noValidate className="flex flex-col">
          <Input label="Enter First-Name:" name="firstName" type="text" onChange={handleChange} />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

          <Input label="Enter Last-Name:" name="lastName" type="text" onChange={handleChange} />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

          <p className="text-white">Gender :</p>
          <InputTick label="Male" type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
          <InputTick label="Female" type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}

          <p className="text-white">Department :</p>
          <InputTick label="Computer-IT" type="radio" name="department" value="Computer-IT" checked={formData.department === "Computer-IT"} onChange={handleChange} />
          <InputTick label="Mechanical" type="radio" name="department" value="Mechanical" checked={formData.department === "Mechanical"} onChange={handleChange} />
          <InputTick label="Civil" type="radio" name="department" value="Cevil" checked={formData.department === "Cevil"} onChange={handleChange} />
          <InputTick label="Chemical" type="radio" name="department" value="Chemical" checked={formData.department === "Chemical"} onChange={handleChange} />
          <InputTick label="Other" type="radio" name="department" value="Other" checked={formData.department === "Other"} onChange={handleChange} />
          {errors.department && <p className="text-red-500">{errors.department}</p>}

          <Input label="Birth-Date:" type="date" name="birthDate" onChange={handleChange} />
          {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

          <Input label="E-mail id:" type="email" name="email" onChange={handleChange} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Input label="Password:" type="password" name="password" onChange={handleChange} />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <Input label="Confirm-Password:" type="password" name="confirmPassword" onChange={handleChange} />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}

          <br />
          {response?.firstName && <p className="text-green-700 text-lg">User {response.firstName} is created successfully</p>}
          {apiError && <p className="text-red-500">{apiError}</p>}

          <Button type="submit" className="mt-4">Submit form</Button>
          <input type="reset" id="resetButton" className="hidden" />
        </form>
      </div>
    </div>
  );
}

export default Registration;
