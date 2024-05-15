import { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './top.css';

// Imported Icons ===========>
import { BiSearchAlt } from 'react-icons/bi';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { BsArrowRightShort } from 'react-icons/bs';
import { BsQuestionCircle } from 'react-icons/bs';

// Imported Image =========>
import img from '../../Assets/chef.png';
import arab_bakery from '../../Assets/pita-arab-cuisine-bakery.png';
import video from '../../Assets/video.mp4';

import { Store } from '../../../Store';
import { apiURL, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Top = () => {
  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${apiURL}/api/orders/mine/stats`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.log(err);
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          <h1>Bienvenido a Samarithanna.</h1>
          <p>Hola {userInfo.name}, ¡qué bueno verte de nuevo!</p>
        </div>

        <div className="searchBar flex">
          <form className="d-flex me-auto" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Jocoque, Pan Árabe..."
              id="searchBox"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" id="button-search" className="search-btn">
              <BiSearchAlt className="icon" />
            </button>
          </form>
        </div>

        <div className="adminDiv flex">
          <div className="icon-wrapper">
            <Link to="/cart">
              <MdOutlineShoppingCart className="icon" />
            </Link>
            <span className="cart-quantity">
              {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          </div>
          <div className="adminImage">
            <img src={img} alt="Admin Image" />
          </div>
        </div>
      </div>

      <div className="cardSection flex">
        <div className="rightCard flex">
          <h1>Productos Árabes Selectos</h1>
          <p>
            Bajo contenido en grasas saturadas. <br />
            Buena fuente de fibra.
          </p>

          <div className="buttons flex">
            {/* <button className="btn">Explore More</button>
            <button className="btn transparent">Top Sellers</button> */}
          </div>

          <div className="videoDiv">
            <video src={video} autoPlay loop muted></video>
          </div>
        </div>

        <div className="leftCard flex">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="main flex">
              <div className="textDiv">
                <h1>Mis pedidos</h1>

                <div className="flex">
                  <span>
                    Hoy <br />{' '}
                    <small>
                      {summary.todayOrdersCount === 1
                        ? summary.todayOrdersCount + ' Pedido'
                        : summary.todayOrdersCount + ' Pedidos'}
                    </small>
                  </span>
                  <span>
                    Este mes <br />{' '}
                    <small>
                      {summary.monthOrdersCount === 1
                        ? summary.monthOrdersCount + ' Pedido'
                        : summary.monthOrdersCount + ' Pedidos'}
                    </small>
                  </span>
                </div>

                <Link to="/orderhistory">
                  <span className="flex link">
                    Ir a mis pedidos <BsArrowRightShort className="icon" />
                  </span>
                </Link>
              </div>

              <div className="imgDiv">
                <img src={arab_bakery} alt="Image Name" />
              </div>
            </div>
          )}

          {/* We shall use this card later .... */}
          <div className="sideBarCard">
            <BsQuestionCircle className="icon" />
            <div className="cardContent">
              <div className="circle1"></div>
              <div className="circle2"></div>

              <h3>¿Necesitas ayuda?</h3>
              <p>
                ¿Necesitas ayuda con tu pedido? Ponte en contacto con nosotros.
              </p>

              <button className="btn">Contactar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
