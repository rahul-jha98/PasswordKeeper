import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import ApiHandlerContext from '../provider/ApiHandlerContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textField: {
    width: '48ch',
  },
}));

export default ({ dialogOpen, setDialogOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const { database } = React.useContext(ApiHandlerContext);

  const categories = database.getCategories();

  const [nameError] = useState('');
  const [info, setInfo] = useState({ name: '', note: '' });
  const [categoryIdx] = useState(0);
  const [fields, setFields] = useState({});
  const populateFields = (idx) => {
    const field = {};
    const { name, icon, ...rest } = categories[idx];
    Object.values(rest).forEach((val) => {
      if (val) {
        field[val] = '';
      }
    });
    console.log(categories);
    setFields(field);
    console.log(fields);
    console.log(field);
  };
  useEffect(() => {
    populateFields(categoryIdx);
  }, []);
  // useEffect(() => {
  //   populateFields(categoryIdx);
  // }, [categoryIdx]);

  const handleInfoChange = (propName) => (event) => {
    setInfo({ ...info, [propName]: event.target.value });
  };

  // const handleDetailsChange = (propName) => (event) => {
  //   setFields({ ...fields, [propName]: event.target.value});
  // };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>
        <TextField
          className={classes.margin}
          error={nameError.length > 0}
          helperText={nameError}
          id="name"
          label="Accout Name"
          variant="filled"
          value={info.name}
          fullWidth
          onChange={handleInfoChange('name')}
        />

        <TextField
          className={classes.margin}
          id="note"
          label="Note"
          variant="filled"
          value={info.note}
          multiline
          fullWidth
          onChange={handleInfoChange('note')}
        />
      </DialogContent>
    </Dialog>
  );
};
