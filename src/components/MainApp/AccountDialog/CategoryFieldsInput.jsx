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
  label, className, fields, handleFieldsChange, variant, size,
}) => (
  <TextField
    className={className}
    id={label}
    label={label}
    variant={variant}
    value={fields[label]}
    fullWidth
    size={size}
    onChange={handleFieldsChange(label)}
  />
);
const PasswordComponent = ({
  label, className, fields, handleFieldsChange, variant, size,
}) => {
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const Input = variant === 'filled' ? FilledInput : OutlinedInput;
  console.log(Input);
  return (
    <FormControl className={className} size={size} variant={variant}>
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <Input
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={fields[label]}
        onChange={handleFieldsChange(label)}
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
  fields, category, className, handleFieldsChange, variant, size,
}) => Array.from({ length: 8 }, (_, i) => `field${i + 1}`).map((columnName) => {
  const label = category[columnName];
  if (!label) return null;
  let Component = InputComponent;
  if (label === 'Password') {
    Component = PasswordComponent;
  }
  return (
    <Component
      {...{
        label, fields, handleFieldsChange, className, variant, size,
      }}
      key={label}
    />
  );
});
