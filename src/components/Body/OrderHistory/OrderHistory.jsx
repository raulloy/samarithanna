import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './orderhistory.css';

import { Store } from '../../../Store';
import { apiURL, formatDate, getError, getOrdersReducer } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const OrderHistory = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(getOrdersReducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`${apiURL}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="mainContent">
      <div>
        <Helmet>
          <title>Mis Pedidos</title>
        </Helmet>
        <h2>Mis Pedidos</h2> <br />
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estatus de pago</th>
                <th>Fecha estimada de entrega</th>
                <th>Estatus de entrega</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-5)}</td>
                  <td>{formatDate(order.createdAt.substring(0, 10))}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? formatDate(order.paidAt) : 'No'}</td>
                  <td>
                    {order.estimatedDelivery
                      ? formatDate(order.estimatedDelivery.substring(0, 10))
                      : 'No'}
                  </td>
                  <td>
                    {order.deliveredAt
                      ? formatDate(order.deliveredAt.substring(0, 10))
                      : 'No'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="transparent-btn"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
