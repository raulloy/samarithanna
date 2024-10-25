import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminDeliveryRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo &&
    (userInfo.userType === 'admin' || userInfo.userType === 'delivery') ? (
    children
  ) : (
    <Navigate to="/signin" />
  );
}
