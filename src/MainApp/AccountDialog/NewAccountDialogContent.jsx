import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import FormComponents from './FormComponents';

export default ({
  database, classes, closeDialog, setIsDialogCancellable, showToast,
}) => {
  // Ensure that the dialog is not cancellable
  setIsDialogCancellable(false);

  // Get list of categories andd categories indexed by name
  const categories = database.getCategories();
  const categoriesMappings = {};
  categories.forEach((category) => {
    categoriesMappings[category.name] = category;
  });
  // Initial account state is set with all fields except category as blank
  const initialAccountState = { name: '', note: '', category: categories[0].name };
  Array.from({ length: 5 }, (_, i) => `field${i + 1}`).forEach((column) => {
    initialAccountState[column] = '';
  });

  const [account, setAccount] = useState(initialAccountState);
  const [nameError, setNameError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleClose = () => {
    // First close the dialog
    closeDialog();
    // Then after some delay reset the account to initialAccountState
    // The delay ensures user doesn't see flash of new content before close
    setTimeout(() => {
      setAccount(initialAccountState);
    }, 200);
  };

  const handleAddAccount = async () => {
    try {
      if (account.name.length === 0) {
        setNameError('Cannot be empty');
        return;
      } if (database.checkNameExist('data', account.name)) {
        setNameError('Account with this name already exists');
        return;
      }
      setNameError('');
      setDisabled(true);
      await database.insertAccount(account);
      closeDialog();
      showToast('Account has been added');
    } catch (err) {
      setNameError('Network Error. Try again later');
      setDisabled(false);
    }
  };

  return (
    <>
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>
        <FormComponents
          {...{
            account, setAccount, categoriesMappings, classes, nameError, disabled,
          }}
          mode="add"
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} color="primary" disabled={disabled}>
          Cancel
        </Button>
        <Button onClick={handleAddAccount} color="primary" variant="contained" disabled={disabled}>
          Add
        </Button>
      </DialogActions>
    </>
  );
};
