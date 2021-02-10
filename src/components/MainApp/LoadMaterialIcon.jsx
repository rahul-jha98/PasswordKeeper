import React from 'react';
// import Icon from '@material-ui/core/Icon';

const Email = React.lazy(() => import('@material-ui/icons/EmailOutlined'));
const Public = React.lazy(() => import('@material-ui/icons/PublicOutlined'));
const Shop = React.lazy(() => import('@material-ui/icons/ShoppingCartOutlined'));
const Card = React.lazy(() => import('@material-ui/icons/CreditCardOutlined'));
export default (props) => {
  const mapping = {
    mail: Email,
    public: Public,
    shop: Shop,
    card: Card,
  };
  const Component = mapping[props.name];
  return (
    <React.Suspense fallback="loading">
      <Component {...props} />

    </React.Suspense>
  );
};
