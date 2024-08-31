'use client';
import React, { useState } from 'react';
// import FileUpload from './FileUpload';
import './Form.css';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
const Form = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    income: ''
    // documents: []
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    if (
      e.target.name === 'zip' ||
      e.target.name === 'phone' ||
      e.target.name === 'income'
    ) {
      if (isNaN(e.target.value)) {
        return;
      }
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleFileUpload = (files) => {
  //   setFormData({
  //     ...formData,
  //     documents: files
  //   });
  // };

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      dob: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      income: ''
      // documents: []
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post('/api/initialize', formData);
      router.push('/client');
    } catch (error: any) {
      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
      console.error(error.message);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="p-20">
        <Loading />
      </div>
    );

  return (
    <div className="initialize ">
      <div className="container">
        <h1>Personal Information</h1>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="name">
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div>
              <label>Gender</label>
            </div>

            <div className="gender-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Transgender"
                  onChange={handleChange}
                />
                Transgender
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Prefer not to say"
                  onChange={handleChange}
                />
                Prefer not to say
              </label>
            </div>
          </div>

          <div>
            <label>Income</label>
            <input
              type="text"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="address">
            <div>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Pin Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label>phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* <FileUpload onFileUpload={handleFileUpload} files={formData.documents}/> */}

          <div className="actions">
            <div className="checkbox-group">
              <input type="checkbox" required />
              <label>I agree that the information provided is correct</label>
            </div>
            <button type="submit" className="submit-btn">
              Submit Application
            </button>
            <button type="reset" className="reset-btn">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
