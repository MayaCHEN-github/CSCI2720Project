import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    type:'user',
    original_pw: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    setErrors(null);
    setLoading(true);
    e.preventDefault();
  
    // Implement the POST request to send the event data to the server
    try {
      const response = await fetch(`http://localhost:8080/admin/user/`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      //need to be fix here
      if (response.status === 400) {
        // If the status code is 400, display an alert
        alert("User exists, please change your User ID");
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const name = data.name;
      // Handle success - navigate back to the admin dashboard or show a success message
      navigate('/read-user', { state: { name } }, { replace: true });
    } catch (error) {
      setErrors({ ...errors, form: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  // Display loading state or errors if present
  if (loading) return <p>Loading...</p>;
  if (errors) return <p>Error loading form: {errors}</p>; 


  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h2>Create a New User</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">User name:</label>
              <input className="form-control" name="name" type="text" value={userData.name} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <label className="form-label">Type:</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    id="typeUser"
                    value="user"
                    checked={userData.type === 'user'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="typeUser">
                    User
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    id="typeAdmin"
                    value="admin"
                    checked={userData.type === 'admin'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="typeAdmin">
                    Admin
                  </label>
                </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input className="form-control" name="original_pw" type="text" value={userData.original_pw} onChange={handleChange} required/>
            </div>
            <button type="submit" className="btn btn-success">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
