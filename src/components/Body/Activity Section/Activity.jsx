import { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './activity.css';

// Imported Icons =========>
import { BsArrowRightShort } from 'react-icons/bs';

// Imported Images =========>
import chef from '../../Assets/chef.png';

import { Store } from '../../../Store';
import { apiURL, formatDate, getError, getOrdersReducer } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const Activity = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(getOrdersReducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${apiURL}/api/orders/mine/recent-orders`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
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
    <div className="activitySection">
      <div className="heading flex">
        <h1>Pedidos recientes</h1>
        <Link to="/orderhistory">
          <button className="btn flex">
            Ver todos
            <BsArrowRightShort className="icon" />
          </button>
        </Link>
      </div>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="secContainer grid">
          {orders.map((order) => (
            <div className="singleCustomer flex" key={order._id}>
              <img src={chef} alt="Customer Image" />
              <div className="customerDetails">
                <span className="name">
                  Total: ${order.totalPrice.toFixed(2)}
                </span>
                <small>
                  Fecha: {formatDate(order.createdAt.substring(0, 10))}
                </small>
                {/* <small> Productos: {order.orderItems.length} | </small>
                <small>
                  Artículos:{' '}
                  {order.orderItems.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                  )}
                </small> */}
              </div>
              {/* <div className="duration">2 min ago</div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
