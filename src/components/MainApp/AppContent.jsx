import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from './AppBar';
import DrawerContent from './DrawerContent/DrawerContent';
import PasswordCardList from './PasswordCardList';
import AccountDialog, { Mode } from './AccountDialog';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
    color: theme.palette.common.white,
    // backgroundColor: green[500],
    // '&:hover': {
    //   backgroundColor: green[600],
    // },
  },
}));

export default (props) => {
  const { window } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const appBar = (
    <AppBar className={classes.appBar}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap className={classes.title}>
        Responsive drawer
      </Typography>
    </AppBar>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerContent = (
    <DrawerContent marginClassName={classes.toolbar} />
  );

  const navigation = (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      {appBar}
      {navigation}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <PasswordCardList />
      </main>
      <Fab aria-label="Add" className={classes.fab} color="secondary" onClick={() => setDialogOpen(true)}>
        <AddIcon />
      </Fab>
      <AccountDialog {...{ dialogOpen, setDialogOpen }} mode={Mode.NEW_ACCOUNT} />
    </div>
  );
};
