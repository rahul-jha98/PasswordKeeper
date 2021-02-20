import React from 'react';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

const types = ['$-', '*-', '@-'];

export default ({
  label, text, setText, className, initialType, disabled,
}) => {
  const value = text.slice(2);

  const [typeIdx, setTypeIdx] = React.useState(initialType || 0);
  React.useEffect(() => {
    setText(`${types[typeIdx]}${value}`);
  }, [typeIdx]);
  return (
    <div>
      <TextField
        id={label}
        label={label}
        value={value}
        onChange={(event) => { setText(`${types[typeIdx]}${event.target.value}`); }}
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
