import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import ApiHandlerContext from '../../provider/ApiHandlerContext';
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
  actions: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
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

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedCategoryIdx(0);
    setInfo({ name: '', note: '' });
  };

  const handleAction = () => {
    const details = { ...info };
    const category = categories[selectedCategoryIdx];
    details.category = category.name;

    Array.from({ length: 8 }, (_, i) => `field${i + 1}`).forEach((columnName) => {
      if (category[columnName]) {
        details[columnName] = fields[category[columnName]];
      }
    });
    database.insertPassword(details);
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      fullWidth
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="responsive-dialog-title">Add New Account Password</DialogTitle>
      <DialogContent className={classes.root}>

        <CategoriesListSelect
          className={classes.marginTop2}
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
          size="small"
          rows={3}
          onChange={handleInfoChange('note')}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAction} color="primary" variant="contained" autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
