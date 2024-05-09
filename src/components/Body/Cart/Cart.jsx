import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './cart.css';

import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { Store } from '../../../Store';
import MessageBox from '../MessageBox/MessageBox';

const Cart = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    returns: { returnItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const updateReturnsHandler = async (item, quantity) => {
    ctxDispatch({
      type: 'RETURNS_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const removeReturnsItemHandler = (item) => {
    ctxDispatch({ type: 'RETURNS_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div className="mainContent">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h1>Shopping Cart</h1>
      <div className="shopping-cart">
        {cartItems.length === 0 ? (
          <div></div>
        ) : (
          <div className="column-labels">
            <label className="cart-product-image">Image</label>
            <label className="cart-product-details">Product</label>
            <label className="cart-product-price">Price</label>
            <label className="cart-product-details">Quantity</label>
            <label className="product-removal">Remove</label>
            <label className="product-line-price">Total</label>
          </div>
        )}

        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="product" key={item.slug}>
                <div className="cart-product-image">
                  <img src={item.image} />
                </div>
                <div className="cart-product-details">
                  <div className="product-title">{item.name}</div>
                  {/* <p className="product-description">{item.description}</p> */}
                </div>
                <div className="cart-product-price">{item.price}</div>
                <div className="cart-product-details">
                  <button
                    className="qty-btn"
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <FaMinus />
                  </button>{' '}
                  <span>{item.quantity}</span>{' '}
                  <button
                    className="qty-btn"
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="product-removal">
                  <button
                    className="remove-product"
                    onClick={() => removeItemHandler(item)}
                  >
                    <MdDelete />
                  </button>
                </div>
                <div className="product-line-price">
                  {item.price * item.quantity}
                </div>
              </div>
            ))}
            <h3 style={{ padding: 25 }}>Returns</h3>
            {returnItems.map((item) => (
              <div className="product" key={item.slug}>
                <div className="cart-product-image">
                  <img src={item.image} />
                </div>
                <div className="cart-product-details">
                  <div className="product-title">{item.name}</div>
                </div>
                <div className="cart-return-product-price"></div>
                <div className="cart-product-details">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateReturnsHandler(item, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                  >
                    <FaMinus />
                  </button>{' '}
                  <span>{item.quantity}</span>{' '}
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateReturnsHandler(item, item.quantity + 1)
                    }
                    disabled={item.quantity === item.countInStock}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="product-removal">
                  <button
                    className="remove-product"
                    onClick={() => removeReturnsItemHandler(item)}
                  >
                    <MdDelete />
                  </button>
                </div>
                <div></div>
              </div>
            ))}
          </>
        )}

        {cartItems.length === 0 ? (
          <div></div>
        ) : (
          <div className="totals">
            <div className="totals-item">
              <label>Subtotal</label>
              <div className="totals-value" id="cart-subtotal">
                {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </div>
            </div>
            <div className="totals-item">
              <label>Tax (16%)</label>
              <div className="totals-value" id="cart-tax">
                3.60
              </div>
            </div>
            <div className="totals-item">
              <label>Shipping</label>
              <div className="totals-value" id="cart-shipping">
                15.00
              </div>
            </div>
            <div className="totals-item totals-item-total">
              <label>Grand Total</label>
              <div className="totals-value" id="cart-total">
                90.57
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div></div>
        ) : (
          <button
            className="checkout"
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
