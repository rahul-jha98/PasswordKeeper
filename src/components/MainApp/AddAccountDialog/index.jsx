import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import CategoriesListSelect from './CategoriesListSelect';
import CategoryFieldsInput from './CategoryFieldsInput';

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
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [fields, setFields] = useState({});

  const populateFields = (idx) => {
    const field = {};
    const { name, icon, ...rest } = categories[idx];
    Object.values(rest).forEach((val) => {
      if (val) {
        field[val] = '';
      }
    });
    setFields(field);
    console.log(fields);
  };
  useEffect(() => {
    populateFields(selectedCategoryIdx);
  }, [selectedCategoryIdx]);
  // useEffect(() => {
  //   populateFields(categoryIdx);
  // }, [categoryIdx]);

  const handleInfoChange = (propName) => (event) => {
    setInfo({ ...info, [propName]: event.target.value });
  };

  const handleFieldsChange = (propName) => (event) => {
    setFields({ ...fields, [propName]: event.target.value });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>
        Select the category of the account you wish to add and enter the reuisite
        details to store it in your Google Drive.

        <CategoriesListSelect
          className={classes.marginTop4}
          {...{ categories, selectedCategoryIdx, setSelectedCategoryIdx }}
        />
        <TextField
          className={`${classes.marginTop2} ${classes.marginBottom2}`}
          error={nameError.length > 0}
          helperText={nameError}
          id="name"
          label="Name"
          variant="outlined"
          value={info.name}
          fullWidth
          size="small"
          onChange={handleInfoChange('name')}
        />

        <Typography
          variant="body2"
          className={classes.marginTop4}
          color="textSecondary"
        >
          Details
        </Typography>
        <CategoryFieldsInput
          className={classes.marginTop2}
          category={categories[selectedCategoryIdx]}
          fields={fields}
          handleFieldsChange={handleFieldsChange}
        />
        <TextField
          className={classes.marginTop4}
          id="note"
          label="Note"
          variant="outlined"
          value={info.note}
          multiline
          fullWidth
          onChange={handleInfoChange('note')}
        />
      </DialogContent>
    </Dialog>
  );
};
