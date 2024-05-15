import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../../../Store';
import '../Buttons/buttons.css';

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  const addReturnsHandler = async () => {
    const existItem = state.returns.returnItems.find(
      (x) => x._id === product._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    ctxDispatch({
      type: 'RETURNS_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });
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
      <div className="buttons flex">
        <button className="cart-btn" onClick={addToCartHandler}>
          Añadir
        </button>
        <button className="cart-btn" onClick={addReturnsHandler}>
          Devolver
        </button>
      </div>
    </div>
  );
};

export default Product;
