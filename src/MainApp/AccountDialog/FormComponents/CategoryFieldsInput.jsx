import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CopyIcon from './CopyIcon';
import ApiHandlerContext from '../../provider/ApiHandlerContext';

// To check if a URL is visitable, check if it begins with http:// or https://
const isUrlVisitable = (text) => (text.startsWith('http://') || text.startsWith('https://'));

const InputComponent = ({
  label, className, text, onTextChange, variant, size, type, disabled, showToast,
}) => {
  let adornment = null;
  if (variant === 'filled' && text) {
    // A filled variant is used only in view mode so
    // if variant is filled and text is not empty
    if (type === '@' && isUrlVisitable(text)) {
      // If type is URL and url can be visited in new tab
      // set the adornment to OpenInNewTab icon
      adornment = (
        <Tooltip title="Open in new tab">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            href={text}
            rel="noopener noreferrer"
            target="_blank"
          >
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>

      );
    } else {
      // Else provide the copy adornment
      adornment = (
        <Tooltip title="Copy">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            onClick={() => { navigator.clipboard.writeText(text); showToast('Copied to clipboard'); }}
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>
      );
    }
  }
  // Depending on variant choose one of the Input types
  const Input = variant === 'filled' ? FilledInput : OutlinedInput;
  return (
    <FormControl className={className} size={size} variant={variant} fullWidth disabled={disabled}>
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
  label, className, text, onTextChange, variant, size, disabled, showToast,
}) => {
  const [showPassword, toggleShowPassword] = React.useReducer((val) => !val, false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const Input = variant === 'filled' ? FilledInput : OutlinedInput;

  return (
    <FormControl className={className} size={size} variant={variant} fullWidth disabled={disabled}>
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <Input
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={text}
        onChange={onTextChange}
        endAdornment={(
          <InputAdornment position="end">
            {variant === 'filled' ? (
              <Tooltip title="Copy">
                <IconButton
                  aria-label="copy text"
                  onClick={() => { navigator.clipboard.writeText(text); showToast('Copied to clipboard'); }}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>
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
        label={label}
      />
    </FormControl>
  );
};

export default ({
  account, category, className, handleTextChange, variant, size, disabled,
}) => {
  const { showToast } = React.useContext(ApiHandlerContext);

  return Array.from({ length: 5 }, (_, i) => `field${i + 1}`).map((columnName) => {
    // Let's say columnName is field1 so first extract the name of field
    const name = category[columnName];
    // If no name is found render nothing
    if (!name) return null;

    // Since the name is of the form $-Some Name, extract the type and label
    const type = name[0];
    const label = name.slice(2);
    // Depending on type, set Component to be either PasswordComponent or InputComponent
    const Component = (type === '*') ? PasswordComponent : InputComponent;

    return (
      <Component
        {...{
          label, columnName, className, variant, size, showToast,
        }}
        key={label}
        type={type}
        text={account[columnName]}
        onTextChange={handleTextChange(columnName)}
        disabled={disabled}
      />
    );
  });
};
