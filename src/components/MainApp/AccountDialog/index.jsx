import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import AccountDialogContent from './ExistingAccountDialogContent';
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

  const { database } = React.useContext(ApiHandlerContext);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const [isDialogCancellable, setIsDialogCancellable] = React.useState(Boolean(props.account));

  const DialogContentComponent = (mode === Mode.NEW_ACCOUNT)
    ? NewAccountDialogContent
    : AccountDialogContent;
  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      fullWidth
      onClose={closeDialog}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick={isDialogCancellable}
      disableEscapeKeyDown={isDialogCancellable}
    >
      <DialogContentComponent
        {...{
          database, closeDialog, classes, setIsDialogCancellable,
        }}
        {...rest}
      />
    </Dialog>
  );
};
