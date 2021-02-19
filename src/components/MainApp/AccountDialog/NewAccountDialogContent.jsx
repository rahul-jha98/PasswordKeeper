import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import FormItems from './helpers/FormItems';

export default ({
  database, classes, closeDialog, setIsDialogCancellable, showToast,
}) => {
  const categories = database.getCategories();
  const categoriesMappings = {};
  categories.forEach((category) => {
    categoriesMappings[category.name] = category;
  });

  const initialAccountState = { name: '', note: '', category: categories[0].name };

  Array.from({ length: 5 }, (_, i) => `field${i + 1}`).forEach((column) => {
    initialAccountState[column] = '';
  });

  setIsDialogCancellable(false);

  const [nameError, setNameError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [account, setAccount] = useState(initialAccountState);
  // useEffect(() => {
  //   populateFields(categoryIdx);
  // }, [categoryIdx]);

  const handleClose = () => {
    closeDialog();
    setTimeout(() => {
      setAccount(initialAccountState);
    }, 100);
  };

  const handleAction = async () => {
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
      await database.insertPassword(account);
      closeDialog();
      showToast('Account has been added');
    } catch (err) {
      console.log(err);
      setNameError('Network Error. Try again later');
      setDisabled(false);
    }
  };

  return (
    <>
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>
        <FormItems
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
        <Button onClick={handleAction} color="primary" variant="contained" disabled={disabled}>
          Add
        </Button>
      </DialogActions>
    </>
  );
};
