import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import SetPassword from './SetPassword';
import VerifyPassword from './VerifyPassword';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    flexDirection: 'column',
  },
  text: {
    margin: 20,
  },
  actions: {
    position: 'fixed',
    bottom: theme.spacing(2),
    textAlign: 'center',
    color: '#e0e0e0',
  },
}));
/**
 * @typedef MasterKeyScreenProps
 *
 * @property {string | null} action
 * what is the mode of screen to be rendered
 *   - if null, a progress bar with message is displayed
 *   - if 'verify', shows VerifyPasswordDialog
 *   - if 'add', show SetPasswordDialog
 *
 * @property {string} message
 * The message which is rendered belong the circular progress bar
 *
 * @property {function} onPasswordLoaded
 * callback to notify that the password had been entered and being processed
 */

/** @param {MasterKeyScreenProps} props */
export default (props) => {
  const {
    action, message, database, onPasswordLoaded, email, authHandler,
  } = props;
  const classes = useStyles();
  // By default we begin with a circular progress bar and message
  let content = (
    <>
      <CircularProgress color="inherit" />
      <Typography variant="body" className={classes.text}>{ message }</Typography>
      {email
        ? (
          <div className={classes.actions}>
            <Typography variant="body2" style={{ margin: 8 }}>
              Signed In as
              {' '}
              { email }
            </Typography>
            <Button variant="outlined" color="inherit" onClick={authHandler.signOutFromGoogle}>
              Sign Out
            </Button>
          </div>
        )
        : null}
    </>
  );

  // if action is one of 'verify' or 'add' we set content to SetPassword or VerifyPassword
  if (action === 'verify') {
    content = <VerifyPassword database={database} onPasswordLoaded={onPasswordLoaded} />;
  } else if (action === 'add') {
    content = <SetPassword database={database} onPasswordLoaded={onPasswordLoaded} email={email} />;
  }
  return (
    <div>
      <Backdrop className={classes.backdrop} open>
        {content}
      </Backdrop>
    </div>
  );
};
