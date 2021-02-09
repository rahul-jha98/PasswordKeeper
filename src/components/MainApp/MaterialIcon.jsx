import React from 'react';
// import Icon from '@material-ui/core/Icon';

const Email = React.lazy(() => import('@material-ui/icons/EmailOutlined'));
const Public = React.lazy(() => import('@material-ui/icons/PublicOutlined'));

export default (props) => {
  const mapping = {
    mail: Email,
    public: Public,
  };
  const Component = mapping[props.name];
  return (
    <React.Suspense fallback="loading">
      <Component {...props} />

    </React.Suspense>
  );
};
