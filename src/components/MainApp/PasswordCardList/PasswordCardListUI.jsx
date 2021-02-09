import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MaterialIcon from '../MaterialIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    padding: '18px 28px 13px 28px',
    background: '#8B8B8B',
    color: 'white',
    borderRadius: theme.spacing(1),
  },
  text: {
    padding: '18px 8px 13px 12px',
    color: theme.palette.text.secondary,
  },
  card: {
    display: 'flex',
    borderRadius: theme.spacing(1),
  },
}));

export default ({ passwordList, categoriesMappings }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {passwordList.map((password) => (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Card className={classes.card}>
              <div className={classes.icon}>
                <MaterialIcon
                  name={categoriesMappings[password.category].icon}
                  style={{ fontSize: 32 }}
                />

              </div>
              <Typography variant="h6" className={classes.text}>{password.name}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>

  );
};
