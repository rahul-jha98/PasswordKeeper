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

const initialAccount = {
  name: '', icon: 'public', field1: '@-Website Link', field2: '$-Username', field3: '*-Password', field4: '', field5: '',
};
export default ({ open, toggleOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [fields, setFields] = React.useState(initialAccount);
  const [errorMessage] = React.useState('');

  const changeField = (prop) => (value) => {
    setFields({ ...fields, [prop]: value });
  };

  const closeDialog = () => {
    toggleOpen();
    setTimeout(() => {
      setFields(initialAccount);
    }, 300);
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
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <IconSelectDialog selectedIcon={fields.icon} setSelectedIcon={(e) => changeField('icon')(e.target.value)} />
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <FormControl error={Boolean(errorMessage)} fullWidth variant="outlined" size="small">
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
                />
              );
            })
          }
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button autoFocus onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={closeDialog} color="primary" variant="contained" autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
