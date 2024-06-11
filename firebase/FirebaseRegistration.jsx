import React, { useState } from "react";
import Button from "../utils/Button.jsx";
import Input from "../utils/Input.jsx";
import InputTick from "../utils/InputTick.jsx";
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase.js'; // import storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // import necessary functions from firebase/storage

function Registration() {
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({});
  const [formData, setFormData] = useState({
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

  const uploadAvatar = async (file) => {
    console.log(file);
    if (!file) return null;
    const storageRef = ref(storage, `avatars/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const RegisterUser = async () => {
    try {
      const { avatar, firstName, lastName, gender, birthDate, hobbies, email, password } = formData;
      const avatarUrl = await uploadAvatar(avatar);

      await addDoc(collection(firestore, 'users'), {
        firstName,
        lastName,
        gender,
        birthDate,
        hobbies,
        email,
        password,
        avatar: avatarUrl,
      });

      resetForm();
      setResponse({ firstName });
    } catch (error) {
      console.error('Error adding user: ', error);
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
      setErrors((prevErrors) => ({ ...prevErrors, hobbies: '' }));

    } else if (type === "radio") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));

    } else if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
      errors.avatar = "Please select an avatar";
    }
    if (!formData.gender.trim()) {
      valid = false;
      errors.gender = "Please select gender";
    }
    if (!formData.birthDate.trim()) {
      valid = false;
      errors.birthDate = "Please select birth date";
    }
    if (formData.hobbies.length === 0) {
      valid = false;
      errors.hobbies = "Please select any hobbies";
    }
    if (!formData.firstName.trim()) {
      valid = false;
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      valid = false;
      errors.lastName = "Last name is required";
    }
    if (!formData.password.trim()) {
      valid = false;
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword.trim()) {
      valid = false;
      errors.confirmPassword = "Confirm password is required";
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
    if (validateForm()) {
      RegisterUser();
    }
  };

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <Input label="Select Avatar" type="file" name="avatar" onChange={handleChange} />
          {errors.avatar && <p className="text-red-500">{errors.avatar}</p>}

          <Input label="Enter First-Name:" name="firstName" type="text" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

          <Input label="Enter Last-Name:" name="lastName" type="text" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

          <p className="text-white">Gender :</p>
          <InputTick label="Male" type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
          <InputTick label="Female" type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}

          <p className="text-white">Hobbies :</p>
          <InputTick label="Chess" type="checkbox" name="hobbies" value="Chess" checked={formData.hobbies.includes("Chess")} onChange={handleChange} />
          <InputTick label="Cricket" type="checkbox" name="hobbies" value="Cricket" checked={formData.hobbies.includes("Cricket")} onChange={handleChange} />
          <InputTick label="Kabadi" type="checkbox" name="hobbies" value="Kabadi" checked={formData.hobbies.includes("Kabadi")} onChange={handleChange} />
          <InputTick label="Volleyball" type="checkbox" name="hobbies" value="Volleyball" checked={formData.hobbies.includes("Volleyball")} onChange={handleChange} />
          <InputTick label="Football" type="checkbox" name="hobbies" value="Football" checked={formData.hobbies.includes("Football")} onChange={handleChange} />
          {errors.hobbies && <p className="text-red-500">{errors.hobbies}</p>}

          <Input label="Birth-Date:" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

          <Input label="E-mail id:" type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Input label="Password:" type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <Input label="Confirm-Password:" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}

          <br />
          {response.firstName && <p className="text-green-700 text-lg">User {response.firstName} is created successfully</p>}

          <Button type="submit" className="mt-4">Submit form</Button>
          <input type="reset" id="resetButton" className="hidden" />
        </form>
      </div>
    </div>
  );
}

export default Registration;
