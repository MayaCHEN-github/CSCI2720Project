import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReadUserInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name } =location.state || {}; 

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    // Reset the state before fetching new data
    //setEventData(null);
    setLoading(true);
    setErrors(null);
    console.log(name);
    if (!name) {
      // If there is no ID, we might want to navigate back 
      navigate('/admin-dashboard', { replace: true }); 
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/admin/user/${name}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData(data);
        //console.log(eventData);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name, navigate]);

  const handleClick = () => {
    //e.preventDefault();
    // Redirect after submissionn
    navigate('/admin-dashboard'); 
  };

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h2>Read User Info</h2>
        </div>
        <div className="card-body">
        <div>
            <h3>User Details</h3>
            <dl className="row">
              <dt className="col-sm-3">User Name:</dt>
              <dd className="col-sm-9">{name}</dd>

              <dt className="col-sm-3">User Type:</dt>
              <dd className="col-sm-9">{userData.type}</dd>

              <dt className="col-sm-3">Password:</dt>
              <dd className="col-sm-9">{userData.original_pw}</dd>
            </dl>
            <button type="button" onClick={handleClick} className="btn btn-success">Back to admin dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadUserInfo;
