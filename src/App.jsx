import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.css';
import HomePage from './HomePage';
import GoogleAuth from './APIHandler/Auth';
import MainApp from './MainApp';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#145ea8',
    },
    secondary: {
      main: '#ef6c00',
    },

  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1520,
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
    // Setup authHandler to change the state when signin status changes
    this.authHandler.onSignInWithGoogle(
      (user) => {
        this.setState({ user });
      },
      (error) => {
        console.log(error);
      },
    );
  }

  render() {
    const { user } = this.state;
    // Based on the whenther user state is null or not we render
    // HomePage or the MainApp component
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
