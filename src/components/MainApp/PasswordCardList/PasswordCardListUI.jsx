import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import LoadMaterialIcon from '../LoadMaterialIcon';
import AccountDialog, { Mode } from '../AccountDialog';

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
    borderRadius: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    justifyContent: 'left',
  },
}));

export default ({ passwordList, categoriesMappings }) => {
  const classes = useStyles();
  const [selectedIdx, setSelectedIdx] = React.useState(-1);
  const [dialogOpen, setDialogOpen] = React.useReducer((val) => !val, false);

  const handleItemClick = (selected_item_idx) => () => {
    setSelectedIdx(selected_item_idx);
    setDialogOpen(true);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {passwordList.map((password, idx) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={password.name}>
            <Card className={classes.card}>
              <CardActionArea className={classes.flex} onClick={handleItemClick(idx)}>
                <div className={classes.icon}>
                  <LoadMaterialIcon
                    name={categoriesMappings[password.category].icon}
                    style={{ fontSize: 32 }}
                  />
                </div>
                <Typography variant="h6" className={classes.text}>{password.name}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AccountDialog
        account={passwordList[selectedIdx]}
        categoriesMappings={categoriesMappings}
        {...{ dialogOpen, setDialogOpen }}
        mode={Mode.EXISTING_ACCOUNT}
      />
    </div>
  );
};
