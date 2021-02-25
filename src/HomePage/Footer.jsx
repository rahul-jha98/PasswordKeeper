import React from 'react';

import Typography from '@material-ui/core/Typography';
import './Footer.css';

import FavoriteIcon from '@material-ui/icons/Favorite';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

export default () => (
  <div>
    <Typography color="textSecondary">
      Made with
      {' '}
      <FavoriteIcon fontSize="small" style={{ color: '#b71c1c', marginBottom: '-3px' }} />
      {' '}
      by
      {' '}
      <b>Rahul Jha</b>
    </Typography>

    <a href="https://github.com/rahul-jha98" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
      <GitHubIcon className="fa" color="action" fontSize="small" />
    </a>
    <a href="https://www.linkedin.com/in/rahul-jha-84a204178/" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
      <LinkedInIcon className="fa" color="action" fontSize="small" />
    </a>

  </div>
);
