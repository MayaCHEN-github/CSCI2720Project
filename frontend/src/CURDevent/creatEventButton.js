import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    presenter: '',
    price: '',
    venueId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
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
      const response = await fetch(`http://localhost:8080/admin/event/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const eventId = data.eventId;
      // Handle success - navigate back to the admin dashboard or show a success message
      navigate('/read-event', { state: { eventId } }, { replace: true });
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
          <h2>Create a New Event</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input className="form-control" name="title" type="text" value={eventData.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input className="form-control" name="date" type="text" value={eventData.date} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea className="form-control" name="description" value={eventData.description} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Presenter:</label>
              <input className="form-control" name="presenter" type="text" value={eventData.presenter} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input className="form-control" name="price" type="text" value={eventData.price} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Venue ID:</label>
              <input className="form-control" name="venueId" type="text" value={eventData.venueId} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success">Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
