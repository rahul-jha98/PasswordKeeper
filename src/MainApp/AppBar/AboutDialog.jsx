/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default ({ aboutOpen, toggleAboutOpen }) => (
  <Dialog fullScreen open={aboutOpen} onClose={toggleAboutOpen} TransitionComponent={Transition}>
    <Toolbar>
      <Typography variant="h5" style={{ textAlign: 'center', flexGrow: 1, marginLeft: 48 }}>
        <b>About</b>
      </Typography>
      <IconButton edge="end" color="inherit" onClick={toggleAboutOpen} aria-label="close">
        <CloseIcon />
      </IconButton>
    </Toolbar>
    <div className="container">

      <img
        alt="logo"
        align="center"
        src="https://raw.githubusercontent.com/rahul-jha98/PasswordKeeper/image_assets/Logo.svg"
        style={{
          maxWidth: 480, width: '100%', display: 'block', margin: 'auto',
        }}
      />
      <Typography gutterBottom style={{ marginTop: 48 }}>
        Password Keeper is a web app that can be used to store your passwords or other account details in your Google Drive.
        The data is store in an encrypted format and can only be decrypted using a master password that you set during first login.
      </Typography>

      <Typography variant="h5" gutterBottom style={{ marginTop: 48 }}> 🤔 Why Google Sheet? </Typography>
      <Typography gutterBottom>
        For storing all the encrypted passwords a Google Sheet stored in your Google Drive is used as a database. The reason for choosing this approach is that since the Google Sheet will only store the passwords of a singe person and the number of passwords a will hopefully never be more than hundred. Thus, there is not much performace harm in using Google Sheet to store data.
      </Typography>
      <Typography gutterBottom>
        But the benefit of using Google Sheet is that it completely removes the need for a backend. Since, Google provides REST API to manipulate Google Sheet the web-app could directly interact with data stored in Google Sheet.
      </Typography>
      <Typography variant="h5" gutterBottom style={{ marginTop: 48 }}> ⚡ Features </Typography>
      <Typography>
        With so many password manager already existing, one might wonder why should anyone choose PasswordKeeper. Here are a few reasons :-
        <ul>
          <li>
            <b>No Backend</b>
            {' '}
            - PasswordKeeper is a standalone web app without any backend server. The data you enter is saved directly in your Google Drive.
          </li>
          <li>
            <b>Web Based</b>
            {' '}
            - While there are many password managers that do not have a backend but rather store the passwords in the user's mobile device itself. The limitation of this approach is that if you don't have your mobile near you, you cannot access your passwords.
          </li>
          <li><b>Free to use</b></li>
          <li>
            <b>Open Source</b>
            {' '}
            - The complete source code of PasswordKeeper is available on Github thus you can verify that there is nothing suspicious happening and also help make PasswordKeeper better for everyone.
          </li>
          <li>
            <b>Custom Categories</b>
            {' '}
            - PasswordKeeper provides option to add categories with custom fields to customize it based on you use case.
          </li>
        </ul>
      </Typography>
    </div>
  </Dialog>
);
