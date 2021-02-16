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
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);
  const [enabled, toggleEnabled] = React.useReducer((val) => !val, true);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const verifyPassword = async () => {
    toggleEnabled();
    try {
      const isPasswordCorrect = database.verifyPassword(password);
      if (isPasswordCorrect) {
        onPasswordLoaded();
      } else {
        toggleEnabled();
        setErrorMessage('Password Entered is Incorrect');
      }
    } catch {
      setErrorMessage('Error verifying password. Try again later');
    }
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
        <FormControl error={Boolean(errorMessage)} fullWidth variant="outlined">
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
      </DialogContent>
      <DialogActions style={{ paddingRight: '24px' }}>
        <Button onClick={verifyPassword} disabled={!enabled && password.length > 0} color="primary" variant="contained" autoFocus>
          Verify Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};
