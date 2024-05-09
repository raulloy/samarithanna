import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './productdetails.css';
import '../Buttons/buttons.css';

import { apiURL, getError, productReducer } from '../../../utils';
import Top from '../Top Section/Top';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';
import { Store } from '../../../Store';

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const [{ loading, error, product }, dispatch] = useReducer(productReducer, {
    product: [],
    loading: true,
    error: '',
  });

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${apiURL}/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="mainContent">
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Top />
      <div className="bottom flex">
        <div className="product-container">
          <div className="product-image">
            <img className="img-large" src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <div className="product-heading">
              <h1>{product.name}</h1>
            </div>

            <div className="product-price">Precio: ${product.price}</div>
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            {product.countInStock > 0 && (
              <button className="cart-btn" onClick={addToCartHandler}>
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
