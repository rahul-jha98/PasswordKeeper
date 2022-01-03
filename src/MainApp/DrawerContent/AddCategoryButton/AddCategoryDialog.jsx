import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import FieldItem from './FieldItem';
import IconSelectDialog from './IconSelectDialog';
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
  marginTop3: {
    marginTop: theme.spacing(3),
  },
  actions: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

// Setting the default categories
const initialCategoryFields = {
  name: '', icon: 'public', field1: '@-Website Link', field2: '$-Username', field3: '*-Password', field4: '', field5: '',
};
export default ({ open, toggleOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const { database, showToast } = React.useContext(ApiHandlerContext);

  const classes = useStyles();

  const [fields, setFields] = React.useState(initialCategoryFields);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [disabled, toggleDisabled] = React.useReducer((val) => !val, false);

  /**
   * Get setter for a particular prop in fields
   * @param {string} prop name of the property in the field that needs to be changed
   * @returns {function} that takes a value and set the specified
   *                      property in fields to that value
   */
  const changeField = (prop) => (value) => {
    setFields({ ...fields, [prop]: value });
  };

  /**
   * Handle closing the dialog
   */
  const closeDialog = () => {
    // First call toggle open to hide the dialog
    toggleOpen();

    // Remove all error from Dialog when its get close
    setErrorMessage('');
    // Wait for 300ms for close animation to finish and
    // then reset the fields to initialCategoryFields for
    // next time
    setTimeout(() => {
      setFields(initialCategoryFields);
    }, 300);
  };

  const addCategory = async () => {
    try {
      if (fields.name.length === 0) {
        setErrorMessage('Cannot be empty');
        return;
      } if (database.checkNameExist('categories', fields.name)) {
        setErrorMessage('Category with this name already exists');
        return;
      }
      toggleDisabled();
      setErrorMessage('');
      const values = ['', '', '', '', ''];
      let lastIdx = 0;

      for (let i = 0; i < 5; i += 1) {
        if (fields[`field${i + 1}`].length > 2) {
          values[lastIdx] = fields[`field${i + 1}`];
          lastIdx += 1;
        }
      }
      values.forEach((val, idx) => {
        fields[`field${idx + 1}`] = val;
      });
      await database.insertCategory(fields);
      closeDialog();
      showToast('Category added');
      toggleDisabled();
    } catch (err) {
      toggleDisabled();
      setErrorMessage('Network Error. Try again later');
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      fullWidth
      onClose={toggleOpen}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} alignItems="baseline">
          <Grid item>
            <IconSelectDialog selectedIcon={fields.icon} setSelectedIcon={(e) => changeField('icon')(e.target.value)} />
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <FormControl error={Boolean(errorMessage)} fullWidth variant="outlined" size="small" disabled={disabled}>
              <InputLabel htmlFor="name-field">Category Name</InputLabel>
              <OutlinedInput
                id="name-field"
                value={fields.name}
                onChange={(e) => { changeField('name')(e.target.value); }}
                label="Category Name"
                placeholder="Name of the category"
              />
              <FormHelperText id="helper">{errorMessage}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="body2" color="textSecondary" gutterBottom className={classes.marginTop3}>
          Set the name and type of the fields that the category has.
        </Typography>
        {
            Array.from({ length: 5 }, (_, i) => i + 1).map((idx) => {
              const columnName = `field${idx}`;
              let initialType = 0;
              if (idx === 1) initialType = 2;
              else if (idx === 3) initialType = 1;
              return (
                <FieldItem
                  label={`Field ${idx}`}
                  text={fields[columnName]}
                  setText={changeField(columnName)}
                  key={columnName}
                  className={classes.marginTop3}
                  initialType={initialType}
                  disabled={disabled}
                />
              );
            })
          }
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={closeDialog} color="primary" disabled={disabled}>
          Cancel
        </Button>
        <Button onClick={addCategory} color="primary" variant="contained" autoFocus disabled={disabled}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
