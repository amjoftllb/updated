import React, { useState } from "react";
import Button from "../utils/Button.jsx";
import Input from "../utils/Input.jsx";
import InputTick from "../utils/InputTick.jsx";
import axios from "axios"
import React, { useState, useEffect } from "react";
import Button from "../componets/Button.jsx";
import Input from "../componets/Input.jsx";
import InputTick from "../componets/InputTicks.jsx";
import axios from "axios";
import { useDispatch ,useSelector } from "react-redux";
import { updateUser } from "../store/action&Reducers/auth.Action.js";


function UpdateDetails() {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.rootReducer.user.userData);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    email: "",
    hobbies: [],
  });

  useEffect(() => {
    if (userData) {
      console.log(userData.hobbies);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        gender: userData.gender || "",
        email: userData.email || "",
        hobbies: userData.hobbies || [],
      });
    }
  }, [userData]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hobbies: checked
          ? [...prevFormData.hobbies, value]
          : prevFormData.hobbies.filter((v) => v !== value),
      }));
    } else if (type === "radio") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: value,
      }));
    } else if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
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
    if (!formData.email.trim()) {
      valid = false;
      errors.email = "Email is required";
    }

    setErrors(errors);
    return valid;
  };
  const UpdateUser = async () => {
    try {
      console.log("request done");
      const response = await axios.post(
        "/api/updateDetails",
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
      dispatch(updateUser(response.data.data))
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      UpdateUser();
    }
  };

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
        <div className="text-3xl font-bold pb-3">Update Your Details Here</div>
        <hr className="pb-3" />
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <Input
            label="Select Avtar"
            type="file"
            name="avatar"
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.avatar}</p>}
          <Input
            label="E-mail id:"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.email}</p>}
          <Input
            label="First-Name:"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          <hr />
          {<p className="text-red-500">{errors.firstName}</p>}
          <Input
            label="Last-Name:"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.lastName}</p>}
          <Input
            label="Birth-Date:"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.birthDate}</p>}
          <Input
            label="Password:"
            type="password"
            name="password"
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.password}</p>}
          <hr className="m-4" />
          <p className="text-blue-600 font-bold">Gender :</p>
          <InputTick
            label="Male"
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleChange}
          />
          <InputTick
            label="Female"
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.gender}</p>}
          <p className="text-blue-600 font-bold">Hobbies :</p>
          <InputTick
            label="Chess"
            type="checkbox"
            name="hobbies"
            value="Chess"
            checked={formData.hobbies.includes("Chess")}
            onChange={handleChange}
          />
          <InputTick
            label="Cricket"
            type="checkbox"
            name="hobbies"
            value="Cricket"
            checked={formData.hobbies.includes("Cricket")}
            onChange={handleChange}
          />
          <InputTick
            label="Kabadi"
            type="checkbox"
            name="hobbies"
            value="Kabadi"
            checked={formData.hobbies.includes("Kabadi")}
            onChange={handleChange}
          />
          <InputTick
            label="vollyboll"
            type="checkbox"
            name="hobbies"
            value="vollyboll"
            checked={formData.hobbies.includes("vollyboll")}
            onChange={handleChange}
          />
          <InputTick
            label="Football"
            type="checkbox"
            name="hobbies"
            value="Football"
            checked={formData.hobbies.includes("Football")}
            onChange={handleChange}
          />
          {<p className="text-red-500">{errors.hobbies}</p>}
          <br />
          
          <Button type="submit" className="mt-4">
            Update Details
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UpdateDetails;

function UpdateDetails() {
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    hobbies: [],
    email: "",
  });
  
  const RegisterUser = async () => {
    try {
      console.log("request done");
      console.log(formData.firstName);
      const response = await axios.post(
        "/api/updateDetails",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          birthDate: formData.birthDate,
          hobbies: formData.hobbies,
          email: formData.email,
        });
      setResponse(response)
      return response;
    } catch (error) {
      console.log(error);
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
    } else if (type === "radio") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true

    if (!emailRegex.test(formData.email)) {
      valid = false
      errors.email = "Invalid email format";
    }
    if (!formData.email.trim()) {
      valid = false
      errors.email = "Email is Requierd ";
    }
    
    setErrors(errors);
    return valid

  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    if (validateForm()) {
      RegisterUser();
    }
    
  };
  return (
    <div className=" bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto  bg-white bg-opacity-50 rounded-lg shadow-lg p-6 ">

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

      <div className="text-slate-700 text-xl" >Update Your Details Here</div><br /><hr /><br />
      
    <Input label="E-mail id:" type="email" name="email"  onChange={handleChange}/>
    {<p className="text-red-500">{errors.email}</p>}<br /><hr /><br />
    <Input label="First-Name:" name="firstName" type="text" value={formData.firstName}  onChange={handleChange}/><hr />
    {<p className="text-red-500">{errors.firstName}</p>}
    <Input label="Last-Name:" name="lastName" type="text" value={formData.lastName}  onChange={handleChange}/>
    {<p className="text-red-500">{errors.lastName}</p>}
    <Input label="Birth-Date:" type="date" name="birthDate"  onChange={handleChange}/>
    {<p className="text-red-500">{errors.birthDate}</p>} <br /><hr /><br />
    
    <p className="text-white">Gender :</p>
    <InputTick label="Male" type="radio" name="myRadio" value="Male"  checked={formData.gender === 'Male'} onChange={handleChange}/>
    <InputTick label="Female" type="radio" name="myRadio" value="Female"  checked={formData.gender === 'Female'} onChange={handleChange}/>
    {<p className="text-red-500">{errors.gender}</p>}

    <p className="text-white">Hobiees :</p>
    <InputTick label="Chess" type="checkbox" name="Chess" value="Chess"  checked={formData.hobbies.includes("Chess")} onChange={handleChange}/>
    <InputTick label="Cricket" type="checkbox" name="Cricket" value="Cricket"  checked={formData.hobbies.includes("Cricket")} onChange={handleChange}/>
    <InputTick label="Kabadi" type="checkbox" name="Kabadi" value="Kabadi"  checked={formData.hobbies.includes("Kabadi")} onChange={handleChange}/>
    <InputTick label="vollyboll" type="checkbox" name="vollyboll" value="vollyboll"  checked={formData.hobbies.includes("vollyboll")} onChange={handleChange}/>
    <InputTick label="Football" type="checkbox" name="Football" value="Football"  checked={formData.hobbies.includes("Football")} onChange={handleChange}/>
    {<p className="text-red-500">{errors.hobbies}</p>}
    <br />
    {response.status && <p className="text-green-700 text-lg">UserDetails {response.firstName} Updated Sucessfully</p>}
    
   <Button type="submit" className="mt-4">Update Details</Button>

 </form>
      </div>
    </div>
  );
}

export default UpdateDetails;


