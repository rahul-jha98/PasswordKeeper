import React from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import CategoryFieldsInput from './CategoryFieldsInput';

import LoadMaterialIcon from '../LoadMaterialIcon';

export default ({
  account, category, classes, variant,
}) => {
  const fields = {};
  Array.from({ length: 8 }, (_, i) => `field${i + 1}`).forEach((columnName) => {
    if (category[columnName]) {
      fields[category[columnName]] = account[columnName];
    }
  });
  const size = variant === 'filled' ? 'large' : 'small';
  return (
    <>
      <TextField
        id="type"
        label="Account Category"
        variant={variant}
        value={account.category}
        fullWidth
        size={size}
        InputProps={{
          startAdornment: <InputAdornment position="start"><LoadMaterialIcon name={category.icon} /></InputAdornment>,
        }}
      />
      <TextField
        className={`${classes.marginTop2} ${classes.marginBottom2}`}
        id="name"
        label="Name"
        variant={variant}
        value={account.name}
        fullWidth
        size={size}
      />
      <Typography
        variant="body2"
        className={classes.marginTop4}
        color="textSecondary"
      >
        Details
      </Typography>
      <CategoryFieldsInput
        className={classes.marginTop2}
        category={category}
        fields={fields}
        variant={variant}
        handleFieldsChange={() => {}}
        size={size}
      />
      <TextField
        className={classes.marginTop4}
        id="note"
        label="Note"
        variant={variant}
        value={account.note}
        multiline
        fullWidth
        size={size}
        rows={3}
      />
    </>
  );
};
