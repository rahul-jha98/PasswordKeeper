/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './HomePage.css';

const FeatureItem = ({ logoUrl, header, content }) => (
  <div className="item">
    <img src={logoUrl} alt="featuresvg" />
    <Typography variant="h6">{header}</Typography>
    <Typography
      variant="body1"
      color="textSecondary"
    >
      {content}
    </Typography>
  </div>
);

const featureItems = [
  {
    logoUrl: '/assets/masterpassword.svg',
    header: 'One master password',
    content: 'Just remember one master password which will be used to unlock PasswordKeeper and let it handle the rest',
  },
  {
    logoUrl: '/assets/drive.svg',
    header: 'Google Drive as backend',
    content: 'PasswordKeeper works without any backend server. The data you entered directly goes to your Google Drive.',
  },
  {
    logoUrl: '/assets/encryption.svg',
    header: 'Advanced Encryption',
    content: 'To ensure that no one can see your passwords even after getting access to your Google Drive the informations are encrypted using AES encryption before storing.',
  },
  {
    logoUrl: '/assets/github.svg',
    header: 'Completely Open Source',
    content: 'Password Keeper is completely open source so anyone could see and help make Password Keeper better for everyone else',
  },
];
export default class HomePage extends React.Component {
  handleGoogleSignIn = () => {
    this.props.authHandler.signInWithGoogle();
  }

  render() {
    return (
      <div>
        <Paper className="container" elevation={2}>
          <div className="landing">
            <img src="./assets/Logo.svg" alt="hello" width="100%" style={{ maxWidth: 450 }} />

            <Typography
              color="textSecondary"
              variant="body2"
              align="center"
              gutterBottom
            >
              Securely keep you passwords in your Google Drive

            </Typography>

            <div className="google-btn" onClick={this.handleGoogleSignIn}>
              <div className="google-icon-wrapper">
                <img
                  className="google-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="google-icon"
                />
              </div>
              <p className="btn-text"><b>Sign In with Google</b></p>
            </div>
          </div>
          <div className="landing heavyTopMargin">
            <Typography variant="h5"> Features</Typography>
            <div className="featuregrid">
              {featureItems.map((item) => (
                <FeatureItem {...item} />
              ))}
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
