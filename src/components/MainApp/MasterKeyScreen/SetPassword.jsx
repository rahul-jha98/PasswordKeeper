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

export default ({
  database, onPasswordLoaded,
}) => {
  const [password, setPassword] = React.useState('');
  const [retypedPassword, setRetypedPassword] = React.useState('');
  const [enabled, toggleEnabled] = React.useReducer((val) => !val, true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);
  const [showRetypedPassword, toggleShowRetypedPassword] = React.useReducer((val) => !val, false);

  const setMasterPassword = async () => {
    try {
      if (password !== retypedPassword) {
        setErrorMessage('Passwords Do Not Match');
        return;
      }
      setErrorMessage('');
      toggleEnabled();

      await database.initialize(password);
      onPasswordLoaded();
    } catch {
      setErrorMessage('Network Error. Try again later');
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog
      open
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="responsive-dialog-title">Enter Master Password</DialogTitle>
      <DialogContent>
        Set the master password that will be used to encrypt the passwords stored.
        <FormControl error={Boolean(errorMessage)} size="small" fullWidth variant="outlined" style={{ marginTop: 20 }}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
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
          Set Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};
