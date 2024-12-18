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
  const {
    returns: { returnItems },
  } = state;

  cart.subtotal = cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  cart.ieps = cart.cartItems.reduce((a, c) => a + c.ieps * c.quantity, 0);
  cart.total = round2(cart.subtotal + cart.ieps);

  const placeOrderHandler = async () => {
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName: userInfo.name,
        address: 'Dirección de entrega',
      })
    );
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        `${apiURL}/api/orders`,
        {
          orderItems: cart.cartItems,
          returnItems: returnItems,
          purchaseOrder: cart.purchaseOrder,
          shippingAddress: {
            fullName: userInfo.name,
            address: 'Dirección de entrega',
          },
          subtotal: cart.subtotal,
          ieps: cart.ieps,
          totalPrice: cart.total,
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
      localStorage.removeItem('returnItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // <----------- Double Check Pending ------------>
  // useEffect(() => {
  //   if (!cart.shippingAddress.address) {
  //     navigate('/shipping');
  //   }
  // }, [cart.shippingAddress, navigate]);

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  return (
    <div className="mainContent">
      <Helmet>
        <title>Pedido</title>
      </Helmet>
      <h2>Vista Previa del Pedido</h2>

      <div className="order-container">
        <div className="content">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Envío</h3>
              <p className="card-text">
                <strong>Nombre:</strong> {userInfo.name} <br />
                <strong>Dirección: </strong> {userInfo?.shippingAddress} <br />
                {cart.purchaseOrder && (
                  <>
                    <strong>Orden de Compra:</strong> {cart.purchaseOrder}
                  </>
                )}
              </p>

              <Link to={'/shipping'}>Editar</Link>
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
              <h3 className="card-title">Productos</h3>
              <div className="list-group">
                {cart.cartItems.map((item) => (
                  <div className="list-group-item" key={item._id}>
                    <div className="item-row">
                      <div className="item-info">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-quantity">{item.quantity}</div>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={'/cart'}>Editar</Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Cambios</h3>
              <div className="list-group">
                {returnItems.map((item) => (
                  <div className="list-group-item" key={item._id}>
                    <div className="item-row">
                      <div className="item-info">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-quantity">{item.quantity}</div>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={'/cart'}>Editar</Link>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Resumen del Pedido</h3>
              <div className="list-group">
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Artículos</div>
                    <div>{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</div>
                    {/* <div>${cart.itemsPrice.toFixed(2)}</div> */}
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>Subtotal</div>
                    <div>${cart.subtotal.toFixed(2)}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <div>IEPS</div>
                    <div>${cart.ieps.toFixed(2)}</div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="summary-row">
                    <strong>Total</strong> <br />
                    <strong>${cart.total.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="d-grid">
                    <button type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>
                      Realizar pedido
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

{
  /* <div className="item-quantity">{item.quantity}</div> */
}

{
  /* <div className="item-price">${item.price}</div>
                      <div className="item-price">${item.ieps}</div> */
}
{
  /* <div className="item-price">
                        ${round2(item.quantity * (item.price + item.ieps))}
                      </div> */
}
