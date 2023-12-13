import React, { useState, useEffect } from 'react';

function UpdateEventModal({ eventId, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    presenter: '',
    price: '',
    venueId: ''
  });

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log(eventId)
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

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/admin/event/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Event updated successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="modal"> {/* Modal container, it should be styled to appear on top of the content */}

      {/* Form inputs here, similar to previous example */}
      <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
        <div className="card">
          <form onSubmit={handleUpdate}>
          <div className="card-header">
            <h2>Update eate a Event</h2>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Event ID:</label>
                <input className="form-control" name="eventId" type="text" placeholder={formData.eventId} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Title:</label>
                <input className="form-control" name="title" type="text"  placeholder={formData.title} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Date:</label>
                <input className="form-control" name="date" type="date" placeholder={formData.date} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea className="form-control" name="description" placeholder={formData.description} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Presenter:</label>
                <input className="form-control" name="presenter" type="text" placeholder={formData.presenter} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Price:</label>
                <input className="form-control" name="price" type="text" placeholder={formData.price} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Venue ID:</label>
                <input className="form-control" name="venueId" type="text" placeholder={formData.venueId} onChange={handleChange}/>
              </div>
              <button type="submit" className="btn btn-success">Create Event</button>
            </form>
          </div><button type="submit">Update Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        </div>
      </div>


    </div>
  );
}

function UpdateEventButton({ eventId }) {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <>
      <button className="btn btn-outline-warning action-button me-2" onClick={showModal}>Update</button>
      {modalVisible && <UpdateEventModal eventId={eventId} onClose={hideModal} />}
    </>
  );
}

export default UpdateEventButton;