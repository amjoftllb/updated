import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const App = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    bio: '',
    country: '',
    agreeToTerms: false,
    dateOfBirth: '',
  };

  const validate = (values) => {
    let errors = {};

    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    if (!values.age) {
      errors.age = 'Age is required';
    } else if (isNaN(values.age)) {
      errors.age = 'Age must be a number';
    }
    if (!values.gender) {
      errors.gender = 'Gender is required';
    }
    if (!values.bio) {
      errors.bio = 'Bio is required';
    }
    if (!values.country) {
      errors.country = 'Country is required';
    }
    if (!values.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms';
    }
    if (!values.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }

    return errors;
  };

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ errors, touched }) => (
        <Form>
          <Field type="text" name="name" placeholder="Name" />
          {errors.name && touched.name && <div className="error">{errors.name}</div>}

          <Field type="email" name="email" placeholder="Email" />
          {errors.email && touched.email && <div className="error">{errors.email}</div>}

          <Field type="password" name="password" placeholder="Password" />
          {errors.password && touched.password && <div className="error">{errors.password}</div>}

          <Field type="number" name="age" placeholder="Age" />
          {errors.age && touched.age && <div className="error">{errors.age}</div>}

          <div>
            <label>
              <Field type="radio" name="gender" value="male" />
              Male
            </label>
            <label>
              <Field type="radio" name="gender" value="female" />
              Female
            </label>
            {errors.gender && touched.gender && <div className="error">{errors.gender}</div>}
          </div>

          <Field as="textarea" name="bio" placeholder="Bio" />
          {errors.bio && touched.bio && <div className="error">{errors.bio}</div>}

          <Field as="select" name="country">
            <option value="">Select your country</option>
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
          </Field>
          {errors.country && touched.country && <div className="error">{errors.country}</div>}

          <div>
            <label>
              <Field type="checkbox" name="agreeToTerms" />
              I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && touched.agreeToTerms && <div className="error">{errors.agreeToTerms}</div>}
          </div>

          <Field type="date" name="dateOfBirth" />
          {errors.dateOfBirth && touched.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default App;
