import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddCategoryDialog from './AddCategoryDialog';

export default ({ closeDrawer }) => {
  const [open, toggleOpen] = React.useReducer((val) => !val, false);
  return (
    <>
      <Button
        fullWidth
        startIcon={<AddIcon />}
        style={{ marginTop: 8 }}
        onClick={() => { toggleOpen(); closeDrawer(); }}
      >
        Add New Category
      </Button>
      <AddCategoryDialog open={open} toggleOpen={toggleOpen} />
    </>
  );
};
