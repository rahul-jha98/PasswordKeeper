import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const InputComponent = ({
  label, className, text, onTextChange, variant, size,
}) => (
  <TextField
    className={className}
    id={label}
    label={label}
    variant={variant}
    value={text}
    fullWidth
    size={size}
    onChange={onTextChange}
  />
);
const PasswordComponent = ({
  className, text, onTextChange, variant, size,
}) => {
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const Input = variant === 'filled' ? FilledInput : OutlinedInput;

  return (
    <FormControl className={className} size={size} variant={variant} fullWidth>
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <Input
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={text}
        onChange={onTextChange}
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
        labelWidth={70}
      />
    </FormControl>
  );
};

export default ({
  account, category, className, handleTextChange, variant, size,
}) => Array.from({ length: 5 }, (_, i) => `field${i + 1}`).map((columnName) => {
  const label = category[columnName];
  if (!label) return null;
  let Component = InputComponent;
  if (label === 'Password') {
    Component = PasswordComponent;
  }
  return (
    <Component
      {...{
        label, columnName, className, variant, size,
      }}
      key={label}
      text={account[columnName]}
      onTextChange={handleTextChange(columnName)}
    />
  );
});
