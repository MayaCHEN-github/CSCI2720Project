import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function UpdateEventButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = location.state || {};

  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    date: '',
    description: '',
    presenter: '',
    price: '',
    venueId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    // Only fetch data if eventId is present
    if (eventId) {
      setLoading(true);
      fetch(`http://localhost:8080/admin/event/${eventId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setFormData(data))
        .catch(error => setErrors(error.toString()))
        .finally(() => setLoading(false));
    } else {
      // If there is no ID, navigate back to the admin dashboard
      navigate('/admin-dashboard', { replace: true });
    }
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Implement the PATCH request to update the event data on the server
    try {
      const response = await fetch(`http://localhost:8080/admin/event/${eventId}`, {
        method: 'PATCH', // Using PATCH request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          <h2>Update Event</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdate}>
          <div className="mb-3">
              <label className="form-label">Event ID:</label>
              <input className="form-control" name="eventId" type="text" value={formData. eventId} onChange={handleChange} readOnly/>
            </div>
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input className="form-control" name="title" type="text" value={formData.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input className="form-control" name="date" type="text" value={formData.date} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Presenter:</label>
              <input className="form-control" name="presenter" type="text" value={formData.presenter} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input className="form-control" name="price" type="text" value={formData.price} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Venue ID:</label>
              <input className="form-control" name="venueId" type="text" value={formData.venueId} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success">Update Event</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateEventButton;
