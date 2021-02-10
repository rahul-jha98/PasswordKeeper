import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import LoadMaterialIcon from '../../LoadMaterialIcon';

const useStyles = makeStyles((theme) => ({
  startIcon: {
    minWidth: theme.spacing(4),
  },
}));
export default ({
  categories, selectedCategoryIdx, setSelectedCategoryIdx, className,
}) => {
  const classes = useStyles();
  return (
    <FormControl variant="outlined" fullWidth className={className} size="small">
      <InputLabel id="category-label">Account Cateogry</InputLabel>
      <Select
        labelId="category-label"
        value={selectedCategoryIdx}
        renderValue={(selected) => (
          <div className="flex">
            <ListItemIcon className={classes.startIcon}>
              <LoadMaterialIcon name={categories[selectedCategoryIdx].icon} />
            </ListItemIcon>
            <Typography>{categories[selected].name}</Typography>
          </div>
        )}
        onChange={(event) => { setSelectedCategoryIdx(event.target.value); }}
        label="Account Category"
      >
        {categories.map((category, idx) => (
          <MenuItem value={idx}>
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
