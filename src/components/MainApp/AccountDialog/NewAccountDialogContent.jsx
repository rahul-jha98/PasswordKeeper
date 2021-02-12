import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import FormItems from './helpers/FormItems';

export default ({
  database, classes, closeDialog,
}) => {
  const categories = database.getCategories();
  const categoriesMappings = {};
  categories.forEach((category) => {
    categoriesMappings[category.name] = category;
  });

  const initialAccountState = { name: '', note: '', category: categories[0].name };

  Array.from({ length: 8 }, (_, i) => `field${i + 1}`).forEach((column) => {
    initialAccountState[column] = '';
  });

  const [nameError] = useState('');
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

  const handleAction = () => {
    database.insertPassword(account);
    handleClose();
  };

  return (
    <>
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>
        <FormItems
          {...{
            account, setAccount, categoriesMappings, classes, nameError,
          }}
          mode="add"
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAction} color="primary" variant="contained" autoFocus>
          Add
        </Button>
      </DialogActions>
    </>
  );
};
