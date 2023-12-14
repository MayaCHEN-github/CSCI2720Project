import ReactDOM from "react-dom/client";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import './custom.css';
import mapImage from './images/hong-kong-map.jpeg';
import eventImage from './images/shutterstock.jpeg';
import favoriteImage from './images/Disneyland .jpeg';
import DB from './images/db.jpeg';
//import data from './data.json';
import UpdateEventButton from './CURDevent/UpdateEventButton.js'
import CreateEvent from './CURDevent/creatEventButton.js';
import ReadEvent from './CURDevent/readEventButton.js';
import UpdateUserInfo from './CURDuser/updateUserButton.js';
import CreateUser from './CURDuser/createUser.js';
import ReadUserInfo from './CURDuser/readUser.js';
import NotRegistered from './notRegister.js';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const user = {
  name: null
};

// Login
function LoginWithNavigate(props) {
  let navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 'user',
    };
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  setRole = (role) => {
    this.setState({ role });
  };
  
  //validate login and redirect
  handleSubmit = async (event) => {

    event.preventDefault();
    const name = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    const type = this.state.role;
    
    if (name && password){
      try {
        const response = await fetch('http://localhost:8080/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, password })
        });

        const data = await response.json();
        
        if (response.ok) {
          // Handle the success case, such as storing the token and redirecting the user
          if ( type === data.type)
          {
            console.log('Login successful:', data);
            user.name = data.name;
            const path = this.state.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
            this.props.navigate(path);
          } else {
            //handle the case when the user-admin toggle mismatch the user data.
            console.error('Login failed: user type mismatch.');
            alert('User type does not match.');
          }
        } else {
          // Handle errors, such as displaying an error message to the user
          console.log(data.name);
          console.log(data.password);
          console.error('Login failed:',data.error);
          alert('Login failed. Please check Username or Password once again.');
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Login failed. Please try again.');
      }
    }  
  };

    //To navigate
    notRegister = () => {
      this.props.navigate('/not-registered');
    }

  render() {
    return (
      <div className="login-background">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card login-card">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <h2>Log In</h2>
                    <div className="btn-group" role="group" aria-label="User Admin Toggle">
                      <button type="button" className={`btn ${this.state.role === 'user' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => this.setRole('user')}>User</button>
                      <button type="button" className={`btn ${this.state.role === 'admin' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => this.setRole('admin')}>Admin</button>
                    </div>
                  </div>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input type="text" className="form-control" id="username" ref={this.usernameRef} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password" ref={this.passwordRef} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">Continue →</button>
                    <div className="login-links text-center mt-3">
                    <a href="/not-registered" onClick={() => this.notRegister()}>Not Registered?</a> | <a href="/not-registered" onClick={() => this.notRegister()}>Forgot your password?</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// User dashboard 111
function UserDashboardWithNavigate(props) {
  let navigate = useNavigate();
  return <UserDashboard {...props} navigate={navigate} />;
}

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'Location',
      userName: user.name,
    };
  }

  setActiveMenuItem = (menuItem) => {
    this.setState({ activeMenuItem: menuItem });
  }

  renderIcon(name) {
    const icons = {
      Location: <svg viewBox="0 0 24 24" className="icon"><path d="M12 2C8.1 2 5 5.1 5 9c0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"></path></svg>,
      Event: <svg viewBox="0 0 24 24" className="icon"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"></path></svg>,
      Favorite: <svg viewBox="0 0 24 24" className="icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
      Map: <svg viewBox="0 0 24 24" className="icon">
        <path d="M21,3H3C1.9,3 1,3.9 1,5v14c0,1.1 0.9,2 2,2h18c1.1,0 2-0.9 2-2V5C23,3.9 22.1,3 21,3z M20,18l-6-4.5l-5,4L4,14V5l7,5l5-4l4,5V18z" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>

    };
    return icons[name];
  }

  renderContent() {
    const { activeMenuItem } = this.state;
    switch (activeMenuItem) {
      case 'Location':
        return <LocationContent navigate={this.props.navigate} />;
      case 'Event':
        return <EventContent />;
      case 'Favorite':
        return <FavoriteWithNavigate />;
      case 'Map':
        return <MapWithNavigate />;
      default:
        return null;
    }
  }

  handleLogout = () => {
    // set the user name to null
    user.name = null;

    // Redirect to the login page
    const path = '/login';
    this.props.navigate(path);
  };

  render() {
    const { activeMenuItem, userName } = this.state;
    return (
      <div className="dashboard  d-flex">
        <div className="sidebar d-flex flex-column">
          <div className="menu-header">Cultural Programmes</div>
          <div className="menu">
            {['Location', 'Event', 'Favorite', 'Map'].map((item) => (
              <div
                key={item}
                className={`menu-item ${activeMenuItem === item ? 'active' : ''}`}
                onClick={() => this.setActiveMenuItem(item)}
              >
                {this.renderIcon(item)}
                <span className="menu-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="main-content flex-grow-1 d-flex flex-column">
          <div className="top-bar d-flex justify-content-end align-items-center mb-2">
            <div className="user-logout">
              <span className="username-display" >{userName}</span>
              <button className="logout-btn" onClick={this.handleLogout}>Logout</button>
            </div>
          </div>

          {this.renderContent()}

        </div>
      </div>
    );
  }
}

// user- LocationContent
class LocationContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'Location',
      userName: user.name,
      sortMode: 'BY_LOCATION', // New state variable for sorting mode
      venues: [],
      searchTerm: '',
      filterApplied: false,
      userFavorites: [],
    };
  }

  componentDidMount() {
    this.fetchVenues();
    this.fetchUserFavorites();
  }

  fetchUserFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/favor/${this.state.userName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user favorites');
      }
      const favorites = await response.json();
      this.setState({ userFavorites: favorites });
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  }

  fetchVenues = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/venues/'); 
      if (!response.ok) {
        console.error('Error fetching venues:', response.status);
        return;
      }
      const data = await response.json();
      this.setState({ venues: data.combineArray });
    } catch (error) {
      console.error('Fetching venues failed:', error);
    }
  }

  setActiveMenuItem = (menuItem) => {
    this.setState({ activeMenuItem: menuItem });
  }

  renderIcon(name) {
    const icons = {
      Location: <svg viewBox="0 0 24 24" className="icon"><path d="M12 2C8.1 2 5 5.1 5 9c0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"></path></svg>,
      Event: <svg viewBox="0 0 24 24" className="icon"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"></path></svg>,
    };
    return icons[name];
  }

  handleRowClick = (locationData) => {
    this.props.navigate('/user-dashboard/singleLocation', { state: { locationData } });
  };

  handleStarClick = async (venueId) => {
    const isFavorite = this.state.userFavorites.includes(venueId);
    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      const response = await fetch(`http://localhost:8080/api/favor`, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: this.state.userName, venueId })
      });
      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
      }
      this.fetchUserFavorites(); // Refresh the favorites list
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  renderStar = (venueId) => {
    const isFavorite = this.state.userFavorites.includes(venueId);
    const fillColor = isFavorite ? "pink" : "none";
    return (
      <svg onClick={(e) => { e.stopPropagation(); this.handleStarClick(venueId); }} viewBox="0 0 24 24" className="icon" fill={fillColor}>
        <path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path>
      </svg>
    );
  };

  toggleSortMode = () => {
    this.setState(prevState => {
      switch (prevState.sortMode) {
        case 'BY_LOCATION':
          return { sortMode: 'HIGH_TO_LOW' };
        case 'HIGH_TO_LOW':
          return { sortMode: 'LOW_TO_HIGH' };
        default:
          return { sortMode: 'BY_LOCATION' };
      }
    });
  }

  getSortedLocations= () => {
    const { sortMode } = this.state;
    const  locations = this.state.venues;

    //const locations = [...data]; // Create a copy of the data
    switch (sortMode) {
      case 'HIGH_TO_LOW':
        return locations.sort((a, b) => b.eventCount - a.eventCount);
      case 'LOW_TO_HIGH':
        return locations.sort((a, b) => a.eventCount - b.eventCount);
      default:
        return locations.sort((a, b) => a["venueId"] - b["venueId"]);
    }
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchTerm: event.target.value });
    this.setState({ filterApplied: false });
  };

  handleSearch = () => {
    // Trigger search action
    this.setState({ filterApplied: true }); // Indicate that filtering should be applied
  };


  getFilteredAndSortedLocations = () => {
    const { sortMode, venues, searchTerm, filterApplied } = this.state;
    
    // Apply filter only if filterApplied is true
    let filteredVenues = filterApplied 
      ? venues.filter(venue => venue.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : venues;

    switch (sortMode) {
      case 'HIGH_TO_LOW':
        return filteredVenues.sort((a, b) => b.eventCount - a.eventCount);
      case 'LOW_TO_HIGH':
        return filteredVenues.sort((a, b) => a.eventCount - b.eventCount);
      default:
        return filteredVenues.sort((a, b) => a["venueId"] - b["venueId"]);
    }
  }

  render() {
    const locations = this.getFilteredAndSortedLocations();
    //console.log(sortedLocations);

    return (
      <div>
        <div className="search-filter-row">
          <div className="col-md-8 search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Locations"
              value={this.state.searchTerm}
              onChange={this.handleSearchInputChange}
            />
            <button className="search-btn" onClick={this.handleSearch}>&#10140;</button>
          </div>
          <div className="col-md-4 ">
            <button className="btn filter-btn" onClick={this.toggleSortMode}>
              Filter: Order by Event Number
            </button>
          </div>
        </div>

        <div className="image-row mt-3">
          <img src={mapImage} className="img-fluid" alt="Map" />
        </div>
        <div className="table-row mt-3 flex-grow-1">
        <table className="table">
          <thead>
            <tr>
              <th>Star</th>
              <th>Location</th>
              <th>Event Number</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(location => (
              <tr key={location["venueId"]} onClick={() => this.handleRowClick(location)}>
                <td>{this.renderStar(location["venueId"])}</td>
                <td>{location.name}</td>
                <td>{location.eventCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  }
}

// user- EventContent
class EventContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterUnder100: false,
      events:[]
    };
  }

  toggleFilter = () => {
    this.setState(prevState => ({
      filterUnder100: !prevState.filterUnder100,
    }));
  }
  
  fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/'); 
      if (!response.ok) {
        console.error('Error fetching events:', response.status);
        return;
      }
      const data = await response.json();
      this.setState({ events: data });
    } catch (error) {
      console.error('Fetching events failed:', error);
    }
  }
  componentDidMount() {
    this.fetchEvents();
  }

  isPriceUnder100 = (priceString) => {
    // Consider 'Free Admission' as under 100
    if (priceString === 'Free Admission' || priceString === '') {
      return true;
    }
    // If it's not 'Free Admission', parse the string for prices
    const prices = priceString.split(',').map(price => parseFloat(price.replace(/[^0-9.-]+/g, "")));
    return prices.some(price => price < 100);
  };

  // fitered the price under 100 events or not
  getFilteredEvents = () => {
    // Check the state to see whether to filter the events
    if (this.state.filterUnder100) {
      // Filter events with price under 100 or free
      return this.state.events.filter(event => this.isPriceUnder100(event.price));
    } else {
      // If filterUnder100 is false, return all events
      return this.state.events;
    }
  }
  //show the first num character of the event title
  truncateString(value, num) {
    let str = String(value);
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  render() {
    const allEvents = this.getFilteredEvents();

    return (
      <div>
        <div className="image-row mt-3">
          <img src={eventImage} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-end">
          <button class="btn event-btn" onClick={this.toggleFilter}>
            {this.state.filterUnder100 ? "Show All Events" : "Filter: Event whose price under $100"}
          </button>
        </div>
        <div className="table-row mt-3 flex-grow-1">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map(event => (
                <tr key={event.eventId}>
                  <td>{event.eventId}</td>
                  <td>{this.truncateString(event.title,40)}</td>
                  <td>{event.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

//
// TO BE FIXED
//
function FavoriteWithNavigate(props) {
  let navigate = useNavigate();
  // Retrieve the username from a global state/context or props
  const userName = user.name; // Replace with actual way of retrieving the username

  return <Favorite {...props} navigate={navigate} userName={userName} />;
}

class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [], // State to hold all venues
      favorites: [], // State to hold favorite venue IDs
    };
  }

  componentDidMount() {
    this.fetchFavorites(); // Fetch favorites when the component mounts
    this.fetchVenues(); // Fetch all venues
  }

  fetchVenues = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/venues/');
      if (!response.ok) {
        console.error('Error fetching venues:', response.status);
        return;
      }
      const data = await response.json();
      this.setState({ venues: data.combineArray });
    } catch (error) {
      console.error('Fetching venues failed:', error);
    }
  }

  fetchFavorites = async () => {
    try {
      const { userName } = this.props;
      const response = await fetch(`http://localhost:8080/api/favor/${userName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const favoriteVenueIds = await response.json();
      this.setState({ favorites: favoriteVenueIds });
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }

  render() {
    const { venues, favorites } = this.state;

    // Filter venues to include only those in the favorites list
    const favoriteVenues = venues.filter(venue => favorites.includes(venue.venueId));

    return (
      <div>
        <div className="image-row mt-3">
          <img src={favoriteImage} className="img-fluid" alt="Map" />
        </div>
        <div className="table-row mt-3 flex-grow-1">
          <table className="table">
            <thead>
              <tr>
                <th>Star</th>
                <th>Location</th>
                <th>Event Number</th>
              </tr>
            </thead>
            <tbody>
              {favoriteVenues.map((venue, index) => (
                <tr key={index}>
                  <td>
                    <svg viewBox="0 0 24 24" className="icon" fill="pink">
                      <path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path>
                    </svg>
                  </td>
                  <td>{venue.name}</td>
                  <td>{venue.eventCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}



// user- Single page
function SingleLocationWithNavigate(props) {
  let navigate = useNavigate();
  let location = useLocation();
  return <SingleLocation {...props} navigate={navigate} locationData={location.state?.locationData} />;
}

class SingleLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newComment: ''
    };
  }

  fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/venues/${this.props.locationData.venueId}`); 
      if (!response.ok) {
        console.error('Error fetching venues:', response.status);
        return;
      }
      const data = await response.json();
      this.setState({ comments: data.comments });
      console.log('Success:',data.comments);
    } catch (error) {
      console.error('Fetching venues failed:', error);
    }
  }

  componentDidMount() {
    this.fetchComments();
  }

  handleNewCommentChange = (event) => {
    this.setState({ newComment: event.target.value });
  };

  handleAddComment = async () => {
    const commentData = {
      venueId: this.props.locationData.venueId, // Including venueId if required by the backend in the body as well
      name: user.name,       // The name of the person making the comment
      content: this.state.newComment // The actual comment content
    };
    if (commentData.name) {
      try {
        const response = await fetch(`http://localhost:8080/api/venues/comment`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData) // Convert the JavaScript object to a JSON string
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Comment successfully added:', data);

        // Reset the newComment state to an empty string
        this.setState({ newComment: '' });
    
        // Optionally, refresh comments list or update UI here
        this.fetchComments(); // If you have a method to refresh comments
    
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      alert("please login first!");
      const path = '/login';
      this.props.navigate(path);
    }
  }

  navigateBack = () => {
    this.props.navigate('/user-dashboard');
  };

  parsePosition = (latitude, longitude) => {
    // Parse latitude and longitude to numbers and return as an object
    //console.log(latitude,longitude);
    return {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude)
    };
  };

  render() {
    const { locationData } = this.props;
    if (!locationData) {
      return <div>Loading...</div>; // Or handle the absence of data appropriately
    }

    const position = this.parsePosition(locationData.latitude,locationData.longitude);
    const mapStyles = {        
      height: "400px",
      width: "100%"
    };

    return (
      <div className="single-location-container">
        <h1>{locationData.name}</h1>
        <div className="map-container">
          <LoadScript googleMapsApiKey="AIzaSyC3Z5syc1h_61Bcp_qprCGb8z3usMzwkl4">
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={15}
              center={position}
            >
              <Marker position={position} />
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="details-container">
          <h2>Location Details</h2>
          <p><strong>Name:</strong> {locationData.name}</p>
          <p><strong>Event Number:</strong> {locationData.eventCount}</p>
          {/* <p><strong>Description:</strong> {locationData.Description}</p>
          <p><strong>Price:</strong> {locationData.Price}</p> */}
        </div>
        <div className="comments-container">
          <h2>User Comments</h2>
          <div className="comments-list">
            {this.state.comments.map((comment) => (
              <p key={comment.userName}>{comment.userName}: {comment.content}</p>
            ))}
          </div>
          <div className="add-comment-container">
            <input
              type="text"
              value={this.state.newComment}
              onChange={this.handleNewCommentChange}
              placeholder="Write a comment..."
            />
            <button onClick={this.handleAddComment}>Add Comment</button>
          </div>
        </div>
        <button onClick={this.navigateBack}>Back to Dashboard</button>
      </div>
    );
  }
}

// Map, this is for map session (the bigger one)
function MapWithNavigate(props) {
  let navigate = useNavigate();
  return <Map {...props} navigate={navigate} />;
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations:[]
    };
  }
  fetchVenues = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/venues/'); 
      if (!response.ok) {
        console.error('Error fetching venues:', response.status);
        return;
      }
      const data = await response.json();
      this.setState({ locations: data.combineArray });
      console.log('Success:',data);
    } catch (error) {
      console.error('Fetching venues failed:', error);
    }
  }

  componentDidMount() {
    this.fetchVenues();
  }

  parsePosition = (latitude, longitude) => {
    // Parse latitude and longitude to numbers and return as an object
    //console.log(latitude,longitude);
    return {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude)
    };
  };

  handleMarkerClick = (locationData) => {
    this.props.navigate('/user-dashboard/singleLocation', { state: { locationData } });
  };

  render() {
    const mapStyles = {
      height: "100vh",
      width: "100%"
    };

    const defaultCenter = {
      lat: 22.3193, // Central latitude of Hong Kong
      lng: 114.1694 // Central longitude of Hong Kong
    };

    return (
      <LoadScript googleMapsApiKey="AIzaSyC3Z5syc1h_61Bcp_qprCGb8z3usMzwkl4">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={11} // Adjusted zoom level
          center={defaultCenter}
        >
          {
           this.state.locations.map(item => {
            const position = this.parsePosition(item.latitude, item.longitude);
            return (
              <Marker 
                key={item.venueId} 
                position={position} 
                onClick={() => this.handleMarkerClick(item)}
                />
              )
            })
          }
        </GoogleMap>
      </LoadScript>
    )
  }
}


