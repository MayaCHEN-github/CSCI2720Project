import ReactDOM from "react-dom/client";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './custom.css';
import mapImage from './hong-kong-map.jpeg';
import eventImage from './shutterstock.jpeg';
import favoriteImage from './Disneyland .jpeg';
import map2 from './map2.png';
import DB from './db.jpeg';

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

  handleRowClick = (location) => {
    this.props.navigate(`/user-dashboard/${location}`);
  };

  render() {
    return (
      <div>
        <div className="search-filter-row">
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
              <tr onClick={() => this.handleRowClick('singleLocation')}>
                <td><svg viewBox="0 0 24 24" className="icon"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
                <td>Tai Po Public Library</td>
                <td>5</td>
              </tr>
              <tr onClick={() => this.handleRowClick('secondLocation')}>
                <td><svg viewBox="0 0 24 24" className="icon"><path d="M12 .587l3.297 6.677 7.4.574-5.35 5.209 1.263 7.367L12 17.75l-6.61 3.664 1.263-7.367-5.35-5.209 7.4-.574z"></path></svg></td>
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

// EventContent
class EventContent extends React.Component {
  render() {
    return (
      <div>
        <div className="image-row mt-3">
          <img src={eventImage} className="img-fluid" alt="Map" />
        </div>
        <div className="d-flex justify-content-end">
          <button class="btn event-btn">Filter: Event whose price under $100</button>
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
              <tr>
                <td>1</td>
                <td>'Cheers!' Series: Hong Kong Oratorio Society – A Christmas of Joy and Peace</td>
                <td>$380, $280, $180, $120</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Yeung Ming Night Vibes' Cantonese Opera Excerpts</td>
                <td>$340, $260, $240</td>
              </tr>

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
  return <SingleLocation {...props} navigate={navigate} />;
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

  render() {
    const locationDetails = {
      title: "Tai Po Public Library",
      venue: "12 Chai Road, Tai Po",
      date: "24.12.2023 (Sun) 3:00pm",
      description: "A community library with resources for all ages.",
      presenter: "Hong Kong Public Libraries",
      price: "Free Entry"
    };

    return (
      <div className="single-location-container">
        <h1>{locationDetails.title}</h1>
        <div className="map-container">
          <img src={map2} className="img-fluid" alt="Map" />
        </div>
        <div className="details-container">
          <h2>Location Details</h2>
          <p><strong>Venue:</strong> {locationDetails.venue}</p>
          <p><strong>Date/Time:</strong> {locationDetails.date}</p>
          <p><strong>Description:</strong> {locationDetails.description}</p>
          <p><strong>Presenter:</strong> {locationDetails.presenter}</p>
          <p><strong>Price:</strong> {locationDetails.price}</p>
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

function SecondLocationWithNavigate(props) {
  let navigate = useNavigate();
  return <SecondLocation {...props} navigate={navigate} />;
}
class SecondLocation extends React.Component {
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

  render() {
    const locationDetails = {
      title: "Yuen Long Public Library",
      venue: "Yuen Long, Ma Tin Rd, 52",
      date: "Opens 9am",
      description: "All libraries (except self-service library stations) will be closed on the following public holidays: New Year's Day, the first three days of the Chinese New Year, Good Friday, Christmas Day and Boxing Day.",
      presenter: "Hong Kong Public Libraries",
      price: "Free Entry"
    };

    return (
      <div className="single-location-container">
        <h1>{locationDetails.title}</h1>
        <div className="map-container">
          <img src={map2} className="img-fluid" alt="Map" />
        </div>
        <div className="details-container">
          <h2>Location Details</h2>
          <p><strong>Venue:</strong> {locationDetails.venue}</p>
          <p><strong>Date/Time:</strong> {locationDetails.date}</p>
          <p><strong>Description:</strong> {locationDetails.description}</p>
          <p><strong>Presenter:</strong> {locationDetails.presenter}</p>
          <p><strong>Price:</strong> {locationDetails.price}</p>
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
          <Route path="/user-dashboard/secondLocation" element={<SecondLocationWithNavigate />} />
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

