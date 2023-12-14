import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReadEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //console.log('read:',location.state);
  const { eventId } =location.state || {}; 

  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset the state before fetching new data
    setEventData(null);
    setLoading(true);
    setErrors(null);

    if (!eventId) {
      // If there is no ID, we might want to navigate back 
      navigate('/admin-dashboard', { replace: true }); 
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/admin/event/${eventId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEventData(data);
        //console.log(eventData);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, navigate]);

  /*useEffect(() => {
    console.log(eventData); // This will log eventData after it's updated
  }, [eventData]); // Dependency array: this effect runs after eventData changes */


  const handleClick = () => {
    //e.preventDefault();
    // Redirect after submissionn
    navigate('/admin-dashboard'); 
  };

  if (loading || !eventData) {
    return <div>Loading...</div>;
  }



    return (
      <div className="container mt-5" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div className="card">
        <div className="card-header">
            <h2>Read Event</h2>
          </div>
          <div className="card-body">
          <div>
            <h3>Event Details</h3>
            <dl className="row">
              <dt className="col-sm-3">Event ID:</dt>
              <dd className="col-sm-9">{eventId}</dd>

              <dt className="col-sm-3">Title:</dt>
              <dd className="col-sm-9">{eventData.title}</dd>

              <dt className="col-sm-3">Date:</dt>
              <dd className="col-sm-9">{eventData.date}</dd>

              <dt className="col-sm-3">Description:</dt>
              <dd className="col-sm-9">{eventData.description}</dd>

              <dt className="col-sm-3">Presenter:</dt>
              <dd className="col-sm-9">{eventData.presenter}</dd>

              <dt className="col-sm-3">Price:</dt>
              <dd className="col-sm-9">{eventData.price}</dd>

              <dt className="col-sm-3">Venue ID:</dt>
              <dd className="col-sm-9">{eventData.venueId}</dd>
            </dl>
            <button type="button" onClick={handleClick} className="btn btn-success">Back to admin dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );

};

export default ReadEvent;
