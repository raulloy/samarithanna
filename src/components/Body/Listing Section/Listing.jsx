import { useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import './listing.css';

// imported icons ===========>
import { BsArrowRightShort } from 'react-icons/bs';

// imported Images ===========>
import user1 from '../../Assets/user (1).png';
import user2 from '../../Assets/user (2).png';
import user3 from '../../Assets/user (3).png';
import user4 from '../../Assets/user (4).png';

import Product from '../Product/Product';
import { apiURL, getError, productsReducer } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const Listing = () => {
  const [{ loading, error, products }, dispatch] = useReducer(
    logger(productsReducer),
    {
      products: [],
      loading: true,
      error: '',
    }
  );

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
  }, []);

  return (
    <div className="lisitingSection">
      <div className="heading flex">
        <h1>Productos</h1>
        {/* <button className="btn flex">
          See All <BsArrowRightShort className="icon" />
        </button> */}
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

      {/* <div className="sellers flex">
        <div className="topSellers">
          <div className="heading flex">
            <h3>Top Sellers</h3>
            <button className="btn flex">
              See All <BsArrowRightShort className="icon" />
            </button>
          </div>

          <div className="card flex">
            <div className="users">
              <img src={user1} alt="User Image" />
              <img src={user2} alt="User Image" />
              <img src={user3} alt="User Image" />
              <img src={user4} alt="User Image" />
            </div>
            <div className="cardText">
              <span>
                14.556 Plant sold <br />
                <small>
                  21 Sellers <span className="date">7 Days</span>
                </small>
              </span>
            </div>
          </div>
        </div>

        <div className="featuredSellers">
          <div className="heading flex">
            <h3>Featured Sellers</h3>
            <button className="btn flex">
              See All <BsArrowRightShort className="icon" />
            </button>
          </div>

          <div className="card flex">
            <div className="users">
              <img src={user3} alt="User Image" />
              <img src={user1} alt="User Image" />
              <img src={user4} alt="User Image" />
              <img src={user2} alt="User Image" />
            </div>
            <div className="cardText">
              <span>
                28,556 Plant sold <br />
                <small>
                  26 Sellers <span className="date">31 days</span>
                </small>
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Listing;
