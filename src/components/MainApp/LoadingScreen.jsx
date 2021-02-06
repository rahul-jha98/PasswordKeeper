import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    flexDirection: 'column',
  },
  text: {
    margin: 20,
  },
}));

export default ({ message }) => {
  const classes = useStyles();
  return (
    <div>
      <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
        <Typography variant="body" className={classes.text}>{ message }</Typography>
      </Backdrop>
    </div>
  );
};
