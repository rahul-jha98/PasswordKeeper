import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import LoadMaterialIcon from '../../LoadMaterialIcon';

const useStyles = makeStyles((theme) => ({
  startIcon: {
    minWidth: theme.spacing(4),
  },
}));
export default ({
  text, onTextChange, className, categoriesMappings, disabled,
}) => {
  const classes = useStyles();
  return (
    <FormControl variant="outlined" fullWidth className={className} disabled={disabled} size="small">
      <InputLabel id="category-label">Account Cateogry</InputLabel>
      <Select
        labelId="category-label"
        value={text}
        renderValue={(selected) => (
          <div className="flex">
            <ListItemIcon className={classes.startIcon}>
              <LoadMaterialIcon name={categoriesMappings[selected].icon} />
            </ListItemIcon>
            <Typography>{categoriesMappings[selected].name}</Typography>
          </div>
        )}
        onChange={onTextChange}
        label="Account Category"
      >
        {Object.values(categoriesMappings).map((category) => (
          <MenuItem value={category.name}>
            <ListItemIcon>
              <LoadMaterialIcon name={category.icon} />
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
