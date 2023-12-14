import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReadUserInfo = ({ userId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userID: '',
    password: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://fetch过来/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h2>Read User Info</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label className="form-label">User ID:</label>
              <input className="form-control" name="userID" type="text" value={userData.userID} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input className="form-control" name="password" type="password" value={userData.password} readOnly />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReadUserInfo;
