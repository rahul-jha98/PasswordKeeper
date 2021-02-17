import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { withStyles } from '@material-ui/core/styles';

import FormItems from './helpers/FormItems';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: `${theme.spacing(3)} ${theme.spacing(1)}`,
    paddingRight: 12,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  icon: {
    color: theme.palette.text.secondary,
  },
});

const DialogTitleWithEditAndDelete = withStyles(styles)((props) => {
  const {
    children, classes, onEditClicked, onDeleteClicked, ...other
  } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h6">{children}</Typography>
      <IconButton aria-label="edit" className={classes.icon} onClick={onEditClicked}>
        <EditOutlinedIcon />
      </IconButton>
      <IconButton aria-label="delete" className={classes.icon} onClick={onDeleteClicked}>
        <DeleteOutlinedIcon />
      </IconButton>
    </DialogTitle>
  );
});

export default ({
  account, categoriesMappings, setIsDialogCancellable, classes, database, closeDialog,
}) => {
  if (!account) return null;
  const [localAccount, setLocalAccount] = React.useState(account);

  const [editMode, toggleEditMode] = React.useReducer((value) => !value, false);

  setIsDialogCancellable(!editMode);

  let Title = <DialogTitle>Edit Account Details</DialogTitle>;
  if (!editMode) {
    const onDeleteClicked = () => {
      database.deleteAccountAtIndex(account.row_idx);
      closeDialog();
    };

    const onEditClicked = () => {
      toggleEditMode();
    };

    Title = (
      <DialogTitleWithEditAndDelete onDeleteClicked={onDeleteClicked} onEditClicked={onEditClicked}>
        View Account Details
      </DialogTitleWithEditAndDelete>
    );
  }

  const Content = (
    <FormItems
      {...{ classes, categoriesMappings }}
      account={localAccount}
      setAccount={setLocalAccount}
      mode={editMode ? 'edit' : 'view'}
    />
  );

  let Actions = null;
  if (editMode) {
    const updateAccount = () => {
      database.updateAccount(localAccount);
      toggleEditMode();
    };
    Actions = (
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={toggleEditMode} color="primary">
          Cancel
        </Button>
        <Button onClick={updateAccount} color="primary" variant="contained" autoFocus>
          Update
        </Button>
      </DialogActions>
    );
  }

  return (
    <>
      {Title}
      <DialogContent>
        {Content}
      </DialogContent>
      {Actions}
    </>
  );
};
