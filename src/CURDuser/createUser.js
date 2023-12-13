import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userID: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.userID) newErrors.userID = 'User ID is required';
    if (!userData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('Form submitted:', userData);
    navigate('/admin-dashboard'); // Redirect after submission
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h2>Create a New User</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">User ID:</label>
              <input className="form-control" name="userID" type="text" value={userData.userID} onChange={handleInputChange} />
              {errors.userID && <div className="invalid-feedback d-block">{errors.userID}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input className="form-control" name="password" type="password" value={userData.password} onChange={handleInputChange} />
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>
            <button type="submit" className="btn btn-success">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
