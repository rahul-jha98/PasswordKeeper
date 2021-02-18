import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.css';
import HomePage from './components/HomePage';
import GoogleAuth from './APIHandler/Auth';
import MainApp from './components/MainApp';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#145ea8',
    },
    secondary: {
      main: '#ef6c00',
    },

  },
  typography: {
    fontFamily: [
      'Work Sans',
    ].join(','),
  },
});

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

export default () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
