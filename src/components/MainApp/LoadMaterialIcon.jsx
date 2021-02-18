import React from 'react';
// import Icon from '@material-ui/core/Icon';

const Email = React.lazy(() => import('@material-ui/icons/EmailOutlined'));
const Public = React.lazy(() => import('@material-ui/icons/PublicOutlined'));
const Shop = React.lazy(() => import('@material-ui/icons/ShoppingCartOutlined'));
const Card = React.lazy(() => import('@material-ui/icons/CreditCardOutlined'));
const Link = React.lazy(() => import('@material-ui/icons/LinkOutlined'));
const Wifi = React.lazy(() => import('@material-ui/icons/WifiLockOutlined'));
const Bank = React.lazy(() => import('@material-ui/icons/AccountBalanceOutlined'));
const Book = React.lazy(() => import('@material-ui/icons/BookOutlined'));
const Pet = React.lazy(() => import('@material-ui/icons/PetsOutlined'));
const Cloud = React.lazy(() => import('@material-ui/icons/CloudOutlined'));
const Fitness = React.lazy(() => import('@material-ui/icons/FitnessCenterOutlined'));
const Work = React.lazy(() => import('@material-ui/icons/WorkOutlineOutlined'));
const School = React.lazy(() => import('@material-ui/icons/SchoolOutlined'));

export const iconList = [
  'public', 'mail', 'shop', 'card',
  'link', 'wifi', 'bank', 'book',
  'pet', 'cloud', 'fitness', 'work',
  'school'];
const mappings = {
  mail: Email,
  public: Public,
  shop: Shop,
  card: Card,
  link: Link,
  wifi: Wifi,
  bank: Bank,
  book: Book,
  pet: Pet,
  cloud: Cloud,
  fitness: Fitness,
  work: Work,
  school: School,
};
export default (props) => {
  const Component = mappings[props.name];
  return (
    <React.Suspense fallback="loading">
      <Component {...props} />

    </React.Suspense>
  );
};
