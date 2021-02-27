import React from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import CategoryFieldsInput from './CategoryFieldsInput';
import CategoriesListSelect from './CategoriesListSelect';
import LoadMaterialIcon from '../../LoadMaterialIcon';

export default ({
  account, setAccount, classes, mode, nameError, categoriesMappings, disabled,
}) => {
  const category = categoriesMappings[account.category];
  let onTextChange = () => () => {
  };

  if (mode !== 'view') {
    onTextChange = (propName) => (event) => {
      setAccount({ ...account, [propName]: event.target.value });
    };
  }
  const variant = mode === 'view' ? 'filled' : 'outlined';
  const size = mode === 'view' ? 'medium' : 'small';

  const CategoryInput = mode === 'view' ? (
    <TextField
      id="type"
      label="Account Category"
      variant={variant}
      value={account.category}
      fullWidth
      size={size}
      onChange={onTextChange('category')}
      InputProps={{
        startAdornment: <InputAdornment position="start"><LoadMaterialIcon name={category.icon} /></InputAdornment>,
      }}
    />
  ) : (
    <CategoriesListSelect
      className={classes.marginTop2}
      text={account.category}
      onTextChange={onTextChange('category')}
      categoriesMappings={categoriesMappings}
      disabled={disabled || mode === 'edit'}
    />
  );

  return (
    <>
      {CategoryInput}
      <TextField
        className={`${classes.marginTop2} ${classes.marginBottom2}`}
        id="name"
        label="Name"
        variant={variant}
        value={account.name}
        fullWidth
        onChange={onTextChange('name')}
        size={size}
        error={Boolean(nameError)}
        helperText={nameError}
        disabled={disabled}
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
        account={account}
        variant={variant}
        handleTextChange={onTextChange}
        size={size}
        disabled={disabled}
      />
      <TextField
        className={classes.marginTop4}
        id="note"
        label="Notes"
        variant={variant}
        value={account.note}
        multiline
        fullWidth
        onChange={onTextChange('note')}
        size={size}
        rows={3}
        disabled={disabled}
        placeholder="Notes are not encrypted so make sure you don't enter anything sensetive here"
      />
    </>
  );
};
