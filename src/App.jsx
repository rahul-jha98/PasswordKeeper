import React from 'react';

import './App.css';
import HomePage from './components/HomePage';
import GoogleAuth from './APIHandler/Auth';
import MainApp from './components/MainApp';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.authHandler = new GoogleAuth();
  }

  componentDidMount = () => {
    this.authHandler.onSignInWithGoogle(
      (user) => {
        console.log(`Status of user changed to ${user}`);
        this.setState({ user });
      },
      (error) => {
        console.log(error);
      },
    );
  }

  render() {
    const { user } = this.state;
    if (!user) {
      return <HomePage authHandler={this.authHandler} />;
    }
    return (
      <MainApp authHandler={this.authHandler} />
    );
  }
}

export default App;
