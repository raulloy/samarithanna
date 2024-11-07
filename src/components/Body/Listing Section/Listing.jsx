import { useContext, useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import './listing.css';

import Product from '../Product/Product';
import { apiURL, getError, productsReducer } from '../../../utils';
import { Store } from '../../../Store';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const Listing = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(logger(productsReducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${apiURL}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="lisitingSection">
      <div className="heading flex">
        <h1>Productos</h1>
        <h1>{userInfo.isAdmitted}</h1>
        {/* <button className="btn flex">
          See All <BsArrowRightShort className="icon" />
        </button> */}
      </div>

      <div className="secContainer flex">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : !userInfo.isAdmitted ? (
          <MessageBox variant="info">{'Espera a ser admitido por un administrador, por favor cierra sesión'}</MessageBox>
        ) : (
          products.map((product) => <Product product={product} key={product.slug} />)
        )}
      </div>
    </div>
  );
};

export default Listing;
