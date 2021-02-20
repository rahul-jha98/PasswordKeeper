import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
import LoadMaterialIcon, { iconList } from '../../LoadMaterialIcon';

const useStyles = makeStyles((theme) => ({
  startIcon: {
    minWidth: theme.spacing(2),
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 280,
  },
}));
export default ({
  selectedIcon, setSelectedIcon,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" fullWidth size="small">
      <InputLabel id="category-label">Icon</InputLabel>
      <Select
        labelId="category-label"
        value={selectedIcon}
        renderValue={(selected) => (
          <div style={{ display: 'flex' }}>
            <ListItemIcon className={classes.startIcon}>
              <LoadMaterialIcon name={selected} />
            </ListItemIcon>
            <Typography>{' '}</Typography>
          </div>
        )}
        onChange={setSelectedIcon}
        label="Icon"
        MenuProps={{
          classes: {
            list: classes.list,
          },
        }}
      >
        {iconList.map((icon) => (
          <MenuItem value={icon}>
            <ListItemIcon className={classes.startIcon}>
              <LoadMaterialIcon name={icon} />
            </ListItemIcon>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
