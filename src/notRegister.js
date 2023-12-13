import React from 'react';

const NotRegistered = () => {
  return (
    <div className="container mt-4">
      <div className="card text-center">
        <div className="card-header">
        Need Help with Your Account?
        </div>
        <div className="card-body mp-2">
          <p className="card-text">Please contact the support team to create your account.</p>
          <p>Email: <a href="mailto:culturalProgram@gmail.com" className="btn btn-primary">culturalProgram@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotRegistered;
