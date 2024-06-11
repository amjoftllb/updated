import React, { useState, useEffect } from "react";
import Button from "../componets/Button.jsx";
import Input from "../componets/Input.jsx";
import InputTick from "../componets/InputTicks.jsx";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function Registration() {
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate()
  const [DisableRegistorButton, setDisableRegistorButton] = useState(true);
  const [apiErr, setApiErr] = useState({
    sendOtpErr: "",
    verifyOtpErr: "",
    RegisterUserErr: "",
  });
  const [formData, setFormData] = useState({
    avatar: null,
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    hobbies: [],
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [apiRes, setApiRes] = useState({
    sendOtpRes: "",
    verifyOtpRes: "",
    RegisterUserRes: "",
  });
  const resetForm = () => {
    setFormData({
      avatar: null,
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      hobbies: [],
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };
  const verifyOtp = async () => {
    try {
      const response = await axios.post("/api/RegisterUserverifyOTP", {
        email: formData.email,
        otp: formData.otp,
      });
      setApiRes((prev) => ({ ...prev, verifyOtpRes: response.data.message }));
      setDisableRegistorButton(false)
      setApiRes((prev) => ({ ...prev, sendOtpRes: "" }));
      setApiErr((prev) => ({ ...prev, verifyOtpErr: "" }));
    } catch (error) {
      setDisableRegistorButton(true)
      setApiRes((prev) => ({ ...prev, sendOtpRes: "" }));
      setApiRes((prev) => ({ ...prev, verifyOtpRes: "" }));
      setApiErr((prev) => ({
        ...prev,
        verifyOtpErr: error.response.data.message,
      }));
    }
  };
  const RegisterUser = async () => {
    setApiRes((prev) => ({ ...prev, verifyOtpRes: "" }));
    try {
      const response = await axios.post(
        "/api/registeruser",
        {
          avatar: formData.avatar,
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          birthDate: formData.birthDate,
          hobbies: formData.hobbies,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setApiRes((prev) => ({ ...prev, verifyOtpRes: "" }));
      setApiRes((prev) => ({
        ...prev,
        RegisterUserRes: response.data.message,
      }));
      if (response.data.message) {
        resetForm();
        document.getElementById("resetButton").click();
      }
    } catch (error) {
      setApiErr((prev) => ({
        ...prev,
        RegisterUserErr: error.response.data.message,
      }));
    }
  };
  const sendOtp = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("/api/sendOTP", {
          email: formData.email,
        });
        setApiErr((prev) => ({...prev,sendOtpErr: "",}));
        setApiRes((prev) => ({ ...prev, sendOtpRes: response.data.message }));
      } catch (error) {
        setApiErr((prev) => ({
          ...prev,
          sendOtpErr: error.response.data.message,
        }));
      }
    }
  };
  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hobbies: checked
          ? [...prevFormData.hobbies, value]
          : prevFormData.hobbies.filter((v) => v !== value),
      }));
      setErrors((prevErrors) => ({ ...prevErrors, hobbies: "" }));
    } else if (type === "radio") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
    } else if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      
      setApiErr((prev) => ({ ...prev, verifyOtpErr: "" }));
      setApiErr((prev) => ({ ...prev, RegisterUserErr: "" }));
      setApiErr((prev) => ({ ...prev, sendOtpErr: "" }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    if (!emailRegex.test(formData.email)) {
      valid = false;
      errors.email = "Invalid email format";
    }
    if (formData.avatar == null) {
      valid = false;
      errors.avatar = "Pls Select Avtar";
    }
    if (!formData.gender.trim()) {
      valid = false;
      errors.gender = "Pls Select Gender";
    }
    if (!formData.birthDate.trim()) {
      valid = false;
      errors.birthDate = "Pls Select birthDate";
    }
    if (formData.hobbies.length == 0) {
      valid = false;
      errors.hobbies = "Pls Select Any Hobbies ";
    }
    if (!formData.firstName.trim()) {
      valid = false;
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      valid = false;
      errors.lastName = "Last name is required";
    }
    if (!(DisableRegistorButton)) {
      if (!formData.otp.trim()) {
        valid = false;
        errors.otp = "Verification OTP is required";
      }
    }
    if (!formData.password.trim()) {
      valid = false;
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword.trim()) {
      valid = false;
      errors.confirmPassword = "confirmPassword is required";
    }
    if (formData.password !== formData.confirmPassword) {
      valid = false;
      errors.confirmPassword = "Passwords do not match";
    }
    setErrors(errors);
    return valid;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (apiRes.verifyOtpRes) {
      if (validateForm()) {
        setApiRes((prev) => ({ ...prev, sendOtpRes: "" }));
      RegisterUser();
      }
    };
    }
  const goToLogin = async () => {
    Navigate("/Login")
  };
  useEffect(() => {
    if (!(formData.email === "")) {
      if (formData.otp.length === 6) {
        verifyOtp();
      }
      if (formData.otp.length < 6) {
        setDisableRegistorButton(true)
      }
      if (formData.otp.length > 6) {
        setDisableRegistorButton(true)
      }
    }
  }, [formData.otp]);

  return (
    <div className=" bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-5xl m-auto  bg-white bg-opacity-50 rounded-lg shadow-lg p-6 m-6 ">
        <div className=" text-3xl font-bold pb-3 ">Register User</div>
        <hr className=" pb-3 "></hr>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Input
              label="Select Avtar"
              type="file"
              name="avatar"
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.avatar}</p>}
          </div>
          <div>
            <Input
              label="Birth-Date:"
              type="date"
              name="birthDate"
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.birthDate}</p>}
          </div>
          <div>
            <Input
              label="Enter First-Name:"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <Input
              label="Enter Last-Name:"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.lastName}</p>}
          </div>
          <div>
            <p className="text-blue-600">Hobiees :</p>
            <InputTick
              label="Chess"
              type="checkbox"
              name="Chess"
              value="Chess"
              checked={formData.hobbies.includes("Chess")}
              onChange={handleChange}
            />
            <InputTick
              label="Cricket"
              type="checkbox"
              name="Cricket"
              value="Cricket"
              checked={formData.hobbies.includes("Cricket")}
              onChange={handleChange}
            />
            <InputTick
              label="Kabadi"
              type="checkbox"
              name="Kabadi"
              value="Kabadi"
              checked={formData.hobbies.includes("Kabadi")}
              onChange={handleChange}
            />
            <InputTick
              label="vollyboll"
              type="checkbox"
              name="vollyboll"
              value="vollyboll"
              checked={formData.hobbies.includes("vollyboll")}
              onChange={handleChange}
            />
            <InputTick
              label="Football"
              type="checkbox"
              name="Football"
              value="Football"
              checked={formData.hobbies.includes("Football")}
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.hobbies}</p>}
          </div>
          <div>
            <p className="text-blue-600">Gender :</p>
            <InputTick
              label="Male"
              type="radio"
              name="myRadio"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            <InputTick
              label="Female"
              type="radio"
              name="myRadio"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.gender}</p>}
          </div>
          <div>
            <Input
              label="E-mail id:"
              type="email"
              name="email"
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-3">
            <Button
              type="button"
              onClick={sendOtp}
              className="lg:mt-7 my-6 w-28 "
            >
              send OTP
            </Button>
            <div className="col-span-2">
              <Input
                label="Verification otp"
                type="password"
                name="otp"
                onChange={handleChange}
                className="sm:w-28 sm:ml-3 md:mt-6"
              />
            </div>
            <p className="text-green-800">{apiRes.sendOtpRes}</p>
            <p className="text-red-700 font-bold ">{apiErr.sendOtpErr}</p>
            <p className="text-green-800 ">{apiRes.verifyOtpRes}</p>
            <p className="text-red-700 font-bold">{apiErr.verifyOtpErr}</p>
          </div>
          <div>
            <Input
              label="Password:"
              type="password"
              name="password"
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.password}</p>}
          </div>
          <div>
            <Input
              label="Confirm-Paswword :"
              type="password"
              name="confirmPassword"
              onChange={handleChange}
            />
            {<p className="text-red-500">{errors.confirmPassword}</p>}
          </div>
          <div className="md:col-span-2">
            {apiRes.RegisterUserRes && <p className="text-green-700 text-lg" onClick={goToLogin} >{apiRes.RegisterUserRes} <br /> click Here To LogIn</p>}
            {<p className="text-red-700 text-lg">{apiErr.RegisterUserErr}</p>}
            <Button
              type="submit"
              disabled={DisableRegistorButton}
              className={`mt-4 w-full ${DisableRegistorButton? "bg-gray-500 cursor-not-allowed": "bg-blue-500"} text-white`}>Register User</Button>
          </div>
          <input type="reset" id="resetButton" className="hidden"></input>
        </form>
      </div>
    </div>
  );
}

export default Registration;
