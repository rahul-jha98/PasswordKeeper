import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default ({ aboutOpen, toggleAboutOpen }) => (
  <Dialog fullScreen open={aboutOpen} onClose={toggleAboutOpen} TransitionComponent={Transition}>
    <Toolbar>
      <Typography variant="h5" style={{ textAlign: 'center', flexGrow: 1, marginLeft: 48 }}>
        <b>About</b>
      </Typography>
      <IconButton edge="end" color="inherit" onClick={toggleAboutOpen} aria-label="close">
        <CloseIcon />
      </IconButton>
    </Toolbar>
    <div className="container" />
  </Dialog>
);
