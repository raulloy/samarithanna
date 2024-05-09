import { useEffect, useReducer } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// imported icons ===========>
import { BsArrowRightShort } from 'react-icons/bs';

import Top from '../Top Section/Top';
import Activity from '../Activity Section/Activity';
import { apiURL, getError } from '../../../utils';
import Product from '../Product/Product';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const Search = () => {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${apiURL}/api/products/search?page=${page}&query=${query}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}`;
  };

  return (
    <div className="mainContent">
      <Top />
      <div className="bottom flex">
        <div className="lisitingSection">
          <div className="heading flex">
            <h1>Products</h1>
            <button className="btn flex">
              See All <BsArrowRightShort className="icon" />
            </button>
          </div>

          <div className="secContainer flex">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              products.map((product) => (
                <Product product={product} key={product.slug} />
              ))
            )}
          </div>

          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link key={x + 1} to={getFilterUrl({ page: x + 1 })}>
                <button
                  className={Number(page) === x + 1 ? 'transparent-btn' : 'btn'}
                >
                  {x + 1}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <Activity />
      </div>
    </div>
  );
};

export default Search;
