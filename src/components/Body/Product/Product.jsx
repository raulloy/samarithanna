import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Buttons/buttons.css';

import { Store } from '../../../Store';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Product = (props) => {
  const { product } = props;

  const [quantity, setQuantity] = useState(1);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = () => {
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  const addReturnsHandler = async () => {
    ctxDispatch({
      type: 'RETURNS_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  const increaseQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="singleItem">
      <Link to={`/product/${product.slug}`} className="item-link">
        <div className="img-container">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-name">
          <h3>{product.name}</h3>
        </div>
      </Link>
      <div className="cart-buttons">
        <div className="buttons flex" style={{ marginTop: 10 }}>
          <button
            className="qty-btn"
            onClick={decreaseQuantity}
            disabled={quantity === 1}
          >
            <FaMinus />
          </button>{' '}
          <span>{quantity}</span>{' '}
          <button
            className="qty-btn"
            onClick={increaseQuantity}
            disabled={quantity === 100}
          >
            <FaPlus />
          </button>
        </div>
        <div className="buttons flex" style={{ marginTop: 10 }}>
          <button className="cart-btn" onClick={addToCartHandler}>
            Añadir
          </button>
          <button className="cart-btn" onClick={addReturnsHandler}>
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
