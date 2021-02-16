import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import SetPassword from './SetPassword';
import VerifyPassword from './VerifyPassword';

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

export default (props) => {
  const {
    message, action, database, onPasswordLoaded,
  } = props;
  const classes = useStyles();
  let content = (
    <>
      <CircularProgress color="inherit" />
      <Typography variant="body" className={classes.text}>{ message }</Typography>
    </>
  );
  if (action === 'verify') {
    content = <VerifyPassword database={database} onPasswordLoaded={onPasswordLoaded} />;
  } else if (action === 'add') {
    content = <SetPassword database={database} onPasswordLoaded={onPasswordLoaded} />;
  }
  return (
    <div>
      <Backdrop className={classes.backdrop} open>
        {content}
      </Backdrop>
    </div>
  );
};
