import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';

import FormItems from '../FormItems';
import ApiHandlerContext from '../../provider/ApiHandlerContext';

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
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: `${theme.spacing(3)} ${theme.spacing(1)}`,
    paddingRight: 6,
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
    children, classes, onClose, onDeleteClicked, ...other
  } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h6">{children}</Typography>
      <IconButton aria-label="edit" className={classes.icon} onClick={onClose}>
        <EditOutlinedIcon />
      </IconButton>
      <IconButton aria-label="delete" className={classes.icon} onClick={onDeleteClicked}>
        <DeleteOutlinedIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

export default ({
  account, setSelectedIdx, categoriesMappings,
}) => {
  if (!account) return null;
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const category = categoriesMappings[account.category];

  const { database } = React.useContext(ApiHandlerContext);

  const closeDialog = () => {
    setSelectedIdx(-1);
  };

  const onDeleteClicked = () => {
    database.deleteAccountAtIndex(account.row_idx);
    closeDialog();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open
      fullWidth
      onClose={closeDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitleWithEditAndDelete onDeleteClicked={onDeleteClicked}>
        View Account Details
      </DialogTitleWithEditAndDelete>
      <DialogContent className={classes.root}>
        <FormItems {...{ account, category, classes }} variant="filled" />
      </DialogContent>
    </Dialog>
  );
};