// Admin dashboard 222
class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'Event',
      adminName: 'Lucy'
    };
  }

  setActiveMenuItem = (menuItem) => {
    this.setState({ activeMenuItem: menuItem });
  }

  renderIcon(name) {
    const icons = {
      Event: <svg viewBox="0 0 24 24" className="icon"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"></path></svg>,
      User: <svg viewBox="0 0 24 24" className="icon">
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,3a3,3,0,1,1-3,3A3,3,0,0,1,12,5Zm0,14.2a7.2,7.2,0,0,1-6-3.1c0.1-2,4-3.1,6-3.1s5.9,1.1,6,3.1A7.2,7.2,0,0,1,12,19.2Z"></path>
      </svg>
    };
    return icons[name];
  }

  renderContent() {
    const { activeMenuItem } = this.state;
    switch (activeMenuItem) {
      case 'Event':
        return <StoredEventContentWithNavigate />;
      case 'User':
        return <UserContentWithNavigate />;
      default:
        return null;
    }
  }
  handleLogout = () => {
    // set the user name to null
    user.name = null;

    // Redirect to the login page
    const path = '/login';
    this.props.navigate(path);
  };

  render() {
    const { activeMenuItem, adminName } = this.state;
    return (
      <div className="dashboard  d-flex">
        <div className="sidebar d-flex flex-column">
          <div className="menu-header">Cultural Programmes</div>
          <div className="menu">
            {['Event', 'User'].map((item) => (
              <div
                key={item}
                className={`menu-item ${activeMenuItem === item ? 'active' : ''}`}
                onClick={() => this.setActiveMenuItem(item)}
              >
                {this.renderIcon(item)}
                <span className="menu-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="main-content flex-grow-1 d-flex flex-column">
          <div className="top-bar d-flex justify-content-end align-items-center mb-2">
            <div className="user-logout">
              <span className="username-display" >{adminName}</span>
              <button className="logout-btn" onClick={this.handleLogout}>Logout</button>
            </div>
          </div>

          {this.renderContent()}

        </div>
      </div>
    );
  }
}
// admin- CURD event
function StoredEventContentWithNavigate(props) {
  let navigate = useNavigate();
  return <StoredEventContent {...props} navigate={navigate} />;
}
class StoredEventContent extends React.Component {

  constructor(props) {
    super(props);
    // Initialize the state
    this.state = {
      events: [],
    };
  }


  // Function to fetch events
  fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/event');
      if (!response.ok) {
        // Handle response errors if necessary
        console.error('Error fetching events:', response.status);
        return;
      }
      const events = await response.json();
      this.setState({ events });
    } catch (error) {
      // Handle fetch errors if necessary
      console.error('Error fetching events:', error);
    }
  };

  deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/event/${eventId}`, {
        method: 'DELETE'
      });

      if (response.status === 404) {
        // Handle the case where the event was not found
        console.error(`There is no event with ID: ${eventId}`);
      } else if (response.status === 204) {
        // If the delete was successful, remove the event from the state
        this.setState(prevState => ({
          events: prevState.events.filter(event => event.eventId !== eventId)
        }));
      } else {
        // Handle other errors
        console.error('Failed to delete the event:', response.status);
      }
    } catch (error) {
      // Handle errors in communicating with the server
      console.error('Error deleting the event:', error);
    }
  };

  truncateString(value, num) {
    let str = String(value);
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }


  handleCreate = () => {
    this.props.navigate('/create-event');
  }
 
  readEvent = (id) => {
    this.props.navigate('/read-event');
  }
  
  updateEvent = (id) => {
    this.props.navigate('/update-event');
  }
  render() {
    const eventsInfo = this.state.events;

    return (
      <div className="stored-events-container container ">
        <div className="image-row">
          <img src={DB} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-between mb-2 align-items-center">
          <h2>Stored Events Management</h2>
          <div>
            <button className="btn btn-outline-primary action-button me-2" onClick={() => this.fetchEvents()}>
            Reload
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead className="bg-primary">
              <tr>
                <th scope="col">Event ID</th>
                <th scope="col">Event title</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsInfo.map(event => (
                <tr key={event.eventId}>
                  <td>{event.eventId}</td>
                  <td>{this.truncateString(event.title,30)}</td>
                  <td>
                  <button className="btn btn-outline-primary delete-button me-2" onClick={() => this.readEvent(event.eventId)}>
                      Read
                    </button>
                    <button className="btn btn-outline-danger delete-button me-2" onClick={() => this.deleteEvent(event.eventId)}>
                      Delete
                    </button>
                    {/* <UpdateEventButton eventId={event.eventId} onClick={() => this.updateEvent(event.eventId)} /> */}
                    <button className="btn btn-outline-warning action-button me-2" onClick={() => this.updateEvent(event.id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline-success create-button" onClick={this.handleCreate}>+ Create New Event</button>
      </div>
    );
  }
}
// admin- CURD user
function UserContentWithNavigate(props) {
  let navigate = useNavigate();
  return <User {...props} navigate={navigate} />;
}
class User extends React.Component {

  constructor(props) {
    super(props);
    // Initialize the state
    this.state = {
      users: [],
    };
  }
  
  fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/user');
      if (!response.ok) {
        // Handle response errors if necessary
        console.error('Error fetching events:', response.status);
        return;
      }
      const users = await response.json();
      this.setState({ users });
    } catch (error) {
      // Handle fetch errors if necessary
      console.error('Error fetching events:', error);
    }
  };

  //To navigate
  handleCreateUser = () => {
    this.props.navigate('/create-user');
  }
 
  readUser = (id) => {
    this.props.navigate('/read-user');
  }
  
  updateUser = (id) => {
    this.props.navigate('/update-user');
  }

  render() {
    const UsersInfo = this.state.users;

    
    return (
      <div className="stored-userss-container container ">
        <div className="image-row">
          <img src={DB} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-between mb-2 align-items-center">
          <h2>User Data Management</h2>
          <div>
            <button className="btn btn-outline-primary action-button me-2" onClick={() => this.fetchUsers()}>
            Reload
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead className="bg-primary">
              <tr>
                <th scope="col">User Name</th>
                <th scope="col">User Type</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {UsersInfo.map(user => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>{user.type}</td>
                  <td>
                    <button className="btn btn-outline-primary action-button me-2" onClick={() => this.props.readUser(user.name)}>
                    Read
                    </button>
                    <button className="btn btn-outline-danger delete-button me-2" onClick={() => this.props.handleDelete(user.name)}>
                      Delete
                    </button>
                    <button className="btn btn-outline-warning action-button me-2" onClick={() => this.props.updateUser(user.name)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline-success create-button" onClick={this.handleCreateUser}>+ Create New Event</button>

      </div>
    );
  }
}

// ROOT APP
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginWithNavigate />} />
          <Route path="/user-dashboard" element={<UserDashboardWithNavigate />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard/singleLocation" element={<SingleLocationWithNavigate />} />
          <Route path="/not-registered" element={<NotRegistered />} />
          {/* // Event CURD */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/read-event" element={<ReadEvent />} />
          <Route path="/update-event" element={<UpdateEventButton />} />
          {/* User CURD */}
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/read-user" element={<ReadUserInfo />} />
          <Route path="/update-user" element={<UpdateUserInfo />} /> 
        </Routes>
      </BrowserRouter>
    );
  }
}



const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

