import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { withStyles } from '@material-ui/core/styles';

import FormComponents from './FormComponents';

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
  const [open, toggleOpen] = React.useReducer((val) => !val, false);
  const confirmDialog = (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete account permanently?</DialogTitle>
      <DialogActions>
        <Button onClick={toggleOpen} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { onDeleteClicked(); toggleOpen(); }} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
  return (
    <>
      <DialogTitle disableTypography className={classes.root} {...other}>
        <Typography className={classes.title} variant="h6">{children}</Typography>
        <Tooltip title="Edit">
          <IconButton aria-label="edit" className={classes.icon} onClick={onEditClicked}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" className={classes.icon} onClick={toggleOpen}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      {confirmDialog}
    </>
  );
});

export default ({
  account, categoriesMappings, setIsDialogCancellable, classes, database, closeDialog,
}) => {
  // If account is not defined render nothing.
  if (!account) return null;
  // Store the initialAccountState in a variable
  const initialAccountState = { ...account };

  const [localAccount, setLocalAccount] = React.useState(initialAccountState);

  // Boolean to show if in edit mode or view mode
  const [editMode, toggleEditMode] = React.useReducer((value) => !value, false);
  // Dialog should be cancellable in view mode but not in edit mode
  setIsDialogCancellable(!editMode);

  // In normal mode the Title component is simple Dialog Title
  let Title = <DialogTitle>Edit Account Details</DialogTitle>;
  if (!editMode) {
    const onDeleteClicked = () => {
      database.deleteAccountAtIndex(account.row_idx);
      closeDialog();
    };

    const onEditClicked = () => {
      toggleEditMode();
    };

    // In view Mode dialog title had edit and delete option
    Title = (
      <DialogTitleWithEditAndDelete onDeleteClicked={onDeleteClicked} onEditClicked={onEditClicked}>
        View Account Details
      </DialogTitleWithEditAndDelete>
    );
  }

  const Content = (
    <FormComponents
      {...{ classes, categoriesMappings }}
      account={localAccount}
      setAccount={setLocalAccount}
      mode={editMode ? 'edit' : 'view'}
    />
  );

  // In view mode there is no actions to render
  let Actions = null;
  if (editMode) {
    const updateAccount = async () => {
      await database.updateAccount(localAccount);
      toggleEditMode();
    };
    // In edit mode cancel and update options are provided
    Actions = (
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={() => { toggleEditMode(); setLocalAccount(initialAccountState); }} color="primary">
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
