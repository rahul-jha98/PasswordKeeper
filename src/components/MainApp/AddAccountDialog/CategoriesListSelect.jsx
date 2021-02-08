import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import GitHubIcon from '@material-ui/icons/MailOutlineTwoTone';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  startIcon: {
    minWidth: theme.spacing(4),
  },
  horizontalFlex: {
    display: 'flex',
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
          <div className={classes.horizontalFlex}>
            <ListItemIcon className={classes.startIcon}>
              <GitHubIcon />
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
              <Icon />
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};