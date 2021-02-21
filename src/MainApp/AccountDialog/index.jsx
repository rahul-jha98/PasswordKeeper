import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import ExistingAccountDialogContent from './ExistingAccountDialogContent';
import NewAccountDialogContent from './NewAccountDialogContent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginBottom2: {
    marginBottom: theme.spacing(2),
  },
  marginTop4: {
    marginTop: theme.spacing(4),
  },
  actions: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));
export const Mode = {
  NEW_ACCOUNT: 0,
  EXISTING_ACCOUNT: 1,
};
export default (props) => {
  const {
    dialogOpen, setDialogOpen, mode, ...rest
  } = props;
  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const { database, showToast } = React.useContext(ApiHandlerContext);
  // State variable to conrol whether the dialog is cancellable when clicked outside
  const [isDialogCancellable, setIsDialogCancellable] = React.useState(true);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Depending on the mode either the NewAccountDialogContent or
  // ExistingAccountDialogContent is rendered
  const DialogContentComponent = (mode === Mode.NEW_ACCOUNT)
    ? NewAccountDialogContent
    : ExistingAccountDialogContent;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      fullWidth
      onClose={closeDialog}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick={!isDialogCancellable}
      disableEscapeKeyDown={!isDialogCancellable}
    >
      <DialogContentComponent
        {...{
          database, closeDialog, classes, setIsDialogCancellable, showToast,
        }}
        {...rest}
      />
    </Dialog>
  );
};
