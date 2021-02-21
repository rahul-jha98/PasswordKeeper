import React from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

// The following prefix is for the possible types
// $- being normal text, *- being password and @- for weblink
const types = ['$-', '*-', '@-'];

export default ({
  label, text, setText, disabled, className, initialType,
}) => {
  // The text is of the format *-Name of field so we slice from 2nd index
  // to extract only Name from it
  const value = text.slice(2);

  // If an initialType is passed, use that or by default set it to 0
  const [typeIdx, setTypeIdx] = React.useState(initialType || 0);

  // Whenever the typeIdx changes, call setText with the updated prefix
  React.useEffect(() => {
    setText(`${types[typeIdx]}${value}`);
  }, [typeIdx]);

  return (
    <div>
      <TextField
        id={label}
        label={label}
        value={value}
        onChange={(event) => {
          /* If the user enters a value call set text with prefix appended */
          setText(`${types[typeIdx]}${event.target.value}`);
        }}
        className={className}
        fullWidth
        variant="outlined"
        size="small"
        disabled={disabled}
      />
      <div style={{ margin: '8px 0px', textAlign: 'right' }}>
        <Chip
          style={{ marginLeft: 4 }}
          variant={typeIdx === 0 ? 'default' : 'outlined'}
          clickable
          size="small"
          label="Normal Text"
          onClick={() => { setTypeIdx(0); }}
        />
        <Chip
          style={{ marginLeft: 4 }}
          variant={typeIdx === 1 ? 'default' : 'outlined'}
          clickable
          size="small"
          label="Password"
          onClick={() => { setTypeIdx(1); }}
        />
        <Chip
          style={{ marginLeft: 4 }}
          variant={typeIdx === 2 ? 'default' : 'outlined'}
          clickable
          size="small"
          label="Hyperlink"
          onClick={() => { setTypeIdx(2); }}
        />
      </div>
    </div>
  );
};
