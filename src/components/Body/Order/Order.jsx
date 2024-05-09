import { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Store } from '../../../Store';
import { apiURL, getError, getOrderReducer } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const Order = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order }, dispatch] = useReducer(getOrderReducer, {
    loading: true,
    order: {},
    error: '',
  });

  const [emailSentDelivery, setEmailSentDelivery] = useState(false);
  const [emailSentOrderReady, setEmailSentOrderReady] = useState(false);
  const [emailSentOrderProcessed, setEmailSentOrderProcessed] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    const sendEmail = async () => {
      try {
        await axios.put(
          `${apiURL}/api/orders/${order._id}/order-processed`,
          {},
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        console.log('Email Sent');
        toast.success('Your order has been received');
      } catch (error) {
        console.error('Failed to send email:', error);
        toast.error('Failed to send order confirmation email');
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    } else if (!order.orderEmailSent && !emailSentOrderProcessed) {
      sendEmail();
      setEmailSentOrderProcessed(true);
    }
    // console.log('order.orderEmailSent: ', order.orderEmailSent);
    // console.log('emailSentOrderProcessed', emailSentOrderProcessed);
  }, [order, userInfo, orderId, emailSentOrderProcessed, navigate]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="mainContent">
      <Helmet>
        <title>Order</title>
      </Helmet>
      <h1>Order S-{order._id.slice(-5)}</h1>

      <div className="order-container">
        <div className="content">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Shipping</h3>
              <p className="card-text">
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              {order.isDelivered ? (
                <MessageBox variant="success">Delivered</MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Payment</h3>
              <p className="card-text">
                <strong>Method: </strong>
                {'Payment Method'}
              </p>
              {order.isPaid ? (
                <MessageBox variant="success">Paid</MessageBox>
              ) : (
                <MessageBox variant="danger">Not paid</MessageBox>
              )}
              {loading && <LoadingBox></LoadingBox>}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Items</h3>
              <div className="list-group">
                {order.orderItems.map((item) => (
                  <div className="list-group-item" key={item._id}>
                    <div className="item-row">
                      <div className="item-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-image"
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="item-quantity">{item.quantity}</div>
                      <div className="item-price">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={'/cart'}>Edit</Link>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Order Summary</h3>
              <div className="list-group">
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Items</div>
                    <div>${order.itemsPrice.toFixed(2)}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Shipping</div>
                    <div>${0}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Tax</div>
                    <div>${0}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <strong>Order Total: </strong>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="d-grid">
                    <button
                      type="button"
                      //   onClick={placeOrderHandler}
                      //   disabled={order.cartItems.length === 0}
                    >
                      Actions
                    </button>
                    {loading && <LoadingBox></LoadingBox>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
