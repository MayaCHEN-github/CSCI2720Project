import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventId: '',
    title: '',
    date: '',
    description: '',
    presenter: '',
    price: '',
    venueId: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.title) newErrors.title = 'Title is required';
    if (!eventData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('Form submitted:', eventData);
    // Redirect after submission
    navigate('/admin-dashboard'); 
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
    <div className="card">
      <div className="card-header">
          <h2>Create a New Event</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Event ID:</label>
              <input className="form-control" name="eventId" type="text" value={eventData.eventId} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input className="form-control" name="title" type="text" value={eventData.title} onChange={handleInputChange} />
              {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input className="form-control" name="date" type="date" value={eventData.date} onChange={handleInputChange} />
              {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea className="form-control" name="description" value={eventData.description} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Presenter:</label>
              <input className="form-control" name="presenter" type="text" value={eventData.presenter} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input className="form-control" name="price" type="text" value={eventData.price} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Venue ID:</label>
              <input className="form-control" name="venueId" type="text" value={eventData.venueId} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-success">Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
