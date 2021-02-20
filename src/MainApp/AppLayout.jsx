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
import DrawerContent from './DrawerContent';
import CategoryItems from './CategoryItems';
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
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
    color: theme.palette.common.white,
  },
}));

/**
 * This component lays out the basic layout of the main app.
 * i.e. AppBar, Drawer, and main content area.
 */
export default (props) => {
  const { window } = props;
  const classes = useStyles();
  // mobileOpen is used to control the temporary drawer in mobile mode
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // dialogOpen is state to control the open state of Add Account Dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Index of the category that is selected. -1 means All Accounts
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(-1);

  // Custom App Bar for the application
  const appBar = (
    <AppBar className={classes.appBar}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => { setMobileOpen(true); }}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap className={classes.title}>
        PasswordManager
      </Typography>
    </AppBar>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  // Content which will be rendered inside the drawer
  const drawerContent = (
    <DrawerContent
      marginClassName={classes.toolbar}
      selectedCategoryIndex={selectedCategoryIndex}
      setSelectedCategoryIndex={setSelectedCategoryIndex}
      handleDrawerToggle={() => { setMobileOpen(false); }}
    />
  );

  // Drawer of the app. Both temporary and permament drawer is
  // added and one is hidden using css based on screen width
  const navigation = (
    <nav className={classes.drawer} aria-label="categories">
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => { setMobileOpen(false); }}
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
        <CategoryItems
          selectedCategoryIndex={selectedCategoryIndex}
          setSelectedCategoryIndex={setSelectedCategoryIndex}
        />
      </main>
      {/* FAB to add a new account along with the account
        * dialog with mode set to new account */}
      <Fab aria-label="Add" className={classes.fab} color="secondary" onClick={() => setDialogOpen(true)}>
        <AddIcon />
      </Fab>
      <AccountDialog {...{ dialogOpen, setDialogOpen }} mode={Mode.NEW_ACCOUNT} />
    </div>
  );
};
