import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function UpdateUserInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name } =location.state || {}; 

  const [userData, setUserData] = useState({
    name: '',
    type: '',
    original_pw: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
     // Only fetch data if eventId is present
     if (name) {
      setLoading(true);
      fetch(`http://localhost:8080/admin/user/${name}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setUserData(data))
        .catch(error => setErrors(error.toString()))
        .finally(() => setLoading(false));
    } else {
      // If there is no ID, navigate back to the admin dashboard
      navigate('/admin-dashboard', { replace: true });
    }
  }, [name, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Implement the PATCH request to update the event data on the server
    try {
      const response = await fetch(`http://localhost:8080/admin/user/${name}`, {
        method: 'PATCH', // Using PATCH request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Handle success - perhaps navigate back to the admin dashboard or show a success message
      navigate('/admin-dashboard', { replace: true });
    } catch (error) {
      setErrors(error.toString());
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
          <h2>Update User Info</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">User name:</label>
              <input className="form-control" name="userID" type="text" value={userData.name} onChange={handleChange} readOnly/>
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
              <input className="form-control" name="original_pw" type="text" value={userData.original_pw} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success">Update User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
