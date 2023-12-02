import ReactDOM from "react-dom/client";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './custom.css';
import mapImage from './hong-kong-map.jpeg';
import eventImage from './shutterstock.jpeg';
import favoriteImage from './Disneyland .jpeg';
import DB from './db.jpeg';
import data from './data.json';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';





// Login
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

  handleSubmit = (event) => {
    event.preventDefault();
    const path = this.state.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    this.props.navigate(path);
  };

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
                      <a href="/register">Not Registered?</a> | <a href="/forgot-password">Forgot your password?</a>
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

function UserDashboardWithNavigate(props) {
  let navigate = useNavigate();
  return <UserDashboard {...props} navigate={navigate} />;
}


class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'Location',
      userName: 'Amanda',
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
        return <Favorite />;
      case 'Map':
        return <MapWithNavigate />;
      default:
        return null;
    }
  }

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
              <button className="logout-btn" onClick={this.props.onLogout}>Logout</button>
            </div>
          </div>

          {this.renderContent()}

          {/* <div className="search-filter-row">
            <div className="col-md-8 search-container">
              <input type="text" className="search-bar" placeholder="Search Locations" />
              <button className="search-btn">&#10140;</button>
            </div>
            <div className="col-md-4 ">
              <button className="btn filter-btn">Filter: Order by Event Number</button>
            </div></div>

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
                <tr>
                  <td><svg viewBox="0 0 24 24" className="icon"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                  <td>Tai Po Public Library</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td><svg viewBox="0 0 24 24" className="icon"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                  <td>Yuen Long Public Library</td>
                  <td>10</td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    );
  }
}

// LocationContent
class LocationContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'Location',
      userName: 'Amanda',
      sortMode: 'BY_LOCATION', // New state variable for sorting mode
    };
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

  getSortedLocations() {
    const { sortMode } = this.state;
    const locations = [...data]; // Create a copy of the data

    switch (sortMode) {
      case 'HIGH_TO_LOW':
        return locations.sort((a, b) => b.Events.length - a.Events.length);
      case 'LOW_TO_HIGH':
        return locations.sort((a, b) => a.Events.length - b.Events.length);
      default:
        return locations.sort((a, b) => a["Location Number"] - b["Location Number"]);
    }
  }

  render() {
    const sortedLocations = this.getSortedLocations();

    return (
      <div>
        <div className="search-filter-row">
          <div className="col-md-8 search-container">
            <input type="text" className="search-bar" placeholder="Search Locations" />
            <button className="search-btn">&#10140;</button>
          </div>
          <div className="col-md-4 ">
          <button className="btn filter-btn" onClick={this.toggleSortMode}>Filter: Order by Event Number</button>
          </div></div>

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
              {sortedLocations.map(location => (
                <tr key={location["Location Number"]} onClick={() => this.handleRowClick(location)}>
                  <td><svg viewBox="0 0 24 24" className="icon"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                  <td>{location.Location}</td>
                  <td>{location.Events.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// EventContent
class EventContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterUnder100: false,
    };
  }

  toggleFilter = () => {
    this.setState(prevState => ({
      filterUnder100: !prevState.filterUnder100,
    }));
  }

  isPriceUnder100 = (priceString) => {
    const prices = priceString.split(';').map(price => parseFloat(price.replace(/[^0-9.-]+/g, "")));
    return prices.some(price => price < 100);
  }

  getFilteredEvents() {
    let allEvents = [];
    // Aggregate all events from each location
    data.forEach(location => {
      location.Events.forEach(event => {
        if (!this.state.filterUnder100 || this.isPriceUnder100(event.Price)) {
          allEvents.push(event);
        }
      });
    });
    return allEvents;
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
              {allEvents.map((event, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{event["Event Name"]}</td>
                  <td>{event.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}


class Favorite extends React.Component {
  render() {
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
              <tr>
                <td><svg viewBox="0 0 24 24" className="icon" fill="pink"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                <td>Tai Po Public Library</td>
                <td>5</td>
              </tr>
              <tr>
                <td><svg viewBox="0 0 24 24" className="icon" fill="pink"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                <td>Yuen Long Public Library</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

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

  handleNewCommentChange = (event) => {
    this.setState({ newComment: event.target.value });
  };

  handleAddComment = () => {
    this.setState(prevState => ({
      comments: [...prevState.comments, prevState.newComment],
      newComment: ''
    }));
  };

  navigateBack = () => {
    this.props.navigate('/user-dashboard');
  };

  parsePosition(positionString) {
    const [lat, lng] = positionString.split(',').map(Number);
    return { lat, lng };
  }

  render() {
    const { locationData } = this.props;
    if (!locationData) {
      return <div>Loading...</div>; // Or handle the absence of data appropriately
    }

    const position = this.parsePosition(locationData.Position);
    const mapStyles = {        
      height: "400px",
      width: "100%"
    };

    return (
      <div className="single-location-container">
        <h1>{locationData.Location}</h1>
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
          <p><strong>Address:</strong> {locationData.Address}</p>
          <p><strong>Hours:</strong> {locationData.Hours}</p>
          <p><strong>Description:</strong> {locationData.Description}</p>
          <p><strong>Price:</strong> {locationData.Price}</p>
        </div>
        <div className="comments-container">
          <h2>User Comments</h2>
          <div className="comments-list">
            {this.state.comments.map((comment, index) => (
              <p key={index}>{comment}</p>
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
      locations: data
    };
  }

  parsePosition(positionString) {
    const [lat, lng] = positionString.split(',').map(Number);
    return { lat, lng };
  }

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
            const position = this.parsePosition(item.Position);
            return (
              <Marker 
                key={item["Location Number"]} 
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


// Admin 
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
        return <StoredEventContent />;
      case 'User':
        return <User />;
      default:
        return null;
    }
  }

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
              <button className="logout-btn" onClick={this.props.onLogout}>Logout</button>
            </div>
          </div>

          {this.renderContent()}

        </div>
      </div>
    );
  }
}

class StoredEventContent extends React.Component {

  render() {
    const eventsInfo = [
      { id: 1, info: 'Event 1 Information' },
      { id: 2, info: 'Event 2 Information' },
      { id: 3, info: 'Event 3 Information' },
      { id: 4, info: 'Event 4 Information' },
    ];

    return (
      <div className="stored-events-container container ">
        <div className="image-row">
          <img src={DB} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-between mb-2 align-items-center">
          <h2>Stored Events Management</h2>
          <div>
            <button className="btn btn-outline-primary action-button me-2">Read</button>
            <button className="btn btn-outline-warning action-button">Update</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead className="bg-primary">
              <tr>
                <th scope="col">Information</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsInfo.map(event => (
                <tr key={event.id}>
                  <td>{event.info}</td>
                  <td>
                    <button className="btn btn-outline-danger delete-button" onClick={() => this.props.handleDelete(event.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline-success create-button" onClick={this.props.handleCreate}>+ Create New Event</button>
      </div>
    );
  }
}




class User extends React.Component {
  
  render() {
    const UsersInfo = [
      { id: 1, info: 'User 1 Information' },
      { id: 2, info: 'User 2 Information' },
      { id: 3, info: 'User 3 Information' },
      { id: 4, info: 'User 4 Information' },
    ];

    return (
      <div className="stored-events-container container ">
        <div className="image-row">
          <img src={DB} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-between mb-2 align-items-center">
          <h2>User Data Management</h2>
          <div>
            <button className="btn btn-outline-primary action-button me-2">Read</button>
            <button className="btn btn-outline-warning action-button">Update</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead className="bg-primary">
              <tr>
                <th scope="col">Information</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {UsersInfo.map(event => (
                <tr key={event.id}>
                  <td>{event.info}</td>
                  <td>
                    <button className="btn btn-outline-danger delete-button" onClick={() => this.props.handleDelete(event.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline-success create-button" onClick={this.props.handleCreate}>+ Create New Event</button>
      </div>
    );
  }
}

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
        </Routes>
      </BrowserRouter>
    );
  }
}

function LoginWithNavigate(props) {
  let navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

