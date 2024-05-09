import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './placeorder.css';

import { Store } from '../../../Store';
import { apiURL, getError, orderReducer, round2 } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(orderReducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.totalPrice = cart.itemsPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        `${apiURL}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    }
  }, [cart.shippingAddress, navigate]);

  return (
    <div className="mainContent">
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1>Preview Order</h1>

      <div className="order-container">
        <div className="content">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Shipping</h3>
              <p className="card-text">
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address}
              </p>
              <Link to={'/shipping'}>Edit</Link>
            </div>
          </div>

          {/* <div className="card">
            <div className="card-body">
              <h3 className="card-title">Payment</h3>
              <p className="card-text">
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
              <a href="/payment">Edit</a>
            </div>
          </div> */}

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Items</h3>
              <div className="list-group">
                {cart.cartItems.map((item) => (
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
                    <div>${cart.itemsPrice.toFixed(2)}</div>
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
                    <strong>Order Total</strong>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="d-grid">
                    <button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
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

export default PlaceOrder;
