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
  const { id: orderID } = params;
  const navigate = useNavigate();

  const [{ loading, error, order }, dispatch] = useReducer(getOrderReducer, {
    loading: true,
    order: {},
    error: '',
  });

  const [date, setDate] = useState('');
  const [emailSentDelivery, setEmailSentDelivery] = useState(false);
  const [emailSentOrderReady, setEmailSentOrderReady] = useState(false);
  const [emailSentOrderProcessed, setEmailSentOrderProcessed] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/orders/${orderID}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setDate(data.estimatedDelivery || '');
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
    if (!order._id || (order._id && order._id !== orderID)) {
      fetchOrder();
    } else if (!order.orderEmailSent && !emailSentOrderProcessed) {
      sendEmail();
      setEmailSentOrderProcessed(true);
    }
  }, [order, userInfo, orderID, emailSentOrderProcessed, navigate]);

  async function estimatedDeliveryHandler(e) {
    e.preventDefault();
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.put(
        `${apiURL}/api/orders/${orderID}/estimatedDelivery`,
        { estimatedDelivery: date },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      const { order: updatedOrder } = data;
      dispatch({ type: 'FETCH_SUCCESS', payload: updatedOrder });
      toast.success('Order estimated delivery is sent');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'FETCH_FAIL' });
    }
  }

  async function orderReadyHandler(e) {
    e.preventDefault();
    if (emailSentOrderReady) return;
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.put(
        `${apiURL}/api/orders/${order._id}/ready`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      const { order: updatedOrder } = data;
      dispatch({ type: 'FETCH_SUCCESS', payload: updatedOrder });
      toast.success('Order is ready');
      setEmailSentOrderReady(true);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'FETCH_FAIL' });
    }
  }

  async function deliverOrderHandler(e) {
    e.preventDefault();
    if (emailSentDelivery) return; // Prevent multiple emails
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.put(
        `${apiURL}/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      const { order: updatedOrder } = data;
      dispatch({ type: 'FETCH_SUCCESS', payload: updatedOrder });
      toast.success('Order is delivered');
      setEmailSentDelivery(true); // Set flag after email is sent
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'FETCH_FAIL' });
    }
  }

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
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Items</h3>
              <div className="list-group">
                {order.returnItems.map((item) => (
                  <div className="list-group-item" key={item.slug}>
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
                    <div>{order.orderItems.length}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Subtotal</div>
                    <div>${order.subtotal}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>IEPS</div>
                    <div>${order.ieps}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <strong>Order Total: </strong> <br />
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>

                {userInfo.isAdmin && !order.estimatedDelivery && (
                  <div className="list-group-item">
                    <div className="d-grid">
                      <form
                        className="form grid"
                        onSubmit={estimatedDeliveryHandler}
                      >
                        <div className="inputDiv">
                          <label htmlFor="date">Estimated delivery date</label>
                          <div className="input flex">
                            {/* <FaUserShield className="icon" /> */}
                            <input
                              type="date"
                              value={date}
                              className="datePicker"
                              required
                              id="date"
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <button type="submit" className="btn flex">
                          <span>Continue</span>
                          {/* <AiOutlineSwapRight className="icon" /> */}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {userInfo.isAdmin && !order.isReady && (
                  <div className="list-group-item">
                    <div className="d-grid">
                      <button
                        type="button"
                        onClick={orderReadyHandler}
                        className="btn flex"
                      >
                        <span>Order Ready</span>
                      </button>
                      {loading && <LoadingBox></LoadingBox>}
                    </div>
                  </div>
                )}

                {userInfo.isAdmin && !order.isDelivered && (
                  <div className="list-group-item">
                    <div className="d-grid">
                      <button
                        type="button"
                        onClick={deliverOrderHandler}
                        className="btn flex"
                      >
                        <span>Deliver Order</span>
                      </button>
                      {loading && <LoadingBox></LoadingBox>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
