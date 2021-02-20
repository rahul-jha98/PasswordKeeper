import React from 'react';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import LoadMaterialIcon from '../LoadMaterialIcon';
import AccountDialog, { Mode } from '../AccountDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: 1500,
  },
  icon: {
    padding: '18px 28px 13px 28px',
    background: '#8B8B8B',
    color: 'white',
    borderRadius: theme.spacing(1),
  },
  text: {
    padding: '18px 8px 13px 12px',
    color: theme.palette.text.secondary,
  },
  card: {
    borderRadius: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    justifyContent: 'left',
  },
}));

export default ({
  passwordList, categoriesMappings, database, heading, deleteCategory, deleteEnabled,
}) => {
  const classes = useStyles();
  const [selectedIdx, setSelectedIdx] = React.useState(-1);
  const [dialogOpen, setDialogOpenValue] = React.useState(false);

  const setDialogOpen = (val) => {
    if (val) {
      window.location.hash = '#view';
    } else {
      window.history.back();
    }
  };
  const handleItemClick = (selected_item_idx) => () => {
    setTimeout(() => {
      setSelectedIdx(selected_item_idx);
      setDialogOpen(true);
    }, 200);
  };

  React.useEffect(() => {
    if (window.location.hash === '#view') {
      window.history.back();
    }
    const onHashChange = () => setDialogOpenValue(window.location.hash === '#view');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [open, toggleOpen] = React.useReducer((val) => !val, false);

  const confirmDialog = (
    <Dialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">Delete category?</DialogTitle>
      <DialogContent>
        The category and all the accounts belonging to it will be deleted.
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleOpen} color="primary">
          Disagree
        </Button>
        <Button onClick={() => { deleteCategory(); toggleOpen(); }} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={12} className="flex">
          <Typography variant="h5" style={{ flex: 1, padding: '8px 0' }}>{heading}</Typography>
          {deleteEnabled
            ? (
              <Tooltip title="Delete">
                <IconButton aria-label="delete" onClick={toggleOpen}>
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
            )
            : null}
        </Grid>
        {passwordList.length > 0
          ? passwordList.map((password, idx) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={password.name}>
              <Card className={classes.card}>
                <CardActionArea className={classes.flex} onClick={handleItemClick(idx)}>
                  <div className={classes.icon}>
                    <LoadMaterialIcon
                      name={categoriesMappings[password.category].icon}
                      style={{ fontSize: 32 }}
                    />
                  </div>
                  <Typography variant="h6" className={classes.text}>{password.name}</Typography>
                </CardActionArea>
              </Card>
            </Grid>
          )) : (
            <Grid
              item
              xs={12}
            >
              <Typography variant="body2" color="textSecondary">No account added</Typography>
            </Grid>
          )}
      </Grid>

      <AccountDialog
        account={database.decryptFields(passwordList[selectedIdx])}
        categoriesMappings={categoriesMappings}
        {...{ dialogOpen, setDialogOpen }}
        mode={Mode.EXISTING_ACCOUNT}
      />
      {confirmDialog}
    </div>
  );
};
