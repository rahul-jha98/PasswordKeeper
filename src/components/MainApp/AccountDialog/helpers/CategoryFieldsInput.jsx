import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CopyIcon from './CopyIcon';

const InputComponent = ({
  label, className, text, onTextChange, variant, size, type,
}) => {
  let adornment = null;
  if (variant === 'filled' && text) {
    if (type === '@') {
      adornment = (
        <IconButton
          aria-label="toggle password visibility"
          edge="end"
          href={text}
          rel="noopener noreferrer"
          target="_blank"
        >
          <OpenInNewIcon />
        </IconButton>

      );
    } else {
      adornment = (
        <IconButton
          aria-label="toggle password visibility"
          edge="end"
          onClick={() => { navigator.clipboard.writeText(text); }}
        >
          <CopyIcon />
        </IconButton>
      );
    }
  }
  const Input = variant === 'filled' ? FilledInput : OutlinedInput;
  return (
    <FormControl className={className} size={size} variant={variant} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Input
        value={text}
        onChange={onTextChange}
        endAdornment={adornment ? (
          <InputAdornment position="end">{adornment}</InputAdornment>
        ) : null}
        label={label}
      />
    </FormControl>
  );
};
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
            {variant === 'filled' ? (
              <IconButton
                aria-label="copy text"
                onClick={() => { navigator.clipboard.writeText(text); }}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <CopyIcon />
              </IconButton>
            ) : null}

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
  const name = category[columnName];
  if (!name) return null;
  let Component = InputComponent;
  const [type, label] = name.split('-', 2);
  if (type === '*') {
    Component = PasswordComponent;
  }
  return (
    <Component
      {...{
        label, columnName, className, variant, size,
      }}
      key={label}
      type={type}
      text={account[columnName]}
      onTextChange={handleTextChange(columnName)}
    />
  );
});
