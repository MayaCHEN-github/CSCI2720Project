import ReactDOM from "react-dom/client";
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPageWithLocation />} />
        <Route path="/user" element={<UserPageWithLocation />} />
        <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    );
  }
}



class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      navigateTo: null, // This will hold the path to navigate to after login
    };
  }

  isAdmin = (username) => {
    return username === 'admin';
  } // This function is to verify if this user is an admin, should contact with database

  verify = (username, password) => {
    return true
  } // This function is for verification, should contact with database

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    
    // Assuming the verify function will be an async function in the future
    try {
      const isVerified = await this.verify(username, password);
      if (isVerified) {
        if (this.isAdmin(username)) {
          // Set the state to navigate to the admin route
          this.setState({ navigateTo: '/admin' });
        } else {
          // Set the state to navigate to the user route
          this.setState({ navigateTo: '/user' });
        }
      } else {
        // Handle failed verification, such as showing an error message
        console.error('Verification failed. Incorrect username or password.');
        // You might want to update the state to reflect the error condition here.
      }
    } catch (error) {
      // Handle errors that may occur during verification, such as network issues
      console.error('Error during verification:', error);
      // Again, you might want to update the state to reflect the error condition here.
    }
  };  

  render() {
    // Check if navigateTo is set, and navigate to the respective route
    if (this.state.navigateTo) {
      return <Navigate to={this.state.navigateTo} state={{ username: this.state.username }} />;
    }

    // The login form is displayed if not logged in
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form id="loginForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}





const UserPageWithLocation = () => {
  const location = useLocation();
  return <UserPage location={location} />;
};
// This is used to pass username to UserPage [Do Not Modify]

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigateToLogin: false
    };
  }

  handleLogout = () => {
    this.setState({ navigateToLogin: true });
  }

  render() {
    // Access the username from the location state
    const username = this.props.location?.state?.username;
    console.log(username)
    
    if (this.state.navigateToLogin) {
      return <Navigate to="/login" />;
    }

    return (
      <div>
        <h3>User Page</h3>
        <h3>Logged in as: <code>{username}</code></h3>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}






const AdminPageWithLocation = () => {
  const location = useLocation();
  return <AdminPage location={location} />;
};
// This is used to pass username to AdminPage [Do Not Modify]

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigateToLogin: false
    };
  }

  handleLogout = () => {
    // Here you can also handle other logout operations such as clearing tokens
    this.setState({ navigateToLogin: true });
  }

  render() {
    // Access the username from the location state
    const username = this.props.location?.state?.username;
    console.log(username)

    if (this.state.navigateToLogin) {
      return <Navigate to="/login" />;
    }

    return (
      <div>
        <h3>Admin Page</h3>
        <h3>Logged in as: <code>{username}</code></h3>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>No Match for <code>{location.pathname}</code></h3>
    </div>
  );
}




const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App/>);
