import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReadEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventId: '1',
    title: '2',
    date: '3',
    description: '4',
    presenter: '5',
    price: '6',
    venueId: '7'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Redirect after submission
    navigate('/admin-dashboard'); 
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
    <div className="card">
      <div className="card-header">
          <h2>Read Event</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Event ID:</label>
              <input className="form-control" name="eventId" type="text" value={eventData.eventId} onChange={handleInputChange} readOnly/>
            </div>
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input className="form-control" name="title" type="text" value={eventData.title} onChange={handleInputChange} readOnly />
              {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input className="form-control" name="date" type="date" value={eventData.date} onChange={handleInputChange} readOnly />
              {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea className="form-control" name="description" value={eventData.description} onChange={handleInputChange} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Presenter:</label>
              <input className="form-control" name="presenter" type="text" value={eventData.presenter} onChange={handleInputChange}  readOnly/>
            </div>
            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input className="form-control" name="price" type="text" value={eventData.price} onChange={handleInputChange} readOnly/>
            </div>
            <div className="mb-3">
              <label className="form-label">Venue ID:</label>
              <input className="form-control" name="venueId" type="text" value={eventData.venueId} onChange={handleInputChange} readOnly />
            </div>
            <button type="submit" className="btn btn-success">Back to admin dashboard</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReadEvent;
