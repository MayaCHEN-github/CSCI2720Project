import React, { useState, useEffect } from 'react';

function UpdateEventButton({ eventId }) {
  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    date: '',
    description: '',
    presenter: '',
    price: '',
    venueId: ''
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/admin/event/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Implement the update logic here
    console.log('Updating event:', formData);
    // Redirect or display a message after update
  };

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
              <input className="form-control" name="eventId" type="text"  value={formData. eventId} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input className="form-control" name="title" type="text" value={formData.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input className="form-control" name="date" type="date" value={formData.date} onChange={handleChange} />
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
