import React, { useState } from "react";
import Button from "../utils/Button.jsx";
import Input from "../utils/Input.jsx";
import InputTick from "../utils/InputTick.jsx";
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase.js';

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

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      hobbies: [],
      email: "",
    });
    setErrors({});
  }

  const fetchUserData = async (email) => {
    const q = query(collection(firestore, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      setFormData({ ...userData, hobbies: userData.hobbies || [] });
    } else {
      setErrors({ email: 'User not found' });
    }
  }

  const updateUser = async () => {
    try {
      const q = query(collection(firestore, 'users'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(firestore, 'users', userDoc.id);

        await updateDoc(userDocRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          birthDate: formData.birthDate,
          hobbies: formData.hobbies,
        });

        setResponse({ status: 'success', firstName: formData.firstName });
        resetForm();
        document.getElementById('resetButton').click();
      } else {
        setErrors({ email: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      updateUser();
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      await fetchUserData(formData.email);
    }
  };

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="max-w-lg m-auto bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
        <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col">
          <Input label="E-mail id:" type="email" name="email" onChange={handleChange} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <Button type="submit" className="mt-4">Fetch User Data</Button>
        </form>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col mt-4">
          <Input label="First-Name:" name="firstName" type="text" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

          <Input label="Last-Name:" name="lastName" type="text" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

          <Input label="Birth-Date:" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

          <p className="text-white">Gender :</p>
          <InputTick label="Male" type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
          <InputTick label="Female" type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}

          <p className="text-white">Hobbies :</p>
          <InputTick label="Chess" type="checkbox" name="Chess" value="Chess" checked={formData.hobbies.includes("Chess")} onChange={handleChange} />
          <InputTick label="Cricket" type="checkbox" name="Cricket" value="Cricket" checked={formData.hobbies.includes("Cricket")} onChange={handleChange} />
          <InputTick label="Kabadi" type="checkbox" name="Kabadi" value="Kabadi" checked={formData.hobbies.includes("Kabadi")} onChange={handleChange} />
          <InputTick label="Volleyball" type="checkbox" name="Volleyball" value="Volleyball" checked={formData.hobbies.includes("Volleyball")} onChange={handleChange} />
          <InputTick label="Football" type="checkbox" name="Football" value="Football" checked={formData.hobbies.includes("Football")} onChange={handleChange} />
          {errors.hobbies && <p className="text-red-500">{errors.hobbies}</p>}
          
          <Button type="submit" className="mt-4">Update Details</Button>
          {response.status && <p className="text-green-700 text-lg">User details updated successfully</p>}
          <input type="reset" id="resetButton" className="hidden" />
        </form>
      </div>
    </div>
  );
}

export default UpdateDetails;
