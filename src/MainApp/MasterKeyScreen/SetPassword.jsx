import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import { useTheme } from '@material-ui/core/styles';

export default ({
  database, onPasswordLoaded, email,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [dialogContentIdx, setDialogContentIdx] = React.useState(0);

  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);

  const [retypedPassword, setRetypedPassword] = React.useState('');
  const [showRetypedPassword, toggleShowRetypedPassword] = React.useReducer((val) => !val, false);

  // Whether the buttons and text field are enabled or not
  const [enabled, toggleEnabled] = React.useReducer((val) => !val, true);

  // set the master password
  const setMasterPassword = async () => {
    if (password !== retypedPassword) {
      setErrorMessage('Passwords Do Not Match');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Passwords must be atleast 8 characters long');
      return;
    }
    // if (password.search(/[a-z]/i) < 0
    //   || password.search(/[A-Z]/i) < 0
    //   || password.search(/[0-9]/i) < 0
    //   || password.search(/[!@#$%^&*()-=+_|]/i)) {
    //   setErrorMessage('Passwords Must be atleast 8 characters long');
    //   return;
    // }
    // Clear the error message and disable the buttons and text inputs
    setErrorMessage('');
    toggleEnabled();
    const usersEmail = email;
    // Set loading state to loading
    onPasswordLoaded('loading');

    try {
      // Initialize the database with the given password
      await database.initialize(password);
      await database.insertAccount({
        name: 'PasswordManager',
        category: 'Linked Account',
        note: 'Default account added to show you have a GMail account linked with PasswordManager.',
        field1: `GMail - ${usersEmail}`,
      });
      // notify that the password has been loaded
      onPasswordLoaded();
    } catch (err) {
      // In case of error reanable the buttons and set error message
      console.log(err);
      toggleEnabled();
      setErrorMessage('Network Error. Try again later');
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const driveFolderDialogContent = (
    <>
      <DialogTitle>Drive Folder</DialogTitle>
      <DialogContent>
        <img src="/assets/Drive.png" width="100%" alt="drive" />
        <Typography variant="body2" color="textSecondary">
          A folder has been created in your Google Drive which contains a Google Sheet
          which will be used by the web app to store its data. Do not delete this folder or
          the sheet else all data will be lost.
        </Typography>
      </DialogContent>
      <DialogActions style={{ paddingRight: '24px' }}>
        <Button onClick={() => { setDialogContentIdx(1); }} color="primary">
          Ok
        </Button>
      </DialogActions>
    </>
  );

  const rememberPasswordDialogContent = (
    <>
      <DialogTitle>Note</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          In order to access your data you need to set a master password which
          will be needed to access your data in future.

          You need to remember this password since it cannot be reset or recovered.
        </Typography>
      </DialogContent>
      <DialogActions style={{ paddingRight: '24px' }}>
        <Button onClick={() => { setDialogContentIdx(2); }} color="primary">
          Ok
        </Button>
      </DialogActions>
    </>
  );
  const passwordDialogContent = (
    <>
      <DialogTitle id="responsive-dialog-title">Set Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Set the master password that will be used to encrypt the passwords stored.
        </Typography>
        <FormControl error={Boolean(errorMessage)} size="small" fullWidth variant="outlined" style={{ marginTop: 20 }}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
            disabled={!enabled}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
            label="Password"
          />
          <FormHelperText id="helper">{errorMessage}</FormHelperText>
        </FormControl>

        <FormControl fullWidth variant="outlined" size="small" style={{ marginTop: 16 }}>
          <InputLabel htmlFor="outlined-adornment-password">Re-enter Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showRetypedPassword ? 'text' : 'password'}
            value={retypedPassword}
            onChange={(e) => { setRetypedPassword(e.target.value); }}
            disabled={!enabled}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowRetypedPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
            label="Re-enter Password"
          />
        </FormControl>
      </DialogContent>
      <DialogActions style={{ paddingRight: '24px' }}>
        <Button onClick={setMasterPassword} disabled={!enabled && password.length > 0} color="primary" variant="contained">
          {!enabled && password.length > 0 ? 'Encrypting...' : 'Save'}
        </Button>
      </DialogActions>
    </>
  );
  const contentArray = [
    driveFolderDialogContent,
    rememberPasswordDialogContent,
    passwordDialogContent,
  ];
  return (
    <Dialog
      open
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
      {contentArray[dialogContentIdx]}
    </Dialog>
  );
};
