import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Store } from '../../../Store';
import { apiURL, formatDate, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderList = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="mainContent">
      <Helmet>
        <title>Todos los Pedidos</title>
      </Helmet>
      <h2>Todos los Pedidos</h2> <br />
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              {/* <th>Estatus de pago</th> */}
              <th>Fecha estimada de entrega</th>
              <th>Estatus de entrega</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-5)}</td>
                <td>{order.shippingAddress.fullName}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                {/* <td>{order.isPaid ? formatDate(order.paidAt) : 'No'}</td> */}
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
                    Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
